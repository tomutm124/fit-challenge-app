import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import Card from './card';
import { falsyToZero } from '../services/utils';

export default function TotalScoreCard({ totalScores, friendName, selfScale, opponentScale }) {
    return (
        <Card>
            <Text style={styles.title}>Challenge Total</Text>
            <View style={styles.row}>
                <Text style={styles.scores}> 
                    You: {falsyToZero(totalScores?.self)} pts
                </Text>
                {selfScale != 1 && <Text style={styles.scale}>  (scaled by {selfScale})</Text>}
            </View>
            <View style={styles.row}>
                <Text style={styles.scores}>
                    {friendName}: {falsyToZero(totalScores?.opponent)} pts
                </Text>
                {opponentScale != 1 && <Text style={styles.scale}>  (scaled by {opponentScale})</Text>}
            </View>
        </Card>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    scores: {
        fontSize: 16
    },
    scale: {
        fontSize: 12,
        color: '#888',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-end'
    }
});