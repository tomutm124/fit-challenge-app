import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import AppLoading from 'expo-app-loading';
import * as challengeService from '../services/challenge';
import * as challengeSummaryService from '../services/challengeSummary';
import * as friendService from '../services/friend';
import { ChallengeContext, ChallengeSummaryContext, FriendsContext } from '../global';

import Welcome from '../screens/welcome';
import Settings from '../screens/settings';
import Today from '../screens/today';
import ChallengeSummary from '../screens/challengeSummary';
import DailyDetail from '../screens/dailyDetail';
import ChallengeHistory from '../screens/challengeHistory';
import PendingFriendAccept from '../screens/pendingFriendAccept';
import FriendDeclined from '../screens/friendDeclined';
import Friends from '../screens/friends';

export default function MainStack() {
    const [challenge, setChallenge] = useState(undefined);
    useEffect(() => challengeService.listenOnCurrentChallenge(setChallenge), []);
    const [challengeSummary, setChallengeSummary] = useState(undefined);
    useEffect(() => {
        if (challenge) {
            return challengeSummaryService.listenOnChallengeSummary(challenge, setChallengeSummary)
        } else {
            setChallengeSummary(null);
        }
    }, [challenge]);
    const [friends, setFriends] = useState(undefined);
    useEffect(() => friendService.listenOnFriends(setFriends), []);
    if (challenge === undefined || challengeSummary === undefined || friends === undefined) {
        return <AppLoading />;
    }
    const Stack = createNativeStackNavigator();
    return (
        <FriendsContext.Provider value={friends}>
        <ChallengeSummaryContext.Provider value={challengeSummary}>
        <ChallengeContext.Provider value={challenge}>
            <NavigationContainer>
                <Stack.Navigator
                    screenOptions={ ({navigation}) => ({
                        headerBackTitleVisible: false,
                        headerRight: () => (
                            <MaterialIcons
                                name='settings'
                                size={20}
                                onPress={() => navigation.navigate('Settings')}
                            />
                        ),
                    })}
                >
                    {!challenge ? (
                        <Stack.Screen name="Home" component={Welcome} options={{ title: 'Fit Challenge' }}/>
                    ) : !challenge.friendAccepted && challenge.active ? (
                        <Stack.Screen name="Home" component={PendingFriendAccept} options={{ title: 'Fit Challenge' }}/>
                    ) : !challenge.friendAccepted && !challenge.active ? (
                        <Stack.Screen name="Home" component={FriendDeclined} options={{ title: 'Fit Challenge' }}/>
                    ) : (
                        <Stack.Screen name="Home" component={Today} options={{ title: 'Fit Challenge' }}/>
                    )}
                    <Stack.Screen name="Settings" component={Settings} />
                    <Stack.Screen 
                        name="ChallengeSummary" 
                        component={ChallengeSummary} 
                        options={{ title: 'Summary' }}
                    />
                    <Stack.Screen name="DailyDetail" component={DailyDetail} options={{ title: 'Details' }}/>
                    <Stack.Screen name="ChallengeHistory" component={ChallengeHistory} options={{ title: 'History' }}/>
                    <Stack.Screen name="Friends" component={Friends}/>
                </Stack.Navigator>
            </NavigationContainer>
        </ChallengeContext.Provider>
        </ChallengeSummaryContext.Provider>
        </FriendsContext.Provider>
    );
}