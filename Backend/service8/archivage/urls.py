# archivage/urls.py
from django.urls import path
from .views import TriggerArchivageView

urlpatterns = [path('trigger/', TriggerArchivageView.as_view())]
