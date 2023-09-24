# Generated by Django 4.2.4 on 2023-09-23 11:48

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0006_customuser_main_user_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='reset_password_token_expiration',
            field=models.DateTimeField(blank=True, default=datetime.datetime(2023, 9, 23, 19, 48, 52, 998431, tzinfo=datetime.timezone.utc), null=True),
        ),
        migrations.AlterField(
            model_name='customuser',
            name='verification_token_expiration',
            field=models.DateTimeField(default=datetime.datetime(2023, 9, 23, 19, 48, 52, 998282, tzinfo=datetime.timezone.utc), editable=False, null=True),
        ),
    ]
