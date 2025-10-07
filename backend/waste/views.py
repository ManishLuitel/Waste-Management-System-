from rest_framework import viewsets, generics
from rest_framework.authentication import TokenAuthentication
from .models import Schedule, SpecialRequest, CompostRequest
from .serializers import SpecialRequestSerializer, CompostRequestSerializer, ScheduleSerializer
from .permissions import IsAdminOrPostOnly


class ScheduleViewSet(viewsets.ModelViewSet):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer
    # anyone can view schedule, only admin can edit if you want
    # authentication_classes = [TokenAuthentication]
    # permission_classes = [IsAdminUser]


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
