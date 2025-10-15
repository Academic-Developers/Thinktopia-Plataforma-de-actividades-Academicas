import { Component } from '@angular/core';
import { GestionMateriasComponent } from '../../../../shared/components/gestion-materias/gestion-materias';

@Component({
  selector: 'app-admin-materias',
  standalone: true,
  imports: [GestionMateriasComponent],
  template: `
    <div style="padding: 20px; min-height: calc(100vh - 200px);">
      <app-gestion-materias></app-gestion-materias>
    </div>
  `
})
export class AdminMateriasPage {}
