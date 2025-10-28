import React, { useMemo, useState } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Text } from 'react-native-elements';
import { useSensorStream } from '../../hooks/useSensorStream';
import ChartPanel from '../../components/ChartPanel';
import { AVAILABLE_UI_KEYS, parseReadingValue, KEY_TO_SENSOR_ID } from '../../utils/sensors';
import AnimatedButton from '../../components/AnimatedButton';
// import { useLoading } from '../../contexts/LoadingContext';

const AVAILABLE_KEYS = AVAILABLE_UI_KEYS;

export const DashboardRealtime = () => {
  const { buffer, lastReading, status, paused, pause, resume, metrics } = useSensorStream();
  const [selected, setSelected] = useState<string>(AVAILABLE_KEYS[0]);
  // const { showLoading, hideLoading } = useLoading();
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // Some backends use 'pressao02_hx710b' while UI shows 'pressao_hx710b' as a friendly key.
  // Resolve the actual data key we should read from incoming messages so values like 0 are picked up.
  const dataKey = selected === 'pressao_hx710b' ? 'pressao02_hx710b' : selected;
  const lastValue = (() => {
    if (!lastReading) return undefined;
    // Prefer centralized parser using sensorId lookup when available
    const sensorId = KEY_TO_SENSOR_ID[dataKey] ?? KEY_TO_SENSOR_ID[selected] ?? dataKey;
    const parsed = parseReadingValue(lastReading, String(sensorId));
    if (parsed !== null && parsed !== undefined && !isNaN(Number(parsed))) return Number(parsed);
    // fallback to direct field access
    return lastReading[dataKey] ?? lastReading[dataKey.toLowerCase()] ?? lastReading[selected] ?? lastReading[selected.toLowerCase()];
  })();

  const windowWidth = Dimensions.get('window').width;
  const chartWidth = windowWidth - 16; // use more width so chart fills more of the screen

  // Show loading on first load and hide when data is ready
  // React.useEffect(() => {
  //   if (isFirstLoad) {
  //     showLoading('Conectando ao sistema...');
  //     const timer = setTimeout(() => {
  //       hideLoading();
  //       setIsFirstLoad(false);
  //     }, 1200);
  //     return () => clearTimeout(timer);
  //   }
  // }, [isFirstLoad, showLoading, hideLoading]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text h4 style={styles.title}>Dashboard Realtime</Text>
        <Text style={styles.subtitle}>Status: {status} {paused ? '(Pausado)' : ''}</Text>
        {metrics && <Text style={styles.subtitle}>Leituras: {metrics.total} • RPS: {metrics.rps}</Text>}
      </View>

      <View style={styles.keyRow}>
        {AVAILABLE_KEYS.map(k => (
          <AnimatedButton
            key={k}
            onPress={() => setSelected(k)}
            style={[styles.chip, selected === k && styles.chipSelected]}
          >
            <Text style={[styles.chipText, selected === k && styles.chipTextSelected]}>{k}</Text>
          </AnimatedButton>
        ))}
      </View>

      <ScrollView>
        <View style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Última leitura</Text>
            <Text style={styles.cardValue}>{selected}: {lastValue !== undefined ? String(lastValue) : '—'}</Text>
            <AnimatedButton onPress={() => (paused ? resume() : pause())} style={styles.actionButton}>
              <Text style={styles.actionButtonText}>{paused ? 'Retomar' : 'Pausar'}</Text>
            </AnimatedButton>
          </View>

          <ChartPanel buffer={buffer} keyName={dataKey} maxPoints={60} showAxisLabels={false} height={340} chartWidth={chartWidth} />
        </View>
      </ScrollView>
    </View>
  );
};

export default DashboardRealtime;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0C0E',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: '#1C1C1E',
    borderBottomColor: '#2C2C2E',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: {
    color: '#FFFFFF',
  },
  subtitle: {
    color: '#8E8E93',
    marginTop: 2,
  },
  keyRow: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    margin: 6,
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    minWidth: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipSelected: {
    backgroundColor: '#0328d4',
  },
  chipText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
  },
  chipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  content: {
    paddingHorizontal: 12,
    paddingBottom: 16,
  },
  card: {
    padding: 16,
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  cardLabel: {
    color: '#8E8E93',
    marginBottom: 6,
    textAlign: 'center',
    fontSize: 14,
  },
  cardValue: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  actionButton: {
    marginTop: 10,
    alignSelf: 'center',
    backgroundColor: '#2C2C2E',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  actionButtonText: {
    color: '#FFFFFF',
  },
});
