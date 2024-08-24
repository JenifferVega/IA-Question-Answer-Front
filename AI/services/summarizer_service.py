from txtai.pipeline import Summary

summary = Summary()

def generate_summary(text, maxlength=10):
    return summary(text, maxlength=maxlength)
