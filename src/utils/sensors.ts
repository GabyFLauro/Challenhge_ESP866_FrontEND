import { SensorDTO } from '../services/sensors';
import { ReadingDTO } from '../services/readings';

export type SensorStatus = 'ok' | 'warning' | 'error';

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
  if (sensor.currentValue !== undefined && sensor.maxValue !== undefined) {
    return sensor.currentValue > sensor.maxValue * 0.9 ? 'warning' : 'ok';
  }
  return 'ok';
}

export function computeDetailStatus(sensor: SensorDTO | null, readings: ReadingDTO[]): SensorStatus {
  if (readings.length === 0) return 'ok';
  const sorted = sortReadingsByTimestampDesc(readings);
  const last = sorted[0];
  if (!last) return 'ok';

  if (sensor) {
    const { minValue, maxValue, type } = sensor;
    if (type === 'limit_switch') {
      return last.value === 1 ? 'ok' : 'warning';
    }
    if (minValue !== undefined && maxValue !== undefined) {
      const range = maxValue - minValue;
      const warning = maxValue - range * 0.1;
      const error = maxValue - range * 0.05;
      if (last.value >= error) return 'error';
      if (last.value >= warning) return 'warning';
      return 'ok';
    }
  }
  return last.value >= 80 ? 'error' : last.value >= 60 ? 'warning' : 'ok';
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
  return { labels, datasets: [{ data }] };
}


