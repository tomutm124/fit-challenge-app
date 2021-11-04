import React, { useState, useEffect, useContext } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { backgroundColor } from '../../styles/global';
import ScoreDetail from './scoreDetail';
import * as challengeDetailService from '../../services/challengeDetail';
import { FriendsContext } from '../../global';

export default function DailyDetailTab({ challenge, dayNum, setLoading, extraItem }) {
    const friends = useContext(FriendsContext);
    const [dailyData, setDailyData] = useState(undefined);
    useEffect(() => challengeDetailService.listenOnDailyData(challenge.id, dayNum, setDailyData), [challenge, dayNum]);
    const selfData = dailyData?.self;
    const opponentData = dailyData?.opponent;
    const selfUid = challenge.selfUid;
    const opponentUid = challenge.opponentUid;
    const friendName = friends.getNameByUid(opponentUid, 'Friend');
    const getSaveChallengeDetailCallback = (isSelf) => {
        const uid = isSelf ? selfUid : opponentUid;
        return (item, itemKey) => {
            setLoading(true);
            challengeDetailService.updateChallengeDetailItem(item, challenge, dayNum, uid, itemKey)
                .then(() => setLoading(false));
        }
    }
    const saveChallengeDetailForSelf = getSaveChallengeDetailCallback(true);
    const saveChallengeDetailForOpponent = getSaveChallengeDetailCallback(false);

    const Tab = createMaterialTopTabNavigator();
    return (
        <Tab.Navigator 
            screenOptions={{
                tabBarStyle: styles.tabBar,
            }}
        >
            <Tab.Screen name="You">
                {() => (
                    <ScrollView contentContainerStyle={{backgroundColor}}>
                        <View style={{height: 6}}></View>
                        <ScoreDetail 
                            scoreDetailData={selfData} 
                            challenge={challenge} 
                            isSelf={true}
                            friendName={friendName}
                            onSave={saveChallengeDetailForSelf}
                        />
                        {Boolean(extraItem) && extraItem}
                    </ScrollView>
                )}
            </Tab.Screen>
            <Tab.Screen name={friendName}>
                {() => (
                    <ScrollView contentContainerStyle={{backgroundColor}}>
                        <View style={{height: 6}}></View>
                        <ScoreDetail 
                            scoreDetailData={opponentData} 
                            challenge={challenge} 
                            isSelf={false}
                            friendName={friendName}
                            onSave={saveChallengeDetailForOpponent}
                        />
                        {Boolean(extraItem) && extraItem}
                    </ScrollView>
                )}
            </Tab.Screen>
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        height: 42, 
        marginTop: -8
    }
});
