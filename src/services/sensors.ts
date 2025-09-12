import { apiClient } from './apiClient';

export interface SensorDTO {
  id: string;
  name: string;
  model?: string;
}

export const sensorsService = {
  async list(): Promise<SensorDTO[]> {
    try {
      return await apiClient.get<SensorDTO[]>('/sensors');
    } catch {
      // Fallback com dados coerentes
      return [
        { id: 'p1', name: 'Pressão 01', model: 'XGZP701DB1R' },
        { id: 'p2', name: 'Pressão 02', model: 'HX710B' },
        { id: 't1', name: 'Temperatura', model: 'DS18B20' },
        { id: 'l1', name: 'Chave fim de curso' },
        { id: 'vx', name: 'Vibração X', model: 'vibX' },
        { id: 'vy', name: 'Vibração Y', model: 'vibY' },
        { id: 'vz', name: 'Vibração Z', model: 'vibZ' },
      ];
    }
  },
};


