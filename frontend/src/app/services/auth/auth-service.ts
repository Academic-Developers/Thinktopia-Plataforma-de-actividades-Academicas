import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { User, LoginRequest, LoginResponse } from '../../models/auth-models/auth-interface';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'  // Hace que este servicio esté disponible en toda la aplicación
})
export class AuthService {

    // BehaviorSubject que almacena el usuario actual (o null si no está logueado)
    private currentUserSubject = new BehaviorSubject<User | null>(null);

    // Los componentes se suscriben a este Observable para recibir cambios del usuario
    public currentUser$ = this.currentUserSubject.asObservable();

    // URL BASE DE LA API
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
        // Al inicializar el servicio, intentamos recuperar el usuario del localStorage
        this.loadUserFromStorage();
    }

    /*
      Carga el usuario desde localStorage al inicializar la aplicación
      Esto permite mantener la sesión aunque el usuario recargue la página
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
     * MÉTODO DE LOGIN
     * Realiza la autenticación con el backend y gestiona el estado del usuario
     * 
     * @param credentials - Email y password del usuario
     * @returns Observable<User | null> - Usuario autenticado o null si falló
     */
    login(credentials: LoginRequest): Observable<User | null> {
        console.log('Iniciando proceso de login para:', credentials.email);

        // Realizamos la petición POST al endpoint de login
        return this.http.post<LoginResponse>(`${this.apiUrl}users/auth/login/`, credentials)
            .pipe(
                // map(): Transformamos la respuesta del backend en nuestro formato User
                map((response: LoginResponse) => {
                    const user: User = {
                        id: response.id,
                        email: response.email,
                        role: response.role
                    };
                    return user;
                }),

                // tap(): Guardamos el usuario en el estado y localStorage (efecto secundario)
                tap((user: User) => {
                    console.log('✅ Login exitoso. Usuario:', user);

                    // Actualizamos el BehaviorSubject con el nuevo usuario
                    this.currentUserSubject.next(user);

                    // Guardamos en localStorage para persistencia
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }),

                // catchError(): Manejamos errores 
                catchError((error) => {
                    console.error(' Error en login:', error);

                    // Limpiamos cualquier estado previo
                    this.logout();

                    // Retornamos null para indicar que el login falló
                    // of(null) crea un Observable que emite null
                    return of(null);
                })
            );
    }

    /*
    LOGOUT
    Limpia toda la información del usuario y resetea el estado
   */
    logout(): void {
        console.log('🚪 Cerrando sesión...');

        // Limpiamos el BehaviorSubject
        this.currentUserSubject.next(null);

        // Limpiamos localStorage
        localStorage.removeItem('currentUser');

        console.log('✅ Sesión cerrada correctamente');
    }

    /*
      GETTER SÍNCRONO PARA USER ID
      Este método es CRUCIAL para otros servicios que necesitan el user_id
      para hacer peticiones seguras al backend
      @returns number | null - ID del usuario actual o null si no está logueado
     */
    getCurrentUserId(): number | null {
        const currentUser = this.currentUserSubject.value;
        return currentUser ? currentUser.id : null;
    }

    /* 
      GETTER SÍNCRONO PARA USER COMPLETO
      Obtiene el usuario completo sin necesidad de suscribirse 
      @returns User | null - Usuario actual o null si no está logueado
     */
    getCurrentUser(): User | null {
        return this.currentUserSubject.value;
    }

    /*
      VERIFICAR SI ESTÁ LOGUEADO
      Método utilitario para verificar el estado de autenticación
      @returns boolean - true si hay usuario logueado, false si no
     */
    isLoggedIn(): boolean {
        return this.currentUserSubject.value !== null;
    }

    /*
      VERIFICAR ROL
      Método utilitario para verificar el rol del usuario actual
      @param role - Rol a verificar ('alumno' o 'docente')
      @returns boolean - true si el usuario tiene ese rol, false si no
     */
    hasRole(role: 'alumno' | 'docente'): boolean {
        const currentUser = this.currentUserSubject.value;
        return currentUser ? currentUser.role === role : false;
    }
}







