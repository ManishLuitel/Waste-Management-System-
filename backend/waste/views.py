from rest_framework import viewsets, generics
from rest_framework.authentication import TokenAuthentication
from accounts.authentication import ExpiringTokenAuthentication
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Schedule, SpecialRequest, CompostRequest, WasteType, CollectionDay, Ward
from .serializers import (
    SpecialRequestSerializer, CompostRequestSerializer, ScheduleSerializer,
    WasteTypeSerializer, CollectionDaySerializer, WardSerializer, UserSerializer
)
from .permissions import IsAdminOrPostOnly, IsAdminUser
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAdminUser

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAdminUser]

class WasteTypeViewSet(viewsets.ModelViewSet):
    queryset = WasteType.objects.filter(is_active=True)
    serializer_class = WasteTypeSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [AllowAny]

class CollectionDayViewSet(viewsets.ModelViewSet):
    queryset = CollectionDay.objects.filter(is_active=True)
    serializer_class = CollectionDaySerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [AllowAny]

class WardViewSet(viewsets.ModelViewSet):
    queryset = Ward.objects.filter(is_active=True)
    serializer_class = WardSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [AllowAny]

class ScheduleViewSet(viewsets.ModelViewSet):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [AllowAny]

class SpecialRequestViewSet(viewsets.ModelViewSet):
    serializer_class = SpecialRequestSerializer
    authentication_classes = [ExpiringTokenAuthentication]
    permission_classes = [IsAdminOrPostOnly]
    
    def get_queryset(self):
        if self.request.user.is_staff or self.request.user.is_superuser:
            return SpecialRequest.objects.all().order_by('-submitted_at')
        # Filter by user's email
        user_email = self.request.user.email
        return SpecialRequest.objects.filter(email=user_email).order_by('-submitted_at')

class CompostRequestViewSet(viewsets.ModelViewSet):
    serializer_class = CompostRequestSerializer
    authentication_classes = [ExpiringTokenAuthentication]
    permission_classes = [IsAdminOrPostOnly]
    
    def get_queryset(self):
        if self.request.user.is_staff or self.request.user.is_superuser:
            return CompostRequest.objects.all().order_by('-submitted_at')
        # Filter by user's email
        user_email = self.request.user.email
        return CompostRequest.objects.filter(email=user_email).order_by('-submitted_at')

class ScheduleList(generics.ListAPIView):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer

@api_view(['GET'])
def debug_user_requests(request):
    """Debug endpoint to check user's requests"""
    if not request.user.is_authenticated:
        return Response({'error': 'Not authenticated'}, status=401)
    
    user_email = request.user.email
    special_requests = SpecialRequest.objects.filter(email=user_email)
    compost_requests = CompostRequest.objects.filter(email=user_email)
    
    # Also get all requests to see what emails exist
    all_special = SpecialRequest.objects.all().values('email', 'name', 'id')
    all_compost = CompostRequest.objects.all().values('email', 'name', 'id')
    
    return Response({
        'user_email': user_email,
        'user_id': request.user.id,
        'user_username': request.user.username,
        'special_requests_count': special_requests.count(),
        'compost_requests_count': compost_requests.count(),
        'all_special_emails': list(all_special),
        'all_compost_emails': list(all_compost),
        'filtered_special': [{'id': r.id, 'email': r.email, 'name': r.name} for r in special_requests],
        'filtered_compost': [{'id': r.id, 'email': getattr(r, 'email', 'NO_EMAIL'), 'name': r.name} for r in compost_requests],
    })
