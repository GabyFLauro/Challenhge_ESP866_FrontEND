import { StyleSheet } from 'react-native';
import { SENSORS_LIST_COLORS, SENSORS_LIST_TEXT_COLORS, THEME_VERSION } from '../../config/themeColors';

// ╔══════════════════════════════════════════════════════════════════════════════╗
// ║                ESTILOS - TELA DE LISTA DE SENSORES                           ║
// ║                                                                              ║
// ║  ⚠️  NÃO ALTERE AS CORES AQUI!                                              ║
// ║  📍 Para alterar cores, edite: src/config/themeColors.ts                    ║
// ║                                                                              ║
// ║  Este arquivo apenas importa e aplica as cores do themeColors.ts           ║
// ║  Versão do tema atual: ${THEME_VERSION}                                     ║
// ╚══════════════════════════════════════════════════════════════════════════════╝

// Importando cores do arquivo centralizado (NÃO EDITE AQUI!)
const COLORS = SENSORS_LIST_COLORS;
const TEXT_COLORS = SENSORS_LIST_TEXT_COLORS;
// =================================================

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.appBackground,
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        color: TEXT_COLORS.titleText,
        flex: 1,
    },
    backendStatus: {
        color: TEXT_COLORS.backendStatusText,
        fontSize: 12,
        marginTop: 4,
    },
    investigateButton: {
        backgroundColor: '#FF9500',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        alignItems: 'center',
    },
    investigateButtonText: {
        color: TEXT_COLORS.investigateButtonText,
        fontSize: 14,
        fontWeight: '600',
    },
    investigationResult: {
        backgroundColor: COLORS.investigationResultBackground,
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#FF9500',
    },
    investigationResultText: {
        color: TEXT_COLORS.investigationResultText,
        fontSize: 12,
        fontFamily: 'monospace',
        lineHeight: 16,
    },
    scrollView: {
        flex: 1,
    },
    sensorCard: {
        backgroundColor: COLORS.sensorCardBackground,
        borderRadius: 10,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        borderLeftWidth: 4,
        borderLeftColor: '#0328d4',
    },
    sensorInfo: {
        flex: 1,
    },
    sensorName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: TEXT_COLORS.sensorNameText,
        marginBottom: 4,
    },
    sensorLocation: {
        fontSize: 14,
        color: TEXT_COLORS.sensorLocationText,
        marginBottom: 2,
    },
    sensorDescription: {
        fontSize: 13,
        color: TEXT_COLORS.sensorDescriptionText,
        marginBottom: 4,
        fontStyle: 'italic',
    },
    currentValue: {
        fontSize: 15,
        color: TEXT_COLORS.currentValueText,
        fontWeight: '600',
        marginBottom: 4,
    },
    lastUpdate: {
        fontSize: 12,
        color: TEXT_COLORS.lastUpdateText,
    },
    statusContainer: {
        alignItems: 'center',
        marginLeft: 16,
    },
    status: {
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 4,
    },
}); 