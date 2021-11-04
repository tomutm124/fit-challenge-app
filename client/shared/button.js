import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { buttonColors, buttonTextColor } from '../styles/global';

export default function FlatButton({ title, onPress, disabled=false, colorType='primary' }) {
    var buttonStyle = {
        ...styles.button,
        backgroundColor: buttonColors[colorType],
        opacity: disabled ? 0.5 : 1,
    };
    return (
        <TouchableOpacity onPress={onPress} disabled={disabled}>
            <View style={buttonStyle}>
            <Text style={styles.buttonText}>{title}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 10,
  },
  buttonText: {
    color: buttonTextColor,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontSize: 16,
    textAlign: 'center',
  }
});