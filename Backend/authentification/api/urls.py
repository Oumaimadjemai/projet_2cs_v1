from django.urls import path
from .views import *
from rest_framework_simplejwt.views import TokenRefreshView
from django.contrib.auth import views as auth_views

urlpatterns = [
     path('etudiants/', EtudiantListCreateView.as_view(), name='etudiant-list-create'),
    path('etudiants/<int:pk>/', EtudiantRetrieveUpdateDeleteView.as_view(), name='etudiant-detail'),

  
    path('enseignants/', EnseignantListCreateView.as_view(), name='enseignant-list-create'),
    path('enseignants/<int:pk>/', EnseignantRetrieveUpdateDeleteView.as_view(), name='enseignant-detail'),

 
    path('admins/', AdminListCreateView.as_view(), name='admin-list-create'),
    path('admins/<int:pk>/', AdminRetrieveUpdateDeleteView.as_view(), name='admin-detail'),

   
    path('import/<str:user_type>/', import_users, name='import-users'),

  
   
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
  
    path('login/', UserLoginView.as_view(), name='login'),

    path("password-reset/", RequestPasswordResetView.as_view(), name="password-reset"),
    path("password-reset-confirm/", PasswordResetConfirmView.as_view(), name="password-reset-confirm"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("change-password/", ChangePasswordView.as_view(), name="change-password"),
]

    