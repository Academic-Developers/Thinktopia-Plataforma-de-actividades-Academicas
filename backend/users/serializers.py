from rest_framework import serializers
from .models import Usuario

# Serializador para vista-endpoint de Registro
class UsuarioRegistroSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8) #Acepta Password pero no lo muestra en el Request HTTP del front por seguridad.

    class Meta:
        model = Usuario
        fields = ['email', 'password', 'role']

    def create(self, validated_data):
        # Extraemos la contraseña del diccionario validado
        password = validated_data.pop('password') #Extrae la contraseña del diccionario-objeto para manejarla por separado.
        # Creamos el usuario utilizando el manager personalizado
        user = Usuario.objects.create_user(password=password, **validated_data)
        return user 