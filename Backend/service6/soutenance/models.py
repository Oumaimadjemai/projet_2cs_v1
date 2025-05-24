from django.db import models
from django.db.models import JSONField
import requests  
from .discovery import discover_service
from django.utils.timezone import now
# natif à partir de Django 3.1

class Soutenance(models.Model):
    annee=models.IntegerField(null=True)
    specialite=models.IntegerField(null=True)
    groupe = models.CharField(max_length=100, unique=True)
    date = models.DateField()
    heure_debut = models.TimeField(null=True)
    heure_fin=models.TimeField(null=True)
    salle = models.IntegerField()
    jury = JSONField(null=True)  # Liste d'IDs des enseignants, ex: ["id1", "id2"]
    created_at = models.DateTimeField(auto_now_add=True)
    annee_academique=models.IntegerField(null=True)
    archived=models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if self.annee_academique is None:
            service_url = discover_service("SERVICE1-CLIENT")
            if service_url:
                try:
                    response = requests.get(f"{service_url}/annees-academiques/")
                    response.raise_for_status()
                    annees = response.json()
                    date_ref = self.created_at or now()
                    date_ref_str = date_ref.strftime('%Y-%m-%d')
                    for annee in annees:
                        if annee['date_debut'] <= date_ref_str <= annee['date_fin']:
                            self.annee_academique = annee['id']
                            break
                except requests.RequestException as e:
                    print(f"[SOUTENANCE] Erreur fetch années académiques : {e}")
        super().save(*args, **kwargs)
    def __str__(self):
        return f"Soutenance du groupe {self.groupe} - {self.date} à {self.heure}"
