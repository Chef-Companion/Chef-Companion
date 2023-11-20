import tensorflow_hub as hub

class Sentence_Embedder():

    def __init__(self):

        self.module_url = "https://tfhub.dev/google/universal-sentence-encoder/4"
        self.model = hub.load(self.module_url)
        print(f"module {self.module_url} loaded")

    def embed(self, input):
        return self.model(input)
