from rest_framework import serializers
from .models import Soutenance
from .discovery import discover_service
import requests
class SoutenanceSerializer(serializers.ModelSerializer):
    jury = serializers.ListField(write_only=True)  # Accepté à l’entrée
    jury_details = serializers.SerializerMethodField(read_only=True)  # Affiché à la sortie enrichie

    class Meta:
        model = Soutenance
        fields = '__all__'

    def get_jury_details(self, obj):
        jury_ids = obj.jury or []
        jury_infos = []

        request = self.context.get("request")
        if not request:
            raise serializers.ValidationError("Contexte de requête manquant.")
        token = request.headers.get("Authorization")
        if not token:
            raise serializers.ValidationError("Token manquant dans les headers. Authentification requise.")
        headers = {"Authorization": token}
        base_url = discover_service("SERVICE1-CLIENT")

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