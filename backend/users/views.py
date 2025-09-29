from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UsuarioRegistroSerializer
from .models import Usuario 

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


# Login

class LoginUsuarioAPIView(APIView):
    """
    Vista para autenticar usuarios.
    """

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        # Verificamos que ambos campos estén presentes en la request
        if not email or not password:
            return Response(
                {"error": "Se requiere 'email' y 'password' para iniciar sesión."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Verificamos que exista el usuario en la base de datos y este todo bien para luego responder devolviendo el id, email, role con un codigo HTTP 200 o en caso de algun problema los 400.
        try:
            # Buscamos al usuario por email
            usuario = Usuario.objects.get(email=email)

            # Verificamos la contraseña
            if usuario.check_password(password):
                return Response({
                    "id": usuario.id,
                    "email": usuario.email,
                    "role": usuario.role
                }, status=status.HTTP_200_OK)
            else:
                return Response(
                    {"error": "Credenciales inválidas. Verifique su email y contraseña."},
                    status=status.HTTP_401_UNAUTHORIZED
                )
        except Usuario.DoesNotExist:
            return Response(
                {"error": "Usuario no encontrado."},
                status=status.HTTP_404_NOT_FOUND
            )