from django.urls import path
from .views import MateriaAlumnoListView

urlpatterns = [
      path('materias/alumno/', MateriaAlumnoListView.as_view(), name='materia-alumno-list'),
]