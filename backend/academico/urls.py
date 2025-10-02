from django.urls import path
from .views import MateriaListCreateAPIView

urlpatterns = [
    path('materias/', MateriaListCreateAPIView.as_view(), name='materia-list-create'),
]