def execute_prompt( llm, question, text, maxlength = 512):
  prompt = f"""<|im_start|>system
  You are a friendly assistant. You answer questions from users.<|im_end|>
  <|im_start|>user
  Answer the following question using only the context below. Only include information specifically discussed.

  question: {question}
  context: {text} <|im_end|>
  <|im_start|>assistant
  """

  return llm(prompt,maxlength)