from django.db import models
from django.contrib.auth.models import User

class WasteType(models.Model):
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    color_code = models.CharField(max_length=7, default='#6B7280')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class CollectionDay(models.Model):
    name = models.CharField(max_length=20, unique=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Ward(models.Model):
    ward_number = models.IntegerField(unique=True)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Ward {self.ward_number} - {self.name}"

class Schedule(models.Model):
    ward = models.IntegerField()
    collection_day = models.CharField(max_length=20)
    waste_type = models.CharField(max_length=30)
    time = models.TimeField()

class SpecialRequest(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    address = models.TextField()
    reason = models.TextField()
    preferred_date = models.DateField()
    preferred_time = models.TimeField()
    status = models.CharField(default='Pending', max_length=20)
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.preferred_date} - {self.status}"

class CompostRequest(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(default='')  # Add email field
    contact = models.CharField(max_length=20)
    location = models.CharField(max_length=255)
    waste_type = models.CharField(max_length=50)
    quantity = models.CharField(max_length=100)
    message = models.TextField(blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.waste_type}"


