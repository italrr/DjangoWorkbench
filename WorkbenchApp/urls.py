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
    path('recipes/create', views.CreateRecipe, name='CreateRecipe')


]