import React, { useContext } from 'react';
import { FlatList, View } from 'react-native';
import { globalStyles } from '../../styles/global';
import ChallengeDayCard from './challengeDayCard';
import TotalScoreCard from '../../shared/totalScoreCard';
import { FriendsContext } from '../../global';

export default function ChallengeSummary({ route, navigation }) {
    const { challenge, challengeSummary } = route.params;
    const friends = useContext(FriendsContext);
    const friendName = friends.getNameByUid(challenge.opponentUid);
    const dailySummaries = challengeSummary.toList();
    return (
        <View style={globalStyles.container}>
            <TotalScoreCard
                totalScores={challengeSummary?.totalScores}
                friendName={friendName}
                selfScale={challenge.selfScale}
                opponentScale={challenge.opponentScale}
            />
            <FlatList 
                data={dailySummaries} 
                keyExtractor={dailySummary => String(dailySummary.day)}
                renderItem={({ item }) => (
                    <ChallengeDayCard 
                        challenge={challenge}
                        dayNum={item.day}
                        dailySummary={item}
                        onPressIfNotFuture={() => navigation.push('DailyDetail', {
                            challenge: challenge,
                            dayNum: item.day,
                            title: item.title
                        })}
                    />
                )}
            />
        </View>
    );
}