from flask import request, jsonify
import os
from txtai.embeddings import Embeddings
from services.auth_service import verify_user
from rag.helper import GPT4LLM, context, run_prompt_gpt4
from flask import current_app
from openai import OpenAI

def rag_question():
    # Get the ID token from the request header
    id_token = request.headers.get("Authorization")

    # Verify the user from the token
    user_info = verify_user(id_token)
    if not user_info:
        return jsonify({"error": "Invalid or missing ID token"}), 400

    # Get the question and document name from the request
    question = request.json.get("question")
    document_name = request.json.get("documentName")

    if not question or not document_name:
        return jsonify({"error": "Missing question or document name"}), 400

    # Define the path to the embeddings index based on the user's email and document name
    user_email = user_info['email']
    embeddings_path = os.path.join('uploads', user_email, document_name, "embeddings_index")

    # Load the embeddings database
    if not os.path.exists(embeddings_path):
        return jsonify({"error": "Embeddings database not found for the specified document"}), 404

    embeddings = Embeddings()
    embeddings.load(embeddings_path)

    # Perform the context search using the embeddings
    text_context = context(question, embeddings)

    # Initialize the GPT-4 LLM
    ai_api_key = current_app.config['OPENAI_API_KEY']
    gpt4_llm = GPT4LLM(client=OpenAI(api_key=f'sk-{ai_api_key}'))

    # Generate the answer using the retrieved context and the question
    answer = run_prompt_gpt4(gpt4_llm, question, text_context)

    return jsonify({"answer": answer}), 200
