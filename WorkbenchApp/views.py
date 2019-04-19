from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.core import serializers
import json

from .models import Ingredient, RecipeIngredient, Recipe

from .forms import IngredientCreateForm, IngredientDeleteForm

#HOME
def index(request):
    return render(request, 'home/home.html')

# INGREDIENTS
def ViewIngredients(request):

    if request.method == 'POST':
        form = IngredientCreateForm(request.POST)
        if form.is_valid():
            ingredient = Ingredient(name=form.data['name'], type=form.data['type'].lower())
            ingredient.save()
        return HttpResponseRedirect('/workbench/ingredients?created=true')


    context = { 
        'list': Ingredient.objects.all(),
        'create_form': IngredientCreateForm(),
        'remove_form': IngredientDeleteForm()
    }

    return render(request, 'ingredients/ingredients.html', context)

def GetAllIngredients(request):
    return JsonResponse(list(Ingredient.objects.all().values()), safe=False)

def DeleteIngredients(request):
    if request.method == 'POST':
        form = IngredientDeleteForm(request.POST)
        if form.is_valid():
            Ingredient.objects.filter(id=form.data['id']).delete()
        return HttpResponseRedirect('/workbench/ingredients?removed=true')

# RECIPES
def ViewRecipes(request):
    return render(request, 'recipes/recipes.html')

def CreateRecipe(request):
    obj = json.loads(request.body.decode('utf-8'))
    recipe = obj['recipe']['formula']
    total = obj['recipe']['total']

    for i in range(len(recipe)):
        slot = recipe[i]
        recipeIng = RecipeIngredient(ingredient=slot.id, dist=slot.dist)
        recipeIng.save()



    return HttpResponse("SUCCESS!")