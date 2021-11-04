import * as challengeSummaryService from '../../services/challengeSummary';
import firebase from 'firebase';
import Challenge from '../../models/challenge';
const waitForExpect = require("wait-for-expect");

const db = firebase.database();

const mockedDbData = {
    challengeSummaries: {
        challenge1: {
            1: {
                user1: {
                    isComplete: true,
                    score: 23.45
                },
                user2: {
                    isComplete: false,
                    score: 12.34
                },
            },
            2: {
                user1: {
                    isComplete: false,
                    score: 31.41
                },
            }
        }
    }
};

beforeEach(async () => {
    await db.ref().set(mockedDbData);
});

afterAll(() => {
    return firebase.app().delete();
});

const challenge = new Challenge({
    id: 'challenge1',
    host: 'user1',
    guest: 'user2',
    numDays: 3,
    startDate: '2021-10-03'
}, 'user1');

test("listenOnChallengeSummary calls callback with specified data", async () => {
    const callback = jest.fn();
    challengeSummaryService.listenOnChallengeSummary(challenge, callback);
    await waitForExpect(() => {
        expect(callback).toHaveBeenCalledTimes(1);
    });
    const challengeSummary = callback.mock.calls[0][0];
    expect(challengeSummary.totalScores.opponent).toBeCloseTo(12.34);
});

test("listenOnChallengeSummary calls callback with updated data after DB update", async () => {
    const callback = jest.fn();
    challengeSummaryService.listenOnChallengeSummary(challenge, callback);
    await db.ref('/challengeSummaries/challenge1/2/user2').set({isComplete: true, score: 25.8});
    await waitForExpect(() => {
        expect(callback).toHaveBeenCalledTimes(2);
    });
    const challengeSummary = callback.mock.calls[1][0];
    expect(challengeSummary.totalScores.opponent).toBeCloseTo(12.34 + 25.8);
});

test("listenOnChallengeSummary does not call callback after unsubscribe", async () => {
    const callback = jest.fn();
    const unsubscribe = challengeSummaryService.listenOnChallengeSummary(challenge, callback);
    unsubscribe();
    await db.ref('/challengeSummaries/challenge1/2/user2').set({isComplete: true, score: 25.8});
    await new Promise(resolve => setTimeout(resolve, 500));
    expect(callback.mock.calls.length).toBeLessThanOrEqual(1);
});

test("getChallengeSummaryAsync returns specified challenge summary", async () => {
    const challengeSummary = await challengeSummaryService.getChallengeSummaryAsync(challenge);
    expect(challengeSummary.totalScores.opponent).toBeCloseTo(12.34);
});