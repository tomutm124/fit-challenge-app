import firebase from 'firebase';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { registerForPushNotificationsAsync } from '../../services/notification';

jest.mock('expo-notifications', () =>  {
    // adapted from official doc https://jestjs.io/docs/mock-functions
    return {
        __esModule: true,
        getPermissionsAsync: async () => ({status: 'granted'}),
        requestPermissionsAsync: async () => ({status: 'granted'}),
        getExpoPushTokenAsync: async () => ({data: 'myToken'}),
        setNotificationChannelAsync: jest.fn()
    };
});

const db = firebase.database();

afterAll(() => {
    return firebase.app().delete();
});

test('registerForPushNotificationsAsync sets token to DB', async () => {
    Platform.OS = 'ios';
    Constants.isDevice = true;
    await db.ref().set(null);
    await registerForPushNotificationsAsync();
    const token = (await db.ref('/users/user1/expoPushToken').get()).val();
    expect(token).toBe('myToken');
});

