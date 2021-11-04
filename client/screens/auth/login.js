import React, { useState } from 'react';
import { View, TextInput, Text } from 'react-native';
import { globalStyles } from '../../styles/global';
import { formStyles } from '../../styles/form';
import FlatButtom from '../../shared/button';
import LoadingOverlay from '../../shared/loadingOverlay';
import firebase from 'firebase'
import { Formik } from 'formik';

export default function Login() {
    const [loginErrorMessage, setLoginErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const login = (userDetails) => {
        setLoginErrorMessage('');
        setLoading(true);
        firebase.auth().signInWithEmailAndPassword(userDetails.email, userDetails.password)
            .then(() => setLoading(false))
            .catch((error) => {
                setLoginErrorMessage('Invalid email/password combination.');
                console.log(`Login error: ${error}`);
                setLoading(false);
            });
    };

    return (
        <View style={globalStyles.container}>
            <Formik
                initialValues={{email: '', password: ''}}
                onSubmit={(values, actions) => {
                    actions.resetForm();
                    login(values);
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
                    <Text style={formStyles.errorText}></Text>
                    {/* placeholder to get the padding consistent */}
                    <TextInput
                        placeholder='Password'
                        onChangeText={props.handleChange('password')}
                        value={props.values.password}
                        secureTextEntry={true}
                        style={formStyles.input}
                    />
                    <Text style={formStyles.errorText}>{loginErrorMessage}</Text>
                    <FlatButtom title='Login' onPress={props.handleSubmit} />
                </View>
            )}
            </Formik>
            <LoadingOverlay visible={loading} />
        </View>
    )
}
