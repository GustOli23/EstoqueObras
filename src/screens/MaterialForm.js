import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Save, X, Trash2 } from "lucide-react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { useData } from "../context/DataService";
import { useThemeContext } from "../context/ThemeContext";
import UnitPicker from "../components/UnitPicker";
export default function MaterialForm() {
  const navigation = useNavigation();
  const route = useRoute();
  const { theme } = useThemeContext();
  const { createMaterial, updateMaterial, deleteMaterial, isLoading } =
    useData();

  const materialToEdit = route.params?.material;

  const [formData, setFormData] = useState(() =>
    materialToEdit
      ? materialToEdit
      : {
          nome: "",
          unidade_medida: "un",
          quantidade: "0",
          valor_unitario: "",
          estoque_minimo: "0",
          local_compra: "",
        }
  );

  useEffect(() => {
    navigation.setOptions({
      title: materialToEdit ? "Editar Material" : "Novo Material",
    });
  }, [materialToEdit, navigation]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = (data) => {
    const errors = [];
    if (!data.nome?.trim()) errors.push("O nome do material é obrigatório.");
    if (!data.unidade_medida?.trim())
      errors.push("A unidade de medida é obrigatória.");

    const numFields = [
      { key: "quantidade", label: "Quantidade em Estoque" },
      { key: "valor_unitario", label: "Valor Unitário" },
      { key: "estoque_minimo", label: "Estoque Mínimo" },
    ];

    numFields.forEach(({ key, label }) => {
      const numValue = parseFloat(data[key]);
      if (isNaN(numValue) || data[key].trim() === "") {
        errors.push(`O campo "${label}" deve ser um número válido.`);
      } else if (numValue < 0) {
        errors.push(`O campo "${label}" não pode ser negativo.`);
      }
    });

    if (errors.length > 0) {
      Alert.alert("Erro de Validação", errors.join("\n"), [{ text: "OK" }]);
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validate(formData)) return;

    const submittedData = {
      ...formData,
      quantidade: parseFloat(formData.quantidade) || 0,
      valor_unitario: parseFloat(formData.valor_unitario) || 0,
      estoque_minimo: parseFloat(formData.estoque_minimo) || 0,
    };

    try {
      if (materialToEdit) {
        updateMaterial(materialToEdit.id, submittedData);
        Toast.show({
          type: "success",
          text1: "Material Atualizado!",
          text2: `${submittedData.nome} editado com sucesso.`,
        });
      } else {
        createMaterial(submittedData);
        Toast.show({
          type: "success",
          text1: "Material Cadastrado!",
          text2: `${submittedData.nome} adicionado ao estoque.`,
        });
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar o material.");
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir este material? Esta ação é irreversível.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => {
            deleteMaterial(materialToEdit.id);
            Toast.show({
              type: "error",
              text1: "Material Excluído",
              text2: "O material foi removido do sistema.",
            });
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.inner}>
        {/* Nome */}
        <View style={styles.group}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            Nome do Material
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                borderColor: theme.colors.border,
                color: theme.colors.text,
                backgroundColor: theme.colors.surface,
              },
            ]}
            value={formData.nome}
            onChangeText={(text) => handleChange("nome", text)}
            placeholder="Ex: Cimento, Areia, Tijolo"
            placeholderTextColor={theme.colors.textMuted}
          />
        </View>

        {/* Unidade de medida */}
        <UnitPicker
          value={formData.unidade_medida}
          onChange={(v) => handleChange("unidade_medida", v)}
        />

        {/* Quantidade e valor unitário */}
        <View style={styles.row}>
          <View style={[styles.flexItem]}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Estoque Atual
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: theme.colors.border,
                  color: theme.colors.text,
                  backgroundColor: theme.colors.surface,
                },
              ]}
              value={formData.quantidade}
              onChangeText={(text) => handleChange("quantidade", text)}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={theme.colors.textMuted}
            />
          </View>

          <View style={[styles.flexItem]}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Valor Unitário (R$)
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: theme.colors.border,
                  color: theme.colors.text,
                  backgroundColor: theme.colors.surface,
                },
              ]}
              value={formData.valor_unitario}
              onChangeText={(text) => handleChange("valor_unitario", text)}
              keyboardType="numeric"
              placeholder="0.00"
              placeholderTextColor={theme.colors.textMuted}
            />
          </View>
        </View>

        {/* Estoque mínimo e local */}
        <View style={styles.row}>
          <View style={[styles.flexItem]}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Estoque Mínimo
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: theme.colors.border,
                  color: theme.colors.text,
                  backgroundColor: theme.colors.surface,
                },
              ]}
              value={formData.estoque_minimo}
              onChangeText={(text) => handleChange("estoque_minimo", text)}
              keyboardType="numeric"
              placeholder="10"
              placeholderTextColor={theme.colors.textMuted}
            />
          </View>

          <View style={[styles.flexItem]}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Local de Compra
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: theme.colors.border,
                  color: theme.colors.text,
                  backgroundColor: theme.colors.surface,
                },
              ]}
              value={formData.local_compra}
              onChangeText={(text) => handleChange("local_compra", text)}
              placeholder="Opcional"
              placeholderTextColor={theme.colors.textMuted}
            />
          </View>
        </View>

        {/* Botões */}
        <View style={styles.buttonRow}>
          {materialToEdit && (
            <TouchableOpacity
              onPress={handleDelete}
              disabled={isLoading}
              style={[
                styles.deleteButton,
                { borderColor: "#fca5a5", backgroundColor: "#fee2e2" },
              ]}
            >
              <Trash2 color="#ef4444" size={16} />
              <Text style={[styles.deleteText]}>Excluir</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.cancelButton, { borderColor: theme.colors.border }]}
          >
            <X color={theme.colors.textMuted} size={16} />
            <Text
              style={[styles.cancelText, { color: theme.colors.textMuted }]}
            >
              Cancelar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isLoading || !formData.nome || !formData.unidade_medida}
            style={[
              styles.saveButton,
              {
                backgroundColor: theme.colors.primary,
                opacity:
                  isLoading || !formData.nome || !formData.unidade_medida
                    ? 0.5
                    : 1,
              },
            ]}
          >
            <Save color="#fff" size={16} />
            <Text style={styles.saveText}>
              {materialToEdit ? "Salvar Edição" : "Cadastrar"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { padding: 20, gap: 16 },
  group: { marginBottom: 10 },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 6 },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  flexItem: { flex: 1 },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    gap: 8,
  },
  deleteButton: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  deleteText: {
    color: "#dc2626",
    fontWeight: "600",
  },
  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  cancelText: {
    fontWeight: "600",
  },
  saveButton: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  saveText: {
    color: "#fff",
    fontWeight: "600",
  },
});
