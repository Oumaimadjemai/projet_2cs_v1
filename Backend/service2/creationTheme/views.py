
from django.conf import settings
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

#from Backend.service2.service2 import settings
from .models import Theme
from .serializers import ThemeSerializer
from .utils import verify_user
from django.http import Http404, HttpResponse, FileResponse
from weasyprint import HTML
import os
import requests
from django.template.loader import render_to_string
from django.core.files.base import ContentFile  # Import pour sauvegarder le PDF
from urllib.parse import urljoin
from .discovery import discover_service

# External service URLs
# SERVICE_1_URL = "http://localhost:8000"
# SERVICE_2_URL = "http://localhost:8001"
SERVICE1_APP = 'SERVICE1-CLIENT'  # Nom utilisé dans Eureka
import requests
import xml.etree.ElementTree as ET

def get_service1_url():
    try:
        res = requests.get("http://localhost:8761/eureka/apps/SERVICE1-CLIENT", headers={'Accept': 'application/json'})
        instances = res.json()['application']['instance']
        # If multiple instances, take the first one
        instance = instances[0] if isinstance(instances, list) else instances
        host = instance['hostName']
        port = instance['port']['$']
        return f"http://{host}:{port}"
    except Exception as e:
        print("Error resolving service1 from Eureka:", e)
        return "http://localhost:8000"  # Fallback

def get_notification_service_url():
    
    try:
        # Fetch SERVICE6-NOTIFICATIONS instances from Eureka
        res = requests.get(
            "http://localhost:8761/eureka/apps/SERVICE6-NOTIFICATIONS",
            headers={'Accept': 'application/json'}
        )
        res.raise_for_status()
        
        instances = res.json()['application']['instance']
        
        instance = instances[0] if isinstance(instances, list) else instances
    
        host = instance['hostName']
        port = instance['port']['$']
        return f"http://{host}:{port}"
        
    except Exception as e:
        print(f"Error resolving SERVICE6-NOTIFICATIONS from Eureka: {str(e)}")
        return "http://localhost:4000"

# 🔁 Helpers
def get_nom_annee(annee_id):
    if annee_id:
        base = get_service1_url()
        response = requests.get(f"{base}/annees/{annee_id}/")
        if response.status_code == 200:
            return response.json().get("title", "N/A")
    return "N/A"

def get_nom_specialite(specialite_id):
    if specialite_id:
        base = get_service1_url()
        response = requests.get(f"{base}/specialites/{specialite_id}/")
        if response.status_code == 200:
            return response.json().get("title", "N/A")
    return "N/A"

def get_nom_enseignant(enseignant_id):
    if enseignant_id:
        base = get_service1_url()
        response = requests.get(f"{base}/enseignants/{enseignant_id}/")
        if response.status_code == 200:
            data = response.json()
            return f"{data.get('nom', '')} {data.get('prenom', '')}"
    return "N/A"

# 🚨 Modification ici : Générer le PDF et le sauvegarder dans le champ `option_pdf`
def generate_pdf(request, theme_id):
    theme = get_object_or_404(Theme, id=theme_id)

    logo_abspath = os.path.abspath(os.path.join(settings.BASE_DIR, 'static', 'logo.png'))
    logo_path = f'file:///{logo_abspath.replace(os.sep, "/")}'  # Remplacer les séparateurs de chemin

    # Contexte de génération du PDF
    context = {
        'theme': theme,
        'encadreur': get_nom_enseignant(theme.enseignant_id),
        'logo_path': logo_path
    }

    # Générer le HTML pour le PDF
    html_string = render_to_string('theme_pdf_template.html', context)
    html = HTML(string=html_string)
    pdf_content = html.write_pdf()

    # 🚨 Modification ici : Sauvegarde du PDF dans le champ `option_pdf` du modèle `Theme`
    theme.option_pdf.save(f'fiche_projet_{theme.titre}.pdf', ContentFile(pdf_content))  # Sauvegarde du fichier PDF

    # Retourner le PDF en réponse
    response = HttpResponse(pdf_content, content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="fiche_projet_{theme.titre}.pdf"'
    return response


# 🌟 API to list and create themes
# class ThemeAPIView(APIView):

#     def get(self, request):
#         themes = Theme.objects.all()
#         serializer = ThemeSerializer(themes, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)

#     def post(self, request):
#         user_data = verify_user(request, role=["enseignant", "entreprise"])
#         if not user_data:
#             return Response({"detail": "Utilisateur non authentifié ou rôle incorrect"}, status=status.HTTP_400_BAD_REQUEST)

#         data = request.data.copy()
#         if user_data.get("is_enseignant"):
#             data['enseignant_id'] = user_data['user_id']
#         elif user_data.get("is_entreprise"):
#             data['entreprise_id'] = user_data['user_id']

#         serializer = ThemeSerializer(data=data)
#         if serializer.is_valid():
#             theme = serializer.save()

#             # 🚨 Modification ici : Appeler la fonction pour générer et sauvegarder le PDF
#             return generate_pdf(request, theme.id)

#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ThemeAPIView(APIView):
    
    def get(self, request):
        themes = Theme.objects.all()
        serializer = ThemeSerializer(themes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        # Verify user is enseignant or entreprise
        user_data = verify_user(request, role=["enseignant", "entreprise"])

        if not user_data or not (user_data.get("is_enseignant") or user_data.get("is_entreprise")):
            return Response(
                {"detail": "Accès refusé. Seuls les enseignants ou les entreprises peuvent créer un thème."},
                status=status.HTTP_403_FORBIDDEN
            )

        data = request.data.copy()

        # Associate user with theme
        if user_data.get("is_enseignant"):
            data['enseignant_id'] = user_data['user_id']
            creator_type = "enseignant"
        elif user_data.get("is_entreprise"):
            data['entreprise_id'] = user_data['user_id']
            # ⬇️ Gérer la convention si fournie
            if 'convention' in request.FILES:

               data['convention'] = request.FILES.get('convention')
            creator_type = "entreprise"

        serializer = ThemeSerializer(data=data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        theme = serializer.save()
        generate_pdf(request, theme.id)

        # Notify admins
        try:
            notification_service = get_notification_service_url()
            requests.post(
                f"{notification_service}/notify-admins",
                json={
                    "idSender": user_data['user_id'],
                    "title": "Nouveau thème créé",
                    "message": f"Nouveau thème créé : {theme.titre}",
                    "type": "CREATION_THEME",
                    "metadata": {
                        "resume": theme.resume,
                        "themeId": theme.id
                    }
                },
                timeout=3  # 3 seconds timeout
            )
        except Exception as e:
            print(f"Failed to notify admins: {e}")
            # Continue even if notification fails

        return Response(ThemeSerializer(theme).data, status=status.HTTP_201_CREATED)
    
        if serializer.is_valid():
            theme = serializer.save()

            # ✅ Génère automatiquement le PDF après la création du thème
            return generate_pdf(request, theme.id)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from .models import Theme
from .serializers import ThemeSerializer


def get_service3_url():
    try:
        res = requests.get("http://localhost:8761/eureka/apps/SERVICE3-NODE", headers={'Accept': 'application/json'})
        res.raise_for_status()
        instances = res.json()['application']['instance']
        instance = instances[0] if isinstance(instances, list) else instances
        host = instance['hostName']
        port = instance['port']['$']
        return f"http://{host}:{port}"
    except Exception as e:
        print("❌ Erreur découverte service 3 via Eureka:", e)
        return "http://localhost:3000"  


import os
import requests
from django.conf import settings
from django.template.loader import render_to_string
from django.core.files.base import ContentFile
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from weasyprint import HTML


def resolve_eureka_service_url(service_name, fallback_url):
    try:
        res = requests.get(f"http://localhost:8761/eureka/apps/{service_name.upper()}", timeout=3)
        res.raise_for_status()
        app = res.json()['application']['instance'][0]
        return f"http://{app['ipAddr']}:{app['port']['$']}"
    except Exception as e:
        print(f"[Eureka] Erreur de résolution pour {service_name}: {e}")
        return fallback_url

def get_service4_url():
    return resolve_eureka_service_url("SERVICE4-CLIENT", "http://localhost:8003")


import os
import requests
from django.conf import settings
from django.template.loader import render_to_string
from django.core.files.base import ContentFile
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from weasyprint import HTML



class ThemeWithGroupCreateView(APIView):
    permission_classes = []  # À adapter selon besoin (ex: IsAuthenticated)

    def post(self, request):
        # Vérification utilisateur et rôle enseignant
        user_data = verify_user(request, role=["enseignant"])
        if not user_data or not user_data.get("is_enseignant"):
            return Response({"detail": "Accès refusé."}, status=status.HTTP_403_FORBIDDEN)

        data = request.data.copy()
        data['enseignant_id'] = user_data['user_id']

        # Création du thème
        serializer = ThemeSerializer(data=data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        theme = serializer.save()

        # Validation champ members
        members = data.get('members')
        if not isinstance(members, list) or not members:
            theme.delete()
            return Response({"detail": "Le champ 'members' est requis."}, status=status.HTTP_400_BAD_REQUEST)

        # Création du groupe via SERVICE3
        group_payload = {
            "members": members,
            "theme_id": str(theme.id)  # Convertir en string si besoin
        }

        try:
            service3_url = get_service3_url()
            group_response = requests.post(
                f"{service3_url}/api/groups/create-group-with-members",
                json=group_payload,
                headers={"Authorization": request.headers.get("Authorization")},
                timeout=10
            )
            group_response.raise_for_status()
            group_data = group_response.json()
            group_id = group_data.get("group", {}).get("_id")

            # group_id = group_data.get("id") or group_data.get("_id")  # selon format de réponse
        except requests.RequestException as e:
            theme.delete()
            return Response({
                "detail": "Erreur lors de la création du groupe via SERVICE3.",
                "error": str(e)
            }, status=status.HTTP_502_BAD_GATEWAY)

        # Génération du PDF
        try:
            logo_abspath = os.path.abspath(os.path.join(settings.BASE_DIR, 'static', 'logo.png'))
            logo_path = f'file:///{logo_abspath.replace(os.sep, "/")}'
            context = {
                'theme': theme,
                'encadreur': get_nom_enseignant(theme.enseignant_id),
                'logo_path': logo_path
            }
            html_string = render_to_string('theme_pdf_template.html', context)
            pdf_content = HTML(string=html_string).write_pdf()
            theme.option_pdf.save(f'fiche_projet_{theme.titre}.pdf', ContentFile(pdf_content))
        except Exception as e:
            print("❌ Erreur lors de la génération du PDF:", e)

        # Affectation manuelle via SERVICE4 (avec token admin fixe)
        try:
            service4_url = get_service4_url()
            assign_payload = {
                "group_id": str(group_id),
                "theme_id": str(theme.id)
            }
            admin_auth_header = {"Authorization": settings.SERVICE4_ADMIN_TOKEN}

            assign_response = requests.post(
                f"{service4_url}/assign-manual/",
                json=assign_payload,
                headers=admin_auth_header,
                timeout=10
            )
            assign_response.raise_for_status()
            assignment_data = assign_response.json()
        except requests.RequestException as e:
            print("❌ Erreur lors de l'affectation manuelle (SERVICE4):", e)
            assignment_data = None

        return Response({
            "theme": ThemeSerializer(theme).data,
            "group": group_data,
            "assignment": assignment_data,
            "message": "Thème, groupe, PDF et assignation créés avec succès."
        }, status=status.HTTP_201_CREATED)

# 📄 Retrieve, Update, Delete single theme
class ThemeDetailAPIView(APIView):

    def get_object(self, pk):
        try:
            return Theme.objects.get(pk=pk)
        except Theme.DoesNotExist:
            return None

    def get(self, request, pk):
        theme = self.get_object(pk)
        if not theme:
            return Response({'error': 'Thème non trouvé.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = ThemeSerializer(theme)
        return Response(serializer.data)

    def put(self, request, pk):
        theme = self.get_object(pk)
        if not theme:
            return Response({'error': 'Thème non trouvé.'}, status=status.HTTP_404_NOT_FOUND)

        user_data = verify_user(request, role=["enseignant", "entreprise"])
        if user_data['user_id'] != theme.enseignant_id and user_data['user_id'] != theme.entreprise_id:
            return Response({'error': "Vous n'êtes pas autorisé à modifier ce thème."}, status=status.HTTP_403_FORBIDDEN)

        serializer = ThemeSerializer(theme, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        theme = self.get_object(pk)
        if not theme:
            return Response({'error': 'Thème non trouvé.'}, status=status.HTTP_404_NOT_FOUND)

        user_data = verify_user(request, role=["enseignant", "entreprise"])
        if user_data['user_id'] != theme.enseignant_id and user_data['user_id'] != theme.entreprise_id:
            return Response({'error': "Vous n'êtes pas autorisé à supprimer ce thème."}, status=status.HTTP_403_FORBIDDEN)

        theme.delete()
        return Response({'message': 'Thème supprimé avec succès.'}, status=status.HTTP_204_NO_CONTENT)

# 📚 Theme ViewSet (ex: by teacher)
class ThemeViewSet(viewsets.ViewSet):

    def get_themes_by_enseignant(self, request, enseignant_id):
        themes = Theme.objects.filter(enseignant_id=enseignant_id)
        serializer = ThemeSerializer(themes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    def get_themes_by_entreprise(self, request, entreprise_id):
        """
        Récupère les thèmes liés à un representant entreprise spécifique.
        """
        themes = Theme.objects.filter(entreprise_id=entreprise_id)
        serializer = ThemeSerializer(themes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
# Nouvelle vue pour retourner un PDF existant
class ThemePDFView(APIView):
    def get(self, request, theme_id):
        theme = get_object_or_404(Theme, id=theme_id)  # Récupérer le thème

        # Vérification si le fichier PDF existe
        if theme.option_pdf and os.path.exists(theme.option_pdf.path):
            # Si le PDF existe, retourner le fichier
            response = FileResponse(open(theme.option_pdf.path, 'rb'), content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="fiche_projet_{theme.titre}.pdf"'
            return response

        # Si le PDF n'existe pas, renvoyer une erreur
        return Response({'error': 'Le fichier PDF n\'existe pas pour ce thème.'}, status=status.HTTP_404_NOT_FOUND)



class AllThemePDFsView(APIView):
    def get(self, request):
        # Récupérer tous les thèmes qui ont un fichier PDF
        themes_with_pdfs = Theme.objects.filter(option_pdf__isnull=False)

        if not themes_with_pdfs:
            return Response({'message': 'Aucun PDF disponible pour les thèmes.'}, status=status.HTTP_404_NOT_FOUND)

        # Liste pour stocker les fichiers PDF disponibles
        pdf_files = []

        # Pour chaque thème avec un PDF, ajouter le fichier à la liste
        for theme in themes_with_pdfs:
            if theme.option_pdf:  # Vérifie si le fichier PDF est associé
                pdf_path = theme.option_pdf.path  # Récupérer le chemin du fichier PDF

                # Vérifie si le fichier PDF existe
                if os.path.exists(pdf_path):  
                    pdf_files.append({
                        'theme_id': theme.id,
                        'theme_title': theme.titre,
                        'pdf_url': request.build_absolute_uri(f"/themes/{theme.id}/pdf/")  # Générer l'URL du PDF
                    })
                else:
                    # Si le fichier n'existe pas, l'ajouter à la liste d'erreurs
                    pdf_files.append({
                        'theme_id': theme.id,
                        'theme_title': theme.titre,
                        'error': 'Le fichier PDF est manquant.'
                    })
        
        if pdf_files:
            return Response(pdf_files, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'Aucun PDF disponible pour les thèmes.'}, status=status.HTTP_404_NOT_FOUND)

# Routes pour récupérer des thèmes par année et spécialité
class ThemesByAnneeAPIView(APIView):
    def get(self, request, annee_id):
        themes = Theme.objects.filter(annee_id=annee_id)
        serializer = ThemeSerializer(themes, many=True)
        return Response(serializer.data)

class ThemesByAnneeSpecialiteAPIView(APIView):
    def get(self, request, annee_id, specialite_id):
        themes = Theme.objects.filter(annee_id=annee_id)
        filtered_themes = [
            theme for theme in themes
            if any(p.get("specialite_id") == specialite_id for p in theme.priorities or [])
        ]
        serializer = ThemeSerializer(filtered_themes, many=True)
        return Response(serializer.data)

def is_admin_user(request):
    auth_header = request.headers.get('Authorization')
    print("AUTH HEADER RECEIVED:", auth_header)

    if not auth_header:
        print("No Authorization header!")
        return False

    try:
        base = get_service1_url()
        url = f"{base}/verify-admin/"
        print("Calling URL:", url)
        response = requests.get(url, headers={'Authorization': auth_header})
        print("Response status:", response.status_code)
        print("Response body:", response.text)

        if response.status_code == 200:
            return response.json().get("is_admin", False)
    except Exception as e:
        print("Error in verify-admin call:", e)

    return False

class ValiderThemeView(APIView):
    def patch(self, request, theme_id):
        if not is_admin_user(request):
            return Response({"detail": "Accès interdit. Admin seulement."}, status=status.HTTP_403_FORBIDDEN)

        theme = get_object_or_404(Theme, id=theme_id)
        theme.valide = True
        theme.motif = ""
        theme.save()
        
        # Envoi de la notification
        id_receiver = theme.enseignant_id if theme.enseignant_id else theme.entreprise_id
        
        notification_data = {
            "idReceiver": id_receiver, 
            "type": "THEME_DECISION",
            "metadata": {
                "decision": "accepté",
                "themeTitle": theme.titre,
                "themeId": theme.id
            }
        }
        
        try:
          
            notification_service_url = get_notification_service_url()
            
            # Envoi de la requête au service de notification
            response = requests.post(
                f"{notification_service_url}/notify",
                json=notification_data,
                timeout=5
            )
            response.raise_for_status()
            
            return Response({
                "message": "Thème validé avec succès.",
                "notification": response.json()
            }, status=status.HTTP_200_OK)
            
        except requests.exceptions.RequestException as e:
            print(f"Erreur lors de l'envoi de la notification: {str(e)}")
            return Response({
                "message": "Thème validé mais échec de la notification",
                "error": str(e)
            }, status=status.HTTP_200_OK)
        

class RefuserThemeView(APIView):
    def patch(self, request, theme_id):
        if not is_admin_user(request):
            return Response({"detail": "Accès interdit. Admin seulement."}, status=status.HTTP_403_FORBIDDEN)

        motif = request.data.get("motif", "").strip()
        if not motif:
            return Response({"error": "Le motif est requis pour refuser un thème."}, status=status.HTTP_400_BAD_REQUEST)

        theme = get_object_or_404(Theme, id=theme_id)
        theme.valide = False
        theme.motif = motif
        theme.save()
        
        id_receiver = theme.enseignant_id if theme.enseignant_id else theme.entreprise_id
        
        notification_data = {
            "idReceiver": id_receiver, 
            "type": "THEME_DECISION",
            "metadata": {
                "decision": "refusé",
                "themeTitle": theme.titre,
                "themeId": theme.id
            }
        }
        
        try:
          
            notification_service_url = get_notification_service_url()
            
            # Envoi de la requête au service de notification
            response = requests.post(
                f"{notification_service_url}/notify",
                json=notification_data,
                timeout=5
            )
            response.raise_for_status()
            
            return Response({
                "message": "Thème validé avec succès.",
                "notification": response.json()
            }, status=status.HTTP_200_OK)
            
        except requests.exceptions.RequestException as e:
            print(f"Erreur lors de l'envoi de la notification: {str(e)}")
            return Response({
                "message": "Thème validé mais échec de la notification",
                "error": str(e)
            }, status=status.HTTP_200_OK)


from django.db.models import Q

class ThemesEnAttenteView(APIView):
    def get(self, request):
        if not is_admin_user(request):
            return Response({"detail": "Accès interdit. Admin seulement."}, status=status.HTTP_403_FORBIDDEN)

        # 🔍 Filtre: valide=False et motif soit None soit ""
        themes_en_attente = Theme.objects.filter(
            valide=False
        ).filter(
            Q(motif__isnull=True) | Q(motif="")
        )

        if not themes_en_attente.exists():
            return Response({"message": "Aucun thème en attente."}, status=status.HTTP_404_NOT_FOUND)

        serializer = ThemeSerializer(themes_en_attente, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ThemesValidésView(APIView):
    def get(self, request):
        if not is_admin_user(request):
            return Response({"detail": "Accès interdit. Admin seulement."}, status=status.HTTP_403_FORBIDDEN)

        themes_valides = Theme.objects.filter(valide=True)

        if not themes_valides.exists():
            return Response({"message": "Aucun thème validé."}, status=status.HTTP_404_NOT_FOUND)

        serializer = ThemeSerializer(themes_valides, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ThemesRefusesView(APIView):
    def get(self, request):
        if not is_admin_user(request):
            return Response({"detail": "Accès interdit. Admin seulement."}, status=status.HTTP_403_FORBIDDEN)

        # Filtrer pour obtenir uniquement les thèmes avec valide=False et un motif non vide
        themes_refuses = Theme.objects.filter(valide=False).exclude(motif="").exclude(motif__isnull=True)

        if not themes_refuses.exists():
            return Response({"message": "Aucun thème refusé."}, status=status.HTTP_404_NOT_FOUND)

        serializer = ThemeSerializer(themes_refuses, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ReserverThemeView(APIView):
    def patch(self, request, theme_id):
        if not is_admin_user(request):
            return Response({"detail": "Accès interdit. Admin seulement."}, status=status.HTTP_403_FORBIDDEN)

        # Récupérer le thème à partir de l'ID
        theme = get_object_or_404(Theme, id=theme_id)

        # Mettre à jour le champ 'reserve' du thème à True
        theme.reserve = True
        theme.save()

        id_receiver = theme.enseignant_id if theme.enseignant_id else theme.entreprise_id
        
        notification_data = {
            "idReceiver": id_receiver, 
            "type": "THEME_DECISION",
            "metadata": {
                "decision": "reservé",
                "themeTitle": theme.titre,
                "themeId": theme.id
            }
        }
        
        try:
          
            notification_service_url = get_notification_service_url()
            
            # Envoi de la requête au service de notification
            response = requests.post(
                f"{notification_service_url}/notify",
                json=notification_data,
                timeout=5
            )
            response.raise_for_status()
            
            return Response({
                "message": "Thème validé avec succès.",
                "notification": response.json()
            }, status=status.HTTP_200_OK)
            
        except requests.exceptions.RequestException as e:
            print(f"Erreur lors de l'envoi de la notification: {str(e)}")
            return Response({
                "message": "Thème validé mais échec de la notification",
                "error": str(e)
            }, status=status.HTTP_200_OK)


class ThemesReservesView(APIView):
    def get(self, request):
        if not is_admin_user(request):
            return Response({"detail": "Accès interdit. Admin seulement."}, status=status.HTTP_403_FORBIDDEN)

        # Filtrer les thèmes où reserve=True
        themes_reserves = Theme.objects.filter(reserve=True)

        if not themes_reserves.exists():
            return Response({"message": "Aucun thème réservé."}, status=status.HTTP_404_NOT_FOUND)

        serializer = ThemeSerializer(themes_reserves, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q
from .models import Theme
from .serializers import ThemeSerializer

class ThemeSearchAPIView(APIView):
    def get(self, request):
        query = request.GET.get('q', '')
        if query:
            themes = Theme.objects.filter(
                Q(titre__icontains=query) |
                Q(resume__icontains=query)  # ← ici, on remplace description par resume
            )
        else:
            themes = Theme.objects.all()
        serializer = ThemeSerializer(themes, many=True)
        return Response(serializer.data)

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Theme
from .serializers import ThemeSerializer
class AffecterEnseignantView(APIView):
    def patch(self, request, theme_id, enseignant_id):
        if not is_admin_user(request):
            return Response({"detail": "Accès interdit. Admin seulement."}, status=status.HTTP_403_FORBIDDEN)

        theme = get_object_or_404(Theme, id=theme_id)

        if not theme.valide:
            return Response({"detail": "Impossible d'affecter un enseignant à un thème non validé."}, status=status.HTTP_400_BAD_REQUEST)

        theme.enseignant_id = enseignant_id
        theme.save()

        return Response({"message": "Enseignant affecté au thème avec succès."}, status=status.HTTP_200_OK)

class ThemeConventionView(APIView):
    def get(self, request, theme_id):
        try:
            theme = Theme.objects.get(id=theme_id)
        except Theme.DoesNotExist:
            raise Http404("Thème non trouvé.")

        if not theme.convention:
            return Response({"detail": "Ce thème n'a pas de convention."}, status=status.HTTP_404_NOT_FOUND)

        file_path = theme.convention.path
        if not os.path.exists(file_path):
            return Response({"detail": "Fichier introuvable."}, status=status.HTTP_404_NOT_FOUND)

        return FileResponse(open(file_path, 'rb'), content_type='application/pdf', filename=os.path.basename(file_path))

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils.text import slugify
from django.utils.crypto import get_random_string
from PyPDF2 import PdfReader
from .models import Theme
from .serializers import ThemeSerializer
from .utils import verify_user  # Assure-toi que cette fonction existe

class ExtractThemeFromPDFView(APIView):
    def post(self, request):
        # ✅ Vérification de rôle
        user_data = verify_user(request, role=["enseignant", "entreprise"])
        if not user_data or not (user_data.get("is_enseignant") or user_data.get("is_entreprise")):
            return Response(
                {"detail": "Accès refusé. Seuls les enseignants ou les entreprises peuvent extraire un thème depuis un PDF."},
                status=status.HTTP_403_FORBIDDEN
            )

        # ✅ Vérification du fichier
        if 'file' not in request.FILES:
            return Response({"detail": "Fichier 'file' requis."}, status=status.HTTP_400_BAD_REQUEST)

        file = request.FILES['file']

        try:
            # Lecture PDF
            pdf = PdfReader(file)
            full_text = "\n".join([p.extract_text() or "" for p in pdf.pages]).replace('\r', ' ').replace('\n', ' ').strip()
            print("Texte extrait du PDF:\n", full_text)

            def extract_between(text, start_marker, end_marker=None):
                try:
                    start = text.lower().index(start_marker.lower()) + len(start_marker)
                    if end_marker:
                        end = text.lower().index(end_marker.lower(), start)
                        return text[start:end].strip()
                    return text[start:].strip()
                except ValueError:
                    return ""

            def multi_extract(text, markers):
                for m in markers:
                    result = extract_between(text, *m)
                    if result:
                        return result
                return ""

            titre = multi_extract(full_text, [("titre complet", "encadreur")])
            resume = multi_extract(full_text, [("résumé", "outils et langages")])
            outils = multi_extract(full_text, [("outils et langages", "plan de travail")])
            plan_travail = multi_extract(full_text, [("plan de travail", "livrable"), ("plan de travail",)])
            livrable = multi_extract(full_text, [("livrable",)])

            # Validation des champs
            champs_vides = []
            champs_a_verifier = {
                "titre": titre,
                "resume": resume,
                "outils_et_language": outils,
                "plan_travail": plan_travail,
            }

            for champ, valeur in champs_a_verifier.items():
                if not valeur.strip():
                    champs_vides.append(champ)

            if champs_vides:
                return Response({
                    "detail": "Champs manquants dans le PDF.",
                    "champs_vides": champs_vides,
                    "text_debug": full_text
                }, status=status.HTTP_400_BAD_REQUEST)

            # Préparation de l'objet
            theme = Theme(
                titre=titre,
                resume=resume,
                outils_et_language=outils,
                plan_travail=plan_travail,
                livrable=livrable
            )

            if user_data.get("is_enseignant"):
                theme.enseignant_id = user_data["user_id"]
            elif user_data.get("is_entreprise"):
                theme.entreprise_id = user_data["user_id"]

            # Enregistrement du thème (sans fichier pour le moment)
            theme.save()

            # ✅ Sauvegarde du PDF dans 'pdfs/' avec nom personnalisé
            from django.core.files.base import ContentFile
            import os
            ext = os.path.splitext(file.name)[1] or ".pdf"
            safe_title = slugify(titre)[:40]
            random_suffix = get_random_string(6)
            filename = f"pdfs/fiche_projet_{safe_title}_{random_suffix}{ext}"

            theme.option_pdf.save(filename, file, save=True)

            serializer = ThemeSerializer(theme)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"detail": f"Erreur lors de l'extraction : {str(e)}"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# views.py
from rest_framework.generics import ListAPIView, UpdateAPIView
from .models import Theme
from .serializers import ThemeSerializer

class ThemesByAnneeAcademiqueAPIView(ListAPIView):
    serializer_class = ThemeSerializer

    def get_queryset(self):
        annee_id = self.kwargs['annee_academique']
        return Theme.objects.filter(annee_academique=annee_id)

# views.py
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

class ArchiveThemeAPIView(APIView):
    def patch(self, request, pk):
        try:
            theme = Theme.objects.get(pk=pk)
            theme.archived = True
            theme.save()
            return Response({"message": "Theme archivé avec succès."}, status=status.HTTP_200_OK)
        except Theme.DoesNotExist:
            return Response({"error": "Thème non trouvé."}, status=status.HTTP_404_NOT_FOUND)
        
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
SERVICE3_APP = "SERVICE3-NODE"

def get_service3_url():
    return discover_service(SERVICE3_APP)

def get_groups_by_theme_annee(request, theme_id):
    theme = get_object_or_404(Theme, id=theme_id)

    if not theme.annee_id:
        return JsonResponse({'error': "Ce thème n'a pas de champ 'annee_id'."}, status=400)

    service3_url = get_service3_url()  # doit retourner http://localhost:3000 ou http://service3-node
    auth_header = request.headers.get('Authorization')

    if not auth_header:
        return JsonResponse({'error': 'Token JWT manquant dans les headers.'}, status=401)

    headers = {
        'Authorization': auth_header,
        'Content-Type': 'application/json'
    }

    try:
        # 👇 Ajouter le bon chemin complet
        response = requests.get(
            f"{service3_url}/api/groups/by-study-year",
            params={'annee_etude': theme.annee_id},
            headers=headers
        )
    except requests.exceptions.RequestException:
        return JsonResponse({'error': 'Erreur de communication avec le service 3'}, status=502)

    if response.status_code != 200:
        return JsonResponse({'error': 'Erreur lors de la récupération des groupes.'}, status=response.status_code)

    return JsonResponse(response.json(), safe=False)
