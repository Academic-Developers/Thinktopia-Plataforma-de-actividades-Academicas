import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageTitle } from '../../components/page-title/page-title.component';
import { FiltersComponent, FilterConfig, FilterEvent } from '../../components/filters/filters.component';

/**
 * Componente para generación y gestión de reportes académicos
 * Permite filtrar y generar diferentes tipos de reportes educativos
 */
@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, PageTitle, FiltersComponent],
  templateUrl: './reportes.html',
  styleUrl: './reportes.css'
})
export class Reportes {
  /** Configuración de filtros disponibles */
  filterConfigs: FilterConfig[] = [
    {
      id: 'categoria',
      type: 'dropdown',
      label: 'Categoría',
      placeholder: 'Seleccionar categoría',
      width: 'flex-1',
      options: [
        { label: 'Arte digital', value: 'arte-digital' },
        { label: 'Software', value: 'software' },
        { label: 'Ciencia de datos', value: 'ciencia-datos' }
      ]
    },
    {
      id: 'periodo',
      type: 'dropdown',
      label: 'Período',
      placeholder: 'Seleccionar periodo',
      width: 'flex-1',
      options: [
        { label: 'Primer Periodo', value: 'primer-periodo' },
        { label: 'Segundo Periodo', value: 'segundo-periodo' }
      ]
    }
  ];

  /** Variables para almacenar los filtros seleccionados */
  selectedCategoria: string = '';
  selectedPeriodo: string = '';

  /**
   * Maneja el click del botón Generar
   */
  onGenerateReportClick(): void {
    this.generarReporte();
  }

  /**
   * Maneja cambios en los filtros
   */
  onFilterChange(event: FilterEvent): void {
    console.log('Filtro cambiado:', event);
    if (event.filterId === 'categoria') {
      this.selectedCategoria = event.value;
    } else if (event.filterId === 'periodo') {
      this.selectedPeriodo = event.value;
    }
  }

  /**
   * Maneja clicks en botones de filtros
   */
  onFilterButtonClick(event: FilterEvent): void {
    console.log('Botón de filtro clickeado:', event);
    // Implementar lógica de botones de filtros
  }

  /**
   * Genera un reporte con los filtros seleccionados
   * TODO: Implementar lógica de generación real
   */
  private generarReporte(): void {
    console.log('Generando reporte con filtros:', {
      categoria: this.selectedCategoria,
      periodo: this.selectedPeriodo
    });
    // Implementar lógica para generar el reporte
  }
}
