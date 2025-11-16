import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ThemeContext = createContext();

export const lightTheme = {
  name: "light",
  colors: {
    background: "#f9fafb",
    surface: "#ffffff",
    surfaceAlt: "#f3f4f6",
    border: "#e5e7eb",
    text: "#111827",
    textMuted: "#6b7280",
    textLight: "#9ca3af",
    primary: "#4c669f",
    secondary: "#3b5998",
  },
  gradient: ["#4c669f", "#3b5998"],
};

export const darkTheme = {
  name: "dark",
  colors: {
    background: "#111827",
    surface: "#1f2937",
    surfaceAlt: "#374151",
    border: "#4b5563",
    text: "#f9fafb",
    textMuted: "#9ca3af",
    textLight: "#d1d5db",
    primary: "#1a1a1a",
    secondary: "#333333",
  },
  gradient: ["#1a1a1a", "#333333"],
};

export const ThemeProvider = ({ children }) => {
  const [themeName, setThemeName] = useState("light");

  useEffect(() => {
    AsyncStorage.getItem("@user-theme").then((savedTheme) => {
      if (savedTheme) setThemeName(savedTheme);
    });
  }, []);

  const toggleTheme = () => {
    const newTheme = themeName === "light" ? "dark" : "light";
    setThemeName(newTheme);
    AsyncStorage.setItem("@user-theme", newTheme);
  };

  const theme = themeName === "light" ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ theme, themeName, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);
