from django.urls import path
from .views import *

urlpatterns = [
    path('assign-manual/', AssignManualThemeView.as_view(), name='assign-themes'),
    path('assignments/<str:group_id>/', AssignmentDetailView.as_view(), name='assignment-detail'),
    path('assignments/encadrant/<str:encadrant>/', AssignmentByEncadrantView.as_view(), name='assignments-by-encadrant'),
    path('assignments/encadrant-by-groupe/<str:group_id>/', EncadrantByGroupeView.as_view(), name='encadrant-by-groupe'),
]

