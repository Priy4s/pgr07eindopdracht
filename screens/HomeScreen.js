import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import CreatureCard from "../components/CreatureCard";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../context/ThemeContext";

export default function HomeScreen() {
    const { isDarkMode } = useTheme();

    const [creatures, setCreatures] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [showFavorites, setShowFavorites] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchAndCacheCreatures = async () => {
            try {
                const response = await fetch('https://stud.hosted.hr.nl/1029788/creature/creatures.json');
                const data = await response.json();
                setCreatures(data);
                await AsyncStorage.setItem('creatures', JSON.stringify(data));
            } catch (error) {
                console.warn("No internet, loading locally stored creatures.");
                try {
                    const localData = await AsyncStorage.getItem('creatures');
                    if (localData) {
                        setCreatures(JSON.parse(localData));
                    } else {
                        console.error("No local data found.");
                    }
                } catch (e) {
                    console.error("Error reading from AsyncStorage:", e);
                }
            }
        };

        const loadFavorites = async () => {
            try {
                const storedFavorites = await AsyncStorage.getItem("favorites");
                if (storedFavorites) {
                    const parsedFavorites = JSON.parse(storedFavorites);
                    setFavorites(parsedFavorites);
                }
            } catch {}
        };

        const loadAll = async () => {
            await fetchAndCacheCreatures();
            await loadFavorites();
            setLoading(false);
        };

        loadAll();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            const loadFavorites = async () => {
                try {
                    const storedFavorites = await AsyncStorage.getItem("favorites");
                    if (storedFavorites) {
                        const parsedFavorites = JSON.parse(storedFavorites);
                        setFavorites(parsedFavorites);
                    }
                } catch {}
            };

            loadFavorites();
        }, [])
    );

    const toggleFavorites = () => {
        setShowFavorites((prev) => !prev);
    };

    const filteredCreatures =
        creatures.length && favorites.length && !loading
            ? showFavorites
                ? creatures.filter((creature) => favorites.includes(creature.id))
                : creatures
            : showFavorites
                ? []
                : creatures;

    const dynamicStyles = createStyles(isDarkMode);

    return (
        <View style={dynamicStyles.container}>
            <View style={dynamicStyles.header}>
                <Text style={dynamicStyles.title}>Mystical Creatures</Text>
                <Pressable onPress={toggleFavorites}>
                    <Text style={dynamicStyles.showFavoritesButton}>
                        {showFavorites ? "Show All" : "Show Favorites"}
                    </Text>
                </Pressable>
            </View>

            {loading ? (
                <Text style={dynamicStyles.noCreaturesText}>Loading creatures...</Text>
            ) : (
                <ScrollView contentContainerStyle={dynamicStyles.scrollContainer}>
                    {filteredCreatures.length === 0 ? (
                        <Text style={dynamicStyles.noCreaturesText}>No creatures to display. Check your internet connection.</Text>
                    ) : (
                        filteredCreatures.map((creature) => (
                            <Pressable
                                key={creature.id}
                                onPress={() => navigation.navigate("CreatureDetail", { creature })}
                            >
                                <CreatureCard
                                    name={creature.name}
                                    isFavorite={favorites.includes(creature.id)}
                                />
                            </Pressable>
                        ))
                    )}
                </ScrollView>
            )}
        </View>
    );
}

const createStyles = (isDarkMode) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDarkMode ? "#121212" : "#a6d069",
            paddingTop: 20,
            width: "100%",
        },
        header: {
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            marginBottom: 10,
        },
        title: {
            fontSize: 24,
            fontWeight: "bold",
            color: isDarkMode ? "#fff" : "#000",
        },
        showFavoritesButton: {
            fontSize: 16,
            color: isDarkMode ? "#81b0ff" : "#fff",
            fontWeight: "bold",
        },
        scrollContainer: {
            paddingBottom: 50,
            alignItems: "stretch",
        },
        noCreaturesText: {
            textAlign: "center",
            fontSize: 18,
            fontWeight: "bold",
            marginTop: 20,
            color: isDarkMode ? "#ccc" : "#fff",
        },
    });
