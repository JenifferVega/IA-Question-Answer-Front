from txtai.pipeline import Textractor, Similarity, Labels
import re
import json

def clean_text(text):
    # Step 1: Normalize newlines and spaces
    text = re.sub(r'\n+', '\n', text)  # Replace multiple newlines with a single newline
    text = re.sub(r' +', ' ', text)  # Replace multiple spaces with a single space
    
    # Step 2: Remove special formatting and table structures
    text = re.sub(r'\|---\|', '', text)
    text = re.sub(r'\|', '', text)
    
    # Step 3: Strip headers and repetitive phrases
    text = re.sub(r'(Template \d+:|Checklist \d+:)', r'\n=== \1 ===\n', text)  # Add markers for segmentation
    
    return text

def extract_sections(assessment_path):
    textractor = Textractor()
    return textractor(assessment_path)

def segment_text(cleaned_text, tokenizer):
    return tokenizer.tokenize(cleaned_text)

def cluster_segments(segments, labels, tags):
    first_cluster = []
    second_cluster = []
    
    for i, text in enumerate(segments):
        label_index = labels(text, tags)[0][0]
        label = tags[label_index]
        if label == 1:
            first_cluster.append(text)
        else:
            second_cluster.append(text)
    
    return first_cluster, second_cluster

def check_similarity(similarity, text, cluster_info):
    return similarity(text, cluster_info)

def extract_questions(similarity, text, cluster):
    return [(score, cluster[x]) for x, score in similarity(text, cluster) if score > 0.5]

def request_gpt_completion_extract_questions(client, section_text):
    # Making a request to the GPT API for question extraction
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text", 
                        "text": "Extract the specific questions from this section that can be solved using AI in a RAG pipeline in JSON format like [{'text_reference': 'sentence in section', 'question': 'reformulated question'}]. Skip personal questions or those that don't require topic investigation. Focus on questions that involve research, performance, or legislative requirements."
                    },
                    {
                        "type": "text",
                        "text": section_text,
                    },
                ],
            }
        ],
        max_tokens=2048,
    )
    return response.choices[0].message.content

def parse_gpt_output_to_json(gpt_output):
    # Clean and extract JSON-like output from GPT
    cleaned_output = gpt_output.strip()
    start_idx = cleaned_output.find('```json')
    end_idx = cleaned_output.rfind('```')

    if start_idx == -1 or end_idx == -1 or start_idx >= end_idx:
        print("No valid JSON markers found in the text.")
        return None

    json_string = cleaned_output[start_idx + len('```json'):end_idx].strip()

    # Extract JSON structure
    match = re.search(r'\[\s*{.*?}\s*\]', json_string, re.DOTALL)
    if match:
        json_str = match.group(0)
        try:
            product_info = json.loads(json_str)
            return product_info
        except json.JSONDecodeError as e:
            print(f"Failed to decode JSON: {e}")
            return None
    else:
        print("No valid JSON found in the text.")
        return None
