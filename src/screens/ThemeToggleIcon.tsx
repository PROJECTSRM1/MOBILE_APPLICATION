import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useThemeMode } from "../screens/ThemeContext";

const ThemeToggleIcon = () => {
  const { mode, toggleTheme } = useThemeMode();

  return (
    <TouchableOpacity onPress={toggleTheme} style={styles.container}>
      <MaterialIcons
        name={mode === "dark" ? "light-mode" : "dark-mode"}
        size={26}
        color={mode === "dark" ? "#FFD700" : "#1E293B"}
      />
    </TouchableOpacity>
  );
};

export default ThemeToggleIcon;

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
});
