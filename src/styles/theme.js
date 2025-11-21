import { useColorScheme } from "react-native";

export const lightTheme = {
  name: "light",
  colors: {
    primary: "#2563eb",
    primaryDark: "#1e40af",
    secondary: "#f97316",
    success: "#22c55e",
    danger: "#ef4444",
    warning: "#facc15",
    background: "#f1f5f9",
    surface: "#ffffff",
    border: "#e2e8f0",
    text: "#0f172a",
    textMuted: "#64748b",
  },
};

export const darkTheme = {
  name: "dark",
  colors: {
    primary: "#3b82f6",
    primaryDark: "#1e3a8a",
    secondary: "#fb923c",
    success: "#22c55e",
    danger: "#ef4444",
    warning: "#eab308",
    background: "#0f172a",
    surface: "#1e293b",
    border: "#334155",
    text: "#f8fafc",
    textMuted: "#cbd5e1",
  },
};

export const useTheme = () => {
  const colorScheme = useColorScheme();
  return colorScheme === "dark" ? darkTheme : lightTheme;
};

export const themes = { lightTheme, darkTheme };

export default lightTheme;
