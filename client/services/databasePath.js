/*
    If this grows, we can break it down into individual files e.g. challenge, friend, ...
    Then we can move this up one level such that /databasePath is sibling of /services
*/

export const CHALLENGE_BASE_PATH = '/challenges';

export function getChallengePath(challengeId) {
    return `${CHALLENGE_BASE_PATH}/${challengeId}`;
}

export function getUserPath(uid) {
    return `/users/${uid}`;
}

export function getChallengeDetailsDayPath(challengeId, day) {
    return `/challengeDetails/${challengeId}/${day}`;
}

export function getChallengeSummaryPath(challengeId) {
    return `/challengeSummaries/${challengeId}`;
}

export function getAllFriendsPath(uid) {
    return `${getUserPath(uid)}/friends`;
}