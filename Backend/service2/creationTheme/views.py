
# from django.conf import settings
# from rest_framework import viewsets, status
# from rest_framework.response import Response
# from rest_framework.views import APIView
# from django.shortcuts import get_object_or_404
# from .models import Theme
# from .serializers import ThemeSerializer
# from .utils import verify_user
# from django.http import HttpResponse,FileResponse
# from weasyprint import HTML
# import os
# import requests
# from django.template.loader import render_to_string
# from urllib.parse import urljoin

# # External service URLs
# SERVICE_1_URL = "http://localhost:8000"
# SERVICE_2_URL = "http://localhost:8001"

# # 🔁 Helpers
# def get_nom_annee(annee_id):
#     if annee_id:
#         response = requests.get(f"{SERVICE_1_URL}/annees/{annee_id}/")
#         if response.status_code == 200:
#             return response.json().get("title", "N/A")
#     return "N/A"

# def get_nom_specialite(specialite_id):
#     if specialite_id:
#         response = requests.get(f"{SERVICE_1_URL}/specialites/{specialite_id}/")
#         if response.status_code == 200:
#             return response.json().get("title", "N/A")
#     return "N/A"

# def get_nom_enseignant(enseignant_id):
#     if enseignant_id:
#         response = requests.get(f"{SERVICE_1_URL}/enseignants/{enseignant_id}/")
#         if response.status_code == 200:
#             data = response.json()
#             return f"{data.get('nom', '')} {data.get('prenom', '')}"
#     return "N/A"

# # Generate PDF from the theme data
# def generate_pdf(request, theme_id):
#     theme = get_object_or_404(Theme, id=theme_id)

#     logo_abspath = os.path.abspath(os.path.join(settings.BASE_DIR, 'static', 'logo.png'))
#     logo_path = f'file:///{logo_abspath.replace(os.sep, "/")}'


#     context = {
#         'theme': theme,
#         'encadreur': get_nom_enseignant(theme.enseignant_id),
#         'logo_path': logo_path
#     }

#     html_string = render_to_string('theme_pdf_template.html', context)
#     html = HTML(string=html_string)
#     pdf = html.write_pdf()

#     response = HttpResponse(pdf, content_type='application/pdf')
#     response['Content-Disposition'] = f'attachment; filename="fiche_projet_{theme.titre}.pdf"'
#     return response

# # 🌟 API to list and create themes
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

#             if 'option_pdf' in request.FILES:
#                 theme.option_pdf = request.FILES['option_pdf']
#                 theme.save()

#             return generate_pdf(request, theme.id)

#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# # 📄 Retrieve, Update, Delete single theme
# class ThemeDetailAPIView(APIView):

#     def get_object(self, pk):
#         try:
#             return Theme.objects.get(pk=pk)
#         except Theme.DoesNotExist:
#             return None

#     def get(self, request, pk):
#         theme = self.get_object(pk)
#         if not theme:
#             return Response({'error': 'Thème non trouvé.'}, status=status.HTTP_404_NOT_FOUND)
#         serializer = ThemeSerializer(theme)
#         return Response(serializer.data)

#     def put(self, request, pk):
#         theme = self.get_object(pk)
#         if not theme:
#             return Response({'error': 'Thème non trouvé.'}, status=status.HTTP_404_NOT_FOUND)

#         user_data = verify_user(request, role=["enseignant", "entreprise"])
#         if user_data['user_id'] != theme.enseignant_id and user_data['user_id'] != theme.entreprise_id:
#             return Response({'error': "Vous n'êtes pas autorisé à modifier ce thème."}, status=status.HTTP_403_FORBIDDEN)

#         serializer = ThemeSerializer(theme, data=request.data, partial=True)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     def delete(self, request, pk):
#         theme = self.get_object(pk)
#         if not theme:
#             return Response({'error': 'Thème non trouvé.'}, status=status.HTTP_404_NOT_FOUND)

#         user_data = verify_user(request, role=["enseignant", "entreprise"])
#         if user_data['user_id'] != theme.enseignant_id and user_data['user_id'] != theme.entreprise_id:
#             return Response({'error': "Vous n'êtes pas autorisé à supprimer ce thème."}, status=status.HTTP_403_FORBIDDEN)

#         theme.delete()
#         return Response({'message': 'Thème supprimé avec succès.'}, status=status.HTTP_204_NO_CONTENT)

# # 📚 Theme ViewSet (ex: by teacher)
# class ThemeViewSet(viewsets.ViewSet):

#     def get_themes_by_enseignant(self, request, enseignant_id):
#         themes = Theme.objects.filter(enseignant_id=enseignant_id)
#         serializer = ThemeSerializer(themes, many=True)
#         return Response(serializer.data)

# class ThemesByAnneeAPIView(APIView):
#     def get(self, request, annee_id):
#         themes = Theme.objects.filter(annee_id=annee_id)
#         serializer = ThemeSerializer(themes, many=True)
#         return Response(serializer.data)

# class ThemesByAnneeSpecialiteAPIView(APIView):
#     def get(self, request, annee_id, specialite_id):
#         # D'abord, filtrer par année
#         themes = Theme.objects.filter(annee_id=annee_id)

#         # Ensuite, filtrer par spécialité dans le JSONField "priorities"
#         filtered_themes = [
#             theme for theme in themes
#             if any(p.get("specialite_id") == specialite_id for p in theme.priorities or [])
#         ]

#         serializer = ThemeSerializer(filtered_themes, many=True)
#         return Response(serializer.data)



# class ThemePDFView(APIView):
#     def get(self, request, theme_id):
#         theme = get_object_or_404(Theme, id=theme_id)  # Récupérer le thème

#         # Assurez-vous que le fichier PDF existe
#         if theme.option_pdf and os.path.exists(theme.option_pdf.path):
#             # Renvoie le PDF existant
#             response = FileResponse(open(theme.option_pdf.path, 'rb'), content_type='application/pdf')
#             response['Content-Disposition'] = f'attachment; filename="fiche_projet_{theme.titre}.pdf"'
#             return response

#         # Si le fichier PDF n'existe pas, renvoie une erreur
#         return Response({'error': 'Le fichier PDF n\'existe pas pour ce thème.'}, status=status.HTTP_404_NOT_FOUND)

from django.conf import settings
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

#from Backend.service2.service2 import settings
from .models import Theme
from .serializers import ThemeSerializer
from .utils import verify_user
from django.http import HttpResponse, FileResponse
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
                    "type": "CREATION_THEME"
                },
                timeout=3  # 3 seconds timeout
            )
        except Exception as e:
            print(f"Failed to notify admins: {e}")
            # Continue even if notification fails

        return Response(ThemeSerializer(theme).data, status=status.HTTP_201_CREATED)
    
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
