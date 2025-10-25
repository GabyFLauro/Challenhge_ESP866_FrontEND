import React, { useEffect, useMemo, useState } from 'react';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { View, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Dimensions, Modal } from 'react-native';
import AlertRedIcon from '../../components/AlertRedIcon';
import { Text } from 'react-native-elements';
import { useRoute } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';
import { Logo } from '../../components/Logo';
import ChartPanel from '../../components/ChartPanel';
import { getMetricScreenChartConfig } from '../../utils/chartConfig';
import { useSensorStream } from '../../hooks/useSensorStream';
import { readingsService, ReadingDTO } from '../../services/readings';
import { historyService, SensorHistoryItem } from '../../services/history';
import { classifyMetric, vibrationDiagnostics } from '../../utils/alerts';
import AnimatedButton from '../../components/AnimatedButton';
import FeedbackIndicator from '../../components/FeedbackIndicator';
import { Ionicons } from '@expo/vector-icons';
import ReasonsIconSvg from '../../components/ReasonsIconSvg';
import LightBulbIconSvg from '../../components/LightBulbIconSvg';
// import { useLoading } from '../../contexts/LoadingContext';

type RouteParams = {
  keyName: string; // ex: 'pressao02_hx710b'
  title?: string;  // ex: 'Pressão HX710B'
  unit?: string;   // ex: 'Pa' | '°C' | 'm/s' | 'g'
};

const LABELS: Record<string, { title: string; unit?: string }> = {
  pressao02_hx710b: { title: 'Pressão HX710B', unit: 'Pa' },
  temperatura_ds18b20: { title: 'Temperatura DS18B20', unit: '°C' },
  vibracao_vib_x: { title: 'Vibração X', unit: 'g' },
  vibracao_vib_y: { title: 'Vibração Y', unit: 'g' },
  vibracao_vib_z: { title: 'Vibração Z', unit: 'g' },
  velocidade_m_s: { title: 'Velocidade', unit: 'm/s' },
  chave_fim_de_curso: { title: 'Chave Fim de Curso' },
};

// Mapeia a métrica (keyName) para o sensorId usado pelos endpoints de histórico
const KEY_TO_SENSOR_ID: Record<string, string> = {
  pressao02_hx710b: 'p2',
  temperatura_ds18b20: 't1',
  vibracao_vib_x: 'vx',
  vibracao_vib_y: 'vy',
  vibracao_vib_z: 'vz',
  velocidade_m_s: 'vel', // fallback: readingsService gera valores default
  chave_fim_de_curso: 'l1',
};

export const MetricScreen: React.FC = () => {
  const route = useRoute();
  const params = route.params as RouteParams | undefined;
  const keyName = params?.keyName as string;
  const meta = LABELS[keyName] || { title: params?.title || keyName, unit: params?.unit };

  const { buffer, lastReading, status, paused, pause, resume } = useSensorStream(240);
  // const { showLoading, hideLoading } = useLoading();
  const [history, setHistory] = useState<SensorHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [period, setPeriod] = useState<'5min' | '1h' | '24h' | '30h' | '7d' | '30d' | 'custom'>('1h');
  const [showDatePicker, setShowDatePicker] = useState<'start' | 'end' | null>(null);
  const [customStart, setCustomStart] = useState<Date | null>(null);
  const [customEnd, setCustomEnd] = useState<Date | null>(null);
  
  // Feedback states
  const [feedback, setFeedback] = useState<{
    visible: boolean;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
  }>({ visible: false, type: 'info', message: '' });

  // Modal states
  const [modalReasonsVisible, setModalReasonsVisible] = useState(false);
  const [modalSolutionsVisible, setModalSolutionsVisible] = useState(false);
  const [modalContent, setModalContent] = useState<string[]>([]);
  
  // Histórico retrátil
  const [historyCollapsed, setHistoryCollapsed] = useState(true);

  const last = lastReading || null;
  const lastValue = useMemo(() => {
    if (!last) return undefined;
    const v = last[keyName] ?? last[keyName?.toLowerCase?.() ?? ''];
    return v !== undefined ? Number(v) : undefined;
  }, [last, keyName]);

  const lastTs = useMemo(() => {
    const ts = last?.data_hora || last?.timestamp || last?.dataHora || last?.createdAt;
    return ts ? new Date(ts).toLocaleString() : '—';
  }, [last]);

  const isBoolean = keyName === 'chave_fim_de_curso';
  const boolLabel = useMemo(() => {
    if (!isBoolean) return '';
    const v = (last && (last[keyName] ?? last[keyName.toLowerCase?.() ?? ''])) as any;
    const b = typeof v === 'boolean' ? v : Number(v) === 1;
    return b ? 'ATIVADA' : 'DESATIVADA';
  }, [isBoolean, last, keyName]);

  // Flag to track initial load
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Atualizar histórico automaticamente quando uma nova leitura chega
  useEffect(() => {
    if (!lastReading || lastValue === undefined) return;
    
    // Criar novo item de histórico a partir da leitura atual
    const dataHora = lastReading.data_hora || lastReading.timestamp || lastReading.dataHora || lastReading.createdAt || new Date().toISOString();
    
    // Mapear o valor para o campo correto baseado no keyName
    const newHistoryItem: SensorHistoryItem = {
      dataHora,
      ...(keyName === 'temperatura_ds18b20' && { temperatura: lastValue }),
      ...(keyName === 'pressao02_hx710b' && { pressao: lastValue }),
      ...(keyName === 'vibracao_vib_x' && { vibracaoX: lastValue }),
      ...(keyName === 'vibracao_vib_y' && { vibracaoY: lastValue }),
      ...(keyName === 'vibracao_vib_z' && { vibracaoZ: lastValue }),
      ...(keyName === 'velocidade_m_s' && { velocidade: lastValue }),
      ...(keyName === 'chave_fim_de_curso' && { ativo: lastValue === 1 }),
    };

    // Adicionar ao histórico sem duplicar (verificar se já existe esse dataHora)
    setHistory(prev => {
      const exists = prev.some(item => item.dataHora === dataHora);
      if (exists) return prev;
      
      // Adicionar novo item e manter os últimos 100 registros
      const updated = [...prev, newHistoryItem].slice(-100);
      return updated;
    });
  }, [lastReading, lastValue, keyName]);

  // Show loading when screen first mounts
  // useEffect(() => {
  //   if (isInitialLoad) {
  //     showLoading(`Carregando dados de ${meta.title}...`);
  //   }
  // }, [isInitialLoad, meta.title, showLoading]);

  // Carregar histórico deste sensor (mapeado pelo keyName)
  useEffect(() => {
    let mounted = true;
    async function loadHistory() {
      setLoadingHistory(true);
      setHistoryError(null);
      try {
        let inicio: Date | undefined;
        let fim: Date | undefined = new Date();
        if (period === '5min') {
          inicio = new Date(Date.now() - 5 * 60 * 1000);
        } else if (period === '1h') {
          inicio = new Date(Date.now() - 60 * 60 * 1000);
        } else if (period === '24h') {
          inicio = new Date(Date.now() - 24 * 60 * 60 * 1000);
        } else if (period === '30h') {
          inicio = new Date(Date.now() - 30 * 60 * 60 * 1000);
        } else if (period === '7d') {
          inicio = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        } else if (period === '30d') {
          inicio = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        } else if (period === 'custom' && customStart && customEnd) {
          inicio = customStart;
          fim = customEnd;
        }
        const data = await historyService.getHistory(keyName, inicio, fim, 100);
        if (mounted) {
          setHistory(data);
          setHistoryError(null);
          
          // Remove initial load feedback
          if (isInitialLoad) {
            setIsInitialLoad(false);
          }
        }
      } catch (e) {
        if (mounted) {
          const errorMsg = e instanceof Error ? e.message : 'Falha ao carregar histórico';
          setHistoryError(errorMsg);
          // if (isInitialLoad) hideLoading();
          setFeedback({
            visible: true,
            type: 'error',
            message: errorMsg
          });
        }
      } finally {
        if (mounted) setLoadingHistory(false);
      }
    }
    if (keyName) loadHistory();
    return () => { mounted = false; };
  }, [keyName, period, customStart, customEnd, isInitialLoad]);

  // Preparar dados para gráfico por tempo (histórico + realtime)
  const timeChart = useMemo(() => {
    // base: histórico ordenado asc por dataHora
    const hist = [...history].sort((a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime());
    const getValue = (r: SensorHistoryItem): number | null => {
      if (keyName === 'temperatura_ds18b20' && r.temperatura !== undefined) return Number(r.temperatura);
      if (keyName === 'pressao02_hx710b' && r.pressao !== undefined) return Number(r.pressao);
      if (keyName === 'vibracao_vib_x' && r.vibracaoX !== undefined) return Number(r.vibracaoX);
      if (keyName === 'vibracao_vib_y' && r.vibracaoY !== undefined) return Number(r.vibracaoY);
      if (keyName === 'vibracao_vib_z' && r.vibracaoZ !== undefined) return Number(r.vibracaoZ);
      if (keyName === 'velocidade_m_s' && r.velocidade !== undefined) return Number(r.velocidade);
      if (keyName === 'chave_fim_de_curso' && typeof r.ativo === 'boolean') return r.ativo ? 1 : 0;
      return null;
    };
  // Reduzir quantidade de labels para evitar sobreposição
  const rawLabels = hist.map((r) => new Date(r.dataHora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const step = Math.ceil(rawLabels.length / 6) || 1; // mostra no máximo 6 labels
  const labels = rawLabels.map((label, idx) => (idx % step === 0 ? label : ''));
  const data = hist.map(getValue).filter(v => v !== null) as number[];
  return { 
    labels, 
    datasets: [{ 
      data
    }] 
  };
  }, [history, keyName]);

  return (
    <ScrollView style={styles.container}>
      <Logo />

      <View style={styles.header}>
        <Text h4 style={styles.title}>{meta.title}</Text>
        <Text style={styles.subtitle}>Status stream: {status} {paused ? '(Pausado)' : ''}</Text>
        <AnimatedButton onPress={() => (paused ? resume() : pause())} style={styles.actionButton}>
          <Text style={styles.actionButtonText}>{paused ? 'Retomar' : 'Pausar'}</Text>
        </AnimatedButton>
      </View>

      <View style={{
        backgroundColor: '#D1D1D6',
        borderRadius: 12,
        marginHorizontal: 16,
        marginTop: 12,
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Text style={{
          color: '#0000ff',
          marginBottom: 8,
          textAlign: 'center',
          fontSize: 20,
          fontWeight: '700',
        }}>Valor atual</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          {isBoolean ? (
            <>
              <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#000000', textAlign: 'center' }}>{boolLabel}</Text>
              <Text style={{ marginLeft: 8, fontSize: 24 }}>ℹ️</Text>
            </>
          ) : (
            <>
              <Text style={{ fontSize: 44, fontWeight: 'bold', color: '#000000', textAlign: 'center' }}>
                {lastValue !== undefined ? `${lastValue.toFixed(2)}${meta.unit ? ' ' + meta.unit : ''}` : '—'}
              </Text>
              {lastValue !== undefined && (() => {
                const result = classifyMetric(keyName, Number(lastValue));
                if (result.level === 'normal') {
                  return <Text style={{ marginLeft: 10, fontSize: 44 }}>✅</Text>;
                } else if (result.level === 'alerta') {
                  return <Text style={{ marginLeft: 10, fontSize: 44 }}>⚠️</Text>;
                } else {
                  return (
                    <View style={{ marginLeft: 10 }}>
                      <AlertRedIcon size={44} />
                    </View>
                  );
                }
              })()}
            </>
          )}
        </View>
        <Text style={{ marginTop: 6, color: '#0000ff', textAlign: 'center' }}>Última atualização: {lastTs}</Text>
      </View>

      {/* Gráfico por tempo com timestamps no eixo X */}
      <View style={styles.card}>
        <Text style={styles.label}>Gráfico por Tempo</Text>
        {/* Filtros de período */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 }}>
          {['1h','24h'].map(p => (
            <TouchableOpacity key={p} onPress={() => setPeriod(p as any)} style={[styles.actionButton, period === p && { backgroundColor: '#0328d4' }]}>
              <Text style={[styles.actionButtonText, period === p && { color: '#fff' }]}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {loadingHistory ? (
          <ActivityIndicator color="#0328d4" style={{ marginVertical: 8 }} />
        ) : timeChart.datasets[0].data.length >= 2 ? (
            <LineChart
            data={{
              ...timeChart,
              datasets: timeChart.datasets.map((dataset: any) => ({
                ...dataset,
                color: (opacity = 1) => `rgba(102, 252, 241, ${opacity})`,
                strokeWidth: 3,
              }))
            }}
            width={Dimensions.get('window').width - 64}
            height={220}
            chartConfig={getMetricScreenChartConfig()}
            bezier
            withShadow={true}
            withDots={true}
            withInnerLines={false}
            withOuterLines={false}
            withVerticalLines={false}
            withHorizontalLines={true}
            segments={3}
            fromZero={false}
              withVerticalLabels={true}
              withHorizontalLabels={true}
            style={{ borderRadius: 8, marginTop: 8, overflow: 'visible' }}
          />
        ) : (
          <Text style={{ color: '#8E8E93', marginTop: 8 }}>Aguardando dados para o gráfico...</Text>
        )}
      </View>

      {/* Cards de alerta, motivos e soluções */}
      <View style={styles.card}>
        <Text style={styles.label}>Status e Diagnóstico</Text>
        {lastValue !== undefined ? (
          (() => {
            const result = classifyMetric(keyName, Number(lastValue));
            const color = result.level === 'normal' ? '#34C759' : result.level === 'alerta' ? '#FF9F0A' : '#FF3B30';
            // Diagnóstico adicional para vibração por eixo
            const diag = keyName.startsWith('vibracao_vib_')
              ? vibrationDiagnostics(keyName.endsWith('_x') ? 'x' : keyName.endsWith('_y') ? 'y' : 'z', Number(lastValue))
              : undefined;
            return (
              <>
                <View style={{ backgroundColor: '#2C2C2E', padding: 16, borderRadius: 8, alignItems: 'center' }}>
                  <Text style={{ color, fontWeight: '700', fontSize: 18, textAlign: 'center' }}>{result.label} • {result.statusText}</Text>
                  {result.explanation && (
                    <Text style={{ color: '#FFFFFF', marginTop: 8, fontSize: 16, lineHeight: 24, textAlign: 'center' }}>{result.explanation}</Text>
                  )}
                </View>
                {(diag || result.reasons || result.solutions) && (
                  <View style={{ marginTop: 12, flexDirection: 'row', gap: 8 }}>
                    {(diag?.reasons?.length || result.reasons?.length) && (
                      <TouchableOpacity 
                        onPress={() => {
                          setModalContent(diag?.reasons || result.reasons || []);
                          setModalReasonsVisible(true);
                        }}
                        style={{
                          flex: 1,
                          backgroundColor: '#000f55',
                          padding: 12,
                          borderRadius: 8,
                          borderWidth: 2,
                          borderColor: '#001a88',
                          alignItems: 'center',
                          flexDirection: 'row',
                          justifyContent: 'center',
                          gap: 8,
                        }}
                      >
                        <ReasonsIconSvg size={36} color="#FFFFFF" />
                        <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>
                          Possíveis motivos
                        </Text>
                      </TouchableOpacity>
                    )}
                    {(diag?.solutions?.length || result.solutions?.length) && (
                      <TouchableOpacity 
                        onPress={() => {
                          setModalContent(diag?.solutions || result.solutions || []);
                          setModalSolutionsVisible(true);
                        }}
                        style={{
                          flex: 1,
                          backgroundColor: '#000f55',
                          padding: 12,
                          borderRadius: 8,
                          borderWidth: 2,
                          borderColor: '#001a88',
                          alignItems: 'center',
                          flexDirection: 'row',
                          justifyContent: 'center',
                          gap: 8,
                        }}
                      >
                        <LightBulbIconSvg size={36} color="#FFFFFF" />
                        <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>
                          Possíveis soluções
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </>
            );
          })()
        ) : (
          <Text style={{ color: '#8E8E93' }}>Sem leitura atual para diagnóstico.</Text>
        )}
      </View>

      {/* Histórico e gráfico por tempo */}
      <View style={styles.card}>
        <TouchableOpacity 
          onPress={() => setHistoryCollapsed(prev => !prev)}
          style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}
        >
          <Text style={[styles.label, { fontSize: 16 }]}>Histórico (últimas leituras)</Text>
          <Ionicons 
            name={historyCollapsed ? 'chevron-forward' : 'chevron-down'} 
            size={24} 
            color="#FFFFFF"
          />
        </TouchableOpacity>

        {/* Mostrar última leitura mesmo quando retraído */}
        {historyCollapsed && history.length > 0 && (
          <View style={{ marginTop: 4 }}>
            {(() => {
              const r = history[history.length - 1];
              let value: number | string | undefined = '';
              if (keyName === 'temperatura_ds18b20') value = r.temperatura;
              else if (keyName === 'pressao02_hx710b') value = r.pressao;
              else if (keyName === 'vibracao_vib_x') value = r.vibracaoX;
              else if (keyName === 'vibracao_vib_y') value = r.vibracaoY;
              else if (keyName === 'vibracao_vib_z') value = r.vibracaoZ;
              else if (keyName === 'velocidade_m_s') value = r.velocidade;
              else if (keyName === 'chave_fim_de_curso') value = r.ativo ? 'ATIVADA' : 'DESATIVADA';
             
               // Determina a cor baseada no estado
               let valueColor = '#34C759'; // verde padrão (normal)
               if (typeof value === 'number') {
                 const classification = classifyMetric(keyName, value);
                 if (classification.level === 'alerta') {
                   valueColor = '#FFD60A'; // amarelo
                 } else if (classification.level === 'falha') {
                   valueColor = '#FF3B30'; // vermelho
                 }
               }
             
              return (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#2C2C2E' }}>
                  <Text style={{ color: '#FFFFFF', fontSize: 15 }}>{new Date(r.dataHora).toLocaleString()}</Text>
                    <Text style={{ color: valueColor, fontWeight: '600', fontSize: 15 }}>
                    {typeof value === 'number' ? value.toFixed(2) : value}{meta.unit ? ' ' + meta.unit : ''}
                  </Text>
                </View>
              );
            })()}
          </View>
        )}

        {!historyCollapsed && (
          <>
            {loadingHistory ? (
              <ActivityIndicator color="#0328d4" style={{ marginVertical: 8 }} />
            ) : historyError ? (
              <Text style={{ color: '#FF3B30' }}>{historyError && historyError.includes('Failed to fetch') ? 'Não foi possível conectar ao backend. Verifique a URL e se o backend está rodando.' : historyError}</Text>
            ) : (
              <>


                {/* Lista das últimas 20 leituras */}
                <View style={{ marginTop: 12 }}>
              {history.slice(-20).map((r, idx) => {
                let value: number | string | undefined = '';
                if (keyName === 'temperatura_ds18b20') value = r.temperatura;
                else if (keyName === 'pressao02_hx710b') value = r.pressao;
                else if (keyName === 'vibracao_vib_x') value = r.vibracaoX;
                else if (keyName === 'vibracao_vib_y') value = r.vibracaoY;
                else if (keyName === 'vibracao_vib_z') value = r.vibracaoZ;
                else if (keyName === 'velocidade_m_s') value = r.velocidade;
                else if (keyName === 'chave_fim_de_curso') value = r.ativo ? 'ATIVADA' : 'DESATIVADA';
               
                 // Determina a cor baseada no estado
                 let valueColor = '#34C759'; // verde padrão (normal)
                 if (typeof value === 'number') {
                   const classification = classifyMetric(keyName, value);
                   if (classification.level === 'alerta') {
                     valueColor = '#FFD60A'; // amarelo
                   } else if (classification.level === 'falha') {
                     valueColor = '#FF3B30'; // vermelho
                   }
                 }
               
                return (
                  <View key={r.dataHora + idx} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#2C2C2E' }}>
                    <Text style={{ color: '#FFFFFF', fontSize: 15 }}>{new Date(r.dataHora).toLocaleString()}</Text>
                      <Text style={{ color: valueColor, fontWeight: '600', fontSize: 15 }}>
                      {typeof value === 'number' ? value.toFixed(2) : value}{meta.unit ? ' ' + meta.unit : ''}
                    </Text>
                  </View>
                );
              })}
              {history.length === 0 && (
                <Text style={{ color: '#8E8E93' }}>Sem leituras registradas</Text>
              )}
            </View>
              </>
            )}
          </>
        )}
      </View>

      {/* Espaçamento no final */}
      <View style={{ height: 40 }} />
      
      {/* Modal para Possíveis Motivos */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalReasonsVisible}
        onRequestClose={() => setModalReasonsVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, alignSelf: 'center' }}>
              <ReasonsIconSvg size={48} color="#d1d1d6" />
              <Text style={styles.modalTitle}>Possíveis motivos</Text>
            </View>
            <ScrollView style={{ maxHeight: 400, marginTop: 16 }}>
              {modalContent.map((item, index) => (
                <Text key={`reason_${index}`} style={styles.modalItem}>
                  • {item}
                </Text>
              ))}
            </ScrollView>
            <TouchableOpacity
              onPress={() => setModalReasonsVisible(false)}
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal para Possíveis Soluções */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalSolutionsVisible}
        onRequestClose={() => setModalSolutionsVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, alignSelf: 'center' }}>
              <LightBulbIconSvg size={48} color="#d1d1d6" />
              <Text style={styles.modalTitle}>Possíveis soluções</Text>
            </View>
            <ScrollView style={{ maxHeight: 400, marginTop: 16 }}>
              {modalContent.map((item, index) => (
                <Text key={`solution_${index}`} style={styles.modalItem}>
                  • {item}
                </Text>
              ))}
            </ScrollView>
            <TouchableOpacity
              onPress={() => setModalSolutionsVisible(false)}
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Feedback Indicator */}
      <FeedbackIndicator
        visible={feedback.visible}
        type={feedback.type}
        message={feedback.message}
        duration={feedback.type === 'success' && isInitialLoad === false ? 1500 : 3000}
        onHide={() => setFeedback(prev => ({ ...prev, visible: false }))}
      />
    </ScrollView>
  );
};

export default MetricScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0C0E',
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    alignItems: 'center',
  },
  title: {
    color: '#FFFFFF',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    color: '#8E8E93',
    textAlign: 'center',
  },
  actionButton: {
    marginTop: 8,
    alignSelf: 'center',
    backgroundColor: '#2C2C2E',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#FFFFFF',
  },
  card: {
    backgroundColor: '#1C1C1E',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    overflow: 'visible',
  },
  label: {
    color: '#8E8E93',
    marginBottom: 8,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  value: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '600',
    flex: 1,
  },
  statusIcon: {
    fontSize: 24,
    marginLeft: 12,
  },
  timestamp: {
    marginTop: 6,
    color: '#8E8E93',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  modalItem: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 12,
    lineHeight: 24,
  },
  modalCloseButton: {
    marginTop: 20,
    backgroundColor: '#0328d4',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
