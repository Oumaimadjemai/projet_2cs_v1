
from django.urls import path
from .views import (
    ThemeAPIView,
    ThemeDetailAPIView,
    ThemeSpecialiteAPIView,
)

urlpatterns = [
    path('themes/', ThemeAPIView.as_view(), name='theme-list-create'),
    path('themes/<int:pk>/', ThemeDetailAPIView.as_view(), name='theme-detail'),
    path('theme-specialites/', ThemeSpecialiteAPIView.as_view(), name='theme-specialite-list-create'),
]
