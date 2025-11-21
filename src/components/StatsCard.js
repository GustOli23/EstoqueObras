import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useThemeContext } from "../context/ThemeContext";

export default function StatsCard({
  title,
  value,
  description,
  color = null,
  background = null,
}) {
  const { theme } = useThemeContext();

  const displayValue = value !== undefined && value !== null ? value : "-";

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: background || theme.colors.surface },
      ]}
    >
      <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>

      <Text style={[styles.value, { color: color || theme.colors.primary }]}>
        {displayValue}
      </Text>

      {description ? (
        <Text style={[styles.description, { color: theme.colors.text }]}>
          {description}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    padding: 16,
    flex: 1,
    marginBottom: 12,
    minWidth: "45%",
    elevation: 2,
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  title: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 4,
  },
  value: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 6,
  },
  description: {
    fontSize: 12,
    marginTop: 2,
  },
});
