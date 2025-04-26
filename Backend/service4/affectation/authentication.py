import jwt
from django.conf import settings
from rest_framework.exceptions import AuthenticationFailed

def verify_admin_token(request):
    auth_header = request.headers.get('Authorization')

    if not auth_header or not auth_header.startswith('Bearer '):
        raise AuthenticationFailed('Missing or invalid Authorization header')

    token = auth_header.split(' ')[1]

    try:
        payload = jwt.decode(token, settings.SIMPLE_JWT['SIGNING_KEY'], algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        raise AuthenticationFailed('Token expired')
    except jwt.InvalidTokenError:
        raise AuthenticationFailed('Invalid token')

    # On check juste que c'est un admin
    if payload.get('type') != 'admin':
        raise AuthenticationFailed('Only admins are authorized')

    return payload  # tu peux retourner tout le payload si tu veux (id, email etc.)
