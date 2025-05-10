import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthResponse, LoginCredentials, RegisterData, User } from '../types/auth';

// Chaves de armazenamento
const STORAGE_KEYS = {
    USER: '@MedicalApp:user',
    TOKEN: '@MedicalApp:token',
    REGISTERED_USERS: '@MedicalApp:registeredUsers',
};

// Médicos mockados que podem fazer login
const mockDoctors = [
    {
        id: '1',
        name: 'Dr. João Silva',
        email: 'joao@example.com',
        role: 'doctor' as const,
        specialty: 'Cardiologia',
        image: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    {
        id: '2',
        name: 'Dra. Maria Santos',
        email: 'maria@example.com',
        role: 'doctor' as const,
        specialty: 'Pediatria',
        image: 'https://randomuser.me/api/portraits/women/1.jpg',
    },
    {
        id: '3',
        name: 'Dr. Pedro Oliveira',
        email: 'pedro@example.com',
        role: 'doctor' as const,
        specialty: 'Ortopedia',
        image: 'https://randomuser.me/api/portraits/men/2.jpg',
    },
];

// Admin mockado
const mockAdmin = {
    id: 'admin',
    name: 'Administrador',
    email: 'admin@example.com',
    role: 'admin' as const,
    image: 'https://randomuser.me/api/portraits/men/3.jpg',
};

// Usuário comum mockado
const mockUser = {
    id: 'user',
    name: 'Fábio',
    email: 'fabio@email.com',
    role: 'patient' as const,
    image: 'https://randomuser.me/api/portraits/men/4.jpg',
};

// Lista de usuários cadastrados (pacientes)
let registeredUsers: (User & { password: string })[] = [];

export const authService = {
    async signIn(credentials: LoginCredentials): Promise<AuthResponse> {
        // Verifica se é o admin
        if (credentials.email === mockAdmin.email && credentials.password === '123456') {
            return {
                user: mockAdmin,
                token: 'admin-token',
            };
        }

        // Verifica se é o usuário comum
        if (credentials.email === mockUser.email && credentials.password === '123456') {
            return {
                user: mockUser,
                token: 'user-token',
            };
        }

        throw new Error('Email ou senha inválidos');
    },

    async register(data: RegisterData): Promise<AuthResponse> {
        throw new Error('Registro de novos usuários não está disponível');
    },

    async signOut(): Promise<void> {
        // Limpa os dados do usuário do AsyncStorage
        await AsyncStorage.removeItem(STORAGE_KEYS.USER);
        await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
    },

    async getStoredUser(): Promise<User | null> {
        try {
            const userJson = await AsyncStorage.getItem(STORAGE_KEYS.USER);
            if (userJson) {
                return JSON.parse(userJson);
            }
            return null;
        } catch (error) {
            console.error('Erro ao obter usuário armazenado:', error);
            return null;
        }
    },

    // Funções para o admin
    async getAllUsers(): Promise<User[]> {
        return [...mockDoctors, ...registeredUsers];
    },

    async getAllDoctors(): Promise<User[]> {
        return mockDoctors;
    },

    async getPatients(): Promise<User[]> {
        return registeredUsers;
    },

    // Função para carregar usuários registrados ao iniciar o app
    async loadRegisteredUsers(): Promise<void> {
        try {
            const usersJson = await AsyncStorage.getItem(STORAGE_KEYS.REGISTERED_USERS);
            if (usersJson) {
                registeredUsers = JSON.parse(usersJson);
            }
        } catch (error) {
            console.error('Erro ao carregar usuários registrados:', error);
        }
    },
}; 