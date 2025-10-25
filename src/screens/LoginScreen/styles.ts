
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
    registerButton: {
        marginTop: 10,
        width: '100%',
    },
    registerButtonStyle: {
        backgroundColor: METRIC_SCREEN_COLORS.actionButtonBackground,
        paddingVertical: 12,
    },
    credentialsContainer: {
        padding: 20,
    },
    hint: {
        textAlign: 'center',
        color: SENSORS_LIST_TEXT_COLORS.sensorDescriptionText,
        fontSize: 16,
    },
    credentials: {
        marginTop: 10,
        textAlign: 'center',
        color: SENSORS_LIST_TEXT_COLORS.sensorDescriptionText,
        fontSize: 14,
    },
    errorText: {
        color: '#FF3B30',
        marginBottom: 16,
        textAlign: 'center',
    },
});
