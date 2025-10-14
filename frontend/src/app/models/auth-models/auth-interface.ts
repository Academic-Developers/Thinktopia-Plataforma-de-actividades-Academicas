
export interface User {
    id: number;        // ID único del usuario (CRUCIAL para seguridad)
    email: string;     // Email del usuario
    role: 'alumno' | 'docente';  // Rol específico (solo estos dos valores)
}


export interface LoginResponse {
    id: number;
    email: string;
    role: 'alumno' | 'docente';
}


//Datos que enviamos al backend para hacer login

export interface LoginRequest {
    email: string;
    password: string;
}


// 📝 Datos que enviamos al backend para hacer registro
export interface RegisterRequest {
    email: string;
    password: string;
    role: 'alumno' | 'docente';
}


// 📩 Respuesta del backend al registrar
export interface RegisterResponse {
    id: number;
    email: string;
    role: 'alumno' | 'docente';
    mensaje?: string;  // Mensaje opcional del servidor
}