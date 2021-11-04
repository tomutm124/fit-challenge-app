import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Register from '../screens/auth/register';
import Landing from '../screens/auth/landing';
import Login from '../screens/auth/login';

export default function AuthStack() {
    const Stack = createNativeStackNavigator();
    return (
        <NavigationContainer>
            <Stack.Navigator 
                screenOptions={{
                    headerBackTitleVisible: false
                }}
            >
                <Stack.Screen name="Fit Challenge" component={Landing} />
                <Stack.Screen name="Register" component={Register} />
                <Stack.Screen name="Login" component={Login} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}