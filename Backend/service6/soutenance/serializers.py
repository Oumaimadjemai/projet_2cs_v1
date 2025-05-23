from rest_framework import serializers
from .models import Soutenance
from .discovery import discover_service
import requests
class SoutenanceSerializer(serializers.ModelSerializer):
    jury = serializers.SerializerMethodField()

    class Meta:
        model = Soutenance
        fields = '__all__'

    def get_jury(self, obj):
        jury_ids = obj.jury
        jury_infos = []

        base_url = "http://localhost:8000"
        request = self.context.get("request")
    
        if not request:
           raise serializers.ValidationError("Contexte de requête manquant.")

        token = request.headers.get("Authorization")

        if not token:
            raise serializers.ValidationError("Token manquant dans les headers. Authentification requise.")

        headers = {"Authorization": token}

        for user_id in jury_ids:
            try:
                url = f"{base_url}/users/{user_id}/"
                response = requests.get(url, headers=headers, timeout=3)
                if response.status_code == 200:
                   data = response.json()
                   jury_infos.append({
                    "id": data.get("id"),
                    "nom": data.get("nom"),
                    "prenom": data.get("prenom")
                })
                else:
                  jury_infos.append({"id": user_id, "nom": None, "prenom": None})
            except Exception as e:
               print(f"Erreur utilisateur {user_id}: {e}")
               jury_infos.append({"id": user_id, "nom": None, "prenom": None})

        return jury_infos