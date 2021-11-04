import React, { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';
import { Camera } from 'expo-camera';
import ClosableModal from '../../closableModal';
import FlatButton from '../../button';
import { containerPadding } from '../../../styles/global';

export default function CameraModal({ visible, onCancel, onTakePhoto }) {
    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            console.log(`Camera permission: ${status}`);
        })();
    }, []);

    const cameraWidth = Dimensions.get('window').width - containerPadding * 2;
    const [camera, setCamera] = useState(null);
    const takePicture = async () => {
        if (camera) {
          const result = await camera.takePictureAsync();
          onTakePhoto(result.uri);
        }
    };
    return (
        <ClosableModal visible={visible} onCancel={onCancel}>
            <Camera
                ref={ref => setCamera(ref)}
                style={{width: cameraWidth, height: cameraWidth, marginBottom: 20}}
                ratio={'1:1'} 
            />
            <FlatButton title='Take Picture' onPress={takePicture} />
        </ClosableModal>
    );
}
