export const getHeaderStyles = (isDarkMode) => ({
    headerTitleStyle: {
        color: isDarkMode ? '#81b0ff' : '#000',
    },
    headerStyle: {
        backgroundColor: isDarkMode ? '#121212' : '#e6f2cb',
    },
    headerTintColor: isDarkMode ? '#fff' : '#000',
});