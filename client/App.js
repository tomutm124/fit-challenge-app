import React, { useState, useEffect } from 'react';
import firebase from 'firebase'
import { RootSiblingParent } from 'react-native-root-siblings';
import AppLoading from 'expo-app-loading';
import AuthStack from './routes/authStack';
import MainStack from './routes/mainStack';
import { registerForPushNotificationsAsync } from './services/notification';
import { firebaseConfig } from './secrets';

// firebase configs (including API key) are ignored from git

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig); 
}

function Main() {
  const [user, setUser] = useState(undefined);
  useEffect(() => {
    return firebase.auth().onAuthStateChanged(user => {
      if (user != null) {
        registerForPushNotificationsAsync();
      }
      setUser(user);
    });
  }, []);

  if (user === undefined) {
    return <AppLoading />;
  }
  if (user == null) {
    return <AuthStack />;
  } else {
    return <MainStack />;
  }
}

export default function App() {
  // wrap in RootSiblingParent to enable Toast
  return (
    <RootSiblingParent>
      <Main />
    </RootSiblingParent>
  );
}

