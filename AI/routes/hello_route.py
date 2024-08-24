from flask import request, jsonify
from services.auth_service import verify_user

def hello():
    id_token = request.headers.get("Authorization")

    user_info = verify_user(id_token)
    if not user_info:
        return jsonify({"error": "Invalid or missing ID token"}), 400

    print(f"Hello from {user_info['email']}!")
    return jsonify({"message": f"Hello, {user_info['email']}!"})
