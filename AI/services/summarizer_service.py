import random
import string
from txtai.pipeline import Summary

summary = Summary()

def generate_summary(text, maxlength=10):
    # Generate the summary
    summary_text = summary(text, maxlength=maxlength)
    
    # Generate 3 random lowercase letters
    random_chars = ''.join(random.choices(string.ascii_lowercase, k=3))
    
    # Append the random characters to the summary
    return summary_text + random_chars
