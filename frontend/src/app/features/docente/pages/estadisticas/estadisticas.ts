import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsCardComponent } from '../../components/stats-card/stats-card.component';
import { PerformanceCardComponent, PerformanceData } from '../../components/performance-card/performance-card.component';
import { AlertComponent, AlertData } from '../../components/alert/alert.component';
import { FiltersComponent, FilterConfig, FilterEvent } from '../../components/filters/filters.component';
import { PageTitle } from '../../components/page-title/page-title.component';

/**
 * Componente para visualización de estadísticas académicas
 * Muestra métricas de rendimiento estudiantil y alertas importantes
 */
@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [CommonModule, StatsCardComponent, PerformanceCardComponent, AlertComponent, FiltersComponent, PageTitle],
  templateUrl: './estadisticas.html',
  styleUrls: ['./estadisticas.css']
})
export class Estadisticas {
  /** Configuración de filtros disponibles */
  filterConfigs: FilterConfig[] = [
    {
      id: 'curso',
      type: 'dropdown',
      label: 'Curso',
      placeholder: 'Matematicas Avanzadas',
      width: 'flex-1',
      options: [
        { label: 'Matematicas Avanzadas', value: 'matematicas' },
        { label: 'Programación II', value: 'programacion' },
        { label: 'Base de Datos II', value: 'basedatos' }
      ]
    },
    {
      id: 'semestre',
      type: 'dropdown',
      label: 'Semestre',
      placeholder: 'Semestre 2024-1',
      width: 'flex-1',
      options: [
        { label: 'Semestre 2024-1', value: '2024-1' },
        { label: 'Semestre 2023-2', value: '2023-2' },
        { label: 'Semestre 2023-1', value: '2023-1' }
      ]
    }
  ];

  /** Datos de alerta para mostrar notificaciones importantes */
  alertData: AlertData = {
    icon: '/icons/exclamation-triangle-fill.svg',
    title: 'Atención Requerida',
    message: '2 estudiantes necesitan apoyo académico adicional',
    buttonText: 'Ver Detalles',
    type: 'danger'
  };

  /** Datos de rendimiento estudiantil para visualización */
  performanceData: PerformanceData[] = [
    {
      id: '1',
      name: 'Ana López',
      grade: 9.2,
      progress: 92,
      status: 'excelente'
    },
    {
      id: '2',
      name: 'María Torres',
      grade: 8.7,
      progress: 87,
      status: 'bueno'
    },
    {
      id: '3',
      name: 'Laura García',
      grade: 6.1,
      progress: 61,
      status: 'atencion'
    },
    {
      id: '4',
      name: 'Lucas Rivas',
      grade: 8.9,
      progress: 89,
      status: 'excelente'
    },
    {
      id: '5',
      name: 'Diego Peña',
      grade: 5.8,
      progress: 58,
      status: 'riesgo'
    },
    {
      id: '6',
      name: 'Sofia Chen',
      grade: 9.5,
      progress: 95,
      status: 'excelente'
    }
  ];

  /**
   * Maneja cambios en los filtros de estadísticas
   */
  onFilterChange(event: FilterEvent): void {
    // Manejar los cambios de filtros
  }

  /**
   * Maneja clicks en botones de filtros
   */
  onFilterButtonClick(event: FilterEvent): void {
    // Manejar clics de botones en filtros
  }

  /**
   * Maneja el click en el botón de alerta
   * TODO: Implementar navegación a detalles de estudiantes
   */
  onAlertButtonClick(): void {
    // Navegar a la página de detalles o mostrar más información
  }

  /**
   * Obtiene una alerta de tipo advertencia
   */
  getWarningAlert(): AlertData {
    return {
      icon: '/icons/exclamation-triangle-fill.svg',
      title: 'Advertencia',
      message: 'Hay tareas pendientes de revisión',
      buttonText: 'Revisar',
      type: 'warning'
    };
  }

  /**
   * Obtiene una alerta de tipo éxito
   */
  getSuccessAlert(): AlertData {
    return {
      icon: '/icons/check_cicle_icon.svg',
      title: 'Éxito',
      message: 'Todas las calificaciones han sido actualizadas',
      buttonText: 'Continuar',
      type: 'success'
    };
  }

  /**
   * Obtiene una alerta de tipo información
   */
  getInfoAlert(): AlertData {
    return {
      icon: '/icons/file-text-fill.svg',
      title: 'Información',
      message: 'Nueva actualización del sistema disponible',
      buttonText: 'Ver Más',
      type: 'info'
    };
  }
}
