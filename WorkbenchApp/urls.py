from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    # Ingredients
    path('ingredients/', views.ViewIngredients, name='ViewIngredients'),
    path('ingredients/delete', views.DeleteIngredients, name='DeleteIngredients'),
    # Recipes
    path('recipes/', views.ViewRecipes, name='ViewRecipes')
]