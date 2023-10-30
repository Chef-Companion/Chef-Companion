
from rest_framework import serializers
from .models import IngredientList

class IngredientListSerializer(serializers.ModelSerializer):
    class Meta:
        model = IngredientList
        fields = '__all__'