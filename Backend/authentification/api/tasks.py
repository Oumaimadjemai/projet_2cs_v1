# api/tasks.py
from celery import shared_task
from django.utils import timezone
from api.models import Periode,Parametre_group

@shared_task
def archive_past_annee_academique():
    now = timezone.now().date()
    periodes = Periode.objects.filter(annee_academique__date_fin__lt=now, archived=False)
    for periode in periodes:
        periode.archived = True
        periode.save()
    # Archiver Parametre_group terminées non archivées
    groupes = Parametre_group.objects.filter(annee_academique__date_fin__lt=now, archived=False)
    for groupe in groupes:
        groupe.archived = True
        groupe.save()