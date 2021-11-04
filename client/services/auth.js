import firebase from 'firebase'

export function signOut() {
    return firebase.auth().signOut();
}

export function getUser() {
    return firebase.auth().currentUser;
}