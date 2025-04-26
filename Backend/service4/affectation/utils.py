# import jwt

# def get_user_id_from_token(request):
#     token = request.headers.get('Authorization', '').split('Bearer ')[-1]
#     if not token:
#         return None

#     try:
#         decoded = jwt.decode(token, options={"verify_signature": False})
#         return decoded.get("user_id")
#     except jwt.DecodeError:
#         return None
import jwt

def get_user_id_from_token(request):
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        raise Exception("Missing token")

    token = auth_header.split(' ')[1]
    try:
        decoded = jwt.decode(token, options={"verify_signature": False})  # No verification
        print("[DEBUG] Decoded token payload:", decoded)

        user_id = decoded.get('user_id') or decoded.get('id')
        if not user_id:
            raise Exception("user_id missing from token")
        
        return user_id
    except jwt.ExpiredSignatureError:
        raise Exception("Token expired")
    except Exception as e:
        raise Exception(f"Invalid token: {e}")
