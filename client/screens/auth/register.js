import React, { useState } from 'react';
import { View, Text, TextInput, Alert } from 'react-native';
import { globalStyles } from '../../styles/global';
import { formStyles } from '../../styles/form';
import FlatButtom from '../../shared/button';
import LoadingOverlay from '../../shared/loadingOverlay';
import firebase from 'firebase'
import { Formik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object({
    email: yup.string().required().email(),
    password: yup.string().required().min(8),
    confirmPassword: yup.string().required()
        .test('is-the-same-as-password', 'Does not match with password.', 
            function (value) {
                return value == this.parent.password;
            }),
});

export default function Register() {
    const [loading, setLoading] = useState(false);
    const register = (userDetails) => {
        setLoading(true);
        firebase.auth().createUserWithEmailAndPassword(userDetails.email, userDetails.password)
            .then((result) => {
                console.log('Registration success.');
                setLoading(false);
                firebase.database().ref('users/' + result.user.uid).set({
                    active: true
                });
            }).catch((error) => {
                console.log(`Registration error: ${error}`);
                setLoading(false);
                Alert.alert('Error! :(', 'An error occurred. Please try again.', [
                    {text: 'Dismiss'}
                ])
            });
    };

    return (
        <View style={globalStyles.container}>
            <Formik
                initialValues={{email: '', password: '', confirmPassword: ''}}
                validationSchema={validationSchema}
                onSubmit={(values, actions) => {
                    actions.resetForm();
                    register(values);
                }}
            >
            {(props) => (
                <View>
                    <TextInput
                        placeholder='Email'
                        onChangeText={props.handleChange('email')}
                        value={props.values.email}
                        style={formStyles.input}
                        keyboardType='email-address'
                    />
                    <Text style={formStyles.errorText}>{props.touched.email && props.errors.email}</Text>

                    <TextInput
                        placeholder='Password'
                        onChangeText={props.handleChange('password')}
                        value={props.values.password}
                        secureTextEntry={true}
                        style={formStyles.input}
                    />
                    <Text style={formStyles.errorText}>{props.touched.password && props.errors.password}</Text>

                    <TextInput
                        placeholder='Confirm Password'
                        onChangeText={props.handleChange('confirmPassword')}
                        value={props.values.confirmPassword}
                        secureTextEntry={true}
                        style={formStyles.input}
                    />
                    <Text style={formStyles.errorText}>{props.touched.confirmPassword && props.errors.confirmPassword}</Text>

                    <FlatButtom title='Register' onPress={props.handleSubmit} />
                </View>
            )}
            </Formik>
            <LoadingOverlay visible={loading} />
        </View>
    )
}
