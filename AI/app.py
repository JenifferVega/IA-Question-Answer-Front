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

ALLOWED_EXTENSIONS = {'pdf', 'docx'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


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
        user_email = user.email  # Get the user's email
    except Exception as e:
        return jsonify({"error": str(e)}), 401

    # Knowledge base files are mandatory
    if 'knowledgeBaseFiles' not in request.files:
        return jsonify({"error": "Missing Knowledge Base file(s)"}), 400

    knowledge_base_files = request.files.getlist('knowledgeBaseFiles')
    question_documents_files = request.files.getlist('questionDocumentsFiles') if 'questionDocumentsFiles' in request.files else []

    # Directory paths based on user's email
    user_folder = os.path.join(app.config['UPLOAD_FOLDER'], user_email)
    
    # Create dovument title with 
    
    
    assessment_folder = os.path.join(user_folder, 'assessment')

    # Ensure the directories exist
    os.makedirs(assessment_folder, exist_ok=True)

    # Validate and save knowledge base files
    for file in knowledge_base_files:
        if not allowed_file(file.filename):
            return jsonify({"error": f"Invalid file type for {file.filename}. Only .docx and .pdf are allowed."}), 400

        file_path = os.path.join(assessment_folder, file.filename)
        file.save(file_path)

    # Validate and save question documents files (if any)
    if question_documents_files:
        for file in question_documents_files:
            if not allowed_file(file.filename):
                return jsonify({"error": f"Invalid file type for {file.filename}. Only .docx and .pdf are allowed."}), 400

            file_path = os.path.join(assessment_folder, file.filename)
            file.save(file_path)

    questions = [
        "Need for organisational performance development in Online Media Solution",
    ]

    return jsonify({
        "questions": questions,
        "user_name": user_name,  # Return the user's display name
        "saved_location": assessment_folder  # Optionally return the saved location
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
