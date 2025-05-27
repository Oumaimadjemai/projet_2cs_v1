from django.urls import path
from .views import *

urlpatterns = [
   path('soutenances/etudiant/', SoutenanceParEtudiantView.as_view(), name='soutenance-par-etudiant'),
   path('soutenances/valider/<str:group_id>/', ValidateSoutenanceView.as_view(), name='valider-soutenance'),
   path('soutenances/<group_id>/',SoutenanceCreateView.as_view(),name='soutenance-create'),
   path('soutenances/annee/<int:annee_id>/', soutenances_par_annee),
   path('soutenances/annee/<int:annee_id>/specialite/<int:specialite_id>/', soutenances_par_annee_specialite),
   path('soutenances/groupe/<str:groupe_id>/', soutenances_par_groupe),
   path('soutenances/encadrant/<int:encadrant_id>/', SoutenancesParEncadrantView.as_view()),
   path('soutenances/<int:pk>/', SoutenanceDetailView.as_view(), name='soutenance-detail'),
   path('soutenances/', SoutenanceListView.as_view(), name='soutenances-list'),
   path('soutenances-a-archiver/', soutenances_a_archiver, name='soutenances-a-archiver'),
   path('soutenances/<int:pk>/archiver/', SoutenanceArchiverView.as_view(), name='soutenance-archiver'),
   

]