import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

const CreatureCard = ({ name, isFavorite }) => {
    const { isDarkMode } = useTheme();

    const styles = createStyles(isDarkMode);

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.name}>{name}</Text>
                {isFavorite && (
                    <Ionicons
                        name="star"
                        size={24}
                        color={isDarkMode ? "gold" : "orange"}
                    />
                )}
            </View>
        </View>
    );
};

const createStyles = (isDarkMode) =>
    StyleSheet.create({
        card: {
            backgroundColor: isDarkMode ? "#1e1e1e" : "#fff",
            padding: 15,
            marginVertical: 10,
            borderRadius: 10,
            marginHorizontal: 15,
            shadowColor: isDarkMode ? "#000" : "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isDarkMode ? 0.9 : 0.2,
            shadowRadius: 4,
            elevation: 5,
        },
        header: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
        },
        name: {
            fontSize: 18,
            fontWeight: "bold",
            color: isDarkMode ? "#fff" : "#000",
        },
    });

export default CreatureCard;
