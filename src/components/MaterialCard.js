import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { AlertTriangle, DollarSign, Edit, Package } from "lucide-react-native";
import { useThemeContext } from "../context/ThemeContext";

const Badge = ({ children, isLowStock }) => (
  <View
    style={[
      styles.badge,
      {
        backgroundColor: isLowStock
          ? "rgba(255, 99, 99, 0.22)"
          : "rgba(75, 142, 255, 0.22)",
      },
    ]}
  >
    <Text
      style={{
        color: isLowStock ? "#ff6b6b" : "#4ba3ff",
        fontWeight: "600",
        fontSize: 12,
      }}
    >
      {children}
    </Text>
  </View>
);

export default function MaterialCard({ material, onEdit }) {
  const { theme } = useThemeContext();

  const isLowStock = material.quantidade <= material.estoque_minimo;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: isLowStock ? "#ff6b6b55" : theme.colors.border,
        },
      ]}
    >
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <View style={styles.headerLeft}>
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: isLowStock ? "#ff6b6b" : theme.colors.primary,
              },
            ]}
          >
            <Package color="#fff" size={22} />
          </View>

          <View style={styles.titleContainer}>
            <Text
              style={[styles.materialName, { color: theme.colors.text }]}
              numberOfLines={1}
            >
              {material.nome}
            </Text>

            <Badge isLowStock={isLowStock}>
              {isLowStock ? "Estoque Baixo" : "Em Estoque"}
            </Badge>
          </View>
        </View>

        <View style={styles.headerRight}>
          <View style={styles.quantityContainer}>
            <Text style={[styles.quantity, { color: theme.colors.text }]}>
              {material.quantidade}
            </Text>
            <Text style={[styles.unit, { color: theme.colors.text }]}>
              {" "}
              {material.unidade_medida}
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.editButton,
              { backgroundColor: "rgba(75, 142, 255, 0.22)" },
            ]}
            onPress={() => onEdit(material)}
          >
            <Edit color={theme.colors.primary} size={18} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <DollarSign color={theme.colors.text} size={18} />
          <View>
            <Text style={[styles.detailLabel, { color: theme.colors.text }]}>
              Valor Unit.
            </Text>
            <Text style={[styles.detailValue, { color: theme.colors.text }]}>
              R$ {material.valor_unitario?.toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={styles.detailItem}>
          <AlertTriangle color={theme.colors.text} size={18} />
          <View>
            <Text style={[styles.detailLabel, { color: theme.colors.text }]}>
              Mínimo
            </Text>
            <Text style={[styles.detailValue, { color: theme.colors.text }]}>
              {material.estoque_minimo}
            </Text>
          </View>
        </View>
      </View>

      {material.local_compra && (
        <View
          style={[
            styles.locationContainer,
            { borderTopColor: theme.colors.border },
          ]}
        >
          <Text style={[styles.locationLabel, { color: theme.colors.text }]}>
            Local de Compra
          </Text>
          <Text style={[styles.locationValue, { color: theme.colors.text }]}>
            {material.local_compra}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomWidth: 1,
    paddingBottom: 12,
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingRight: 8,
  },
  iconContainer: {
    padding: 10,
    borderRadius: 12,
  },
  titleContainer: {
    marginLeft: 12,
    flex: 1,
  },
  materialName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  quantity: {
    fontSize: 20,
    fontWeight: "bold",
  },
  unit: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 4,
  },
  editButton: {
    marginLeft: 10,
    padding: 8,
    borderRadius: 10,
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailLabel: {
    fontSize: 12,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "bold",
  },
  locationContainer: {
    borderTopWidth: 1,
    marginTop: 12,
    paddingTop: 12,
  },
  locationLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  locationValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
});
