from django.shortcuts import render
from rest_framework.decorators import api_view
from django.http import JsonResponse

# Create your views here.

@api_view(["GET"])
def base(request):
    return JsonResponse({"working": True })