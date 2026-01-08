import React from "react";
import { StatusBar, useColorScheme, View, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import CompaniesListingScreen from "./src/screens/CompaniesListingScreen";

const App = () => {
  const isDarkMode = useColorScheme() === "dark";

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor="#101622"
      />
      <View style={styles.container}>
        <CompaniesListingScreen />
      </View>
    </SafeAreaProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101622",
  },
});
