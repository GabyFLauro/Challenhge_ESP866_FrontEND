
import { StyleSheet } from 'react-native';
import { SENSOR_DETAIL_COLORS, SENSOR_DETAIL_TEXT_COLORS, THEME_VERSION } from '../../config/themeColors';

// ╔══════════════════════════════════════════════════════════════════════════════╗
// ║                ESTILOS - TELA DE DETALHES DO SENSOR                          ║
// ║                                                                              ║
// ║  ⚠️  NÃO ALTERE AS CORES AQUI!                                              ║
// ║  📍 Para alterar cores, edite: src/config/themeColors.ts                    ║
// ║                                                                              ║
// ║  Este arquivo apenas importa e aplica as cores do themeColors.ts           ║
// ║  Versão do tema atual: ${THEME_VERSION}                                     ║
// ╚══════════════════════════════════════════════════════════════════════════════╝

// Importando cores do arquivo centralizado (NÃO EDITE AQUI!)
const COLORS = SENSOR_DETAIL_COLORS;
const TEXT_COLORS = SENSOR_DETAIL_TEXT_COLORS;
// =================================================

export const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.appBackground,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: TEXT_COLORS.titleText,
  },
  sensorInfoContainer: {
    backgroundColor: COLORS.sensorInfoBackground,
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  infoLabel: {
    fontSize: 14,
    color: TEXT_COLORS.infoLabelText,
    flex: 1,
    marginRight: 8,
  },
  infoValue: {
    fontSize: 14,
    color: TEXT_COLORS.infoValueText,
    flex: 2,
    textAlign: 'right',
    fontWeight: '500',
  },
  noDataContainer: {
    backgroundColor: COLORS.noDataBackground,
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    marginVertical: 10,
  },
  noDataText: {
    fontSize: 16,
    color: TEXT_COLORS.noDataText,
    textAlign: 'center',
    marginBottom: 8,
  },
  noDataSubtext: {
    fontSize: 14,
    color: TEXT_COLORS.noDataSubtext,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  statusLabel: {
    fontSize: 18,
    marginRight: 8,
    color: TEXT_COLORS.statusLabelText,
  },
  statusValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    marginRight: 8,
  },
  statusValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  currentValueContainer: {
    backgroundColor: COLORS.currentValueBackground,
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',  // Centraliza horizontalmente
    justifyContent: 'center',  // Centraliza verticalmente
  },
  currentValueLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: TEXT_COLORS.currentValueLabelText,
    textAlign: 'center',  // Centraliza o texto
  },
  currentValue: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',  // Centraliza o texto
  },
  chartContainer: {
    backgroundColor: COLORS.chartBackground,
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: TEXT_COLORS.chartTitleText,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  historyContainer: {
    backgroundColor: COLORS.historyBackground,
    padding: 16,
    borderRadius: 10,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: TEXT_COLORS.historyTitleText,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  historyText: {
    fontSize: 16,
    color: TEXT_COLORS.historyItemText,
  },
  updateButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  updateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});