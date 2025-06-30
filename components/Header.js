import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const Header = ({ title }) => {
    const { isDarkMode } = useTheme();

    return (
        <View style={[
            styles.headerContainer,
            { backgroundColor: isDarkMode ? '#121212' : '#fff' }
        ]}>
            <Text style={[
                styles.headerTitle,
                { color: isDarkMode ? '#fff' : '#000' }
            ]}>
                {title}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        shadowOpacity: 0.2,
        shadowRadius: 3,
        shadowOffset: { width: 0, height: 2 },
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default Header;