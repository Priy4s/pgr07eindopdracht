import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import MapScreen from "../screens/MapScreen";
import SettingScreen from "../screens/SettingScreen";
import { useTheme } from "../context/ThemeContext";

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
    const { isDarkMode } = useTheme();

    const backgroundColor = isDarkMode ? "#222" : "#e6f2cb";
    const activeTintColor = isDarkMode ? "#81b0ff" : "tomato";
    const inactiveTintColor = isDarkMode ? "#888" : "gray";
    const labelColor = isDarkMode ? "#81b0ff" : "#000";

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerStyle: {
                    backgroundColor: backgroundColor,
                },
                headerTitleStyle: {
                    color: isDarkMode ? "#81b0ff" : "#000",
                },
                tabBarIcon: ({ color, size }) => {
                    let iconName;
                    if (route.name === "Home") {
                        iconName = "home-outline";
                    } else if (route.name === "Map") {
                        iconName = "map-outline";
                    } else if (route.name === "Settings") {
                        iconName = "settings-outline";
                    }
                    return <Ionicons name={iconName} color={color} size={size} />;
                },
                tabBarActiveTintColor: activeTintColor,
                tabBarInactiveTintColor: inactiveTintColor,
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: "bold",
                    color: labelColor,
                },
                tabBarStyle: {
                    backgroundColor: backgroundColor,
                    borderTopWidth: 1,
                    borderTopColor: backgroundColor,
                    height: 60,
                    paddingBottom: 10,
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Map" component={MapScreen} />
            <Tab.Screen name="Settings" component={SettingScreen} />
        </Tab.Navigator>
    );
}