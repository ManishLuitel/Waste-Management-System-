from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework import viewsets
from .serializers import UserSignupSerializer, PasswordResetRequestSerializer
from .models import PasswordResetRequest
from waste.permissions import IsAdminUser
from django.utils import timezone
import logging

logger = logging.getLogger(__name__)

class SignupView(APIView):
    permission_classes = []

    def post(self, request):
        logger.info(f"Signup request data: {request.data}")
        serializer = UserSignupSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()
            token, _ = Token.objects.get_or_create(user=user)

            return Response({
                "message": "Signup successful",
                "token": token.key,
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                }
            }, status=status.HTTP_201_CREATED)

        logger.error(f"Signup validation errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PasswordResetRequestView(APIView):
    permission_classes = []

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(email=email)
            # Check if there's already a pending request
            existing_request = PasswordResetRequest.objects.filter(
                user=user, status='pending'
            ).first()
            
            if existing_request:
                return Response({
                    'message': 'Password reset request already pending approval'
                })
            
            # Create new request
            PasswordResetRequest.objects.create(user=user)
            return Response({
                'message': 'Password reset request submitted successfully'
            })
        except User.DoesNotExist:
            return Response({'error': 'User with this email does not exist'}, status=status.HTTP_404_NOT_FOUND)

class PasswordResetRequestViewSet(viewsets.ModelViewSet):
    queryset = PasswordResetRequest.objects.all().order_by('-created_at')
    serializer_class = PasswordResetRequestSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def approve(self, request, pk=None):
        reset_request = self.get_object()
        
        # Generate temporary password
        temp_password = reset_request.generate_temporary_password()
        reset_request.temporary_password = temp_password
        reset_request.status = 'approved'
        reset_request.approved_at = timezone.now()
        
        # Set user's password to temporary password
        user = reset_request.user
        user.set_password(temp_password)
        user.save()
        
        reset_request.save()
        
        return Response({
            'message': 'Password reset request approved',
            'temporary_password': temp_password
        })
    
    def reject(self, request, pk=None):
        reset_request = self.get_object()
        reset_request.status = 'rejected'
        reset_request.save()
        return Response({'message': 'Password reset request rejected'})

class VerifyResetTokenView(APIView):
    permission_classes = []
    
    def get(self, request, token):
        try:
            reset_request = PasswordResetRequest.objects.get(
                token=token, status='approved', used=False
            )
            return Response({'valid': True})
        except PasswordResetRequest.DoesNotExist:
            return Response({'valid': False}, status=status.HTTP_404_NOT_FOUND)

class ResetPasswordWithTokenView(APIView):
    permission_classes = []
    
    def post(self, request, token):
        password = request.data.get('password')
        if not password:
            return Response({'error': 'Password is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            reset_request = PasswordResetRequest.objects.get(
                token=token, status='approved', used=False
            )
            
            # Reset password
            user = reset_request.user
            user.set_password(password)
            user.save()
            
            # Mark token as used
            reset_request.used = True
            reset_request.save()
            
            return Response({'message': 'Password reset successful'})
        except PasswordResetRequest.DoesNotExist:
            return Response({'error': 'Invalid or expired token'}, status=status.HTTP_400_BAD_REQUEST)


class UserLoginView(APIView):
    permission_classes = []

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        try:
            # Find the user by email
            user_obj = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"error": "Invalid credentials"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Authenticate using the username internally
        user = authenticate(username=user_obj.username, password=password)

        if not user:
            return Response(
                {"error": "Invalid credentials"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        token, _ = Token.objects.get_or_create(user=user)

        return Response({
            "message": "Login successful",
            "token": token.key,
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
            }
        })
