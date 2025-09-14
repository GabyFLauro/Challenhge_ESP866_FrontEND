import { apiClient } from './apiClient';

export interface SensorDTO {
  id: string;
  name: string;
  model?: string;
  type?: string;
  location?: string;
  description?: string;
  unit?: string;
  isActive?: boolean;
  minValue?: number;
  maxValue?: number;
  currentValue?: number;
  lastReading?: {
    value: number;
    timestamp: string;
  };
}

export const sensorsService = {
  async list(): Promise<SensorDTO[]> {
    try {
      console.log('🔍 Buscando sensores do backend real...');
      const sensors = await apiClient.get<SensorDTO[]>('/sensors');
      console.log('✅ Sensores carregados do backend:', sensors.length);
      
      // Log detalhado para debug
      console.log('📊 Estrutura dos dados do backend:');
      sensors.forEach((sensor, index) => {
        console.log(`Sensor ${index + 1}:`, {
          id: sensor.id,
          name: sensor.name,
          model: sensor.model,
          type: sensor.type,
          location: sensor.location,
          description: sensor.description,
          unit: sensor.unit,
          isActive: sensor.isActive,
          minValue: sensor.minValue,
          maxValue: sensor.maxValue,
          currentValue: sensor.currentValue,
          lastReading: sensor.lastReading
        });
      });
      
      return sensors;
    } catch (error) {
      console.log('⚠️ Erro ao buscar sensores do backend, usando dados de fallback:', error);
      console.log('📋 Usando dados de fallback com estrutura:', {
        campos: ['id', 'name', 'model', 'type', 'location', 'description', 'unit', 'isActive', 'minValue', 'maxValue', 'currentValue']
      });
      
      // Fallback com dados coerentes e mais completos
      return [
        { 
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
        },
        { 
          id: 'p2', 
          name: 'Pressão 02', 
          model: 'HX710B',
          type: 'pressure',
          location: 'Linha Secundária',
          description: 'Sensor de pressão da linha secundária',
          unit: 'bar',
          isActive: true,
          minValue: 0,
          maxValue: 8,
          currentValue: 3.8
        },
        { 
          id: 't1', 
          name: 'Temperatura', 
          model: 'DS18B20',
          type: 'temperature',
          location: 'Ambiente',
          description: 'Sensor de temperatura ambiente',
          unit: '°C',
          isActive: true,
          minValue: -10,
          maxValue: 50,
          currentValue: 23.5
        },
        { 
          id: 'l1', 
          name: 'Chave fim de curso',
          type: 'limit_switch',
          location: 'Atuador Principal',
          description: 'Chave de fim de curso do atuador',
          unit: '',
          isActive: true,
          minValue: 0,
          maxValue: 1,
          currentValue: 1
        },
        { 
          id: 'vx', 
          name: 'Vibração X', 
          model: 'vibX',
          type: 'vibration',
          location: 'Eixo X',
          description: 'Sensor de vibração no eixo X',
          unit: 'm/s²',
          isActive: true,
          minValue: 0,
          maxValue: 20,
          currentValue: 2.1
        },
        { 
          id: 'vy', 
          name: 'Vibração Y', 
          model: 'vibY',
          type: 'vibration',
          location: 'Eixo Y',
          description: 'Sensor de vibração no eixo Y',
          unit: 'm/s²',
          isActive: true,
          minValue: 0,
          maxValue: 20,
          currentValue: 1.8
        },
        { 
          id: 'vz', 
          name: 'Vibração Z', 
          model: 'vibZ',
          type: 'vibration',
          location: 'Eixo Z',
          description: 'Sensor de vibração no eixo Z',
          unit: 'm/s²',
          isActive: true,
          minValue: 0,
          maxValue: 20,
          currentValue: 3.2
        },
      ];
    }
  },

  async getById(id: string): Promise<SensorDTO | null> {
    try {
      console.log(`🔍 Buscando sensor ${id} do backend real...`);
      const sensor = await apiClient.get<SensorDTO>(`/sensors/${encodeURIComponent(id)}`);
      console.log('✅ Sensor carregado do backend:', sensor);
      
      // Log detalhado para debug
      console.log('📊 Estrutura do sensor específico:', {
        id: sensor.id,
        name: sensor.name,
        model: sensor.model,
        type: sensor.type,
        location: sensor.location,
        description: sensor.description,
        unit: sensor.unit,
        isActive: sensor.isActive,
        minValue: sensor.minValue,
        maxValue: sensor.maxValue,
        currentValue: sensor.currentValue,
        lastReading: sensor.lastReading
      });
      
      return sensor;
    } catch (error) {
      console.log(`⚠️ Erro ao buscar sensor ${id} do backend, usando fallback:`, error);
      // Fallback: busca na lista local
      const sensors = await this.list();
      return sensors.find(s => s.id === id) || null;
    }
  },
};


