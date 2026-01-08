from rest_framework import serializers
from .models import Schedule, SpecialRequest, CompostRequest, WasteType, CollectionDay, Ward
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_active', 'is_staff', 'date_joined']
        read_only_fields = ['date_joined']

class WasteTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = WasteType
        fields = '__all__'

class CollectionDaySerializer(serializers.ModelSerializer):
    class Meta:
        model = CollectionDay
        fields = '__all__'

class WardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ward
        fields = '__all__'

class ScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedule
        fields = '__all__'

class SpecialRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = SpecialRequest
        fields = '__all__'

class CompostRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompostRequest
        fields = '__all__'