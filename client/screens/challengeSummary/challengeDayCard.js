import React from 'react';
import dayjs from 'dayjs';
import ItemCard from '../../shared/itemCard';
import { falsyToZero, dateDiffInDays, getResultDescription } from '../../services/utils';

export default function ChallengeDayCard({ challenge, dayNum, dailySummary, onPressIfNotFuture }) {
    const date = dayjs(challenge.startDate).add(dayNum - 1, 'day').toDate();
    const selfUid = challenge.selfUid;
    const opponentUid = challenge.opponentUid;
    const isComplete = dailySummary?.[selfUid]?.isComplete && dailySummary?.[opponentUid]?.isComplete;
    const isFuture = dateDiffInDays(date, new Date()) > 0;
    const selfScore = falsyToZero(dailySummary?.[selfUid]?.score);
    const opponentScore = falsyToZero(dailySummary?.[opponentUid]?.score);
    const resultDescription = getResultDescription(selfScore, opponentScore);
    const scoreText = `${selfScore} vs ${opponentScore}`;
    return (
        <ItemCard
            mainTextLeft={dailySummary.title}
            mainTextRight=''
            subText={isFuture ? '' : isComplete ? `Data confirmed - ${resultDescription} ${scoreText}` : 'Data incomplete - ' + scoreText}
            styleType={isFuture ? 'pending' : isComplete ? 'confirmed' : 'actionRequired'}
            onPress={() => {
                if (!isFuture) {
                    onPressIfNotFuture();
                }
            }}
        />
    );
}

