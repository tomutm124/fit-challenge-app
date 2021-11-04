import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ListItem({ onPress, text, endText, disabled=false }) {
    var itemContainerStyle = styles.itemContainer;
    if (disabled) {
        itemContainerStyle = {
            opacity: 0.5,
            ...itemContainerStyle
        };
    }
    return (
        <TouchableOpacity onPress={onPress} disabled={disabled} >
            <View style={itemContainerStyle}>
                <Text style={styles.text}>{text}</Text>
                {Boolean(endText) && <Text style={styles.endText}>{endText}</Text>}
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    itemContainer: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#f2f2f2',
        paddingHorizontal: 20,
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
    },
    endText: {
        fontSize: 12,
        color: '#888',
    }
})