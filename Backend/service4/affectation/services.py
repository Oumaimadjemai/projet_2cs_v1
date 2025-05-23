import requests
from .discovery import discover_service
from .models import Assignment

SERVICE1 = 'SERVICE1-CLIENT'
SERVICE2 = 'SERVICE2-CLIENT'
SERVICE3 = 'SERVICE3-NODE'



def is_admin_user(request):
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return False

    try:
        base = discover_service(SERVICE1)
        # Use a standard endpoint that verifies token and returns user info
        url = f"{base}/verify-admin"
        response = requests.get(url, headers={'Authorization': auth_header}, timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            return data.get('is_admin', False)  # Adjust based on SERVICE1's response format
        return False
    except Exception as e:
        print(f"Admin verification error: {str(e)}")
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

def get_theme_info(theme_id):
    base = discover_service(SERVICE2)
    try:
        response = requests.get(f"{base}/themes/{theme_id}/")
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Error fetching theme {theme_id}: {e}")
        return {}

# def get_group_members(group_id, jwt_token):
#     base_url = discover_service(SERVICE3)
#     headers = {'Authorization': jwt_token}
#     url = f"{base_url}/api/groups/{group_id}/members"
#     res = requests.get(url, headers=headers)
#     res.raise_for_status()
#     return res.json()

import requests

def get_group_members(group_id, jwt_token):
    try:
        base_url = discover_service(SERVICE3)
        headers = {'Authorization': jwt_token}
        url = f"{base_url}/api/groups/{group_id}/members"
        res = requests.get(url, headers=headers)
        if res.status_code == 404:
            return None  # Group not found
        res.raise_for_status()
        return res.json()
    except requests.RequestException as e:
        # Log the error if needed
        return None

