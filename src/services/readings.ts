import { apiClient } from './apiClient';
// Endpoints de leituras conforme objetivo da sprint
// Note: BASE_URL já inclui /api; aqui mantemos apenas o path relativo
const READINGS_BASE = '/readings';

export interface ReadingDTO {
  id: string;
  sensorId: string;
  value: number;
  timestamp: string;
}

export interface CreateReadingDTO {
  sensorId: string;
  value: number;
}

// Função para gerar dados de fallback realistas
const generateMockReadings = (sensorId: string, count: number = 10): ReadingDTO[] => {
  const now = new Date();
  const readings: ReadingDTO[] = [];
  
  // Função para gerar valores baseados no tipo de sensor
  const getValueForSensor = (sensorId: string, index: number): number => {
    const baseTime = now.getTime() - (count - index) * 15 * 60 * 1000; // 15 min entre leituras
    const timeVariation = Math.sin((baseTime / 1000) * 0.01) * 0.3; // Variação temporal
    
    switch (sensorId) {
      case 'p1': // Pressão 01
        return 4.5 + timeVariation + Math.random() * 0.5;
      case 'p2': // Pressão 02
        return 3.2 + timeVariation + Math.random() * 0.4;
      case 't1': // Temperatura
        return 22 + timeVariation + Math.random() * 2;
      case 'l1': // Chave fim de curso
        return Math.random() < 0.8 ? 1 : 0;
      case 'vx': // Vibração X
        return 1.5 + Math.abs(timeVariation) + Math.random() * 1.5;
      case 'vy': // Vibração Y
        return 1.2 + Math.abs(timeVariation) + Math.random() * 1.2;
      case 'vz': // Vibração Z
        return 2.1 + Math.abs(timeVariation) + Math.random() * 1.8;
      default:
        return 50 + timeVariation * 10 + Math.random() * 20;
    }
  };

  for (let i = 0; i < count; i++) {
    const timestamp = new Date(now.getTime() - (count - i) * 15 * 60 * 1000);
    readings.push({
      id: `reading_${sensorId}_${i}`,
      sensorId,
      value: getValueForSensor(sensorId, i),
      timestamp: timestamp.toISOString()
    });
  }

  return readings;
};

export const readingsService = {
  async list(): Promise<ReadingDTO[]> {
    try {
      console.log('🔍 Buscando todas as leituras do backend real...');
      const raw = await apiClient.get<any[]>(READINGS_BASE);
      const readings = (raw || []).map(normalizeReading);
      console.log('✅ Leituras carregadas do backend:', readings.length);
      return readings;
    } catch (e) {
      console.log('⚠️ Erro ao buscar leituras do backend, usando dados de fallback:', e);
      // Fallback: retorna dados simulados para todos os sensores
      const allReadings: ReadingDTO[] = [];
      const sensorIds = ['p1', 'p2', 't1', 'l1', 'vx', 'vy', 'vz'];
      sensorIds.forEach(sensorId => {
        allReadings.push(...generateMockReadings(sensorId, 10));
      });
      return allReadings;
    }
  },

  async listBySensor(sensorId: string): Promise<ReadingDTO[]> {
    try {
      console.log(`🔍 Buscando leituras para sensor ${sensorId} do backend real...`);
      const raw = await apiClient.get<any[]>(`${READINGS_BASE}/${encodeURIComponent(sensorId)}`);
      const readings = (raw || []).map(normalizeReading);
      console.log(`✅ Leituras do sensor ${sensorId} carregadas do backend:`, readings.length);
      return readings;
    } catch (e) {
      console.log(`⚠️ Erro ao buscar leituras do sensor ${sensorId} do backend, usando dados de fallback:`, e);
      // Fallback: retorna dados simulados para o sensor específico
      return generateMockReadings(sensorId, 8);
    }
  },

  async create(data: CreateReadingDTO): Promise<ReadingDTO> {
    try {
      console.log('📝 Criando nova leitura no backend real:', data);
      const raw = await apiClient.post<any>(READINGS_BASE, data);
      const reading = normalizeReading(raw);
      console.log('✅ Leitura criada com sucesso no backend:', reading);
      return reading;
    } catch (e) {
      console.log('⚠️ Erro ao criar leitura no backend, simulando criação:', e);
      // Fallback: simula criação de leitura
      const mockReading: ReadingDTO = {
        id: `reading_${data.sensorId}_${Date.now()}`,
        sensorId: data.sensorId,
        value: data.value,
        timestamp: new Date().toISOString()
      };
      return mockReading;
    }
  },
};

function normalizeReading(raw: any): ReadingDTO {
  if (!raw || typeof raw !== 'object') {
    console.warn('⚠️ Leitura inválida recebida do backend:', raw);
    return {
      id: `reading_${Date.now()}`,
      sensorId: 'unknown',
      value: 0,
      timestamp: new Date().toISOString(),
    };
  }

  const id = raw.id ?? raw.codigo ?? raw.uuid ?? `${raw.sensorId ?? raw.sensor_id ?? 's'}_${raw.timestamp ?? raw.dataHora ?? raw.data_hora ?? Date.now()}`;
  const sensorId = raw.sensorId ?? raw.sensor_id ?? raw.idSensor ?? raw.codigoSensor;
  const value = raw.value ?? raw.valor ?? raw.medida ?? raw.leitura;
  const timestamp = raw.timestamp ?? raw.dataHora ?? raw.data_hora ?? raw.createdAt ?? raw.criadoEm;

  return {
    id: String(id),
    sensorId: String(sensorId ?? 'unknown'),
    value: typeof value === 'number' ? value : value !== undefined ? Number(value) : 0,
    timestamp: new Date(timestamp ?? Date.now()).toISOString(),
  };
}


