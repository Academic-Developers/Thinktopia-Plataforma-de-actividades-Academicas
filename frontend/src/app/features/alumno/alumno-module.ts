import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlumnoRoutingModule } from './alumno-routing-module';
import { GenericTableComponent } from '../docente/components/generic-table/generic-table.component'; 
import { GenericCardComponent } from '../docente/components/generic-card/generic-card.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AlumnoRoutingModule,
    GenericTableComponent,
    GenericCardComponent
  ],
  exports: [
    GenericTableComponent,
    GenericCardComponent
  ]
})
export class AlumnoModule { }
