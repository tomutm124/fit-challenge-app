import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import ClosableModal from '../../closableModal';
import FlatButton from '../../button';
import { globalStyles } from '../../../styles/global';
import { formStyles } from '../../../styles/form';

const validationSchema = yup.object({
    steps: yup.string()
        .required('Please record the number of steps')
        .test('is-non-negative-int', 'No. of steps must be a non-negative integer', (val) => parseInt(val) >= 0)
});

export default function RecordStepsModal({ visible, editable, onCancel, steps, stepScorePerUnit, stepUnit, onSave }) {
    return (
        <ClosableModal visible={visible} onCancel={onCancel}>
            <Text style={globalStyles.modalHeader}>Steps</Text>
            <Formik
                initialValues={{
                    steps: steps !== undefined ? String(steps) : '',
                }}
                validationSchema={validationSchema}
                onSubmit={(values, actions) => {
                    actions.resetForm();
                    onSave(parseInt(values.steps));
                }}
            >
            {(props) => (
                <View>
                    <Text style={formStyles.formLabel}>No. of Steps ({stepScorePerUnit} pt per {stepUnit} steps)</Text>
                    <TextInput style={formStyles.input}
                        onChangeText={props.handleChange('steps')}
                        value={props.values.steps}
                        />
                    <Text style={formStyles.errorText}>
                        { props.touched.steps && props.errors.steps}
                    </Text>
                    <FlatButton title='Save' disabled={!editable} onPress={props.handleSubmit} />
                </View>
            )}
            </Formik>
        </ClosableModal>
    );
}