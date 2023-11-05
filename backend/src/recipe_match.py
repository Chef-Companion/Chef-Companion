import numpy as np

def match(filters:dict):
    '''
    filter data structure:
        - ingedients: dictionary (ingredient: amount)
        - time: int range
    '''

    '''
    Algorithm:
        - determine fitness of a recipe via a score.
    Scoring: 
        userI = user's ingredients
        recipeI = recipe's ingredients
        userT = user's time
        recipeT = recipe's required time

        TODO: substitution matrix, normalize names (eg tomato vs tomatoes)


        Ingredient weight is based on its significance within the recipe, a float value 0.1 to 1.
        Ingredient urgency: a value specified by the user on how much they want to use the ingredient.
            it is by default 0.1, but can be set anywhere from 0 to 10.

        "ingredient list" is encoded as a vector of length N, where N is the number of ingredients available.
        We expect N to be in the range of 1000 to 10000, so reasonable size for a vector. 
        
        For all userI:
            (mismatches)
            if useri not in recipeI: score = - ingredient urgency / sqrt(len userI)
            if recipei not in userI: score = - ingredient weight / sqrt(len userI)
            
            (matches)
            if useri in recipeI: score = (ingredient urgency * ingredient weight) / sqrt(len userI)
    '''
