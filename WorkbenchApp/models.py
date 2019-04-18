from django.db import models

class Ingredient(models.Model):
    name = models.CharField(max_length=100) # display name
    type = models.CharField(max_length=100, unique=True) # wood, iron, etc

class IngredientInventory(models.Model):
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    amount = models.IntegerField(default=0)
