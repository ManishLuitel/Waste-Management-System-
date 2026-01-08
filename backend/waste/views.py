from rest_framework import viewsets, generics
from rest_framework.authentication import TokenAuthentication
from .models import Schedule, SpecialRequest, CompostRequest
from .serializers import SpecialRequestSerializer, CompostRequestSerializer, ScheduleSerializer
from .permissions import IsAdminOrPostOnly
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.permissions import AllowAny

# # 🧾 USER SIGNUP API
# @api_view(['POST'])
# def register_user(request):
#     username = request.data.get('username')
#     password = request.data.get('password')

#     if not username or not password:
#         return Response({'error': 'Username and password required'}, status=status.HTTP_400_BAD_REQUEST)

#     if User.objects.filter(username=username).exists():
#         return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

#     user = User.objects.create_user(username=username, password=password)
#     token, _ = Token.objects.get_or_create(user=user)
#     return Response({'message': 'User created successfully', 'token': token.key}, status=status.HTTP_201_CREATED)


# # 🔐 USER LOGIN API
# @api_view(['POST'])
# def login_user(request):
#     from django.contrib.auth import authenticate
#     username = request.data.get('username')
#     password = request.data.get('password')

#     user = authenticate(username=username, password=password)
#     if user is not None:
#         token, _ = Token.objects.get_or_create(user=user)
#         return Response({'token': token.key})
#     else:
#         return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)



class ScheduleViewSet(viewsets.ModelViewSet):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer
    # anyone can view schedule, only admin can edit if you want
    authentication_classes = [TokenAuthentication]
    permission_classes = [AllowAny]


class SpecialRequestViewSet(viewsets.ModelViewSet):
    queryset = SpecialRequest.objects.all()
    serializer_class = SpecialRequestSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAdminOrPostOnly]


class CompostRequestViewSet(viewsets.ModelViewSet):
    queryset = CompostRequest.objects.all().order_by('-submitted_at')
    serializer_class = CompostRequestSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAdminOrPostOnly]


class ScheduleList(generics.ListAPIView):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer
    
