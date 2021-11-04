import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import Toast from 'react-native-root-toast';

import { globalStyles } from '../../styles/global';
import FlatButton from '../../shared/button';
import NewChallengeForm from './newChallengeForm';
import ClosableModal from '../../shared/closableModal';
import * as challengeService from '../../services/challenge';
import { FriendsContext } from '../../global';
import Card from '../../shared/card';

export default function Welcome() {
    const [newChallengeFormVisible, setNewChallengeFormVisible] = useState(false);
    const [challengeInvites, setChallengeInvites] = useState(null);
    useEffect(() => challengeService.listenOnInvites(setChallengeInvites), []);
    const friends = useContext(FriendsContext);

    const submitForm = (formValues) => {
        setNewChallengeFormVisible(false);
        const toastForCreating = Toast.show('Creating challenge...');
        challengeService.createChallenge(formValues).then(() => {
            Toast.hide(toastForCreating);
            Toast.show('Challenge created');
        }).catch((err) => {
            console.log(`Error encountered when creating challenge: ${err}`);
            Toast.hide(toastForCreating);
            Toast.show('Error encountered when creating challenge. Please try again.', {
                duration: Toast.durations.LONG,
            });
        });
    };

    return (
        <View style={globalStyles.container}>
            <ClosableModal visible={newChallengeFormVisible} onCancel={() => setNewChallengeFormVisible(false)}>
                <Text style={globalStyles.modalHeader}>Create New Challenge</Text>
                <NewChallengeForm submitForm={submitForm}/>
            </ClosableModal>
            <Text style={globalStyles.introText}>Start by creating a challenge!</Text>
            <FlatButton title='Create Challenge' onPress={() => setNewChallengeFormVisible(true)}/>
            <View style={styles.sectionDivider}></View>
            <Text style={globalStyles.introText}>Challenge Invites</Text>
            {challengeInvites && challengeInvites.length > 0 ? (
                <FlatList 
                    data={challengeInvites} 
                    keyExtractor={invite => invite.challengeId}
                    renderItem={({ item }) => (
                        <Card>
                            <Text style={styles.normalText}>From {friends.getNameByUid(item.host)}</Text>
                            <View style={globalStyles.row}>
                                <View style={globalStyles.rowItem}>
                                    <FlatButton 
                                        title='Accept' 
                                        onPress={() => challengeService.acceptChallenge(item.challengeId)}
                                    />
                                </View>
                                <View style={{width: 10}}></View>
                                <View style={globalStyles.rowItem}>
                                    <FlatButton
                                        title='Decline'
                                        onPress={() => challengeService.declineChallenge(item.challengeId)}
                                        colorType='secondary'
                                    />
                                </View>
                            </View>
                        </Card>
                    )}
                /> ) : (
                <Text style={styles.normalText}>You do not have any pending invite</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    normalText: {
        fontSize: 18,
        textAlign: 'center',
    },
    sectionDivider: {
        height: 40,
    },
    row: {
        flexDirection: 'row'
    }
});