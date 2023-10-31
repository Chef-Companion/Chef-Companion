from django.urls import path
from . import views
from .views import ingredientRequest

urlpatterns = [
    path('', views.base),
    path('recipes', views.recipes),
    path('ingredients/', ingredientRequest.as_view()),
    path('unique-ingredients/', views.unique_ingredients, name='unique_ingredients')
]