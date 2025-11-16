import React, { useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useThemeContext } from "../context/ThemeContext";
import { useData } from "../context/DataService";
import StatsCard from "../components/StatsCard";

// Ícones para os blocos de Movimentação + Alertas
import { MoveRight, AlertTriangle } from "lucide-react-native";

export default function Dashboard() {
  const navigation = useNavigation();
  const { theme } = useThemeContext();
  const { materiais, obras, movimentacoes } = useData();

  // Proteção contra undefined
  const safeMateriais = materiais || [];
  const safeObras = obras || [];
  const safeMovs = movimentacoes || [];

  // --- Estatísticas principais ---
  const totalMateriais = safeMateriais.length;

  const totalEstoque = safeMateriais.reduce(
    (sum, item) => sum + (item.valor_unitario || 0) * (item.estoque_atual || 0),
    0
  );

  const totalMetragem = safeObras.reduce(
    (sum, o) => sum + (parseFloat(o.metragem) || 0),
    0
  );

  const totalMovMes = safeMovs.length;

  const alertsCount = safeMateriais.filter(
    (item) => item.estoque_atual <= item.estoque_minimo
  ).length;

  // --- Valor movimentado por obra ---
  const valoresPorObra = useMemo(() => {
    const mapa = {};

    safeMovs.forEach((mov) => {
      if (!mov.obraId) return;

      const valor = mov.quantidade * mov.valorUnitario;

      if (!mapa[mov.obraId]) mapa[mov.obraId] = 0;
      mapa[mov.obraId] += valor;
    });

    return mapa;
  }, [movimentacoes]);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      contentContainerStyle={{ padding: 20 }}
    >
      {/* Título */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Resumo Geral
        </Text>
      </View>

      {/* GRID DE CARDS */}
      <View style={styles.grid}>
        <StatsCard
          title="Materiais (SKUs)"
          value={totalMateriais}
          description="Cadastrados no sistema"
          icon="cube"
          color="blue"
        />

        <StatsCard
          title="Valor em Estoque"
          value={`R$ ${totalEstoque.toFixed(2)}`}
          description="Soma de quantidades × valor unitário"
          icon="wallet"
          color="green"
        />

        <StatsCard
          title="Área Total das Obras"
          value={`${totalMetragem.toFixed(2)} m²`}
          description="Metragem somada"
          icon="ruler"
          color="orange"
        />

        <StatsCard
          title="Obras Ativas"
          value={safeObras.filter((o) => o.status === "ativa").length}
          description="Registradas"
          icon="layers"
          color="gray"
        />
      </View>

      {/* MOVIMENTAÇÕES + ALERTAS */}
      <View style={styles.row}>
        {/* Movimentações */}
        <TouchableOpacity
          style={[styles.block, { backgroundColor: theme.colors.surface }]}
          onPress={() => navigation.navigate("Historico")}
        >
          <View style={styles.blockHeader}>
            <Text style={[styles.blockTitle, { color: theme.colors.text }]}>
              Movimentações (mês)
            </Text>
            <MoveRight color={theme.colors.text} size={18} />
          </View>

          <Text style={[styles.blockValue, { color: theme.colors.primary }]}>
            {totalMovMes}
          </Text>

          <Text style={[styles.blockSub, { color: theme.colors.textMuted }]}>
            {totalMovMes} totais
          </Text>
        </TouchableOpacity>

        {/* Alertas */}
        <TouchableOpacity
          style={[styles.block, { backgroundColor: theme.colors.surface }]}
          onPress={() => navigation.navigate("Materiais")}
        >
          <View style={styles.blockHeader}>
            <Text style={[styles.blockTitle, { color: theme.colors.text }]}>
              Alertas
            </Text>
            <AlertTriangle color={theme.colors.warning} size={18} />
          </View>

          <Text style={[styles.blockValue, { color: theme.colors.warning }]}>
            {alertsCount}
          </Text>

          <Text style={[styles.blockSub, { color: theme.colors.textMuted }]}>
            Itens com estoque crítico
          </Text>
        </TouchableOpacity>
      </View>

      {/* VALOR MOVIMENTADO POR OBRA */}
      <Text
        style={[
          styles.sectionTitle,
          { color: theme.colors.text, marginTop: 20 },
        ]}
      >
        Valor Movimentado por Obra
      </Text>

      <View style={styles.obraList}>
        {safeObras.map((obra) => (
          <View
            key={obra.id}
            style={[
              styles.obraItem,
              { borderBottomColor: theme.colors.border },
            ]}
          >
            <Text style={[styles.obraName, { color: theme.colors.text }]}>
              {obra.nome_cliente}
            </Text>

            <Text style={[styles.obraValue, { color: theme.colors.primary }]}>
              R$ {(valoresPorObra[obra.id] || 0).toFixed(2)}
            </Text>
          </View>
        ))}

        {/* TOTAL */}
        <View style={styles.obraItem}>
          <Text style={[styles.obraName, { color: theme.colors.textMuted }]}>
            Total geral:
          </Text>

          <Text style={[styles.obraValue, { color: theme.colors.primary }]}>
            R$
            {Object.values(valoresPorObra)
              .reduce((a, b) => a + b, 0)
              .toFixed(2)}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

/* ---------- ESTILOS ---------- */

const styles = StyleSheet.create({
  header: { marginBottom: 12 },
  title: { fontSize: 26, fontWeight: "bold" },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },

  block: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    elevation: 2,
    marginRight: 10,
  },

  blockHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  blockTitle: { fontSize: 15, fontWeight: "600" },

  blockValue: { fontSize: 22, fontWeight: "bold" },

  blockSub: { fontSize: 12, marginTop: 3 },

  sectionTitle: { fontSize: 18, fontWeight: "700" },

  obraList: { marginTop: 10, borderRadius: 12 },

  obraItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },

  obraName: { fontSize: 15, fontWeight: "500" },

  obraValue: { fontSize: 15, fontWeight: "700" },
});
