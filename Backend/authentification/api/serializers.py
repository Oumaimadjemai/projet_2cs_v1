from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from api.models import *
from django.contrib.auth import authenticate
import secrets
import cloudinary.uploader

from rest_framework_simplejwt.tokens import RefreshToken
    
class AnneeAcademiqueSerializer(serializers.ModelSerializer):
    class Meta:
        model=AnneeAcademique
        fields='__all__'
    
    def validate(self, data):
    # On utilise les valeurs actuelles si elles ne sont pas dans data (cas du PATCH partiel)
        date_debut = data.get('date_debut', self.instance.date_debut if self.instance else None)
        date_fin = data.get('date_fin', self.instance.date_fin if self.instance else None)

        if not date_debut or not date_fin:
            raise serializers.ValidationError("Les deux dates doivent être renseignées.")

        if date_debut >= date_fin:
            raise serializers.ValidationError("La date de début doit être antérieure à la date de fin.")

        year_str = f"{date_debut.year}/{date_fin.year}"

    # Exclure l’instance actuelle pour éviter les faux positifs lors de la mise à jour
        qs = AnneeAcademique.objects.filter(year=year_str)
        if self.instance:
           qs = qs.exclude(pk=self.instance.pk)

        if qs.exists():
           raise serializers.ValidationError(f"L'année académique {year_str} existe déjà.")

        return data


class DepartementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Departement
        fields = '__all__'

class AnneeSerializer(serializers.ModelSerializer):
    # Add the departement's title to the serialized data
    departement_title = serializers.CharField(source='departement.title', read_only=True)

    class Meta:
        model = Annee
        fields = '__all__'  # You can keep '__all__' or explicitly list the fields if needed

class SpecialiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Specialite
        fields = '__all__'

class SalleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Salle
        fields = '__all__'  

class PeriodeSerializer(serializers.ModelSerializer):
    class Meta:
        model=Periode
        fields='__all__'

class Parametre_groupSerializer(serializers.ModelSerializer):
    class Meta:
        model=Parametre_group
        fields='__all__'
    def validate(self, data):
        annee = data.get('annee') or getattr(self.instance, 'annee', None)
        type_value = data.get('type') or getattr(self.instance, 'type', None)

        if annee and annee.title == "3" and annee.departement and annee.departement.title.lower() == "cs":
            if not type_value:
                raise serializers.ValidationError("Le type de groupe est obligatoire pour la 3CS.")

        return data

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    photo_profil = serializers.ImageField(required=False) 
    class Meta:
        model = User
        fields = ["id", "email", "nom", "prenom", "password", "is_staff", "is_superuser","photo_profil"]
        extra_kwargs = {"password": {"write_only": True, "required": False}}

    def create(self, validated_data):
        photo = validated_data.pop("Photo_profil", None)
        if "password" not in validated_data or not validated_data["password"]:
            generated_password = secrets.token_urlsafe(8)  # Générer un mot de passe
            validated_data["password"] = make_password(generated_password)  # Hasher et stocker
            self.generated_password = generated_password  # Stocker pour l'email
        if photo:
            result = cloudinary.uploader.upload(photo)
            validated_data["Photo_profil"] = result["secure_url"]
        user = super().create(validated_data)
        user.generated_password = getattr(self, "generated_password", None)  # Ajouter au user
        return user

class AdminSerializer(UserSerializer):
    class Meta(UserSerializer.Meta):
        model = Admin  # Utilise le modèle Admin
        fields = UserSerializer.Meta.fields  # Ajoute les champs spécifiques

class EnseignantSerializer(UserSerializer):
    class Meta(UserSerializer.Meta):
        model = Enseignant
        fields = UserSerializer.Meta.fields +["matricule","grade"]

class EtudiantSerializer(UserSerializer):
    class Meta(UserSerializer.Meta):
        model = Etudiant
        fields = UserSerializer.Meta.fields + ["annee_etude", "moyenne_etudiant", "matricule", "chef_equipe","is_active","password","specialite"]

from rest_framework import serializers
from django.utils.crypto import get_random_string
from django.contrib.auth import get_user_model
from .models import Entreprise

User = get_user_model()

class EntrepriseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Entreprise
        fields = '__all__'

class EntrepriseValidationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Entreprise
        fields = ['statut', 'motif_refus']

    def update(self, instance, validated_data):
        statut = validated_data.get('statut', instance.statut)
        motif_refus = validated_data.get('motif_refus', '')

        if statut == 'approved':
            password = get_random_string(12)
            user = User.objects.create_user(
                email=instance.representant_email,
                nom=instance.representant_nom,
                prenom='',
                password=password
            )
            instance.compte_utilisateur = user
            instance.statut = 'approved'
            instance.save()

            # On passe le mot de passe généré pour l'envoyer dans `views.py`
            self.context['password'] = password  

        elif statut == 'rejected':
            instance.statut = 'rejected'
            instance.motif_refus = motif_refus
            instance.save()

        return instance



from django.contrib.auth import authenticate, get_user_model

User = get_user_model()

from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, Entreprise

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if email and password:
            user = authenticate(username=email, password=password)  # Auth classique
            if user is None:
                user = User.objects.filter(email=email).first()  # Récupérer l'utilisateur manuellement
                if user and user.check_password(password):
                    user = user  
                else:
                    raise serializers.ValidationError("Email ou mot de passe incorrect.")

            if not user.is_active:
                raise serializers.ValidationError("Le compte utilisateur est désactivé.")

            # Identifier le type d'utilisateur
            user_type = "unknown"
            if user.is_superuser:
                user_type = "admin"
            elif hasattr(user, 'enseignant'):
                user_type = "enseignant"
            elif hasattr(user, 'etudiant'):
                user_type = "etudiant"
            elif Entreprise.objects.filter(compte_utilisateur=user).exists():  # Vérifier si c'est une entreprise
                user_type = "entreprise"
                entreprise = Entreprise.objects.get(compte_utilisateur=user)

            # Construire la réponse user_info
            user_info = {
                "id": user.id,
                "email": user.email,
                "nom": user.nom,
                "prenom": user.prenom,
                "type": user_type
            }

            # Ajouter les détails en fonction du type d'utilisateur
            if user_type == "etudiant":
                if user.etudiant:  # Vérifier si l'utilisateur est bien associé à un étudiant
                    user_info.update({
                        "annee_etude": user.etudiant.annee_etude.id if user.etudiant.annee_etude else None,
                        "moyenne": user.etudiant.moyenne_etudiant,
                        "matricule": user.etudiant.matricule,
                        "chef_equipe": user.etudiant.chef_equipe,
                        "specialite": user.etudiant.specialite.id if user.etudiant.specialite else None
                    })
                else:
                    raise serializers.ValidationError("Cet utilisateur n'est pas associé à un étudiant valide.")
            elif user_type == "enseignant":
                if user.enseignant:
                    user_info.update({
                        "matricule":user.enseignant.matricule,
                        "grade":user.enseignant.grade
                    })
            elif user_type == "entreprise":
                if entreprise:
                    user_info.update({
                        "entreprise_id": entreprise.id,
                        "nom_entreprise": entreprise.nom,
                        "secteur_activite": entreprise.secteur_activite,
                        "adresse": entreprise.adresse,
                        "wilaya": entreprise.wilaya,
                        "ville": entreprise.ville,
                        "site_web": entreprise.site_web,
                        "statut": entreprise.statut
                    })
                else:
                    raise serializers.ValidationError("Entreprise non trouvée pour cet utilisateur.")

            data['user'] = user
            data["user_info"] = user_info
        else:
            raise serializers.ValidationError("Veuillez entrer votre email et mot de passe.")

        return data

