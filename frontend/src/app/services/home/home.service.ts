import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable,tap,throwError} from "rxjs";
import { Features, Testimonial } from "../../models/home-models/home-models";
import { environment } from "../../../../environments/environment";
import { catchError} from 'rxjs/operators';

@Injectable({
  providedIn: "root",
})
export class HomeService {
  private apiUrl = environment.urlJsonServer; 
    
  constructor(private http: HttpClient) {}

  getFeatures(): Observable<Features[]> {
    console.log("Buscando")
    return this.http.get<Features[]>(`${this.apiUrl}/features`).pipe(
      tap(features => console.log('Respuesta de features:', features)),
      catchError(err => {
        console.error('Error en getFeatures:', err);
        return throwError(() => new Error('No se pudieron cargar las características.'));
      })
    );
  }

  getTestimonials(): Observable<Testimonial[]> {
    return this.http.get<Testimonial[]>(`${this.apiUrl}/testimonials`).pipe(
      tap(testimonials => console.log('Respuesta de testimonials:', testimonials)),
      catchError(err => {
        console.error('Error en getTestimonials:', err);
        return throwError(() => new Error('No se pudieron cargar los testimonios.'));
      })
    );
  }
}
