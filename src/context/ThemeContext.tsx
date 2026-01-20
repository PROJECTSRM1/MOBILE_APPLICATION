import React, { createContext, useContext, useState } from "react";

type ThemeColors = {
  background: string;
  surface: string;
  card: string;
  text: string;
  subText: string;
  border: string;
  primary: string;
  danger: string;
};

type ThemeContextType = {
  lightMode: boolean;
  toggleTheme: () => void;
  colors: ThemeColors;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lightMode, setLightMode] = useState(false);

  const toggleTheme = () => setLightMode(prev => !prev);

  const colors: ThemeColors = lightMode
    ? {
        background: "#f9fafb",
        surface: "#ffffff",
        card: "#f3f4f6",
        text: "#111827",
        subText: "#6b7280",
        border: "#e5e7eb",
        primary: "#2563eb",
        danger: "#dc2626",
      }
    : {
        background: "#0f172a",
        surface: "#020617",
        card: "#020617",
        text: "#f8fafc",
        subText: "#94a3b8",
        border: "#1e293b",
        primary: "#3b82f6",
        danger: "#ef4444",
      };

  return (
    <ThemeContext.Provider value={{ lightMode, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return context;
};
