import React, { useState, useEffect } from "react";
import {View, Text, StyleSheet, Pressable, ScrollView, Image,} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as LocalAuthentication from "expo-local-authentication";
import { useTheme } from "../context/ThemeContext";
import CustomButton from "../components/CustomButton";
import BiometricButton from "../components/BiometricButton";

export default function DetailScreen({ route, navigation }) {
    const { creature } = route.params;
    const { isDarkMode } = useTheme();

    const [isFavorite, setIsFavorite] = useState(false);
    const [imageUri, setImageUri] = useState(null);
    const [isBiometricSupported, setIsBiometricSupported] = useState(false);

    useEffect(() => {
        const loadFavoriteStatus = async () => {
            try {
                const storedFavorites = await AsyncStorage.getItem("favorites");
                if (storedFavorites) {
                    const favorites = JSON.parse(storedFavorites);
                    setIsFavorite(favorites.includes(creature.id));
                }
            } catch (error) {
                console.error("Error loading favorite status:", error);
            }
        };

        const loadImage = async () => {
            try {
                const storedImage = await AsyncStorage.getItem(`image_${creature.id}`);
                if (storedImage) {
                    setImageUri(storedImage);
                }
            } catch (error) {
                console.error("Error loading image:", error);
            }
        };

        const checkBiometricSupport = async () => {
            try {
                const compatible = await LocalAuthentication.hasHardwareAsync();
                setIsBiometricSupported(compatible);
            } catch (error) {
                console.error("Error checking biometric support:", error);
            }
        };

        loadFavoriteStatus();
        loadImage();
        checkBiometricSupport();
    }, [creature.id]);

    const toggleFavorite = async () => {
        try {
            const newStatus = !isFavorite;
            setIsFavorite(newStatus);

            const storedFavorites = await AsyncStorage.getItem("favorites");
            let favorites = storedFavorites ? JSON.parse(storedFavorites) : [];

            if (newStatus) {
                favorites.push(creature.id);
            } else {
                favorites = favorites.filter((id) => id !== creature.id);
            }

            await AsyncStorage.setItem("favorites", JSON.stringify(favorites));
        } catch (error) {
            console.error("Error saving favorite status:", error);
        }
    };

    const takePicture = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
            alert("Camera permission is required to take a picture.");
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled && result.assets?.length > 0) {
            const uri = result.assets[0].uri;
            setImageUri(uri);
            try {
                await AsyncStorage.setItem(`image_${creature.id}`, uri);
            } catch (error) {
                console.error("Error saving image:", error);
            }
        }
    };

    const backgroundColor = isDarkMode ? "#121212" : "#fff";
    const textColor = isDarkMode ? "#eee" : "#000";
    const secondaryTextColor = isDarkMode ? "#aaa" : "#888";
    const buttonBackground = isDarkMode ? "#3a5a40" : "#a6d069";

    return (
        <ScrollView style={[styles.container, { backgroundColor }]}>
            <View style={styles.header}>
                <Pressable onPress={toggleFavorite}>
                    <Ionicons
                        name={isFavorite ? "star" : "star-outline"}
                        size={28}
                        color="gold"
                    />
                </Pressable>
            </View>

            <View style={styles.content}>
                {imageUri ? (
                    <Image source={{ uri: imageUri }} style={styles.image} />
                ) : (
                    <Text style={[styles.noImageText, { color: secondaryTextColor }]}>
                        No picture taken yet
                    </Text>
                )}
                <Text style={[styles.name, { color: textColor }]}>{creature.name}</Text>
                <Text style={[styles.description, { color: textColor }]}>
                    {creature.description}
                </Text>
                <Text style={[styles.year, { color: secondaryTextColor }]}>
                    First Spotted: {creature.year}
                </Text>
            </View>

            <View style={styles.buttonsContainer}>
                <CustomButton
                    title="See on map"
                    onPress={() => navigation.navigate("MapScreen", { selectedCreature: creature })}
                    backgroundColor={buttonBackground}
                    style={styles.button}
                />
                <CustomButton
                    title="Go back"
                    onPress={() => navigation.goBack()}
                    backgroundColor={buttonBackground}
                    style={styles.button}
                />
                <BiometricButton onAuthenticated={takePicture} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        alignItems: "flex-end",
        padding: 10,
    },
    content: {
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 20,
        paddingHorizontal: 20,
    },
    name: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        textAlign: "center",
        marginBottom: 10,
    },
    year: {
        fontSize: 16,
        fontStyle: "italic",
        marginBottom: 20,
    },
    image: {
        width: 300,
        height: 300,
        borderRadius: 10,
        marginBottom: 20,
    },
    noImageText: {
        fontSize: 16,
        fontStyle: "italic",
        marginBottom: 20,
    },
    buttonsContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        flexWrap: "wrap",
        marginBottom: 20,
        gap: 10,
        paddingHorizontal: 10,
    },
    button: {
        minWidth: "45%",
        flexGrow: 1,
    },
});