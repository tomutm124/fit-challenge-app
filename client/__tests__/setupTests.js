import firebase from 'firebase';

// this script is configured in package.json to run before each test module

jest.mock('../services/auth', () =>  {
    // adapted from official doc https://jestjs.io/docs/mock-functions
    const originalModule = jest.requireActual('../services/auth');
    return {
        __esModule: true,
        ...originalModule,
        getUser: () => ({uid: 'user1'})
    };
});

if (firebase.apps.length === 0) {
    firebase.initializeApp({
        appId: "not-important-since-we-use-emulator",
        projectId: "not-important-since-we-use-emulator",
    }); 
}
const db = firebase.database();
db.useEmulator("localhost", 9000);
firebase.database = jest.fn(x => db);