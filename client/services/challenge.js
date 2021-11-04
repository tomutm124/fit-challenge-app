import firebase from 'firebase'
import { getUser } from './auth';
import { formatDateForDb } from './utils';
import Challenge from '../models/challenge';
import { getChallengePath, getUserPath, CHALLENGE_BASE_PATH } from './databasePath';

export const FORM_DEFAULT_VALUES = {
    stepScorePerUnit: '0.5',
    stepUnit: '1000',
    hostScale: '1',
    guestScale: '1'
};
const INT_FIELDS = ['numDays', 'breakfastMaxScore', 'lunchMaxScore', 'dinnerMaxScore', 'snacksMaxScore', 
    'exerciseMaxScore', 'stepUnit'];
const FLOAT_FIELDS = ['stepScorePerUnit', 'hostScale', 'guestScale'];
const STRING_FIELDS = ['guest'];

export function createChallenge(formData) {
    const challenge = {};
    const user = getUser();
    challenge.host = user.uid;
    challenge.active = true;
    challenge.friendAccepted = false;
    challenge.startDate = formatDateForDb(formData.startDate);
    for (const [key, defaultValue] of Object.entries(FORM_DEFAULT_VALUES)) {
        if (formData[key] === undefined || formData[key] === '') {
            formData[key] = defaultValue;
        }
    }
    for (const intField of INT_FIELDS) {
        challenge[intField] = parseInt(formData[intField]);
    }
    for (const floatField of FLOAT_FIELDS) {
        challenge[floatField] = parseFloat(formData[floatField]);
    }
    for (const stringField of STRING_FIELDS) {
        challenge[stringField] = formData[stringField];
    }
    console.log(`Challenge created: ${challenge}`);
    const challengeBaseRef = firebase.database().ref(CHALLENGE_BASE_PATH);
    const challengeKey = challengeBaseRef.push().key;
    var updates = {};
    updates[getChallengePath(challengeKey)] = challenge;
    updates[`${getUserPath(user.uid)}/currentChallengeId`] = challengeKey;
    updates[`${getUserPath(formData.guest)}/challengeInvites/${challengeKey}`] = user.uid;
    return challengeBaseRef.root.update(updates);
}

export function listenOnCurrentChallenge(callback) {
    /*
        We have two listeners here. The first one listens to user's current challenge ID.
        Base on that ID, the second one listens to the actual challenge with that ID
    */
    const user = getUser();
    const challengeIdRef = firebase.database().ref(`${getUserPath(user.uid)}/currentChallengeId`);
    var challengeRef = null;
    var challengeListener = null;
    console.log(`Subscribing ${challengeIdRef.toString()}`);
    const challengeIdListener = challengeIdRef.on('value', (snapshot) => {
        const challengeId = snapshot.val();
        // when currentChallengeId changes, we need to unsubsribe the previous challenge
        if (challengeListener) {
            challengeRef.off('value', challengeListener);
        }
        if (!challengeId) {
            callback(null);
            return;
        }
        // and then subscribe to the new challenge
        challengeRef = firebase.database().ref(getChallengePath(challengeId));
        console.log(`Subscribing ${challengeRef.toString()}`);
        challengeListener = challengeRef.on('value', 
            (challengeSnapshot) => 
                callback(processChallengeFromDb(challengeSnapshot.val(), challengeId))
        );
    });
    const unsubscribeAll = () => {
        challengeIdRef.off('value', challengeIdListener);
        if (challengeListener) {
            challengeRef.off('value', challengeListener);
        }
    };
    return unsubscribeAll;
}

export async function getPastChallengesAsync() {
    const user = getUser();
    const pastChallengeId = await firebase.database().ref(`${getUserPath(user.uid)}/pastChallenges`).get()
        .then((snapshot) => snapshot.val() ? snapshot.val() : null);
    if (pastChallengeId) {
        const pastChallenges = await Promise.all(
            Object.keys(pastChallengeId).sort().reverse().map((cid) => {
                return firebase.database().ref(getChallengePath(cid)).get().then(
                    snapshot => processChallengeFromDb(snapshot.val(), cid)
                );
            })
        );
        return pastChallenges.filter(c => c);
    }
    return Promise.resolve(null);
}

export function listenOnInvites(callback) {
    const user = getUser();
    const invitesRef = firebase.database().ref(`${getUserPath(user.uid)}/challengeInvites`);
    console.log(`Subscribing ${invitesRef.toString()}`)
    const invitesListener = invitesRef.on('value', (snapshot) => {
        if (snapshot.val()) {
            const invites = Object.entries(snapshot.val()).map(entry => ({
                challengeId: entry[0],
                host: entry[1]
            }));
            callback(invites);
        } else {
            callback([]);
        }
    });
    return () => invitesRef.off('value', invitesListener);
}

export function quitChallenge(challengeId, recordAsPastChallenge=true) {
    const user = getUser();
    var updates = {};
    updates[`${getChallengePath(challengeId)}/active`] = false;
    updates[`${getChallengePath(challengeId)}/quittedUsers/${user.uid}`] = true;
    updates[`${getUserPath(user.uid)}/currentChallengeId`] = null;
    if (recordAsPastChallenge) {
        updates[`${getUserPath(user.uid)}/pastChallenges/${challengeId}`] = true;
    }
    return firebase.database().ref().update(updates);
}

export function acceptChallenge(challengeId) {
    const user = getUser();
    var updates = {};
    updates[`${getChallengePath(challengeId)}/friendAccepted`] = true;
    updates[`${getUserPath(user.uid)}/currentChallengeId`] = challengeId;
    updates[`${getUserPath(user.uid)}/challengeInvites/${challengeId}`] = null;
    return firebase.database().ref().update(updates);
}

export function declineChallenge(challengeId) {
    const user = getUser();
    var updates = {};
    updates[`${getChallengePath(challengeId)}/active`] = false;
    updates[`${getUserPath(user.uid)}/challengeInvites/${challengeId}`] = null;
    return firebase.database().ref().update(updates);
}

export function deleteChallenge(challengeId) {
    return firebase.database().ref(getChallengePath(challengeId)).remove();
}

function processChallengeFromDb(challenge, challengeId) {
    if (challenge) {
        challenge.id = challengeId;
        return new Challenge(challenge, getUser().uid);
    } else {
        return null;
    }
}
