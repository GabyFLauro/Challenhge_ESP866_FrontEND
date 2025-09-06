
import { StyleSheet } from 'react-native';
import theme from 'react-native-elements/dist/config/theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    formContainer: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 30,
    },
    input: {
        marginBottom: 15,
        width: '100%',
    },
    inputText: {
        color: '#FFFFFF',
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
        backgroundColor: theme.colors.secondary,
        paddingVertical: 12,
    },
    credentialsContainer: {
        padding: 20,
    },
    hint: {
        textAlign: 'center',
        color: '#FFFFFF',
        fontSize: 16,
    },
    credentials: {
        marginTop: 10,
        textAlign: 'center',
        color: '#FFFFFF',
        fontSize: 14,
    },
    errorText: {
        color: '#FF3B30',
        marginBottom: 16,
        textAlign: 'center',
    },
});
