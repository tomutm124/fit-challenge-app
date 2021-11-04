import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { globalStyles } from '../../styles/global';
import { formStyles } from '../../styles/form';
import ClosableModal from '../../shared/closableModal';
import FlatButton from '../../shared/button';

const validationSchema = yup.object({
    name: yup.string().required('Name is required'),
});

export default function EditFriendModal({ onCancel, visible, friend, onEdit, onDelete }) {
    friend = friend ? friend : {};
    return (
        <ClosableModal onCancel={onCancel} visible={visible}>
            <Text style={globalStyles.modalHeader}>Edit</Text>
            <Text style={styles.friendUid}>User {friend.uid}</Text>
            <Formik
                initialValues={{
                    name: friend.name,
                }}
                validationSchema={validationSchema}
                onSubmit={(values, actions) => {
                    actions.resetForm();
                    onEdit({
                        ...friend,
                        ...values
                    });
                }}
            >
            {(props) => {
                return (
                    <View>
                        <Text style={formStyles.formLabel}>Name</Text>
                        <TextInput
                            style={formStyles.input}
                            onChangeText={props.handleChange('name')}
                            value={props.values.name}
                        />
                        <Text style={formStyles.errorText}>
                            { props.touched.name && props.errors.name }
                        </Text>
                        <FlatButton title='Edit' onPress={props.handleSubmit} />
                        <View style={{height: 8}} />
                        <FlatButton title='Delete Friend' onPress={() => onDelete(friend)} />
                    </View>
                );
            }}
            </Formik>
        </ClosableModal>
    );
}

const styles = StyleSheet.create({
    friendUid: {
        fontSize: 14,
        marginBottom: 10,
    }
});