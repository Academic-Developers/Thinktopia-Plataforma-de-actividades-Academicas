import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Datos para configurar una alerta
 */
export interface AlertData {
  icon: string;
  title: string;
  message: string;
  buttonText: string;
  type: 'danger' | 'warning' | 'info' | 'success';
}

/**
 * Componente de alerta reutilizable
 * Muestra notificaciones importantes con diferentes tipos y estilos
 */
@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent {
  @Input() alertData!: AlertData;
  @Output() buttonClick = new EventEmitter<void>();

  /**
   * Emite evento cuando se hace click en el botón de la alerta
   */
  onButtonClick(): void {
    this.buttonClick.emit();
  }

  /**
   * Obtiene la clase CSS para el tipo de alerta
   */
  getAlertClass(): string {
    return `alerta-requerida alerta-${this.alertData.type}`;
  }

  /**
   * Obtiene la clase CSS para el botón según el tipo de alerta
   */
  getButtonClass(): string {
    const buttonClasses = {
      'danger': 'btn-danger',
      'warning': 'btn-warning',
      'info': 'btn-info',
      'success': 'btn-success'
    };
    return `btn ${buttonClasses[this.alertData.type]}`;
  }
}