"""
Django settings for tasker project.

Generated by 'django-admin startproject' using Django 4.2.4.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.2/ref/settings/
"""

from pathlib import Path
import os
import ssl
from dotenv import load_dotenv
import boto3
from botocore.client import Config

load_dotenv()

ACCOUNT_ID = os.getenv("account_id")
APPLICATION_KEY = os.getenv("application_key")
BUCKET_ID = os.getenv("bucket_id")
BUCKET_NAME = os.getenv("bucketName")

B2_ACCESS_KEY_ID = 'your_s3_compatible_key_id'  # S3 Compatible Key ID
B2_SECRET_ACCESS_KEY = 'your_s3_compatible_secret_key'  # S3 Compatible Application Key
B2_BUCKET_NAME = BUCKET_NAME

s3_client = boto3.client(
    's3',
    aws_access_key_id=ACCOUNT_ID,
    aws_secret_access_key=APPLICATION_KEY,
    endpoint_url='https://s3.us-east-005.backblazeb2.com',
    config=Config(signature_version='s3v4'),
)


ssl._create_default_https_context = ssl._create_unverified_context
# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-4b5&7r(u2*g#^cx+uo9-emuh+ulplp)zbv(&ju6udkn=yf=8xu'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'users',
    'task',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'corsheaders.middleware.CorsMiddleware',
]

ROOT_URLCONF = 'tasker.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000","http://localhost:5173","https://s3.us-east-005.backblazeb2.com",  "https://ytubetasker.co.in",    # Frontend domain in production
    "http://ytubetasker.co.in","https://backend.ytubetasker.co.in",  # If you expect CSRF-protected POST requests from here
    "http://backend.ytubetaker.co.in",
]
CSRF_TRUSTED_ORIGINS = [
    "http://localhost:3000","http://localhost:5173","https://s3.us-east-005.backblazeb2.com", "https://ytubetasker.co.in",
    "http://ytubetasker.co.in","https://backend.ytubetasker.co.in",  # If you expect CSRF-protected POST requests from here
    "http://backend.ytubetaker.co.in",
]
WSGI_APPLICATION = 'tasker.wsgi.application'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
        # other authentication classes
    ],
    # ...
}
CSRF_COOKIE_HTTPONLY = False
CORS_ALLOW_CREDENTIALS = True

# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

DATABASES = {
    # 'default': {
    #     'ENGINE': 'django.db.backends.sqlite3',
    #     'NAME': BASE_DIR / 'db.sqlite3',
    # }
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'ytubetaker',  # Name of your PostgreSQL database
        'USER': 'cb',  # PostgreSQL username you created
        'PASSWORD': 'ABIcb#13',  # Password for the PostgreSQL user
        'HOST': 'localhost',  # Set to the address of your PostgreSQL. Use 'localhost' if it's on the same server
        'PORT': '5432',  # Default PostgreSQL port
    }
}


# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

AUTH_USER_MODEL = 'users.CustomUser'

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.sendgrid.net'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'apikey'
EMAIL_HOST_PASSWORD = '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'
EMAIL_USE_SSL = False
# EMAIL_BACKEND = "sendgrid_backend.SendgridBackend"
# SENDGRID_API_KEY = "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"
os.environ['PYTHONHTTPSVERIFY'] = '0'
# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

# Use HTTPS for the CSRF cookie
CSRF_COOKIE_HTTPONLY = True

# Enable HSTS (HTTP Strict Transport Security)
HSTS_SECONDS = 31536000  # 1 year
SECURE_HSTS_SECONDS = HSTS_SECONDS
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# Prevent clickjacking attacks
X_FRAME_OPTIONS = 'DENY'

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'DEBUG',
            'class': 'logging.FileHandler',
            'filename': '/logfile.log',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'DEBUG',
            'propagate': True,
        },
    },
}
