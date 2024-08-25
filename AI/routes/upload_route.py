import os
from flask import request, jsonify
from services.auth_service import verify_user
from services.file_service import handle_files
from services.summarizer_service import generate_summary
from services.assessment_processing_service import (
    clean_text, extract_sections, segment_text, 
    cluster_segments, check_similarity, extract_questions,
    request_gpt_completion, parse_gpt_output_to_json
)
from txtai.pipeline import Similarity, Labels, Summary
from openai import OpenAI
from flask import current_app
from nltk.tokenize import texttiling

def upload_files():
    
    """
    ai_api_key = current_app.config['OPENAI_API_KEY']
    # Initialize the OpenAI client
    client =  OpenAI(api_key=f'sk-{ai_api_key}')
    """
    
    # Get the ID token from the request header
    id_token = request.headers.get("Authorization")

    # Verify the user from the token
    user_info = verify_user(id_token)
    if not user_info:
        return jsonify({"error": "Invalid or missing ID token"}), 400

    # Ensure that Knowledge Base files are provided
    if 'knowledgeBaseFiles' not in request.files:
        return jsonify({"error": "Missing Knowledge Base file(s)"}), 400

    # Get the Knowledge Base and Question Documents files
    knowledge_base_files = request.files.getlist('knowledgeBaseFiles')
    question_documents_files = request.files.getlist('questionDocumentsFiles') if 'questionDocumentsFiles' in request.files else []

    # Create a document title from the filenames of both Knowledge Base and Question Documents
    all_filenames = ', '.join([file.filename for file in knowledge_base_files + question_documents_files])
    title = generate_summary(all_filenames, maxlength=10)
    
    # Create user and assessment directories
    user_folder, assessment_folder = handle_files(user_info['email'], title, knowledge_base_files, question_documents_files)

    # Save Knowledge Base and Question Document files
    # Assume `handle_files` function saves the files to their respective directories

    # Initialize the questions list
    extracted_questions = []

    # Process the Question Document files for question extraction
    if question_documents_files:
        # Assuming we process the first Question Document file
        question_doc_path = os.path.join(assessment_folder, question_documents_files[0].filename)

        # Extract sections from the question document
        sections_extracted = extract_sections(question_doc_path)

        # Clean and process the sections
        for section in sections_extracted:
            cleaned_text = clean_text(section)

            # Tokenize the cleaned text
            tokenizer = texttiling.TextTilingTokenizer()
            segments = segment_text(cleaned_text, tokenizer)

            # Cluster segments and extract questions
            labels = Labels("microsoft/deberta-large-mnli")
            tags = [1, 2]
            first_cluster, second_cluster = cluster_segments(segments, labels, tags)

            # Check similarity for AI-solvable questions
            similarity = Similarity("valhalla/distilbart-mnli-12-3")
            first_cluster_text = " ".join(first_cluster)
            second_cluster_text = " ".join(second_cluster)
            # Summary to improve similarity
            summary = Summary()
            summary_cluster_info = summary([first_cluster_text,second_cluster_text], maxlength=200)
            sim_check = check_similarity(similarity, "Ai can solve this activity?", summary_cluster_info)
            selected_cluster = second_cluster if sim_check[0][0] != 0 else first_cluster
                
            # Extract relevant questions
            
            relevant_questions = [question_text for _, question_text in extract_questions(similarity, "Ai can solve this activity?", selected_cluster)]
            
            filtered_relevant_questions = [segment for segment in selected_cluster if segment in relevant_questions]
            
            """

            relevant_questions_text = " ".join([question_text for score, question_text in relevant_questions_with_indices])

            # Use GPT to extract more detailed questions
            gpt_output = request_gpt_completion(client, relevant_questions_text)
            
            # Parse the GPT output into JSON format
            parsed_questions = parse_gpt_output_to_json(gpt_output)
            
            """
                        
            extracted_questions = filtered_relevant_questions
            

    # Return the extracted questions along with user info and document title
    return jsonify({
        "questions": extracted_questions,
        "documentName": title,
    })
