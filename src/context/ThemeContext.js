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
    background: "#0D1117",
    surface: "#161B22",
    surfaceAlt: "#1F242C",
    border: "#30363D",

    text: "#E6EDF3",
    textMuted: "#9BA3B4",
    textLight: "#7D8694",

    primary: "#1f6feb",
    secondary: "#58A6FF",
  },

  gradient: ["#1f6feb", "#58A6FF"],
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
