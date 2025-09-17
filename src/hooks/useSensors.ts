import { useCallback, useEffect, useState } from 'react';
import { sensorsService, SensorDTO } from '../services/sensors';
import { backendTestService } from '../services/backendTest';
import { backendInvestigationService } from '../services/backendInvestigation';
import { mapSensorListToView } from '../utils/sensors';

export function useSensors() {
  const [items, setItems] = useState<SensorDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [backendStatus, setBackendStatus] = useState<string>('Verificando...');
  const [investigationResult, setInvestigationResult] = useState<string>('');

  const investigateBackend = useCallback(async () => {
    try {
      setInvestigationResult('Investigando estrutura do backend...');
      const result = await backendInvestigationService.runFullInvestigation();
      setInvestigationResult(result.summary);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      setInvestigationResult(`Erro na investigação: ${message}`);
    }
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    setBackendStatus('Verificando...');
    try {
      const testResult = await backendTestService.runFullTest();
      setBackendStatus(testResult.connection.isConnected ? '✅ Backend Conectado' : '⚠️ Backend Offline');
      const sensors = await sensorsService.list();
      setItems(sensors);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao buscar sensores');
      setBackendStatus('❌ Erro de Conexão');
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const testResult = await backendTestService.runFullTest();
      setBackendStatus(testResult.connection.isConnected ? '✅ Backend Conectado' : '⚠️ Backend Offline');
      const sensors = await sensorsService.list();
      setItems(sensors);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao atualizar');
      setBackendStatus('❌ Erro de Conexão');
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return {
    items,
    listView: mapSensorListToView(items),
    loading,
    refreshing,
    error,
    backendStatus,
    investigationResult,
    investigateBackend,
    load,
    refresh,
  };
}


