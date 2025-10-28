import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useSensorStream } from '../hooks/useSensorStream';
import { normalizeIncomingReading } from '../utils/sensors';
import logger from '../utils/logger';

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
  
  // Throttle: batch incoming readings and flush every 500ms to reduce UI updates
  const pendingUpdatesRef = useRef<Reading[]>([]);
  const flushScheduledRef = useRef(false);
  
  // Usar o stream global - isso mantém uma única conexão para toda a app
  const { buffer } = useSensorStream(500);

  // Flush batched updates every 500ms (throttle mechanism)
  useEffect(() => {
    const flushInterval = setInterval(() => {
      if (pendingUpdatesRef.current.length > 0 && !pausedRef.current) {
        const updates = pendingUpdatesRef.current;
        pendingUpdatesRef.current = [];
        flushScheduledRef.current = false;

        // Process all batched readings
        updates.forEach(incoming => {
          const sensorId = incoming.sensorId ?? 'unknown';
          if (!buffersRef.current[sensorId]) buffersRef.current[sensorId] = [];

          // Evitar duplicatas usando id ou timestamp
          const lastInBuffer = buffersRef.current[sensorId][buffersRef.current[sensorId].length - 1];
          const isSameReading = lastInBuffer && (
            (lastInBuffer.id && incoming.id && lastInBuffer.id === incoming.id) ||
            (lastInBuffer.timestamp && incoming.timestamp && lastInBuffer.timestamp === incoming.timestamp)
          );

          if (!isSameReading) {
            buffersRef.current[sensorId].push(incoming);
            // keep last N
            const MAX = 200;
            if (buffersRef.current[sensorId].length > MAX) {
              buffersRef.current[sensorId].splice(0, buffersRef.current[sensorId].length - MAX);
            }
          }
        });

        // Single UI update for all batched readings
        setTick(t => t + 1);
      }
    }, 500); // Flush every 500ms

    return () => clearInterval(flushInterval);
  }, []);

  useEffect(() => {
    // Processar dados do buffer global - batch them instead of immediate setState
    if (buffer && buffer.length > 0) {
      const lastReadingRaw = buffer[buffer.length - 1];
      if (!pausedRef.current && lastReadingRaw) {
        try {
          const incoming = normalizeIncomingReading(lastReadingRaw);
          // Add to pending batch instead of immediate update
          pendingUpdatesRef.current.push(incoming);
        } catch (e) {
          // If normalization fails, still try to push raw object conservatively and log the error
          logger.error('Failed to normalize incoming realtime message', e, lastReadingRaw);
          const sensorId = lastReadingRaw.sensorId ?? lastReadingRaw.idSensor ?? lastReadingRaw.sensor_id ?? String(lastReadingRaw.id ?? 'default');
          pendingUpdatesRef.current.push({ ...lastReadingRaw, sensorId });
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
