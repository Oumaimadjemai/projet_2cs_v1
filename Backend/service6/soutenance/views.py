import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from rest_framework.generics import ListAPIView


class ValidateSoutenanceView(APIView):
    def post(self, request, group_id):
        token = request.headers.get('Authorization')
        if not token:
            return Response({'error': 'Token requis'}, status=status.HTTP_401_UNAUTHORIZED)

        # 1. Récupérer l'utilisateur connecté (via Service 1)
        user_resp = requests.get(
            "http://127.0.0.1:8000/user/me/",
            headers={"Authorization": token}
        )

        if user_resp.status_code != 200:
            return Response({'error': 'Utilisateur invalide'}, status=status.HTTP_401_UNAUTHORIZED)

        user_data = user_resp.json()
        user_id = user_data["id"]
        user_type = user_data["type"]

        if user_type != "enseignant":
            return Response({'error': 'Accès réservé aux enseignants'}, status=status.HTTP_403_FORBIDDEN)

        # 2. Récupérer l'affectation du groupe via Service 4
        assignment_resp = requests.get(
            f"http://127.0.0.1:8003/assignments/{group_id}/"
        )

        if assignment_resp.status_code != 200:
            return Response({'error': 'Groupe non trouvé ou affectation manquante'}, status=status.HTTP_404_NOT_FOUND)

        assignment_data = assignment_resp.json()

        if assignment_data["encadrant"] != user_id:
            return Response({'error': 'Vous n\'êtes pas l\'encadrant de ce groupe'}, status=status.HTTP_403_FORBIDDEN)

        # 3. Valider la soutenance
        update_resp = requests.patch(
            f"http://127.0.0.1:8003/assignments/{group_id}/",
            json={"soutenance_valide": True}
        )

        if update_resp.status_code != 200:
            return Response({'error': 'Erreur lors de la validation'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({'message': 'Soutenance validée'}, status=status.HTTP_200_OK)

from datetime import datetime
from datetime import datetime
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import requests

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import requests
from datetime import datetime
from .serializers import SoutenanceSerializer
from .discovery import discover_service
from .models import Soutenance



# URLs statiques de chaque service
class SoutenanceCreateView(APIView):
    def post(self, request, group_id):
        token = request.headers.get("Authorization")
        if not token:
            return Response({"error": "Token requis"}, status=status.HTTP_401_UNAUTHORIZED)

        # Découvrir les services via Eureka
        AUTH_SERVICE_URL = discover_service("SERVICE1-CLIENT")
        AFFECTATION_SERVICE_URL = discover_service("SERVICE4-CLIENT")

        if not AUTH_SERVICE_URL:
            return Response({"error": "Service Auth non disponible via Eureka"}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        if not AFFECTATION_SERVICE_URL:
            return Response({"error": "Service Affectation non disponible via Eureka"}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        # 1. Vérifier l'utilisateur connecté (type admin)
        try:
            user_resp = requests.get(f"{AUTH_SERVICE_URL}/user/me/", headers={"Authorization": token})
            user_resp.raise_for_status()
            user_data = user_resp.json()
        except Exception:
            return Response({"error": "Service Auth non disponible ou utilisateur invalide"},
                            status=status.HTTP_401_UNAUTHORIZED)

        if user_data.get("type") != "admin":
            return Response({"error": "Accès réservé aux administrateurs"}, status=status.HTTP_403_FORBIDDEN)

        # 2. Vérifier l'affectation du groupe
        try:
            assignment_resp = requests.get(f"{AFFECTATION_SERVICE_URL}/assignments/{group_id}/")
            assignment_resp.raise_for_status()
            assignment_data = assignment_resp.json()
        except Exception:
            return Response({"error": "Service Affectation non disponible ou groupe non trouvé"},
                            status=status.HTTP_404_NOT_FOUND)

        if not assignment_data.get("soutenance_valide", False):
            return Response({"error": "Ce groupe n'est pas encore validé pour soutenance"},
                            status=status.HTTP_403_FORBIDDEN)

        # 3. Récupérer l'encadrant via /assignments/encadrant-by-groupe/{group_id}/
        try:
            encadrant_resp = requests.get(f"{AFFECTATION_SERVICE_URL}/assignments/encadrant-by-groupe/{group_id}/")
            encadrant_resp.raise_for_status()
            encadrant_id = encadrant_resp.json().get("encadrant")
            if not encadrant_id:
                raise ValueError("Encadrant non trouvé pour ce groupe")
        except Exception:
            return Response({"error": "Encadrant non trouvé pour ce groupe"},
                            status=status.HTTP_400_BAD_REQUEST)

        # 4. Vérifier que l'encadrant existe dans Service 1
        def verifier_encadrant(id_encadrant):
            url_enseignant = f"{AUTH_SERVICE_URL}/enseignants/{id_encadrant}/"
            resp = requests.get(url_enseignant, headers={"Authorization": token})
            if resp.status_code == 200:
                return True
            if resp.status_code == 404:
                url_entreprise = f"{AUTH_SERVICE_URL}/users/{id_encadrant}/"
                resp2 = requests.get(url_entreprise, headers={"Authorization": token})
                if resp2.status_code == 200:
                    return True
                if resp2.status_code == 404:
                    return False
                resp2.raise_for_status()
            resp.raise_for_status()

        if not verifier_encadrant(encadrant_id):
            return Response({"error": f"Encadrant avec id '{encadrant_id}' non trouvé"},
                            status=status.HTTP_400_BAD_REQUEST)

        # 5. Vérifier la date dans la période autorisée
        try:
            periodes_resp = requests.get(f"{AUTH_SERVICE_URL}/periodes", headers={"Authorization": token})
            periodes_resp.raise_for_status()
            periodes = periodes_resp.json()
        except Exception:
            return Response({"error": "Impossible de récupérer les périodes depuis Service 1"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        date_str = request.data.get("date")
        if not date_str:
            return Response({"error": "Champ 'date' requis"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            date_soutenance = datetime.strptime(date_str, "%Y-%m-%d").date()
        except ValueError:
            return Response({"error": "Format de date invalide (attendu: YYYY-MM-DD)"},
                            status=status.HTTP_400_BAD_REQUEST)

        soutenance_valide = any(
            p["type"] == "soutenance" and not p["archived"] and
            p["date_debut"] <= date_str <= p["date_fin"]
            for p in periodes
        )

        if not soutenance_valide:
            return Response({"error": "Date hors de la période autorisée pour les soutenances"},
                            status=status.HTTP_400_BAD_REQUEST)

        # 6. Vérifier la salle
        salle_id = request.data.get("salle")
        if not salle_id:
            return Response({"error": "Champ 'salle' requis"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            salle_resp = requests.get(f"{AUTH_SERVICE_URL}/salles/{salle_id}/", headers={"Authorization": token})
            salle_resp.raise_for_status()
            salle = salle_resp.json()
        except requests.exceptions.HTTPError:
            if salle_resp.status_code == 404:
                return Response({"error": f"Salle '{salle_id}' non trouvée"}, status=status.HTTP_400_BAD_REQUEST)
            return Response({"error": "Impossible de récupérer la salle depuis Service 1"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        if not salle.get("disponible", False):
            return Response({"error": f"La salle '{salle_id}' n'est pas disponible"}, status=status.HTTP_400_BAD_REQUEST)

        heure_debut_str = request.data.get("heure_debut")
        heure_fin_str = request.data.get("heure_fin")

        if not heure_debut_str or not heure_fin_str:
            return Response({"error": "Champs 'heure_debut' et 'heure_fin' requis"},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            heure_debut = datetime.strptime(heure_debut_str, "%H:%M:%S").time()
            heure_fin = datetime.strptime(heure_fin_str, "%H:%M:%S").time()
        except ValueError:
            return Response({"error": "Format d'heure invalide (attendu HH:MM:SS)"},
                            status=status.HTTP_400_BAD_REQUEST)

        conflits = Soutenance.objects.filter(
            salle=salle_id,
            date=date_str,
            heure_fin__gt=heure_debut,
            heure_debut__lt=heure_fin
        )

        if conflits.exists():
            return Response({
                "error": "Conflit de planning : la salle est déjà réservée pendant cet intervalle horaire"
            }, status=status.HTTP_400_BAD_REQUEST)

        # ✅ Vérification année / spécialité
        annee_id = request.data.get("annee")
        specialite_id = request.data.get("specialite")

        try:
            annee_resp = requests.get(f"{AUTH_SERVICE_URL}/annees/{annee_id}/", headers={"Authorization": token})
            annee_resp.raise_for_status()
            annee_data = annee_resp.json()
        except requests.exceptions.HTTPError:
            return Response({"error": f"Année '{annee_id}' non trouvée"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception:
            return Response({"error": "Erreur lors de la vérification de l'année"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        has_specialite = annee_data.get("has_specialite", False)

        if has_specialite:
            if not specialite_id:
                return Response({"error": "Cette année nécessite une spécialité"}, status=status.HTTP_400_BAD_REQUEST)
            try:
                specialite_resp = requests.get(f"{AUTH_SERVICE_URL}/specialites/{specialite_id}/", headers={"Authorization": token})
                if specialite_resp.status_code == 404:
                    return Response({"error": f"Spécialité '{specialite_id}' non trouvée"}, status=status.HTTP_400_BAD_REQUEST)
                specialite_resp.raise_for_status()
            except Exception:
                return Response({"error": "Erreur lors de la vérification de la spécialité"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            if specialite_id:
                return Response({"error": "Cette année ne doit pas avoir de spécialité"}, status=status.HTTP_400_BAD_REQUEST)

        # 7. Jury
        jury_ids = request.data.get("jury")
        if not isinstance(jury_ids, list):
            return Response({"error": "Champ 'jury' requis et doit être une liste"}, status=status.HTTP_400_BAD_REQUEST)

        if encadrant_id not in jury_ids:
            jury_ids.append(encadrant_id)

        for utilisateur_id in jury_ids:
            try:
                utilisateur_resp = requests.get(f"{AUTH_SERVICE_URL}/users/{utilisateur_id}/", headers={"Authorization": token})
                if utilisateur_resp.status_code == 404:
                    return Response({"error": f"Utilisateur avec id '{utilisateur_id}' non trouvé"}, status=status.HTTP_400_BAD_REQUEST)
                utilisateur_resp.raise_for_status()
            except Exception:
                return Response({"error": "Erreur lors de la vérification des utilisateurs"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Vérification des conflits pour chaque membre du jury
        for utilisateur_id in jury_ids:
           conflits_jury = Soutenance.objects.filter(
             jury__contains=[utilisateur_id],  # Assumant un champ jury qui contient la liste des IDs
             date=date_str,
             heure_fin__gt=heure_debut,
             heure_debut__lt=heure_fin
    )
           if conflits_jury.exists():
              return Response({
            "error": f"Conflit de planning : l'utilisateur avec id '{utilisateur_id}' a déjà une soutenance durant cet intervalle"
        }, status=status.HTTP_400_BAD_REQUEST)

        # 8. Créer la soutenance
        data = request.data.copy()
        data["groupe"] = group_id
        data["jury"] = jury_ids



        serializer = SoutenanceSerializer(data=data)
        if serializer.is_valid():
            soutenance = serializer.save()

            jury_details = []
            for utilisateur_id in jury_ids:
                try:
                    resp = requests.get(f"{AUTH_SERVICE_URL}/users/{utilisateur_id}/", headers={"Authorization": token})
                    resp.raise_for_status()
                    user_data = resp.json()
                    jury_details.append({
                        "id": user_data.get("id"),
                        "nom": user_data.get("nom"),
                        "prenom": user_data.get("prenom")
                    })
                except Exception:
                    jury_details.append({"id": utilisateur_id, "nom": None, "prenom": None})

            response_data = {
                "id": soutenance.id,
                "annee": soutenance.annee,
                "annee_academique":soutenance.annee_academique,
                "specialite": soutenance.specialite,
                "groupe": str(soutenance.groupe),
                "date": str(soutenance.date),
                "heure_debut": str(soutenance.heure_debut),
                "heure_fin": str(soutenance.heure_fin),
                "salle": soutenance.salle,  # entier, pas un objet
                "jury": jury_details,
                "created_at": soutenance.created_at.isoformat() if soutenance.created_at else None
            }

            return Response(response_data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET'])
def soutenances_par_annee(request, annee_id):
    soutenances = Soutenance.objects.filter(annee=annee_id)
    serializer = SoutenanceSerializer(soutenances, many=True, context={'request': request})
    serializer = SoutenanceSerializer(soutenances, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['GET'])
def soutenances_par_annee_specialite(request, annee_id, specialite_id):
    soutenances = Soutenance.objects.filter(annee=annee_id, specialite=specialite_id)
    serializer = SoutenanceSerializer(soutenances, many=True, context={'request': request})
    serializer = SoutenanceSerializer(soutenances, many=True, context={'request': request})
    return Response(serializer.data)



@api_view(['GET'])
def soutenances_par_groupe(request, groupe_id):
    soutenances = Soutenance.objects.filter(groupe=groupe_id)
    serializer = SoutenanceSerializer(soutenances, many=True, context={'request': request})
    serializer = SoutenanceSerializer(soutenances, many=True, context={'request': request})
    return Response(serializer.data)


class SoutenancesParEncadrantView(APIView):
    def get(self, request, encadrant_id):
        try:
            AFFECTATION_SERVICE_URL = discover_service("SERVICE4-CLIENT")
            if not AFFECTATION_SERVICE_URL:
                return Response({'error': 'Service d’affectation non trouvé'}, status=500)

            response = requests.get(f'{AFFECTATION_SERVICE_URL}/assignments/encadrant/{encadrant_id}/')

            if response.status_code == 404:
                return Response({
                    'error': 'Aucun encadrant trouvé avec cet ID dans le service d’affectation.'
                }, status=404)

            response.raise_for_status()
            affectations = response.json()

            if not affectations:
                return Response({
                    'message': 'Encadrant trouvé, mais aucune affectation n’est liée.'
                }, status=200)

            group_ids = [aff['group_id'] for aff in affectations]
            soutenances = Soutenance.objects.filter(groupe__in=group_ids)
            serializer = SoutenanceSerializer(soutenances, many=True, context={'request': request})
            return Response(serializer.data)

        except requests.exceptions.RequestException as e:
            return Response({
                'error': 'Erreur lors de l’appel à SERVICE4-CLIENT',
                'details': str(e)
            }, status=500)

class SoutenanceDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Soutenance.objects.all()
    serializer_class = SoutenanceSerializer

    def patch(self, request, pk):
        try:
            soutenance = self.get_object()
            serializer = self.get_serializer(soutenance, data=request.data, partial=True, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Soutenance.DoesNotExist:
            return Response({"error": "Soutenance non trouvée"}, status=404)

    def delete(self, request, pk):
        try:
            soutenance = self.get_object()
            soutenance.delete()
            return Response({"message": "Soutenance supprimée avec succès"}, status=204)
        except Soutenance.DoesNotExist:
            return Response({"error": "Soutenance non trouvée"}, status=404)


class SoutenanceListView(ListAPIView):
    queryset = Soutenance.objects.all()
    serializer_class = SoutenanceSerializer

    def get_serializer_context(self):
        return {'request': self.request}

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
@api_view(['GET'])
def soutenances_a_archiver(request):
    soutenances = Soutenance.objects.filter(archived=False)
    serializer = SoutenanceSerializer(soutenances, many=True, context={'request': request})
    return Response(serializer.data)

class SoutenanceArchiverView(APIView):
    def patch(self, request, pk):
        try:
            soutenance = Soutenance.objects.get(pk=pk)
            soutenance.archived = True
            soutenance.save()
            return Response({"detail": "Soutenance archivée."}, status=status.HTTP_200_OK)
        except Soutenance.DoesNotExist:
            return Response({"detail": "Soutenance non trouvée."}, status=status.HTTP_404_NOT_FOUND)
    
# class SoutenanceParEtudiantView(APIView):

#     def get(self, request):
#         user_id = request.user.id
#         headers = {
#             'Authorization': request.headers.get('Authorization')
#         }

#         try:
#             # Appel au service 3
#             service3url=discover_service("SERVICE3-NODE")
#             service3_url = f'{service3url}/api/groups/user'
#             response = requests.get(service3_url, headers=headers)

#             if response.status_code != 200:
#                 return Response({'error': 'Erreur lors de la récupération des groupes'}, status=response.status_code)

#             groupes = response.json()
#             if not groupes:
#                 return Response({'error': 'Aucun groupe trouvé'}, status=status.HTTP_404_NOT_FOUND)

#         except requests.RequestException:
#             return Response({'error': 'Service 3 inaccessible'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

#         # Récupération des soutenances pour chaque groupe
#         soutenances = []
#         for groupe in groupes:
#             group_id = groupe['_id']
#             try:
#                 soutenance = Soutenance.objects.get(groupe=group_id)
#                 serializer = SoutenanceSerializer(soutenance, context={'request': request})
#                 soutenances.append(serializer.data)
#             except Soutenance.DoesNotExist:
#                 continue

#         if not soutenances:
#             return Response({'error': 'Aucune soutenance trouvée pour vos groupes'}, status=status.HTTP_404_NOT_FOUND)

#         return Response(soutenances)
    


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Soutenance
from .serializers import SoutenanceSerializer
import requests
from .discovery import discover_service


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import requests
from .models import Soutenance
from .serializers import SoutenanceSerializer
class SoutenanceParEtudiantView(APIView):
    def get(self, request):
        headers = {
            'Authorization': request.headers.get('Authorization')
        }

        # 1. Récupérer les groupes de l'étudiant depuis Service 3
        try:
            service3_url = discover_service("SERVICE3-NODE")
            if not service3_url:
                return Response({'error': 'Service 3 non trouvé'}, status=500)

            response = requests.get(f'{service3_url}/api/groups/user', headers=headers)
            if response.status_code != 200:
                return Response({'error': 'Erreur lors de la récupération des groupes'}, status=response.status_code)

            groupes = response.json()
            if not groupes:
                return Response({'error': 'Aucun groupe trouvé'}, status=status.HTTP_404_NOT_FOUND)
        except requests.RequestException:
            return Response({'error': 'Service 3 inaccessible'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        # 2. Initialiser la liste de soutenances
        soutenances_data = []

        # Découvrir l'URL de service1
        service1_url = discover_service("SERVICE1-CLIENT")

        for groupe in groupes:
            group_id = groupe.get('_id')

            try:
                soutenance = Soutenance.objects.get(groupe=group_id)
            except Soutenance.DoesNotExist:
                continue

            serializer = SoutenanceSerializer(soutenance, context={'request': request})
            soutenance_data = serializer.data

            # 3. Récupérer le nom du groupe depuis Service 3
            try:
                group_response = requests.get(f'{service3_url}/api/groups/{group_id}', headers=headers)
                if group_response.status_code == 200:
                    group_details = group_response.json()
                    soutenance_data['nom_groupe'] = group_details.get('name')
                else:
                    soutenance_data['nom_groupe'] = None
            except requests.RequestException:
                soutenance_data['nom_groupe'] = None

            # 4. Récupérer l'année académique + département concaténés depuis Service 1
            try:
                if service1_url:
                    annee_id = soutenance_data.get("annee")
                    annee_response = requests.get(f'{service1_url}/annees/{annee_id}/', headers=headers)
                    if annee_response.status_code == 200:
                        annee_data = annee_response.json()
                        annee_title = annee_data.get('title') or ''
                        departement_title = annee_data.get('departement_title') or ''
                        if annee_title or departement_title:
                            soutenance_data['annee'] = f"{annee_title} - {departement_title}".strip(" -")
                        else:
                            soutenance_data['annee'] = None
                    else:
                        soutenance_data['annee'] = None
                else:
                    soutenance_data['annee'] = None
            except requests.RequestException:
                soutenance_data['annee'] = None

            # 5. Récupérer le titre de la spécialité depuis Service 1
            try:
                specialite_id = soutenance_data.get("specialite")
                if specialite_id and service1_url:
                    specialite_response = requests.get(f'{service1_url}/specialites/{specialite_id}/', headers=headers)
                    if specialite_response.status_code == 200:
                        specialite_data = specialite_response.json()
                        soutenance_data['specialite'] = specialite_data.get('title')
                    else:
                        soutenance_data['specialite'] = None
                else:
                    soutenance_data['specialite'] = None
            except requests.RequestException:
                soutenance_data['specialite'] = None

            # 6. Récupérer nom_salle + département concaténés depuis Service 1
            try:
                salle_id = soutenance_data.get("salle")
                if salle_id and service1_url:
                    salle_response = requests.get(f'{service1_url}/salles/{salle_id}/', headers=headers)
                    if salle_response.status_code == 200:
                        salle_data = salle_response.json()
                        nom_salle = salle_data.get('nom_salle') or ''
                        departement_id = salle_data.get('departement')

                        # Récupérer le nom du département si id fourni
                        departement_title = ''
                        if departement_id:
                            departement_response = requests.get(f'{service1_url}/departements/{departement_id}/', headers=headers)
                            if departement_response.status_code == 200:
                                departement_data = departement_response.json()
                                departement_title = departement_data.get('title') or ''

                        if nom_salle or departement_title:
                            soutenance_data['nom_salle'] = f"{nom_salle} - {departement_title}".strip(" -")
                        else:
                            soutenance_data['nom_salle'] = None
                    else:
                        soutenance_data['nom_salle'] = None
                else:
                    soutenance_data['nom_salle'] = None
            except requests.RequestException:
                soutenance_data['nom_salle'] = None

            soutenances_data.append(soutenance_data)

        if not soutenances_data:
            return Response({'error': 'Aucune soutenance trouvée pour vos groupes'}, status=status.HTTP_404_NOT_FOUND)

        return Response(soutenances_data)

