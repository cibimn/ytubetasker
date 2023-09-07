from django.contrib.auth import get_user_model, authenticate
from django.utils.translation import gettext_lazy as _
from rest_framework import status, views
from rest_framework.response import Response
from ..users.serializers import UserSerializer

User = get_user_model()

class AdminSignupView(views.APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            if serializer.validated_data['role'] == 'ADMIN':
                user = serializer.save()
                user.set_password(serializer.validated_data['password'])
                user.save()
                return Response({'message': 'Admin user created'}, status=status.HTTP_201_CREATED)
            else:
                return Response({'message': 'Only admin users can be created here'}, status=status.HTTP_400_BAD_REQUEST)
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
