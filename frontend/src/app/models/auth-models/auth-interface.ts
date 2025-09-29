// Usuario 
export interface User {
    id: number;
    email: string;
    role: 'alumno' | 'docente';
}

// Respuesta esperada al realizar un login
export interface LoginResponse {
    id: number; // ID del usuario autenticado
    role: 'alumno' | 'docente';
}

export interface RegisterResponse {
    id: number;
    email: string;
    role: 'alumno' | 'docente';
}