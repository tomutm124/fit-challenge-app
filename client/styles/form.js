import { StyleSheet } from "react-native";

export const formStyles = StyleSheet.create({
    sectionHeaderText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 8,
        fontSize: 16,
        borderRadius: 6,
    },
    errorText: {
        color: 'crimson',
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 6,
        textAlign: 'center',
    },
    formLabel: {
        paddingLeft: 4,
        fontSize: 12,
        fontWeight: 'bold',
    },
});