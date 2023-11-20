from django.db import models
import ast


# Create your models here.
class IngredientList(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, null=False, blank=False,default="insert name")
    experationDate = models.CharField(max_length=255, null=False, blank=False,default="insert date")
    amount = models.CharField(max_length=255, null=False, blank=False,default="insert amount")
    
class Recipes(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255, null=False, blank=False)
    ingredients = models.CharField(max_length=1024, null=False, blank=False)
    directions = models.CharField(max_length=1024, null=False, blank=False)
    link = models.CharField(max_length=255, null=False, blank=False)
    source = models.CharField(max_length=255, null=False, blank=False)
    ner = models.CharField(max_length=1024, null=False, blank=False, db_column="NER") # Simplified list of ingredients

    # Convert Django Recipies object to python dictionary
    def to_dict(self):
        data = {
            "id": int(self.id),
            "title": self.title,
            "ingredients": ast.literal_eval(self.ingredients), # To python list
            "directions": ast.literal_eval(self.directions),  # To python list
            "link": self.link,
            "source": self.source,
            "NER": ast.literal_eval(self.ner)  # To python list,
        }
        return(data)
    
    # Get length of ingredients
    def ingredientsLength(self):
        return len(ast.literal_eval(self.ner))

    class Meta:
        db_table = "recipes"
        