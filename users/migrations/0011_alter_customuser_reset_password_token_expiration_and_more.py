# Generated by Django 4.2.4 on 2023-09-23 15:19

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0010_alter_customuser_reset_password_token_expiration_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='reset_password_token_expiration',
            field=models.DateTimeField(blank=True, default=datetime.datetime(2023, 9, 23, 23, 19, 18, 386499, tzinfo=datetime.timezone.utc), null=True),
        ),
        migrations.AlterField(
            model_name='customuser',
            name='verification_token_expiration',
            field=models.DateTimeField(default=datetime.datetime(2023, 9, 23, 23, 19, 18, 386362, tzinfo=datetime.timezone.utc), editable=False, null=True),
        ),
    ]
