from django.urls import path
from . import views

urlpatterns = [
    path('getall/', views.TaskListView.as_view(), name='task-list'),
    path('create/', views.TaskCreateView.as_view(), name='task-create'),
    path('retrieve/', views.TaskRetrieveView.as_view(), name='task-retrieve'),
    path('delete/', views.TaskDeleteView.as_view(), name='task-delete'),
    path('assign_editor/', views.AssignEditorView.as_view(), name='assign-editor'),
]
