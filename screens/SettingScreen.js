import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function SettingScreen() {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <View style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
            <Text style={[styles.text, isDarkMode ? styles.darkText : styles.lightText]}>
                Dark Mode
            </Text>
            <Switch
                value={isDarkMode}
                onValueChange={toggleTheme}
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={isDarkMode ? "#f5dd4b" : "#f4f3f4"}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    lightContainer: {
        backgroundColor: "#fff",
    },
    darkContainer: {
        backgroundColor: "#333",
    },
    text: {
        fontSize: 18,
        marginBottom: 10,
    },
    lightText: {
        color: "#000",
    },
    darkText: {
        color: "#fff",
    },
});
