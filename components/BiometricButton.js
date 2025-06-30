import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import CustomButton from './CustomButton';

export default function BiometricButton({ onAuthenticated }) {
    const [isSupported, setIsSupported] = useState(false);

    useEffect(() => {
        const checkSupport = async () => {
            const compatible = await LocalAuthentication.hasHardwareAsync();
            setIsSupported(compatible);
        };
        checkSupport();
    }, []);

    const handlePress = async () => {
        try {
            const isEnrolled = await LocalAuthentication.isEnrolledAsync();
            if (!isEnrolled) {
                Alert.alert(
                    'Biometrics Not Set Up',
                    'Please set up biometric authentication in your device settings to use this feature'
                );
                return;
            }

            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Verify your identity to take a picture',
                disableDeviceFallback: false
            });

            if (result.success) {
                onAuthenticated();
            } else {
                Alert.alert(
                    'Authentication Failed',
                    'Could not verify your identity. Please try again.'
                );
            }
        } catch (error) {
            console.error('Authentication error:', error);
            Alert.alert(
                'Error',
                'Authentication failed unexpectedly. Please try again.'
            );
        }
    };

    return (
        <CustomButton
            title={isSupported ? "Take Picture" : "Biometric Unavailable"}
            onPress={handlePress}
            disabled={!isSupported}
        />
    );
}