from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsAdminOrPostOnly(BasePermission):
    """
    Allow anyone to POST (submit form),
    allow authenticated users to GET their own data,
    but only admin users can GET all data, PUT, DELETE.
    """
    def has_permission(self, request, view):
        # Allow anyone to POST
        if request.method == "POST":
            return True
        # Allow authenticated users to GET (they'll see filtered data)
        if request.method == "GET" and request.user.is_authenticated:
            return True
        # Allow only admin/superuser for other requests
        return request.user and request.user.is_staff

class IsAdminUser(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and (request.user.is_staff or request.user.is_superuser)