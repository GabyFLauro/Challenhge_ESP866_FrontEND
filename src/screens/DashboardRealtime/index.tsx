import React, { useMemo, useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-elements';
import { useSensorStream } from '../../hooks/useSensorStream';
import ChartPanel from '../../components/ChartPanel';

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

  const lastValue = lastReading ? (lastReading[selected] ?? lastReading[selected.toLowerCase()]) : undefined;

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 12, borderBottomWidth: 1, borderColor: '#eee' }}>
        <Text h4>Dashboard Realtime</Text>
        <Text>Status: {status} {paused ? '(Pausado)' : ''}</Text>
        {metrics && <Text>Leituras: {metrics.total} • RPS: {metrics.rps}</Text>}
      </View>

      <View style={{ padding: 12, flexDirection: 'row', flexWrap: 'wrap' }}>
        {AVAILABLE_KEYS.map(k => (
          <TouchableOpacity key={k} onPress={() => setSelected(k)} style={{ padding: 8, margin: 4, backgroundColor: selected === k ? '#007AFF' : '#eee', borderRadius: 6 }}>
            <Text style={{ color: selected === k ? '#fff' : '#000' }}>{k}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView>
        <View style={{ paddingHorizontal: 12 }}>
          <View style={{ padding: 12, backgroundColor: '#fff', borderRadius: 8, marginBottom: 12 }}>
            <Text>Última leitura ({selected}): {lastValue !== undefined ? String(lastValue) : '—'}</Text>
            <TouchableOpacity onPress={() => (paused ? resume() : pause())} style={{ marginTop: 8 }}>
              <Text style={{ color: '#007AFF' }}>{paused ? 'Retomar' : 'Pausar'}</Text>
            </TouchableOpacity>
          </View>

          <ChartPanel buffer={buffer} keyName={selected} maxPoints={60} />
        </View>
      </ScrollView>
    </View>
  );
};

export default DashboardRealtime;
