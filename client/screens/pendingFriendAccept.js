import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import { FriendsContext, ChallengeContext } from '../global';
import { globalStyles } from '../styles/global';

export default function PendingFriendAccept() {
    const challenge = useContext(ChallengeContext);
    const friends = useContext(FriendsContext);
    const friendName = friends.getNameByUid(challenge.opponentUid);
    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.introText}>Waiting for {friendName} to accept challenge...</Text>
        </View>
    );
}