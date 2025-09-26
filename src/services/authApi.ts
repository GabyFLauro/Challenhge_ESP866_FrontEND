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
    tipo: 'ADMIN' | 'MEDICO' | 'PACIENTE';
}

// Função utilitária para extrair o id do usuário (sub) do token JWT
function getUserIdFromToken(token: string): string | null {
    try {
        const base64Url = token.split('.')[1];
        // Decodificação base64 compatível cross-platform
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
        let decoded: string;
        if (typeof Buffer !== 'undefined') {
            // Node.js/React Native
            decoded = Buffer.from(padded, 'base64').toString('utf-8');
        } else if (typeof window !== 'undefined' && window.atob) {
            // Browser
            decoded = decodeURIComponent(Array.prototype.map.call(window.atob(padded), (c: string) =>
                '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
            ).join(''));
        } else {
            throw new Error('Base64 decode not supported');
        }
        const payload = JSON.parse(decoded);
        return payload.sub || null;
    } catch {
        return null;
    }
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
            console.log('Tentando login com:', { email: credentials.email, senha: credentials.password });
            console.log('Corpo da requisição (login):', {
                email: credentials.email,
                senha: credentials.password,
            });
            // Faz a requisição de login
            const loginResponse = await apiClient.post<ApiLoginResponse>(
                API_ENDPOINTS.LOGIN,
                {
                    email: credentials.email,
                    senha: credentials.password,
                }
            );
            console.log('Resposta do backend (login):', loginResponse);

            // Salva token e define no cliente da API antes de buscar o usuário
            await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, loginResponse.token);
            apiClient.setToken(loginResponse.token);

            // Agora busca os dados do usuário logado
            const userData = await this.getCurrentUser();

            // Salva usuário no AsyncStorage
            await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));

            return {
                user: userData,
                token: loginResponse.token,
            };
        } catch (error: any) {
            if (error.response?.data) {
                console.error('Erro detalhado do backend (login):', error.response.data);
            } else if (error.message) {
                console.error('Erro detalhado do backend (login):', error.message);
            }
            const message = error instanceof Error && error.message ? error.message : 'Email ou senha inválidos';
            console.error('Erro no login:', message);
            throw new Error(message);
        }
    },

    /**
     * Registra um novo usuário (paciente)
     */
    async register(data: RegisterData): Promise<AuthResponse> {
        try {
            // Cria o usuário
            await apiClient.post<ApiUser>(API_ENDPOINTS.REGISTER, {
                nome: data.name,
                email: data.email,
                senha: data.password
            });

            // Faz login automaticamente após o registro
            return await this.signIn({
                email: data.email,
                password: data.password,
            });
        } catch (error: any) {
            if (error?.response?.data) {
                console.error('Erro detalhado do backend:', error.response.data);
            }
            const message = error instanceof Error && error.message ? error.message : 'Erro ao criar conta. Verifique se o email já não está em uso.';
            console.error('Erro no registro:', message);
            throw new Error(message);
        }
    },

    /**
     * Obtém os dados do usuário atual baseado no token JWT
     */
    async getCurrentUser(): Promise<User> {
        try {
            // Recupera o token salvo
            const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
            if (!token) throw new Error('Token não encontrado');
            // Decodifica o token JWT para extrair o id do usuário (sub)
            const userId = getUserIdFromToken(token);
            if (!userId) throw new Error('ID do usuário não encontrado no token');
            // Busca o usuário pelo ID
            const apiUser = await apiClient.get<ApiUser>(API_ENDPOINTS.USER_BY_ID(userId));
            return this.mapApiUserToUser(apiUser);
        } catch (error) {
            console.error('Erro ao buscar usuário atual:', error);
            throw new Error('Erro ao carregar dados do usuário');
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
            console.error('Erro ao buscar usuários:', error);
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
            console.error('Erro ao excluir usuário:', error);
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
            console.error('Erro ao editar usuário:', error);
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
            console.error('Erro ao alterar senha do usuário:', error);
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
            console.error('Erro ao alterar senha:', error);
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
        if (apiUser.tipo === 'ADMIN') {
            // Ícone de avatar para admins - SVG simples de usuário
            image = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjUwIiBmaWxsPSIjNjY2NjY2Ii8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iMzUiIHI9IjE1IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNTAgNjVDMzUgNjUgMjUgNzUgMjUgODVWOTVINzVWODVDNzUgNzUgNjUgNjUgNTAgNjVaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K';
        } else {
            // Foto aleatória para usuários comuns
            image = `https://randomuser.me/api/portraits/${apiUser.id % 2 === 0 ? 'men' : 'women'}/${(apiUser.id % 10) + 1}.jpg`;
        }

        const baseUser = {
            id: apiUser.id.toString(),
            name: apiUser.nome,
            email: apiUser.email,
            image,
        };

        if (apiUser.tipo === 'ADMIN') {
            return { ...baseUser, role: 'admin' } as User;
        }
        return { ...baseUser, role: 'user' } as User;
    },
};
