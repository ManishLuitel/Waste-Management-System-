from django.db import models
from django.contrib.auth.models import User
from waste.models import SpecialRequest
import uuid

class PaymentSettings(models.Model):
    monthly_fee = models.DecimalField(max_digits=10, decimal_places=2, default=500.00)
    per_kg_rate = models.DecimalField(max_digits=10, decimal_places=2, default=50.00)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class MonthlyPayment(models.Model):
    PAYMENT_STATUS = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    month = models.DateField()
    status = models.CharField(max_length=20, choices=PAYMENT_STATUS, default='pending')
    transaction_uuid = models.CharField(max_length=100, unique=True)
    esewa_ref_id = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

class Invoice(models.Model):
    INVOICE_STATUS = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('paid', 'Paid'),
    ]
    
    special_request = models.OneToOneField(SpecialRequest, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    weight_kg = models.DecimalField(max_digits=5, decimal_places=2)
    per_kg_rate = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=INVOICE_STATUS, default='pending')
    transaction_uuid = models.CharField(max_length=100, unique=True, blank=True, null=True)
    esewa_ref_id = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.transaction_uuid:
            self.transaction_uuid = str(uuid.uuid4())
        super().save(*args, **kwargs)