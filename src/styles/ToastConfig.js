import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react-native";

export const ToastConfig = (themeName) => {
  const isDark = themeName === "dark";

  const colors = {
    background: isDark ? "#1e293b" : "#fff",
    text: isDark ? "#f8fafc" : "#0f172a",
    success: "#22c55e",
    error: "#ef4444",
    warning: "#eab308",
    border: isDark ? "#334155" : "#e2e8f0",
  };

  return {
    success: ({ text1, text2 }) => (
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
            borderLeftColor: colors.success,
          },
        ]}
      >
        <CheckCircle color={colors.success} size={22} />
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.text }]}>{text1}</Text>
          {text2 && (
            <Text style={[styles.message, { color: colors.text }]}>
              {text2}
            </Text>
          )}
        </View>
      </View>
    ),
    error: ({ text1, text2 }) => (
      <View
        style={[
          styles.container,
          { backgroundColor: colors.background, borderLeftColor: colors.error },
        ]}
      >
        <XCircle color={colors.error} size={22} />
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.text }]}>{text1}</Text>
          {text2 && (
            <Text style={[styles.message, { color: colors.text }]}>
              {text2}
            </Text>
          )}
        </View>
      </View>
    ),
    warning: ({ text1, text2 }) => (
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
            borderLeftColor: colors.warning,
          },
        ]}
      >
        <AlertTriangle color={colors.warning} size={22} />
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.text }]}>{text1}</Text>
          {text2 && (
            <Text style={[styles.message, { color: colors.text }]}>
              {text2}
            </Text>
          )}
        </View>
      </View>
    ),
  };
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    borderLeftWidth: 5,
    marginHorizontal: 10,
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontWeight: "700",
    fontSize: 15,
  },
  message: {
    fontSize: 13,
    marginTop: 2,
  },
});
