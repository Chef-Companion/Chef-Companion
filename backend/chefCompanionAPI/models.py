from django.db import models

# Create your models here.

class Recipes(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255, null=False, blank=False)
    ingredients = models.CharField(max_length=1024, null=False, blank=False)
    directions = models.CharField(max_length=1024, null=False, blank=False)
    link = models.CharField(max_length=255, null=False, blank=False)
    source = models.CharField(max_length=255, null=False, blank=False)
    ner = models.CharField(max_length=1024, null=False, blank=False, db_column="NER")

    class Meta:
        db_table = "recipes"