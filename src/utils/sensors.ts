import { SensorDTO } from '../services/sensors';
import { ReadingDTO } from '../services/readings';
import { classifyPressure, classifyTemperature, classifyVibration } from './alerts';

export type SensorStatus = 'ok' | 'warning' | 'error';

function resolveKind(sensor?: SensorDTO | null): 'pressure' | 'temperature' | 'vibration' | 'limit_switch' | 'other' {
  if (!sensor) return 'other';
  const id = (sensor.id || '').toLowerCase();
  const t = (sensor.type || '').toLowerCase();
  const u = (sensor.unit || '').toLowerCase();
  if (t.includes('limit') || t.includes('switch')) return 'limit_switch';
  if (t.includes('press') || u.includes('bar') || u.includes('pa') || ['p1','p2'].includes(id)) return 'pressure';
  if (t.includes('temp') || u.includes('°c') || u === 'c' || id === 't1') return 'temperature';
  if (t.includes('vib') || u.includes('mm/s') || ['vx','vy','vz'].includes(id)) return 'vibration';
  return 'other';
}

function mapAlertLevelToStatus(level: 'normal' | 'alerta' | 'falha'): SensorStatus {
  if (level === 'normal') return 'ok';
  if (level === 'alerta') return 'warning';
  return 'error';
}

export function mapSensorListToView(items: SensorDTO[]): Array<{
  id: string;
  name: string;
  model?: string;
  type?: string;
  location?: string;
  description?: string;
  unit?: string;
  currentValue?: number;
  minValue?: number;
  maxValue?: number;
  isActive?: boolean;
  status: SensorStatus;
  lastUpdate: string;
}> {
  const now = new Date().toLocaleString();
  return items.map((sensor) => ({
    id: sensor.id,
    name: sensor.model ? `${sensor.name} (${sensor.model})` : sensor.name,
    model: sensor.model,
    type: sensor.type,
    location: sensor.location,
    description: sensor.description,
    unit: sensor.unit,
    currentValue: sensor.currentValue,
    minValue: sensor.minValue,
    maxValue: sensor.maxValue,
    isActive: sensor.isActive,
    status: getSensorStatusFromSummary(sensor),
    lastUpdate: sensor.lastReading?.timestamp ? new Date(sensor.lastReading.timestamp).toLocaleString() : now,
  }));
}

export function getSensorStatusFromSummary(sensor: SensorDTO): SensorStatus {
  if (sensor.isActive === false) return 'error';
  const kind = resolveKind(sensor);
  const val = sensor.currentValue;
  if (val === undefined || val === null) return 'ok';

  if (kind === 'pressure') return mapAlertLevelToStatus(classifyPressure(Number(val)).level);
  if (kind === 'temperature') return mapAlertLevelToStatus(classifyTemperature(Number(val)).level);
  if (kind === 'vibration') return mapAlertLevelToStatus(classifyVibration(Number(val)).level);

  // fallback antigo
  if (sensor.maxValue !== undefined) {
    return Number(val) > sensor.maxValue * 0.9 ? 'warning' : 'ok';
  }
  return 'ok';
}

export function computeDetailStatus(sensor: SensorDTO | null, readings: ReadingDTO[]): SensorStatus {
  if (readings.length === 0) return 'ok';
  const sorted = sortReadingsByTimestampDesc(readings);
  const last = sorted[0];
  if (!last) return 'ok';

  const kind = resolveKind(sensor || undefined);
  if (kind === 'limit_switch') {
    return last.value === 1 ? 'ok' : 'warning';
  }

  const v = Number(last.value);
  if (isNaN(v)) return 'warning';

  if (kind === 'pressure') return mapAlertLevelToStatus(classifyPressure(v).level);
  if (kind === 'temperature') return mapAlertLevelToStatus(classifyTemperature(v).level);
  if (kind === 'vibration') return mapAlertLevelToStatus(classifyVibration(v).level);

  // fallback genérico se tipo desconhecido
  return v >= 80 ? 'error' : v >= 60 ? 'warning' : 'ok';
}

export function sortReadingsByTimestampAsc(readings: ReadingDTO[]): ReadingDTO[] {
  return [...readings].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}

export function sortReadingsByTimestampDesc(readings: ReadingDTO[]): ReadingDTO[] {
  return [...readings].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function buildChartData(readings: ReadingDTO[], maxPoints: number = 8): {
  labels: string[];
  datasets: { data: number[] }[];
} {
  const sorted = sortReadingsByTimestampAsc(readings);
  const slice = sorted.slice(-maxPoints);
  const labels = slice.map((r, index) => {
    const date = new Date(r.timestamp);
    if (slice.length <= 4) {
      return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    }
    return `${date.getMinutes().toString().padStart(2, '0')}`;
  });
  const data = slice.map((r) => r.value);
  return { 
    labels, 
    datasets: [{ 
      data
    }] 
  };
}


