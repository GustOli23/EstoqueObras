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

// 🔹 Função auxiliar para formatação de data
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return format(date, "dd/MM/yyyy", { locale: ptBR });
  } catch {
    return dateString || "N/A";
  }
};

// 🔹 Badge de status da obra
const StatusBadge = ({ status, theme }) => {
  let backgroundColor = theme.colors.primaryLight;
  let color = theme.colors.primary;

  if (status === "arquivada") {
    backgroundColor = theme.colors.border;
    color = theme.colors.textMuted;
  } else if (status === "ativa") {
    backgroundColor = theme.colors.successLight;
    color = theme.colors.success;
  }

  const label = status === "arquivada" ? "Arquivada" : "Ativa";

  return (
    <View style={[styles.badge, { backgroundColor }]}>
      <Text style={[styles.badgeText, { color }]}>{label}</Text>
    </View>
  );
};

// 🔹 Cartão principal
export default function WorkCard({ obra, onEdit, onArchive }) {
  const { theme } = useThemeContext();
  const isArchived = obra.status === "arquivada";

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
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <View style={styles.headerLeft}>
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: isArchived
                  ? theme.colors.textMuted
                  : theme.colors.primary,
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
            <StatusBadge status={obra.status} theme={theme} />
          </View>
        </View>

        {onEdit && (
          <TouchableOpacity
            onPress={() => onEdit(obra)}
            style={[
              styles.editButton,
              { backgroundColor: theme.colors.primaryLight },
            ]}
          >
            <Edit color={theme.colors.primary} size={18} />
          </TouchableOpacity>
        )}
      </View>

      {/* Corpo */}
      <View style={styles.body}>
        {/* Local */}
        <View style={styles.row}>
          <MapPin color={theme.colors.textMuted} size={18} />
          <View style={styles.detail}>
            <Text style={[styles.label, { color: theme.colors.textMuted }]}>
              Local
            </Text>
            <Text style={[styles.value, { color: theme.colors.text }]}>
              {obra.local || "Não informado"}
            </Text>
          </View>
        </View>

        {/* Data de início */}
        <View style={styles.row}>
          <Calendar color={theme.colors.textMuted} size={18} />
          <View style={styles.detail}>
            <Text style={[styles.label, { color: theme.colors.textMuted }]}>
              Data de Início
            </Text>
            <Text style={[styles.value, { color: theme.colors.text }]}>
              {formatDate(obra.data_inicio)}
            </Text>
          </View>
        </View>

        {/* Observações */}
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

      {/* Botão de Arquivar / Arquivada */}
      {onArchive && (
        <TouchableOpacity
          onPress={() => onArchive(obra)}
          disabled={isArchived}
          style={[
            styles.archiveButton,
            {
              backgroundColor: isArchived
                ? theme.colors.border
                : theme.colors.warningLight,
              borderColor: isArchived
                ? theme.colors.border
                : theme.colors.warning,
              opacity: isArchived ? 0.6 : 1,
            },
          ]}
        >
          <Archive
            color={isArchived ? theme.colors.textMuted : theme.colors.warning}
            size={18}
            style={{ marginRight: 6 }}
          />
          <Text
            style={[
              styles.archiveText,
              {
                color: isArchived
                  ? theme.colors.textMuted
                  : theme.colors.warning,
              },
            ]}
          >
            {isArchived ? "Obra Arquivada" : "Arquivar Obra"}
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
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingBottom: 12,
    borderBottomWidth: 1,
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    padding: 10,
    borderRadius: 12,
  },
  titleContainer: {
    marginLeft: 10,
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
  body: {
    gap: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  detail: { flex: 1 },
  label: {
    fontSize: 12,
  },
  value: {
    fontSize: 14,
    fontWeight: "600",
  },
  observacaoContainer: {
    borderTopWidth: 1,
    paddingTop: 10,
    marginTop: 8,
  },
  observacao: {
    fontSize: 13,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  archiveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    marginTop: 16,
  },
  archiveText: {
    fontWeight: "600",
  },
});
