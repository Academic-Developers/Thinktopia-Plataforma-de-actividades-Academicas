from django.urls import path
from .views import MateriaListCreateAPIView, MateriaDetailAPIView

urlpatterns = [
    # 1. Ruta de Colección (Listar y Crear)
    # GET /api/materias/?user_id=X | POST /api/materias/
    path('materias/', MateriaListCreateAPIView.as_view(), name='materia-list-create'),
    
    # 2. Ruta de Detalle (Detalle, Actualizar, Eliminar)
    # GET/PUT/DELETE /api/materias/5/
    path('materias/<int:pk>/', MateriaDetailAPIView.as_view(), name='materia-detail'),

]