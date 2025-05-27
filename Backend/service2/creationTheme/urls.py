
from django.urls import path

from .views import *
from . import views


urlpatterns = [
    path('themes/', ThemeAPIView.as_view(), name='theme-list-create'),
    path('themes/<int:pk>/', ThemeDetailAPIView.as_view(), name='theme-detail'),
    path('themes/enseignant/<int:enseignant_id>/', ThemeViewSet.as_view({'get': 'get_themes_by_enseignant'}), name='themes-par-enseignant'),
    path('themes/by-annee/<int:annee_id>/', ThemesByAnneeAPIView.as_view(), name='themes-by-annee'),
    path('themes/by-annee-specialite/<int:annee_id>/<int:specialite_id>/', ThemesByAnneeSpecialiteAPIView.as_view(), name='themes-by-annee-specialite'),
    path('themes/<int:theme_id>/pdf/', ThemePDFView.as_view(), name='theme-pdf'),
    path('themes/pdfs/', AllThemePDFsView.as_view(), name='all_theme_pdfs'),

    path('themes/entreprise/<int:entreprise_id>/', ThemeViewSet.as_view({'get': 'get_themes_by_entreprise'}), name='themes-par-entreprise'),
    path('themes/entreprise/<int:entreprise_id>/', ThemeViewSet.as_view({'get': 'get_themes_by_entreprise'}), name='themes-par-entreprise'),
    path('themes/<int:theme_id>/valider/', ValiderThemeView.as_view(), name='valider-theme'),
    path('themes/<int:theme_id>/refuser/', RefuserThemeView.as_view(), name='refuser-theme'),
    path('themes/en-attente/', ThemesEnAttenteView.as_view(), name='themes-en-attente'),
    path('themes/valides/', ThemesValidésView.as_view(), name='themes_valides'),
    path('themes/refuses/', ThemesRefusesView.as_view(), name='themes_refuses'),
    path('themes/<int:theme_id>/reserver/', ReserverThemeView.as_view(), name='reserver-theme'),
    path('themes/reserves/', ThemesReservesView.as_view(), name='themes-reserves'),
    path('themes/search/', ThemeSearchAPIView.as_view(), name='theme-search'),
    path('themes/<int:theme_id>/affecter-enseignant/<int:enseignant_id>/', AffecterEnseignantView.as_view(), name='affecter-enseignant'),
    path('themes/<int:theme_id>/convention/', ThemeConventionView.as_view(), name='get_theme_convention'),
    path('themes/upload-pdf/', ExtractThemeFromPDFView.as_view(), name='upload_theme_pdf'),
    path('themes/create-group/', ThemeWithGroupCreateView.as_view(), name='theme-create-with-group'),

    path('themes/by-annee-academique/<int:annee_academique>/', ThemesByAnneeAcademiqueAPIView.as_view(), name='themes-by-annee-academique'),
    path('themes/<int:pk>/archived/', ArchiveThemeAPIView.as_view(), name='archive-theme'),

    path('themes/<int:theme_id>/groupes-par-annee/', views.get_groups_by_theme_annee),
    ]
