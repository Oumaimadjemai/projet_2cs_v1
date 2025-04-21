
from django.urls import path

from .views import (
    ThemeAPIView,
    ThemeDetailAPIView,
    ThemeViewSet, 
    ThemesByAnneeAPIView,
    ThemesByAnneeSpecialiteAPIView, 
    ThemePDFView,
    AllThemePDFsView   
)



urlpatterns = [
    path('themes/', ThemeAPIView.as_view(), name='theme-list-create'),
    path('themes/<int:pk>/', ThemeDetailAPIView.as_view(), name='theme-detail'),
    path('themes/enseignant/<int:enseignant_id>/', ThemeViewSet.as_view({'get': 'get_themes_by_enseignant'}), name='themes-par-enseignant'),
    path('themes/by-annee/<int:annee_id>/', ThemesByAnneeAPIView.as_view(), name='themes-by-annee'),
    path('themes/by-annee-specialite/<int:annee_id>/<int:specialite_id>/', ThemesByAnneeSpecialiteAPIView.as_view(), name='themes-by-annee-specialite'),
    path('themes/<int:theme_id>/pdf/', ThemePDFView.as_view(), name='theme-pdf'),
    path('themes/pdfs/', AllThemePDFsView.as_view(), name='all_theme_pdfs'),

 

    ]
