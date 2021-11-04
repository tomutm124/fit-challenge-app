import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, Text, ScrollView, Image, Dimensions, Platform, KeyboardAvoidingView } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import * as ImagePicker from 'expo-image-picker';
import ClosableModal from '../../closableModal';
import FlatButton from '../../button';
import { globalStyles, disabledInputColor, containerPadding } from '../../../styles/global';
import { formStyles } from '../../../styles/form';
import CameraModal from './cameraModal';
import { getScoreValidation } from './validation';
import FlexKeyboardAvoidingView from '../../flexKeyboardAvoidingView';

export default function RecordItemModal({ visible, editable, title, friendName, pointItemData, 
        maxScore, scoreKeyboardType, onCancel, onSave }) {
    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                console.log(`Media library permission: ${status}`);
            }
        })();
    }, []);
    const [image, setImage] = useState(null);
    useEffect(() => {
        setImage(pointItemData?.imageUrl);
    }, [visible]);
    const [cameraModalVisible, setCameraModalVisible] = useState(false);
    const scrollView = useRef(null);
    const scrollToTop = () => scrollView.current.scrollTo({y: 0});

    const imageWidth = Dimensions.get('window').width - containerPadding * 2;
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
        if (!result.cancelled) {
            setImage(result.uri);
            scrollToTop();
        }
    };

    const validationSchema = yup.object({
        selfScore: getScoreValidation(maxScore),
        description: yup.string().required('Please provide a brief description'),
    });

    const Divider = ({ width=8, height=0 }) => (
        <View style={{width: width, height: height}}></View>
    );

    return (
        <ClosableModal 
            visible={visible} 
            onCancel={() => {
                setImage(pointItemData?.imageUrl);
                onCancel();
            }}
        >
            <CameraModal 
                visible={cameraModalVisible} 
                onCancel={() => setCameraModalVisible(false)} 
                onTakePhoto={(image) => {
                    setImage(image);
                    setCameraModalVisible(false);
                    scrollToTop();
                }}
            />
            <Text style={globalStyles.modalHeader}>{title}</Text>
            <FlexKeyboardAvoidingView>
                <ScrollView ref={scrollView}>
                    {image && 
                        <Image 
                            source={{ uri: image }} 
                            style={{width: imageWidth, height: imageWidth, marginBottom: 20}} 
                            />
                    }
                    <Formik
                        initialValues={{
                            selfScore: pointItemData?.selfScore !== undefined ? String(pointItemData?.selfScore) : '',
                            description: pointItemData?.description !== undefined ? pointItemData.description : '',
                        }}
                        validationSchema={validationSchema}
                        onSubmit={(values, actions) => {
                            const valuesToSubmit = {...values};
                            if (image && image != pointItemData?.imageUrl) {
                                valuesToSubmit.image = image;
                                valuesToSubmit.prevImageRefPath = pointItemData?.imageRefPath;
                            }
                            valuesToSubmit.selfScore = parseFloat(valuesToSubmit.selfScore);
                            actions.resetForm();
                            onSave(valuesToSubmit);
                        }}
                    >
                    {(props) => (
                        <View>
                            <View style={globalStyles.row}>
                                <View style={globalStyles.rowItem}>
                                    <Text style={formStyles.formLabel}>You rated (max {maxScore})</Text>
                                    <TextInput
                                        style={formStyles.input}
                                        keyboardType={scoreKeyboardType}
                                        onChangeText={props.handleChange('selfScore')}
                                        value={props.values.selfScore}
                                    />
                                </View>
                                <Divider />
                                <View style={globalStyles.rowItem}>
                                    <Text style={formStyles.formLabel}>{friendName} rated</Text>
                                    <TextInput
                                        style={{...formStyles.input, backgroundColor: disabledInputColor}}
                                        editable={false}
                                        value={pointItemData?.opponentScore !== undefined ? String(pointItemData?.opponentScore) : ''}
                                    />
                                </View>
                            </View>
                            <Text style={formStyles.errorText}>
                                { props.touched.selfScore && props.errors.selfScore}
                            </Text>
                            <Text style={formStyles.formLabel}>Description</Text>
                            <TextInput style={formStyles.input}
                                onChangeText={props.handleChange('description')}
                                value={props.values.description}
                                />
                            <Text style={formStyles.errorText}>
                                { props.touched.description && props.errors.description}
                            </Text>
                            <View style={globalStyles.row}>
                                <View style={globalStyles.rowItem}>
                                    <FlatButton 
                                        title='Take a photo' 
                                        disabled={!editable} 
                                        onPress={() => setCameraModalVisible(true)} 
                                    />
                                </View>
                                <Divider />
                                <View style={globalStyles.rowItem}>
                                    <FlatButton title='Pick a photo' disabled={!editable} onPress={() => pickImage()} />
                                </View>
                            </View>
                            <Divider height={8} />
                            <FlatButton title='Save' disabled={!editable} onPress={props.handleSubmit} />
                        </View>
                    )}
                    </Formik>
                </ScrollView>
            </FlexKeyboardAvoidingView>
        </ClosableModal>
    );
}
