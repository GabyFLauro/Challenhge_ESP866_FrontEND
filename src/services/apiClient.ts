import { API_CONFIG } from '../config/api';
import { Platform } from 'react-native';
import { getApiBaseUrl } from './runtimeConfig';

/**
 * Cliente HTTP para comunicação com a API
 */
class ApiClient {
  private baseURL: string;
  private timeout: number;
  private defaultHeaders: Record<string, string>;
  private token: string | null = null;

  constructor() {
    // Ajuste automático de host para Android Emulator (localhost -> 10.0.2.2)
    if (Platform.OS === 'android' && API_CONFIG.BASE_URL.includes('localhost')) {
      this.baseURL = API_CONFIG.BASE_URL.replace('localhost', '10.0.2.2');
    } else {
      this.baseURL = API_CONFIG.BASE_URL;
    }
    this.timeout = API_CONFIG.TIMEOUT;
    this.defaultHeaders = { ...API_CONFIG.DEFAULT_HEADERS };
  }

  /**
   * Carrega a baseURL salva em runtime (AsyncStorage) e aplica se existir
   */
  async loadRuntimeBaseUrl(): Promise<void> {
    try {
      const runtime = await getApiBaseUrl();
      if (runtime && runtime.trim().length > 0) {
        this.setBaseURL(runtime.trim());
      }
    } catch (e) {
      // ignore
    }
  }

  /**
   * Define o token de autenticação
   */
  setToken(token: string | null) {
    this.token = token;
  }

  /**
   * Atualiza a URL base da API em tempo de execução
   */
  setBaseURL(url: string) {
    if (url && url.trim().length > 0) {
      this.baseURL = url.trim();
    }
  }

  /**
   * Retorna a baseURL atual (getter público seguro para uso externo)
   */
  getBaseURL(): string {
    return this.baseURL;
  }

  /**
   * Obtém os headers para a requisição
   */
  private getHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    const headers = { ...this.defaultHeaders, ...customHeaders };
    
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  /**
   * Faz uma requisição HTTP
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = this.getHeaders(options.headers as Record<string, string>);

    const config: RequestInit = {
      ...options,
      headers,
      signal: AbortSignal.timeout(this.timeout),
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP ${response.status}: ${response.statusText}`);
      }

      // Se a resposta não tem conteúdo, retorna um objeto vazio
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Timeout: A requisição demorou muito para responder');
        }
        throw error;
      }
      throw new Error('Erro desconhecido na requisição');
    }
  }

  /**
   * Requisição GET
   */
  async get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'GET',
      headers,
    });
  }

  /**
   * Requisição GET pública que não envia o header Authorization
   * Útil para recursos públicos que devem ser iguais para todos os usuários
   */
  async publicGet<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const finalHeaders = { ...this.defaultHeaders, ...headers };

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: finalHeaders,
        signal: AbortSignal.timeout(this.timeout),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Timeout: A requisição demorou muito para responder');
        }
        throw error;
      }
      throw new Error('Erro desconhecido na requisição');
    }
  }

  /**
   * Requisição POST
   */
  async post<T>(
    endpoint: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * Requisição PUT
   */
  async put<T>(
    endpoint: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * Requisição DELETE
   */
  async delete<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      headers,
    });
  }

  /**
   * Testa a conectividade com o backend
   */
  async testConnection(): Promise<{ success: boolean; message: string; url: string }> {
    const url = `${this.baseURL}/health`;
    try {
      console.log(`🔍 Testando conectividade com backend: ${url}`);
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
        signal: AbortSignal.timeout(5000), // Timeout de 5 segundos para teste
      });
      
      if (response.ok) {
        console.log('✅ Backend está acessível');
        return { success: true, message: 'Backend acessível', url };
      } else {
        console.log(`⚠️ Backend respondeu com status: ${response.status}`);
        return { success: false, message: `Backend respondeu com status ${response.status}`, url };
      }
    } catch (error) {
      console.log('❌ Erro ao conectar com backend:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Erro desconhecido', 
        url 
      };
    }
  }
}

// Instância singleton do cliente
export const apiClient = new ApiClient();
