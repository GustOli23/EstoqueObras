import React from "react";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppNavigator from "./src/navigation/AppNavigator";
import { DataProvider } from "./src/context/DataService";
import { ThemeProvider, useThemeContext } from "./src/context/ThemeContext";
import Toast from "react-native-toast-message";
import { ToastConfig } from "./src/styles/ToastConfig";

// 🔹 StatusBar com tema dinâmico
function ThemedStatusBar() {
  const { themeName, theme } = useThemeContext();
  return (
    <StatusBar
      backgroundColor={theme.colors.surface}
      barStyle={themeName === "dark" ? "light-content" : "dark-content"}
    />
  );
}

// 🔹 Toast com tema dinâmico
function ThemedToast() {
  const { themeName } = useThemeContext();
  return <Toast config={ToastConfig(themeName)} />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <DataProvider>
          <ThemedStatusBar />
          <AppNavigator />
          <ThemedToast />
        </DataProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
