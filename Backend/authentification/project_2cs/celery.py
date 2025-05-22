from celery import Celery
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project_2cs.settings')
app = Celery('projet')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()
from celery.schedules import crontab

app.conf.beat_schedule = {
    'archive-every-day': {
        'task': 'api.tasks.archive_past_annee_academique',
        'schedule': crontab(hour=0, minute=0),  # chaque jour à minuit
    },
}

