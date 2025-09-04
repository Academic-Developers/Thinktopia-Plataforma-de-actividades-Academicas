import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Datos de rendimiento estudiantil
 */
export interface PerformanceData {
  id: string;
  name: string;
  grade: number;
  progress: number;
  status: 'excelente' | 'bueno' | 'atencion' | 'riesgo';
}

/**
 * Componente para mostrar tarjetas de rendimiento estudiantil
 * Visualiza el progreso y calificaciones de los estudiantes
 */
@Component({
  selector: 'app-performance-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './performance-card.component.html',
  styleUrls: ['./performance-card.component.css']
})
export class PerformanceCardComponent {
  @Input() performanceData!: PerformanceData;

  /**
   * Obtiene las iniciales del nombre de un estudiante
   */
  getInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('');
  }

  /**
   * Convierte el estado en texto legible
   */
  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'excelente': 'Excelente',
      'bueno': 'Bueno',
      'atencion': 'Atención',
      'riesgo': 'Riesgo'
    };
    return statusMap[status] || status;
  }
}