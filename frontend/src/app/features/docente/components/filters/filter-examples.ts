/**
 * Ejemplos de configuración de filtros para diferentes páginas
 * Este archivo contiene configuraciones de ejemplo para usar el FiltersComponent
 */

import { FilterConfig } from './filters.component';

// =============================================================================
// CONFIGURACIÓN PARA PÁGINA DE REPORTES
// =============================================================================
export const reportesFilters: FilterConfig[] = [
  {
    id: 'categoria',
    type: 'dropdown',
    label: 'Filtrar por categoría',
    placeholder: 'Filtrar por categoría',
    width: 'w-25',
    options: [
      { label: 'Arte digital', value: 'arte-digital' },
      { label: 'Software', value: 'software' },
      { label: 'Ciencia de datos', value: 'ciencia-datos' }
    ]
  },
  {
    id: 'periodo',
    type: 'dropdown',
    label: 'Filtrar por Periodo',
    placeholder: 'Filtrar por Periodo',
    width: 'w-25',
    options: [
      { label: 'Primer Periodo', value: 'primer-periodo' },
      { label: 'Segundo Periodo', value: 'segundo-periodo' }
    ]
  },
  {
    id: 'generar',
    type: 'button',
    label: 'Generar',
    width: 'w-auto',
    variant: 'primary'
  }
];

// =============================================================================
// CONFIGURACIÓN PARA PÁGINA DE ACTIVIDADES
// =============================================================================
export const actividadesFilters: FilterConfig[] = [
  {
    id: 'filtrar-por',
    type: 'multi-dropdown',
    label: 'Filtrar por',
    placeholder: 'Filtrar por',
    width: 'w-25',
    options: [
      {
        label: 'Curso',
        value: 'curso',
        children: [
          { label: '1º Año', value: '1-ano' },
          { label: '2º Año', value: '2-ano' },
          { label: '3º Año', value: '3-ano' }
        ]
      },
      {
        label: 'Fecha de entrega',
        value: 'fecha-entrega',
        children: [
          { label: 'Seleccionar fecha', value: 'date-input' }
        ]
      },
      {
        label: 'Estado',
        value: 'estado',
        children: [
          { label: 'Pendiente', value: 'pendiente' },
          { label: 'Entregado', value: 'entregado' },
          { label: 'Atrasado', value: 'atrasado' }
        ]
      },
      {
        label: 'Tipo',
        value: 'tipo',
        children: [
          { label: 'Examen', value: 'examen' },
          { label: 'TP', value: 'tp' },
          { label: 'Otro', value: 'otro' }
        ]
      }
    ]
  },
  {
    id: 'ordenar-por',
    type: 'dropdown',
    label: 'Ordenar por',
    placeholder: 'Ordenar por',
    width: 'w-25',
    options: [
      { label: 'Materia', value: 'materia' },
      { label: 'Fecha', value: 'fecha' }
    ]
  },
  {
    id: 'crear-actividad',
    type: 'multi-dropdown',
    label: 'Crear actividad',
    placeholder: 'Crear actividad',
    width: 'w-25',
    options: [
      { label: 'Cuestionario', value: 'cuestionario' },
      { label: 'Trabajo Práctico', value: 'trabajo-practico' },
      { label: 'Examen', value: 'examen' }
    ]
  }
];

// =============================================================================
// CONFIGURACIÓN PARA PÁGINA DE ENTREGAS
// =============================================================================
export const entregasFilters: FilterConfig[] = [
  {
    id: 'filtrar-por',
    type: 'multi-dropdown',
    label: 'Filtrar por',
    placeholder: 'Filtrar por',
    width: 'w-25',
    options: [
      {
        label: 'Curso',
        value: 'curso',
        children: [
          { label: '1º Año', value: '1-ano' },
          { label: '2º Año', value: '2-ano' },
          { label: '3º Año', value: '3-ano' }
        ]
      },
      {
        label: 'Fecha de entrega',
        value: 'fecha-entrega',
        children: [
          { label: 'Seleccionar fecha', value: 'date-input' }
        ]
      },
      {
        label: 'Estado',
        value: 'estado',
        children: [
          { label: 'Pendiente', value: 'pendiente' },
          { label: 'Entregado', value: 'entregado' },
          { label: 'Atrasado', value: 'atrasado' }
        ]
      },
      {
        label: 'Tipo',
        value: 'tipo',
        children: [
          { label: 'Examen', value: 'examen' },
          { label: 'TP', value: 'tp' },
          { label: 'Otro', value: 'otro' }
        ]
      }
    ]
  }
];

// =============================================================================
// CONFIGURACIÓN PARA PÁGINA DE ESTADÍSTICAS (ya implementada)
// =============================================================================
export const estadisticasFilters: FilterConfig[] = [
  {
    id: 'curso',
    type: 'dropdown',
    label: 'Curso',
    placeholder: 'Matematicas Avanzadas',
    width: 'w-25',
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
    width: 'w-25',
    options: [
      { label: 'Semestre 2024-1', value: '2024-1' },
      { label: 'Semestre 2023-2', value: '2023-2' },
      { label: 'Semestre 2023-1', value: '2023-1' }
    ]
  }
];

// =============================================================================
// EJEMPLO DE USO EN COMPONENTE
// =============================================================================
/*
// En el componente .ts:
import { reportesFilters } from '../../components/filters/filter-examples';

export class ReportesComponent {
  filterConfigs = reportesFilters;
  
  onFilterChange(event: FilterEvent): void {
    console.log('Filter changed:', event);
    // Manejar cambios de filtros
  }
  
  onFilterButtonClick(event: FilterEvent): void {
    console.log('Button clicked:', event);
    if (event.filterId === 'generar') {
      this.generarReporte();
    }
  }
}

// En el template .html:
<app-filters 
    [filters]="filterConfigs"
    [showMobileVersion]="true"
    mobileCollapseId="reportesFilters"
    (filterChange)="onFilterChange($event)"
    (buttonClick)="onFilterButtonClick($event)">
</app-filters>
*/
