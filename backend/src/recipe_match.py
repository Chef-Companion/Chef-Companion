import numpy as np

class RecipeMatch():
    def __init__(self, recipes, ingredients=None, substitutions=None):
        # recipes: {recipe name: {'id': int, 'ingredients': list}}
        # ingredients: {ingredient name: {'id': int}}
        # substitutions: {ingredient name: {substitution ingredient name: relevance score}}

        # id must be unique and continuous, starting from 0
        # ingredient names within recipes must match to an ingredient within ingredients, pass none as ingredients to auto-generate
        self.recipes = recipes
        self.ingredients = ingredients

        if ingredients is None:
            self.ingredients = self.get_all_ingredients()

        self.recipe_matrix = self.compute_recipe_ingredient_matrix()
        self.boolean_recipe_matrix = self.recipe_matrix.copy()
        self.boolean_recipe_matrix[self.boolean_recipe_matrix > 0] = 1

        self.substitution_matrix = self.compute_substitution_matrix(substitutions)


    def get_all_ingredients(self):
        ingredients = {}
        counter = 0
        for recipe in self.recipes:
            for ingredient in recipe['ingredients']:
                if ingredient in ingredients:
                    continue
                ingredients.update({ingredient:{'id':counter}})
        return ingredients

    def compute_recipe_ingredient_matrix(self):
        matrix = np.zeros((len(self.recipes), len(self.ingredients)))
        for recipe in self.recipes:
            weight = 1
            for ingredient in recipe['ingredients']:
                matrix[recipe['id']][self.ingredient_ID(ingredient)] = weight
                weight *= 0.9
        return matrix
    
    def compute_substitution_matrix(self, substitutions):
        matrix = np.zeros((len(self.ingredients), len(self.ingredients)))
        if substitutions is None:
            return matrix
        
        for ingredient, ingredient_substitutions in substitutions.items():
            for substitution, score in ingredient_substitutions.items():
                matrix[self.ingredient_ID(ingredient)][self.ingredient_ID(substitution)] = score
        return matrix
    
    def ingredient_ID(self, ingredient):
        return self.ingredients[ingredient]['id']
    

    def compute_selected_ingredients_matrix(self, selected_ingredients):
        matrix = np.zeros((len(self.ingredients),))
        for ingredient in selected_ingredients:
            matrix[self.ingredient_ID(ingredient)] = 1
        return matrix


    def match(self, selected_ingredients, filters:dict):
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
        
        # create an ingredient vector where 1 = ingredient is selected, else 0
        selected_ingredients_matrix = self.compute_recipe_ingredient_matrix(selected_ingredients)
        substitution_matrix = np.zeros((len(self.ingredients),))
        for ingredient in selected_ingredients:
            substitution_matrix = np.maximum(substitution_matrix, self.substitution_matrix[self.ingredient_ID(ingredient)])

        # create an ingredient vector where 1 = needed ingredient is not selected, else 0
        needed_ingredient_not_present = self.boolean_recipe_matrix - selected_ingredients_matrix
        # multiply above matrix by their respective ingredient importance weights
        needed_ingredient_not_present = (needed_ingredient_not_present - substitution_matrix) * self.recipe_matrix
        needed_ingredient_not_present[needed_ingredient_not_present < 0] = 0 # because we do not care about the case where selected ingedient is not needed

        # create an ingredient vector where 1 = not needed ingredient is selected, else 0
        not_needed_ingredient_present = -self.boolean_recipe_matrix + selected_ingredients_matrix
        not_needed_ingredient_present[not_needed_ingredient_present < 0] = 0 # because we do not care about the case where needed ingredient is not selected

        penalty = np.sum(needed_ingredient_not_present, axis=1) * 10 + np.sum(not_needed_ingredient_present, axis=1) # the higher the penalty, the worst the recipe is

        order = np.argsort(penalty)
        return order
