import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import MapView, { Marker, AnimatedRegion } from 'react-native-maps';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from "../context/ThemeContext";
import CustomMarker from "../components/CustomMarker";

const darkMapStyle = [
    { elementType: 'geometry', stylers: [{ color: '#212121' }] },
    { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#212121' }] },
    {
        featureType: 'administrative',
        elementType: 'geometry',
        stylers: [{ color: '#757575' }],
    },
    {
        featureType: 'landscape',
        elementType: 'geometry',
        stylers: [{ color: '#1b1b1b' }],
    },
    {
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [{ color: '#2c2c2c' }],
    },
    {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{ color: '#181818' }],
    },
    {
        featureType: 'road',
        elementType: 'geometry.fill',
        stylers: [{ color: '#2c2c2c' }],
    },
    {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#1f1f1f' }],
    },
    {
        featureType: 'transit',
        elementType: 'geometry',
        stylers: [{ color: '#2f3948' }],
    },
    {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#000000' }],
    },
    {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#3d3d3d' }],
    },
];

export default function MapScreen() {
    const { isDarkMode } = useTheme();
    const mapRegion = useRef(
        new AnimatedRegion({
            latitude: 51.917319,
            longitude: 4.484609,
            latitudeDelta: 0.045,
            longitudeDelta: 0.045,
        })
    ).current;

    const [creatures, setCreatures] = useState([]);
    const [creatureImages, setCreatureImages] = useState({});
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const navigation = useNavigation();
    const route = useRoute();
    const mapRef = useRef(null);

    useEffect(() => {
        const fetchCreatures = async () => {
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
        fetchCreatures();
    }, []);



    const loadCreatureImages = useCallback(async () => {
        try {
            const images = {};
            for (const creature of creatures) {
                const uri = await AsyncStorage.getItem(`image_${creature.id}`);
                if (uri) {
                    images[creature.id] = uri;
                }
            }
            setCreatureImages(images);
        } catch (error) {
            console.error('Error loading creature images:', error);
        }
    }, [creatures]);

    useFocusEffect(
        useCallback(() => {
            if (creatures.length > 0) {
                loadCreatureImages();
            }
        }, [creatures, loadCreatureImages])
    );

    useEffect(() => {
        const creature = route.params?.selectedCreature;
        if (creature && mapRef.current) {
            const newRegion = {
                latitude: creature.latitude,
                longitude: creature.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            };
            mapRegion.timing({ ...newRegion, duration: 1000 }).start();
        }
    }, [route.params?.selectedCreature]);

    useEffect(() => {
        let subscription;

        async function startWatching() {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            subscription = await Location.watchPositionAsync(
                { accuracy: Location.Accuracy.High, distanceInterval: 10 },
                (loc) => setLocation(loc.coords)
            );
        }

        startWatching();

        return () => {
            if (subscription) subscription.remove();
        };
    }, []);

    return (
        <View style={styles.container}>
            <MapView.Animated
                ref={mapRef}
                style={styles.map}
                region={mapRegion}
                customMapStyle={isDarkMode ? darkMapStyle : []}
            >
                {creatures.map(c => (
                    <Marker
                        key={c.id}
                        coordinate={{ latitude: c.latitude, longitude: c.longitude }}
                        title={c.name}
                        onPress={() => navigation.navigate('CreatureDetail', { creature: c })}
                    >
                        <CustomMarker
                            imageUri={creatureImages[c.id]}
                            color="red"
                        />
                    </Marker>
                ))}

                {location && (
                    <Marker
                        coordinate={{
                            latitude: location.latitude,
                            longitude: location.longitude,
                        }}
                        title="You are here"
                    >
                        <CustomMarker color="purple" />
                    </Marker>
                )}
            </MapView.Animated>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { width: '100%', height: '100%' },
});