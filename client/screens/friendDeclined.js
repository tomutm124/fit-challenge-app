import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import { FriendsContext, ChallengeContext } from '../global';
import * as challengeService from '../services/challenge';
import FlatButton from '../shared/button';
import { globalStyles } from '../styles/global';

export default function FriendDeclined() {
    const challenge = useContext(ChallengeContext);
    const friends = useContext(FriendsContext);
    const friendName = friends.getNameByUid(challenge.opponentUid);
    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.introText}>{friendName} declined your invitation.</Text>
            <FlatButton 
                title='Exit Challenge'
                onPress={() => {
                    challengeService.quitChallenge(challenge.id, false);
                    challengeService.deleteChallenge(challenge.id);
                }}
            />
        </View>
    );
}