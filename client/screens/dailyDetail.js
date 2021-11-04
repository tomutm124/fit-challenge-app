import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { globalStyles } from '../styles/global';
import DailyDetailTab from '../shared/dailyDetailTab';
import LoadingOverlay from '../shared/loadingOverlay';

export default function DailyDetail({ route }) {
    const { challenge, dayNum, title } = route.params;
    const [loading, setLoading] = useState(false);
    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.screenTitle}>{title}</Text>
            <DailyDetailTab challenge={challenge} dayNum={dayNum} setLoading={setLoading} />
            <LoadingOverlay visible={loading} />
        </View>
    );
}