import requests
from django.core.exceptions import PermissionDenied
from django.utils import timezone
from .discovery import discover_service

def get_service_1_url_lazy():
    return discover_service('SERVICE1-CLIENT')


def verify_entreprise_id(entreprise_id):
    try:
        response = requests.get(f"{get_service_1_url_lazy()}/users-with-entreprise/")
        if response.status_code == 200:
            entreprises = response.json()
            return any(entreprise['id'] == entreprise_id for entreprise in entreprises)
        return False
    except requests.exceptions.RequestException:
        return False


# def verify_user(request, role):
#     token = request.headers.get("Authorization")
#     if not token:
#         raise PermissionDenied("Token manquant. Veuillez vous authentifier.")

#     try:
#         response = requests.get(
#             f"{get_service_1_url_lazy()}/verify-user/",
#             headers={"Authorization": token}
#         )
#     except requests.exceptions.RequestException:
#         raise PermissionDenied("Service d'authentification temporairement indisponible.")

#     if response.status_code != 200:
#         raise PermissionDenied(f"Échec de l'authentification (code {response.status_code}).")

#     user_data = response.json()

#     roles = {
#         "enseignant": "is_enseignant",
#         "entreprise": "is_entreprise"
#     }
#     if role not in roles or not user_data.get(roles[role]):
#         raise PermissionDenied(f"Accès réservé aux {role}s.")

#     return user_data

def verify_user(request, role):
    token = request.headers.get("Authorization")
    if not token:
        raise PermissionDenied("Token manquant. Veuillez vous authentifier.")

    try:
        response = requests.get(
            f"{get_service_1_url_lazy()}/verify-user/",
            headers={"Authorization": token}
        )
    except requests.exceptions.RequestException:
        raise PermissionDenied("Service d'authentification temporairement indisponible.")

    if response.status_code != 200:
        raise PermissionDenied(f"Échec de l'authentification (code {response.status_code}).")

    user_data = response.json()

    roles_map = {
        "enseignant": "is_enseignant",
        "entreprise": "is_entreprise"
    }

    if isinstance(role, str):
        role = [role]

    if not any(user_data.get(roles_map.get(r)) for r in role if r in roles_map):
        raise PermissionDenied(f"Accès réservé aux rôles : {', '.join(role)}.")

    return user_data



def find_annee_academique_id(soumission_date=None):
    base = get_service_1_url_lazy()
    now = soumission_date or timezone.now().date()

    try:
        response = requests.get(f"{base}/annees-academiques/")
        response.raise_for_status()
        for annee in response.json():
            if annee['date_debut'] <= str(now) <= annee['date_fin']:
                return annee['id']
    except Exception as e:
        print(f"[Erreur Service1] {e}")
    return None
