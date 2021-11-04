import firebase from 'firebase'
import { getUser } from './auth';
import { getChallengeDetailsDayPath, getUserPath } from './databasePath';

export const DOUBLE_SCORE_ITEMS = [
    {fieldName: 'breakfast', title: 'Breakfast'},
    {fieldName: 'lunch', title: 'Lunch'},
    {fieldName: 'dinner', title: 'Dinner'},
    {fieldName: 'snacks', title: 'Snacks'},
    {fieldName: 'exercise', title: 'Exercise'}
];
export const DOUBLE_SCORE_FIELDS = DOUBLE_SCORE_ITEMS.map(item => item.fieldName);
export const FIELDS_WITH_NEGATIVE_SCORES = ['snacks'];

export function listenOnDailyData(challengeId, dayNum, callback) {
    const selfUid = getUser().uid;
    const ref = firebase.database().ref(getChallengeDetailsDayPath(challengeId, dayNum));
    console.log(`Subscribing ${ref.toString()}`);
    const listener = ref.on('value', (snapshot) => {
        const dailyData = snapshot.val();
        if (dailyData) {
            for (const uid of Object.keys(dailyData)) {
                if (uid == selfUid) {
                    dailyData.self = dailyData[uid];
                } else {
                    dailyData.opponent = dailyData[uid];
                }
                delete dailyData[uid];
            }
        }
        callback(dailyData);
    });
    return () => {
        ref.off('value', listener);
    };
}

export function updateChallengeDetailItem(item, challenge, day, uid, itemKey) {
    const dbRef = firebase.database().ref(`${getChallengeDetailsDayPath(challenge.id, day)}/${uid}/${itemKey}`);
    if (typeof item === 'object') {
        if (item.image !== undefined) {
            if (item.prevImageRefPath !== undefined) {
                firebase.storage().ref().child(item.prevImageRefPath).delete();
            }
            delete item.prevImageRefPath;
            return uploadImage(item.image, challenge.host, challenge.guest).then((imageData) => {
                delete item.image;
                item.imageUrl = imageData[0];
                item.imageRefPath = imageData[1];
                return dbRef.update(item);
            });
        } else {
            return dbRef.update(item);
        }
    } else {
        return dbRef.set(item);
    } 
}

async function uploadImage(image, permittedUid1, permittedUid2) {
    const uid = getUser().uid;
    const basePath = `images/${uid}/`
    const imageKey = firebase.database().ref(`${getUserPath(uid)}/images`).push().key;
    const imagePath = basePath + imageKey;
    const imageData = await fetch(image);
    const blob = await imageData.blob();
    const metadata = {
        customMetadata: {
            permittedUid1: permittedUid1,
            permittedUid2: permittedUid2
        }
    };
    const snapshot = await firebase.storage().ref().child(imagePath).put(blob, metadata);
    const downloadUrl = await snapshot.ref.getDownloadURL()
    return [downloadUrl, imagePath];
}
