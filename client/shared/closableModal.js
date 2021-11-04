import React from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { globalStyles } from '../styles/global';

export default function ClosableModal(props) {
    return (
        <Modal visible={props.visible} animationType='slide'>
            <View style={globalStyles.container}>
                <MaterialIcons 
                    name='close'
                    size={24} 
                    style={styles.closeIcon} 
                    onPress={props.onCancel}
                />
                { props.children }
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    closeIcon: {
        marginTop: 20,
        alignSelf: 'flex-start',
    }
});