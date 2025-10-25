
import { StyleSheet } from 'react-native';
import { SENSORS_LIST_COLORS, SENSORS_LIST_TEXT_COLORS, METRIC_SCREEN_COLORS } from '../../config/themeColors';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: SENSORS_LIST_COLORS.appBackground,
    },
    formContainer: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        color: SENSORS_LIST_TEXT_COLORS.titleText,
        textAlign: 'center',
        marginBottom: 30,
    },
    input: {
        marginBottom: 15,
        width: '100%',
    },
    inputText: {
        color: SENSORS_LIST_TEXT_COLORS.titleText,
    },
    button: {
        marginTop: 10,
        width: '100%',
    },
    backButton: {
        marginTop: 10,
        width: '100%',
    },
    backButtonStyle: {
        backgroundColor: METRIC_SCREEN_COLORS.actionButtonBackground,
    },
    errorText: {
        color: '#FF3B30',
        textAlign: 'center',
        marginBottom: 10,
    },
    userTypeLabel: {
        color: SENSORS_LIST_TEXT_COLORS.titleText,
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        alignSelf: 'flex-start',
    },
});
