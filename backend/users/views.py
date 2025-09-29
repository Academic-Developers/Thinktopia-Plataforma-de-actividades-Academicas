from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UsuarioRegistroSerializer

# Register "Controlador" para usar en el Endpoint que se declara en urls.py
class RegistroUsuarioAPIView(APIView):
    """
    Vista para registrar nuevos usuarios.
    """

    def post(self, request):
        # Creamos una instancia del serializador con los datos del cliente
        serializer = UsuarioRegistroSerializer(data=request.data)

        #Validamos los datos
        if serializer.is_valid():
            # Guardamos el usuario si los datos son válidos
            usuario = serializer.save()
            # Devolvemos una respuesta con los datos básicos del usuario
            return Response({
                "id": usuario.id,
                "email": usuario.email,
                "role": usuario.role
            }, status=status.HTTP_201_CREATED)
        
        # Si los datos no son válidos, devolvemos los errores
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


