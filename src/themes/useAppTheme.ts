import { useThemeMode } from "../screens/ThemeContext";
import { lightColors, darkColors } from "../themes/color";

export const useAppTheme = () => {
  const { mode } = useThemeMode();
  return mode === "dark" ? darkColors : lightColors;
};
