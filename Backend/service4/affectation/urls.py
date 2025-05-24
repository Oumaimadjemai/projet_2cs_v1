from django.urls import path
from .views import *


urlpatterns = [
    path('assign-manual/', AssignManualThemeView.as_view(), name='assign-themes'),
    path('assignments/<str:group_id>/', AssignmentDetailView.as_view(), name='assignment-detail'),
    path('assignments/encadrant/<str:encadrant>/', AssignmentByEncadrantView.as_view(), name='assignments-by-encadrant'),
    path('assignments/encadrant-by-groupe/<str:group_id>/', EncadrantByGroupeView.as_view(), name='encadrant-by-groupe'),
    path('encadrant-by-group/<str:group_id>/', GetEncadrantByGroupView.as_view(), name='encadrant-by-group'),
    path('encadreur/group/<str:group_id>/', IsEncadrantOfGroupView.as_view(), name='verify_encadrant_group'),

    # path('assignments/', AssignmentListView.as_view(), name='assignments-list'),
    # path('assign-single-theme/', AssignSingleThemeView.as_view(), name='assign-single-theme'),
    path('assignments/<str:group_id>/', AssignmentDetailView.as_view(), name='assignment-detail'),
    path('assignments/encadrant/<str:encadrant>/', AssignmentByEncadrantView.as_view(), name='assignments-by-encadrant'),
    path('assignments/encadrant-by-groupe/<str:group_id>/', EncadrantByGroupeView.as_view(), name='encadrant-by-groupe'),
    path('assignments/archive_by_annee/<int:annee_id>/', archive_assignments_by_annee, name='archive-assignments-by-annee'),

]

