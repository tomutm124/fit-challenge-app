import React, { useContext, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import dayjs from 'dayjs';
import { globalStyles } from '../styles/global';
import { FriendsContext, ChallengeContext, ChallengeSummaryContext } from '../global';
import { getDateTitle } from '../services/utils';
import FlatButton from '../shared/button';
import { dateDiffInDays } from '../services/utils';
import DailyDetailTab from '../shared/dailyDetailTab';
import TotalScoreCard from '../shared/totalScoreCard';
import LoadingOverlay from '../shared/loadingOverlay';

export default function Today({ navigation }) {
    const friends = useContext(FriendsContext);
    const challenge = useContext(ChallengeContext);
    const challengeSummary = useContext(ChallengeSummaryContext);
    const [loading, setLoading] = useState(false);
    const today = new Date();
    const dayNum = challenge ? dateDiffInDays(today, dayjs(challenge.startDate).toDate()) + 1 : undefined;
    if (dayNum < 1) {
        const messageStart = 'Challenge will start';
        const dayUntilStart = 1 - dayNum;
        const messageEnd = dayUntilStart == 1 ? 'tomorrow!' : `in ${dayUntilStart} days!`;
        return (
            <View style={globalStyles.container}>
                <Text style={styles.announcement}>{messageStart + ' ' + messageEnd}</Text>
            </View>
        );
    }
    const title = getDateTitle(today, dayNum, challenge.numDays);
    const friendName = friends.getNameByUid(challenge.opponentUid, 'Your friend');
    var challengeCompleteMessage = null;
    if (challenge.finalScores) {
        const selfFinalScore = challenge.selfFinalScore;
        const opponentFinalScore = challenge.opponentFinalScore;
        if (selfFinalScore > opponentFinalScore) {
            challengeCompleteMessage = 'You win!!! Congratulations!';
        } else if (selfFinalScore < opponentFinalScore) {
            challengeCompleteMessage = "You lose :(\nLet's try again next time!";
        } else {
            challengeCompleteMessage = "It's a tie!";
        }
    }
    const navigateToSummary = () => navigation.navigate('ChallengeSummary', { challenge, challengeSummary });
    const summaryButton = (
        <FlatButton title='Challenge Summary' onPress={navigateToSummary} />
    );
    const showDailyDetailTab = dayNum <= challenge.numDays;
    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.screenTitle}>{title}</Text>
            {challenge.finalScores && (<Text style={styles.announcement}>
                Challenge Complete! {'\n' + challengeCompleteMessage}
            </Text>)}
            {!challenge.active && (<Text style={styles.announcement}>
                {friendName} has left this challenge.
            </Text>)}
            <TotalScoreCard 
                totalScores={challengeSummary?.totalScores} 
                friendName={friendName} 
                selfScale={challenge.selfScale}
                opponentScale={challenge.opponentScale}
            />
            {showDailyDetailTab && (
                <DailyDetailTab 
                    challenge={challenge} 
                    dayNum={dayNum} 
                    setLoading={setLoading}
                    extraItem={summaryButton}
                />
            )}
            {!showDailyDetailTab && summaryButton}
            <LoadingOverlay visible={loading} />
        </View>
    );
}

const styles = StyleSheet.create({
    announcement: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 20,
        marginBottom: 10
    }
});
