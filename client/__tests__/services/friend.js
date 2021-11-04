import firebase from 'firebase';
import * as friendService from '../../services/friend';
const waitForExpect = require("wait-for-expect");

// firebase.database is mocked to point to the emulator in the setup script setupTests.js
const db = firebase.database();

beforeEach(() => {
    return db.ref().set({
        users: {
            user1: {
                active: true,
                friends: {
                    user2: 'Mary'
                }
            },
            user2: {
                active: true
            },
            user3: {
                active: true
            }
        }
    });
});

afterAll(() => {
    return firebase.app().delete();
});

test("addFriendAsync adds a friend when friend is active user", async () => {
    await friendService.addFriendAsync({
        uid: 'user3',
        name: 'Peter'
    });
    const friendName = (await db.ref('/users/user1/friends/user3').get()).val();
    expect(friendName).toBe('Peter');
});

test("addFriendAsync throws exception when friend is not active user", () => {
    const promise = friendService.addFriendAsync({
        uid: 'user4',
        name: 'Paul'
    });
    return expect(promise).rejects.toBeDefined();
});

test("updateFriendAsync updates existing friend name", async () => {
    await friendService.updateFriendAsync({
        uid: 'user2',
        name: 'Betty'
    });
    const newName = (await db.ref('/users/user1/friends/user2').get()).val();
    expect(newName).toBe('Betty');
});

test("deleteFriend deletes existing friend", async () => {
    await friendService.deleteFriend('user2');
    const friendNameSnapshot = await db.ref('/users/user1/friends/user2').get();
    expect(friendNameSnapshot.exists()).toBe(false);
});

test("listenOnFriends calls callback with current friends", async () => {
    const callback = jest.fn();
    friendService.listenOnFriends(callback);
    await waitForExpect(() => {
        expect(callback).toHaveBeenCalledTimes(1);
    });
    expect(callback.mock.calls[0][0].getNameByUid('user2')).toBe('Mary');
});

test("listenOnFriends calls callback with updated friends after an update", async () => {
    const callback = jest.fn();
    friendService.listenOnFriends(callback);
    friendService.updateFriendAsync({
        uid: 'user2',
        name: 'Betty'
    });
    await waitForExpect(() => {
        expect(callback).toHaveBeenCalledTimes(2);
    });
    expect(callback.mock.calls[0][0].getNameByUid('user2')).toBe('Mary');
    expect(callback.mock.calls[1][0].getNameByUid('user2')).toBe('Betty');
});
  
test("listenOnFriends does not call callback with updated friends after unsubscribe", async () => {
    const callback = jest.fn();
    const unsubscribe = friendService.listenOnFriends(callback);
    unsubscribe();
    friendService.updateFriendAsync({
        uid: 'user2',
        name: 'Betty'
    });
    await new Promise(resolve => setTimeout(resolve, 500));
    expect(callback.mock.calls.length).toBeLessThanOrEqual(1);
});
