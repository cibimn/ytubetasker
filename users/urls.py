# users/urls.py

from django.urls import path
from . import views  # make sure this is importing from the users app

urlpatterns = [
    path('admin_login/', views.AdminLoginView.as_view(), name='admin_login'),
    path('user_signup/', views.UserSignupView.as_view(), name='user_signup'),
    path('user_login/', views.UserLoginView.as_view(), name='user_login'),
    path('user_logout/', views.UserLogoutView.as_view(), name='user-logout'),
    path('verify_email/', views.VerifyEmailView.as_view(), name='verify-email'),
    path('password_reset/', views.PasswordResetWithEmailView.as_view(), name='password-reset-with-email'),
    path('send_new_verification_email/', views.SendNewVerificationEmailView.as_view(), name='send-new-verification-email'),
    path('password_reset/', views.PasswordResetWithEmailView.as_view(), name='password-reset'),
    path('password_reset_user/', views.PasswordResetView.as_view(), name='password-reset-user'),
    path('password_reset_confirm/', views.PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
    path('check_auth_status/', views.check_auth_status, name='check-auth-status'),
]
