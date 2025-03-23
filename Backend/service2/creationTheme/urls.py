
from django.urls import path
from .views import (
    ThemeAPIView,
    ThemeDetailAPIView,
    ThemeViewSet,
    PriorityViewSet
    
)



urlpatterns = [
    path('themes/', ThemeAPIView.as_view(), name='theme-list-create'),
    path('themes/<int:pk>/', ThemeDetailAPIView.as_view(), name='theme-detail'),
    path('themes/enseignant/<int:enseignant_id>/', ThemeViewSet.as_view({'get': 'get_themes_by_enseignant'}), name='themes-par-enseignant'),
    # URLs pour les priorités
    path('priorities/', PriorityViewSet.as_view({'get': 'list', 'post': 'create'}), name='priority-list'),
    path('priorities/<int:pk>/', PriorityViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'delete': 'destroy'
    }), name='priority-detail'),


    ]
