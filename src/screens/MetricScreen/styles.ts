import { StyleSheet } from 'react-native';
import { METRIC_SCREEN_COLORS, METRIC_SCREEN_TEXT_COLORS, THEME_VERSION } from '../../config/themeColors';

// ╔══════════════════════════════════════════════════════════════════════════════╗
// ║                     ESTILOS - TELA DE MÉTRICAS                               ║
// ║                                                                              ║
// ║  ⚠️  NÃO ALTERE AS CORES AQUI!                                              ║
// ║  📍 Para alterar cores, edite: src/config/themeColors.ts                    ║
// ║                                                                              ║
// ║  Este arquivo apenas importa e aplica as cores do themeColors.ts           ║
// ║  Versão do tema atual: ${THEME_VERSION}                                     ║
// ╚══════════════════════════════════════════════════════════════════════════════╝

// Importando cores do arquivo centralizado (NÃO EDITE AQUI!)
const COLORS = METRIC_SCREEN_COLORS;
const TEXT_COLORS = METRIC_SCREEN_TEXT_COLORS;
// =================================================

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.appBackground,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    alignItems: 'center',
    width: '100%',
  },
  title: {
    color: TEXT_COLORS.titleText,
    marginBottom: 4,
    textAlign: 'center',
    width: '100%',
  },
  subtitle: {
    color: TEXT_COLORS.subtitleText,
    textAlign: 'center',
    width: '100%',
  },
  actionButton: {
    marginTop: 8,
    alignSelf: 'center',
    backgroundColor: COLORS.actionButtonBackground,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionButtonText: {
    color: TEXT_COLORS.actionButtonText,
  },
  card: {
    backgroundColor: COLORS.cardBackground,
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',  // Centraliza horizontalmente
    justifyContent: 'center',  // Centraliza verticalmente
  },
  label: {
    color: TEXT_COLORS.labelText,
    marginBottom: 8,
    textAlign: 'center',  // Centraliza o texto
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    color: TEXT_COLORS.valueText,
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',  // Centraliza o texto
  },
  statusIcon: {
    marginLeft: 8,
    fontSize: 24,
  },
  timestamp: {
    marginTop: 6,
    color: TEXT_COLORS.timestampText,
    textAlign: 'center',  // Centraliza o texto
  },
});
