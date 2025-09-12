/**
 * Perfis de usuário disponíveis no sistema
 */
export type UserRole = 'admin' | 'user';

/**
 * Interface base do usuário
 */
export interface BaseUser {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    image: string;
}

/**
 * Interface do médico
 */
// Removido: papéis de médico

/**
 * Interface do paciente
 */
// Removido: papéis de paciente

/**
 * Interface do administrador
 */
export interface Admin extends BaseUser {
    role: 'admin';
}

/**
 * Interface do usuário autenticado
 */
export interface CommonUser extends BaseUser {
    role: 'user';
}

export type User = Admin | CommonUser;

/**
 * Dados necessários para login
 */
export interface LoginCredentials {
    email: string;
    password: string;
}

/**
 * Dados necessários para registro
 */
export interface RegisterData {
    name: string;
    email: string;
    password: string;
    userType?: 'USER' | 'ADMIN';
}

/**
 * Resposta da API de autenticação
 */
export interface AuthResponse {
    user: User;
    token: string;
}

/**
 * Contexto de autenticação
 */
export interface AuthContextData {
    user: User | null;
    loading: boolean;
    signIn: (credentials: LoginCredentials) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    signOut: () => Promise<void>;
} 