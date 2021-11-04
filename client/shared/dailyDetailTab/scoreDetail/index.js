import React, { useState, useContext } from 'react';
import { View } from 'react-native';
import RecordItemModal from './recordItemModal';
import RecordStepsModal from './recordStepsModal';
import PointItemCardFromDataObject from './pointItemCardFromDataObject';
import ScoreFriendItemModal from './scoreFriendItemModal';
import { DOUBLE_SCORE_ITEMS, FIELDS_WITH_NEGATIVE_SCORES } from '../../../services/challengeDetail';
import { ChallengeContext } from '../../../global';
import { getStepScore } from '../../../services/utils';

export default function ScoreDetail({ scoreDetailData, challenge, friendName, onSave, isSelf }) {
    const activeChallenge = useContext(ChallengeContext);
    const editable = challenge.id === activeChallenge?.id;
    const [isRecordItemModalVisible, setRecordItemModalVisible] = useState(false);
    const [selectedPointItemDetail, setSelectedPointItemDetail] = useState({});
    const [isRecordStepsModalVisible, setRecordStepsModalVisible] = useState(false);
    const [isScoreFriendItemModalVisible, setScoreFriendItemModalVisible] = useState(false);
    const stepsScore = scoreDetailData?.steps === undefined ? 
        undefined : 
        getStepScore(scoreDetailData.steps, challenge.stepUnit, challenge.stepScorePerUnit);
    const stepsPointItemData = {
        selfScore: stepsScore,
        opponentScore: stepsScore,
        description: stepsScore === undefined ? undefined : `${scoreDetailData.steps} steps`
    };
    const openDoubleScoreModal = (isSelf) => {
        if (isSelf) {
            setRecordItemModalVisible(true);
        } else {
            setScoreFriendItemModalVisible(true);
        }
    }

    return (
        <View>
            <RecordItemModal 
                visible={isRecordItemModalVisible}
                editable={editable}
                title={selectedPointItemDetail.title}
                friendName={friendName}
                pointItemData={selectedPointItemDetail.pointItemData}
                maxScore={selectedPointItemDetail.maxScore}
                scoreKeyboardType={selectedPointItemDetail.scoreKeyboardType}
                onCancel={() => setRecordItemModalVisible(false)}
                onSave={(item) => {
                    selectedPointItemDetail.onSave(item);
                    setRecordItemModalVisible(false);
                }}
            />
            <RecordStepsModal
                visible={isRecordStepsModalVisible}
                editable={editable}
                steps={scoreDetailData?.steps}
                stepScorePerUnit={challenge.stepScorePerUnit}
                stepUnit={challenge.stepUnit}
                onCancel={() => setRecordStepsModalVisible(false)}
                onSave={(steps) => {
                    onSave(steps, 'steps');
                    setRecordStepsModalVisible(false);
                }}
            />
            <ScoreFriendItemModal
                visible={isScoreFriendItemModalVisible}
                editable={editable}
                title={selectedPointItemDetail.title}
                friendName={friendName}
                pointItemData={selectedPointItemDetail.pointItemData}
                maxScore={selectedPointItemDetail.maxScore}
                scoreKeyboardType={selectedPointItemDetail.scoreKeyboardType}
                onCancel={() => setScoreFriendItemModalVisible(false)}
                onSave={(item) => {
                    selectedPointItemDetail.onSave(item);
                    setScoreFriendItemModalVisible(false);
                }}
            />

            {
                DOUBLE_SCORE_ITEMS.map(item => (
                    <PointItemCardFromDataObject
                        key={item.fieldName}
                        itemName={item.title}
                        pointItemData={scoreDetailData?.[item.fieldName]}
                        isSelf={isSelf}
                        onPress={() => {
                            if (isSelf || scoreDetailData?.[item.fieldName]?.selfScore !== undefined) {
                                setSelectedPointItemDetail({
                                    title: item.title,
                                    pointItemData: scoreDetailData?.[item.fieldName],
                                    maxScore: challenge[item.fieldName + 'MaxScore'],
                                    scoreKeyboardType: FIELDS_WITH_NEGATIVE_SCORES.includes(item.fieldName) ? 'default' : 'numeric',
                                    onSave: (detail) => onSave(detail, item.fieldName)
                                });
                                openDoubleScoreModal(isSelf);
                            }
                        }}
                    />
                ))
            }
            <PointItemCardFromDataObject 
                itemName="Steps" 
                pointItemData={stepsPointItemData}
                isSelf={isSelf}
                onPress={() => {
                    if (isSelf) {
                        setRecordStepsModalVisible(true);
                    }
                }}
            />
        </View>
    );
}