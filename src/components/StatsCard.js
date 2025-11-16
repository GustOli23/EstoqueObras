// src/components/StatsCard.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useThemeContext } from "../context/ThemeContext";

// import all icons and try to resolve dynamically
import * as Icons from "lucide-react-native";

// try to import LinearGradient; fallback to null if not available
let LinearGradient;
try {
  // eslint-disable-next-line global-require
  LinearGradient = require("expo-linear-gradient").LinearGradient;
} catch (e) {
  LinearGradient = null;
}

function pascalCase(name = "") {
  return name
    .split(/[^a-zA-Z0-9]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

export default function StatsCard({
  title,
  value,
  description,
  icon, // ex: "cube", "wallet", "ruler"
  color = "blue",
}) {
  const { theme } = useThemeContext();

  // safe defaults
  const displayValue = value !== undefined && value !== null ? value : "-";

  // resolve icon component dynamically from lucide-react-native
  let IconComponent = null;
  if (typeof icon === "string" && icon.length > 0) {
    const name = pascalCase(icon); // "cube" -> "Cube"
    IconComponent = Icons[name] || null;
  } else if (typeof icon === "function" || React.isValidElement(icon)) {
    // allow passing a component directly
    IconComponent = icon;
  }

  const gradientColors = {
    blue: ["#3b82f6", "#2563eb"],
    orange: ["#f97316", "#ea580c"],
    red: ["#ef4444", "#dc2626"],
    green: ["#22c55e", "#16a34a"],
    gray: [
      theme.colors.border || "#e5e7eb",
      theme.colors.surfaceAlt || "#f3f4f6",
    ],
    purple: ["#7c3aed", "#6d28d9"],
  };

  const chosenGradient = gradientColors[color] || gradientColors.blue;

  const IconBox = () => {
    // if gradient available, use it, otherwise fallback to plain view
    const inner = (
      <View style={styles.iconInner}>
        {IconComponent ? (
          // render icon component
          // if IconComponent is a function/class, render it as a component
          React.createElement(IconComponent, { color: "#fff", size: 20 })
        ) : (
          // fallback simple dot or letter
          <Text style={styles.iconFallback}>#</Text>
        )}
      </View>
    );

    if (LinearGradient) {
      return (
        <LinearGradient
          colors={chosenGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.iconContainer}
        >
          {inner}
        </LinearGradient>
      );
    }

    // fallback container (no gradient lib)
    return (
      <View
        style={[styles.iconContainer, { backgroundColor: chosenGradient[0] }]}
      >
        {inner}
      </View>
    );
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.row}>
        <View style={styles.textSection}>
          <Text style={[styles.title, { color: theme.colors.textMuted }]}>
            {title}
          </Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>
            {displayValue}
          </Text>
          {description ? (
            <Text
              style={[styles.description, { color: theme.colors.textLight }]}
            >
              {description}
            </Text>
          ) : null}
        </View>

        <IconBox />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    padding: 14,
    flex: 1,
    marginBottom: 12,
    minWidth: "45%",
    elevation: 2,
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textSection: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 4,
  },
  value: {
    fontSize: 20,
    fontWeight: "700",
  },
  description: {
    fontSize: 12,
    marginTop: 6,
  },
  iconContainer: {
    borderRadius: 12,
    padding: 10,
    minWidth: 44,
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  iconInner: {
    justifyContent: "center",
    alignItems: "center",
  },
  iconFallback: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
