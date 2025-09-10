import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  //1- definimos la URL base de la API
  private apiUrl = environment.apiUrl;

  //2 - Inyectamos HttpClient en el constructor
  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
  return new HttpHeaders({
    'Content-Type': 'application/json',
    'x-api-key': environment.apiKey
  });
}
  //3 - Definimos los métodos
  register(userData: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}register`, userData, { headers:this.getHeaders() });
  }

  login(userData: { email: string; password: string }): Observable<any> {
 
    return this.http.post(`${this.apiUrl}login`, userData, { headers:this.getHeaders() });
  }
}
