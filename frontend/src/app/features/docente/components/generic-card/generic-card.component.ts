import { Component, Input } from '@angular/core';

/**
 * Componente genérico de tarjeta reutilizable
 * Proporciona una estructura básica para mostrar contenido en formato de tarjeta
 */
@Component({
  selector: 'app-generic-card',
  standalone: true,
  imports: [],
  templateUrl: './generic-card.component.html',
  styleUrls: ['./generic-card.component.css']
})
export class GenericCardComponent {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() cardClass: string = '';
}
