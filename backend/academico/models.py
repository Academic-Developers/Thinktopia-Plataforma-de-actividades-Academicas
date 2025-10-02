from django.db import models
from users.models import Usuario


class Materia(models.Model):
    """
    Modelo que representa una Materia/Asignatura en el sistema académico.
    Establece relación Many-to-Many con Usuario (docentes y alumnos).
    """
    nombre = models.CharField(
        max_length=110, 
        help_text="Nombre de la materia (ej: Matemáticas, Historia)"
    )
    codigo = models.CharField(
        max_length=10, 
        unique=True,
        help_text="Código único de la materia (ej: MAT101, HIS201)"
    )
    descripcion = models.TextField(
        blank=True, 
        null=True,
        help_text="Descripción detallada de la materia"
    )
    
    # RELACIÓN MANY-TO-MANY CON USUARIO
    # Una materia puede tener múltiples usuarios (docentes + alumnos)
    # Un usuario puede estar en múltiples materias
    usuarios = models.ManyToManyField(
        Usuario,
        related_name='materias',
        blank=True,
        help_text="Usuarios (docentes y alumnos) asociados a esta materia"
    )
    
    # Campos de auditoría
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Materia"
        verbose_name_plural = "Materias"
        ordering = ['nombre']  # Ordenar alfabéticamente por el nombre de la materia

    def __str__(self):
        """Representación en cadena de la materia"""
        return f"{self.nombre} - {self.codigo} "


