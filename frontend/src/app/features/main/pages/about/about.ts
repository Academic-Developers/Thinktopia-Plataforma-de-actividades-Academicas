import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AboutService } from '../../../../services/about/about.service';
import {
  Valores,
  EquipoPrincipal,
  EquipoDesarrollo,
} from '../../../../models/about-models/about-models';


@Component({
  selector: 'app-about',
  imports: [RouterModule],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About implements OnInit {
  valores: Valores[] = [];
  equipoPrincipal: EquipoPrincipal[] = [];
  equipoDesarrollo: EquipoDesarrollo[] = [];


  constructor(private aboutService: AboutService) {}


  ngOnInit(): void {
    this.aboutService.getValores().subscribe({
      next: (data) => (this.valores = data),
      error: (err) => console.error('Error cargando valores', err),
    });


    this.aboutService.getEquipoPrincipal().subscribe({
      next: (data) => (this.equipoPrincipal = data),
      error: (err) => console.error('Error cargando equipo principal', err),
    });


    this.aboutService.getEquipoDesarrollo().subscribe({
      next: (data) => (this.equipoDesarrollo = data),
      error: (err) => console.error('Error cargando equipo desarrollo', err),
    });
  }
}
