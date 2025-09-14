import { apiClient } from './apiClient';

export interface BackendSensorStructure {
  rawData: any;
  fields: string[];
  sampleSensor: any;
  differences: string[];
}

export interface DataComparisonResult {
  backendStructure: BackendSensorStructure;
  frontendStructure: {
    expectedFields: string[];
    sampleData: any;
  };
  recommendations: string[];
}

export const backendInvestigationService = {
  /**
   * Investiga a estrutura real dos dados do backend
   */
  async investigateBackendStructure(): Promise<BackendSensorStructure> {
    try {
      console.log('🔍 Investigando estrutura real do backend...');
      
      // Buscar dados brutos do backend
      const rawData = await apiClient.get<any[]>('/sensors');
      
      if (!rawData || rawData.length === 0) {
        throw new Error('Nenhum dado retornado pelo backend');
      }
      
      // Analisar estrutura do primeiro sensor
      const sampleSensor = rawData[0];
      const fields = Object.keys(sampleSensor);
      
      console.log('📊 Estrutura encontrada no backend:');
      console.log('Campos disponíveis:', fields);
      console.log('Sensor de exemplo:', sampleSensor);
      
      // Identificar campos que podem estar diferentes
      const expectedFields = [
        'id', 'name', 'model', 'type', 'location', 
        'description', 'unit', 'isActive', 'minValue', 
        'maxValue', 'currentValue', 'lastReading'
      ];
      
      const differences = expectedFields.filter(field => !fields.includes(field));
      
      return {
        rawData,
        fields,
        sampleSensor,
        differences
      };
      
    } catch (error) {
      console.error('❌ Erro ao investigar estrutura do backend:', error);
      throw error;
    }
  },

  /**
   * Compara estrutura do backend com frontend
   */
  async compareStructures(): Promise<DataComparisonResult> {
    try {
      console.log('🔍 Comparando estruturas backend vs frontend...');
      
      const backendStructure = await this.investigateBackendStructure();
      
      const frontendStructure = {
        expectedFields: [
          'id', 'name', 'model', 'type', 'location', 
          'description', 'unit', 'isActive', 'minValue', 
          'maxValue', 'currentValue', 'lastReading'
        ],
        sampleData: {
          id: 'p1',
          name: 'Pressão 01',
          model: 'XGZP701DB1R',
          type: 'pressure',
          location: 'Linha Principal',
          description: 'Sensor de pressão da linha principal',
          unit: 'bar',
          isActive: true,
          minValue: 0,
          maxValue: 10,
          currentValue: 5.2
        }
      };
      
      // Gerar recomendações
      const recommendations: string[] = [];
      
      if (backendStructure.differences.length > 0) {
        recommendations.push(`Campos faltando no backend: ${backendStructure.differences.join(', ')}`);
      }
      
      // Verificar campos extras no backend
      const extraFields = backendStructure.fields.filter(field => 
        !frontendStructure.expectedFields.includes(field)
      );
      
      if (extraFields.length > 0) {
        recommendations.push(`Campos extras no backend: ${extraFields.join(', ')}`);
      }
      
      // Verificar tipos de dados
      const sampleBackend = backendStructure.sampleSensor;
      const sampleFrontend = frontendStructure.sampleData;
      
      frontendStructure.expectedFields.forEach(field => {
        if (sampleBackend[field] !== undefined && sampleFrontend[field] !== undefined) {
          const backendType = typeof sampleBackend[field];
          const frontendType = typeof sampleFrontend[field];
          
          if (backendType !== frontendType) {
            recommendations.push(`Tipo diferente para campo '${field}': backend=${backendType}, frontend=${frontendType}`);
          }
        }
      });
      
      console.log('📋 Recomendações geradas:', recommendations);
      
      return {
        backendStructure,
        frontendStructure,
        recommendations
      };
      
    } catch (error) {
      console.error('❌ Erro ao comparar estruturas:', error);
      throw error;
    }
  },

  /**
   * Testa diferentes endpoints para encontrar a estrutura correta
   */
  async testDifferentEndpoints(): Promise<{
    sensors: any;
    sensorsWithReadings: any;
    health: any;
  }> {
    const results: any = {};
    
    try {
      // Testar endpoint básico
      console.log('🔍 Testando endpoint /sensors...');
      results.sensors = await apiClient.get('/sensors');
      console.log('✅ /sensors funcionando');
    } catch (error) {
      console.log('❌ /sensors falhou:', error);
      results.sensors = null;
    }
    
    try {
      // Testar endpoint com leituras
      console.log('🔍 Testando endpoint /sensors/with-readings...');
      results.sensorsWithReadings = await apiClient.get('/sensors/with-readings');
      console.log('✅ /sensors/with-readings funcionando');
    } catch (error) {
      console.log('❌ /sensors/with-readings falhou:', error);
      results.sensorsWithReadings = null;
    }
    
    try {
      // Testar health check
      console.log('🔍 Testando endpoint /health...');
      results.health = await apiClient.get('/health');
      console.log('✅ /health funcionando');
    } catch (error) {
      console.log('❌ /health falhou:', error);
      results.health = null;
    }
    
    return results;
  },

  /**
   * Executa investigação completa
   */
  async runFullInvestigation(): Promise<{
    comparison: DataComparisonResult;
    endpoints: any;
    summary: string;
  }> {
    console.log('🚀 Iniciando investigação completa do backend...');
    
    try {
      const comparison = await this.compareStructures();
      const endpoints = await this.testDifferentEndpoints();
      
      const summary = `
📊 RESUMO DA INVESTIGAÇÃO:

Backend Fields: ${comparison.backendStructure.fields.join(', ')}
Frontend Expected: ${comparison.frontendStructure.expectedFields.join(', ')}
Diferenças: ${comparison.backendStructure.differences.join(', ') || 'Nenhuma'}

Endpoints Testados:
- /sensors: ${endpoints.sensors ? '✅' : '❌'}
- /sensors/with-readings: ${endpoints.sensorsWithReadings ? '✅' : '❌'}
- /health: ${endpoints.health ? '✅' : '❌'}

Recomendações:
${comparison.recommendations.map(r => `- ${r}`).join('\n')}
      `;
      
      console.log(summary);
      
      return {
        comparison,
        endpoints,
        summary
      };
      
    } catch (error) {
      console.error('❌ Erro na investigação completa:', error);
      throw error;
    }
  }
};
