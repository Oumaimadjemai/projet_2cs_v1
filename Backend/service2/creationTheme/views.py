
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView

from Backend.service2.service2 import settings
from .models import Theme
from .serializers import ThemeSerializer
from .utils import verify_user

from django.http import FileResponse
from io import BytesIO
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle

import os
import requests

# External service URLs
SERVICE_1_URL = "http://localhost:8000"
SERVICE_2_URL = "http://localhost:8001"

# 🔁 Helpers
def get_nom_annee(annee_id):
    if annee_id:
        response = requests.get(f"{SERVICE_1_URL}/annees/{annee_id}/")
        if response.status_code == 200:
            return response.json().get("title", "N/A")
    return "N/A"

def get_nom_specialite(specialite_id):
    if specialite_id:
        response = requests.get(f"{SERVICE_1_URL}/specialites/{specialite_id}/")
        if response.status_code == 200:
            return response.json().get("title", "N/A")
    return "N/A"

def get_nom_enseignant(enseignant_id):
    if enseignant_id:
        response = requests.get(f"{SERVICE_1_URL}/enseignants/{enseignant_id}/")
        if response.status_code == 200:
            data = response.json()
            return f"{data.get('nom', '')} {data.get('prenom', '')}"
    return "N/A"

def generate_pdf(theme):
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=40, leftMargin=40, topMargin=40, bottomMargin=30)

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(name='CustomTitle', fontSize=16, leading=20, alignment=1, textColor=colors.HexColor("#003366"), spaceAfter=20)
    label_style = ParagraphStyle(name='Label', fontSize=11, leading=14, textColor=colors.HexColor("#003366"), spaceAfter=6)
    content_style = styles['Normal']

    elements = []

    try:
        logo_path = os.path.join(settings.BASE_DIR, "static", "logo.png")
        logo = Image(logo_path, width=100, height=50)
        logo.hAlign = 'CENTER'
        elements.append(logo)
        elements.append(Spacer(1, 12))
    except Exception as e:
        print(f"⚠️ Logo introuvable : {e}")

    elements.append(Paragraph("Fiche de présentation du projet", title_style))
    elements.append(Spacer(1, 12))

    data = [
        [Paragraph("<b>Titre complet</b>", label_style), Paragraph(theme.titre or "N/A", content_style)],
        [Paragraph("<b>Encadreur</b>", label_style), Paragraph(get_nom_enseignant(theme.enseignant_id), content_style)],
        [Paragraph("<b>Résumé</b>", label_style), Paragraph(theme.resume or "Aucun résumé fourni.", content_style)],
        [Paragraph("<b>Outils et Langages</b>", label_style), Paragraph(theme.outils_et_language or "Non précisé.", content_style)],
        [Paragraph("<b>Plan de travail</b>", label_style), Paragraph(theme.plan_travail or "Non précisé.", content_style)],
        [Paragraph("<b>Livrables</b>", label_style), Paragraph(theme.livrable or "Non précisé.", content_style)],
    ]

    table = Table(data, colWidths=[150, 360])
    table.setStyle(TableStyle([
        ('BOX', (0, 0), (-1, -1), 1, colors.grey),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ]))

    elements.append(table)
    doc.build(elements)
    buffer.seek(0)
    return FileResponse(buffer, as_attachment=True, filename="fiche_projet.pdf")


# 🌟 API to list and create themes
class ThemeAPIView(APIView):

    def get(self, request):
        themes = Theme.objects.all()
        serializer = ThemeSerializer(themes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        user_data = verify_user(request, role=["enseignant", "entreprise"])
        if not user_data:
            return Response({"detail": "Utilisateur non authentifié ou rôle incorrect"}, status=status.HTTP_400_BAD_REQUEST)

        data = request.data.copy()
        if user_data.get("is_enseignant"):
            data['enseignant_id'] = user_data['user_id']
        elif user_data.get("is_entreprise"):
            data['entreprise_id'] = user_data['user_id']

        serializer = ThemeSerializer(data=data)
        if serializer.is_valid():
            theme = serializer.save()  # ✅ Fixed: Removed priorite_id

            if 'option_pdf' in request.FILES:
                theme.option_pdf = request.FILES['option_pdf']
                theme.save()

            pdf_response = generate_pdf(theme)
            return pdf_response

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
            serializer.save()  # ✅ Fixed: Removed priorite_id
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
        return Response(serializer.data)

