from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsAdminOrPostOnly(BasePermission):
    """
    Allow anyone to POST (submit form),
    but only admin users can GET, PUT, DELETE.
    """
    def has_permission(self, request, view):
        # Allow anyone to POST
        if request.method == "POST":
            return True
        # Allow only admin/superuser for other requests
        return request.user and request.user.is_staff
#   {token && <Link to="/admin/schedules">Admin Panel</Link>}