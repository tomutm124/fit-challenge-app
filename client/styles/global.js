import { StyleSheet } from "react-native";

export const buttonColors = {
    'primary': '#27e3c1',
    'secondary': '#ff5c5c',
}
export const buttonTextColor = 'white';
export const backgroundColor = 'white';
export const disabledInputColor = '#f6f6f6';
export const containerPadding = 20;

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: containerPadding,
        backgroundColor: backgroundColor,
    },
    screenTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalHeader: {
        marginTop: 10,
        marginBottom: 14,
        fontSize: 24,
        fontWeight: 'bold',
    },
    introText: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: containerPadding,
    },
    row: {
        flexDirection: 'row',
    },
    rowItem: {
        flex: 1
    },
});