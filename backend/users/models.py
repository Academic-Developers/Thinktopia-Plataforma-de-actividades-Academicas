from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

# Custom Manager for the User Model 

class UsuarioManager(BaseUserManager):
    def create_user(self, email, password=None, role=None):
        if not email:
            raise ValueError("El usuario debe tener un correo electronico")
        email = self.normalize_email(email) # Normalize hace que el correo no importa si esta en mayus o minuscula
        user = self.model(email=email, role=role)
        user.set_password(password) #Hashes the password
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None):
        raise NotImplementedError("Este sistema no esta utilizando superusuarios.")
    
# Simplified User Model
class Usuario(AbstractBaseUser):
    ROLE_CHOICES =  [
        ('docente', 'Docente'),
        ('alumno', 'Alumno'),
    ]   
    
    email = models.EmailField(unique=True, max_length=255)
    password = models.CharField(max_length=128) #Handled by AbstractBaseUser - Manejado por AbstractBaseUser
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)

    # Required fields for AbstractBaseUser - Campos requeridos por AbstractBaseUser
    is_active = models.BooleanField(default=True)
    objects = UsuarioManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email