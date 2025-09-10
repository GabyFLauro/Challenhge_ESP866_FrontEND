import { apiClient } from './apiClient';

// Ajuste aqui caso o backend use um caminho diferente
const READINGS_BASE = '/api/readings';

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
    return apiClient.get<ReadingDTO[]>(READINGS_BASE);
  },

  async listBySensor(sensorId: string): Promise<ReadingDTO[]> {
    return apiClient.get<ReadingDTO[]>(`${READINGS_BASE}?sensorId=${encodeURIComponent(sensorId)}`);
  },

  async create(data: CreateReadingDTO): Promise<ReadingDTO> {
    return apiClient.post<ReadingDTO>(READINGS_BASE, data);
  },
};


