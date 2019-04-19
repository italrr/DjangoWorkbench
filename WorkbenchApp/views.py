from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render

from .models import Ingredient

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

def DeleteIngredients(request):
    print(request)
    if request.method == 'POST':
        form = IngredientDeleteForm(request.POST)
        if form.is_valid():
            Ingredient.objects.filter(id=form.data['id']).delete()
        return HttpResponseRedirect('/workbench/ingredients?removed=true')

# RECIPES
def ViewRecipes(request):
    return render(request, 'recipes/recipes.html')