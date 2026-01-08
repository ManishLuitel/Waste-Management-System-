from django.contrib import admin
from django.urls import path, include
from rest_framework.authtoken import views as drf_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('waste.urls')), 
    path('api-token-auth/', drf_views.obtain_auth_token), # <- New
    path('api/auth/', include('accounts.urls')),
    path('api/', include('payments.urls')),

   
]
