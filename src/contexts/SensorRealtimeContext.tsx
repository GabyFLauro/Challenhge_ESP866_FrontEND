import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useSensorStream } from '../hooks/useSensorStream';

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
  
  // Usar o stream global - isso mantém uma única conexão para toda a app
  const { buffer } = useSensorStream(500);

  useEffect(() => {
    // Processar dados do buffer global
    if (buffer && buffer.length > 0) {
      const lastReading = buffer[buffer.length - 1];
      if (!pausedRef.current && lastReading) {
        // Determine sensor id — try common fields
        const sensorId = lastReading.sensorId ?? lastReading.idSensor ?? lastReading.sensor_id ?? String(lastReading.id ?? 'default');

        if (!buffersRef.current[sensorId]) buffersRef.current[sensorId] = [];
        
        // Evitar duplicatas (verificar se já existe)
        const lastInBuffer = buffersRef.current[sensorId][buffersRef.current[sensorId].length - 1];
        const isSameReading = lastInBuffer && 
          lastInBuffer.data_hora === lastReading.data_hora &&
          JSON.stringify(lastInBuffer) === JSON.stringify(lastReading);
        
        if (!isSameReading) {
          buffersRef.current[sensorId].push(lastReading);
          // keep last N
          const MAX = 200;
          if (buffersRef.current[sensorId].length > MAX) {
            buffersRef.current[sensorId].splice(0, buffersRef.current[sensorId].length - MAX);
          }
          setTick(t => t + 1);
        }
      }
    }
  }, [buffer]);

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
