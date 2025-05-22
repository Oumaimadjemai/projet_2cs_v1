import requests
from .discovery import discover_service

SERVICE1 = 'SERVICE1-CLIENT'
SERVICE2 = 'SERVICE2-CLIENT'
SERVICE3 = 'SERVICE3_NODE'



def is_admin_user(request):
    auth_header = request.headers.get('Authorization')
    print("AUTH HEADER RECEIVED:", auth_header)

    if not auth_header:
        print("No Authorization header found!")
        return False

    try:
        base = discover_service(SERVICE1)
        url = f"{base}/verify-admin/"
        print("Calling URL:", url)

        response = requests.get(url, headers={'Authorization': auth_header})
        print("Response status code:", response.status_code)
        print("Response body:", response.text)

        if response.status_code == 200:
            data = response.json()
            return data.get('is_admin', False)
        else:
            return False
    except Exception as e:
        print("Exception while verifying admin:", e)
        return False

def verify_admin_token(request):
    base = discover_service(SERVICE1)
    auth_header = request.headers.get('Authorization')

    if not auth_header or not auth_header.startswith('Bearer '):
        raise requests.exceptions.RequestException('Missing or invalid Authorization header')

    headers = {
        'Authorization': auth_header
    }

    try:
        response = requests.get(f"{base}/verify-admin/", headers=headers, timeout=5)
        response.raise_for_status()
    except requests.RequestException:
        raise requests.exceptions.RequestException("Service d'authentification inaccessible")

    data = response.json()
    if data.get('type') != 'admin':
        raise requests.exceptions.RequestException("Accès réservé à l'administrateur")

    return data
def get_themes():
    base = discover_service(SERVICE2)
    response = requests.get(f"{base}/themes/valides/")
    response.raise_for_status()
    return response.json()

def get_submissions():
    base = discover_service(SERVICE3)
    url = f"{base}/api/theme-selection/submissions"
    try:
        response = requests.get(url, timeout=5)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.HTTPError as http_err:
        print(f"[HTTP ERROR] Submissions fetch failed: {http_err} - Status: {response.status_code} - Body: {response.text}")
    except requests.exceptions.RequestException as req_err:
        print(f"[REQUEST ERROR] Submissions fetch failed: {req_err}")
    except Exception as e:
        print(f"[GENERAL ERROR] Unexpected error fetching submissions: {e}")
    raise Exception("Erreur lors de la récupération des soumissions")


def assign_themes():
    themes = get_themes()
    submissions = get_submissions()

    # Dictionnaire : theme_id ➔ capacité restante
    theme_capacity = {theme['id']: theme.get('numberOfGrp', 1) for theme in themes}
    assignments = {}

    for submission in submissions:
        group_id = submission['_id']
        choices = submission['choices']
        for priority in ['p1', 'p2', 'p3']:
            theme_id = choices.get(priority)
            if theme_id and theme_capacity.get(theme_id, 0) > 0:
                assignments[group_id] = theme_id
                theme_capacity[theme_id] -= 1
                break

    return assignments
def get_theme_info(theme_id):
    base = discover_service(SERVICE2)
    try:
        response = requests.get(f"{base}/themes/{theme_id}/")
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Error fetching theme {theme_id}: {e}")
        return {}

def get_group_members(group_id, jwt_token=None):
    base = discover_service(SERVICE3)
    url = f"{base}/api/groups/{group_id}/members/"

    headers = {}
    if jwt_token:
        headers['Authorization'] = jwt_token

    try:
        response = requests.get(url, headers=headers, timeout=5)
        response.raise_for_status()

        data = response.json()
        members = data.get('members', [])
        print(f"[DEBUG] Groupe {group_id} - Membres reçus: {members}")
        return members

    except requests.exceptions.HTTPError as http_err:
        print(f"[HTTP ERROR] Impossible de récupérer les membres du groupe {group_id}: {http_err} - Status: {response.status_code}")
    except requests.exceptions.RequestException as req_err:
        print(f"[REQUEST ERROR] Erreur de requête pour le groupe {group_id}: {req_err}")
    except Exception as e:
        print(f"[GENERAL ERROR] Erreur inattendue pour le groupe {group_id}: {e}")

    return []

import random

def assign_random_theme_to_group(theme_id):
    """
    Assign a given theme_id to a random group who selected it in their submissions.
    """
    submissions = get_submissions()
    eligible_groups = []

    for submission in submissions:
        group_id = submission['_id']
        choices = submission['choices'].values()  # p1, p2, p3
        if str(theme_id) in map(str, choices):
            eligible_groups.append(group_id)

    print(f"[DEBUG] Eligible groups for theme {theme_id}: {eligible_groups}")

    if not eligible_groups:
        return None, f"Aucun groupe n'a choisi ce thème."

    chosen_group = random.choice(eligible_groups)
    return chosen_group, None

