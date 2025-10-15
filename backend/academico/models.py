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


# Material de Estudio
class MaterialEstudio(models.Model):
    """
    Modelo que representa un material de estudio asociado a una materia.
    """
    titulo = models.CharField(
        max_length=255,
        help_text="Título del material de estudio (ej: Guía de ejercicios, Presentación)."
    )
    descripcion = models.TextField(
        blank=True,
        null=True,
        help_text="Descripción opcional del material de estudio."
    )
    archivo = models.FileField(
        upload_to='materiales_estudio/',
        blank=True,
        null=True,
        help_text="Archivo adjunto del material de estudio."
    )
    materia = models.ForeignKey(
        'Materia',
        on_delete=models.CASCADE,
        related_name='materiales',
        help_text="Materia a la que pertenece este material de estudio."
    )
    autor = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        related_name='materiales_creados',
        help_text="Docente que creó este material de estudio."
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Material de Estudio"
        verbose_name_plural = "Materiales de Estudio"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.titulo} - {self.materia.nombre}"

class Actividad(models.Model):
    """
    Modelo que representa una actividad académica asociada a una materia.
    """
    titulo = models.CharField(
        max_length=255,
        help_text="Título de la actividad (ej: Trabajo práctico, Examen parcial)."
    )
    descripcion = models.TextField(
        blank=True,
        null=True,
        help_text="Descripción opcional de la actividad."
    )
    tipo = models.CharField(
        max_length=50,
        help_text="Tipo de actividad (ej: Práctico, Teórico, Evaluación)."
    )
    archivo = models.FileField(
        upload_to='actividades/',
        blank=True,
        null=True,
        help_text="Archivo adjunto relacionado con la actividad."
    )
    fecha_limite = models.DateTimeField(
        blank=True,
        null=True,
        help_text="Fecha límite para completar la actividad."
    )
    materia = models.ForeignKey(
        'Materia',
        on_delete=models.CASCADE,
        related_name='actividades',
        help_text="Materia a la que pertenece esta actividad."
    )
    docente = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        related_name='actividades_creadas',
        help_text="Docente que creó esta actividad."
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Actividad"
        verbose_name_plural = "Actividades"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.titulo} - {self.materia.nombre}"

