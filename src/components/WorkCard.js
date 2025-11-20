import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  Archive,
  Building2,
  Calendar,
  Edit,
  MapPin,
} from "lucide-react-native";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useThemeContext } from "../context/ThemeContext";

// Formatação
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return format(date, "dd/MM/yyyy", { locale: ptBR });
  } catch {
    return dateString || "N/A";
  }
};

// Badge estilizado (igual ao MaterialCard)
const StatusBadge = ({ status }) => {
  const isArchived = status === "arquivada";

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: isArchived
            ? "rgba(255, 99, 99, 0.22)"
            : "rgba(75, 142, 255, 0.22)",
        },
      ]}
    >
      <Text
        style={{
          color: isArchived ? "#ff6b6b" : "#4ba3ff",
          fontWeight: "600",
          fontSize: 12,
        }}
      >
        {isArchived ? "Arquivada" : "Ativa"}
      </Text>
    </View>
  );
};

// CARD DA OBRA
export default function WorkCard({ obra, onEdit, onArchive, onUnarchive }) {
  const { theme } = useThemeContext();
  const isArchived = obra.status === "arquivada";

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: isArchived ? "#ff6b6b55" : theme.colors.border,
        },
      ]}
    >
      {/* Cabeçalho */}
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <View style={styles.headerLeft}>
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: isArchived ? "#ff6b6b" : theme.colors.primary,
              },
            ]}
          >
            <Building2 color="#fff" size={22} />
          </View>

          <View style={styles.titleContainer}>
            <Text
              style={[styles.title, { color: theme.colors.text }]}
              numberOfLines={1}
            >
              {obra.nome_cliente}
            </Text>

            <StatusBadge status={obra.status} />
          </View>
        </View>

        {onEdit && (
          <TouchableOpacity
            onPress={() => onEdit(obra)}
            style={[
              styles.editButton,
              { backgroundColor: "rgba(75, 142, 255, 0.22)" },
            ]}
          >
            <Edit color={theme.colors.primary} size={18} />
          </TouchableOpacity>
        )}
      </View>

      {/* Corpo */}
      <View style={styles.body}>
        <View style={styles.row}>
          <MapPin color={theme.colors.text} size={18} />
          <View style={styles.detail}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Local
            </Text>
            <Text style={[styles.value, { color: theme.colors.text }]}>
              {obra.local || "Não informado"}
            </Text>
          </View>
        </View>

        <View style={styles.row}>
          <Calendar color={theme.colors.text} size={18} />
          <View style={styles.detail}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Data de Início
            </Text>
            <Text style={[styles.value, { color: theme.colors.text }]}>
              {formatDate(obra.data_inicio)}
            </Text>
          </View>
        </View>

        {obra.observacoes && (
          <View
            style={[
              styles.observacaoContainer,
              { borderTopColor: theme.colors.border },
            ]}
          >
            <Text style={[styles.observacao, { color: theme.colors.text }]}>
              <Text style={{ fontWeight: "600" }}>Obs: </Text>
              {obra.observacoes}
            </Text>
          </View>
        )}
      </View>

      {/* BOTÃO DE ARQUIVAR / DESARQUIVAR */}
      {isArchived ? (
        // Botão DESARQUIVAR
        <TouchableOpacity
          onPress={() => onUnarchive && onUnarchive(obra)}
          style={[
            styles.archiveButton,
            {
              backgroundColor: "rgba(75, 142, 255, 0.22)", // fundo azul suave
              borderColor: theme.colors.primary, // borda azul
            },
          ]}
        >
          <Archive
            color={theme.colors.primary}
            size={18}
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.archiveText, { color: theme.colors.primary }]}>
            Reativar Obra
          </Text>
        </TouchableOpacity>
      ) : (
        // Botão ARQUIVAR
        <TouchableOpacity
          onPress={() => onArchive && onArchive(obra)}
          style={[
            styles.archiveButton,
            {
              backgroundColor: "rgba(255, 99, 99, 0.22)", // vermelho suave
              borderColor: "#ff6b6b55",
            },
          ]}
        >
          <Archive color="#ff6b6b" size={18} style={{ marginRight: 6 }} />
          <Text style={[styles.archiveText, { color: "#ff6b6b" }]}>
            Arquivar Obra
          </Text>
        </TouchableOpacity>
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
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 12,
    borderBottomWidth: 1,
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
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  editButton: {
    padding: 8,
    borderRadius: 10,
  },
  body: { gap: 10 },
  row: { flexDirection: "row", gap: 10, alignItems: "center" },
  detail: { flex: 1 },
  label: { fontSize: 12 },
  value: { fontSize: 14, fontWeight: "600" },
  observacaoContainer: {
    borderTopWidth: 1,
    paddingTop: 10,
    marginTop: 8,
  },
  observacao: { fontSize: 13 },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  archiveButton: {
    flexDirection: "row",
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 12,
    justifyContent: "center",
    marginTop: 14,
  },
  archiveText: { fontWeight: "600" },
});
