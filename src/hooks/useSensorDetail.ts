import { useCallback, useEffect, useMemo, useState } from 'react';
import { readingsService, ReadingDTO } from '../services/readings';
import { sensorsService, SensorDTO } from '../services/sensors';
import { buildChartData, computeDetailStatus, sortReadingsByTimestampAsc } from '../utils/sensors';

export function useSensorDetail(sensorId: string) {
  const [sensor, setSensor] = useState<SensorDTO | null>(null);
  const [readings, setReadings] = useState<ReadingDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const status = useMemo(() => computeDetailStatus(sensor, readings), [sensor, readings]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [sensorData, readingsData] = await Promise.all([
        sensorsService.getById(sensorId),
        readingsService.listBySensor(sensorId),
      ]);
      setSensor(sensorData);
      setReadings(readingsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao buscar dados do sensor');
    } finally {
      setLoading(false);
    }
  }, [sensorId]);

  useEffect(() => {
    load();
  }, [load]);

  const chartData = useMemo(() => buildChartData(readings, 8), [readings]);
  const sortedReadings = useMemo(() => sortReadingsByTimestampAsc(readings), [readings]);
  const hasEnoughDataForChart = sortedReadings.length >= 2;

  return {
    sensor,
    readings,
    loading,
    error,
    status,
    chartData,
    sortedReadings,
    hasEnoughDataForChart,
    load,
  };
}


