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
import { MoveRight, AlertTriangle } from "lucide-react-native";

export default function Dashboard() {
  const navigation = useNavigation();
  const { theme } = useThemeContext();

  // Dados globais
  const { materials = [], obras = [], movimentacoes = [] } = useData();

  // -----------------------------------------
  // TOTAL DE MATERIAIS
  // -----------------------------------------
  const totalMateriais = materials.length;

  // -----------------------------------------
  // TOTAL EM ESTOQUE = quantidade * valor_unitário
  // -----------------------------------------
  const totalEstoque = materials.reduce((sum, item) => {
    const qtd = Number(item.quantidade) || 0;
    const val = Number(item.valor_unitario) || 0;
    return sum + qtd * val;
  }, 0);

  // -----------------------------------------
  // PARSE DE DATA ROBUSTO (corrige datas no APK)
  // -----------------------------------------
  function parseDataMov(str) {
    if (!str) return null;

    let d = new Date(str);
    if (!isNaN(d)) return d;

    const p = str.split(/[/ :]/);
    if (p.length >= 3) {
      const dia = Number(p[0]);
      const mes = Number(p[1]) - 1;
      const ano = Number(p[2]);
      const hora = Number(p[3] || 0);
      const min = Number(p[4] || 0);
      return new Date(ano, mes, dia, hora, min);
    }

    return null;
  }

  const hoje = new Date();

  // -----------------------------------------
  // MOVIMENTAÇÕES NO MÊS (CONTAGEM)
  // -----------------------------------------
  const movMes = movimentacoes.filter((m) => {
    const d = parseDataMov(m.created_date);
    if (!d) return false;
    return (
      d.getFullYear() === hoje.getFullYear() && d.getMonth() === hoje.getMonth()
    );
  });

  const totalMovMes = movMes.length;

  // -----------------------------------------
  // VALOR MOVIMENTADO NO MÊS
  // -----------------------------------------
  const valorMovMes = movMes.reduce((acc, mov) => {
    return acc + (Number(mov.valor_total) || 0);
  }, 0);

  // -----------------------------------------
  // ALERTAS DE ESTOQUE (quantidade <= mínimo)
  // -----------------------------------------
  const alertsCount = materials.filter(
    (item) => Number(item.quantidade) <= Number(item.estoque_minimo)
  ).length;

  // -----------------------------------------
  // VALOR MOVIMENTADO POR OBRA
  // -----------------------------------------
  const valoresPorObra = useMemo(() => {
    const mapa = {};
    movimentacoes.forEach((mov) => {
      const id = mov.obra_id || mov.obraId;
      if (!id) return;
      mapa[id] = (mapa[id] || 0) + (Number(mov.valor_total) || 0);
    });
    return mapa;
  }, [movimentacoes]);

  // -----------------------------------------
  // RENDER
  // -----------------------------------------
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      contentContainerStyle={{ padding: 20 }}
    >
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Resumo Geral
      </Text>

      <View style={styles.grid}>
        <StatsCard
          title="Materiais (SKUs)"
          value={totalMateriais}
          description="Cadastrados no sistema"
        />

        <StatsCard
          title="Valor em Estoque"
          value={`R$ ${totalEstoque.toFixed(2)}`}
          description="Quantidades × valor"
        />

        <StatsCard
          title="Valor Movimentado (mês)"
          value={`R$ ${valorMovMes.toFixed(2)}`}
          description="Valor total do mês"
        />

        <StatsCard
          title="Obras Ativas"
          value={obras.filter((o) => o.status === "ativa").length}
          description="Registradas"
        />
      </View>

      <View style={styles.row}>
        {/* MOVIMENTAÇÕES DO MÊS */}
        <TouchableOpacity
          style={[styles.block, { backgroundColor: theme.colors.surface }]}
          onPress={() => navigation.navigate("Historico")}
        >
          <View style={styles.blockHeader}>
            <Text style={[styles.blockTitle, { color: theme.colors.text }]}>
              Movimentações (mês)
            </Text>
          </View>

          <Text style={[styles.blockValue, { color: theme.colors.primary }]}>
            {totalMovMes}
          </Text>

          <Text style={[styles.blockSub, { color: theme.colors.textMuted }]}>
            {totalMovMes} no mês atual
          </Text>
        </TouchableOpacity>

        {/* ALERTAS */}
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

      {/* VALOR POR OBRA */}
      <Text
        style={[
          styles.sectionTitle,
          { color: theme.colors.text, marginTop: 20 },
        ]}
      >
        Valor Movimentado por Obra
      </Text>

      <View style={styles.obraList}>
        {obras.map((obra) => (
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

const styles = StyleSheet.create({
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 16 },

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
