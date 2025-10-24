import React, { useMemo, useState } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from 'react-native-elements';
import { useSensorStream } from '../../hooks/useSensorStream';
import ChartPanel from '../../components/ChartPanel';
import AnimatedButton from '../../components/AnimatedButton';
// import { useLoading } from '../../contexts/LoadingContext';

const AVAILABLE_KEYS = [
  'temperatura_ds18b20',
  'pressao02_hx710b',
  'vibracao_vib_x',
  'vibracao_vib_y',
  'vibracao_vib_z',
  'velocidade_m_s',
];

export const DashboardRealtime = () => {
  const { buffer, lastReading, status, paused, pause, resume, metrics } = useSensorStream();
  const [selected, setSelected] = useState<string>(AVAILABLE_KEYS[0]);
  // const { showLoading, hideLoading } = useLoading();
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const lastValue = lastReading ? (lastReading[selected] ?? lastReading[selected.toLowerCase()]) : undefined;

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

          <ChartPanel buffer={buffer} keyName={selected} maxPoints={60} />
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
    paddingHorizontal: 12,
    paddingVertical: 8,
    margin: 4,
    backgroundColor: '#2C2C2E',
    borderRadius: 8,
  },
  chipSelected: {
    backgroundColor: '#0328d4',
  },
  chipText: {
    color: '#FFFFFF',
  },
  chipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
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
  },
  cardLabel: {
    color: '#8E8E93',
    marginBottom: 6,
  },
  cardValue: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  actionButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: '#2C2C2E',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#FFFFFF',
  },
});
