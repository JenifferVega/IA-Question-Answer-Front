from flask import Flask
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials
from config import Config  # Reference the Config class from config.py
from routes.upload_route import upload_files, user_documents
from routes.hello_route import hello
from routes.inference_questions_route import inference_questions
from routes.save_chat_history_route import save_chat_history, get_html_content
from routes.rag_route import rag_question
from flask import Flask

# Initialize Flask app and load configuration
app = Flask(__name__)
app.config.from_object(Config)  # Load configurations from Config class
CORS(app)

# Initialize Firebase Admin SDK with configured credentials
cred = credentials.Certificate({
    "type": app.config['FIREBASE_TYPE'],
    "project_id": app.config['FIREBASE_PROJECT_ID'],
    "private_key_id": app.config['FIREBASE_PRIVATE_KEY_ID'],
    "private_key": app.config['FIREBASE_PRIVATE_KEY'],
    "client_email": app.config['FIREBASE_CLIENT_EMAIL'],
    "client_id": app.config['FIREBASE_CLIENT_ID'],
    "auth_uri": app.config['FIREBASE_AUTH_URI'],
    "token_uri": app.config['FIREBASE_TOKEN_URI'],
    "auth_provider_x509_cert_url": app.config['FIREBASE_AUTH_PROVIDER_X509_CERT_URL'],
    "client_x509_cert_url": app.config['FIREBASE_CLIENT_X509_CERT_URL']
})
firebase_admin.initialize_app(cred)

# Register routes
app.add_url_rule('/upload', 'upload_files', upload_files, methods=['POST'])
app.add_url_rule('/hello', 'hello', hello, methods=['GET'])
app.add_url_rule('/inference-questions', 'inference_question', inference_questions, methods=['POST'])
app.add_url_rule('/save-chat-history', 'save_chat_history', save_chat_history, methods=['POST'])
app.add_url_rule('/get-html-content', 'get_html_content', get_html_content, methods=['GET'])
app.add_url_rule('/user-documents', 'user-documents', user_documents, methods=['GET'])
app.add_url_rule('/rag-question', 'rag-question', rag_question, methods=['POST'])


if __name__ == '__main__':
    app.run(debug=True)
