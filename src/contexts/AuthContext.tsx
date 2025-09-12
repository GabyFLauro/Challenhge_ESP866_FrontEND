import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/auth';
import { apiClient } from '../services/apiClient';
import { AuthContextData, LoginCredentials, RegisterData, User } from '../types/auth';

// Chaves de armazenamento
const STORAGE_KEYS = {
    USER: '@MedicalApp:user',
    TOKEN: '@MedicalApp:token',
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        bootstrap();
    }, []);

    const loadStoredUser = async () => {
        try {
            const storedUser = await authService.getStoredUser();
            if (storedUser) {
                setUser(storedUser);
            }
        } catch (error) {
            console.error('Erro ao carregar usuário:', error);
        } finally {
            setLoading(false);
        }
    };

    const bootstrap = async () => {
        try {
            // Restaura token, se existir
            const storedToken = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
            if (storedToken) {
                apiClient.setToken(storedToken);
            }
        } catch {}
        finally {
            await loadStoredUser();
        }
    };

    // Removido: chamada inexistente a loadRegisteredUsers

    const signIn = async (credentials: LoginCredentials) => {
        try {
            const response = await authService.signIn(credentials);
            setUser(response.user);
            await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
            await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
        } catch (error) {
            throw error;
        }
    };

    const register = async (data: RegisterData) => {
        try {
            const response = await authService.register(data);
            setUser(response.user);
            await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
            await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
        } catch (error) {
            throw error;
        }
    };

    const signOut = async () => {
        try {
            await authService.signOut();
            setUser(null);
            await AsyncStorage.removeItem(STORAGE_KEYS.USER);
            await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, signIn, register, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 