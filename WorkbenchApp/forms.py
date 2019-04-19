from django import forms

class IngredientCreateForm(forms.Form):
    name = forms.CharField(label='Display Name', max_length=100)
    type = forms.CharField(label='Type', max_length=100)

class IngredientDeleteForm(forms.Form):
    id = forms.IntegerField(widget = forms.HiddenInput())

