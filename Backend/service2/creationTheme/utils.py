import requests
from django.core.exceptions import PermissionDenied
SERVICE_1_URL = "http://localhost:8000"


def verify_entreprise_id(entreprise_id):
    try:
        response = requests.get(f"{SERVICE_1_URL}/users-with-entreprise/")
        if response.status_code == 200:
            entreprises = response.json()
            if any(entreprise['id'] == entreprise_id for entreprise in entreprises):
                return True
        return False
    except requests.exceptions.RequestException:
        return False



def verify_user(request, role):
    """
    Vérifie si l'utilisateur est authentifié et possède le rôle spécifié (enseignant ou entreprise).
    """
    token = request.headers.get("Authorization")
    if not token:
        raise PermissionDenied("Token manquant. Veuillez vous authentifier.")

    response = requests.get(
        f"{SERVICE_1_URL}/verify-user/",
        headers={"Authorization": token}
    )

    if response.status_code != 200:
        raise PermissionDenied("Échec de l'authentification.")

    user_data = response.json()
    
    if role == "enseignant" and not user_data.get("is_enseignant"):
        raise PermissionDenied("Accès réservé aux enseignants.")
    if role == "entreprise" and not user_data.get("is_entreprise"):
        raise PermissionDenied("Accès réservé aux entreprises.")

    return user_data  # Retourne les données de l'utilisateur si valide
