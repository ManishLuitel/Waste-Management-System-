from rest_framework import serializers
from .models import Schedule, SpecialRequest, CompostRequest


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