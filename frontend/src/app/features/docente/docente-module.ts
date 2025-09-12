  import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocenteRoutingModule } from './docente-routing-module';
import { GenericTableComponent } from './components/generic-table/generic-table.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DocenteRoutingModule,
    GenericTableComponent
  ],
  exports: [
    GenericTableComponent
  ]
})
export class DocenteModule { }
