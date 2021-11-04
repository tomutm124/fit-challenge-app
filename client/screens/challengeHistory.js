import React, { useState, useEffect, useContext } from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import dayjs from 'dayjs';
import * as challengeService from '../services/challenge';
import * as challengeSummaryService from '../services/challengeSummary';
import { globalStyles } from '../styles/global';
import ItemCard from '../shared/itemCard';
import { FriendsContext } from '../global';
import { formatDateForDisplay } from '../services/utils';
import LoadingOverlay from '../shared/loadingOverlay';
import { getResultDescription } from '../services/utils';

export default function ChallengeHistory({ navigation }) {
    const [pastChallenges, setPastChallenges] = useState(undefined);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        challengeService.getPastChallengesAsync().then(setPastChallenges);
    }, []);
    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.screenTitle}>History</Text>
            {pastChallenges && pastChallenges.length > 0 ? (
                <FlatList 
                    data={pastChallenges} 
                    keyExtractor={challenge => challenge.id}
                    renderItem={({ item }) => (
                        <PastChallengeCard
                            challenge={item}
                            startLoading={() => setLoading(true)}
                            challengeSummaryCallback={(challengeSummary) => {
                                setLoading(false);
                                navigation.push('ChallengeSummary', {
                                    challenge: item,
                                    challengeSummary: challengeSummary
                                });
                            }}
                        />
                    )}
                /> ) : (
                <Text style={styles.normalText}>You do not have any past challenge</Text>
            )}
            <LoadingOverlay visible={loading} />
        </View>
    );
}

function PastChallengeCard({ challenge, startLoading, challengeSummaryCallback }) {
    const friends = useContext(FriendsContext);
    const startDateDayjs = dayjs(challenge.startDate);
    const startDate = startDateDayjs.toDate();
    const endDate = startDateDayjs.add(challenge.numDays, 'day').toDate();
    const friendName = friends.getNameByUid(challenge.opponentUid);
    var scoreText = 'scores not finalized';
    if (challenge.finalScores) {
        const selfFinalScore = challenge.selfFinalScore;
        const opponentFinalScore = challenge.opponentFinalScore;
        const resultDescription = getResultDescription(selfFinalScore, opponentFinalScore);
        scoreText = `${resultDescription} ${selfFinalScore} vs ${opponentFinalScore}`;
    }
    return <ItemCard
        mainTextLeft={`${formatDateForDisplay(startDate)} - ${formatDateForDisplay(endDate)}`}
        subText={`vs ${friendName}, ${scoreText}`}
        styleType='confirmed'
        onPress={() => {
            startLoading();
            challengeSummaryService.getChallengeSummaryAsync(challenge).then(challengeSummaryCallback);
        }}
    />;
}

const styles = StyleSheet.create({
    normalText: {
        fontSize: 18,
        textAlign: 'center',
    },
});