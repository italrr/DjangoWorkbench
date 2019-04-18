from django.http import HttpResponse
from django.shortcuts import render

def index(request):
    return render(request, 'home/home.html')


def ingredients(request):
    return render(request, 'ingredients/ingredients.html')