import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FlatButton from '../../shared/button';
import { globalStyles } from '../../styles/global';

export default function Landing({ navigation }) {
    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.introText}>Challenge a friend to stay fit!</Text>
            <View style={styles.buttonContainer}>
                <FlatButton title='Register' onPress={() => navigation.navigate('Register')}/>
            </View>
            <View style={styles.buttonContainer}>
                <FlatButton title='Login' onPress={() => navigation.navigate('Login')}/>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        marginTop: 30
    }
});