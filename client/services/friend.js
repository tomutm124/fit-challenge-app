import firebase from 'firebase';
import { getUser } from './auth';
import Friends from '../models/friends';
import { getAllFriendsPath, getUserPath } from './databasePath';

export function addFriendAsync(friend) {
    const user = getUser();
    return isValidUidAsync(friend.uid).then((isValid) => {
        if (!isValid) {
            throw `Unable to add friend. UID ${friend.uid} is invalid.`
        }
        return addOrUpdateFriendAsync(friend);
    });
}

export function updateFriendAsync(friend) {
    return addOrUpdateFriendAsync(friend);
}

export function deleteFriend(friendUid) {
    const user = getUser();
    return firebase.database().ref(`${getAllFriendsPath(user.uid)}/${friendUid}`).remove();
}

export function listenOnFriends(callback) {
    const user = getUser();
    const friendsRef = firebase.database().ref(getAllFriendsPath(user.uid));
    console.log(`Subscribing ${friendsRef.toString()}`)
    const friendsListener = friendsRef.on('value', 
        (snapshot) => callback(new Friends(snapshot.val()))
    );
    return () => friendsRef.off('value', friendsListener);
}

function isValidUidAsync(uid) {
    if (!uid || typeof uid !== 'string') {
        console.log('Wrong uid type');
        return false;
    }
    return firebase.database().ref(`${getUserPath(uid)}/active`).get()
        .then((snapshot) => snapshot.exists() && snapshot.val());
}

function addOrUpdateFriendAsync(friend) {
    const user = getUser();
    return firebase.database().ref(`${getAllFriendsPath(user.uid)}/${friend.uid}`).set(friend.name);
}
