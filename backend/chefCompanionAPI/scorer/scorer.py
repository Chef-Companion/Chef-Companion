import numpy as np
from .embed import Sentence_Embedder

class Scorer():

    def __init__(self, elements, element_tags=None):
        self.embedder = Sentence_Embedder()

        self.elements  = elements # n x 1 matrix where n is number of elements
        self.element_tags = element_tags # n x m matrix where m is number of tags per element

        self.element_index = self.make_index_dict(self.elements)

        self.embedded_elements = self.get_embedding(self.elements)
        if self.element_tags is not None:
            self.embedded_element_tags = np.zeros((element_tags.shape[0], element_tags.shape[1], 512))
            for i in range(len(self.element_tags)):
                self.embedded_element_tags[i] = self.get_embedding(self.element_tags[i])
        
        #print(f'elements {elements.shape}\nelement_dict: {self.element_index}')

    def make_index_dict(self, elements):
        dictionary = dict()
        for i, e in enumerate(elements):
            dictionary.update({e:i})
        return dictionary
    
    def get_index(self, element):
        return self.element_index.get(element, -1)
    
    def get_embedding(self, sentences):
        return self.embedder.embed(sentences).numpy()
    
    def build_relevenace_matrix(self, discretized=True):
        matrix = np.zeros((len(self.elements), len(self.elements)))
        for i, e in enumerate(self.elements):
            entry = self.get_element_relevance(f"{e} and")
            entry[i] = 0
            if not discretized:
                continue
            threshold = 0.2
            entry = np.where(entry < threshold, 0, 1)
            matrix[i] = entry
        print(f'matrix: {matrix}')
        return matrix
    
    def get_element_relevance(self, target_element):
        element_index = self.get_index(target_element)
        embedded_elements = self.embedded_elements
        if element_index == -1:
            embedded_target_element = self.get_embedding([target_element])[0]
        else:
            embedded_target_element = self.embedded_elements[element_index]
            #embedded_elements = np.delete(embedded_elements, element_index, axis=0)

        differences = embedded_elements - embedded_target_element
        distances = np.linalg.norm(differences, axis=-1)
        #print(f'distances: {distances}')
        normalized_distances = self.normalize(distances)
        #print(f'normalized: {normalized_distances}')
        sorted_position_n_distances = np.argsort(np.argsort(-normalized_distances))
        sorted_position_n_distances = np.where(sorted_position_n_distances == 0, 1, sorted_position_n_distances)
        #print(f'decay: {sorted_position_n_distances}')
        normalized_distances = normalized_distances * np.power(1 / sorted_position_n_distances, 0.2)
        #print(f'normalized with decay: {normalized_distances}')
        return normalized_distances

    def normalize(self, x):
        x = x - 0.33 * np.min(x) + 0.001
        x = self.hard_max(x)
        x = 1 / x
        x = (x - np.min(x)) / (np.max(x) - np.min(x))
        return x

    def hard_max(self, x, adjust=0.95):
        x = (np.exp(x) - adjust ) / (np.sum(x))
        return x
    
def test():
    np.set_printoptions(formatter={'float': lambda x: "{0:0.4f}".format(x)})
    elements = np.array(['eggs', 'egg', 'mayonnaise', 'tofu', 'butter', 'steak', 'beef', 'chicken', 'spinach', 'lettuce'])
    scorer = Scorer(elements, None)
    scorer.get_element_relevance('egg and')
    scorer.get_element_relevance('beef and')
    scorer.get_element_relevance('spinach and')
    scorer.build_relevenace_matrix()

if __name__ == "__main__":
    test()
