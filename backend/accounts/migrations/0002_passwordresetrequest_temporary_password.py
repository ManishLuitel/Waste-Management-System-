# Generated manually

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='passwordresetrequest',
            name='temporary_password',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
    ]