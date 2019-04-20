from django.db import models

class Ingredient(models.Model):
    name = models.CharField(max_length=100)

class Recipe(models.Model):
    name = models.CharField(max_length=100)
    total = models.IntegerField(default=0)

class RecipeIngredient(models.Model):
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    x = models.IntegerField(default=0)
    y = models.IntegerField(default=0)
    order = models.IntegerField(default=0)

class Inventory(models.Model):
    recipe = models.OneToOneField(Recipe, on_delete=models.CASCADE, unique=True)
    name = models.CharField(max_length=100)
    amount = models.IntegerField(default=0)    