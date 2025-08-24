import { Component, Input } from '@angular/core';

/**
 * Componente reutilizable para títulos de páginas del docente
 * Muestra un icono junto al título de la página
 */
@Component({
  selector: 'app-page-title',
  imports: [],
  templateUrl: './page-title.component.html',
  styleUrl: './page-title.component.css'
})
export class PageTitle {
  /** Ruta del icono a mostrar */
  @Input() iconSrc: string = '';
  
  /** Texto alternativo para el icono */
  @Input() iconAlt: string = '';
  
  /** Título de la página */
  @Input() title: string = '';
}