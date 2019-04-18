from django.db import models

class Ingredient(models.Model):
    # type will serve as the type as well as the name of the ingredient 
    type = models.CharField(max_length=200, unique=True) # wood, iron, etc

class IngredientInventory(models.Model):
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    amount = models.IntegerField(default=0)
