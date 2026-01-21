import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";
import { DarkTheme, DefaultTheme, Theme } from "@react-navigation/native";
import { lightColors, darkColors } from "../theme/colors";

/* ---------------- TYPES ---------------- */

type ThemeContextType = {
  lightMode: boolean;
  toggleTheme: () => void;
  colors: typeof lightColors;
  navigationTheme: Theme;
};

/* ---------------- CONTEXT ---------------- */

const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

/* ---------------- PROVIDER ---------------- */

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [lightMode, setLightMode] = useState(false);

  const toggleTheme = () => setLightMode(prev => !prev);

  const colors = lightMode ? lightColors : darkColors;

  const navigationTheme: Theme = {
    ...(lightMode ? DefaultTheme : DarkTheme),
    colors: {
      ...(lightMode ? DefaultTheme.colors : DarkTheme.colors),
      background: colors.background,
      card: colors.card,
      text: colors.text,
      border: colors.border,
      primary: colors.primary,
      notification: colors.primary,
    },
  };

  return (
    <ThemeContext.Provider
      value={{
        lightMode,
        toggleTheme,
        colors,
        navigationTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

/* ---------------- HOOK ---------------- */

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return context;
};
