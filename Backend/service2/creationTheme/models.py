

import datetime
import requests
from django.db import models
from django.core.exceptions import ValidationError

SERVICE_1_URL = "http://localhost:8000"  # Replace with actual Service 1 URL


def generate_annee_academique_id():
    current_year = datetime.datetime.now().year
    return f"{current_year}/{current_year + 1}"


def validate_specialite_id(specialite_id):
    if specialite_id:
        response = requests.get(f"{SERVICE_1_URL}/specialites/{specialite_id}/")
        if response.status_code != 200:
            raise ValidationError(f"L'ID spécialité '{specialite_id}' est introuvable dans le service 1.")


def validate_annee_id(annee_id):
    if annee_id:
        response = requests.get(f"{SERVICE_1_URL}/annees/{annee_id}/")
        if response.status_code != 200:
            raise ValidationError(f"L'ID année '{annee_id}' est introuvable dans le service 1.")


# class Priority(models.Model):
#     level = models.PositiveIntegerField(unique=True)

#     def __str__(self):
#         return str(self.level)


class Theme(models.Model):
    titre = models.CharField(max_length=50)
    resume = models.TextField(null=True)
    outils_et_language = models.TextField(null=True)
    plan_travail = models.TextField(null=True)
    livrable = models.TextField(blank=True, null=True)

    annee_academique_id = models.CharField(
        max_length=9,
        default=generate_annee_academique_id,
        editable=False
    )

    valide = models.BooleanField(default=False, null=True)
    reserve = models.BooleanField(default=False, null=True)
    motif = models.TextField(blank=True, null=True)

    enseignant_id = models.IntegerField(null=True, blank=True)
    entreprise_id = models.IntegerField(null=True, blank=True)

    # Removed: specialite_id and priorite
    annee_id = models.IntegerField(null=True)

    # 👇 New field for multiple specialité + priorité
    priorities = models.JSONField(
        default=list,
        blank=True,
        null=True,
        help_text="Liste d'objets avec format: [{'priorite': 1, 'specialite_id': 5}, ...]"
    )

    option_pdf = models.FileField(upload_to='pdfs/', blank=True, null=True)

    def __str__(self):
        return self.titre

    def clean(self):
        validate_annee_id(self.annee_id)

        if self.priorities:
            for item in self.priorities:
                if 'specialite_id' in item:
                    validate_specialite_id(item['specialite_id'])

        if self.enseignant_id:
            response = requests.get(f"{SERVICE_1_URL}/enseignants/{self.enseignant_id}/")
            if response.status_code != 200:
                raise ValidationError(f"L'ID enseignant '{self.enseignant_id}' est introuvable dans le service 1.")

        if self.entreprise_id:
            response = requests.get(f"{SERVICE_1_URL}/entreprises/{self.entreprise_id}/")
            if response.status_code != 200:
                raise ValidationError(f"L'ID entreprise '{self.entreprise_id}' est introuvable dans le service 1.")
