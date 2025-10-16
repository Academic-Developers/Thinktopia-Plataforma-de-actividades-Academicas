import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { title } from 'process';

@Component({
  selector: 'app-home',
  imports: [RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  
  features = [
    {
      titulo:"Gestión Sencilla",
      icon: "https://placehold.co/50x50/0052CC/FFFFFF?text=G",
      descripcion:"Organiza tareas, clases y asistencias en un solo lugar. Ahorra tiempo y enfócate en lo que más importa: enseñar."
  }, 
  {
    titulo:"Aprendizaje Gamificado",
    icon: "https://placehold.co/50x50/36B37E/FFFFFF?text=A",
    descripcion:"Motiva a tus alumnos con puntos, logros y rankings. Convierte el aprendizaje en una aventura emocionante."
  },
  {
    titulo:"Progreso Visual",
    icon: "https://placehold.co/50x50/F5A623/FFFFFF?text=P",
    descripcion:"Monitorea el avance académico con mapas visuales y reportes claros. Identifica fortalezas y áreas de mejora al instante."
  }];

  testimonials = [
    {
      perfil: 'Para Docente',
      img:"https://placehold.co/50x50/0052CC/FFFFFF?text=P" ,
      texto:
        'Con Thinktopia, simplifico la calificación, el seguimiento de asistencias y la comunicación con mis alumnos. La gamificación ha aumentado la participación en clase de forma increíble. ¡Es mi asistente digital perfecto!',
      nombre: 'Prof. Ana Torres',
      cargo: 'Maestra de Ciencias',
    },
    {
      perfil: 'Para Estudiante',
      img:"https://placehold.co/50x50/36B37E/FFFFFF?text=E",
      texto:
        '¡Me encanta ganar puntos y medallas por hacer mis tareas! Puedo ver mis logros, mi progreso en un mapa y competir sanamente con mis compañeros en el ranking. Estudiar ahora es mucho más divertido.',
      nombre: 'Elena Gómez',
      cargo: 'Estudiante de 3er Año',
    },
  ];
}