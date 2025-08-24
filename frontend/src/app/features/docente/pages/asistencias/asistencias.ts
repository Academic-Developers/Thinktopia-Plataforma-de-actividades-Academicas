import { Component, OnInit } from '@angular/core';

interface AsistenciaRegistrada {
  carrera: string;
  materia: string;
   fecha: string;
  curso: string;
  comision: string;
}
 interface InformeAsistencia {
  nombreAlumno: string;
   estado: 'Presente' | 'Ausente';
   fecha: string;
  correo: string;
 }

@Component({
  selector: 'app-asistencias',
  standalone: true,
  imports: [],
  templateUrl: './asistencias.html',
  styleUrl: './asistencias.css'
 })
 export class Asistencias implements OnInit {

  mostrarFormularioCarga: boolean = true;
 isUploadProcessStarted: boolean = false;
  archivoSeleccionado: File | null = null;
  mensajeErrorArchivo: string | null = null;
  cargaExitosa: boolean = false;

  // Datos ficticios
  asistenciasRegistradas: AsistenciaRegistrada[] = [
   { carrera: 'Bachiller en Economía', materia: 'Estadística y probabilidad', fecha: '09/03/25', curso: 'Primer año', comision: 'Comisión 1' },
    { carrera: 'Tecnicatura en Higiene y Seguridad', materia: 'Matemática 1', fecha: '19/04/25', curso: 'Segundo año', comision: 'Comisión 2' },
    { carrera: 'Tecnicatura en Desarrollo de Software', materia: 'Matemática 2', fecha: '10/05/25', curso: 'Tercer año', comision: 'Comisión 3' },
    { carrera: 'Tecnicatura en Desarrollo de Software', materia: 'Matemática 2', fecha: '10/05/25', curso: 'Tercer año', comision: 'Comisión 3' },
    { carrera: 'Bachiller en Administración', materia: 'Estadística y probabilidad', fecha: '20/07/25', curso: 'Cuarto año', comision: 'Comisión 4' },
    { carrera: 'Tecnicatura en Ciencia de Datos', materia: 'Matemática 1', fecha: '10/05/25', curso: 'Primer año', comision: 'Comisión 3' },
    { carrera: 'Bachiller en Cs Sociales', materia: 'Estadística y probabilidad', fecha: '10/05/25', curso: 'Quinto año', comision: 'Comisión 5' }
  ];

   // Datos ficticios para el informe de asistencia (simulando la salida de un CSV)
  informeAsistencia: InformeAsistencia[] = [
   {
     nombreAlumno: 'Juan Pérez',
     estado: 'Presente',
     fecha: '15/08/2025',
     correo: 'juan.perez@example.com'
   },
   {
     nombreAlumno: 'María López',
     estado: 'Ausente',
     fecha: '15/08/2025',
     correo: 'maria.lopez@example.com'
   },
   {
     nombreAlumno: 'Pedro González',
     estado: 'Presente',
     fecha: '15/08/2025',
     correo: 'pedro.gonzalez@example.com'
   },
   {
     nombreAlumno: 'Ana Martínez',
     estado: 'Ausente',
     fecha: '15/08/2025',
     correo: 'ana.martinez@example.com'
   },
   {
     nombreAlumno: 'Luis Fernández',
     estado: 'Presente',
     fecha: '15/08/2025',
     correo: 'luis.fernandez@example.com'
   },
   {
     nombreAlumno: 'Carlos Ruiz',
     estado: 'Ausente',
     fecha: '15/08/2025',
     correo: 'carlos.ruiz@example.com'
   }
 ];
 constructor() { }
  ngOnInit(): void {
    // Aquí se va a realizar la carga inicial de datos a traves de la API
  }

   iniciarProceso(): void {
     this.isUploadProcessStarted = true;
     this.mensajeErrorArchivo = null;
     this.archivoSeleccionado = null;
     this.cargaExitosa = false;
     console.log('Proceso de carga de archivo iniciado.');
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      if (file.type === 'text/csv' || file.name.endsWith('.csv') ||
         file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.name.endsWith('.xlsx')) {
        this.archivoSeleccionado = file;
         this.mensajeErrorArchivo = null;
        this.cargaExitosa = false;
       console.log('Archivo seleccionado:', file.name);
       } else {
         this.archivoSeleccionado = null;
         this.mensajeErrorArchivo = "Formato de archivo invalido.Por favor, suba un archivo CSV o XLSX";
         console.warn('Archivo no válido:', file.name);
      }
    } else {
      this.archivoSeleccionado = null;
       this.mensajeErrorArchivo = null;
     }
   }

   CargarArchivo(): void {
     if (this.archivoSeleccionado) {
       console.log('Carga de archivo:', this.archivoSeleccionado.name);
       this.mensajeErrorArchivo = null;
      this.cargaExitosa = false; 
      setTimeout(() => {
        this.cargaExitosa = true;
         this.mostrarFormularioCarga = false; 
         this.isUploadProcessStarted = false;
        this.archivoSeleccionado = null;
         console.log('Carga de archivo simulada exitosamente.');
       }, 1500);
   } else {
       this.mensajeErrorArchivo = 'Por favor, seleccione un archivo para cargar.';
    }
  }

  volverACargarArchivo(): void {
    this.mostrarFormularioCarga = true;
    this.isUploadProcessStarted = false;
    this.cargaExitosa = false; 
    this.mensajeErrorArchivo = null;
    this.archivoSeleccionado = null;
  }

  editarAsistencia(asistencia: AsistenciaRegistrada): void {
    console.log('Editar asistencia:', asistencia);
    // Aqui iria la logica para editar un formulario
  }
 }

