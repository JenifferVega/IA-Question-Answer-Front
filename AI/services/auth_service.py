from firebase_admin import auth

def verify_user(id_token):
    try:
        decoded_token = auth.verify_id_token(id_token.split(" ")[1])
        uid = decoded_token['uid']
        user = auth.get_user(uid)
        return {"name": user.display_name, "email": user.email}
    except Exception as e:
        print(f"Authentication error: {e}")
        return None
