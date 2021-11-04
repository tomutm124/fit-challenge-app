import * as paths from '../../services/databasePath';

test('getChallengePath is correct', () => {
    expect(paths.getChallengePath('challenge1')).toBe('/challenges/challenge1');
});

test('getUserPath is correct', () => {
    expect(paths.getUserPath('user1')).toBe('/users/user1');
});

test('getChallengeDetailsDayPath is correct', () => {
    expect(paths.getChallengeDetailsDayPath('challenge1', 2)).toBe('/challengeDetails/challenge1/2');
});

test('getChallengeSummaryPath is correct', () => {
    expect(paths.getChallengeSummaryPath('challenge1')).toBe('/challengeSummaries/challenge1');
});

test('getAllFriendsPath is correct', () => {
    expect(paths.getAllFriendsPath('user1')).toBe('/users/user1/friends');
});