import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericTableComponent, TableColumn, TableRow, TableAction } from '../../components/generic-table/generic-table.component';
import { PageTitle } from '../../components/page-title/page-title.component';
import { FiltersComponent, FilterConfig, FilterEvent } from '../../components/filters/filters.component';

/**
 * Componente para gestión de entregas estudiantiles
 * Permite visualizar, filtrar y calificar entregas de los estudiantes
 */
@Component({
  selector: 'app-entregas',
  standalone: true,
  imports: [CommonModule, GenericTableComponent, PageTitle, FiltersComponent],
  templateUrl: './entregas.html',
  styleUrls: ['./entregas.css']
})
export class Entregas {
  /** Configuración de filtros disponibles */
  filterConfigs: FilterConfig[] = [
    {
      id: 'curso',
      type: 'dropdown',
      label: 'Curso',
      placeholder: 'Seleccionar curso',
      width: 'flex-1',
      options: [
        { label: '1º Año', value: '1-ano' },
        { label: '2º Año', value: '2-ano' },
        { label: '3º Año', value: '3-ano' }
      ]
    },
    {
      id: 'fecha',
      type: 'dropdown',
      label: 'Fecha',
      placeholder: 'Seleccionar fecha',
      width: 'flex-1',
      options: [
        { label: 'Seleccionar fecha', value: 'date-picker' }
      ]
    },
    {
      id: 'estado',
      type: 'dropdown',
      label: 'Estado',
      placeholder: 'Seleccionar estado',
      width: 'flex-1',
      options: [
        { label: 'Pendiente', value: 'pendiente' },
        { label: 'Entregado', value: 'entregado' },
        { label: 'Atrasado', value: 'atrasado' }
      ]
    },
    {
      id: 'tipo',
      type: 'dropdown',
      label: 'Tipo',
      placeholder: 'Seleccionar tipo',
      width: 'flex-1',
      options: [
        { label: 'Examen', value: 'examen' },
        { label: 'TP', value: 'tp' },
        { label: 'Otro', value: 'otro' }
      ]
    }
  ];

  /** Configuración de columnas para la tabla */
  tableColumns: TableColumn[] = [
    {
      key: 'alumno',
      label: 'Alumno',
      sortable: true,
      width: '20%'
    },
    {
      key: 'curso',
      label: 'Curso',
      sortable: true,
      width: '20%'
    },
    {
      key: 'fechaEntrega',
      label: 'Fecha Entrega',
      sortable: true,
      width: '15%'
    },
    {
      key: 'tipo',
      label: 'Tipo',
      sortable: true,
      width: '15%'
    },
    {
      key: 'estado',
      label: 'Estado',
      type: 'status',
      sortable: true,
      width: '15%',
      align: 'center'
    },
    {
      key: 'acciones',
      label: 'Acción',
      type: 'action',
      sortable: false,
      width: '15%',
      align: 'center'
    }
  ];

  /** Datos de entregas para mostrar en la tabla */
  tableData: TableRow[] = [
    {
      id: '1',
      alumno: 'Juan Pérez',
      curso: '2º Año - Programación II',
      fechaEntrega: '2024-03-25',
      tipo: 'Trabajo Práctico',
      estado: 'entregado'
    },
    {
      id: '2',
      alumno: 'María García',
      curso: '1º Año - Programación I',
      fechaEntrega: '2024-03-20',
      tipo: 'Examen',
      estado: 'pendiente'
    },
    {
      id: '3',
      alumno: 'Carlos López',
      curso: '3º Año - Desarrollo de Software',
      fechaEntrega: '2024-03-15',
      tipo: 'Proyecto Final',
      estado: 'atrasado'
    },
    {
      id: '4',
      alumno: 'Ana Rodríguez',
      curso: '2º Año - Base de Datos',
      fechaEntrega: '2024-03-29',
      tipo: 'Cuestionario',
      estado: 'entregado'
    },
    {
      id: '5',
      alumno: 'Pedro Martínez',
      curso: '1º Año - Programación I',
      fechaEntrega: '2024-04-01',
      tipo: 'Trabajo Práctico',
      estado: 'pendiente'
    }
  ];

  /** Acciones disponibles para cada entrega */
  tableActions: TableAction[] = [
    {
      id: 'view',
      label: '',
      type: 'button',
      buttonClass: 'btn-primary',
      icon: '/icons/bi-eye.svg',
      tooltip: 'Ver'
    },
    {
      id: 'grade',
      label: '',
      type: 'button',
      buttonClass: 'btn-success',
      icon: '/icons/check.svg',
      tooltip: 'Calificar'
    }
  ];

  /**
   * Maneja cambios en los filtros
   */
  onFilterChange(event: FilterEvent): void {
    console.log('Filtro cambiado:', event);
    // Implementar lógica de filtrado
  }

  /**
   * Maneja clicks en botones de filtros
   */
  onFilterButtonClick(event: FilterEvent): void {
    console.log('Botón de filtro clickeado:', event);
    // Implementar lógica de botones de filtros
  }

  /**
   * Maneja el ordenamiento de la tabla
   */
  onTableSort(event: { column: string; direction: 'asc' | 'desc' }): void {
    this.sortTableData(event.column, event.direction);
  }

  /**
   * Maneja el click en una fila de la tabla
   * TODO: Implementar navegación a detalle de entrega
   */
  onTableRowClick(row: TableRow): void {
    // Implementar acción al hacer clic en una fila
  }

  /**
   * Maneja las acciones ejecutadas en la tabla
   */
  onTableAction(event: { action: string; row: TableRow }): void {
    switch (event.action) {
      case 'view':
        this.viewSubmission(event.row);
        break;
      case 'grade':
        this.gradeSubmission(event.row);
        break;
      default:
        console.warn('Acción no reconocida:', event.action);
    }
  }

  /**
   * Ordena los datos de la tabla según columna y dirección
   */
  private sortTableData(column: string, direction: 'asc' | 'desc'): void {
    this.tableData.sort((a, b) => {
      const valueA = a[column];
      const valueB = b[column];
      
      if (valueA < valueB) {
        return direction === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  /**
   * Navega a la vista de una entrega específica
   * TODO: Implementar navegación real
   */
  private viewSubmission(row: TableRow): void {
    // Implementar navegación a vista de entrega o abrir modal
  }

  /**
   * Navega a la página de calificación de una entrega
   * TODO: Implementar navegación real
   */
  private gradeSubmission(row: TableRow): void {
    // Implementar navegación a calificación o abrir modal
  }
}
