from django.urls import path
from .views import *


urlpatterns = [
    path('assign-manual/', AssignManualThemeView.as_view(), name='assign-themes'),
    path('encadrant-by-group/<str:group_id>/', GetEncadrantByGroupView.as_view(), name='encadrant-by-group'),
    path('encadreur/group/<str:group_id>/', IsEncadrantOfGroupView.as_view(), name='verify_encadrant_group'),

    # path('assignments/', AssignmentListView.as_view(), name='assignments-list'),
    # path('assign-single-theme/', AssignSingleThemeView.as_view(), name='assign-single-theme'),
]

