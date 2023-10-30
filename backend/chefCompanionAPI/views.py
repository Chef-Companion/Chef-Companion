from django.shortcuts import render
from rest_framework.decorators import api_view
from django.http import JsonResponse, HttpResponse
from django.db.models import Q
from chefCompanionAPI.models import Recipes
import json
from rest_framework import generics
from .models import IngredientList
from .serializers import IngredientListSerializer

# Create your views here.

@api_view(["GET"])
def base(request):
    return JsonResponse({ "working": True })

# Return recipes
@api_view(["POST"])
def recipes(request):
    body = json.loads(request.body)
    """
    Example POST:
    "Content-Type": "application/json"
    {
        ingredients: ['flour', 'soda', 'salt', 'sugar', 'egg', 'margarine', 'buttermilk'],
        ingredient_mode: 'exact', # Match each ingredient exactly, if not 'exact' will assume contains
        ingredients_mode: 'exact' # Only return recipes with the ingredients you have and no extra ingredients, if not 'exact' will assume contains
    }
    """
    # if json post does not include ingredients or ingredients is not an array
    if 'ingredients' not in body or type(body['ingredients']) != list:
        # Return status 400 "Bad Request"
        return HttpResponse("Missing ingredients array", status=400)
    ingredients = body['ingredients']
    ingredients_mode = body.get('ingredients_mode', '')
    ingredient_mode = body.get('ingredient_mode', '')
    query = Q() # new Query
    for ingredient in ingredients:
        if ingredient_mode == 'exact':
            # NER in the database looks like this: '["broccoli", "bacon", "green onions", "raisins", "mayonnaise", "vinegar", "sugar"]'
            # We can search for an exact ingredient by searching for '"ingredient"'
            query.add(Q(ner__icontains=f'\"{ingredient}\"'), Q.AND)
        else:
            # Search for containing ingredient for example a recipie with "green onions" would be returned when searching for onions
            query.add(Q(ner__icontains=ingredient), Q.AND)
    # Query the database
    objects = Recipes.objects.filter(query).all()
    if ingredients_mode == 'exact':
        # Exact length meaning the only recipes with the ingredients inputted and no extra ingredients
        objects = list(filter(lambda x: x.ingredientsLength() == len(ingredients), objects))
    # Build json response
    return JsonResponse({ "result": [object.to_dict() for object in objects] })

class ingredientRequest(generics.ListCreateAPIView):
    queryset = IngredientList.objects.all()
    serializer_class = IngredientListSerializer