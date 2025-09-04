import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about',
  imports: [RouterModule],
  templateUrl: './about.html',
  styleUrl: './about.css'
})
export class About {

  valores = [
    {
      icon:"https://placehold.co/50x50/1A1A1A/FFFFFF?text=I",
      titulo: "Creatividad - Innovación",
      descripcion: "Apostamos por soluciones nuevas y creativas para transformar la educación."
    },
    {
     icon:"https://placehold.co/50x50/36B37E/FFFFFF?text=R",
      titulo: "Inclusión y Respeto",
      descripcion: "Pensamos en todos los estudiantes, sin distinción, fomentando el respeto mutuo."
    },
    {
      icon:"https://placehold.co/50x50/F5A623/FFFFFF?text=A",
      titulo: "Aprendizaje Continuo",
      descripcion: "Estamos en constante actualización y mejora continua."
    }, 
    {
      icon:"https://placehold.co/50x50/0052CC/FFFFFF?text=C",
      titulo: "Trabajo Colaborativo",
      descripcion: "Creemos en el poder de los equipos diversos y la colaboración."
    }
  ]

  equipo_principal = [
    {
      nombre: "Martin Lopez",
      img:"icons/miembro2.svg",
      cargo: "Coordinador de Tecnología",
      descripcion: "Impulsa soluciones educativas innovadoras y escalables, alineadas con los desafíos actuales del aprendizaje digital."
    },
    {
      nombre: "Valentina Suárez",
      img:"icons/miembro1.svg",
      cargo: "Directora General",
      descripcion:"Impulsa la visión educativa y tecnológica de Thinktopia con liderazgo y pasión."
    },
    {
      nombre: "Tomás Rivera",
      img:"icons/miembro2.svg",
      cargo: "Soporte y Formación",
      descripcion:"Acompaña a docentes e instituciones en el uso eficaz de la plataforma."
    }, 
    {
      nombre: "Lucia Herrera",
      img:"icons/miembro1.svg",
      cargo: "Facilitadora Pedagógica",
      descripcion: "Integra enfoques didácticos modernos para fomentar un aprendizaje significativo y motivador."
    }
  ]

  equipo_desarrollo = [
    {
      nombre: "Cáceres Giménez Cesia Fiorella",
      img:"img/profile_cesia.png",
      rol: "Desarrolladora y Diseñadora",
      descripcion: "Me desempeño como desarrolladora y diseñadora en este proyecto. Participo en la construcción de la plataforma desde el diseño de interfaces hasta la implementación de funcionalidades.", 
      link_portfolio:"portfolios/portfolio_cesia/portfolio_cesia.html",
      tipo: "local"
    }, 
    {
      nombre: "Toro Goitea Francisco Nicolás",
      img:"img/img-fran.jpeg",
      rol: "Desarrollador Full Stack",
      descripcion: "En este proyecto participo desde las etapas de modelado, diseño hasta la implementación de las funcionalidades del sistema.",
      link_portfolio:"https://portafolio-francisco-toro.vercel.app/",
      tipo:"externo"
    }, 
    {
      nombre: "Cabrera Milagros Magaly",
      img:"img/perfil_magui.webp",
      rol: "Desarrolladora - Scrum Master",
      descripcion: "Me desempeño como desarrolladora, Scrum Master y colaboradora en el área de diseño. Aporto desde la estructura técnica hasta los detalles visuales e implementación.", 
      link_portfolio:"https://cabreramilagros-miportfolio.netlify.app/",
      tipo:"externo"
    }
  ]
}
