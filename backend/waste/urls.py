from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token
from .views import (
    ScheduleViewSet, SpecialRequestViewSet, CompostRequestViewSet,
    WasteTypeViewSet, CollectionDayViewSet, WardViewSet, UserViewSet
)
from . import views

router = DefaultRouter()
router.register(r'schedule', ScheduleViewSet)
router.register(r'special-request', SpecialRequestViewSet, basename='special-request')
router.register(r'compost-request', CompostRequestViewSet, basename='compost-request')
router.register(r'waste-types', WasteTypeViewSet)
router.register(r'collection-days', CollectionDayViewSet)
router.register(r'wards', WardViewSet)
router.register(r'users', UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('api-token-auth/', obtain_auth_token),
    path('debug-user-requests/', views.debug_user_requests, name='debug-user-requests'),
]