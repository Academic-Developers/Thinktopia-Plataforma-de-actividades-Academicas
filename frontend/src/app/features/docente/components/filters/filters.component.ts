import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';

/**
 * Opción de filtro para dropdowns
 */
export interface FilterOption {
  label: string;
  value: string;
  children?: FilterOption[];
}

/**
 * Configuración de un filtro específico
 */
export interface FilterConfig {
  id: string;
  type: 'dropdown' | 'multi-dropdown' | 'date' | 'button';
  label: string;
  placeholder?: string;
  options?: FilterOption[];
  width?: string;
  variant?: 'outline' | 'primary' | 'secondary';
  icon?: string;
}

/**
 * Evento emitido cuando cambia un filtro
 */
export interface FilterEvent {
  filterId: string;
  value: any;
  type: string;
}

/**
 * Componente reutilizable para sistemas de filtros
 * Soporta dropdowns, multi-dropdowns, fechas y botones
 */
@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf],
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent {
  @Input() filters: FilterConfig[] = [];
  @Input() showMobileVersion: boolean = true;
  @Input() mobileCollapseId: string = 'mobileFilters';
  
  @Output() filterChange = new EventEmitter<FilterEvent>();
  @Output() buttonClick = new EventEmitter<FilterEvent>();

  selectedValues: { [key: string]: any } = {};

  /**
   * Maneja la selección de filtros
   */
  onFilterSelect(filterId: string, value: any, type: string): void {
    this.selectedValues[filterId] = value;
    this.filterChange.emit({
      filterId,
      value,
      type
    });
  }

  /**
   * Maneja clicks en botones de filtro
   */
  onButtonClick(filterId: string): void {
    this.buttonClick.emit({
      filterId,
      value: null,
      type: 'button'
    });
  }

  /**
   * Maneja cambios en filtros de fecha
   */
  onDateChange(filterId: string, event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    
    // Actualizar el valor seleccionado para mostrar la fecha en el botón
    this.selectedValues[filterId] = value;
    
    // Emitir el evento de cambio
    this.filterChange.emit({
      filterId,
      value,
      type: 'date'
    });
  }

  /**
   * Obtiene el ancho CSS para un filtro
   */
  getFilterWidth(filter: FilterConfig): string {
    if (filter.width === 'flex-1') {
      return 'flex-fill';
    }
    return filter.width || 'w-25';
  }

  /**
   * Obtiene las clases CSS para botones de filtro
   */
  getButtonClass(filter: FilterConfig): string {
    const variant = filter.variant || 'outline';
    const baseClass = 'btn btn-sm w-100';
    
    switch (variant) {
      case 'primary':
        return `${baseClass} btn-primary`;
      case 'secondary':
        return `${baseClass} btn-secondary`;
      default:
        return `${baseClass} btn-outline-secondary dropdown-toggle`;
    }
  }

  /**
   * Obtiene el valor seleccionado para un filtro específico
   */
  getSelectedValue(filterId: string): string {
    const value = this.selectedValues[filterId];
    
    // Si es una fecha, formatearla para mostrar mejor
    if (value && this.isDateValue(value)) {
      return this.formatDate(value);
    }
    
    return value || '';
  }

  /**
   * Verifica si un valor es una fecha
   */
  private isDateValue(value: string): boolean {
    // Verifica si el valor tiene formato de fecha YYYY-MM-DD
    return /^\d{4}-\d{2}-\d{2}$/.test(value);
  }

  /**
   * Formatea una fecha para mostrar
   */
  private formatDate(dateString: string): string {
    try {
      const date = new Date(dateString + 'T00:00:00');
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  }

  /**
   * Verifica si un filtro es de tipo botón
   */
  isButtonType(filter: FilterConfig): boolean {
    return filter.type === 'button';
  }

  /**
   * Verifica si una opción tiene elementos hijos
   */
  hasChildren(option: FilterOption): boolean {
    return !!(option.children && option.children.length > 0);
  }

  /**
   * Genera un ID único para elementos del DOM
   */
  generateUniqueId(filterId: string, suffix: string = ''): string {
    return `${filterId}_${suffix}_${Math.random().toString(36).substr(2, 9)}`;
  }
}