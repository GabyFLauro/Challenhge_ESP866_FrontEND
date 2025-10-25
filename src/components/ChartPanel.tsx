import React, { useMemo } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

type ChartPanelProps = {
  buffer: any[]; // array of messages
  keyName: string; // property name to extract numeric values
  maxPoints?: number;
  height?: number;
  showAxisLabels?: boolean; // whether to show X/Y axis labels (defaults to true)
};

export const ChartPanel: React.FC<ChartPanelProps> = ({ buffer, keyName, maxPoints = 40, height = 160, showAxisLabels = true }) => {
  const LABELS: Record<string, string> = {
    pressao02_hx710b: 'Pressão HX710B',
    temperatura_ds18b20: 'Temperatura DS18B20',
    vibracao_vib_x: 'Vibração X',
    vibracao_vib_y: 'Vibração Y',
    vibracao_vib_z: 'Vibração Z',
    velocidade_m_s: 'Velocidade',
    chave_fim_de_curso: 'Chave Fim de Curso',
  };

  const data = useMemo(() => {
    if (!buffer || buffer.length === 0) return { labels: [], values: [] };

    const vals: number[] = [];
    const times: string[] = [];
    // iterate from oldest to newest
    for (let i = Math.max(0, buffer.length - maxPoints); i < buffer.length; i++) {
      const item = buffer[i];
      const v = item && (item[keyName] ?? item[keyName.toLowerCase()] );
      if (v !== undefined && v !== null && !isNaN(Number(v))) {
        vals.push(Number(v));
        // try to extract a timestamp-like field and format it
        const rawTs = item.timestamp ?? item.time ?? item.dataHora ?? item.data_hora ?? item.ultimoHorario ?? item.ultimo_horario;
        let label = '';
        try {
          if (rawTs) {
            const d = new Date(rawTs);
            if (!isNaN(d.getTime())) {
              label = d.toLocaleTimeString();
            }
          }
        } catch (e) {
          label = '';
        }
        times.push(label || `${vals.length}`);
      }
    }

    // if we have fewer labels than values (edge cases), fill with indices
    while (times.length < vals.length) times.unshift('');
    return { labels: times, values: vals };
  }, [buffer, keyName, maxPoints]);

  const cardStyle = { backgroundColor: '#1C1C1E', padding: 16, borderRadius: 12, marginBottom: 12 } as const;
  const labelTextStyle = { color: '#FFFFFF', marginBottom: 6, fontWeight: '600' } as const;

  if (!data.values || data.values.length === 0) {
    return (
      <View style={cardStyle}>
        <Text style={labelTextStyle}>{LABELS[keyName] || keyName}</Text>
        <Text style={{ color: '#8E8E93' }}>Aguardando dados...</Text>
      </View>
    );
  }

  const screenWidth = Dimensions.get('window').width - 64;

  return (
    <View style={cardStyle}>
      <Text style={labelTextStyle}>{LABELS[keyName] || keyName}</Text>
      <LineChart
        data={{ labels: data.labels, datasets: [{ data: data.values, color: (opacity = 1) => `rgba(102, 252, 241, ${opacity})`, strokeWidth: 3 }] }}
        width={screenWidth}
        height={height}
        chartConfig={{
          backgroundColor: '#1C1C1E',
          backgroundGradientFrom: '#1C1C1E',
          backgroundGradientTo: '#1C1C1E',
          fillShadowGradientFrom: '#66fcf1',
          fillShadowGradientFromOpacity: 1,
          fillShadowGradientTo: '#66fcf1',
          fillShadowGradientToOpacity: 0.35,
          color: (opacity = 1) => `rgba(102, 252, 241, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          strokeWidth: 3,
          decimalPlaces: 1,
          propsForDots: {
            r: '5',
            strokeWidth: '2',
            stroke: '#66fcf1',
            fill: '#66fcf1',
          },
        }}
        bezier
        withShadow={true}
        withDots={true}
        withInnerLines={false}
        withOuterLines={false}
        // controlar a exibição de labels via prop
        withHorizontalLabels={!!showAxisLabels}
        withVerticalLabels={!!showAxisLabels}
        segments={3}
        fromZero={false}
        style={{ borderRadius: 8 }}
      />
    </View>
  );
};

export default ChartPanel;
