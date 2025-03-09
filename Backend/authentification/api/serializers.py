from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from api.models import Admin, Enseignant, Etudiant
from django.contrib.auth import authenticate
import secrets

from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "nom", "prenom", "password", "is_staff", "is_superuser"]
        extra_kwargs = {"password": {"write_only": True, "required": False}}

    def create(self, validated_data):
        if "password" not in validated_data or not validated_data["password"]:
            generated_password = secrets.token_urlsafe(8)  # Générer un mot de passe
            validated_data["password"] = make_password(generated_password)  # Hasher et stocker
            self.generated_password = generated_password  # Stocker pour l'email

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
        fields = UserSerializer.Meta.fields

class EtudiantSerializer(UserSerializer):
    class Meta(UserSerializer.Meta):
        model = Etudiant
        fields = UserSerializer.Meta.fields + ["annee_etude", "moyenne_etudiant", "matricule", "chef_equipe","is_active","password"]



from django.contrib.auth import authenticate

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if email and password:
            user = authenticate(username=email, password=password)  # Change this
            if user is None:
                user = User.objects.filter(email=email).first()  # Try getting user manually
                if user and user.check_password(password):  # Verify password manually
                    user = user  
                else:
                    raise serializers.ValidationError("Email ou mot de passe incorrect.")

            if not user.is_active:
                raise serializers.ValidationError("User account is disabled.")

            # Identify the user type
            user_type = "unknown"
            if user.is_superuser:
                user_type = "admin"
            elif hasattr(user, 'enseignant'):
                user_type = "enseignant"
            elif hasattr(user, 'etudiant'):
                user_type = "etudiant"

            # User info response
            user_info = {
                "id": user.id,
                "email": user.email,
                "nom": user.nom,
                "prenom": user.prenom,
                "type": user_type
            }

            if user_type == "etudiant":
                user_info.update({
                    "annee_etude": user.etudiant.annee_etude,
                    "moyenne": user.etudiant.moyenne_etudiant,
                    "matricule": user.etudiant.matricule,
                    "chef_equipe": user.etudiant.chef_equipe
                })
            elif user_type == "enseignant":
                user_info.update({
                    "grade": ""
                })

            data['user'] = user
            data["user_info"] = user_info
        else:
            raise serializers.ValidationError("Veuillez entrer votre email et mot de passe.")

        return data
