# Generated by Django 5.0.3 on 2025-05-22 21:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('soutenance', '0002_alter_soutenance_salle'),
    ]

    operations = [
        migrations.AlterField(
            model_name='soutenance',
            name='salle',
            field=models.IntegerField(),
        ),
    ]
