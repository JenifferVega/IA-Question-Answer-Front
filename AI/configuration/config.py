from txtai.pipeline import LLM
import psutil
import os
import torch

def log_memory_usage():
    process = psutil.Process(os.getpid())
    memory_info = process.memory_info()
    print(f"Memory usage: {memory_info.rss / 1024 ** 2} MB")

class Config:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(Config, cls).__new__(cls)
            cls._instance.llm = None

        return cls._instance

def load_configuration():
    config = Config()
    config.llm = LLM("google/flan-t5-large", torch_dtype=torch.bfloat16)
    log_memory_usage()

# Utility function to get the singleton instance
def get_config():
    return Config()

