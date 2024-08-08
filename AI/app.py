from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, auth
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


# Firebase Admin SDK configuration using environment variables
firebase_creds = {
    "type": os.getenv("FIREBASE_TYPE"),
    "project_id": os.getenv("FIREBASE_PROJECT_ID"),
    "private_key_id": os.getenv("FIREBASE_PRIVATE_KEY_ID"),
    "private_key": os.getenv("FIREBASE_PRIVATE_KEY").replace('\\n', '\n'),
    "client_email": os.getenv("FIREBASE_CLIENT_EMAIL"),
    "client_id": os.getenv("FIREBASE_CLIENT_ID"),
    "auth_uri": os.getenv("FIREBASE_AUTH_URI"),
    "token_uri": os.getenv("FIREBASE_TOKEN_URI"),
    "auth_provider_x509_cert_url": os.getenv("FIREBASE_AUTH_PROVIDER_X509_CERT_URL"),
    "client_x509_cert_url": os.getenv("FIREBASE_CLIENT_X509_CERT_URL")
}
print("Firebase Project ID:", os.getenv("FIREBASE_PROJECT_ID"))

# Initialize Firebase Admin SDK with configured credentials
cred = credentials.Certificate(firebase_creds)
firebase_admin.initialize_app(cred)

app = Flask(__name__)
CORS(app)

# Configuration for uploaded files
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/upload', methods=['POST'])
def upload_files():
    id_token = request.headers.get("Authorization")

    if not id_token:
        return jsonify({"error": "Missing ID token"}), 400

    try:
        # Verify the ID token
        decoded_token = auth.verify_id_token(id_token.split(" ")[1])  # Split to remove 'Bearer'
        uid = decoded_token['uid']
        user = auth.get_user(uid)
        user_name = user.display_name
    except Exception as e:
        return jsonify({"error": str(e)}), 401

    if 'knowledgeBaseFiles' not in request.files or 'questionDocumentsFiles' not in request.files:
        return jsonify({"error": "Missing file(s)"}), 400

    knowledge_base_files = request.files.getlist('knowledgeBaseFiles')
    question_documents_files = request.files.getlist('questionDocumentsFiles')

    for file in knowledge_base_files:
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(file_path)
        # Process files here if necessary

    for file in question_documents_files:
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(file_path)
        # Process files here if necessary

    questions = [
        "Need for organisational performance development in Online Media Solution",
                    "Five (5) benefits of organisational performance development",
                    "Purpose and objectives of the performance development program",
                    "Management structures and wider support requirements in development program",
                    "Responsibilities of the managers in development program",
                    "Relevant legislation in development program",
                    "Three (3) modes and methods to conduct performance reviews.",
                    "Methods and resources needed to report the outcomes of the organisational performance development program",
                    "Means for reporting and collating outcomes of organisational performance development",
                    "Key performance indicators of the team members",
                    "Procedure to conduct performance appraisals (200-300 words)",
                    "Benefits of organisational performance development (200-300 words)",
                    "GROW model of coaching staff members (200-300 words)",
                    "Purpose of the performance development policies and procedures.",
                    "Scope of the performance development policies and procedures.",
                    "Organisational performance development procedures.",
                    "Accountabilities and responsibilities of the following: ● Managers ● Staff members ",
                    "Documentation requirements "
    ]

    return jsonify({
        "questions": questions,
        "user_name": user_name  # Return the user's display name
    })

@app.route('/hello', methods=['GET'])
def hello():
    id_token = request.headers.get("Authorization")

    if not id_token:
        return jsonify({"error": "Missing ID token"}), 400

    try:
        # Verify the ID token
        decoded_token = auth.verify_id_token(id_token.split(" ")[1])  # Split to remove 'Bearer'
        uid = decoded_token['uid']
        user = auth.get_user(uid)
        print(user)
        user_name = user.email
    except Exception as e:
        return jsonify({"error": str(e)}), 401

    # Print to the server console
    print(f"Hello from {user_name}!")

    # Send response to the frontend
    return jsonify({"message": f"Hello, {user_name}!"})

if __name__ == '__main__':
    app.run(debug=True)
