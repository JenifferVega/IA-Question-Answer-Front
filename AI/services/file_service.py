import os
from flask import current_app
from utils.allowed_file import allowed_file

def handle_files(user_email, title, knowledge_base_files, question_documents_files):
    # Use UPLOAD_FOLDER from the app config
    user_folder = os.path.join(current_app.config['UPLOAD_FOLDER'], user_email)
    assessment_folder = os.path.join(user_folder, title)

    os.makedirs(assessment_folder, exist_ok=True)

    save_files(knowledge_base_files, assessment_folder)
    save_files(question_documents_files, assessment_folder)

    return user_folder, assessment_folder

def save_files(files, folder):
    for file in files:
        if not allowed_file(file.filename):
            raise ValueError(f"Invalid file type for {file.filename}. Only .docx and .pdf are allowed.")
        file.save(os.path.join(folder, file.filename))
