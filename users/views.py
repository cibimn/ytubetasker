from django.shortcuts import render
from django.contrib.auth import get_user_model, authenticate
from django.utils.translation import gettext_lazy as _
from rest_framework import status, views
from rest_framework.response import Response
from datetime import timedelta
from .serializers import UserSerializer, UserSignupSerializer,PasswordResetSerializer,SendNewVerificationEmailSerializer
from django.core.mail import send_mail
import uuid
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import login
from django.contrib.auth import logout

User = get_user_model()

def send_verification_email(user):
    token = str(uuid.uuid4())
    expiration_time = timezone.now() + timezone.timedelta(hours=8)
    user.verification_token = token
    user.verification_token_expiration = expiration_time
    user.save()

    send_mail(
        'Verify your account',
        f'Click the link to verify your account: http://localhost:8000/verify/{token}',
        'admin@vulture.co.in',
        [user.email],
        fail_silently=False,
    )

class VerifyEmailView(views.APIView):
    def post(self, request):
        token = request.data.get('token')
        try:
            user = User.objects.get(verification_token=token)
            if timezone.now() > user.verification_token_expiration:
                return Response({'message': 'Token has expired'}, status=status.HTTP_400_BAD_REQUEST)
            user.is_verified = True
            user.is_active = True
            user.verification_token = None  # Clear the one-time-use token
            user.verification_token_expiration = None  # Clear the expiration
            user.save()
            return Response({'message': 'Email verified'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'message': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)

class UserSignupView(views.APIView):
    def post(self, request):
        serializer = UserSignupSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            user.verification_token = str(uuid.uuid4())
            user.verification_token_expiration = timezone.now() + timedelta(hours=8)
            user.set_password(serializer.validated_data['password'])
            user.save()
            send_verification_email(user)
            return Response({'message': 'User created, verification email sent'}, status=status.HTTP_201_CREATED)
        print(serializer.errors) 
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AdminLoginView(views.APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user and user.role == 'ADMIN':
            return Response({'message': 'Admin logged in successfully'}, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'Invalid credentials or not an admin'}, status=status.HTTP_401_UNAUTHORIZED)
class UserLoginView(views.APIView):
    def post(self, request):
        username = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user:
            if user.role != 'user':
                return Response({'message': 'Not a user account'}, status=status.HTTP_401_UNAUTHORIZED)
            if not user.is_verified:
                return Response({'message': 'Email not verified'}, status=status.HTTP_401_UNAUTHORIZED)
            
            login(request, user)  # This will set the CSRF token and log the user in
            return Response({'message': 'User logged in successfully'}, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class PasswordResetView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        user.reset_password_token = str(uuid.uuid4())
        user.reset_password_token_expiration = timezone.now() + timedelta(hours=1)
        user.save()

        send_mail(
            'Password Reset',
            f'Your password reset token is: {user.reset_password_token}',
            'admin@vulture.co.in',
            [user.email]
        )
        
        return Response({'message': 'Password reset email sent.'}, status=status.HTTP_200_OK)

class PasswordResetConfirmView(views.APIView):
    serializer_class = PasswordResetSerializer

    def post(self, request):
        token = request.data.get('token')
        try:
            user = User.objects.get(reset_password_token=token)
        except User.DoesNotExist:
            return Response({'message': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
        
        if timezone.now() > user.reset_password_token_expiration:
            return Response({'message': 'Token has expired'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user.set_password(serializer.validated_data['new_password'])
            user.reset_password_token = None
            user.reset_password_token_expiration = None
            user.save()
            return Response({'message': 'Password successfully reset'}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SendNewVerificationEmailView(views.APIView):
    def post(self, request):
        serializer = SendNewVerificationEmailSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            user = User.objects.get(email=email)
            
            # Generate a new verification token and expiration time
            user.verification_token = str(uuid.uuid4())
            user.verification_token_expiration = timezone.now() + timezone.timedelta(hours=8)
            user.is_verified = False
            user.save()

            # Send email logic (assuming you have a send_verification_email function)
            send_verification_email(user)
            
            return Response({"message": "A new verification email has been sent."}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PasswordResetWithEmailView(views.APIView):
    def post(self, request):
        email = request.data.get('email')
        
        # Find the user with the given email
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'message': 'User does not exist'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Generate a token and set its expiration time
        user.reset_password_token = str(uuid.uuid4())
        user.reset_password_token_expiration = timezone.now() + timedelta(hours=1)
        user.save()

        # Send the reset password email
        send_mail(
            'Password Reset',
            f'Your password reset token is: {user.reset_password_token}',
            'admin@vulture.co.in',
            [user.email]
        )
        
        return Response({'message': 'Password reset email sent.'}, status=status.HTTP_200_OK)

class UserLogoutView(views.APIView):
    def post(self, request):
        # Check if user is authenticated
        if request.user.is_authenticated:
            # Django logout method will take care of the session invalidation
            logout(request)
            return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "No user is logged in"}, status=status.HTTP_400_BAD_REQUEST)