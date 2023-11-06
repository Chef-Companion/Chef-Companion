import numpy as np

class RecipeMatch():
    def __init__(self, recipes, ingredients=None, substitutions=None):
        # recipes: [{'recipe name': str, 'ingredients': list}]
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

        print(f'finished creating RecipeMatch\nrecipes: {self.recipes}\n\ningredients: {self.ingredients}\n\nrecipe_matrix: \n{self.recipe_matrix}\n\nsubstitutions: {self.substitution_matrix}')


    def get_all_ingredients(self):
        ingredients = {}
        counter = 0
        for recipe in self.recipes:
            for ingredient in recipe['ingredients']:
                if ingredient in ingredients:
                    continue
                ingredients.update({ingredient:{'id':counter}})
                counter += 1
        return ingredients

    def compute_recipe_ingredient_matrix(self):
        matrix = np.zeros((len(self.recipes), len(self.ingredients)))
        for recipe_index, recipe in enumerate(self.recipes):
            weight = 1
            for ingredient in recipe['ingredients']:
                matrix[recipe_index][self.ingredient_ID(ingredient)] = weight
                weight *= 0.95
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
    

    def compute_selected_ingredients_vector(self, selected_ingredients):
        matrix = np.zeros((len(self.ingredients),))
        for ingredient in selected_ingredients:
            matrix[self.ingredient_ID(ingredient)] = 1
        return matrix


    def match(self, selected_ingredients, filters:dict=None):
        '''
        TODO:
        - normalize names (eg tomato vs tomatoes)
        - Ingredient urgency: a value specified by the user on how much they want to use the ingredient.
            it is by default 0.1, but can be set anywhere from 0 to 10.
        '''
        

        ''' SETUP SELECTION SPECIFIC MATRICES '''
        # create an ingredient vector where 1 = ingredient is selected, else 0
        selected_ingredients_matrix = self.compute_selected_ingredients_vector(selected_ingredients)
        print(f"selected_ingredients_matrix: {selected_ingredients_matrix}")

        # compute substitution matrix for selected ingredients
        substitution_matrix = np.zeros((len(self.ingredients),))
        for ingredient in selected_ingredients:
            substitution_matrix = np.maximum(substitution_matrix, self.substitution_matrix[self.ingredient_ID(ingredient)])
        print(f"substitution_matrix: {substitution_matrix}")


        ''' NEEDED INGREDIENTS BUT NOT SELECTED '''
        # create an ingredient vector where 1 = needed ingredient is not selected, else 0
        needed_ingredient_not_present = self.boolean_recipe_matrix - selected_ingredients_matrix

        # consider substitution options, and multiply needed_ingredient_not_present matrix by their respective ingredient importance weights
        needed_ingredient_not_present = (needed_ingredient_not_present - substitution_matrix) * self.recipe_matrix
        needed_ingredient_not_present[needed_ingredient_not_present < 0] = 0 # because we do not care about the case where selected ingedient is not needed
        print(f"needed_ingredient_not_present: {needed_ingredient_not_present}")


        ''' NOT NEEDED INGREDIENTS BUT SELECTED '''
        # create an ingredient vector where 1 = not needed ingredient is selected, else 0
        not_needed_ingredient_present = -self.boolean_recipe_matrix + selected_ingredients_matrix
        not_needed_ingredient_present[not_needed_ingredient_present < 0] = 0 # because we do not care about the case where needed ingredient is not selected
        print(f"not_needed_ingredient_present: {not_needed_ingredient_present}")


        ''' UNSELECTED PERCENTAGE '''
        # percentage of ingredients from recipe that are not selected
        unselected_percentage = np.sum(needed_ingredient_not_present, axis=1) / np.sum(self.recipe_matrix, axis=1)
        print(f"not_needed_ingredient_present: {not_needed_ingredient_present}")

        penalty = (0.1 + unselected_percentage) * (np.sum(needed_ingredient_not_present, axis=1) * 100 + np.sum(not_needed_ingredient_present, axis=1)) # the higher the penalty, the worst the recipe is
        ordering = np.argsort(penalty)
        
        # create dictionary that matches recipe to penalty number
        penalty_data = {}
        all_recipes = [recipe["name"] for recipe in self.recipes]
        for i, recipe in enumerate(all_recipes):
            penalty_data.update({recipe:penalty[i]})
        
        return penalty_data, ordering
    
def make_recipe(name, ingredients):
    return {'name':name, 'ingredients':ingredients}
    
def test():
    recipes = []
    recipes.append(make_recipe("Sunny Side Up Delight", ["eggs", "salt", "pepper", "butter"]))
    recipes.append(make_recipe("Banana Berry Smoothie", ["banana", "mixed berries", "yogurt", "honey", "ice"]))
    recipes.append(make_recipe("Classic Caesar Salad", ["romaine lettuce", "parmesan cheese", "croutons", "Caesar dressing", "chicken breast"]))
    recipes.append(make_recipe("Hearty Beef Stew", ["beef chunks", "carrots", "potatoes", "onion", "beef broth", "tomato paste"]))
    recipes.append(make_recipe("Avocado Toast", ["bread", "avocado", "lemon juice", "salt", "pepper", "cherry tomatoes"]))
    recipes.append(make_recipe("Chocolate Chip Cookies", ["flour", "baking soda", "salt", "butter", "sugar", "eggs", "vanilla extract", "chocolate chips"]))
    recipes.append(make_recipe("Mushroom Risotto", ["arborio rice", "mushrooms", "chicken stock", "onion", "garlic", "parmesan cheese", "white wine"]))
    recipes.append(make_recipe("Spaghetti Aglio e Olio", ["spaghetti", "olive oil", "garlic", "red pepper flakes", "parsley"]))
    recipes.append(make_recipe("Tomato Basil Soup", ["tomatoes", "chicken stock", "basil", "onion", "carrot", "celery", "cream"]))
    recipes.append(make_recipe("Lemon Garlic Tilapia", ["tilapia fillets", "lemon juice", "garlic", "butter", "parsley"]))

    selected_ingredients = ['eggs', 'flour', 'bread', 'salt', 'pepper', 'butter', "spaghetti", "olive oil", "garlic", "red pepper flakes"]
    matcher = RecipeMatch(recipes)
    penalty_data, ordering = matcher.match(selected_ingredients)

    all_recipes = [recipe["name"] for recipe in recipes]
    ordered_recipes = np.take(all_recipes, ordering)
    print(f"ordered recipes: {ordered_recipes}")
    print(f"penalty data: {penalty_data}")

    good_matches = [recipe_name for recipe_name, penalty in penalty_data.items() if penalty < 100]
    print(f'good matches: {good_matches}')
    
if __name__ == "__main__":
    test()
