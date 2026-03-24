from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    CustomTokenObtainPairView,
    RegisterView,
    UserProfileView,
    AdminUserManagementView,
    AdminUserDetailView,
    PasswordResetRequestView,
    PasswordResetConfirmView,
    LogoutView
)

urlpatterns = [
    # --- Autenticazione ---
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='user_register'),
    path('logout/', LogoutView.as_view(), name='logout'),

    # --- Utente Connesso ---
    path('me/', UserProfileView.as_view(), name='user_profile'),

    # --- Reset Password ---
    path('password-reset/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('password-reset-confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),

    # --- Amministrazione ---
    path('users/', AdminUserManagementView.as_view(), name='admin_user_list'),
    path('users/<int:pk>/', AdminUserDetailView.as_view(), name='admin_user_detail'),
]
