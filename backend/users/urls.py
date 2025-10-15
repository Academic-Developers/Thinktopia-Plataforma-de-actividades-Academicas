from django.urls import path
from .views import RegistroUsuarioAPIView, LoginUsuarioAPIView, UsuarioListAPIView

urlpatterns = [
    path('registro/', RegistroUsuarioAPIView.as_view(), name='registro_usuario'),
    path('login/', LoginUsuarioAPIView.as_view(), name='login_usuario'),
    path('usuarios/', UsuarioListAPIView.as_view(), name='usuarios_list'),
]