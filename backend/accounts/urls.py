from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    SignupView, UserLoginView, PasswordResetRequestView, 
    PasswordResetRequestViewSet, VerifyResetTokenView, ResetPasswordWithTokenView
)

router = DefaultRouter()
router.register(r'password-reset-requests', PasswordResetRequestViewSet)

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('userlogin/', UserLoginView.as_view(), name='userlogin'),
    path('password-reset-request/', PasswordResetRequestView.as_view(), name='password-reset-request'),
    path('verify-reset-token/<uuid:token>/', VerifyResetTokenView.as_view(), name='verify-reset-token'),
    path('reset-password/<uuid:token>/', ResetPasswordWithTokenView.as_view(), name='reset-password-token'),
    path('password-reset-requests/<int:pk>/approve/', PasswordResetRequestViewSet.as_view({'post': 'approve'}), name='approve-reset'),
    path('password-reset-requests/<int:pk>/reject/', PasswordResetRequestViewSet.as_view({'post': 'reject'}), name='reject-reset'),
    path('', include(router.urls)),
]