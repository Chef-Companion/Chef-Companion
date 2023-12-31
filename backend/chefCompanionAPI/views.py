from django.shortcuts import render
from rest_framework.decorators import api_view
from django.http import JsonResponse, HttpResponse
from django.db.models import Q
from chefCompanionAPI.models import Recipes
import json
from rest_framework import generics
from .models import IngredientList
from .serializers import IngredientListSerializer
from .utils import get_unique_ingredients
from .scorer.recipe_match import RecipeMatch

# Create your views here.

recipes = Recipes.objects.all()
recipes = [object.to_dict() for object in recipes]
matcher = RecipeMatch(recipes)

@api_view(["GET"])
def base(request):
    return JsonResponse({ "working": True })

# Gets all the unique ingredients in the "NER" column
@api_view(["GET"])
def unique_ingredients(request):
    unique_ingredients = get_unique_ingredients()
    return JsonResponse({'unique_ingredients': unique_ingredients})

@api_view(["POST"])
def recipes_ranked(request):
    print(f'RECEIVED API REQUEST')
    print(f'recipes: {recipes}')

    body = json.loads(request.body)
    selected_ingredients = body['selected_ingredients']
    forbidden_ingredients = body['forbidden_ingredients']
    enable_substitutions = body['enable_substitutions']

    data, order = matcher.match(selected_ingredients, forbidden_ingredients, enable_substitutions)
    return JsonResponse({'result': data})

# Return recipes
@api_view(["POST", "GET"])
def recipes(request):
    if request.method == "GET":
        # Get all recipes
        objects = Recipes.objects.all()
        return JsonResponse({ "result": [object.to_dict() for object in objects] })
    if request.method == "POST":
        # Query for recipes
        body = json.loads(request.body)
        """
        Example POST:
        "Content-Type": "application/json"
        {
            ingredients: ['flour', 'soda', 'salt', 'sugar', 'egg', 'margarine', 'buttermilk'],
            restrictions: ['macaroni', 'garlic powder', 'tomato juice'],
            ingredient_mode: 'exact', # Match each ingredient exactly, if not 'exact' will assume contains
            ingredients_mode: 'exact' # Only return recipes with the ingredients you have and no extra ingredients, if not 'exact' will assume contains
        }
        """
        # if json post does not include ingredients or ingredients is not an array
        if 'ingredients' not in body or type(body['ingredients']) != list:
            # Return status 400 "Bad Request"
            return HttpResponse("Missing ingredients array", status=400)
        ingredients = body['ingredients']
        restrictions = body['restrictions']
        ingredients_mode = body.get('ingredients_mode', '')
        ingredient_mode = body.get('ingredient_mode', '')
        query = Q() # new Query for requested ingredients
        for ingredient in ingredients:
            if ingredient_mode == 'exact':
                # NER in the database looks like this: '["broccoli", "bacon", "green onions", "raisins", "mayonnaise", "vinegar", "sugar"]'
                # We can search for an exact ingredient by searching for '"ingredient"'
                query.add(Q(ner__icontains=f'\"{ingredient}\"'), Q.AND)
            else:
                # Search for containing ingredient for example a recipie with "green onions" would be returned when searching for onions
                query.add(Q(ner__icontains=ingredient), Q.AND)
        rquery = Q() # new Query for restrictions
        for ingredient in restrictions:
            rquery.add(Q(ner__icontains=f'\"{ingredient}\"'), Q.OR)
        # Query the database
        objects = Recipes.objects.filter(query & ~rquery).all()
        if ingredients_mode == 'exact':
            # Exact length meaning the only recipes with the ingredients inputted and no extra ingredients
            objects = list(filter(lambda x: x.ingredientsLength() == len(ingredients), objects))
        # Build json response
        return JsonResponse({ "result": [object.to_dict() for object in objects] })

class ingredientRequest(generics.ListCreateAPIView):
    queryset = IngredientList.objects.all()
    serializer_class = IngredientListSerializer
