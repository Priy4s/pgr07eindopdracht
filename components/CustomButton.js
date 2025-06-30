import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

export default function CustomButton({
         title,
         onPress,
         backgroundColor = '#a6d069',
         textColor = '#fff',
         disabled = false,
         style = {}
     }) {
    return (
        <Pressable
            style={({ pressed }) => [
                styles.button,
                {
                    backgroundColor: pressed ? '#8db858' : backgroundColor,
                    opacity: disabled ? 0.6 : 1
                },
                style
            ]}
            onPress={onPress}
            disabled={disabled}
        >
            <Text style={[styles.buttonText, { color: textColor }]}>
                {title}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 100,
    },
    buttonText: {
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 14,
    },
});