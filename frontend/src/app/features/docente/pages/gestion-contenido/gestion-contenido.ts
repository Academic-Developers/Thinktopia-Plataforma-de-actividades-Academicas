import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ContenidoFormModal} from '../../components/contenido-form-modal/contenido-form-modal'

@Component({
  selector: 'app-gestion-contenido',
  standalone: true,
  imports: [CommonModule, ContenidoFormModal],
  templateUrl: './gestion-contenido.html',
  styleUrl: './gestion-contenido.css'
})
export class GestionContenido {
   isModalOpen = false;

  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }


}
