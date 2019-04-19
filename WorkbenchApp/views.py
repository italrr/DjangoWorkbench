from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.core import serializers
from django.forms.models import model_to_dict
from django.db import transaction

import json

from .models import Ingredient, RecipeIngredient, Recipe

from .forms import IngredientCreateForm, IngredientDeleteForm

### HOME
def index(request):
    return render(request, 'home/home.html')

### INGREDIENTS
def ViewIngredients(request):

    if request.method == 'POST':
        form = IngredientCreateForm(request.POST)
        if form.is_valid():
            ingredient = Ingredient(name=form.data['name'])
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

### RECIPES
def ViewRecipes(request):
    return render(request, 'recipes/recipes.html')


# made it atomic to compile everything into a single transaction and improve performance
@transaction.atomic
def CreateRecipe(request):
    obj = json.loads(request.body.decode('utf-8'))
    recipe = obj['recipe']['formula']
    total = obj['recipe']['total']

    recipeIns = Recipe(name=obj['name'], total=total)
    recipeIns.save()
    
    for i in range(len(recipe)):
        slot = recipe[i]
        ing = Ingredient.objects.get(id=slot['val'])
        recipeIng = RecipeIngredient(ingredient=ing, recipe=recipeIns, x=slot['dist']['x'], y=slot['dist']['y'], order=slot['order'])
        recipeIng.save()
    return HttpResponse("SUCCESS!")

def GetAllRecipes(request):
    payload = []
    recipes = Recipe.objects.all()
    for i in range(len(recipes)):
        recipeIng = RecipeIngredient.objects.filter(recipe=recipes[i])
        _recipe = model_to_dict(recipes[i])
        recipe = {
            "id": _recipe["id"],
            "name": _recipe["name"],
            "total": _recipe["total"],
            "slots": []
        }
        for j in range(len(recipeIng)):
            _recipeIng = model_to_dict(recipeIng[j])
            ing = model_to_dict(Ingredient.objects.get(id=_recipeIng['ingredient']))     
            recipe["slots"].append({
                "dist": {"x": _recipeIng["x"], "y": _recipeIng["y"]},
                "order": _recipeIng["order"],
                "name": ing["name"],
                "val": ing["id"]
            })

        recipe["slots"] = sorted(recipe["slots"], key = lambda x: x['order'])

        payload.append(recipe)

    return JsonResponse(payload, safe=False)

@transaction.atomic
def DeleteRecipe(request):
    if request.method == 'POST':
        obj = json.loads(request.body.decode('utf-8'))
        
        if not obj['id']:
            return HttpResponse("Failure")
        
        recipe = Recipe.objects.filter(id=obj['id'])

        recIngs = RecipeIngredient.objects.filter(recipe=recipe[0])
        
        recIngs.delete()
        recipe.delete()
        
        return HttpResponse("SUCCESS!")


### RECIPES


def ViewCraft(request):

    return render(request, 'craft/craft.html')