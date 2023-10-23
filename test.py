import boto3
from botocore.client import Config
import requests
# Backblaze B2 S3-compatible API credentials
ACCOUNT_ID = '005207c5f48a38c0000000002'
APPLICATION_KEY = 'K005x+kTjg9jEkZAQE/+VFlz8BMCiOw'#'005e35e71f044eff69ecdb0479b3ae473781aea342'
ENDPOINT_URL = 'https://s3.us-east-005.backblazeb2.com'  # Update if your endpoint is different
BUCKET_NAME = 'ytubetasker'
FILE_NAME = 'README.md'  # Name of the file you want to upload

# Initialize the B2 S3 client
s3_client = boto3.client(
    's3',
    aws_access_key_id=ACCOUNT_ID,
    aws_secret_access_key=APPLICATION_KEY,
    endpoint_url=ENDPOINT_URL,
    config=Config(signature_version='s3v4'),
)

# Generate the presigned URL
def generate_presigned_url():
    try:
        response = s3_client.generate_presigned_url(
            'put_object',
            Params={
                'Bucket': BUCKET_NAME,
                'Key': FILE_NAME,
            },
            ExpiresIn=3600  # URL will expire in 1 hour
        )
        return response
    except Exception as e:
        print(f"An error occurred: {e}")
        return None

url = generate_presigned_url()
if url:
    print(f"Presigned URL: {url}")
else:
    print("Failed to generate presigned URL.")

def upload_file_to_s3(presigned_url, file_path):
    with open(file_path, 'rb') as f:
        response = requests.put(presigned_url, data=f)
        print(response.content)
        return response.status_code

url = generate_presigned_url()
if url:
    print(f"Presigned URL: {url}")
    status_code = upload_file_to_s3(url, FILE_NAME)
    if status_code == 200:
        print("Successfully uploaded README.md!")
    else:
        print(f"Failed to upload README.md. HTTP Status Code: {status_code}") 
        print()
else:
    print("Failed to generate presigned URL.")