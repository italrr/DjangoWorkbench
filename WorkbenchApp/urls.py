from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    # Ingredients
    path('ingredients/', views.ViewIngredients, name='ViewIngredients'),
    path('ingredients/delete', views.DeleteIngredients, name='DeleteIngredients'),
    path('ingredients/getAll', views.GetAllIngredients, name='GetAllIngredients'),
    # Recipes
    path('recipes/', views.ViewRecipes, name='ViewRecipes'),
    path('recipes/create', views.CreateRecipe, name='CreateRecipe'),
    path('recipes/getAll', views.GetAllRecipes, name='GetAllRecipes'),
    path('recipes/delete', views.DeleteRecipe, name='DeleteRecipe'),
    # Craft
    path('craft/', views.ViewCraft, name='ViewCraft'),
    path('craft/create', views.CreateCraft, name='CreateCraft'),
    path('craft/getAll', views.GetAllCrafts, name='GetAllCrafts'),
]