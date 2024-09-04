class GPT4LLM:
    def __init__(self, client):
        self.client = client
        
    def __call__(self, prompt):
        response = self.client.chat.completions.create(
            model="gpt-4o-mini",  # Specify the GPT-4 model
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=2048,  # Adjust as necessary
            temperature=0.7    # Adjust the creativity/randomness level
        )
        response_dict = response.to_dict()  # Convert the custom response object to a dictionary

        # Access the response content
        return response_dict['choices'][0]['message']['content'].strip()
        

# Function to fetch context based on a question using txtai embeddings
def context(question, embeddings):
    search_results = embeddings.search(question)
    context = "\n".join(x["text"] for x in search_results)
    return context

# Function to create a prompt and call the GPT-4 LLM
def run_prompt_gpt4(llm, question, text):
    prompt = f"""Answer the following question using only the context below. Only include information specifically discussed.
    
    question: {question}
    context: {text} 
    """
    return llm(prompt)

# Function to perform retrieval-augmented generation (RAG)
def rag(llm, question):
    text_context = context(question)  # Get the context from the embedding search
    return run_prompt_gpt4(llm, question, text_context)