
# import requests
# from django.db import models
# from django.core.exceptions import ValidationError

# SERVICE_1_URL = "http://localhost:8000"


# def validate_specialite_id(specialite_id):
#     if specialite_id:  
#         response = requests.get(f"{SERVICE_1_URL}/specialites/{specialite_id}/")
#         if response.status_code != 200:
#             raise ValidationError(f"L'ID spécialité '{specialite_id}' est introuvable dans le service 1.")

# def validate_annee_academique_id(annee_academique_id):
#     if annee_academique_id:
#         response = requests.get(f"{SERVICE_1_URL}/annees/{annee_academique_id}/")
#         if response.status_code != 200:
#             raise ValidationError(f"L'ID année académique '{annee_academique_id}' est introuvable dans le service 1.")


# class Theme(models.Model):
#     titre = models.CharField(max_length=50)
#     resume = models.TextField()
#     outils_et_language = models.TextField()
#     plan_travail = models.TextField()
#     livrable = models.TextField(blank=True, null=True)

    
#     annee_academique_id = models.IntegerField(
#         validators=[validate_annee_academique_id],
#         blank=True, null=True
#     )

#     valide = models.BooleanField(default=False)
#     reserve = models.BooleanField(default=False)
#     motif = models.TextField(blank=True, null=True)

#     def __str__(self):
#         return self.titre

#     def clean(self):
#         """
#         Assure qu'un thème est lié à une année académique.
#         """
#         if not self.annee_academique_id:
#             raise ValidationError("Un thème doit être lié à une année académique.")


# class ThemeSpecialite(models.Model):
#     theme = models.ForeignKey(Theme, on_delete=models.CASCADE, related_name='theme_specialites')
#     specialite_id = models.IntegerField(
#         validators=[validate_specialite_id],
#         blank=True, null=True
#     )
#     priorite = models.PositiveIntegerField(default=1)

#     class Meta:
#         unique_together = ['theme', 'specialite_id']

#     def __str__(self):
#         return f"{self.theme.titre} - Spécialité {self.specialite_id or 'N/A'} - Priorité {self.priorite}"







# ________________good empty table theme_specialites________________
# import requests
# from django.db import models
# from django.core.exceptions import ValidationError
# import datetime

# SERVICE_1_URL = "http://localhost:8000"  # Replace with actual Service 1 URL

# def generate_annee_academique_id():
#     """
#     Generate the academic year ID in the format 'YYYY/YYYY+1', e.g., '2024/2025'.
#     """
#     current_year = datetime.datetime.now().year
#     return f"{current_year}/{current_year + 1}"

# def validate_specialite_id(specialite_id):
#     """
#     Validates if the specialite_id exists in Service 1.
#     """
#     if specialite_id:
#         response = requests.get(f"{SERVICE_1_URL}/specialites/{specialite_id}/")
#         if response.status_code != 200:
#             raise ValidationError(f"L'ID spécialité '{specialite_id}' est introuvable dans le service 1.")

# def validate_annee_id(annee_id):
#     """
#     Validates if the annee_id exists in Service 1.
#     """
#     if annee_id:
#         response = requests.get(f"{SERVICE_1_URL}/annees/{annee_id}/")
#         if response.status_code != 200:
#             raise ValidationError(f"L'ID année '{annee_id}' est introuvable dans le service 1.")

# class Theme(models.Model):
#     titre = models.CharField(max_length=50)
#     resume = models.TextField()
#     outils_et_language = models.TextField()
#     plan_travail = models.TextField()
#     livrable = models.TextField(blank=True, null=True)

#     # Utilisation d'un entier pour l'année académique
#     annee_academique_id = models.CharField(
#         max_length=9,  # To store the format 'YYYY/YYYY+1'
#         default=generate_annee_academique_id,
#         editable=False
#     )

#     valide = models.BooleanField(default=False, null=True)
#     reserve = models.BooleanField(default=False, null=True)
#     motif = models.TextField(blank=True, null=True)

#     enseignant_id = models.IntegerField(null=True, blank=True)  # 🔹 Ajout de la relation avec Enseignant
#     entreprise_id = models.IntegerField(null=True, blank=True)  # 🔹 Ajout de la relation avec Entreprise

#     def str(self):
#         return self.titre


# class ThemeSpecialite(models.Model):
#     theme = models.ForeignKey(Theme, on_delete=models.CASCADE, related_name='theme_specialites')
#     specialite_id = models.IntegerField(blank=True, null=True)
#     priorite = models.PositiveIntegerField(default=1)
#     annee_id = models.IntegerField(null=True)

#     class Meta:
#         unique_together = ['theme', 'specialite_id']

#     def str(self):
#         return f"{self.theme.titre} - Spécialité {self.specialite_id or 'N/A'} - Priorité {self.priorite}"

#     def clean(self):
#         """
#         Validate specialite_id and annee_id exist in Service 1.
#         """
#         validate_specialite_id(self.specialite_id)
#         validate_annee_id(self.annee_id)  # Utilisation correcte de 'annee_id' comme entier
        
#         if self.enseignant_id:
#             response = requests.get(f"{SERVICE_1_URL}/enseignants/{self.enseignant_id}/")
#             if response.status_code != 200:
#                 raise ValidationError(f"L'ID enseignant '{self.enseignant_id}' est introuvable dans le service 1.")
        
#         if self.entreprise_id:
#             response = requests.get(f"{SERVICE_1_URL}/entreprises/{self.entreprise_id}/")
#             if response.status_code != 200:
#                 raise ValidationError(f"L'ID entreprise '{self.entreprise_id}' est introuvable dans le service 1.")






import requests
from django.db import models
from django.core.exceptions import ValidationError
import datetime

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

class Priority(models.Model):
    level = models.PositiveIntegerField(unique=True)

    def __str__(self):
        return str(self.level)

class Theme(models.Model):
    titre = models.CharField(max_length=50)
    resume = models.TextField()
    outils_et_language = models.TextField()
    plan_travail = models.TextField()
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

    specialite_id = models.IntegerField(blank=True, null=True)
    annee_id = models.IntegerField(null=True)
    priorite = models.ForeignKey(Priority, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.titre

    def clean(self):
        validate_specialite_id(self.specialite_id)
        validate_annee_id(self.annee_id)

        if self.enseignant_id:
            response = requests.get(f"{SERVICE_1_URL}/enseignants/{self.enseignant_id}/")
            if response.status_code != 200:
                raise ValidationError(f"L'ID enseignant '{self.enseignant_id}' est introuvable dans le service 1.")

        if self.entreprise_id:
            response = requests.get(f"{SERVICE_1_URL}/entreprises/{self.entreprise_id}/")
            if response.status_code != 200:
                raise ValidationError(f"L'ID entreprise '{self.entreprise_id}' est introuvable dans le service 1.")
