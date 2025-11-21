import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { Save, Truck, TrendingUp, X, Package } from "lucide-react-native";

import { useData } from "../context/DataService";
import { useThemeContext } from "../context/ThemeContext";

export default function MovimentacaoForm() {
  const navigation = useNavigation();
  const { materials, obras, createMovimentacao, isLoading } = useData();
  const { theme } = useThemeContext();

  const [movType, setMovType] = useState("saida");
  const [formData, setFormData] = useState({
    material_id: "",
    obra_id: "",
    quantidade: "",
    observacao: "",
  });

  const activeObras = useMemo(
    () => obras.filter((o) => o.status === "ativa"),
    [obras]
  );

  const selectedMaterial = materials.find((m) => m.id === formData.material_id);
  const materialValorUnitario = selectedMaterial?.valor_unitario || 0;
  const currentStock = selectedMaterial?.quantidade || 0;

  const isFormValid =
    formData.material_id &&
    parseFloat(formData.quantidade) > 0 &&
    (movType === "entrada" || (movType === "saida" && formData.obra_id));

  const handleChange = (name, value) =>
    setFormData((prev) => ({ ...prev, [name]: value }));

  const valorTotal = useMemo(() => {
    const qtd = parseFloat(formData.quantidade) || 0;
    return qtd * materialValorUnitario;
  }, [formData.quantidade, materialValorUnitario]);

  const validate = () => {
    const errors = [];
    const quantidade = parseFloat(formData.quantidade);

    if (!formData.material_id) errors.push("Selecione um material.");
    if (movType === "saida" && !formData.obra_id)
      errors.push("Selecione a obra de destino.");
    if (isNaN(quantidade) || quantidade <= 0)
      errors.push("A quantidade deve ser um número positivo.");
    if (movType === "saida" && selectedMaterial && quantidade > currentStock) {
      errors.push(
        `Estoque insuficiente! Você tem ${currentStock} ${selectedMaterial.unidade_medida} em estoque.`
      );
    }

    if (errors.length > 0) {
      Alert.alert("Erro na Movimentação", errors.join("\n\n"));
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const newMov = {
      material_id: formData.material_id,
      obra_id: formData.obra_id,
      tipo: movType,
      quantidade: parseFloat(formData.quantidade),
      observacao: formData.observacao,
      valor_total: valorTotal,
      material_nome: selectedMaterial.nome,
      obra_nome:
        activeObras.find((o) => o.id === formData.obra_id)?.nome_cliente ||
        "Estoque",
    };

    try {
      createMovimentacao(newMov);
      Toast.show({
        type: "success",
        text1: "Movimentação Registrada!",
        text2: `${movType === "saida" ? "Saída" : "Entrada"} de ${
          newMov.quantidade
        } ${selectedMaterial.unidade_medida} concluída.`,
      });
      navigation.navigate("Tabs", { screen: "Historico" });
    } catch {
      Alert.alert("Erro", "Não foi possível registrar a movimentação.");
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.inner}>
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Nova Movimentação
          </Text>

          {/* Tipo */}
          <Text style={[styles.label, { color: theme.colors.text }]}>
            Tipo de Movimentação
          </Text>
          <View
            style={[
              styles.toggleContainer,
              {
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.surface,
              },
            ]}
          >
            <TouchableOpacity
              onPress={() => setMovType("entrada")}
              style={[
                styles.toggleButton,
                movType === "entrada" && {
                  backgroundColor: theme.colors.primary,
                },
              ]}
            >
              <TrendingUp
                color={movType === "entrada" ? "#fff" : theme.colors.text}
                size={14}
              />
              <Text
                style={[
                  styles.toggleText,
                  {
                    color:
                      movType === "entrada" ? "#fff" : theme.colors.textMuted,
                  },
                ]}
              >
                Entrada
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setMovType("saida")}
              style={[
                styles.toggleButton,
                movType === "saida" && {
                  backgroundColor: theme.colors.primary,
                },
              ]}
            >
              <Truck
                color={movType === "saida" ? "#fff" : theme.colors.text}
                size={14}
              />
              <Text
                style={[
                  styles.toggleText,
                  {
                    color:
                      movType === "saida" ? "#fff" : theme.colors.textMuted,
                  },
                ]}
              >
                Saída
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.label, { color: theme.colors.text }]}>
            Material
          </Text>
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
              selectedValue={formData.material_id}
              onValueChange={(v) => handleChange("material_id", v)}
              style={[styles.picker, { color: theme.colors.text }]}
            >
              <Picker.Item label="Selecione o Material" value="" />
              {materials.map((m) => (
                <Picker.Item
                  key={m.id}
                  label={`${m.nome} (${m.unidade_medida})`}
                  value={m.id}
                />
              ))}
            </Picker>
          </View>

          {selectedMaterial && (
            <View style={styles.infoRow}>
              <Text
                style={[styles.infoText, { color: theme.colors.textMuted }]}
              >
                Estoque Atual:{" "}
                <Text style={styles.bold}>
                  {currentStock} {selectedMaterial.unidade_medida}
                </Text>
              </Text>
              <Text
                style={[styles.infoText, { color: theme.colors.textMuted }]}
              >
                Valor Unitário:{" "}
                <Text style={styles.bold}>
                  R$ {materialValorUnitario.toFixed(2)}
                </Text>
              </Text>
            </View>
          )}

          {movType === "saida" && (
            <>
              <Text style={[styles.label, { color: theme.colors.text }]}>
                Obra de Destino
              </Text>
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
                  selectedValue={formData.obra_id}
                  onValueChange={(v) => handleChange("obra_id", v)}
                  style={[styles.picker, { color: theme.colors.text }]}
                >
                  <Picker.Item label="Selecione a Obra" value="" />
                  {activeObras.map((o) => (
                    <Picker.Item
                      key={o.id}
                      label={o.nome_cliente}
                      value={o.id}
                    />
                  ))}
                </Picker>
              </View>
            </>
          )}

          <Text style={[styles.label, { color: theme.colors.text }]}>
            Quantidade ({selectedMaterial?.unidade_medida || "un"})
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
            onChangeText={(t) =>
              handleChange("quantidade", t.replace(/[^0-9.]/g, ""))
            }
            keyboardType="numeric"
            placeholder="0.00"
            placeholderTextColor={theme.colors.textMuted}
          />
          <Text style={[styles.totalLabel, { color: theme.colors.textMuted }]}>
            Valor Total:{" "}
            <Text style={[styles.totalValue, { color: theme.colors.primary }]}>
              R$ {valorTotal.toFixed(2)}
            </Text>
          </Text>

          <Text style={[styles.label, { color: theme.colors.text }]}>
            Observação (Opcional)
          </Text>
          <TextInput
            style={[
              styles.textarea,
              {
                borderColor: theme.colors.border,
                color: theme.colors.text,
                backgroundColor: theme.colors.surface,
              },
            ]}
            multiline
            numberOfLines={4}
            value={formData.observacao}
            onChangeText={(t) => handleChange("observacao", t)}
            placeholder="Ex: Material retirado para fundação."
            placeholderTextColor={theme.colors.textMuted}
          />

          <View style={styles.buttons}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={[
                styles.cancelButton,
                { borderColor: theme.colors.border },
              ]}
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
              disabled={isLoading || !isFormValid}
              style={[
                styles.saveButton,
                {
                  backgroundColor: theme.colors.primary,
                  opacity: isLoading || !isFormValid ? 0.6 : 1,
                },
              ]}
            >
              <Save color="#fff" size={16} />
              <Text style={styles.saveText}>
                {isLoading ? "Registrando..." : "Confirmar"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { padding: 20 },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 6 },
  toggleContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 16,
  },
  toggleButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 10,
    flexDirection: "row",
    gap: 4,
  },
  toggleText: { fontSize: 14, fontWeight: "600" },
  pickerContainer: {
    height: 48,
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: "center",
    marginBottom: 8,
  },
  picker: { height: 48, width: "100%" },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  infoText: { fontSize: 12 },
  bold: { fontWeight: "bold" },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 16,
    marginBottom: 10,
  },
  totalLabel: { fontSize: 13, marginBottom: 16 },
  totalValue: { fontWeight: "bold" },
  textarea: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    height: 100,
    fontSize: 15,
    textAlignVertical: "top",
    marginBottom: 20,
  },
  buttons: {
    flexDirection: "row",
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  cancelText: { fontWeight: "600" },
  saveButton: {
    flex: 1,
    borderRadius: 10,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  saveText: { color: "#fff", fontWeight: "600" },
});
