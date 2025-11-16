import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useThemeContext } from "../context/ThemeContext";

export default function UnitPicker({
  label = "Unidade de Medida",
  value,
  onChange,
}) {
  const { theme } = useThemeContext();

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.colors.text }]}>{label}</Text>
      <View
        style={[
          styles.pickerContainer,
          {
            borderColor: theme.colors.border,
            backgroundColor: theme.colors.surface,
          },
        ]}
      >
        <Picker
          selectedValue={value}
          onValueChange={onChange}
          style={{ color: theme.colors.text }}
        >
          <Picker.Item label="Unidade (un)" value="un" />
          <Picker.Item label="Metros quadrados (m²)" value="m²" />
          <Picker.Item label="Metros cúbicos (m³)" value="m³" />
          <Picker.Item label="Litros (L)" value="L" />
          <Picker.Item label="Quilos (kg)" value="kg" />
        </Picker>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 6 },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 12,
    height: 48,
    justifyContent: "center",
  },
});
