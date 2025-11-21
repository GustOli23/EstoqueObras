import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import {
  Building2,
  Database,
  LogOut,
  Shield,
  Moon,
  Sun,
  RotateCcw,
} from "lucide-react-native";

import { useData } from "../context/DataService";
import { useThemeContext } from "../context/ThemeContext";
import Toast from "react-native-toast-message";

export default function Configuracoes() {
  const { resetDatabase } = useData();
  const { theme, themeName, toggleTheme } = useThemeContext();

  const handleLogout = () => {
    Alert.alert(
      "Sair do Sistema",
      "Deseja encerrar a sessão atual?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sair",
          style: "destructive",
          onPress: () =>
            Alert.alert(
              "Logout simulado",
              "Implemente a lógica de autenticação aqui."
            ),
        },
      ],
      { cancelable: true }
    );
  };

  const handleReset = () => {
    Alert.alert(
      "Restaurar Banco de Dados",
      "Todos os dados atuais serão apagados e substituídos pelos dados de exemplo. Deseja continuar?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Restaurar",
          style: "destructive",
          onPress: async () => {
            await resetDatabase();
            Toast.show({
              type: "success",
              text1: "Banco restaurado!",
              text2: "Os dados de exemplo foram recarregados com sucesso.",
            });
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
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Configurações
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
            Gerencie as preferências do sistema
          </Text>
        </View>

        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: theme.colors.primary },
              ]}
            >
              <Building2 color="#fff" size={20} />
            </View>
            <View>
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                Peretto & Souza
              </Text>
              <Text
                style={[styles.cardSubtitle, { color: theme.colors.textMuted }]}
              >
                Construtora e Imobiliária
              </Text>
            </View>
          </View>

          <View
            style={[styles.divider, { borderBottomColor: theme.colors.border }]}
          />
          <Text style={[styles.infoText, { color: theme.colors.textMuted }]}>
            <Text style={styles.bold}>Localização:</Text> Socorro-SP
          </Text>
          <Text style={[styles.infoText, { color: theme.colors.textMuted }]}>
            <Text style={styles.bold}>Sistema:</Text> Gestão de Estoque e Obras
          </Text>
        </View>

        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.iconCircle,
                {
                  backgroundColor: themeName === "dark" ? "#334155" : "#facc15",
                },
              ]}
            >
              {themeName === "dark" ? (
                <Moon color="#fff" size={20} />
              ) : (
                <Sun color="#fff" size={20} />
              )}
            </View>
            <View>
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                Aparência
              </Text>
              <Text
                style={[styles.cardSubtitle, { color: theme.colors.textMuted }]}
              >
                Modo de exibição do aplicativo
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
            onPress={toggleTheme}
          >
            {themeName === "dark" ? (
              <Sun color="#facc15" size={20} />
            ) : (
              <Moon color="#334155" size={20} />
            )}
            <Text
              style={[
                styles.buttonText,
                {
                  color: themeName === "dark" ? "#facc15" : theme.colors.text,
                },
              ]}
            >
              {themeName === "dark"
                ? "Alternar para modo claro"
                : "Alternar para modo escuro"}
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.iconCircle, { backgroundColor: "#22c55e" }]}>
              <Database color="#fff" size={20} />
            </View>
            <View>
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                Dados
              </Text>
              <Text
                style={[styles.cardSubtitle, { color: theme.colors.textMuted }]}
              >
                Gerenciamento de armazenamento local
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: theme.colors.surface, borderColor: "#fca5a5" },
            ]}
            onPress={handleReset}
          >
            <RotateCcw color="#dc2626" size={20} />
            <Text style={[styles.buttonText, { color: "#dc2626" }]}>
              Restaurar Banco de Dados
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.iconCircle, { backgroundColor: "#64748b" }]}>
              <Shield color="#fff" size={20} />
            </View>
            <View>
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                Conta
              </Text>
              <Text
                style={[styles.cardSubtitle, { color: theme.colors.textMuted }]}
              >
                Configurações de acesso
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: theme.colors.surface, borderColor: "#fca5a5" },
            ]}
            onPress={handleLogout}
          >
            <LogOut color="#dc2626" size={20} />
            <Text style={[styles.buttonText, { color: "#dc2626" }]}>
              Sair do Sistema
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.footerCard,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <Text style={[styles.footerTitle, { color: theme.colors.text }]}>
            Sistema de Gestão Peretto & Souza
          </Text>
          <Text
            style={[styles.footerSubtitle, { color: theme.colors.textMuted }]}
          >
            Versão 1.0.0
          </Text>
          <Text style={[styles.footerNote, { color: theme.colors.textMuted }]}>
            Desenvolvido para otimizar o controle de estoque e obras
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    padding: 20,
    gap: 20,
  },
  header: {
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 15,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 10,
  },
  iconCircle: {
    padding: 10,
    borderRadius: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  cardSubtitle: {
    fontSize: 13,
  },
  divider: {
    borderBottomWidth: 1,
    marginVertical: 8,
  },
  infoText: {
    fontSize: 14,
    marginTop: 2,
  },
  bold: {
    fontWeight: "600",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginTop: 8,
  },
  buttonText: {
    marginLeft: 10,
    fontSize: 15,
    fontWeight: "500",
  },
  footerCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
  },
  footerTitle: {
    fontWeight: "bold",
    fontSize: 14,
  },
  footerSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  footerNote: {
    fontSize: 11,
    marginTop: 2,
    textAlign: "center",
  },
});
