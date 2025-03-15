
from django.urls import path
from .views import (
    ThemeAPIView,
    ThemeDetailAPIView,
    ThemeViewSet
    
)

urlpatterns = [
    path('themes/', ThemeAPIView.as_view(), name='theme-list-create'),
    path('themes/<int:pk>/', ThemeDetailAPIView.as_view(), name='theme-detail'),
    path('themes/enseignant/<int:enseignant_id>/', ThemeViewSet.as_view({'get': 'get_themes_by_enseignant'}), name='themes-par-enseignant'),

    ]
