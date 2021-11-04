import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import PressableCard from './pressableCard';

export default function ItemCard({mainTextLeft, mainTextRight='', subText, styleType, onPress}) {
    const styles = stylesMap[styleType];
    return (
        <PressableCard onPress={onPress}>
            <View style={styles.row}>
                <Text style={styles.mainText}>{mainTextLeft}</Text>
                <Text style={styles.mainText}>{mainTextRight}</Text>
            </View>
            <Text style={styles.subText}>{subText}</Text>
        </PressableCard>
    );
}

const baseStyles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    subText: {
        fontSize: 10,
        color: '#888',
    }
});

const confirmedStyles = StyleSheet.create({
    ...baseStyles,
    mainText: {
        fontSize: 20,
        fontWeight: 'bold',
    }
});

const pendingStyles = StyleSheet.create({
    ...baseStyles,
    mainText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#888',
    }
});

const actionRequiredStyles = StyleSheet.create({
    ...baseStyles,
    mainText: {
        fontSize: 20,
        fontWeight: 'bold',
        fontStyle: 'italic'
    },
    subText: {
        fontSize: 10,
        fontWeight: 'bold',
    }
});

const stylesMap = {
    confirmed: confirmedStyles,
    pending: pendingStyles,
    actionRequired: actionRequiredStyles
}