import React from 'react';
import { KeyboardAvoidingView, Platform } from "react-native";

export default function FlexKeyboardAvoidingView({ children, style }) {
    let innerStyle = {flex: 1};
    if (style) {
        innerStyle = {...innerStyle, ...style};
    }
    return (
        <KeyboardAvoidingView 
            style={innerStyle} 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            { children }
        </KeyboardAvoidingView>
    );
}