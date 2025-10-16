from django.urls import path
from .views import MateriaListCreateAPIView, MateriaDetailAPIView, MaterialEstudioDetailAPIView, MaterialEstudioListCreateAPIView
from .views import ActividadListCreateAPIView, ActividadDetailAPIView

urlpatterns = [
    # Endpoints para materias
    # 1. Ruta de Colección (Listar y Crear)
    # GET /api/materias/?user_id=X | POST /api/materias/
    path('materias/', MateriaListCreateAPIView.as_view(), name='materia-list-create'),
    
    # 2. Ruta de Detalle (Detalle, Actualizar, Eliminar)
    # GET/PUT/DELETE /api/materias/5/
    path('materias/<int:pk>/', MateriaDetailAPIView.as_view(), name='materia-detail'),

    # Endpoints para material de estudio
    path('materialestudio/', MaterialEstudioListCreateAPIView.as_view(), name='materiales_list_create'),
    path('materialestudio/<int:pk>/', MaterialEstudioDetailAPIView.as_view(), name='materiales_detail'),

    # Endpoints para actividades
    path('actividades/', ActividadListCreateAPIView.as_view(), name='actividad-list-create'),
    path('actividades/<int:pk>/', ActividadDetailAPIView.as_view(), name='actividad-detail'),
]