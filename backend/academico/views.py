from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Materia
from .serializers import MateriaSerializer
# No necesitamos importar Usuario aquí, ya que el filtro lo hace el ORM

# --- VISTA 1: COLECCIÓN (LISTAR y CREAR) ---

class MateriaListCreateAPIView(APIView):
    """
    LISTAR (GET): Materias de un usuario (Alumno o Docente), filtradas por user_id.
    CREAR (POST): Crea una nueva Materia (usada por Docentes/Admin).
    """

    def get(self, request):
        # CLAVE: FILTRO OBLIGATORIO DE SIMPLICIDAD
        user_id = request.query_params.get('user_id')

        if not user_id:
            return Response(
                {"detail": "Filtro obligatorio: Debe enviar el 'user_id' para listar materias."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Filtro simplificado: Encuentra materias donde el ID del usuario esté asignado
            materias = Materia.objects.filter(usuarios__id=user_id)
            serializer = MateriaSerializer(materias, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except ValueError:
             return Response(
                {"detail": "ID de usuario inválido."},
                status=status.HTTP_400_BAD_REQUEST
            )


    def post(self, request):
        # CREACIÓN: Permite crear la Materia (asume que quien lo usa tiene el "permiso" de Frontend)
        serializer = MateriaSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# --- VISTA 2: DETALLE (LEER, ACTUALIZAR, ELIMINAR) ---

class MateriaDetailAPIView(APIView):
    """
    GESTIÓN DETALLADA: GET (detalle), PUT (actualizar) y DELETE (eliminar) por PK de Materia.
    """
    
    def get_object(self, pk):
        # get_object_or_404 se encarga de lanzar 404 si la materia no existe
        return get_object_or_404(Materia, pk=pk)

    def get(self, request, pk):
        # LECTURA DE DETALLE
        materia = self.get_object(pk)
        serializer = MateriaSerializer(materia)
        return Response(serializer.data)

    def put(self, request, pk):
        # ACTUALIZACIÓN (Edición)
        materia = self.get_object(pk)
        # Ojo: Necesitamos manejar el ManyToMany nuevamente aquí
        usuarios_ids = request.data.pop('usuarios', None)
        
        serializer = MateriaSerializer(materia, data=request.data, partial=True) # Usamos partial=True para PUT si no queremos que falle por campos de solo lectura
        
        if serializer.is_valid():
            materia = serializer.save()
            
            # Actualizar la relación Many-to-Many si se envía el campo 'usuarios'
            if usuarios_ids is not None:
                 materia.usuarios.set(usuarios_ids) 
            
            return Response(serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        # ELIMINACIÓN
        materia = self.get_object(pk)
        materia.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)