from flask import request, jsonify
from services.auth_service import verify_user
import os


def save_chat_history():
    id_token = request.headers.get("Authorization")

    # Verify the user
    user_info = verify_user(id_token)
    if not user_info:
        return jsonify({"error": "Invalid or missing ID token"}), 400

    user_email = user_info['email']
    folder_name = request.form.get('folder_name')
    html_content = request.form.get('html_content')

    # Define the path to the user and document folder
    user_folder = os.path.join('uploads', user_email)
    document_folder = os.path.join(user_folder, folder_name)

    # Check if the folder exists
    if not os.path.exists(document_folder):
        return jsonify({"error": f"Folder '{folder_name}' does not exist for user {user_email}"}), 400

    # Define the path for the chat HTML file
    html_file_path = os.path.join(document_folder, 'chat.html')

    # Save the HTML content to the chat.html file
    with open(html_file_path, 'w') as file:
        file.write(html_content)

    return jsonify({"message": f"Chat history saved successfully in {html_file_path}"}), 200


def get_html_content():
    id_token = request.headers.get("Authorization")

    # Verify the user
    user_info = verify_user(id_token)
    if not user_info:
        return jsonify({"error": "Invalid or missing ID token"}), 400

    user_email = user_info['email']
    folder_name = request.args.get('folder_name')  # Using request.args for GET parameters

    if not folder_name:
        return jsonify({"error": "Missing folder name"}), 400

    # Define the path to the chat.html file
    html_file_path = os.path.join('uploads', user_email, folder_name, 'chat.html')

    # Check if the file exists
    if not os.path.exists(html_file_path):
        return jsonify({"error": f"HTML file not found in folder '{folder_name}'"}), 404

    # Read the content of the chat.html file
    with open(html_file_path, 'r') as file:
        html_content = file.read()

    return jsonify({"html_content": html_content}), 200