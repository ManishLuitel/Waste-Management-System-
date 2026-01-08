from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from accounts.authentication import ExpiringTokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from .models import MonthlyPayment, Invoice, PaymentSettings
from waste.permissions import IsAdminUser
import hashlib
import hmac
import base64
import uuid
from datetime import datetime

class PaymentViewSet(viewsets.ViewSet):
    authentication_classes = [ExpiringTokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def payment_settings(self, request):
        payment_settings = PaymentSettings.objects.first()
        if not payment_settings:
            payment_settings = PaymentSettings.objects.create()
        return Response({
            'monthly_fee': str(payment_settings.monthly_fee),
            'per_kg_rate': str(payment_settings.per_kg_rate)
        })
    
    @action(detail=False, methods=['post'])
    def create_monthly_payment(self, request):
        user = request.user
        month = request.data.get('month')
        
        payment_settings = PaymentSettings.objects.first()
        if not payment_settings:
            payment_settings = PaymentSettings.objects.create()
        
        transaction_uuid = str(uuid.uuid4())
        
        payment = MonthlyPayment.objects.create(
            user=user,
            amount=payment_settings.monthly_fee,
            month=month,
            transaction_uuid=transaction_uuid
        )
        
        # Generate eSewa signature
        signature = self.generate_signature(
            str(payment_settings.monthly_fee), transaction_uuid, "EPAYTEST"
        )
        
        return Response({
            'payment_id': payment.id,
            'amount': str(payment_settings.monthly_fee),
            'transaction_uuid': transaction_uuid,
            'signature': signature,
            'product_code': 'EPAYTEST'
        })
    
    @action(detail=False, methods=['post'])
    def create_invoice_payment(self, request):
        invoice_id = request.data.get('invoice_id')
        
        try:
            # Filter by user's email since SpecialRequest uses email field
            user_email = request.user.email
            invoice = Invoice.objects.get(id=invoice_id, special_request__email=user_email)
            
            # Check if invoice is already paid or processing
            if invoice.status == 'paid':
                return Response({'error': 'Invoice is already paid'}, status=400)
            elif invoice.status == 'processing':
                return Response({'error': 'Payment is done, manual verification in progress'}, status=400)
                
        except Invoice.DoesNotExist:
            return Response({'error': 'Invoice not found'}, status=404)
        
        # Generate new transaction UUID for payment attempt
        if not invoice.transaction_uuid:
            invoice.transaction_uuid = str(uuid.uuid4())
            invoice.save()
        
        signature = self.generate_signature(
            str(invoice.amount), invoice.transaction_uuid, "EPAYTEST"
        )
        
        return Response({
            'invoice_id': invoice.id,
            'amount': str(invoice.amount),
            'transaction_uuid': invoice.transaction_uuid,
            'signature': signature,
            'product_code': 'EPAYTEST'
        })
    
    @action(detail=False, methods=['post'])
    def update_invoice_status(self, request):
        invoice_id = request.data.get('invoice_id')
        status = request.data.get('status', 'processing')
        
        try:
            user_email = request.user.email
            invoice = Invoice.objects.get(id=invoice_id, special_request__email=user_email)
            invoice.status = status
            invoice.save()
            return Response({'message': 'Invoice status updated'})
        except Invoice.DoesNotExist:
            return Response({'error': 'Invoice not found'}, status=404)
    
    @action(detail=False, methods=['get'])
    def payment_history(self, request):
        payments = MonthlyPayment.objects.filter(user=request.user).order_by('-created_at')
        # Filter invoices by user email since SpecialRequest uses email field
        user_email = request.user.email
        invoices = Invoice.objects.filter(special_request__email=user_email).order_by('-created_at')
        
        payment_data = [{
            'id': p.id,
            'type': 'monthly',
            'amount': str(p.amount),
            'month': p.month,
            'status': p.status,
            'created_at': p.created_at
        } for p in payments]
        
        invoice_data = [{
            'id': i.id,
            'type': 'invoice',
            'amount': str(i.amount),
            'weight_kg': str(i.weight_kg),
            'status': i.status,
            'created_at': i.created_at,
            'special_request_name': i.special_request.name,
            'special_request_address': i.special_request.address
        } for i in invoices]
        
        return Response({
            'payments': payment_data,
            'invoices': invoice_data
        })
    
    @action(detail=False, methods=['get'])
    def user_payment_stats(self, request):
        from django.db.models import Sum
        from datetime import datetime, timedelta
        
        user_email = request.user.email
        
        # Calculate user totals
        monthly_total = MonthlyPayment.objects.filter(user=request.user, status='completed').aggregate(Sum('amount'))['amount__sum'] or 0
        invoice_total = Invoice.objects.filter(special_request__email=user_email, status='paid').aggregate(Sum('amount'))['amount__sum'] or 0
        pending_total = MonthlyPayment.objects.filter(user=request.user, status='pending').aggregate(Sum('amount'))['amount__sum'] or 0
        pending_invoice_total = Invoice.objects.filter(special_request__email=user_email, status='pending').aggregate(Sum('amount'))['amount__sum'] or 0
        
        total_spent = monthly_total + invoice_total
        pending_amount = pending_total + (pending_invoice_total or 0)
        
        # Count payments
        monthly_count = MonthlyPayment.objects.filter(user=request.user, status='completed').count()
        invoice_count = Invoice.objects.filter(special_request__email=user_email, status='paid').count()
        
        # Monthly data for last 6 months
        monthly_data = []
        for i in range(6):
            date = datetime.now() - timedelta(days=30*i)
            month_name = date.strftime('%b %Y')
            month_amount = MonthlyPayment.objects.filter(
                user=request.user,
                month__year=date.year, 
                month__month=date.month,
                status='completed'
            ).aggregate(Sum('amount'))['amount__sum'] or 0
            monthly_data.append({'month': month_name, 'amount': float(month_amount)})
        
        # Payment types
        payment_types = [
            {'name': 'Monthly', 'value': float(monthly_total)},
            {'name': 'Invoices', 'value': float(invoice_total)},
            {'name': 'Pending', 'value': float(pending_amount)}
        ]
        
        return Response({
            'totalSpent': float(total_spent),
            'monthlyPayments': monthly_count,
            'invoicePayments': invoice_count,
            'pendingAmount': float(pending_amount),
            'monthlyData': monthly_data[::-1],
            'paymentTypes': payment_types
        })

    def generate_signature(self, total_amount, transaction_uuid, product_code):
        secret_key = "8gBm/:&EnhH.1/q"
        message = f"total_amount={total_amount},transaction_uuid={transaction_uuid},product_code={product_code}"
        
        signature = hmac.new(
            secret_key.encode('utf-8'),
            message.encode('utf-8'),
            hashlib.sha256
        ).digest()
        
        return base64.b64encode(signature).decode('utf-8')

class AdminPaymentViewSet(viewsets.ViewSet):
    authentication_classes = [ExpiringTokenAuthentication]
    permission_classes = [IsAdminUser]
    
    @action(detail=False, methods=['get', 'post'])
    def payment_settings(self, request):
        if request.method == 'GET':
            payment_settings = PaymentSettings.objects.first()
            if not payment_settings:
                payment_settings = PaymentSettings.objects.create()
            return Response({
                'monthly_fee': str(payment_settings.monthly_fee),
                'per_kg_rate': str(payment_settings.per_kg_rate)
            })
        
        elif request.method == 'POST':
            payment_settings = PaymentSettings.objects.first()
            if not payment_settings:
                payment_settings = PaymentSettings.objects.create()
            
            monthly_fee = request.data.get('monthly_fee')
            per_kg_rate = request.data.get('per_kg_rate')
            
            if monthly_fee and monthly_fee != '':
                payment_settings.monthly_fee = monthly_fee
            if per_kg_rate and per_kg_rate != '':
                payment_settings.per_kg_rate = per_kg_rate
                
            payment_settings.save()
            
            return Response({'message': 'Settings updated successfully'})
    
    @action(detail=False, methods=['get'])
    def all_payments(self, request):
        payments = MonthlyPayment.objects.all().order_by('-created_at')
        invoices = Invoice.objects.all().order_by('-created_at')
        
        payment_data = [{
            'id': p.id,
            'user_email': p.user.email,
            'amount': str(p.amount),
            'month': p.month,
            'status': p.status,
            'created_at': p.created_at
        } for p in payments]
        
        invoice_data = [{
            'id': i.id,
            'user_email': i.special_request.email,
            'user_name': i.special_request.name,
            'amount': str(i.amount),
            'weight_kg': str(i.weight_kg),
            'status': i.status,
            'created_at': i.created_at,
            'special_request_id': i.special_request.id
        } for i in invoices]
        
        return Response({
            'payments': payment_data,
            'invoices': invoice_data
        })
    
    @action(detail=False, methods=['post'])
    def update_status(self, request):
        payment_id = request.data.get('payment_id')
        status = request.data.get('status')
        payment_type = request.data.get('payment_type')
        
        try:
            if payment_type == 'monthly':
                payment = MonthlyPayment.objects.get(id=payment_id)
                payment.status = status
                payment.save()
            elif payment_type == 'invoice':
                invoice = Invoice.objects.get(id=payment_id)
                invoice.status = status
                invoice.save()
            
            return Response({'message': 'Status updated successfully'})
        except (MonthlyPayment.DoesNotExist, Invoice.DoesNotExist):
            return Response({'error': 'Payment not found'}, status=404)
    
    @action(detail=False, methods=['get'])
    def payment_stats(self, request):
        from django.db.models import Sum, Count
        from datetime import datetime, timedelta
        
        # Calculate totals
        monthly_total = MonthlyPayment.objects.filter(status='completed').aggregate(Sum('amount'))['amount__sum'] or 0
        invoice_total = Invoice.objects.filter(status='paid').aggregate(Sum('amount'))['amount__sum'] or 0
        total_revenue = monthly_total + invoice_total
        
        # Count payments
        monthly_count = MonthlyPayment.objects.filter(status='completed').count()
        invoice_count = Invoice.objects.filter(status='paid').count()
        pending_count = MonthlyPayment.objects.filter(status='pending').count() + Invoice.objects.filter(status='pending').count()
        
        # Monthly data for last 6 months
        monthly_data = []
        for i in range(6):
            date = datetime.now() - timedelta(days=30*i)
            month_name = date.strftime('%b %Y')
            month_revenue = MonthlyPayment.objects.filter(
                month__year=date.year, 
                month__month=date.month,
                status='completed'
            ).aggregate(Sum('amount'))['amount__sum'] or 0
            monthly_data.append({'month': month_name, 'revenue': float(month_revenue)})
        
        # Status distribution
        completed_payments = MonthlyPayment.objects.filter(status='completed').count()
        paid_invoices = Invoice.objects.filter(status='paid').count()
        pending_payments = MonthlyPayment.objects.filter(status='pending').count()
        pending_invoices = Invoice.objects.filter(status='pending').count()
        
        status_data = [
            {'name': 'Completed', 'value': completed_payments + paid_invoices},
            {'name': 'Pending', 'value': pending_payments + pending_invoices},
            {'name': 'Failed', 'value': MonthlyPayment.objects.filter(status='failed').count()}
        ]
        
        return Response({
            'totalRevenue': float(total_revenue),
            'monthlyPayments': monthly_count,
            'invoicePayments': invoice_count,
            'pendingPayments': pending_count,
            'monthlyData': monthly_data[::-1],  # Reverse to show oldest first
            'statusData': status_data
        })
    
    @action(detail=False, methods=['post'])
    def create_invoice(self, request):
        special_request_id = request.data.get('special_request_id')
        weight_kg = request.data.get('weight_kg')
        
        payment_settings = PaymentSettings.objects.first()
        if not payment_settings:
            payment_settings = PaymentSettings.objects.create()
        
        try:
            from waste.models import SpecialRequest
            special_request = SpecialRequest.objects.get(id=special_request_id)
            
            # Check if invoice already exists
            existing_invoice = Invoice.objects.filter(special_request=special_request).first()
            if existing_invoice:
                # Update existing invoice
                existing_invoice.weight_kg = weight_kg
                existing_invoice.amount = float(weight_kg) * float(payment_settings.per_kg_rate)
                existing_invoice.per_kg_rate = payment_settings.per_kg_rate
                existing_invoice.transaction_uuid = str(uuid.uuid4())  # Generate new UUID
                existing_invoice.save()
                invoice = existing_invoice
            else:
                # Create new invoice
                amount = float(weight_kg) * float(payment_settings.per_kg_rate)
                invoice = Invoice.objects.create(
                    special_request=special_request,
                    amount=amount,
                    weight_kg=weight_kg,
                    per_kg_rate=payment_settings.per_kg_rate
                )
        except SpecialRequest.DoesNotExist:
            return Response({'error': 'Special request not found'}, status=404)
        
        return Response({
            'invoice_id': invoice.id,
            'amount': str(invoice.amount),
            'message': 'Invoice created/updated successfully'
        })
    
    @action(detail=False, methods=['delete'])
    def cancel_invoice(self, request):
        invoice_id = request.data.get('invoice_id')
        
        try:
            invoice = Invoice.objects.get(id=invoice_id, status='pending')
            invoice.delete()
            return Response({'message': 'Invoice cancelled successfully'})
        except Invoice.DoesNotExist:
            return Response({'error': 'Invoice not found or already paid'}, status=404)
        special_request_id = request.data.get('special_request_id')
        weight_kg = request.data.get('weight_kg')
        
        payment_settings = PaymentSettings.objects.first()
        if not payment_settings:
            payment_settings = PaymentSettings.objects.create()
        
        try:
            from waste.models import SpecialRequest
            special_request = SpecialRequest.objects.get(id=special_request_id)
        except SpecialRequest.DoesNotExist:
            return Response({'error': 'Special request not found'}, status=404)
        
        amount = float(weight_kg) * float(payment_settings.per_kg_rate)
        
        invoice = Invoice.objects.create(
            special_request=special_request,
            amount=amount,
            weight_kg=weight_kg,
            per_kg_rate=payment_settings.per_kg_rate
        )
        
        return Response({
            'invoice_id': invoice.id,
            'amount': str(invoice.amount),
            'message': 'Invoice created successfully'
        })