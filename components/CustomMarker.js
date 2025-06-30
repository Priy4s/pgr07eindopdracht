import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

export default function CustomMarker({ imageUri, color = 'red' }) {
    return imageUri ? (
        <View style={styles.customMarker}>
            <Image source={{ uri: imageUri }} style={styles.image} />
        </View>
    ) : (
        <View style={[styles.defaultMarker, { backgroundColor: color }]} />
    );
}

const styles = StyleSheet.create({
    customMarker: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: 'white',
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    defaultMarker: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'white',
    },
});