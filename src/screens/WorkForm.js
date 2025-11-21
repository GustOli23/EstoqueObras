import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Save, X, Calendar } from "lucide-react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Toast from "react-native-toast-message";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useData } from "../context/DataService";
import { useThemeContext } from "../context/ThemeContext";

const Label = ({ children, theme, required }) => (
  <Text style={[styles.label, { color: theme.colors.textMuted }]}>
    {children}
    {required && <Text style={{ color: theme.colors.error }}> *</Text>}
  </Text>
);

const FormInput = ({ theme, hasError, ...props }) => (
  <TextInput
    style={[
      styles.input,
      {
        borderColor: hasError ? theme.colors.error : theme.colors.border,
        backgroundColor: theme.colors.surfaceAlt,
        color: theme.colors.text,
      },
    ]}
    placeholderTextColor={theme.colors.textMuted}
    {...props}
  />
);

const FormTextArea = ({ theme, ...props }) => (
  <TextInput
    style={[
      styles.textArea,
      {
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.surfaceAlt,
        color: theme.colors.text,
      },
    ]}
    placeholderTextColor={theme.colors.textMuted}
    multiline
    numberOfLines={4}
    {...props}
  />
);

export default function WorkForm({ isLoading: propIsLoading = false }) {
  const navigation = useNavigation();
  const route = useRoute();
  const { theme } = useThemeContext();
  const { createObra, updateObra, isLoading: contextIsLoading } = useData();
  const isLoading = propIsLoading || contextIsLoading;

  const obraToEdit = route.params?.obra;

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentDatePicker, setCurrentDatePicker] = useState("data_inicio");
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState(() => {
    if (obraToEdit) {
      return {
        id: obraToEdit.id,
        nome_cliente: obraToEdit.nome_cliente,
        local: obraToEdit.local,
        metragem: obraToEdit.metragem?.toString() || "",
        valor_total: (obraToEdit.valor_total ?? 0).toString(),
        data_inicio: obraToEdit.data_inicio,
        data_fim_prevista: obraToEdit.data_fim_prevista || "",
        status: obraToEdit.status,
        observacoes: obraToEdit.observacoes || "",
      };
    }
    return {
      nome_cliente: "",
      local: "",
      metragem: "",
      valor_total: "",
      data_inicio: format(new Date(), "yyyy-MM-dd"),
      data_fim_prevista: "",
      status: "ativa",
      observacoes: "",
    };
  });

  useEffect(() => {
    navigation.setOptions({
      title: obraToEdit ? "Editar Obra" : "Nova Obra",
    });
  }, [obraToEdit, navigation]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nome_cliente.trim()) newErrors.nome_cliente = true;
    if (!formData.local.trim()) newErrors.local = true;
    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      Toast.show({
        type: "error",
        text1: "Campos obrigatórios",
        text2: "Preencha os campos destacados antes de salvar.",
      });
      return;
    }

    const dataToSend = {
      ...(obraToEdit && { id: formData.id }),
      nome_cliente: formData.nome_cliente,
      local: formData.local,
      metragem: parseFloat(formData.metragem || 0),
      valor_total: parseFloat(formData.valor_total.replace(",", ".") || 0),
      data_inicio: formData.data_inicio,
      data_fim_prevista: formData.data_fim_prevista || null,
      status: formData.status,
      observacoes: formData.observacoes,
    };

    try {
      if (obraToEdit) {
        await updateObra(dataToSend);
        Toast.show({ type: "success", text1: "Obra atualizada com sucesso!" });
      } else {
        await createObra(dataToSend);
        Toast.show({ type: "success", text1: "Obra cadastrada com sucesso!" });
      }
      navigation.goBack();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Erro ao salvar",
        text2: error.message || "Ocorreu um erro inesperado.",
      });
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      handleChange(currentDatePicker, formattedDate);
    }
  };

  const getDisplayDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return format(date, "dd/MM/yyyy", { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  const dateValue = formData[currentDatePicker]
    ? new Date(formData[currentDatePicker])
    : new Date();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.section}>
        <Label theme={theme} required>
          Nome do Cliente / Projeto
        </Label>
        <FormInput
          theme={theme}
          hasError={errors.nome_cliente}
          placeholder="Ex: Casa do João"
          value={formData.nome_cliente}
          onChangeText={(text) => handleChange("nome_cliente", text)}
        />
      </View>

      <View style={styles.section}>
        <Label theme={theme} required>
          Localização
        </Label>
        <FormInput
          theme={theme}
          hasError={errors.local}
          placeholder="Ex: Av. Brasil, São Paulo"
          value={formData.local}
          onChangeText={(text) => handleChange("local", text)}
        />
      </View>

      <View style={styles.section}>
        <Label theme={theme}>Área / Volume da Obra</Label>
        <FormInput
          theme={theme}
          keyboardType="numeric"
          placeholder="Ex: 250"
          value={formData.metragem}
          onChangeText={(text) => handleChange("metragem", text)}
        />
      </View>

      <View style={styles.section}>
        <Label theme={theme}>Valor Total Estimado (R$)</Label>
        <FormInput
          theme={theme}
          keyboardType="numeric"
          placeholder="0,00"
          value={formData.valor_total}
          onChangeText={(text) =>
            handleChange("valor_total", text.replace(/[^0-9,.]/g, ""))
          }
        />
      </View>

      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Label theme={theme}>Data de Início</Label>
          <TouchableOpacity
            onPress={() => {
              setCurrentDatePicker("data_inicio");
              setShowDatePicker(true);
            }}
            style={[
              styles.dateButton,
              {
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.surfaceAlt,
              },
            ]}
          >
            <Text style={{ color: theme.colors.text }}>
              {getDisplayDate(formData.data_inicio)}
            </Text>
            <Calendar color={theme.colors.textMuted} size={20} />
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1 }}>
          <Label theme={theme}>Data Fim Prevista</Label>
          <TouchableOpacity
            onPress={() => {
              setCurrentDatePicker("data_fim_prevista");
              setShowDatePicker(true);
            }}
            style={[
              styles.dateButton,
              {
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.surfaceAlt,
              },
            ]}
          >
            <Text style={{ color: theme.colors.text }}>
              {getDisplayDate(formData.data_fim_prevista) || "Selecionar"}
            </Text>
            <Calendar color={theme.colors.textMuted} size={20} />
          </TouchableOpacity>
        </View>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={dateValue}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          is24Hour
          onChange={handleDateChange}
          locale="pt-BR"
        />
      )}

      <View style={styles.section}>
        <Label theme={theme}>Observações</Label>
        <FormTextArea
          theme={theme}
          placeholder="Detalhes importantes sobre a obra..."
          value={formData.observacoes}
          onChangeText={(text) => handleChange("observacoes", text)}
        />
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[
            styles.cancelButton,
            {
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.surfaceAlt,
            },
          ]}
        >
          <X color={theme.colors.textMuted} size={16} />
          <Text style={[styles.buttonText, { color: theme.colors.text }]}>
            Cancelar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isLoading}
          style={[
            styles.saveButton,
            {
              backgroundColor: theme.colors.primary,
              opacity: isLoading ? 0.7 : 1,
            },
          ]}
        >
          <Save color="#fff" size={16} />
          <Text style={[styles.buttonText, { color: "#fff" }]}>
            {obraToEdit ? "Atualizar" : "Cadastrar"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  section: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 6 },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: "top",
  },
  row: { flexDirection: "row", gap: 12, marginBottom: 16 },
  dateButton: {
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  actions: { flexDirection: "row", gap: 8, marginTop: 16 },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  saveButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  buttonText: { fontWeight: "600", fontSize: 15 },
  errorText: { fontSize: 12, marginTop: 4 },
});
