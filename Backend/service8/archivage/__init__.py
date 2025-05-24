# archivage/__init__.py

from __future__ import absolute_import

# Ceci importe celery pour enregistrer les tâches
from service8.celery import app as celery_app

__all__ = ['celery_app']
