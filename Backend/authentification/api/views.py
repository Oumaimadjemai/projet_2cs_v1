from rest_framework import generics
from .models import *
from .serializers import *
import pandas as pd
from django.http import JsonResponse
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser
import secrets
from django.core.mail import send_mail
from django.contrib.auth.hashers import make_password
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken




class EtudiantListCreateView(generics.ListCreateAPIView):
    queryset = Etudiant.objects.all()
    serializer_class = EtudiantSerializer

    def perform_create(self, serializer):
      user = serializer.save()
      generated_password = getattr(user, "generated_password", "Erreur de récupération")  # Récupère le mot de passe

      subject = "Votre compte a été créé"
      message = f"""
     Bonjour {user.prenom} {user.nom},

     Votre compte a été créé avec succès.

    🔹 Email : {user.email}
    🔹 Mot de passe : {generated_password}

    📌 Veuillez vous connecter et changer votre mot de passe dès que possible.

    Cordialement,  
    L'équipe de gestion
    """
      send_mail(subject, message, 'your-email@gmail.com', [user.email], fail_silently=False)



class EtudiantRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Etudiant.objects.all()
    serializer_class = EtudiantSerializer


class EnseignantListCreateView(generics.ListCreateAPIView):
    queryset = Enseignant.objects.all()
    serializer_class = EnseignantSerializer
    

    def perform_create(self, serializer):
     user = serializer.save()
     generated_password = getattr(user, "generated_password", "Erreur de récupération")  # Récupère le mot de passe

     subject = "Votre compte a été créé"
     message = f"""
     Bonjour {user.prenom} {user.nom},

     Votre compte a été créé avec succès.

    🔹 Email : {user.email}
    🔹 Mot de passe : {generated_password}

    📌 Veuillez vous connecter et changer votre mot de passe dès que possible.

    Cordialement,  
    L'équipe de gestion
    """
     send_mail(subject, message, 'your-email@gmail.com', [user.email], fail_silently=False)



class EnseignantRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Enseignant.objects.all()
    serializer_class = EnseignantSerializer


class AdminListCreateView(generics.ListCreateAPIView):
    queryset = Admin.objects.all()
    serializer_class = AdminSerializer

    def perform_create(self, serializer):
     user = serializer.save()
     generated_password = getattr(user, "generated_password", "Erreur de récupération")  # Récupère le mot de passe

     subject = "Votre compte a été créé"
     message = f"""
     Bonjour {user.prenom} {user.nom},

     Votre compte a été créé avec succès.

    🔹 Email : {user.email}
    🔹 Mot de passe : {generated_password}

    📌 Veuillez vous connecter et changer votre mot de passe dès que possible.

    Cordialement,  
    L'équipe de gestion
    """
     send_mail(subject, message, 'your-email@gmail.com', [user.email], fail_silently=False)



class AdminRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Admin.objects.all()
    serializer_class = AdminSerializer


@api_view(['POST'])
@parser_classes([MultiPartParser])
def import_users(request, user_type):
    """
    Importe des utilisateurs (étudiants, enseignants ou admins) depuis un fichier.
    user_type: 'etudiant', 'enseignant' ou 'admin'
    """
    file = request.FILES.get('file')

    if not file:
        return JsonResponse({'error': 'No file provided'}, status=400)

    try:
        if file.name.endswith('xlsx'):
            df = pd.read_excel(file)
        elif file.name.endswith('txt') or file.name.endswith('csv'):
            df = pd.read_csv(file, delimiter=",")
        else:
            return JsonResponse({'error': 'Invalid file format. Use .xlsx or .txt/.csv'}, status=400)

        user_model = None
        if user_type == 'etudiant':
            user_model = Etudiant
        elif user_type == 'enseignant':
            user_model = Enseignant
        elif user_type == 'admin':
            user_model = Admin
        else:
            return JsonResponse({'error': 'Invalid user type'}, status=400)

        users = []
        email_messages = []

        for _, row in df.iterrows():
            try:
                generated_password = secrets.token_urlsafe(8)

                # Convertir le matricule en string s'il est en notation scientifique
                matricule = str(row.get('matricule', '')).split('.')[0]

                user = user_model(
                    nom=row['nom'],
                    prenom=row['prenom'],
                    email=row['email'],
                    password=make_password(generated_password),
                )

                if user_type == 'etudiant':
                    user.annee_etude = row.get('annee_etude', None)
                    user.moyenne_etudiant = row.get('moyenne_etudiant', None)
                    user.matricule = matricule

                user.save()  # Enregistrement un par un

                # Préparer l'email de confirmation
                subject = "Votre compte a été créé"
                message = f"""
                Bonjour {row['prenom']} {row['nom']},

                Votre compte a été créé avec succès.

                🔹 Email : {row['email']}
                🔹 Mot de passe : {generated_password}

                📌 Veuillez vous connecter et changer votre mot de passe dès que possible.

                Cordialement,  
                L'équipe de gestion
                """
                send_mail(subject, message, 'your-email@gmail.com', [row['email']], fail_silently=False)

            except KeyError:
                return JsonResponse({'error': 'Invalid file structure'}, status=400)

        return JsonResponse({'message': f'{len(users)} {user_type}s importés avec succès, emails envoyés !'})

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)





class UserLoginView(APIView):
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user_info':serializer.validated_data["user_info"]
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

User = get_user_model()

class RequestPasswordResetView(APIView):
    def post(self, request):
        email = request.data.get("email")
        try:
            user = User.objects.get(email=email)
            token = PasswordResetTokenGenerator().make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            reset_url = f"http://127.0.0.1:8000/password-reset-confirm/?uid={uid}&token={token}"
            
            subject = "Réinitialisation de votre mot de passe"
            message = f"""
            Bonjour {user.prenom},

            Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le lien ci-dessous pour le réinitialiser :

            🔗 {reset_url}

            Si vous n'avez pas fait cette demande, ignorez simplement cet email.

            Cordialement,
            L'équipe de gestion.
            """
            send_mail(subject, message, "your-email@gmail.com", [user.email], fail_silently=False)
            return Response({"message": "Email de réinitialisation envoyé."}, status=status.HTTP_200_OK)
        
        except User.DoesNotExist:
            return Response({"error": "Utilisateur non trouvé."}, status=status.HTTP_404_NOT_FOUND)

class PasswordResetConfirmView(APIView):
    def post(self, request):
        uid = request.data.get("uid")
        token = request.data.get("token")
        new_password = request.data.get("new_password")

        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=user_id)

            if PasswordResetTokenGenerator().check_token(user, token):
                user.set_password(new_password)
                user.save()
                return Response({"message": "Mot de passe réinitialisé avec succès."}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Token invalide ou expiré."}, status=status.HTTP_400_BAD_REQUEST)

        except (User.DoesNotExist, ValueError):
            return Response({"error": "Lien invalide."}, status=status.HTTP_400_BAD_REQUEST)
        



class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()  # Blacklist le token
            return Response({"message": "Déconnexion réussie."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": "Token invalide."}, status=status.HTTP_400_BAD_REQUEST)



User = get_user_model()

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")

        if not user.check_password(old_password):
            return Response({"error": "Ancien mot de passe incorrect."}, status=status.HTTP_400_BAD_REQUEST)

        if old_password == new_password:
            return Response({"error": "Le nouveau mot de passe doit être différent de l'ancien."}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        return Response({"message": "Mot de passe modifié avec succès."}, status=status.HTTP_200_OK)
