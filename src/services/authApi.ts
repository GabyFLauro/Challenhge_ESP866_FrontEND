import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '../config/api';
import { User, LoginCredentials, RegisterData, AuthResponse } from '../types/auth';

// Chaves de armazenamento
const STORAGE_KEYS = {
    USER: '@MedicalApp:user',
    TOKEN: '@MedicalApp:token',
};

/**
 * Interface para a resposta de login da API
 */
interface ApiLoginResponse {
    token: string;
}

/**
 * Interface para o usuário retornado pela API
 */
interface ApiUser {
    id: number;
    nome: string;
    email: string;
    tipoUsuario: 'ADMIN' | 'MEDICO' | 'PACIENTE';
    especialidade?: string;
}

/**
 * Serviço de autenticação que se conecta com a API do backend
 */
export const authApiService = {
    /**
     * Faz login com a API
     */
    async signIn(credentials: LoginCredentials): Promise<AuthResponse> {
        try {
            // Faz a requisição de login
            const loginResponse = await apiClient.post<ApiLoginResponse>(
                API_ENDPOINTS.LOGIN,
                {
                    email: credentials.email,
                    senha: credentials.password,
                }
            );

            // Define o token no cliente da API
            apiClient.setToken(loginResponse.token);

            // Busca os dados do usuário
            const userData = await this.getCurrentUser();

            // Salva token e usuário no AsyncStorage
            await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, loginResponse.token);
            await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));

            return {
                user: userData,
                token: loginResponse.token,
            };
        } catch (error) {
            console.error('Erro no login:', error);
            throw new Error('Email ou senha inválidos');
        }
    },

    /**
     * Registra um novo usuário (paciente)
     */
    async register(data: RegisterData): Promise<AuthResponse> {
        try {
            // Cria o usuário
            const newUser = await apiClient.post<ApiUser>(API_ENDPOINTS.REGISTER, {
                nome: data.name,
                email: data.email,
                senha: data.password,
                tipoUsuario: 'PACIENTE',
            });

            // Faz login automaticamente após o registro
            return await this.signIn({
                email: data.email,
                password: data.password,
            });
        } catch (error) {
            console.error('Erro no registro:', error);
            throw new Error('Erro ao criar conta. Verifique se o email já não está em uso.');
        }
    },

    /**
     * Obtém os dados do usuário atual baseado no token JWT
     */
    async getCurrentUser(): Promise<User> {
        try {
            // Busca o usuário atual usando o endpoint específico que utiliza o JWT
            const currentUser = await apiClient.get<ApiUser>(API_ENDPOINTS.CURRENT_USER);
            return this.mapApiUserToUser(currentUser);
        } catch (error) {
            console.error('Erro ao buscar usuário atual:', error);
            throw new Error('Erro ao carregar dados do usuário');
        }
    },

    /**
     * Busca todos os médicos
     */
    async getAllDoctors(): Promise<User[]> {
        try {
            console.log('Buscando médicos da API...');
            const doctors = await apiClient.get<ApiUser[]>(API_ENDPOINTS.DOCTORS);
            console.log('Médicos encontrados:', doctors);
            return doctors.map(this.mapApiUserToUser);
        } catch (error) {
            console.error('Erro detalhado ao buscar médicos:', error);
            // Tenta buscar todos os usuários e filtrar os médicos como fallback
            try {
                console.log('Tentando buscar usuários e filtrar médicos...');
                const allUsers = await apiClient.get<ApiUser[]>(API_ENDPOINTS.USERS);
                const doctors = allUsers.filter(user => user.tipoUsuario === 'MEDICO');
                console.log('Médicos filtrados:', doctors);
                return doctors.map(this.mapApiUserToUser);
            } catch (fallbackError) {
                console.error('Erro no fallback:', fallbackError);
                console.log('Usando dados mockados como último recurso...');
                // Fallback para dados mockados quando a API não está disponível
                return this.getMockDoctors();
            }
        }
    },

    /**
     * Dados mockados de médicos para quando a API não está disponível
     */
    getMockDoctors(): User[] {
        const mockDoctorsData = [
            { id: 1, nome: 'Dr. Carlos Silva', email: 'carlos.silva@clinica.com', tipoUsuario: 'MEDICO', especialidade: 'Cardiologia' },
            { id: 2, nome: 'Dra. Ana Oliveira', email: 'ana.oliveira@clinica.com', tipoUsuario: 'MEDICO', especialidade: 'Dermatologia' },
            { id: 3, nome: 'Dr. Roberto Santos', email: 'roberto.santos@clinica.com', tipoUsuario: 'MEDICO', especialidade: 'Ortopedia' },
            { id: 4, nome: 'Dra. Juliana Costa', email: 'juliana.costa@clinica.com', tipoUsuario: 'MEDICO', especialidade: 'Pediatria' },
            { id: 5, nome: 'Dr. Marcelo Lima', email: 'marcelo.lima@clinica.com', tipoUsuario: 'MEDICO', especialidade: 'Neurologia' },
            { id: 6, nome: 'Dra. Patricia Mendes', email: 'patricia.mendes@clinica.com', tipoUsuario: 'MEDICO', especialidade: 'Oftalmologia' },
            { id: 7, nome: 'Dr. Ricardo Ferreira', email: 'ricardo.ferreira@clinica.com', tipoUsuario: 'MEDICO', especialidade: 'Psiquiatria' },
            { id: 8, nome: 'Dra. Camila Rodrigues', email: 'camila.rodrigues@clinica.com', tipoUsuario: 'MEDICO', especialidade: 'Ginecologia' },
            { id: 9, nome: 'Dr. Felipe Alves', email: 'felipe.alves@clinica.com', tipoUsuario: 'MEDICO', especialidade: 'Urologia' },
            { id: 10, nome: 'Dra. Beatriz Santos', email: 'beatriz.santos@clinica.com', tipoUsuario: 'MEDICO', especialidade: 'Endocrinologia' }
        ];

        return mockDoctorsData.map(this.mapApiUserToUser);
    },

    /**
     * Busca médicos por especialidade
     */
    async getDoctorsBySpecialty(specialty: string): Promise<User[]> {
        try {
            const doctors = await apiClient.get<ApiUser[]>(
                `${API_ENDPOINTS.DOCTORS}?especialidade=${encodeURIComponent(specialty)}`
            );
            return doctors.map(this.mapApiUserToUser);
        } catch (error) {
            console.error('Erro ao buscar médicos por especialidade:', error);
            throw new Error('Erro ao carregar médicos da especialidade');
        }
    },

    /**
     * Busca todos os usuários (para admin)
     */
    async getAllUsers(): Promise<User[]> {
        try {
            const response = await apiClient.get<ApiUser[]>(API_ENDPOINTS.USERS);
            return response.map(this.mapApiUserToUser);
        } catch (error) {
            throw new Error('Erro ao buscar usuários');
        }
    },

    /**
     * Exclui um usuário
     */
    async deleteUser(userId: string): Promise<void> {
        try {
            await apiClient.delete(API_ENDPOINTS.USER_BY_ID(userId));
        } catch (error) {
            throw new Error('Erro ao excluir usuário');
        }
    },

    /**
     * Edita um usuário
     */
    async editUser(userId: string, userData: Partial<ApiUser>): Promise<void> {
        try {
            await apiClient.put(API_ENDPOINTS.USER_BY_ID(userId), userData);
        } catch (error) {
            throw new Error('Erro ao editar usuário');
        }
    },

    /**
     * Altera senha de um usuário
     */
    async changeUserPassword(userId: string, newPassword: string): Promise<void> {
        try {
            await apiClient.put(API_ENDPOINTS.USER_PASSWORD(userId), {
                novaSenha: newPassword,
            });
        } catch (error) {
            throw new Error('Erro ao alterar senha do usuário');
        }
    },

    /**
     * Altera senha do usuário atual
     */
    async updateCurrentUserPassword(currentPassword: string, newPassword: string): Promise<void> {
        const storedUser = await this.getStoredUser();
        if (!storedUser) {
            throw new Error('Usuário não encontrado');
        }

        try {
            await apiClient.put(API_ENDPOINTS.USER_PASSWORD(storedUser.id), {
                novaSenha: newPassword,
            });
        } catch (error) {
            throw new Error('Erro ao alterar senha');
        }
    },

    /**
     * Faz logout
     */
    async signOut(): Promise<void> {
        // Remove o token do cliente da API
        apiClient.setToken(null);
        // Limpa os dados do usuário do AsyncStorage
        await AsyncStorage.removeItem(STORAGE_KEYS.USER);
        await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
    },

    /**
     * Obtém usuário armazenado
     */
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

    /**
     * Mapeia um usuário da API para o formato usado no frontend
     */
    mapApiUserToUser(apiUser: ApiUser): User {
        // Define imagem baseada no tipo de usuário
        let image: string;
        if (apiUser.tipoUsuario === 'ADMIN') {
            // Ícone de avatar para admins - SVG simples de usuário
            image = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjUwIiBmaWxsPSIjNjY2NjY2Ii8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iMzUiIHI9IjE1IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNTAgNjVDMzUgNjUgMjUgNzUgMjUgODVWOTVINzVWODVDNzUgNzUgNjUgNjUgNTAgNjVaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K';
        } else {
            // Fotos aleatórias para médicos e pacientes
            image = `https://randomuser.me/api/portraits/${apiUser.id % 2 === 0 ? 'men' : 'women'}/${(apiUser.id % 10) + 1}.jpg`;
        }

        const baseUser = {
            id: apiUser.id.toString(),
            name: apiUser.nome,
            email: apiUser.email,
            image,
        };

        switch (apiUser.tipoUsuario) {
            case 'ADMIN':
                return {
                    ...baseUser,
                    role: 'admin' as const,
                };
            case 'MEDICO':
                return {
                    ...baseUser,
                    role: 'doctor' as const,
                    specialty: apiUser.especialidade || 'Especialidade não informada',
                };
            case 'PACIENTE':
                return {
                    ...baseUser,
                    role: 'patient' as const,
                };
            default:
                throw new Error(`Tipo de usuário inválido: ${apiUser.tipoUsuario}`);
        }
    },
};
