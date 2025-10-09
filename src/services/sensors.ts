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
  const raw = await apiClient.publicGet<any[]>('/sensors');
      const sensors: SensorDTO[] = (raw || []).map(normalizeSensor);
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
  const raw = await apiClient.publicGet<any>(`/sensors/${encodeURIComponent(id)}`);
      const sensor = normalizeSensor(raw);
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


function normalizeSensor(raw: any): SensorDTO {
  if (!raw || typeof raw !== 'object') {
    console.warn('⚠️ Sensor inválido recebido do backend:', raw);
    return {
      id: String(Date.now()),
      name: 'Desconhecido',
    };
  }

  // Suporte a chaves alternativas em PT-BR
  const id = raw.id ?? raw.codigo ?? raw.sensorId ?? raw.uuid;
  const name = raw.name ?? raw.nome ?? raw.titulo ?? `Sensor ${id ?? ''}`;
  const model = raw.model ?? raw.modelo;
  const type = raw.type ?? raw.tipo;
  const location = raw.location ?? raw.localizacao ?? raw.localização;
  const description = raw.description ?? raw.descricao ?? raw.descrição;
  const unit = raw.unit ?? raw.unidade;
  const isActive = raw.isActive ?? raw.ativo ?? raw.status === 'ATIVO' ? true : raw.status === 'INATIVO' ? false : undefined;
  const minValue = raw.minValue ?? raw.valorMinimo ?? raw.minimo;
  const maxValue = raw.maxValue ?? raw.valorMaximo ?? raw.maximo;
  const currentValue = raw.currentValue ?? raw.valorAtual ?? raw.valor ?? raw.ultimoValor;

  // lastReading pode vir como objeto ou campos soltos
  const lastReadingObj = raw.lastReading ?? raw.ultimaLeitura ?? raw.ultima_leitura;
  const lastReading: SensorDTO['lastReading'] | undefined = lastReadingObj
    ? {
        value: lastReadingObj.value ?? lastReadingObj.valor ?? currentValue,
        timestamp: lastReadingObj.timestamp ?? lastReadingObj.dataHora ?? lastReadingObj.data_hora ?? new Date().toISOString(),
      }
    : (raw.ultimoValor || raw.ultimoHorario || raw.ultimo_horario)
      ? {
          value: raw.ultimoValor ?? currentValue,
          timestamp: raw.ultimoHorario ?? raw.ultimo_horario,
        }
      : undefined;

  return {
    id: String(id ?? ''),
    name: String(name ?? 'Sensor'),
    model: model !== undefined ? String(model) : undefined,
    type: type !== undefined ? String(type) : undefined,
    location: location !== undefined ? String(location) : undefined,
    description: description !== undefined ? String(description) : undefined,
    unit: unit !== undefined ? String(unit) : undefined,
    isActive: isActive,
    minValue: typeof minValue === 'number' ? minValue : minValue !== undefined ? Number(minValue) : undefined,
    maxValue: typeof maxValue === 'number' ? maxValue : maxValue !== undefined ? Number(maxValue) : undefined,
    currentValue: typeof currentValue === 'number' ? currentValue : currentValue !== undefined ? Number(currentValue) : undefined,
    lastReading,
  };
}

