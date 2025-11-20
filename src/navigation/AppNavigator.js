import React from "react";
import { TouchableOpacity, View } from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";

import { useThemeContext } from "../context/ThemeContext";

import Dashboard from "../screens/Dashboard";
import Materiais from "../screens/Materiais";
import Obras from "../screens/Obras";
import Historico from "../screens/Historico";
import Configuracoes from "../screens/Configuracoes";
import WorkForm from "../screens/WorkForm";
import MaterialForm from "../screens/MaterialForm";
import MovimentacaoForm from "../screens/MovimentacaoForm";

import {
  LayoutDashboard,
  Package,
  Wrench,
  History,
  Settings2,
  Plus,
} from "lucide-react-native";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

/* ---------------------------------------------------------
   BOTÃO DE CONFIG NO HEADER
--------------------------------------------------------- */
function HeaderConfigButton() {
  const navigation = useNavigation();
  const { theme } = useThemeContext();

  return (
    <TouchableOpacity
      style={{ marginRight: 16 }}
      onPress={() => navigation.navigate("Configuracoes")}
    >
      <Settings2 size={22} color={theme.colors.text} />
    </TouchableOpacity>
  );
}

/* ---------------------------------------------------------
   FUNÇÃO AUXILIAR: RETORNA OPÇÕES DO HEADER SEM CHAMAR HOOKS
--------------------------------------------------------- */
function createHeaderOptions(theme, title, showConfigButton = true) {
  return {
    headerShown: true,
    title,
    headerStyle: { backgroundColor: theme.colors.surface },
    headerTitleStyle: { color: theme.colors.text },
    headerTintColor: theme.colors.text,
    headerRight: showConfigButton ? () => <HeaderConfigButton /> : undefined,
  };
}

/* ---------------------------------------------------------
   STACK: DASHBOARD
--------------------------------------------------------- */
function DashboardStack() {
  const { theme } = useThemeContext();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DashboardHome"
        component={Dashboard}
        options={createHeaderOptions(theme, "Resumo Geral", true)}
      />
    </Stack.Navigator>
  );
}

/* ---------------------------------------------------------
   STACK: MATERIAIS
--------------------------------------------------------- */
function MateriaisStack() {
  const { theme } = useThemeContext();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MateriaisList"
        component={Materiais}
        options={createHeaderOptions(theme, "Inventário de Materiais", true)}
      />

      <Stack.Screen
        name="MaterialForm"
        component={MaterialForm}
        options={createHeaderOptions(theme, "Novo Material", false)}
      />
    </Stack.Navigator>
  );
}

/* ---------------------------------------------------------
   STACK: OBRAS
--------------------------------------------------------- */
function ObrasStack() {
  const { theme } = useThemeContext();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ObrasList"
        component={Obras}
        options={createHeaderOptions(theme, "Obras", true)}
      />

      <Stack.Screen
        name="WorkFormScreen"
        component={WorkForm}
        options={createHeaderOptions(theme, "Cadastro de Obra", false)}
      />
    </Stack.Navigator>
  );
}

/* ---------------------------------------------------------
   STACK: HISTÓRICO
--------------------------------------------------------- */
function HistoricoStack() {
  const { theme } = useThemeContext();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HistoricoScreen"
        component={Historico}
        options={createHeaderOptions(theme, "Histórico", true)}
      />
    </Stack.Navigator>
  );
}

/* ---------------------------------------------------------
   TABS
--------------------------------------------------------- */
function Tabs() {
  const { theme } = useThemeContext();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            height: 70,
            paddingBottom: 12,
            paddingTop: 6,
            backgroundColor: theme.colors.surface,
            borderTopColor: theme.colors.border,
          },
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.textMuted,
        }}
      >
        <Tab.Screen
          name="Home"
          component={DashboardStack}
          options={{
            tabBarLabel: "Resumo",
            tabBarIcon: ({ color, size }) => (
              <LayoutDashboard color={color} size={size} />
            ),
          }}
        />

        <Tab.Screen
          name="Materiais"
          component={MateriaisStack}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Package color={color} size={size} />
            ),
          }}
        />

        <Tab.Screen
          name="Add"
          component={Dashboard}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault();
              navigation.navigate("MovimentacaoForm");
            },
          })}
          options={{
            tabBarLabel: "",
            tabBarIcon: () => (
              <View
                style={{
                  width: 58,
                  height: 58,
                  backgroundColor: theme.colors.primary,
                  borderRadius: 32,
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 26,
                }}
              >
                <Plus color="white" size={28} />
              </View>
            ),
          }}
        />

        <Tab.Screen
          name="Obras"
          component={ObrasStack}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Wrench color={color} size={size} />
            ),
          }}
        />

        <Tab.Screen
          name="Historico"
          component={HistoricoStack}
          options={{
            tabBarLabel: "Histórico",
            tabBarIcon: ({ color, size }) => (
              <History color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

/* ---------------------------------------------------------
   STACK GLOBAL
--------------------------------------------------------- */
export default function AppNavigator() {
  const { theme } = useThemeContext();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Tabs" component={Tabs} />

        <Stack.Screen
          name="MovimentacaoForm"
          component={MovimentacaoForm}
          options={createHeaderOptions(theme, "Nova Movimentação", false)}
        />

        <Stack.Screen
          name="Configuracoes"
          component={Configuracoes}
          options={createHeaderOptions(theme, "Configurações", false)}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
