from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Materia
from .serializers import MateriaSerializer

class MateriaListCreateAPIView(APIView):
    """
    Vista para listar las materias de un usuario y crear materias.
    """

    def get(self, request):
        # Obtenemos el user_id desde el query params
        user_id = request.query_params.get('user_id')
        #Si no viene el user_id, devolvemos un error
        if not user_id:
            return Response({"error": "El parámetro 'user_id' es obligatorio."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            # Filtrar materias por el user_id
            materias = Materia.objects.filter(usuarios__id=user_id)
            # Serializar las materias
            serializer = MateriaSerializer(materias, many=True)
            # Agregar información adicional a la respuesta si es necesario
            return Response({"materias": serializer.data}, status=status.HTTP_200_OK)

        except ValueError:
            return Response({"error": "El ID de usuario proporcionado no es válido."}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({"error": f"Error interno del servidor: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        # La asignacion de roles viene desde el serializer
        serializer = MateriaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
        # Si los datos no son válidos, devolvemos un error 400 con los detalles
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
