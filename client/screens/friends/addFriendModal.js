import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { globalStyles } from '../../styles/global';
import { formStyles } from '../../styles/form';
import FlatButton from '../../shared/button';
import ClosableModal from '../../shared/closableModal';

const validationSchema = yup.object({
    name: yup.string().required('Name is required'),
    uid: yup.string().required('UID is required'),
});

export default function AddFriendModal({visible, onAdd, onCancel}) {
    return (
        <ClosableModal visible={visible} onCancel={onCancel}>
            <Text style={globalStyles.modalHeader}>Add a new friend!</Text>
            <Formik
                initialValues={{
                    name: '',
                    uid: '',
                }}
                validationSchema={validationSchema}
                onSubmit={(values, actions) => {
                    actions.resetForm();
                    onAdd(values);
                }}
            >
            {(props) => {
                return (
                    <View>
                        <Text style={formStyles.formLabel}>Name (your choice)</Text>
                        <TextInput
                            style={formStyles.input}
                            onChangeText={props.handleChange('name')}
                            value={props.values.name}
                        />
                        <Text style={formStyles.errorText}>
                            { props.touched.name && props.errors.name }
                        </Text>
                        <Text style={formStyles.formLabel}>UID</Text>
                        <TextInput
                            style={formStyles.input}
                            onChangeText={props.handleChange('uid')}
                            value={props.values.uid}
                        />
                        <Text style={formStyles.errorText}>
                            { props.touched.uid && props.errors.uid }
                        </Text>
                        <FlatButton title='Add' onPress={props.handleSubmit} />
                    </View>
                );
            }}
            </Formik>
        </ClosableModal>
    );
}