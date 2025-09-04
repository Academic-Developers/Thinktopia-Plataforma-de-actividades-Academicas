import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Configuración de columna para la tabla genérica
 */
export interface TableColumn {
  key: string;
  label: string;
  type?: 'text' | 'date' | 'action' | 'status' | 'button';
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

/**
 * Configuración de acción para botones en cada fila
 */
export interface TableAction {
  id: string;
  label: string;
  action?: string;
  type?: 'button' | 'link';
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
  buttonClass?: string;
  icon?: string;
  tooltip?: string;
  condition?: (row: any) => boolean;
}

/**
 * Estructura de fila de datos para la tabla
 */
export interface TableRow {
  [key: string]: any;
  _clickAction?: string;
  _actions?: TableAction[];
}

/**
 * Evento emitido por la tabla
 */
export interface TableEvent {
  action: string;
  row: TableRow;
  column?: string;
  index: number;
}

/**
 * Componente de tabla genérica reutilizable
 * Proporciona funcionalidades de ordenamiento, acciones por fila y estados de carga
 */
@Component({
  selector: 'app-generic-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './generic-table.component.html',
  styleUrls: ['./generic-table.component.css']
})
export class GenericTableComponent {
  @Input() columns: TableColumn[] = [];
  @Input() data: TableRow[] = [];
  @Input() actions: TableAction[] = [];
  @Input() loading: boolean = false;
  @Input() emptyMessage: string = 'No hay datos disponibles';
  @Input() responsive: boolean = true;
  @Input() striped: boolean = true;
  @Input() hover: boolean = true;
  @Input() sortable: boolean = true;
  @Input() tableClasses: string = '';

  @Output() rowClick = new EventEmitter<TableRow>();
  @Output() actionClick = new EventEmitter<{ action: string; row: TableRow }>();
  @Output() sort = new EventEmitter<{ column: string; direction: 'asc' | 'desc' }>();

  currentSort: { column: string; direction: 'asc' | 'desc' } | null = null;

  /**
   * Maneja el click en una fila de la tabla
   */
  onRowClick(row: TableRow, index: number): void {
    this.rowClick.emit(row);
  }

  /**
   * Maneja el click en un botón de acción
   */
  onActionClick(action: string, row: TableRow, index: number, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    
    this.actionClick.emit({
      action,
      row
    });
  }

  /**
   * Maneja el ordenamiento de columnas
   */
  onSort(column: TableColumn): void {
    if (!column.sortable || !this.sortable) return;

    let direction: 'asc' | 'desc' = 'asc';
    
    if (this.currentSort?.column === column.key) {
      direction = this.currentSort.direction === 'asc' ? 'desc' : 'asc';
    }

    this.currentSort = { column: column.key, direction };
    this.sort.emit(this.currentSort);
  }

  /**
   * Obtiene el icono de ordenamiento para una columna
   */
  getSortIcon(column: TableColumn): string {
    if (!column.sortable || !this.sortable) return '';
    
    if (this.currentSort?.column !== column.key) {
      return 'sort';
    }
    
    return this.currentSort.direction === 'asc' ? 'sort-up' : 'sort-down';
  }

  /**
   * Obtiene las clases CSS para una columna específica
   */
  getColumnClass(column: TableColumn): string {
    const classes = [];
    
    if (column.align) {
      classes.push(`text-${column.align}`);
    }
    
    if (column.sortable && this.sortable) {
      classes.push('sortable');
    }
    
    if (column.width) {
      classes.push('custom-width');
    }
    
    return classes.join(' ');
  }

  /**
   * Obtiene las clases CSS para una celda específica
   */
  getCellClass(column: TableColumn, value: any): string {
    const classes = [];
    
    if (column.align) {
      classes.push(`text-${column.align}`);
    }
    
    if (column.type === 'status') {
      classes.push('status-cell');
      if (value) {
        const status = value.toString().toLowerCase();
        classes.push(`status-${status}`);
      }
    }
    
    return classes.join(' ');
  }

  /**
   * Obtiene la clase de variante para un botón de acción
   */
  getActionVariantClass(variant?: string): string {
    switch (variant) {
      case 'primary': return 'btn-primary';
      case 'secondary': return 'btn-secondary';
      case 'danger': return 'btn-danger';
      case 'success': return 'btn-success';
      case 'warning': return 'btn-warning';
      default: return 'edit-button';
    }
  }

  /**
   * Determina si una acción debe mostrarse para una fila específica
   */
  shouldShowAction(action: TableAction, row: TableRow): boolean {
    if (action.condition) {
      return action.condition(row);
    }
    return true;
  }

  /**
   * Obtiene las acciones disponibles para una fila específica
   */
  getActionsForRow(row: TableRow): TableAction[] {
    return row._actions || this.actions;
  }

  /**
   * Formatea el valor de una celda según su tipo de columna
   */
  formatCellValue(column: TableColumn, value: any): string {
    if (value === null || value === undefined) {
      return '';
    }

    switch (column.type) {
      case 'date':
        return value;
      case 'status':
        return value;
      default:
        return value.toString();
    }
  }

  /**
   * Verifica si alguna fila tiene acciones de click configuradas
   */
  hasClickableRows(): boolean {
    return this.data.some(row => row._clickAction);
  }

  /**
   * Obtiene las clases CSS para la tabla principal
   */
  getTableClasses(): string {
    const classes = ['tabla-genérica'];
    
    if (this.striped) {
      classes.push('table-striped');
    }
    
    if (this.hover) {
      classes.push('table-hover');
    }
    
    return classes.join(' ');
  }

  /**
   * Obtiene las clases CSS para una fila específica
   */
  getRowClass(row: TableRow): string {
    const classes = [];
    
    if (row._clickAction) {
      classes.push('clickable-row');
    }
    
    return classes.join(' ');
  }

  /**
   * Obtiene la clase de badge apropiada para un estado
   */
  getStatusBadgeClass(value: any): string {
    if (!value) return 'badge-secondary';
    
    const status = value.toString().toLowerCase();
    
    switch (status) {
      case 'calificado':
      case 'entregado':
      case 'completado':
        return 'badge-success';
      case 'pendiente':
      case 'en proceso':
        return 'badge-warning';
      case 'atrasado':
      case 'vencido':
      case 'rechazado':
        return 'badge-danger';
      case 'borrador':
      case 'sin entregar':
        return 'badge-secondary';
      default:
        return 'badge-primary';
    }
  }
}