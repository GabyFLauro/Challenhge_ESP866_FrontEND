import { AuthResponse, LoginCredentials, RegisterData, User } from '../types/auth';
import { authApiService } from './authApi';

// Chaves de armazenamento
const STORAGE_KEYS = {
    USER: '@MedicalApp:user',
    TOKEN: '@MedicalApp:token',
};

export const authService = {
    async signIn(credentials: LoginCredentials): Promise<AuthResponse> {
        return authApiService.signIn(credentials);
    },

    async register(data: RegisterData): Promise<AuthResponse> {
        return authApiService.register(data);
    },

    async signOut(): Promise<void> {
        return authApiService.signOut();
    },

    async getStoredUser(): Promise<User | null> {
        return authApiService.getStoredUser();
    },

    async getAllUsers(): Promise<User[]> {
        return authApiService.getAllUsers();
    },

    async updateCurrentUserPassword(currentPassword: string, newPassword: string): Promise<void> {
        return authApiService.updateCurrentUserPassword(currentPassword, newPassword);
    },
};