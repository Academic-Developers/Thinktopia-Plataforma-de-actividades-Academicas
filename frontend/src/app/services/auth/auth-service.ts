import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { switchMap, tap, catchError, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { ReqresLoginResponse, ReqresRegisterResponse, User } from '../../models/auth-models/auth-models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private urlReqres = environment.urlReqres;
  private urlJsonServer = environment.urlJsonServer;
  private apiKey = environment.apiKey;

  constructor(private http: HttpClient, private router: Router) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'x-api-key': this.apiKey // Solo si tu API lo requiere
    });
  }

  register(userData: { email: string; password: string }): Observable<User | null> {
    return this.http.post<ReqresRegisterResponse>(`${this.urlReqres}register`, userData, { headers: this.getHeaders() }).pipe(
      tap((registerResponse) => console.log('Respuesta de Register:', registerResponse)),
      switchMap((_registerResponse) => {
        const newUser: Omit<User, 'id'> = {
          email: userData.email,
          role: 'alumno',
        };
        return this.http.post<User>(`${this.urlJsonServer}users`, newUser);
      }),
      tap((createdUser) => {
        console.log('Usuario registrado exitosamente en db.json:', createdUser);
        this.router.navigate(['/auth/login']);
      }),
      catchError((error) => {
        console.error('Error en el proceso de registro:', error);
        return of(null);
      })
    );
  }

  login(userData: { email: string; password: string }): Observable<User | null> {
    return this.http.post<ReqresLoginResponse>(`${this.urlReqres}login`, userData, { headers: this.getHeaders() }).pipe(
      tap((loginResponse) => console.log('Respuesta de Login:', loginResponse)),
      switchMap(() => {
        return this.http.get<User[]>(`${this.urlJsonServer}users?email=${userData.email}`);
      }),
      map((users) => (users.length > 0 ? users[0] : null)),
      tap((user) => {
        if (user) {
          if (user.role === "docente") {
            this.router.navigate(['/docente/dashboard']);
          } else {
            this.router.navigate(['/alumno/dashboard']);
          }
        } else {
          console.error('Usuario no encontrado en la base de datos');
        }
      }),
      catchError((error) => {
        console.error('Error en el proceso de login:', error);
        return of(null);
      })
    );
  }
}
