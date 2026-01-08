from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PaymentViewSet, AdminPaymentViewSet

router = DefaultRouter()
router.register(r'payments', PaymentViewSet, basename='payment')
router.register(r'admin/payments', AdminPaymentViewSet, basename='admin-payment')

urlpatterns = [
    path('', include(router.urls)),
]