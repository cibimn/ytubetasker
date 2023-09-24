from django.db import models
from django.utils import timezone
from users.models import CustomUser

class Task(models.Model):
    PRIORITY_CHOICES = (
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    )

    title = models.CharField(max_length=255)
    description = models.TextField()
    unique_id = models.TextField()
    keywords = models.CharField(max_length=255)
    video_link = models.URLField()
    thumbnail_url = models.URLField()
    price = models.BigIntegerField()
    editor_notes = models.TextField(blank=True, null=True)
    editor_review_notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    finish_at = models.DateTimeField(blank=True, null=True)
    deadline_date = models.DateTimeField(blank=True, null=True)
    priority = models.CharField(
        max_length=6, choices=PRIORITY_CHOICES, default='medium'
    )
    created_by = models.ForeignKey(CustomUser, related_name='tasks_created', on_delete=models.CASCADE)
    assigned_editor = models.ForeignKey(CustomUser, related_name='tasks_assigned', on_delete=models.CASCADE)

    def __str__(self):
        return self.title
