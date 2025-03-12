
import requests
from django.db import models
from django.core.exceptions import ValidationError

SERVICE_1_URL = "http://localhost:8000"


def validate_specialite_id(specialite_id):
    if specialite_id:  
        response = requests.get(f"{SERVICE_1_URL}/specialites/{specialite_id}/")
        if response.status_code != 200:
            raise ValidationError(f"L'ID spécialité '{specialite_id}' est introuvable dans le service 1.")

def validate_annee_academique_id(annee_academique_id):
    if annee_academique_id:
        response = requests.get(f"{SERVICE_1_URL}/annees/{annee_academique_id}/")
        if response.status_code != 200:
            raise ValidationError(f"L'ID année académique '{annee_academique_id}' est introuvable dans le service 1.")


class Theme(models.Model):
    titre = models.CharField(max_length=50)
    resume = models.TextField()
    outils_et_language = models.TextField()
    plan_travail = models.TextField()
    livrable = models.TextField(blank=True, null=True)

    
    annee_academique_id = models.IntegerField(
        validators=[validate_annee_academique_id],
        blank=True, null=True
    )

    valide = models.BooleanField(default=False)
    reserve = models.BooleanField(default=False)
    motif = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.titre

    def clean(self):
        """
        Assure qu'un thème est lié à une année académique.
        """
        if not self.annee_academique_id:
            raise ValidationError("Un thème doit être lié à une année académique.")


class ThemeSpecialite(models.Model):
    theme = models.ForeignKey(Theme, on_delete=models.CASCADE, related_name='theme_specialites')
    specialite_id = models.IntegerField(
        validators=[validate_specialite_id],
        blank=True, null=True
    )
    priorite = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = ['theme', 'specialite_id']

    def __str__(self):
        return f"{self.theme.titre} - Spécialité {self.specialite_id or 'N/A'} - Priorité {self.priorite}"
