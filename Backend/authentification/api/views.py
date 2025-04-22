from rest_framework import generics,status
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
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth import get_user_model






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

#parametres
class DepartementListCreateView(generics.ListCreateAPIView):
    queryset = Departement.objects.all()
    serializer_class = DepartementSerializer
    def create(self, request, *args, **kwargs):
        is_many = isinstance(request.data, list)
        serializer = self.get_serializer(data=request.data, many=is_many)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class DepartementRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Departement.objects.all()
    serializer_class = DepartementSerializer

class AnneeListCreateView(generics.ListCreateAPIView):
    queryset = Annee.objects.all()
    serializer_class = AnneeSerializer
    def create(self, request, *args, **kwargs):
        is_many = isinstance(request.data, list)
        serializer = self.get_serializer(data=request.data, many=is_many)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class AnneeRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Annee.objects.all()
    serializer_class = AnneeSerializer
    

class SpecialiteListCreateView(generics.ListCreateAPIView):
    queryset = Specialite.objects.all()
    serializer_class = SpecialiteSerializer
    def create(self, request, *args, **kwargs):
        is_many = isinstance(request.data, list)
        serializer = self.get_serializer(data=request.data, many=is_many)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class SpecialiteRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Specialite.objects.all()
    serializer_class = SpecialiteSerializer

class SalleListCreateView(generics.ListCreateAPIView):
    queryset = Salle.objects.all()
    serializer_class = SalleSerializer
    def create(self, request, *args, **kwargs):
        is_many = isinstance(request.data, list)
        serializer = self.get_serializer(data=request.data, many=is_many)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class SalleRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Salle.objects.all()
    serializer_class = SalleSerializer



class EntrepriseListCreateView(generics.ListCreateAPIView):
    queryset = Entreprise.objects.all()
    serializer_class = EntrepriseSerializer

    def get_queryset(self):
        statut = self.request.query_params.get('statut')
        if statut:
            return Entreprise.objects.filter(statut=statut)
        return Entreprise.objects.all()



class EntrepriseDeleteView(generics.DestroyAPIView):
    queryset = Entreprise.objects.all()

    def delete(self, request, *args, **kwargs):
        entreprise = self.get_object()
        entreprise.delete()
        return Response({"message": "Entreprise supprimée avec succès"}, status=status.HTTP_204_NO_CONTENT)

class EntrepriseValidationView(APIView):
    def patch(self, request, pk):
        try:
            entreprise = Entreprise.objects.get(pk=pk)

            if entreprise.statut != 'pending':
                return Response({"error": "L'entreprise a déjà été traitée."}, status=400)

            # Vérifier l'action demandée
            action = request.data.get("action")  # "approve" ou "reject"

            if action == "approve":
                # Vérification si un utilisateur existe déjà
                user = User.objects.filter(email=entreprise.representant_email).first()
                if user:
                    return Response({"error": "Un utilisateur avec cet email existe déjà."}, status=400)

                # Génération et création de l'utilisateur
                generated_password = secrets.token_urlsafe(10)
                user = User.objects.create_user(
                    email=entreprise.representant_email,
                    nom=entreprise.representant_nom,
                    prenom="",
                    password=generated_password
                )
                user.is_entreprise = True  # Attribuer le rôle si nécessaire
                user.save()

                # Associer l'entreprise à l'utilisateur
                entreprise.compte_utilisateur = user
                entreprise.statut = "approved"
                entreprise.save()

                # Envoi de l'email
                subject = "Validation de votre entreprise"
                message = f"""
                Bonjour {user.nom},

                Votre entreprise "{entreprise.nom}" a été validée avec succès.

                🔹 **Email** : {user.email}
                🔹 **Mot de passe** : {generated_password}

                📌 Veuillez vous connecter et changer votre mot de passe dès que possible.

                Cordialement,  
                L'équipe de gestion
                """
                send_mail(subject, message, 'your-email@gmail.com', [user.email], fail_silently=False)
                return Response({"message": "Entreprise validée avec succès."})

            elif action == "reject":
                motif_refus = request.data.get("motif_refus", "Aucun motif précisé")
                entreprise.statut = "rejected"
                entreprise.motif_refus = motif_refus
                entreprise.save()

                # Envoi de l'email de refus
                subject = "Refus de votre entreprise"
                message = f"""
                Bonjour {entreprise.representant_nom},

                Nous sommes désolés de vous informer que votre entreprise "{entreprise.nom}" n'a pas été validée.

                📌 **Motif du refus** : {motif_refus}

                Vous pouvez nous contacter pour plus d'informations.

                Cordialement,  
                L'équipe de gestion
                """
                send_mail(subject, message, 'your-email@gmail.com', [entreprise.representant_email], fail_silently=False)
                return Response({"message": "Entreprise refusée avec succès."})

            else:
                return Response({"error": "Action invalide. Utilisez 'approve' ou 'reject'."}, status=400)

        except Entreprise.DoesNotExist:
            return Response({"error": "Entreprise non trouvée."}, status=404)




User = get_user_model()

class UsersWithEntrepriseView(APIView):
    def get(self, request):
        # Récupérer les utilisateurs ayant une entreprise liée
        users = User.objects.filter(entreprise__isnull=False)  
        
        # Sérialiser les utilisateurs
        serializer = UserSerializer(users, many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)

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

class EnseignantDetailView(APIView):
    """
    Endpoint pour récupérer les informations d'un enseignant
    """
    def get(self, request, pk):
        try:
            enseignant = Enseignant.objects.get(id=pk)
            return Response({
                "id": enseignant.id,
                "nom": enseignant.nom,
                "prenom": enseignant.prenom
            })
        except Enseignant.DoesNotExist:
            return Response({"error": "Enseignant introuvable"}, status=status.HTTP_404_NOT_FOUND)

class EntrepriseDetailView(APIView):
    """
    Endpoint pour récupérer les informations d'une entreprise
    """
    def get(self, request, pk):
        try:
            entreprise = Entreprise.objects.get(id=pk)
            return Response({
                "id": entreprise.id,
                "nom": entreprise.nom
            })
        except Entreprise.DoesNotExist:
            return Response({"error": "Entreprise introuvable"}, status=status.HTTP_404_NOT_FOUND)


class VerifyUserAPIView(APIView):
    """
    Vérifie si l'utilisateur est un enseignant ou une entreprise.
    """

    def get(self, request):
        user = request.user
        if not user.is_authenticated:
            return Response(
                {"error": "Utilisateur non authentifié"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        return Response({
            "is_enseignant": user.is_enseignant(),
            "is_entreprise": user.is_entreprise(),
            "user_id": user.id
        })


from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Etudiant, Enseignant, Admin, Entreprise

User = get_user_model()

@api_view(['GET'])
def get_user_by_email(request):
    email = request.query_params.get('email')
    if not email:
        return Response({'error': 'Email manquant dans les paramètres'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=email)

        # Déterminer le type d'utilisateur
        if hasattr(user, 'etudiant'):
            user_type = 'etudiant'
        elif hasattr(user, 'enseignant'):
            user_type = 'enseignant'
        elif hasattr(user, 'admin'):
            user_type = 'admin'
        elif Entreprise.objects.filter(compte_utilisateur=user).exists():
            user_type = 'entreprise'
        else:
            user_type = 'utilisateur'

        data = {
            'id': user.id,
            'nom': user.nom,
            'prenom': user.prenom,
            'email': user.email,
            'type': user_type,
            'photo_profil': str(user.photo_profil) if user.photo_profil else None,
        }

        # Ajouter infos spécifiques si étudiant
        if user_type == 'etudiant':
            etu = user.etudiant
            data.update({
                'matricule': etu.matricule,
                'annee': etu.annee_etude.title if etu.annee_etude else None,
                'specialite': etu.specialite.title if etu.specialite else None,
                'moyenne': etu.moyenne_etudiant,
                'chef_equipe': etu.chef_equipe
            })

        return Response(data, status=status.HTTP_200_OK)

    except User.DoesNotExist:
        return Response({'error': 'Utilisateur non trouvé'}, status=status.HTTP_404_NOT_FOUND)



from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Etudiant, Annee, Specialite
from .serializers import EtudiantSerializer

class EtudiantsByAnneeView(APIView):
    def get(self, request, annee_id):
        etudiants = Etudiant.objects.filter(annee_etude__id=annee_id)
        serializer = EtudiantSerializer(etudiants, many=True)
        return Response(serializer.data)

class EtudiantsByAnneeAndSpecialiteView(APIView):
    def get(self, request, annee_id, specialite_id):
        etudiants = Etudiant.objects.filter(annee_etude__id=annee_id, specialite__id=specialite_id)
        serializer = EtudiantSerializer(etudiants, many=True)
        return Response(serializer.data)

class EtudiantsByAnneeWithoutSpecialiteView(APIView):
    def get(self, request, annee_id):
        etudiants = Etudiant.objects.filter(annee_etude__id=annee_id, specialite__isnull=True)
        serializer = EtudiantSerializer(etudiants, many=True)
        return Response(serializer.data)

class AnneeByDepartementView(APIView):
    def get(self, request, departement_id):
        annees = Annee.objects.filter(departement__id=departement_id)
        serializer = AnneeSerializer(annees, many=True)
        return Response(serializer.data)
# class SpecialiteByAnneeView(APIView):
#     def get(self, request, annee_id):
#         specialites = Specialite.objects.filter(annee__id=annee_id)
#         serializer = SpecialiteSerializer(specialites, many=True)
#         return Response(serializer.data)
# class SpecialiteByAnneeAndDepartementView(APIView):
#     def get(self, request, annee_id, departement_id):
#         specialites = Specialite.objects.filter(
#             annee__id=annee_id,
#             annee__departement__id=departement_id
#         )
#         serializer = SpecialiteSerializer(specialites, many=True)
#         return Response(serializer.data)
class SalleByDepartementView(APIView):
    def get(self, request, departement_id):
        salles = Salle.objects.filter(departement__id=departement_id)
        serializer = SalleSerializer(salles, many=True)
        return Response(serializer.data)

