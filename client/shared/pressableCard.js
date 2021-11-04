import React from 'react';
import { TouchableOpacity } from 'react-native';
import Card from './card';

export default function PressableCard({ onPress, children }) {
    return (
        <TouchableOpacity onPress={onPress}>
            <Card>
                {children}
            </Card>
        </TouchableOpacity>
    );
}