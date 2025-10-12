// Serviço para buscar histórico real dos sensores
import { apiClient } from './apiClient';

export type SensorHistoryItem = {
  dataHora: string;
  temperatura?: number;
  pressao?: number;
  vibracaoX?: number;
  vibracaoY?: number;
  vibracaoZ?: number;
  velocidade?: number;
  ativo?: boolean;
};

export const historyService = {
  async getHistory(sensorType: string, inicio?: Date, fim?: Date, limite = 100): Promise<SensorHistoryItem[]> {
    let endpoint = '';
    switch (sensorType) {
      case 'temperatura_ds18b20':
        endpoint = '/grafico/temperatura';
        break;
      case 'pressao02_hx710b':
        endpoint = '/grafico/pressao';
        break;
      case 'vibracao_vib_x':
      case 'vibracao_vib_y':
      case 'vibracao_vib_z':
        endpoint = '/grafico/vibracao';
        break;
      case 'velocidade_m_s':
        endpoint = '/grafico/velocidade';
        break;
      case 'chave_fim_de_curso':
        endpoint = '/grafico/chave-fim-curso';
        break;
      default:
        throw new Error('Tipo de sensor não suportado para histórico');
    }
    const params: Record<string, string> = {
      limite: String(limite),
    };
    if (inicio) params.inicio = inicio.toISOString();
    if (fim) params.fim = fim.toISOString();
    const query = Object.entries(params).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
    const url = `/api/sensores${endpoint}?${query}`;
    return await apiClient.publicGet<SensorHistoryItem[]>(url);
  },
};
