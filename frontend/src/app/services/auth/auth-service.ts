










// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable, of, BehaviorSubject } from 'rxjs';
// import { switchMap, tap, catchError, map } from 'rxjs/operators';
// import { environment } from '../../../environments/environment';
// import { Router } from '@angular/router';
// import {
//   ReqresLoginResponse,
//   ReqresRegisterResponse,
//   User,
// } from '../../models/auth-models/auth-models';

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthService {
//   private urlReqres = environment.urlReqres;
//   private urlJsonServer = environment.urlJsonServer;
//   private apiKey = environment.apiKey;

//   private loggedInUserSubject = new BehaviorSubject<User | null>(null);
//   public loggedInUser$ = this.loggedInUserSubject.asObservable();

//   constructor(private http: HttpClient, private router: Router) {
//     this.loadUserFromLocalStorage();
//   }

//   private getHeaders(): HttpHeaders {
//     return new HttpHeaders({
//       'Content-Type': 'application/json',
//       'x-api-key': this.apiKey,
//     });
//   }

//   public getLoggedInUser(): User | null {
//     return this.loggedInUserSubject.value;
//   }

//   private setLoggedInUser(user: User): void {
//     this.loggedInUserSubject.next(user);
//     if (typeof window !== 'undefined' && window.localStorage) {
//       localStorage.setItem('loggedInUser', JSON.stringify(user));
//     }
//   }

//   private clearLoggedInUser(): void {
//     this.loggedInUserSubject.next(null);
//     if (typeof window !== 'undefined' && window.localStorage) {
//       localStorage.removeItem('loggedInUser');
//     }
//   }

//   private loadUserFromLocalStorage(): void {
//     if (typeof window !== 'undefined' && window.localStorage) {
//       const userJson = localStorage.getItem('loggedInUser');
//       if (userJson) {
//         this.loggedInUserSubject.next(JSON.parse(userJson));
//       }
//     }
//   }

//   public logout(): void {
//     this.clearLoggedInUser();
//     this.router.navigate(['/auth/login']);
//   }

//   register(userData: {
//     email: string;
//     password: string;
//   }): Observable<User | null> {
//     return this.http
//       .post<ReqresRegisterResponse>(`${this.urlReqres}register`, userData, {
//         headers: this.getHeaders(),
//       })
//       .pipe(
//         tap((registerResponse) =>
//           console.log('Respuesta de Register:', registerResponse)
//         ),
//         switchMap((_registerResponse) => {
//           const newUser: Omit<User, 'id'> = {
//             email: userData.email,
//             role: 'alumno',
//           };
//           return this.http.post<User>(`${this.urlJsonServer}users`, newUser);
//         }),
//         tap((createdUser) => {
//           console.log(
//             'Usuario registrado exitosamente en db.json:',
//             createdUser
//           );
//           this.router.navigate(['/auth/login']);
//         }),
//         catchError((error) => {
//           console.error('Error en el proceso de registro:', error);
//           return of(null);
//         })
//       );
//   }

 
//   login(userData: {
//     email: string;
//     password: string;
//   }): Observable<User | null> {
//     return this.http
//       .post<ReqresLoginResponse>(`${this.urlReqres}login`, userData, {
//         headers: this.getHeaders(),
//       })
//       .pipe(
//         tap((loginResponse) =>
//           console.log('Respuesta de Login:', loginResponse)
//         ),
       
//         switchMap(() => {
//           return this.http.get<User[]>(
//             `${this.urlJsonServer}users?email=${userData.email}`
//           );
//         }),
//         map((users) => (users.length > 0 ? users[0] : null)),
//         tap((user) => {
//           if (user) {
//             // 4. Guarda el usuario completo en el localStorage y en el BehaviorSubject
//             this.setLoggedInUser(user);

//             if (user.role === 'docente') {
//               this.router.navigate(['/docente/dashboard']);
//             } else {
//               this.router.navigate(['/alumno/dashboard']);
//             }
//           } else {
//             console.error('Usuario no encontrado en la base de datos');
//           }
//         }),
//         catchError((error) => {
//           console.error('Error en el proceso de login:', error);
//           return of(null);
//         })
//       );
//   }
// }
