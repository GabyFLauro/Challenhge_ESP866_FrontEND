import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { connectSocket, disconnectSocket } from '../services/socketio';
import { connectStomp, disconnectStomp } from '../services/ws';

type Reading = Record<string, any> & { id?: string; data_hora?: string };

type BufferMap = Record<string, Reading[]>;

type SensorRealtimeContextValue = {
  getBuffer: (sensorId: string) => Reading[];
  getLast: (sensorId: string) => Reading | null;
  pause: () => void;
  resume: () => void;
};

const SensorRealtimeContext = createContext<SensorRealtimeContextValue | null>(null);

export function SensorRealtimeProvider({ children }: { children: React.ReactNode }) {
  const buffersRef = useRef<BufferMap>({});
  const [tick, setTick] = useState(0); // to trigger re-renders
  const pausedRef = useRef(false);

  useEffect(() => {
    function onMessage(data: Reading) {
      if (pausedRef.current) return;

      // Determine sensor id — try common fields
      const sensorId = data.sensorId ?? data.idSensor ?? data.sensor_id ?? String(data.id ?? 'default');

      if (!buffersRef.current[sensorId]) buffersRef.current[sensorId] = [];
      buffersRef.current[sensorId].push(data);
      // keep last N
      const MAX = 200;
      if (buffersRef.current[sensorId].length > MAX) {
        buffersRef.current[sensorId].splice(0, buffersRef.current[sensorId].length - MAX);
      }

      setTick(t => t + 1);
    }

    // prefer socket
    try {
      connectSocket(onMessage, () => {
        // connected
      });
    } catch (e) {
      connectStomp(onMessage, () => {});
    }

    return () => {
      try { disconnectSocket(); } catch {}
      try { disconnectStomp(); } catch {}
    };
  }, []);

  const getBuffer = (sensorId: string) => {
    return buffersRef.current[sensorId] ?? [];
  };

  const getLast = (sensorId: string) => {
    const buf = getBuffer(sensorId);
    return buf.length ? buf[buf.length - 1] : null;
  };

  const pause = () => { pausedRef.current = true; };
  const resume = () => { pausedRef.current = false; };

  const value: SensorRealtimeContextValue = {
    getBuffer,
    getLast,
    pause,
    resume,
  };

  return (
    <SensorRealtimeContext.Provider value={value}>
      {children}
    </SensorRealtimeContext.Provider>
  );
}

export function useSensorRealtime() {
  const ctx = useContext(SensorRealtimeContext);
  if (!ctx) throw new Error('useSensorRealtime must be used within SensorRealtimeProvider');
  return ctx;
}

export default SensorRealtimeContext;
