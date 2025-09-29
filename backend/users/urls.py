from django.urls import path
from .views import RegistroUsuarioAPIView, LoginUsuarioAPIView

urlpatterns = [
    path('registro/', RegistroUsuarioAPIView.as_view(), name='registro_usuario'),
    path('login/', LoginUsuarioAPIView.as_view(), name='login_usuario'),
]