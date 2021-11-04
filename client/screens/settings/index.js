import React, { useContext } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import Toast from 'react-native-root-toast';
import * as Clipboard from 'expo-clipboard';
import { backgroundColor } from '../../styles/global';
import ListItem from '../../shared/listItem';
import { signOut, getUser } from '../../services/auth';
import * as challengeService from '../../services/challenge';
import { ChallengeContext } from '../../global';

export default function Settings({ navigation }) {
    const currentChallenge = useContext(ChallengeContext);
    const uidOnPress = () => {
        Clipboard.setString(getUser().uid);
        Toast.show('Copied UID to clipboard');
    };
    const quitChallenge = () => {
        Alert.alert('Exit Challenge', 'Are you sure you want to exit your current challenge?', [
            {text: 'Yes', onPress: () => {
                challengeService.quitChallenge(currentChallenge?.id);
                navigation.navigate('Home');
            }},
            {text: 'No'}
        ]);
    };

    return (
        <View style={styles.background}>
            <ListItem text='UID' endText={getUser().uid} onPress={uidOnPress} />
            <ListItem text='Friends' onPress={() => navigation.navigate('Friends')} />
            <ListItem text='History' onPress={() => navigation.navigate('ChallengeHistory')} />
            <ListItem text='Exit Challenge' disabled={!currentChallenge} onPress={quitChallenge} />
            <ListItem text='Logout' onPress={signOut} />
        </View>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: backgroundColor
    }
});