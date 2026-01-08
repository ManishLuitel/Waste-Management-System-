from rest_framework.authentication import TokenAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.utils import timezone
from django.conf import settings
from datetime import timedelta

class ExpiringTokenAuthentication(TokenAuthentication):
    def authenticate_credentials(self, key):
        model = self.get_model()
        try:
            token = model.objects.select_related('user').get(key=key)
        except model.DoesNotExist:
            raise AuthenticationFailed('Invalid token.')

        if not token.user.is_active:
            raise AuthenticationFailed('User inactive or deleted.')

        # Check if token has expired (4 hours)
        if token.created < timezone.now() - timedelta(seconds=getattr(settings, 'TOKEN_EXPIRED_AFTER_SECONDS', 14400)):
            raise AuthenticationFailed('Token has expired.')

        return (token.user, token)