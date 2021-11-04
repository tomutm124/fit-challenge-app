import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import firebase from 'firebase'
import { getUser } from './auth';
import { getUserPath } from './databasePath';

// adapted from https://docs.expo.dev/push-notifications/push-notifications-setup/
export const registerForPushNotificationsAsync = async () => {
    if (Constants.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            console.log('Notification permission denied');
            return;
        }
        const token = (await Notifications.getExpoPushTokenAsync()).data;
        const user = getUser();
        firebase.database().ref(`${getUserPath(user.uid)}/expoPushToken`).set(token);
        console.log("Saved user's expo push token");
        // verify this when we try on an Andriod device
        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }
    } 
};