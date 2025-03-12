from django.urls import path
from .views import *
from rest_framework_simplejwt.views import TokenRefreshView
from django.contrib.auth import views as auth_views

from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
     path('etudiants/', EtudiantListCreateView.as_view(), name='etudiant-list-create'),
    path('etudiants/<int:pk>/', EtudiantRetrieveUpdateDeleteView.as_view(), name='etudiant-detail'),

  
    path('enseignants/', EnseignantListCreateView.as_view(), name='enseignant-list-create'),
    path('enseignants/<int:pk>/', EnseignantRetrieveUpdateDeleteView.as_view(), name='enseignant-detail'),

 
    path('admins/', AdminListCreateView.as_view(), name='admin-list-create'),
    path('admins/<int:pk>/', AdminRetrieveUpdateDeleteView.as_view(), name='admin-detail'),

    path('departements/', DepartementListCreateView.as_view(), name='departement-list-create'),
    path('departements/<int:pk>/', DepartementRetrieveUpdateDeleteView.as_view(), name='departement-detail'),
    
    path('annees/', AnneeListCreateView.as_view(), name='annee-list-create'),
    path('annees/<int:pk>/', AnneeRetrieveUpdateDeleteView.as_view(), name='annee-detail'),
    
    path('specialites/', SpecialiteListCreateView.as_view(), name='specialite-list-create'),
    path('specialites/<int:pk>/', SpecialiteRetrieveUpdateDeleteView.as_view(), name='specialite-detail'),
    
    path('salles/', SalleListCreateView.as_view(), name='salle-list-create'),
    path('salles/<int:pk>/', SalleRetrieveUpdateDeleteView.as_view(), name='salle-detail'),

    path('entreprises/', EntrepriseListCreateView.as_view(), name='entreprise-list'),
    path('entreprises/<int:pk>/valider/', EntrepriseValidationView.as_view(), name='entreprise-valider'),
    path("entreprises/<int:pk>/delete/", EntrepriseDeleteView.as_view(), name="entreprise-delete"),
    path('import/<str:user_type>/', import_users, name='import-users'),

  
   
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
  
    path('login/', UserLoginView.as_view(), name='login'),

    path("password-reset/", RequestPasswordResetView.as_view(), name="password-reset"),
    path("password-reset-confirm/", PasswordResetConfirmView.as_view(), name="password-reset-confirm"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("change-password/", ChangePasswordView.as_view(), name="change-password"),
     path('users-with-entreprise/', UsersWithEntrepriseView.as_view(), name="users-with-entreprise"),
 





]

    