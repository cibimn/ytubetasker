from rest_framework import views, status
from rest_framework.response import Response
from .models import Task,CustomUser
from .serializers import TaskSerializer
import uuid
from django.core.exceptions import ObjectDoesNotExist
from django.http import JsonResponse
import requests
from django.conf import settings
from .s3_utils import s3_client

class TaskListView(views.APIView):
    def get(self, request):
        tasks = Task.objects.all().order_by('-created_at')
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)

class TaskCreateView(views.APIView):
    def post(self, request):
        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
            assigned_to_email = request.data.get('assigned_to', None)
            assigned_to = None
            if assigned_to_email:
                try:
                    assigned_to = CustomUser.objects.get(email=assigned_to_email)
                except ObjectDoesNotExist:
                    return Response({'error': 'Assigned editor not found'}, status=status.HTTP_404_NOT_FOUND)
            if assigned_to:
                serializer.save(created_by=request.user, assigned_to=assigned_to, unique_id=uuid.uuid4())
            else:
                serializer.save(created_by=request.user, unique_id=uuid.uuid4())
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TaskRetrieveView(views.APIView):
    def get(self, request):
        task_id = request.data.get('task_id')
        if not task_id:
            return Response({'error': 'task_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        task = Task.objects.filter(unique_id=task_id)
        if not task:
            return Response({'error': 'Task not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = TaskSerializer(task)
        return Response(serializer.data, status=status.HTTP_200_OK)


class TaskDeleteView(views.APIView):
    def post(self, request):
        task_id = request.data.get('task_id')
        if not task_id:
            return Response({'error': 'task_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        task = Task.objects.filter(unique_id=task_id)
        if not task:
            return Response({'error': 'Task not found'}, status=status.HTTP_404_NOT_FOUND)
        task.delete()
        return Response({'message': 'Task successfully deleted'}, status=status.HTTP_200_OK)


class AssignEditorView(views.APIView):
    def post(self, request):
        task_id = request.data.get('task_id')
        editor_id = request.data.get('editor_id')
        if not task_id or not editor_id:
            return Response({'error': 'Both task_id and editor_id are required'}, 
                            status=status.HTTP_400_BAD_REQUEST)
        task = Task.objects.filter(unique_id=task_id)
        editor = CustomUser.objects.filter(email=editor_id)
        if not task:
            return Response({'error': 'Task not found'}, status=status.HTTP_404_NOT_FOUND)
        if not editor:
            return Response({'error': 'Editor not found'}, status=status.HTTP_404_NOT_FOUND)
        task.assigned_to = editor
        task.save()
        serializer = TaskSerializer(task)
        return Response({'message': 'Editor successfully assigned', 'task': serializer.data}, 
                        status=status.HTTP_200_OK)

def get_authorization_token():
    auth_url = "https://api.backblazeb2.com/b2api/v2/b2_authorize_account"
    account_id = settings.ACCOUNT_ID
    application_key = settings.APPLICATION_KEY

    response = requests.get(auth_url, auth=(account_id, application_key))
    print(auth_url,account_id,application_key)
    print(response.status_code,response.content)
    return response.json()

def get_upload_url(request):
    auth_data = get_authorization_token()
    print(auth_data)
    auth_token = auth_data["authorizationToken"]
    api_url = auth_data["apiUrl"]
    bucket_id = settings.BUCKET_ID

    response = requests.post(
        f"{api_url}/b2api/v2/b2_get_upload_url",
        headers={"Authorization": auth_token},
        json={"bucketId": bucket_id}
    )
    return JsonResponse(response.json())

def get_presigned_url(request):
    filename = request.GET.get('filename', None)
    
    if filename is None:
        return JsonResponse({'error': 'Filename is required'}, status=400)

    presigned_url = s3_client.generate_presigned_url(
        'put_object',
        Params={
            'Bucket': settings.B2_BUCKET_NAME,
            'Key': filename,
        },
        ExpiresIn=3600  # URL expires in 1 hour
    )

    return JsonResponse({'presigned_url': presigned_url})