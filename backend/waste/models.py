from django.db import models
from django.contrib.auth.models import User

class Schedule(models.Model):
    ward = models.IntegerField()
    collection_day = models.CharField(max_length=20)  # e.g., Monday
    waste_type = models.CharField(max_length=30)  # e.g., General, Compost
    time = models.TimeField()

class SpecialRequest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    request_date = models.DateField()
    waste_type = models.CharField(max_length=50)
    address = models.TextField()
    paid = models.BooleanField(default=False)

class CompostRequest(models.Model):
    name = models.CharField(max_length=100)
    contact = models.CharField(max_length=20)
    location = models.CharField(max_length=255)
    waste_type = models.CharField(max_length=50)
    quantity = models.CharField(max_length=100)
    message = models.TextField(blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.waste_type}"


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
    
    
# class CompostRequest(models.Model):
#     user = models.ForeignKey(User, on_delete=models.CASCADE)
#     address = models.CharField(max_length=255)
#     date = models.DateField()
#     time = models.TimeField()
#     is_collected = models.BooleanField(default=False)
#     notes = models.TextField(blank=True, null=True)
#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"{self.user.username} - {self.date} at {self.address}"


