from django.urls import path
from .views import SignupView, UserLoginView

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('userlogin/', UserLoginView.as_view(), name='userlogin'),
]