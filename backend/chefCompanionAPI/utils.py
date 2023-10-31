from .models import Recipes
import ast

def get_unique_ingredients():
    # Query the database to get all NER values
    ner_values = Recipes.objects.values_list('ner', flat=True)

    # Combine all NER values into a single list
    all_ner = []
    for ner_value in ner_values:
        all_ner.extend(ast.literal_eval(ner_value))

    # Use a set to get unique ingredients
    unique_ingredients = set(all_ner)

    return list(unique_ingredients)
