import requests

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
