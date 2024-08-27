from flask import request, jsonify
from services.assessment_processing_service import request_gpt_completion_extract_questions, parse_gpt_output_to_json
from flask import current_app
from openai import OpenAI

def inference_questions():
    try:
        ai_api_key = current_app.config['OPENAI_API_KEY']
        # Initialize the OpenAI client
        client =  OpenAI(api_key=f'sk-{ai_api_key}')
        # Get the input text from the request body
        input_data = request.get_json()

        # Validate the input
        if 'text' not in input_data:
            return jsonify({"error": "Missing 'text' field in the request body"}), 400
        
        section_text = input_data['text']

        # Call the GPT function to get questions
        gpt_output = request_gpt_completion_extract_questions(client, section_text)
        
        # Parse the GPT output into JSON
        parsed_questions = parse_gpt_output_to_json(gpt_output)

        # Return the parsed questions as JSON response
        return jsonify({"questions": parsed_questions}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
