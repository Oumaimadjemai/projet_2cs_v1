from django.urls import path
from .views import *

urlpatterns = [
    path('assign-manual/', AssignManualThemeView.as_view(), name='assign-themes'),
    # path('assignments/', AssignmentListView.as_view(), name='assignments-list'),
    # path('assign-single-theme/', AssignSingleThemeView.as_view(), name='assign-single-theme'),
]

