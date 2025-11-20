import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  StyleSheet,
} from "react-native";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ArrowDownCircle,
  Package,
  Building2,
  DollarSign,
  Search,
} from "lucide-react-native";
import { Picker } from "@react-native-picker/picker";
import { useData } from "../context/DataService";
import { useThemeContext } from "../context/ThemeContext";

// =================================================================
// Card de Movimentação — (Opção B atualizada)
// =================================================================
// =================================================================
// CARD DE MOVIMENTAÇÃO — versão corrigida e estilizada
// =================================================================
const MovimentacaoCard = ({ mov, theme }) => {
  const isSaida = mov.tipo === "saida";

  // 🎨 Cores iguais ao MaterialCard
  const bgColor = isSaida
    ? "rgba(255, 99, 99, 0.22)" // vermelho suave
    : "rgba(75, 142, 255, 0.22)"; // azul suave

  const textColor = isSaida ? "#ff6b6b" : "#4ba3ff";

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
    >
      {/* Cabeçalho */}
      <View style={styles.row}>
        <View style={[styles.iconContainer, { backgroundColor: bgColor }]}>
          <ArrowDownCircle color={textColor} size={20} />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={[styles.cardType, { color: textColor }]}>
            {isSaida ? "SAÍDA DE ESTOQUE" : "ENTRADA EM ESTOQUE"}
          </Text>

          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            {mov.material_nome}
          </Text>

          <Text style={[styles.date, { color: theme.colors.textLight }]}>
            {format(new Date(mov.created_date), "dd/MM/yyyy HH:mm")}
          </Text>
        </View>
      </View>

      {/* Obra / Origem */}
      <Text
        style={{
          marginTop: 6,
          fontSize: 15,
          fontWeight: "600",
          color: theme.colors.text,
        }}
      >
        {isSaida ? "Obra Destino: " : "Origem: "}
        <Text style={{ fontWeight: "700" }}>{mov.obra_nome}</Text>
      </Text>

      {/* Caixas de info */}
      <View style={[styles.cardBody, { marginTop: 12 }]}>
        {/* Quantidade */}
        <View
          style={[styles.infoBox, { backgroundColor: theme.colors.surfaceAlt }]}
        >
          <Package color={theme.colors.textLight} size={18} />
          <View>
            <Text style={[styles.infoLabel, { color: theme.colors.textLight }]}>
              Quantidade ({mov.material_unidade_medida || "un"})
            </Text>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>
              {mov.quantidade}
            </Text>
          </View>
        </View>

        {/* Valor total */}
        <View
          style={[styles.infoBox, { backgroundColor: theme.colors.surfaceAlt }]}
        >
          <DollarSign color={theme.colors.textLight} size={18} />
          <View>
            <Text style={[styles.infoLabel, { color: theme.colors.textLight }]}>
              Valor Total
            </Text>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>
              R$ {mov.valor_total?.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>

      {/* Observação */}
      {mov.observacao && (
        <Text
          style={[
            styles.observacao,
            {
              color: theme.colors.text,
              borderTopColor: theme.colors.border,
            },
          ]}
        >
          <Text style={{ fontWeight: "600" }}>Obs: </Text>
          {mov.observacao}
        </Text>
      )}
    </View>
  );
};

// =================================================================
// TELA PRINCIPAL — HISTÓRICO
// =================================================================
export default function Historico() {
  const { movimentacoes, obras, materials, isLoading } = useData();
  const { theme } = useThemeContext();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterObra, setFilterObra] = useState("all");
  const [filterMaterial, setFilterMaterial] = useState("all");

  const sortedMovimentacoes = useMemo(
    () =>
      [...movimentacoes].sort(
        (a, b) => new Date(b.created_date) - new Date(a.created_date)
      ),
    [movimentacoes]
  );

  const filteredMovimentacoes = useMemo(() => {
    return sortedMovimentacoes.filter((mov) => {
      const term = searchTerm.toLowerCase();

      const matches =
        mov.material_nome?.toLowerCase().includes(term) ||
        mov.obra_nome?.toLowerCase().includes(term) ||
        mov.observacao?.toLowerCase().includes(term);

      const obraOk = filterObra === "all" || mov.obra_id === filterObra;
      const materialOk =
        filterMaterial === "all" || mov.material_id === filterMaterial;

      return matches && obraOk && materialOk;
    });
  }, [sortedMovimentacoes, searchTerm, filterObra, filterMaterial]);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View
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
          Histórico de Movimentações
        </Text>

        {/* Busca */}
        <View
          style={[
            styles.searchBox,
            {
              backgroundColor: theme.colors.surfaceAlt,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <Search size={20} color={theme.colors.textMuted} />
          <TextInput
            placeholder="Buscar..."
            placeholderTextColor={theme.colors.textMuted}
            style={[styles.input, { color: theme.colors.text }]}
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>

        {/* Filtros */}
        <View style={styles.filters}>
          {/* Filtro Obra */}
          <View
            style={[
              styles.pickerContainer,
              {
                backgroundColor: theme.colors.surfaceAlt,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <Picker
              selectedValue={filterObra}
              onValueChange={setFilterObra}
              style={{ color: theme.colors.text }}
            >
              <Picker.Item label="Todas as Obras" value="all" />
              {obras.map((o) => (
                <Picker.Item key={o.id} label={o.nome_cliente} value={o.id} />
              ))}
            </Picker>
          </View>

          {/* Filtro Material */}
          <View
            style={[
              styles.pickerContainer,
              {
                backgroundColor: theme.colors.surfaceAlt,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <Picker
              selectedValue={filterMaterial}
              onValueChange={setFilterMaterial}
              style={{ color: theme.colors.text }}
            >
              <Picker.Item label="Todos os Materiais" value="all" />
              {materials.map((m) => (
                <Picker.Item key={m.id} label={m.nome} value={m.id} />
              ))}
            </Picker>
          </View>
        </View>
      </View>

      {/* Lista */}
      {filteredMovimentacoes.length === 0 ? (
        <View style={styles.empty}>
          <Text style={[styles.emptyText, { color: theme.colors.textMuted }]}>
            Nenhuma movimentação encontrada.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredMovimentacoes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MovimentacaoCard mov={item} theme={theme} />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

// =================================================================
// ESTILOS
// =================================================================
const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: {
    padding: 20,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 14,
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    paddingHorizontal: 10,
    height: 48,
    borderRadius: 12,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },

  filters: {
    flexDirection: "row",
    gap: 10,
  },

  pickerContainer: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
  },

  listContent: {
    padding: 20,
  },

  // Card
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  iconContainer: {
    padding: 6,
    borderRadius: 20,
    marginRight: 12,
  },
  cardType: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 2,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 2,
  },
  date: { fontSize: 12 },

  cardBody: {
    flexDirection: "row",
    gap: 10,
  },
  infoBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 10,
    borderRadius: 12,
  },
  infoLabel: { fontSize: 12 },
  infoValue: { fontSize: 14, fontWeight: "bold" },

  observacao: {
    fontSize: 13,
    paddingTop: 8,
    marginTop: 12,
    borderTopWidth: 1,
  },
});
