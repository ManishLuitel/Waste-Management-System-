# Generated manually

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('waste', '0005_collectionday_ward_wastetype'),
    ]

    operations = [
        migrations.AddField(
            model_name='compostrequest',
            name='email',
            field=models.EmailField(default=''),
        ),
    ]