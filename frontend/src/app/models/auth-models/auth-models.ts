export interface User {
    id: number;
    email: string
    role: "docente" | "alumno";
}

export interface ReqresLoginResponse {
    token: string;
}

export interface ReqresRegisterResponse {
    id: number;
    token: string;
} 