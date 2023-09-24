# users/urls.py

from django.urls import path
from . import views 

urlpatterns = [
    path('admin_login/', views.AdminLoginView.as_view(), name='admin_login'),
    
    path('user_login/', views.UserLoginView.as_view(), name='user_login'),
    path('user_logout/', views.UserLogoutView.as_view(), name='user-logout'),
    
    path('verify_email/', views.VerifyEmailView.as_view(), name='verify-email'),
    path('user_signup/', views.UserSignupView.as_view(), name='user_signup'),
    
    path('send_new_verification_email/', views.SendNewVerificationEmailView.as_view(), name='send-new-verification-email'),
    path('password_reset/', views.PasswordResetWithEmailView.as_view(), name='password-reset'),
    path('password_reset_user/', views.PasswordResetView.as_view(), name='password-reset-user'),
    path('password_reset_confirm/', views.PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
    
    path('check_auth_status/', views.CheckAuthStatusView.as_view(), name='check-auth-status'),
    
    path('add_editor/', views.AddEditorView.as_view(), name='add_editor'),
    path('remove_editor/', views.RemoveEditorView.as_view(), name='remove_editor'),
    path('list_editors/', views.ListEditorsView.as_view(), name='list_editors'),
]
