import firebase from 'firebase'
import { challengeSummaryCache } from '../global';
import ChallengeSummary from '../models/challengeSummary';
import { getUser } from './auth';
import { getChallengeSummaryPath } from './databasePath';

export function listenOnChallengeSummary(challenge, callback) {
    const ref = firebase.database().ref(getChallengeSummaryPath(challenge.id));
    console.log(`Subscribing ${ref.toString()}`);
    const listener = ref.on('value', 
        (snapshot) => 
            callback(processChallengeSummaryFromDb(snapshot.val(), challenge))
    );
    return () => ref.off('value', listener);
}

export function getChallengeSummaryAsync(challenge) {
    if (challengeSummaryCache[challenge.id]) {
        return Promise.resolve(challengeSummaryCache[challenge.id]);
    }
    return firebase.database().ref(getChallengeSummaryPath(challenge.id)).get().then((snapshot) => {
        const challengeSummary = processChallengeSummaryFromDb(snapshot.val(), challenge);
        challengeSummaryCache[challenge.id] = challengeSummary;
        return challengeSummary;
    });
}

function processChallengeSummaryFromDb(challengeSummaryFromDb, challenge) {
    const selfUid = getUser().uid;
    return new ChallengeSummary(challengeSummaryFromDb, selfUid, challenge.startDate, 
        challenge.numDays);
}