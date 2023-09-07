# serializers.py

from django.contrib.auth import get_user_model
from rest_framework import serializers
from django.contrib.auth.hashers import check_password

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name', 'email', 'password', 'role')
        extra_kwargs = {'password': {'write_only': True}}

class UserSignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name', 'email', 'password', 'role')
        extra_kwargs = {'password': {'write_only': True}}

    def validate_role(self, value):
        return 'user'  # Force role to be 'user'
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            email=validated_data['email'],
            password=validated_data['password'],
            role='User'
        )
        return user

class PasswordResetSerializer(serializers.Serializer):
    new_password = serializers.CharField(write_only=True)
    
    def validate_new_password(self, value):
        user = self.context.get('user')
        if user and check_password(value, user.password):
            raise serializers.ValidationError("New password cannot be the same as the old password.")
        return value
    
    def update(self, instance, validated_data):
        instance.set_password(validated_data['new_password'])
        instance.reset_password_token = None
        instance.reset_password_token_expiration = None
        instance.save()
        return instance

class SendNewVerificationEmailSerializer(serializers.Serializer):
    email = serializers.EmailField()
    
    def validate_email(self, value):
        try:
            user = User.objects.get(email=value)
            return value
        except User.DoesNotExist:
            raise serializers.ValidationError("User with this email does not exist.")