
import { StyleSheet } from 'react-native';

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
    backButton: {
        marginTop: 10,
        width: '100%',
    },
    backButtonStyle: {
        backgroundColor: '#2C2C2E',
    },
    errorText: {
        color: '#FF3B30',
        textAlign: 'center',
        marginBottom: 10,
    },
    userTypeLabel: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        alignSelf: 'flex-start',
    },
});
