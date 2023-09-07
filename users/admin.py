from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {'fields': ('role', 'is_verified')}),
    )
    
    fieldsets = UserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('role', 'is_verified')}),
    )
    
    list_display = ['username', 'email','password' ,'first_name', 'last_name', 'role', 'is_active', 'is_verified']

admin.site.register(CustomUser, CustomUserAdmin)
