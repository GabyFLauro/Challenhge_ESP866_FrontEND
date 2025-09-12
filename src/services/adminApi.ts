import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '../config/api';

// Interface para usuários retornados da API
interface ApiUser {
  id: number;
  nome: string;
  email: string;
  tipo: 'ADMIN' | 'PACIENTE';
  especialidade?: string;
}

// Interface para usuário no frontend
export interface AdminUser {
  image: string | undefined;
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

// Interface para alteração de senha
export interface ChangePasswordData {
  userId: string;
  newPassword: string;
}

export const adminApiService = {
  // Listar todos os usuários (apenas admin)
  async getAllUsers(): Promise<AdminUser[]> {
    try {
      const users = await apiClient.get<ApiUser[]>(API_ENDPOINTS.USERS);
      return users.map(this.mapApiUserToAdminUser);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      throw new Error('Erro ao buscar usuários');
    }
  },

  // Alterar senha de um usuário (apenas admin)
  async changeUserPassword(data: ChangePasswordData): Promise<void> {
    try {
      await apiClient.put(`${API_ENDPOINTS.USER_PASSWORD(data.userId)}`, {
        novaSenha: data.newPassword
      });
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      throw new Error('Erro ao alterar senha do usuário');
    }
  },

  // Editar usuário (apenas admin)
  async editUser(userId: string, userData: Partial<ApiUser>): Promise<void> {
    try {
      await apiClient.put(API_ENDPOINTS.USER_BY_ID(userId), userData);
    } catch (error) {
      console.error('Erro ao editar usuário:', error);
      throw new Error('Erro ao editar usuário');
    }
  },

  // Excluir usuário (apenas admin)
  async deleteUser(userId: string): Promise<void> {
    try {
      await apiClient.delete(API_ENDPOINTS.USER_BY_ID(userId));
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      throw new Error('Erro ao excluir usuário');
    }
  },

  // Buscar usuário por ID (apenas admin)
  async getUserById(userId: string): Promise<AdminUser> {
    try {
      const user = await apiClient.get<ApiUser>(API_ENDPOINTS.USER_BY_ID(userId));
      return this.mapApiUserToAdminUser(user);
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      throw new Error('Erro ao buscar usuário');
    }
  },

  // Mapear usuário da API para formato do frontend
  mapApiUserToAdminUser(apiUser: ApiUser): AdminUser {
    const baseUser = {
      id: apiUser.id.toString(),
      name: apiUser.nome,
      email: apiUser.email,
      image: undefined as string | undefined,
    };

    if (apiUser.tipo === 'ADMIN') {
      return { ...baseUser, role: 'admin' };
    }
    return { ...baseUser, role: 'user' };
  },
};
