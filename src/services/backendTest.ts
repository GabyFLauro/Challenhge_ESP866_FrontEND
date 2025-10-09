import { apiClient } from './apiClient';

export interface BackendStatus {
  isConnected: boolean;
  message: string;
  url: string;
  timestamp: string;
}

export const backendTestService = {
  /**
   * Testa a conectividade com o backend
   */
  async testConnection(): Promise<BackendStatus> {
    try {
      console.log('🔍 Iniciando teste de conectividade com backend...');
      
      // Teste básico de conectividade
      const connectionTest = await apiClient.testConnection();
      
      const status: BackendStatus = {
        isConnected: connectionTest.success,
        message: connectionTest.message,
        url: connectionTest.url,
        timestamp: new Date().toISOString()
      };
      
      if (status.isConnected) {
        console.log('✅ Backend está conectado e funcionando');
      } else {
        console.log('⚠️ Backend não está acessível:', status.message);
      }
      
      return status;
    } catch (error) {
      console.error('❌ Erro ao testar conectividade:', error);
      return {
        isConnected: false,
        message: error instanceof Error ? error.message : 'Erro desconhecido',
        url: apiClient.getBaseURL ? apiClient.getBaseURL() : 'URL não configurada',
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Testa endpoints específicos de sensores
   */
  async testSensorsEndpoints(): Promise<{ sensors: boolean; readings: boolean }> {
    const results = { sensors: false, readings: false };
    
    try {
      // Teste endpoint de sensores
      try {
        await apiClient.get('/sensors');
        results.sensors = true;
        console.log('✅ Endpoint /sensors está funcionando');
      } catch (error) {
        console.log('⚠️ Endpoint /sensors não está funcionando:', error);
      }
      
      // Teste endpoint de leituras
      try {
        await apiClient.get('/readings');
        results.readings = true;
        console.log('✅ Endpoint /readings está funcionando');
      } catch (error) {
        console.log('⚠️ Endpoint /readings não está funcionando:', error);
      }
      
    } catch (error) {
      console.error('❌ Erro ao testar endpoints:', error);
    }
    
    return results;
  },

  /**
   * Executa teste completo do backend
   */
  async runFullTest(): Promise<{
    connection: BackendStatus;
    endpoints: { sensors: boolean; readings: boolean };
  }> {
    console.log('🚀 Iniciando teste completo do backend...');
    
    const connection = await this.testConnection();
    const endpoints = await this.testSensorsEndpoints();
    
    console.log('📊 Resultado do teste completo:', {
      connection: connection.isConnected,
      sensors: endpoints.sensors,
      readings: endpoints.readings
    });
    
    return { connection, endpoints };
  }
};
