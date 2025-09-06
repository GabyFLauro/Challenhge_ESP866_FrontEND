import theme from "react-native-elements/dist/config/theme";

export const styles = {
    scrollContent: {
        padding: 20,
    },
    button: {
        marginBottom: 20,
        width: '100%',
    },
    buttonStyle: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 12,
    },
    logoutButton: {
        backgroundColor: theme.colors.error,
        paddingVertical: 12,
    },
    actionButton: {
        marginTop: 8,
        width: '48%',
    },
    confirmButton: {
        backgroundColor: theme.colors.success,
        paddingVertical: 8,
    },
    cancelButton: {
        backgroundColor: theme.colors.error,
        paddingVertical: 8,
    },
    dateTime: {
        fontSize: 16,
        fontWeight: '700',
        color: theme.colors.black,
    },
};
