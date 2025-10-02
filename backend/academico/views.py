from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Materia
from .serializers import MateriaSerializer
from users.models import Usuario 


# 1 - View del Alumno

class MateriaAlumnoListView(APIView):
    """
    Vista para listar las materias de un Alumno.
    Filtra por user_id y comprueba que el rol sea 'ALUMNO'.
    """

    def get(self, request):
        user_id = request.query_params.get('user_id')
        
        if not user_id:
            return Response({"error": "El parámetro 'user_id' es obligatorio."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # 1. Valida el Rol de Usuario
            usuario = Usuario.objects.get(id=user_id)
            if usuario.rol != 'ALUMNO':
                return Response({"error": "Acceso denegado. Esta vista es solo para Alumnos."}, status=status.HTTP_403_FORBIDDEN)
            
            # 2. Filtrar Materias.
            materias = Materia.objects.filter(usuarios__id=user_id)
            serializer = MateriaSerializer(materias, many=True)
            
            return Response({"materias": serializer.data}, status=status.HTTP_200_OK)

        except Usuario.DoesNotExist:
            return Response({"error": "Usuario no encontrado."}, status=status.HTTP_404_NOT_FOUND)
        
        except ValueError:
            return Response({"error": "El ID de usuario proporcionado no es válido."}, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            return Response({"error": f"Error interno del servidor: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
