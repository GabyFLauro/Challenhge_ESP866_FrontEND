import { useEffect, useRef, useState } from 'react';
import { connectStomp, disconnectStomp, SensorMessage } from '../services/ws';
import { connectSocket, disconnectSocket } from '../services/socketio';
import { apiClient } from '../services/apiClient';

type SensorMap = Record<string, SensorMessage>;

// Singleton para manter conexão global ativa
let globalConnection: {
  client: any;
  status: string;
  buffer: SensorMessage[];
  subscribers: Set<(msg: SensorMessage) => void>;
  statusSubscribers: Set<(status: string) => void>;
  isConnecting: boolean;
} | null = null;

function initializeGlobalConnection() {
  if (globalConnection) return globalConnection;

  globalConnection = {
    client: null,
    status: 'disconnected',
    buffer: [],
    subscribers: new Set(),
    statusSubscribers: new Set(),
    isConnecting: false,
  };

  function onMessage(msg: SensorMessage) {
    if (!globalConnection) return;
    
    // Adicionar ao buffer global
    globalConnection.buffer.push(msg);
    if (globalConnection.buffer.length > 500) {
      globalConnection.buffer.splice(0, globalConnection.buffer.length - 500);
    }

    // Notificar todos os subscribers
    globalConnection.subscribers.forEach(callback => {
      try {
        callback(msg);
      } catch (e) {
        console.error('Erro ao notificar subscriber:', e);
      }
    });
  }

  function onStatus(s: string) {
    if (!globalConnection) return;
    globalConnection.status = s;
    globalConnection.statusSubscribers.forEach(callback => {
      try {
        callback(s);
      } catch (e) {
        console.error('Erro ao notificar status subscriber:', e);
      }
    });
  }

  function connect() {
    if (globalConnection!.isConnecting) return;
    globalConnection!.isConnecting = true;

    let stompActive = false;
    let fallbackTimer: number | null = null;

    try {
      globalConnection!.client = connectSocket(
        onMessage,
        () => {
          onStatus('connected');
          globalConnection!.isConnecting = false;
        },
        (err) => {
          if (!stompActive) {
            onStatus('error');
          }
        },
        () => {
          onStatus('disconnected');
          globalConnection!.isConnecting = false;
        }
      );
      onStatus('connecting');
      
      fallbackTimer = window.setTimeout(() => {
        if (globalConnection!.status === 'connecting' || globalConnection!.status === 'disconnected' || globalConnection!.status === 'error') {
          const c = connectStomp(onMessage, (s) => {
            onStatus(s);
            if (s === 'connected' || s === 'error') {
              globalConnection!.isConnecting = false;
            }
          });
          globalConnection!.client = c;
          stompActive = true;
        }
      }, 2000);
    } catch (e) {
      const c = connectStomp(onMessage, (s) => {
        onStatus(s);
        if (s === 'connected' || s === 'error') {
          globalConnection!.isConnecting = false;
        }
      });
      globalConnection!.client = c;
      stompActive = true;
    }
  }

  // Iniciar conexão automaticamente
  connect();

  return globalConnection;
}

export function useSensorStream(bufferSize = 200) {
  const [lastReading, setLastReading] = useState<SensorMessage | null>(null);
  const [status, setStatus] = useState<string>('disconnected');
  const [paused, setPaused] = useState<boolean>(false);
  const [metrics, setMetrics] = useState<any>(null);
  const localBufferRef = useRef<SensorMessage[]>([]);
  const throttledRef = useRef<number | null>(null);

  useEffect(() => {
    const connection = initializeGlobalConnection();

    function onMessage(msg: SensorMessage) {
      if (paused) return;
      
      // Adicionar ao buffer local
      localBufferRef.current.push(msg);
      if (localBufferRef.current.length > bufferSize) {
        localBufferRef.current.splice(0, localBufferRef.current.length - bufferSize);
      }
      
      // Throttle UI updates to ~300ms
      if (throttledRef.current === null) {
        throttledRef.current = window.setTimeout(() => {
          const last = localBufferRef.current[localBufferRef.current.length - 1] || null;
          setLastReading(last);
          throttledRef.current && clearTimeout(throttledRef.current as number);
          throttledRef.current = null;
        }, 300);
      }
    }

    function onStatusChange(s: string) {
      setStatus(s);
    }

    // Sincronizar status inicial
    setStatus(connection.status);

    // Subscrever aos dados e status
    connection.subscribers.add(onMessage);
    connection.statusSubscribers.add(onStatusChange);

    // Preencher buffer local com dados já existentes
    localBufferRef.current = [...connection.buffer.slice(-bufferSize)];

    const metricsInterval = setInterval(async () => {
      try {
        const data = await apiClient.publicGet<any>('/sensores/metrics');
        setMetrics(data);
      } catch (e) {
        // ignore
      }
    }, 8000);

    return () => {
      clearInterval(metricsInterval);
      
      // Remover subscribers
      connection.subscribers.delete(onMessage);
      connection.statusSubscribers.delete(onStatusChange);
      
      // Limpar throttle
      if (throttledRef.current) {
        clearTimeout(throttledRef.current as number);
      }
    };
  }, [bufferSize, paused]);

  const pause = () => setPaused(true);
  const resume = () => setPaused(false);

  return {
    lastReading,
    status,
    pause,
    resume,
    paused,
    metrics,
    buffer: localBufferRef.current,
  };
}
