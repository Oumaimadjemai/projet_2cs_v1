
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


class ThemeAPIView(APIView):

    def get(self, request):
        themes = Theme.objects.all()
        serializer = ThemeSerializer(themes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        # ✅ Vérifie que l'utilisateur est bien un enseignant ou une entreprise
        user_data = verify_user(request, role=["enseignant", "entreprise"])

        if not user_data or not (user_data.get("is_enseignant") or user_data.get("is_entreprise")):
            return Response(
                {"detail": "Accès refusé. Seuls les enseignants ou les entreprises peuvent créer un thème."},
                status=status.HTTP_403_FORBIDDEN
            )

        data = request.data.copy()

        # ✅ Associe correctement l'utilisateur au thème
        if user_data.get("is_enseignant"):
            data['enseignant_id'] = user_data['user_id']
        elif user_data.get("is_entreprise"):
            data['entreprise_id'] = user_data['user_id']
            # ⬇️ Gérer la convention si fournie
            if 'convention' in request.FILES:

               data['convention'] = request.FILES.get('convention')

        serializer = ThemeSerializer(data=data)
        if serializer.is_valid():
            theme = serializer.save()

            # ✅ Génère automatiquement le PDF après la création du thème
            return generate_pdf(request, theme.id)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
        return Response({"message": "Thème validé avec succès."}, status=status.HTTP_200_OK)

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
        return Response({"message": "Thème refusé avec motif."}, status=status.HTTP_200_OK)


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

        return Response({"message": "Thème réservé avec succès."}, status=status.HTTP_200_OK)


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
