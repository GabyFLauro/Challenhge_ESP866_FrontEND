export type SensorInfo = {
  key: string; // canonical backend key
  uiKey?: string; // optional UI-friendly alias
  title: string;
  unit?: string;
  sensorId?: string;
};

export const SENSORS: SensorInfo[] = [
  { key: 'temperatura_ds18b20', title: 'Temperatura DS18B20', unit: '°C', sensorId: 't1' },
  { key: 'pressao02_hx710b', uiKey: 'pressao_hx710b', title: 'Pressão HX710B', unit: 'Pa', sensorId: 'p2' },
  { key: 'vibracao_vib_x', title: 'Vibração X', unit: 'g', sensorId: 'vx' },
  { key: 'vibracao_vib_y', title: 'Vibração Y', unit: 'g', sensorId: 'vy' },
  { key: 'vibracao_vib_z', title: 'Vibração Z', unit: 'g', sensorId: 'vz' },
  { key: 'velocidade_m_s', title: 'Velocidade', unit: 'm/s', sensorId: 'vel' },
  { key: 'chave_fim_de_curso', title: 'Chave Fim de Curso', sensorId: 'l1' },
];

// UI keys (use uiKey if present, otherwise backend key)
export const AVAILABLE_UI_KEYS: string[] = SENSORS.map(s => s.uiKey ?? s.key);

// Labels map for both backend keys and ui aliases
export const LABELS: Record<string, string> = SENSORS.reduce((acc, s) => {
  acc[s.key] = s.title;
  if (s.uiKey) acc[s.uiKey] = s.title;
  return acc;
}, {} as Record<string, string>);

export const KEY_TO_SENSOR_ID: Record<string, string> = SENSORS.reduce((acc, s) => {
  if (s.sensorId) acc[s.key] = s.sensorId;
  return acc;
}, {} as Record<string, string>);

export function resolveBackendKey(keyOrAlias: string): string {
  const byKey = SENSORS.find(s => s.key === keyOrAlias || s.uiKey === keyOrAlias);
  return byKey ? byKey.key : keyOrAlias;
}

export function findSensorByKey(keyOrAlias: string): SensorInfo | undefined {
  return SENSORS.find(s => s.key === keyOrAlias || s.uiKey === keyOrAlias);
}

// Map of frontend sensorId -> possible backend keys for that sensor
export const SENSOR_KEY_MAP: Record<string, string[]> = {
  p1: ['pressao01_xgzp701db1r', 'pressao', 'value'],
  p2: ['pressao02_hx710b', 'pressao', 'value'],
  t1: ['temperatura_ds18b20', 'temperatura', 'temp', 'value'],
  vx: ['vibracao_vib_x', 'vibracaoX', 'vibracao_x', 'vib_x', 'value'],
  vy: ['vibracao_vib_y', 'vibracaoY', 'vibracao_y', 'vib_y', 'value'],
  vz: ['vibracao_vib_z', 'vibracaoZ', 'vibracao_z', 'vib_z', 'value'],
  vel: ['velocidade_m_s', 'velocidade', 'value'],
  l1: ['chave_fim_de_curso', 'ativo', 'limit_switch', 'value'],
};

// Attempt to extract a numeric value from an incoming reading object for a given sensorId.
// Returns number when a value could be parsed, otherwise null to signal absence.
export function parseReadingValue(reading: any, sensorId: string): number | null {
  if (!reading || typeof reading !== 'object') return null;
  // prefer explicit `value`
  if (reading.value !== undefined && reading.value !== null && !isNaN(Number(reading.value))) {
    return Number(reading.value);
  }

  const possibleKeys = SENSOR_KEY_MAP[sensorId] || ['value'];
  for (const key of possibleKeys) {
    if (reading[key] !== undefined && reading[key] !== null && !isNaN(Number(reading[key]))) return Number(reading[key]);
    const lowerKey = key.toLowerCase();
    if (reading[lowerKey] !== undefined && reading[lowerKey] !== null && !isNaN(Number(reading[lowerKey]))) return Number(reading[lowerKey]);
  }

  // Try some common fallbacks
  const fallbackCandidates = ['valor', 'leitura', 'medida', 'measurement'];
  for (const k of fallbackCandidates) {
    if (reading[k] !== undefined && reading[k] !== null && !isNaN(Number(reading[k]))) return Number(reading[k]);
  }

  return null;
}

// Extract and normalize timestamp from various possible fields. Returns ISO string or null.
export function extractReadingTimestamp(raw: any): string | null {
  if (!raw || typeof raw !== 'object') return null;
  const candidates = [
    raw.timestamp,
    raw.time,
    raw.dataHora,
    raw.data_hora,
    raw.ultimoHorario,
    raw.ultimo_horario,
    raw.createdAt,
    raw.criadoEm,
  ];
  for (const c of candidates) {
    if (!c) continue;
    try {
      const d = new Date(c);
      if (!isNaN(d.getTime())) return d.toISOString();
    } catch (e) {
      // ignore
    }
  }
  return null;
}

// Normalize an incoming realtime message/reading to a small predictable shape.
export function normalizeIncomingReading(raw: any): { id: string; sensorId: string; value: number | null; timestamp?: string; raw: any } {
  if (!raw || typeof raw !== 'object') {
    const id = `r_${Date.now()}`;
    return { id, sensorId: 'unknown', value: null, timestamp: new Date().toISOString(), raw };
  }

  const id = raw.id ?? raw.codigo ?? raw.uuid ?? `${raw.sensorId ?? raw.sensor_id ?? 's'}_${raw.timestamp ?? Date.now()}`;
  const sensorId = raw.sensorId ?? raw.sensor_id ?? raw.idSensor ?? raw.codigoSensor ?? raw.sensor ?? 'unknown';
  const value = parseReadingValue(raw, String(sensorId)) ?? null;
  const timestamp = extractReadingTimestamp(raw) ?? (raw.timestamp ? new Date(raw.timestamp).toISOString() : new Date().toISOString());

  return {
    id: String(id),
    sensorId: String(sensorId),
    value,
    timestamp,
    raw,
  };
}

export default {
  SENSORS,
  AVAILABLE_UI_KEYS,
  LABELS,
  KEY_TO_SENSOR_ID,
  resolveBackendKey,
  findSensorByKey,
};
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


