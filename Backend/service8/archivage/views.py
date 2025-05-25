# archivage/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from .tasks import archive_old_annees

class TriggerArchivageView(APIView):
    def get(self, request):
        archive_old_annees.delay()
        return Response({"status": "Archivage lancé"}, status=202)

