from django.contrib import admin
from .models import PasswordResetRequest

@admin.register(PasswordResetRequest)
class PasswordResetRequestAdmin(admin.ModelAdmin):
    list_display = ['user', 'status', 'created_at', 'approved_at', 'used']
    list_filter = ['status', 'used', 'created_at']
    search_fields = ['user__email', 'user__username']
    readonly_fields = ['token', 'created_at']
