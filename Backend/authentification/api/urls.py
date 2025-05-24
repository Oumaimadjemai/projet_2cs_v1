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
    path('users/<int:pk>/', UserDetailView.as_view(), name='user-detail'),
    path('etudiants/', EtudiantListCreateView.as_view(), name='etudiant-list-create'),
    path('etudiants/<int:pk>/', EtudiantRetrieveUpdateDeleteView.as_view(), name='etudiant-detail'),
    path('user/me/', CurrentUserView.as_view(), name='current-user'),

    path('enseignants/', EnseignantListCreateView.as_view(), name='enseignant-list-create'),
    path('enseignants/<int:pk>/', EnseignantRetrieveUpdateDeleteView.as_view(), name='enseignant-detail'),

 

    path('admins/', AdminListCreateView.as_view(), name='admin-list-create'),
    path('admins/<int:pk>/', AdminRetrieveUpdateDeleteView.as_view(), name='admin-detail'),

    path('annees-academiques/', AnneeAcademiqueListCreateView.as_view(), name='annee-academique-list-create'),
    path('annees-academiques/<int:pk>/', AnneeAcademiqueRetrieveUpdateDeleteView.as_view(), name='annee-academique-detail'),
    path('annees-academiques/<int:pk>/archive/', archive_annee),
    path('departements/', DepartementListCreateView.as_view(), name='departement-list-create'),
    path('departements/<int:pk>/', DepartementRetrieveUpdateDeleteView.as_view(), name='departement-detail'),
    
    path('annees/', AnneeListCreateView.as_view(), name='annee-list-create'),
    path('annees/<int:pk>/', AnneeRetrieveUpdateDeleteView.as_view(), name='annee-detail'),
    
    path('specialites/', SpecialiteListCreateView.as_view(), name='specialite-list-create'),
    path('specialites/<int:pk>/', SpecialiteRetrieveUpdateDeleteView.as_view(), name='specialite-detail'),
    
    path('salles/', SalleListCreateView.as_view(), name='salle-list-create'),
    path('salles/<int:pk>/', SalleRetrieveUpdateDeleteView.as_view(), name='salle-detail'),
#archived 
# localhost:8000/periodes/?archived=false
    path('periodes/',PeriodeListCreateView.as_view(),name='periode-list-create'),
    path('periodes/<int:pk>',PeriodeRetrieveUpdateDeleteView.as_view(),name='periode-detail'),

    path('parametre_groups/',Parametre_groupListCreateView.as_view(),name='Parametre_group-list-create'),
    path('parametre_groups/<int:pk>',Parametre_groupRetrieveUpdateDeleteView.as_view(),name='Parametre_group-detail'),
    path('parametre-groups/by-annee/', ParametreGroupByAnneeView.as_view(), name='parametre-group-by-annee'),
########################
    path('entreprises/', EntrepriseListCreateView.as_view(), name='entreprise-list'),
    path('entreprises/<int:pk>/valider/', EntrepriseValidationView.as_view(), name='entreprise-valider'),
    path("entreprises/<int:pk>/delete/", EntrepriseDeleteView.as_view(), name="entreprise-delete"),
    path('entreprises/create-manual/', CreateEntrepriseAndUserView.as_view(), name='create-entreprise-manual'),
    path('import/<str:user_type>/', import_users, name='import-users'),

  
   
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
  
    path('login/', UserLoginView.as_view(), name='login'),

    path("password-reset/", RequestPasswordResetView.as_view(), name="password-reset"),
    path("password-reset-confirm/", PasswordResetConfirmView.as_view(), name="password-reset-confirm"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("change-password/", ChangePasswordView.as_view(), name="change-password"),
     
    path('users-with-entreprise/', UsersWithEntrepriseView.as_view(), name="users-with-entreprise"),
    path('enseignants/<int:pk>/', EnseignantDetailView.as_view(), name='get_enseignant'),
    path('entreprises/<int:pk>/', EntrepriseDetailView.as_view(), name='get_entreprise'),
    path('verify-user/', VerifyUserAPIView.as_view(), name='verify_user'),
    
    path('utilisateur/by-email/', get_user_by_email, name='get_user_by_email'),

    path('etudiants/annee/<int:annee_id>/', EtudiantsByAnneeView.as_view(), name='etudiants_by_annee'),
    path('etudiants/annee/<int:annee_id>/specialite/<int:specialite_id>/', EtudiantsByAnneeAndSpecialiteView.as_view(), name='etudiants_by_annee_and_specialite'),
    path('etudiants/annee/<int:annee_id>/sans_specialite/', EtudiantsByAnneeWithoutSpecialiteView.as_view(), name='etudiants_by_annee_without_specialite'),

    path('annees/departement/<int:departement_id>/', AnneeByDepartementView.as_view(), name='annees_by_departement'),
    # path('specialites/annee/<int:annee_id>/', SpecialiteByAnneeView.as_view(), name='specialites_by_annee'),
    # path('specialites/annee/<int:annee_id>/departement/<int:departement_id>/', SpecialiteByAnneeAndDepartementView.as_view(), name='specialites_by_annee_and_departement'),
    path('salles/departement/<int:departement_id>/', SalleByDepartementView.as_view(), name='salles_by_departement'),
    path("verify-admin/", VerifyAdminView.as_view(), name="verify-admin"),

    path('export/etudiants/excel/', export_etudiants_excel, name='export_etudiants_excel'),
    path('export/entreprises/excel/', export_entreprises_excel, name='export_entreprises_excel'),
    path('export/enseignants/excel', export_enseignants_excel, name='export_enseignants_excel'),
    path('export/admins/excel', export_admins_excel, name='export_admins_excel'),


    path('export/enseignants/pdf/', export_enseignants_pdf, name='export_enseignants_pdf'),
    path('export/entreprises/pdf',export_entreprises_pdf,name='export_entreprises_pdf'),
    path('export/etudiants/pdf',export_etudiants_pdf,name='export_etudiants_pdf'),
    path('export/admins/pdf',export_admins_pdf,name='export_admins_pdf'),
    path('api/is-etudiant/', VerifyEtudiantView.as_view(), name='verify-etudiant'),
    path('api/verify-enseignant/', VerifyEnseignantView.as_view(), name='verify-enseignant'),

]






    