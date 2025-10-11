import { useCallback, useEffect, useMemo, useState } from 'react';
import { readingsService, ReadingDTO } from '../services/readings';
import { sensorsService, SensorDTO } from '../services/sensors';
import { buildChartData, computeDetailStatus, sortReadingsByTimestampAsc } from '../utils/sensors';

export function useSensorDetail(sensorId: string) {
  const [sensor, setSensor] = useState<SensorDTO | null>(null);
  const [readings, setReadings] = useState<ReadingDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pageSize] = useState<number>(20);
  const [offset, setOffset] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const status = useMemo(() => computeDetailStatus(sensor, readings), [sensor, readings]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [sensorData, readingsData] = await Promise.all([
        sensorsService.getById(sensorId),
        readingsService.listBySensorPaged(sensorId, pageSize, 0),
      ]);
      setSensor(sensorData);
      setOffset(pageSize);
      setHasMore((readingsData || []).length >= pageSize);
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

  const loadMore = useCallback(async () => {
    if (!hasMore) return;
    try {
      const next = await readingsService.listBySensorPaged(sensorId, pageSize, offset);
      setReadings(prev => [...prev, ...next]);
      setOffset(o => o + pageSize);
      if (next.length < pageSize) setHasMore(false);
    } catch (e) {
      // ignore for now
    }
  }, [sensorId, offset, pageSize, hasMore]);

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
    loadMore,
    hasMore,
  };
}


