import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericTableComponent, TableColumn, TableRow, TableAction } from '../../components/generic-table/generic-table.component';
import { PageTitle } from '../../components/page-title/page-title.component';
import { FiltersComponent, FilterConfig, FilterEvent } from '../../components/filters/filters.component';

/**
 * Componente para gestión de actividades académicas
 * Permite filtrar, ordenar y gestionar actividades educativas
 */
@Component({
  selector: 'app-actividades',
  standalone: true,
  imports: [CommonModule, GenericTableComponent, PageTitle, FiltersComponent],
  templateUrl: './actividades.html',
  styleUrl: './actividades.css'
})
export class Actividades {
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
      key: 'titulo',
      label: 'Título',
      sortable: true,
      width: '30%'
    },
    {
      key: 'curso',
      label: 'Curso',
      sortable: true,
      width: '20%'
    },
    {
      key: 'fechaCreacion',
      label: 'Fecha Creación',
      sortable: true,
      width: '20%'
    },
    {
      key: 'fechaEntrega',
      label: 'Fecha Entrega',
      sortable: true,
      width: '20%'
    },
    {
      key: 'acciones',
      label: 'Acción',
      type: 'action',
      sortable: false,
      width: '10%',
      align: 'center'
    }
  ];

  /** Datos de actividades para mostrar en la tabla */
  tableData: TableRow[] = [
    {
      id: '1',
      titulo: 'Trabajo Práctico N°1 - Variables y Estructuras de Control',
      curso: '1º Año - Programación I',
      fechaCreacion: '2024-03-15',
      fechaEntrega: '2024-03-25'
    },
    {
      id: '2',
      titulo: 'Examen Parcial - POO y Herencia',
      curso: '2º Año - Programación II',
      fechaCreacion: '2024-03-20',
      fechaEntrega: '2024-04-05'
    },
    {
      id: '3',
      titulo: 'Proyecto Final - Sistema de Gestión',
      curso: '3º Año - Desarrollo de Software',
      fechaCreacion: '2024-03-10',
      fechaEntrega: '2024-05-15'
    },
    {
      id: '4',
      titulo: 'Cuestionario - Bases de Datos Relacionales',
      curso: '2º Año - Base de Datos',
      fechaCreacion: '2024-03-22',
      fechaEntrega: '2024-03-29'
    },
    {
      id: '5',
      titulo: 'Trabajo Práctico N°2 - Algoritmos de Búsqueda',
      curso: '1º Año - Programación I',
      fechaCreacion: '2024-03-18',
      fechaEntrega: '2024-04-01'
    }
  ];

  /** Acciones disponibles para cada actividad */
  tableActions: TableAction[] = [
    {
      id: 'edit',
      label: '',
      type: 'button',
      buttonClass: 'edit-button',
      icon: '/icons/bi-pencil.svg',
      tooltip: 'Editar'
    }
  ];

  /**
   * Maneja el click en el botón de crear actividad
   */
  onCreateActivityClick(): void {
    console.log('Crear nueva actividad');
    // Implementar navegación a página de creación o abrir modal
  }

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
   * TODO: Implementar navegación a detalle
   */
  onTableRowClick(row: TableRow): void {
    // Implementar acción al hacer clic en una fila
  }

  /**
   * Maneja las acciones ejecutadas en la tabla
   */
  onTableAction(event: { action: string; row: TableRow }): void {
    switch (event.action) {
      case 'edit':
        this.editActivity(event.row);
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
   * Navega a la página de edición de actividad
   * TODO: Implementar navegación real
   */
  private editActivity(row: TableRow): void {
    // Implementar navegación a edición o abrir modal
  }
}
