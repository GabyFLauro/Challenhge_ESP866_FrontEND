import { useEffect, useRef, useState } from 'react';
import { connectStomp, disconnectStomp, SensorMessage } from '../services/ws';
import { connectSocket, disconnectSocket } from '../services/socketio';
import { apiClient } from '../services/apiClient';

type SensorMap = Record<string, SensorMessage>;

export function useSensorStream(bufferSize = 200) {
  const [lastReading, setLastReading] = useState<SensorMessage | null>(null);
  const [status, setStatus] = useState<string>('disconnected');
  const bufferRef = useRef<SensorMessage[]>([]);
  const throttledRef = useRef<number | null>(null);
  const clientRef = useRef<any>(null);
  const [paused, setPaused] = useState<boolean>(false);
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    function onMessage(msg: SensorMessage) {
      if (paused) return;
      bufferRef.current.push(msg);
      if (bufferRef.current.length > bufferSize) {
        bufferRef.current.splice(0, bufferRef.current.length - bufferSize);
      }
      // Throttle UI updates to ~300ms
      if (throttledRef.current === null) {
        throttledRef.current = window.setTimeout(() => {
          const last = bufferRef.current[bufferRef.current.length - 1] || null;
          setLastReading(last);
          throttledRef.current && clearTimeout(throttledRef.current as number);
          throttledRef.current = null;
        }, 300);
      }
    }

    function onStatus(s: string) {
      setStatus(s);
    }

    // Prefer socket.io for lower latency if available
    try {
      clientRef.current = connectSocket(onMessage, () => onStatus('connected'));
    } catch (e) {
      // fallback to STOMP
      clientRef.current = connectStomp(onMessage, onStatus);
    }

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
  try { disconnectSocket(); } catch {}
  try { disconnectStomp(); } catch {}
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
    buffer: bufferRef.current,
  };
}
