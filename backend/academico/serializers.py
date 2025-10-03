from rest_framework import serializers
from .models import Materia

class MateriaSerializer(serializers.ModelSerializer):
    """Serializer para el modelo Materia, el cual define como se veran los datos al enviarlos y como validarlos cuando los reciben.
    """
    usuarios = serializers.ListField(
        child=serializers.IntegerField(), # IDs de usuarios en formato entero
        write_only=True, # Solo para escritura (no se muestra en las respuestas)
        required=False, # Permite crear una materia sin asignar usuarios al inicio
    )

    class Meta:
        model = Materia
        fields = ['id', 'nombre', 'codigo', 'descripcion','created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def create(self, validated_data):
        """Crea una nueva instancia de Materia con los datos validados.
        """
     
       # Saca los IDs antes de crear la Materia
        usuarios_ids = validated_data.pop('usuarios', []) 
        
        # Crea la Materia (sin los usuarios todavía)
        materia = Materia.objects.create(**validated_data) 
        
        # Asigna los usuarios una vez que la Materia tiene un ID
        if usuarios_ids:
            materia.usuarios.set(usuarios_ids) 
            
        return materia
    

    