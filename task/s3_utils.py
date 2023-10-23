import boto3
from django.conf import settings
from botocore.config import Config

s3_client = boto3.client(
    's3',
    aws_access_key_id=settings.ACCOUNT_ID,
    aws_secret_access_key=settings.APPLICATION_KEY,
    endpoint_url='https://s3.us-east-005.backblazeb2.com',
    config=Config(signature_version='s3v4'),
)
