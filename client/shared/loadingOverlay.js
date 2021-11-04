import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export default function LoadingOverlay({ visible }) {
    if (!visible) {
        return null;
    }
    return (
        <View style={styles.loading}>
            <ActivityIndicator size='large' />
        </View>  
    );
}

const styles = StyleSheet.create({
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.5,
        backgroundColor: 'black',
    },
});