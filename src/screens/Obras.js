import { useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Archive, Plus } from "lucide-react-native";
import { useData } from "../context/DataService";
import { useThemeContext } from "../context/ThemeContext";
import WorkCard from "../components/WorkCard";

export default function Obras() {
  const navigation = useNavigation();
  const { theme } = useThemeContext();
  const { obras, updateObra } = useData();
  const [tab, setTab] = useState("ativas");
  const [obraToArchive, setObraToArchive] = useState(null);

  const handleNewObra = () => navigation.navigate("WorkFormScreen");

  const handleEdit = (obra) => navigation.navigate("WorkFormScreen", { obra });

  const handleArchive = (obra) => setObraToArchive(obra);

  const confirmArchive = () => {
    if (obraToArchive) {
      updateObra(obraToArchive.id, { status: "arquivada" });
      setObraToArchive(null);
    }
  };

  const handleUnarchive = (obra) => {
    Alert.alert(
      "Reativar Obra",
      `Deseja reativar a obra ${obra.nome_cliente}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Reativar",
          style: "default",
          onPress: () => updateObra(obra.id, { status: "ativa" }),
        },
      ]
    );
  };

  const filteredObras = useMemo(() => {
    return obras.filter((obra) => {
      if (tab === "ativas") return obra.status === "ativa";
      if (tab === "arquivadas") return obra.status === "arquivada";
      return true;
    });
  }, [obras, tab]);

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.colors.surface,
            borderBottomColor: theme.colors.border,
          },
        ]}
      >
        <View style={styles.headerRow}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            Obras
          </Text>

          <TouchableOpacity
            style={[
              styles.newButton,
              { backgroundColor: theme.colors.primary },
            ]}
            onPress={handleNewObra}
          >
            <Plus color="white" size={18} style={styles.iconMargin} />
            <Text style={styles.newButtonText}>Nova</Text>
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.tabsContainer,
            { backgroundColor: theme.colors.surfaceAlt },
          ]}
        >
          <TouchableOpacity
            onPress={() => setTab("ativas")}
            style={[
              styles.tabButton,
              tab === "ativas" && {
                backgroundColor: theme.colors.surface,
                shadowColor: theme.colors.shadow,
              },
            ]}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    tab === "ativas"
                      ? theme.colors.primary
                      : theme.colors.textMuted,
                },
              ]}
            >
              Ativas ({obras.filter((o) => o.status === "ativa").length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setTab("arquivadas")}
            style={[
              styles.tabButton,
              tab === "arquivadas" && {
                backgroundColor: theme.colors.surface,
                shadowColor: theme.colors.shadow,
              },
            ]}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    tab === "arquivadas"
                      ? theme.colors.primary
                      : theme.colors.textMuted,
                },
              ]}
            >
              Arquivadas ({obras.filter((o) => o.status === "arquivada").length}
              )
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {filteredObras.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.colors.textMuted }]}>
            Nenhuma obra encontrada
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredObras}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <WorkCard
              obra={item}
              onEdit={handleEdit}
              onArchive={handleArchive}
              onUnarchive={handleUnarchive}
            />
          )}
          contentContainerStyle={styles.listContainer}
        />
      )}

      <Modal
        animationType="fade"
        transparent={true}
        visible={!!obraToArchive}
        onRequestClose={() => setObraToArchive(null)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[styles.modalBox, { backgroundColor: theme.colors.surface }]}
          >
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              Confirmar Arquivamento
            </Text>

            <Text style={[styles.modalText, { color: theme.colors.textMuted }]}>
              Tem certeza que deseja arquivar a obra{" "}
              <Text
                style={{
                  fontWeight: "600",
                  color: theme.colors.primary,
                }}
              >
                {obraToArchive?.nome_cliente}
              </Text>
              ?
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={() => setObraToArchive(null)}
                style={[
                  styles.cancelButton,
                  {
                    borderColor: theme.colors.border,
                    backgroundColor: theme.colors.surface,
                  },
                ]}
              >
                <Text style={{ color: theme.colors.text }}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={confirmArchive}
                style={[
                  styles.archiveButton,
                  { backgroundColor: theme.colors.warning },
                ]}
              >
                <Archive color="white" size={16} style={styles.iconMargin} />
                <Text style={styles.archiveText}>Arquivar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    padding: 24,
    borderBottomWidth: 1,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  newButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    height: 40,
    paddingHorizontal: 16,
  },
  newButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  iconMargin: { marginRight: 6 },

  tabsContainer: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
  },

  listContainer: { padding: 24 },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "90%",
    maxWidth: 400,
    borderRadius: 16,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  modalText: {
    fontSize: 15,
    marginBottom: 24,
  },

  modalActions: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  archiveButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  archiveText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
});
