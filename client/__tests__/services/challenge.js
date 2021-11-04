import firebase from 'firebase';
import * as challengeService from '../../services/challenge';
const waitForExpect = require("wait-for-expect");

const db = firebase.database();

const mockedDbData = {
    users: {
        user1: {
            active: true,
            currentChallengeId: 'challenge1',
            pastChallenges: {
                oldChallenge1: true,
                oldChallenge3: true,
                oldChallenge2: true
            },
            challengeInvites: {
                challenge2: 'user3'
            }
        },
        user2: {
            active: true,
            currentChallengeId: 'challenge1'
        }
    },
    challenges: {
        challenge1: {
            breakfastMaxScore: 4,
            host: 'user1',
            guest: 'user2',
            hostScale: 1.1,
            guestScale: 1
        },
        challenge2: {
            dinnerMaxScore: 10,
            friendAccepted: false,
            host: 'user1',
            guest: 'user2',
        },
        oldChallenge1: {
            lunchMaxScore: 1,
            host: 'user2',
            guest: 'user1',
        },
        oldChallenge3: {
            lunchMaxScore: 3,
            host: 'user1',
            guest: 'user2',
        },
        oldChallenge2: {
            lunchMaxScore: 2,
            host: 'user1',
            guest: 'user2',
        }
    }
};

beforeEach(async () => {
    await db.ref().set(mockedDbData);
});

afterAll(() => {
    return firebase.app().delete();
});

test("createChallenge creates challenge in DB, sets user's currentChallengeId, and invites friend", async () => {
    await db.ref().set(null);  // start with an empty DB instead of the default mock data in this test
    const challengeFormData = {
        "breakfastMaxScore" : '5',
        "dinnerMaxScore" : '10',
        "exerciseMaxScore" : '5',
        "guest" : "user2",
        "guestScale" : '1',
        "hostScale" : '1.05',
        "lunchMaxScore" : '10',
        "numDays" : '7',
        "snacksMaxScore" : '2',
        "startDate" : new Date('2021-10-02T12:00:00'),
        "stepScorePerUnit" : '1',
        "stepUnit" : '1000'
    };
    await challengeService.createChallenge(challengeFormData);
    const challengeId = (await db.ref('/users/user1/currentChallengeId').get()).val();
    expect(challengeId).toBeTruthy();
    const challengeInDb = (await db.ref(`/challenges/${challengeId}`).get()).val();
    expect(challengeInDb.breakfastMaxScore).toBe(5);
    expect(challengeInDb.hostScale).toBeCloseTo(1.05);
    expect(challengeInDb.startDate).toBe('2021-10-02');
    expect(challengeInDb.host).toBe('user1');
    expect(challengeInDb.active).toBe(true);
    expect(challengeInDb.friendAccepted).toBe(false);
    const friendInviteExists = (await db.ref(`/users/user2/challengeInvites/${challengeId}`).get()).exists();
    expect(friendInviteExists).toBe(true);
});

test('listenOnCurrentChallenge calls callback with current challenge', async () => {
    const callback = jest.fn();
    challengeService.listenOnCurrentChallenge(callback);
    await waitForExpect(() => {
        expect(callback).toHaveBeenCalledTimes(1);
    });
    const challenge = callback.mock.calls[0][0];
    expect(challenge.breakfastMaxScore).toBe(4);
    expect(challenge.host).toBe('user1');
    // challenge here is a Challenge model with selfScale, not simply JSON-like object from DB
    expect(challenge.selfScale).toBeCloseTo(1.1);
});

test('listenOnCurrentChallenge calls callback with updated challenge after an update', async () => {
    const callback = jest.fn();
    challengeService.listenOnCurrentChallenge(callback);
    await db.ref('/challenges/challenge1/breakfastMaxScore').set(3);
    await waitForExpect(() => {
        expect(callback).toHaveBeenCalledTimes(2);
    });
    const updatedChallenge = callback.mock.calls[1][0];
    expect(updatedChallenge.breakfastMaxScore).toBe(3);
    expect(updatedChallenge.host).toBe('user1');
});

test('listenOnCurrentChallenge does not call callback with updated challenge after unsubscribe', async () => {
    const callback = jest.fn();
    const unsubscribe = challengeService.listenOnCurrentChallenge(callback);
    unsubscribe();
    await db.ref('/challenges/challenge1/breakfastMaxScore').set(3);
    await new Promise(resolve => setTimeout(resolve, 500));
    expect(callback.mock.calls.length).toBeLessThanOrEqual(1);
});

test('getPastChallengesAsync returns list of past challenges', async () => {
    const pastChallenges = await challengeService.getPastChallengesAsync();
    expect(pastChallenges.length).toBe(3);
    // pastChallenges are sorted by reverse order of their names since challenge names are timestamp
    expect(pastChallenges[0].lunchMaxScore).toBe(3);
    expect(pastChallenges[1].lunchMaxScore).toBe(2);
    expect(pastChallenges[2].lunchMaxScore).toBe(1);
});

test("quitChallenge removes user's current challengeId, sets challenge as inactive, add to pastChallenge, " 
    + "and label user as quitted in the challenge", async () => {
        await challengeService.quitChallenge('challenge1');
        const currentChallengeId = (await db.ref('/users/user1/currentChallengeId').get()).val();
        expect(currentChallengeId).toBeNull();
        const challengeActive = (await db.ref('/challenges/challenge1/active').get()).val();
        expect(challengeActive).toBe(false);
        const pastChallengeExists = (await db.ref('/users/user1/pastChallenges/challenge1').get()).exists();
        expect(pastChallengeExists).toBe(true);
        const quitedUserExists = (await db.ref('/challenges/challenge1/quittedUsers/user1').get()).exists();
        expect(quitedUserExists).toBe(true);
    });

test("acceptChallenge sets user's current challengeId, removes invite, and sets challenge's accepted flag", 
    async () => {
        await challengeService.acceptChallenge('challenge2');
        const currentChallengeId = (await db.ref('/users/user1/currentChallengeId').get()).val();
        expect(currentChallengeId).toBe('challenge2');
        const inviteExists = (await db.ref('/users/user1/challengeInvites/challenge2').get()).exists();
        expect(inviteExists).toBe(false);
        const challengeAccepted = (await db.ref('/challenges/challenge2/friendAccepted').get()).val();
        expect(challengeAccepted).toBe(true);
    });

test("declineChallenge sets challenge as inactive, removes from invite list, and does not " 
    + "change current challenge Id", async () => {
        await challengeService.declineChallenge('challenge2');
        const challengeActive = (await db.ref('/challenges/challenge2/active').get()).val();
        expect(challengeActive).toBe(false);
        const inviteExists = (await db.ref('/users/user1/challengeInvites/challenge2').get()).exists();
        expect(inviteExists).toBe(false);
        const currentChallengeId = (await db.ref('/users/user1/currentChallengeId').get()).val();
        expect(currentChallengeId).toBe('challenge1');
    });

test("deleteChallenge removes challenge from DB", async () => {
    await challengeService.deleteChallenge('challenge2');
    const challengeExists = (await db.ref('/challenges/challenge2').get()).exists();
    expect(challengeExists).toBe(false);
});