import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Filter, Plus, Search, Package } from "lucide-react-native";
import { Picker } from "@react-native-picker/picker";

import { useData } from "../context/DataService";
import { useThemeContext } from "../context/ThemeContext";
import MaterialCard from "../components/MaterialCard";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Materiais() {
  const navigation = useNavigation();
  const { materials, isLoading } = useData();
  const { theme } = useThemeContext();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStock, setFilterStock] = useState("all");

  // 🔹 Criar novo material
  const handleNewMaterial = () => {
    navigation.navigate("MaterialFormScreen");
  };

  // 🔹 Editar material existente
  const handleEdit = (material) => {
    const materialData = {
      ...material,
      quantidade: material.quantidade.toString(),
      valor_unitario: material.valor_unitario.toFixed(2).toString(),
      estoque_minimo: material.estoque_minimo.toString(),
    };
    navigation.navigate("MaterialFormScreen", { material: materialData });
  };

  // 🔹 Filtro e busca
  const filteredMaterials = useMemo(() => {
    let filtered = materials.filter((m) => {
      if (filterStock === "low") return m.quantidade <= m.estoque_minimo;
      return true;
    });

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.nome.toLowerCase().includes(lower) ||
          m.local_compra?.toLowerCase().includes(lower)
      );
    }

    return filtered;
  }, [materials, searchTerm, filterStock]);

  if (isLoading) {
    return (
      <View
        style={[styles.center, { backgroundColor: theme.colors.background }]}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.textMuted }]}>
          Carregando materiais...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Cabeçalho */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.colors.surface,
            borderBottomColor: theme.colors.border,
          },
        ]}
      >
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Inventário de Materiais
        </Text>

        {/* Linha de busca */}
        <View style={styles.row}>
          <View
            style={[
              styles.searchBox,
              {
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.surface,
              },
            ]}
          >
            <Search
              color={theme.colors.textMuted}
              size={20}
              style={{ marginRight: 8 }}
            />
            <TextInput
              style={[styles.input, { color: theme.colors.text }]}
              placeholder="Buscar material..."
              placeholderTextColor={theme.colors.textMuted}
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
          </View>
        </View>

        {/* Linha de filtro e botão Novo */}
        <View style={styles.row}>
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
              selectedValue={filterStock}
              onValueChange={(v) => setFilterStock(v)}
              style={[styles.picker, { color: theme.colors.text }]}
            >
              <Picker.Item label="Todos os Materiais" value="all" />
              <Picker.Item label="Estoque Baixo" value="low" />
            </Picker>
          </View>

          <TouchableOpacity
            onPress={handleNewMaterial}
            style={[
              styles.addButton,
              { backgroundColor: theme.colors.primary },
            ]}
          >
            <Plus color="#fff" size={24} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Lista de Materiais */}
      {filteredMaterials.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.colors.textMuted }]}>
            Nenhum material encontrado
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredMaterials}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MaterialCard material={item} onEdit={handleEdit} />
          )}
          contentContainerStyle={styles.listContainer}
          initialNumToRender={10}
          maxToRenderPerBatch={5}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 15,
  },
  header: {
    padding: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    height: 48,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  pickerContainer: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    height: 48,
    justifyContent: "center",
  },
  picker: {
    height: 48,
    width: "100%",
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
  },
  listContainer: {
    padding: 20,
  },
});
