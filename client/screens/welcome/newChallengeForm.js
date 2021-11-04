import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { globalStyles } from '../../styles/global';
import { formStyles } from '../../styles/form';
import FlatButtom from '../../shared/button';
import { Formik } from 'formik';
import * as yup from 'yup';
import { FORM_DEFAULT_VALUES } from '../../services/challenge';
import { formatDateForDisplay } from '../../services/utils';
import FriendListModal from './friendListModal';
import { FriendsContext } from '../../global';
import FlexKeyboardAvoidingView from '../../shared/flexKeyboardAvoidingView';

const maxScoreMin = 1;
const maxScoreMax = 100;

const mealMaxScoreValidation = yup.string()
    .required()
    .test('in-max-score-range', 'error message overridden', (val) => {
        let intVal = parseInt(val);
        return intVal >= maxScoreMin && intVal <= maxScoreMax;
    });
const scaleValidation = yup.string()
    .test('is-float-positive-less-than-3-with-default', 
        'Score scales must be a number between 0 and 3', 
        (val) => {
            if (!val) return true;
            let floatVal = parseFloat(val);
            return floatVal >= 0 && floatVal <= 3;
        }
    );
const validationSchema = yup.object({
    numDays: yup.string()
        .required('Duration is required')
        .test('is-num-1-90', 'Challenge can only last 1-90 days', (val) => {
            let intVal = parseInt(val);
            return intVal >= 1 && intVal <= 90;
        }),
    breakfastMaxScore: mealMaxScoreValidation,
    lunchMaxScore: mealMaxScoreValidation,
    dinnerMaxScore: mealMaxScoreValidation,
    snacksMaxScore: mealMaxScoreValidation,
    exerciseMaxScore: yup.string()
        .required('Max score for exercise is required')
        .test('in-max-score-range', 
            `Exercise max score must be a number between ${maxScoreMin} and ${maxScoreMax}`, 
            (val) => {
                let intVal = parseInt(val);
                return intVal >= maxScoreMin && intVal <= maxScoreMax;
            }
        ),
    stepScorePerUnit: yup.string()
        .test('is-float-0-max', `Score for steps must be a number between 0 and ${maxScoreMax}`, (val) => {
            if (!val) return true;
            let floatVal = parseFloat(val);
            return floatVal >= 0 && floatVal <= maxScoreMax;
        }),
    stepUnit: yup.string()
        .test('is-num-positive', 'Number of steps must be a number greater than 0', (val) => {
            if (!val) return true;
            let intVal = parseInt(val);
            return intVal > 0;
        }),
    hostScale: scaleValidation,
    guestScale: scaleValidation,
    guest: yup.string().required("Please select a friend to challenge"),
});

function MealMaxScoreItem({ fieldName, label, formikProps }) {
    return (
        <View style={globalStyles.rowItem}>
            <Text style={formStyles.formLabel}>{label}</Text>
            <TextInput
                style={formStyles.input}
                keyboardType='numeric'
                onChangeText={formikProps.handleChange(fieldName)}
                value={formikProps.values[fieldName]}
                placeholder='10'
            />
        </View>
    );
}

export default function NewChallengeForm({ submitForm }) {
    const friends = useContext(FriendsContext);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isFriendListVisible, setFriendListVisible] = useState(false);
    const Divider = ({ width=8 }) => (
        <View style={{width: width}}></View>
    );
    return (
        <FlexKeyboardAvoidingView>
            <ScrollView>
                <Formik
                    initialValues={{
                        startDate: new Date(),
                        numDays: '',
                        breakfastMaxScore: '', 
                        lunchMaxScore: '', 
                        dinnerMaxScore: '',
                        snacksMaxScore: '', 
                        exerciseMaxScore: '',
                        stepScorePerUnit: '',
                        stepUnit: '',
                        hostScale: '',
                        guestScale: '',
                        guest: '',
                    }}
                    validationSchema={validationSchema}
                    onSubmit={(values, actions) => {
                        submitForm(values);
                    }}
                >
                {(props) => {
                    return (
                    <View>
                        <Text style={formStyles.sectionHeaderText}>Time</Text>
                        <View style={globalStyles.row}>
                            <View style={globalStyles.rowItem}>
                                <Pressable onPress={() => setDatePickerVisibility(true)}>
                                    <Text style={formStyles.formLabel}>Start Date</Text>
                                    <View pointerEvents="none">
                                        <TextInput
                                            style={formStyles.input}
                                            editable={false}
                                            value={formatDateForDisplay(props.values.startDate)}
                                        />
                                    </View>
                                </Pressable>
                                <DateTimePickerModal
                                    isVisible={isDatePickerVisible}
                                    mode="date"
                                    onConfirm={(date) => {
                                        props.setFieldValue('startDate', date);
                                        setDatePickerVisibility(false);
                                    }}
                                    onCancel={() => setDatePickerVisibility(false)}
                                    date={props.values.startDate}
                                    display='inline'
                                />
                            </View>
                            <Divider />
                            <View style={globalStyles.rowItem}>
                                <Text style={formStyles.formLabel}>Duration (days)</Text>
                                <TextInput
                                    style={formStyles.input}
                                    keyboardType='numeric'
                                    onChangeText={props.handleChange('numDays')}
                                    value={props.values.numDays}
                                />
                            </View>
                        </View>
                        <Text style={formStyles.errorText}>
                            { props.touched.numDays && props.errors.numDays }
                        </Text>

                        <Text style={formStyles.sectionHeaderText}>Max score for meals</Text>
                        <View style={globalStyles.row}>
                            <MealMaxScoreItem 
                                fieldName='breakfastMaxScore'
                                label='Breakfast'
                                formikProps={props}
                            />
                            <Divider/>
                            <MealMaxScoreItem 
                                fieldName='lunchMaxScore'
                                label='Lunch'
                                formikProps={props}
                            />
                        </View>
                        <View style={globalStyles.row}>
                            <MealMaxScoreItem 
                                fieldName='dinnerMaxScore'
                                label='Dinner'
                                formikProps={props}
                            />
                            <Divider/>
                            <MealMaxScoreItem 
                                fieldName='snacksMaxScore'
                                label='Snacks'
                                formikProps={props}
                            />
                        </View>
                        <Text style={formStyles.errorText}>
                            {
                                props.touched.breakfastMaxScore 
                                && props.touched.lunchMaxScore 
                                && props.touched.dinnerMaxScore 
                                && props.touched.snacksMaxScore 
                                && (props.errors.breakfastMaxScore || props.errors.lunchMaxScore || 
                                    props.errors.dinnerMaxScore || props.errors.snacksMaxScore)
                                && `Meal max score must be a number between ${maxScoreMin} and ${maxScoreMax}`
                            }
                        </Text>

                        <Text style={formStyles.sectionHeaderText}>Scores for exercises</Text>
                        <Text style={formStyles.formLabel}>Max score for exercise</Text>
                        <TextInput
                            style={formStyles.input}
                            keyboardType='numeric'
                            onChangeText={props.handleChange('exerciseMaxScore')}
                            value={props.values.exerciseMaxScore}
                        />
                        <Text style={formStyles.errorText}>
                            { props.touched.exerciseMaxScore && props.errors.exerciseMaxScore }
                        </Text>
                        <Text style={formStyles.formLabel}>Score calculation for steps</Text>
                        <View style={styles.centerRow}>
                                <TextInput
                                    style={formStyles.input}
                                    keyboardType='numeric'
                                    onChangeText={props.handleChange('stepScorePerUnit')}
                                    value={props.values.stepScorePerUnit}
                                    placeholder={FORM_DEFAULT_VALUES.stepScorePerUnit}
                                />
                                <Text style={styles.stepText}> point(s) per </Text>
                                <TextInput
                                    style={formStyles.input}
                                    keyboardType='numeric'
                                    onChangeText={props.handleChange('stepUnit')}
                                    value={props.values.stepUnit}
                                    placeholder={FORM_DEFAULT_VALUES.stepUnit}
                                />
                                <Text style={styles.stepText}> steps</Text>
                        </View>
                        <Text style={formStyles.errorText}>
                            { (props.touched.stepScorePerUnit && props.errors.stepScorePerUnit)
                                || (props.touched.stepUnit && props.errors.stepUnit) }
                        </Text>

                        <Text style={formStyles.sectionHeaderText}>Scaling</Text>
                        <View style={globalStyles.row}>
                            <View style={globalStyles.rowItem}>
                                <Text style={formStyles.formLabel}>Scale your score by</Text>
                                <TextInput
                                    style={formStyles.input}
                                    keyboardType='numeric'
                                    onChangeText={props.handleChange('hostScale')}
                                    value={props.values.hostScale}
                                    placeholder={FORM_DEFAULT_VALUES.hostScale}
                                />
                            </View>
                            <Divider/>
                            <View style={globalStyles.rowItem}>
                                <Text style={formStyles.formLabel}>Scale friend's score by</Text>
                                <TextInput
                                    style={formStyles.input}
                                    keyboardType='numeric'
                                    onChangeText={props.handleChange('guestScale')}
                                    value={props.values.guestScale}
                                    placeholder={FORM_DEFAULT_VALUES.guestScale}
                                />
                            </View>
                        </View>
                        <Text style={formStyles.errorText}>
                            { (props.touched.hostScale && props.errors.hostScale)
                                || (props.touched.guestScale && props.errors.guestScale) }
                        </Text>

                        <FriendListModal
                            visible={isFriendListVisible} 
                            friends={friends.toList()}
                            onCancel={() => {setFriendListVisible(false)}}
                            onSelectFriend={(friend) => {
                                props.setFieldValue('guest', friend.uid);
                                props.setFieldValue('guestName', friend.name);
                                setFriendListVisible(false);
                            }} />
                        <Pressable onPress={() => setFriendListVisible(true)}>
                            <Text style={formStyles.formLabel}>Friend to challenge</Text>
                            <View pointerEvents="none">
                                <TextInput
                                    style={formStyles.input}
                                    editable={false}
                                    value={props.values.guestName}
                                />
                            </View>
                        </Pressable>
                        <Text style={formStyles.errorText}>
                            { props.touched.guest && props.errors.guest }
                        </Text>

                        <FlatButtom title='Create' onPress={props.handleSubmit} />
                    </View>
                )}}
                </Formik>
            </ScrollView>
        </FlexKeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    stepText: {
        fontSize: 14
    },
    centerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    }
})