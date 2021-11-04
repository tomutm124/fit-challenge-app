const functions = require("firebase-functions");
const admin = require('firebase-admin');
const { Expo } = require('expo-server-sdk');

const DOUBLE_SCORE_FIELDS = ['breakfast', 'lunch', 'dinner', 'snacks', 'exercise'];  // also defined in client

admin.initializeApp();

exports.calculateChallengeSummary = functions.region('asia-southeast1')
    .database.ref('/challengeDetails/{cid}/{dayNum}/{uid}')
    .onWrite((change, context) => {
        const dailyUserData = change.after.val();
        const isComplete = isDailyUserDataComplete(dailyUserData);
        return getChallengeOnceAsync(context.params.cid).then((challenge) => {
            var score = getDailyUserScore(dailyUserData, challenge.stepUnit, challenge.stepScorePerUnit);
            const scale = context.params.uid == challenge.host ? challenge.hostScale : challenge.guestScale;
            score = score * scale;
            const destinationPath = `challengeSummaries/${context.params.cid}/${context.params.dayNum}/${context.params.uid}`;
            return admin.database().ref(destinationPath).set({
                score: score,
                isComplete: isComplete
            });
        });
    });

exports.onChallengeComplete = functions.region('asia-southeast1')
    .database.ref('/challengeSummaries/{cid}')
    .onUpdate((change, context) => {
        const challengeSummary = change.after.val();
        const challengeId = context.params.cid;
        return getChallengeOnceAsync(challengeId).then((challenge) => {
            if (isChallengeCompleted(challengeSummary, challenge.numDays)) {
                const finalScores = getTotalScores(challengeSummary);
                functions.logger.log(`Challenge ${challengeId} completed. Final scores: ${finalScores}`);
                const destinationPath = `challenges/${challengeId}/finalScores`;
                return admin.database().ref(destinationPath).set(finalScores);
            } else {
                return null;
            }
        });
    });

exports.onBothUsersQuit = functions.region('asia-southeast1')
    .database.ref('/challenges/{cid}/quittedUsers')
    .onUpdate((change, context) => {
        const quittedUsers = change.after.val();
        if (Object.keys(quittedUsers).length == 2) {
            const challengeSummaryRef = admin.database().ref(`challengeSummaries/${context.params.cid}`);
            return challengeSummaryRef.once('value').then((snapshot) => {
                const challengeSummary = snapshot.val();
                const finalScores = getTotalScores(challengeSummary);
                const destinationPath = `challenges/${context.params.cid}/finalScores`;
                if (Object.keys(finalScores).length == 2) {
                    return admin.database().ref(destinationPath).set(finalScores);
                } else {
                    return getChallengeOnceAsync(context.params.cid).then((challenge) => {
                        const defaultScores = {
                            [challenge.host]: 0,
                            [challenge.guest]: 0
                        };
                        return admin.database().ref(destinationPath).set({...defaultScores, ...finalScores});
                    });
                }
            });
        } else {
            return null;
        }
    });

exports.sendNotificationOnMealScore = functions.region('asia-southeast1')
    .database.ref('/challengeDetails/{cid}/{dayNum}/{uid}/{item}/selfScore')
    .onCreate(async (snapshot, context) => {
        const item = context.params.item;
        if (DOUBLE_SCORE_FIELDS.includes(item)) {
            const messageBody = `Your friend has recorded their ${item}. Give them a score!`;
            const challenge = await getChallengeOnceAsync(context.params.cid);
            const targetUid = context.params.uid != challenge.host ? challenge.host : challenge.guest;
            const pushTokenRef = admin.database().ref(`/users/${targetUid}/expoPushToken`);
            const pushTokenSnapshot = await pushTokenRef.once('value');
            const pushToken = pushTokenSnapshot.val();
            if (pushToken) {
                return sendNewMealNotification(pushToken, messageBody);
            } else {
                functions.logger.log(`Push token not found for user ${targetUid}`);
                return null;
            }
        }
        return null;
    });

function isDailyUserDataComplete(dailyUserData) {
    if (!dailyUserData) {
        return false;
    }
    for (const doubleScoreField of DOUBLE_SCORE_FIELDS) {
        const fieldData = dailyUserData[doubleScoreField];
        if (!fieldData || fieldData.selfScore === undefined || fieldData.opponentScore === undefined) {
            return false;
        }
    }
    if (dailyUserData.steps === undefined) {
        return false;
    }
    return true;
}

function getDailyUserScore(dailyUserData, stepUnit, stepScorePerUnit) {
    let total = 0;
    if (dailyUserData) {
        for (const doubleScoreField of DOUBLE_SCORE_FIELDS) {
            const fieldData = dailyUserData[doubleScoreField];
            total += getDoubleScore(fieldData?.selfScore, fieldData?.opponentScore);
        }
        total += getStepScore(dailyUserData.steps, stepUnit, stepScorePerUnit);
    }
    return total;
}

function getDoubleScore(selfScore, opponentScore) {
    if (selfScore === undefined) {
        return 0;
    } else if (opponentScore === undefined) {
        return selfScore;
    } else {
        return (selfScore + opponentScore) / 2;
    }
}

function getStepScore(steps, stepUnit, stepScorePerUnit) {
    return steps !== undefined ? parseInt(steps / stepUnit) * stepScorePerUnit : 0;
}

function isChallengeCompleted(challengeSummary, numDays) {
    for (let i=numDays; i>0; i--) {
        // start checking from last day of challenge so we can terminate early
        const dailySummary = challengeSummary?.[i];
        if (!dailySummary || Object.values(dailySummary).length < 2) {
            return false;
        }
        for (const dailyUserData of Object.values(dailySummary)) {
            if (!dailyUserData.isComplete) {
                return false;
            }
        }
    }
    return true;
}

function getTotalScores(challengeSummary) {
    const totalScores = {};
    if (challengeSummary) {
        for (const dailySummary of Object.values(challengeSummary)) {
            for (const [uid, dailyUserData] of Object.entries(dailySummary)) {
                if (totalScores[uid]) {
                    totalScores[uid] += dailyUserData.score;
                } else {
                    totalScores[uid] = dailyUserData.score;
                }
            }
        }
    }
    return totalScores;
}

function getChallengeOnceAsync(challengeId) {
    const challengeRef = admin.database().ref(`challenges/${challengeId}`);
    return challengeRef.once('value').then((snapshot) => snapshot.val());
}

function sendNewMealNotification(pushToken, body) {
    const expo = new Expo();
    if (!Expo.isExpoPushToken(pushToken)) {
        functions.logger.log(`Push token ${pushToken} is not a valid Expo push token`);
        return null;
    }
    const message = {
        to: pushToken,
        sound: 'default',
        body: body
    };
    return expo.sendPushNotificationsAsync([message]);
}

