import React from 'react';
import PointItemCard from './pointItemCard';
import { getDoubleScore } from '../../../services/utils';

export default function PointItemCardFromDataObject({ itemName, pointItemData, isSelf, onPress }) {
    // if not isSelf, selfScore is user's friend's score
    const recorded = pointItemData?.selfScore !== undefined;
    const confirmed = pointItemData?.opponentScore !== undefined;
    const score = getDoubleScore(pointItemData?.selfScore, pointItemData?.opponentScore);
    var description = isSelf ? 'Tap to record!' : 'Pending record';
    if (recorded && confirmed) {
        description = pointItemData.description;
    } else if (recorded) {
        if (isSelf) {
            description = pointItemData.description + ' - pending confirm';
        } else {
            description = pointItemData.description + ' - tap to score!';
        }
    }
    var styleType = 'pending';
    if (isSelf && !recorded || !isSelf && recorded && !confirmed) {
        styleType = 'actionRequired'
    } else if (recorded && confirmed) {
        styleType = 'confirmed'
    }
    return (
        <PointItemCard 
            itemName={itemName} 
            point={score} 
            description={description} 
            styleType={styleType}
            onPress={onPress}
        />
    );
}