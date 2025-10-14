import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { User, LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../../models/auth-models/auth-interface';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // 🏪 Estado privado del usuario actual
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  
  // 📡 Observable público para que los componentes se suscriban
  public currentUser$ = this.currentUserSubject.asObservable();
  
  // 🌐 URL base de la API
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  /**
   * Carga usuario desde localStorage al inicializar
   */
  private loadUserFromStorage(): void {
    try {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        const user: User = JSON.parse(storedUser);
        this.currentUserSubject.next(user);
        console.log(' Usuario cargado desde localStorage:', user);
      }
    } catch (error) {
      console.warn(' Error al cargar usuario desde localStorage:', error);
      localStorage.removeItem('currentUser');
    }
  }

  /**
   * Realiza login y gestiona el estado del usuario
   */
  login(credentials: LoginRequest): Observable<User | null> {
    console.log('🔄 Iniciando login para:', credentials.email);
    
    return this.http.post<LoginResponse>(`${this.apiUrl}auth/login/`, credentials)
      .pipe(
        map((response: LoginResponse) => ({
          id: response.id,
          email: response.email,
          role: response.role
        } as User)),
        
        tap((user: User) => {
          console.log('Login exitoso:', user);
          this.currentUserSubject.next(user);
          localStorage.setItem('currentUser', JSON.stringify(user));
        }),
        
        catchError((error) => {
          console.error('Error en login:', error);
          this.logout();
          return of(null);
        })
      );
  }

  /**
   * Registra un nuevo usuario y gestiona el estado
   * Sigue el mismo patrón que login con Observables
   */
  register(datos: RegisterRequest): Observable<User | null> {
    console.log('🔄 Iniciando registro para:', datos.email);
    
    return this.http.post<RegisterResponse>(`${this.apiUrl}auth/registro/`, datos)
      .pipe(
        map((response: RegisterResponse) => ({
          id: response.id,
          email: response.email,
          role: response.role
        } as User)),
        
        tap((user: User) => {
          console.log('Registro exitoso:', user);
          // Automáticamente loguea al usuario después del registro
          this.currentUserSubject.next(user);
          localStorage.setItem('currentUser', JSON.stringify(user));
        }),
        
        catchError((error) => {
          console.error('Error en registro:', error);
          return of(null);
        })
      );
  }

  /**
   * Cierra sesión y limpia el estado
   */
  logout(): void {
    console.log('Cerrando sesión...');
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
    console.log('Sesión cerrada');
  }

  /**
   * MÉTODO CRUCIAL: Obtiene el ID del usuario para peticiones seguras
   */
  getCurrentUserId(): number | null {
    const currentUser = this.currentUserSubject.value;
    return currentUser ? currentUser.id : null;
  }

  /**
   * Obtiene el usuario completo actual
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Verifica si hay usuario logueado
   */
  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  /**
   * Verifica si el usuario tiene un rol específico
   */
  hasRole(role: 'alumno' | 'docente'): boolean {
    const currentUser = this.currentUserSubject.value;
    return currentUser ? currentUser.role === role : false;
  }
}