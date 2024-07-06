from flask import Flask, request, jsonify
from flask_cors import CORS
from txtai.pipeline import Textractor
import os

app = Flask(__name__)
CORS(app)  # This will allow all origins by default
textractor = Textractor(paragraphs=True)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/upload', methods=['POST'])
def upload_files():
    if 'knowledgeBaseFiles' not in request.files or 'questionDocumentsFiles' not in request.files:
        return jsonify({"error": "Missing file(s)"}), 400

    knowledge_base_files = request.files.getlist('knowledgeBaseFiles')
    question_documents_files = request.files.getlist('questionDocumentsFiles')

    kb_texts = []
    qd_texts = []

    for file in knowledge_base_files:
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(file_path)
        kb_texts.append(textractor(file_path))

    for file in question_documents_files:
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(file_path)
        qd_texts.append(textractor(file_path))

    """
    return jsonify({
        "knowledge_base_texts": kb_texts,
        "question_documents_texts": qd_texts
    })
    """
    
    questions = [   "Need for organisational performance development in Online Media Solution",
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
                    "Accountabilities and responsibilities of the following: ●	Managers ●	Staff members ",
                    "Documentation requirements "
                ]
    
    return jsonify({
        "questions": questions
    })

if __name__ == '__main__':
    app.run(debug=True)
