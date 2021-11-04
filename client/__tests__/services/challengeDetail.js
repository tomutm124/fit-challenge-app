import * as challengeDetailService from '../../services/challengeDetail';
import firebase from 'firebase';
import Challenge from '../../models/challenge';
const waitForExpect = require("wait-for-expect");

const db = firebase.database();

const mockedDbData = {
    challengeDetails: {
        challenge1: {
            1: {
                user1: {
                    breakfast: {
                        description: "bacon",
                        selfScore: 4,
                        opponentScore: 5
                    }
                },
                user2: {
                    breakfast: {
                        description: "eggs",
                        selfScore: 3,
                        opponentScore: 2
                    }
                }
            },
            2: {
                user1: {
                    breakfast: {
                        description: "salmon",
                        selfScore: 6,
                        opponentScore: 6
                    },
                    steps: 10000
                },
                user2: {
                    breakfast: {
                        description: "cereal",
                        selfScore: 4,
                        opponentScore: 2
                    }
                }
            }
        }
    }
}

beforeEach(async () => {
    await db.ref().set(mockedDbData);
});

afterAll(() => {
    return firebase.app().delete();
});

test("listenOnDailyData calls callback with specified data with uid mapped to self and opponent", async () => {
    const callback = jest.fn();
    challengeDetailService.listenOnDailyData('challenge1', 2, callback);
    await waitForExpect(() => {
        expect(callback).toHaveBeenCalledTimes(1);
    });
    const dailyData = callback.mock.calls[0][0];
    // user1 mapped to self and user2 mapped to opponent
    expect(dailyData.self.breakfast.description).toBe('salmon');
    expect(dailyData.opponent.breakfast.description).toBe('cereal');
});

test("listenOnDailyData calls callback with updated data after DB update", async () => {
    const callback = jest.fn();
    challengeDetailService.listenOnDailyData('challenge1', 2, callback);
    await db.ref('/challengeDetails/challenge1/2/user2/breakfast/description').set('tuna');
    await waitForExpect(() => {
        expect(callback).toHaveBeenCalledTimes(2);
    });
    const updatedDailyData = callback.mock.calls[1][0];
    // user1 mapped to self and user2 mapped to opponent
    expect(updatedDailyData.self.breakfast.description).toBe('salmon');
    expect(updatedDailyData.opponent.breakfast.description).toBe('tuna');
});

test("listenOnDailyData does not call callback with updated data after unsubscribe", async () => {
    const callback = jest.fn();
    const unsubscribe = challengeDetailService.listenOnDailyData('challenge1', 2, callback);
    unsubscribe();
    await db.ref('/challengeDetails/challenge1/2/user2/breakfast/description').set('tuna');
    await new Promise(resolve => setTimeout(resolve, 500));
    expect(callback.mock.calls.length).toBeLessThanOrEqual(1);
});

const challenge = new Challenge({
    id: 'challenge1',
    host: 'user1',
    guest: 'user2'
}, 'user1');

test("updateChallengeDetailItem updates existing item with object in DB", async () => {
    await challengeDetailService.updateChallengeDetailItem({description: "sardines"}, challenge, 2, 
        'user1', 'breakfast');
    const newDescription = (await db.ref('/challengeDetails/challenge1/2/user1/breakfast/description').get()).val();
    expect(newDescription).toBe('sardines');
});

test("updateChallengeDetailItem updates existing item with number in DB", async () => {
    await challengeDetailService.updateChallengeDetailItem(12000, challenge, 2, 
        'user1', 'steps');
    const steps = (await db.ref('/challengeDetails/challenge1/2/user1/steps').get()).val();
    expect(steps).toBe(12000);
});

test("updateChallengeDetailItem creates new item with object in DB", async () => {
    await challengeDetailService.updateChallengeDetailItem({description: "chicken"}, challenge, 2, 
        'user1', 'dinner');
    const description = (await db.ref('/challengeDetails/challenge1/2/user1/dinner/description').get()).val();
    expect(description).toBe('chicken');
});

test("updateChallengeDetailItem creates new item with number in DB", async () => {
    await challengeDetailService.updateChallengeDetailItem(14000, challenge, 1, 
        'user1', 'steps');
    const steps = (await db.ref('/challengeDetails/challenge1/1/user1/steps').get()).val();
    expect(steps).toBe(14000);
});


