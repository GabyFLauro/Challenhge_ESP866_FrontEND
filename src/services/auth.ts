import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthResponse, LoginCredentials, RegisterData, User } from '../types/auth';
import { authApiService } from './authApi';
import { adminApiService, AdminUser } from './adminApi';

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

    // Funções para o admin
    async getAllUsers(): Promise<User[]> {
        return authApiService.getAllUsers();
    },

    async getAllDoctors(): Promise<User[]> {
        return authApiService.getAllDoctors();
    },

    async getPatients(): Promise<User[]> {
        const allUsers = await this.getAllUsers();
        return allUsers.filter(user => user.role === 'patient');
    },

    async deleteRegisteredUser(userId: string): Promise<void> {
        return adminApiService.deleteUser(userId);
    },

    async editRegisteredUser(userId: string, newEmail: string, newPassword: string): Promise<void> {
        const userData: any = {
            email: newEmail,
        };
        
        if (newPassword && newPassword.trim() !== '') {
            userData.senha = newPassword;
        }
        
        return adminApiService.editUser(userId, userData);
    },

    async updateCurrentUserPassword(currentPassword: string, newPassword: string): Promise<void> {
        return authApiService.updateCurrentUserPassword(currentPassword, newPassword);
    },

    // Nova função para admin alterar senha de qualquer usuário
    async changeUserPassword(userId: string, newPassword: string): Promise<void> {
        return adminApiService.changeUserPassword({ userId, newPassword });
    },
}; 