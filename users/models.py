from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid
from datetime import timedelta
from django.utils import timezone

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('user', 'User'),
        ('editor', 'Editor'),
    )
    role = models.CharField(max_length=6, choices=ROLE_CHOICES, default='user')
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    email = models.EmailField(unique=True)  # Make email unique as it will be used for login
    verification_token = models.UUIDField(default=uuid.uuid4, editable=False, null=True)
    verification_token_expiration = models.DateTimeField(default=timezone.now() + timedelta(hours=8), editable=False, null=True)
    is_verified = models.BooleanField(default=False)
    reset_password_token = models.UUIDField(default=uuid.uuid4,null=True, blank=True)
    reset_password_token_expiration = models.DateTimeField(default=timezone.now() + timedelta(hours=8),null=True, blank=True)
    main_user = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True)
    def __str__(self):
        return self.username