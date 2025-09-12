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

export const readingsService = {
  async list(): Promise<ReadingDTO[]> {
    try {
      return await apiClient.get<ReadingDTO[]>(READINGS_BASE);
    } catch (e) {
      // Fallback: retorna lista vazia quando o endpoint não existir
      return [];
    }
  },

  async listBySensor(sensorId: string): Promise<ReadingDTO[]> {
    try {
      // Backend expõe GET /readings/{sensorId}
      return await apiClient.get<ReadingDTO[]>(`${READINGS_BASE}/${encodeURIComponent(sensorId)}`);
    } catch (e) {
      return [];
    }
  },

  async create(data: CreateReadingDTO): Promise<ReadingDTO> {
    return apiClient.post<ReadingDTO>(READINGS_BASE, data);
  },
};


