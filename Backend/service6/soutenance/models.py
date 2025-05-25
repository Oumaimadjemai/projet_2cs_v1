from django.db import models
from django.db.models import JSONField  # natif à partir de Django 3.1

class Soutenance(models.Model):
    annee=models.IntegerField(null=True)
    specialite=models.IntegerField(null=True)
    groupe = models.CharField(max_length=100, unique=True)
    date = models.DateField()
    heure_debut = models.TimeField(null=True)
    heure_fin=models.TimeField(null=True)
    salle = models.IntegerField()
    jury = JSONField(null=True,blank=True)  # Liste d'IDs des enseignants, ex: ["id1", "id2"]
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Soutenance du groupe {self.groupe} - {self.date} à {self.heure}"
