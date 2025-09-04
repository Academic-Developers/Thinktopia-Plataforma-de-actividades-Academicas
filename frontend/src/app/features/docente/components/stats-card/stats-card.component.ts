import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Componente para mostrar tarjetas de estadísticas
 * Presenta métricas importantes con iconos y valores destacados
 */
@Component({
  selector: 'app-stats-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-card.component.html',
  styleUrls: ['./stats-card.component.css']
})
export class StatsCardComponent {
  @Input() icon: string = '';
  @Input() altText: string = '';
  @Input() title: string = '';
  @Input() value: string = '';
  @Input() extra?: string;
  @Input() extraClass?: string;
}