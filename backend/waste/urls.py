from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token
from .views import ScheduleViewSet, SpecialRequestViewSet, CompostRequestViewSet

router = DefaultRouter()
router.register(r'schedule', ScheduleViewSet)
router.register(r'special-request', SpecialRequestViewSet)
router.register(r'compost-request', CompostRequestViewSet, basename='compost-request')

urlpatterns = [
    path('', include(router.urls)),  # DO NOT manually list paths again here
    path('api-token-auth/', obtain_auth_token),
]
