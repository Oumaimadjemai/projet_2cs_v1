from django.db import models
from django.utils import timezone
import requests


# Create your models here.
import requests
from datetime import datetime
from django.db import models
from django.utils import timezone

class Assignment(models.Model):
    group_id = models.CharField(max_length=100, unique=True, null=True)
    theme_id = models.IntegerField(null=True)
    encadrant = models.IntegerField(null=True)
    assigned_at = models.DateTimeField(auto_now_add=True)
    assigned_by_admin_id = models.IntegerField(null=True)
    soutenance_valide = models.BooleanField(default=False)
    annee_academique = models.IntegerField(null=True)
    archived = models.BooleanField(default=False)
    date_soumission = models.DateField(default=timezone.now)

    def save(self, *args, **kwargs):
        # Avant sauvegarde, affecter annee_academique selon date_soumission
        try:
            from .discovery import discover_service
            service1_url = discover_service("SERVICE1-CLIENT")

            response = requests.get(f"{service1_url}/annees-academiques/")
            if response.status_code == 200:
                annees = response.json()

                ds = self.date_soumission
                if isinstance(ds, datetime):
                    ds = ds.date()

                for annee in annees:
                    date_debut = annee.get("date_debut")
                    date_fin = annee.get("date_fin")

                    if date_debut and date_fin:
                        debut = datetime.strptime(date_debut, "%Y-%m-%d").date()
                        fin = datetime.strptime(date_fin, "%Y-%m-%d").date()
                        if debut <= ds <= fin:
                            self.annee_academique = annee["id"]
                            break
        except Exception as e:
            print(f"Erreur récupération année académique : {e}")

        super().save(*args, **kwargs)

    def __str__(self):
        return f"Group {self.group_id} -> Theme {self.theme_id}"

