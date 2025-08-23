import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contenido-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contenido-form-modal.html',
  styleUrl: './contenido-form-modal.css'
})
export class ContenidoFormModal {
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();

  contentForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.contentForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      materia: ['', Validators.required],
      tema: ['', Validators.required],
      description: ['', [Validators.required, Validators.maxLength(200)]],
      file: [null, Validators.required]
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.contentForm.patchValue({
        file: input.files[0]
      });
    }
  }

  onSubmit(): void {
    if (this.contentForm.valid) {
      console.log('Formulario enviado:', this.contentForm.value);
      // Aquí iría la lógica para enviar al backend
      this.close(); // Cierra el modal después de enviar
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      this.contentForm.markAllAsTouched();
    }
  }

  close(): void {
    this.closeModal.emit();
  }
}