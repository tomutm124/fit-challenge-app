import React from 'react';
import { View, TextInput, Text, ScrollView, Image, Dimensions, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import ClosableModal from '../../closableModal';
import { globalStyles, containerPadding } from '../../../styles/global';
import { formStyles } from '../../../styles/form';
import FlatButton from '../../button';
import { getScoreValidation } from './validation';
import FlexKeyboardAvoidingView from '../../flexKeyboardAvoidingView';

export default function ScoreFriendItemModal({ visible, editable, title, friendName, pointItemData, maxScore, 
        scoreKeyboardType, onCancel, onSave }) {
    const imageWidth = Dimensions.get('window').width - containerPadding * 2;

    const validationSchema = yup.object({
        opponentScore: getScoreValidation(maxScore),
    });

    return (
        <ClosableModal visible={visible} onCancel={onCancel}>
            <Text style={globalStyles.modalHeader}>{title}</Text>
            <FlexKeyboardAvoidingView>
                <ScrollView>
                    {pointItemData?.imageUrl && 
                        <Image 
                            source={{ uri: pointItemData?.imageUrl }} 
                            style={{width: imageWidth, height: imageWidth, marginBottom: 20}} 
                            />
                    }
                    <Text style={styles.description}>{pointItemData?.description}</Text>
                    <Text style={styles.friendScore}>{friendName} gave a score of {pointItemData?.selfScore}</Text>
                    <Formik
                        initialValues={{
                            opponentScore: pointItemData?.opponentScore !== undefined ? String(pointItemData?.opponentScore) : '',
                        }}
                        validationSchema={validationSchema}
                        onSubmit={(values, actions) => {
                            values.opponentScore = parseFloat(values.opponentScore);
                            actions.resetForm();
                            onSave(values);
                        }}
                    >
                    {(props) => (
                        <View>
                            <Text style={formStyles.formLabel}>Your score (max {maxScore})</Text>
                            <TextInput
                                style={formStyles.input}
                                keyboardType={scoreKeyboardType}
                                onChangeText={props.handleChange('opponentScore')}
                                value={props.values.opponentScore}
                            />
                            <Text style={formStyles.errorText}>
                                { props.touched.opponentScore && props.errors.opponentScore}
                            </Text>
                            <FlatButton title='Save' disabled={!editable} onPress={props.handleSubmit} />
                        </View>
                    )}
                    </Formik>
                </ScrollView>
            </FlexKeyboardAvoidingView>
        </ClosableModal>
    );
}

const styles = StyleSheet.create({
    description: {
        marginBottom: 16,
        fontSize: 20,
    },
    friendScore: {
        marginBottom: 16,
        fontSize: 16
    }
});
