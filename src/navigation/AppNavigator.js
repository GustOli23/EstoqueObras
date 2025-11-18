import React from "react";
import { TouchableOpacity, View } from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
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

/* ---------------- BOTÃO NO HEADER ---------------- */
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

/* -------------------- STACKS DAS TELAS -------------------- */

function DashboardStack() {
  const { theme } = useThemeContext();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTitleStyle: { color: theme.colors.text },
        headerRight: () => <HeaderConfigButton />,
      }}
    >
      <Stack.Screen
        name="DashboardHome"
        component={Dashboard}
        options={{ title: "Resumo Geral" }}
      />
    </Stack.Navigator>
  );
}

function MateriaisStack() {
  const { theme } = useThemeContext();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTitleStyle: { color: theme.colors.text },
        headerRight: () => <HeaderConfigButton />,
      }}
    >
      <Stack.Screen
        name="MateriaisList"
        component={Materiais}
        options={{ title: "Inventário de Materiais" }}
      />
      <Stack.Screen
        name="MaterialForm"
        component={MaterialForm}
        options={{ title: "Novo Material" }}
      />
    </Stack.Navigator>
  );
}

function ObrasStack() {
  const { theme } = useThemeContext();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTitleStyle: { color: theme.colors.text },
        headerRight: () => <HeaderConfigButton />,
      }}
    >
      <Stack.Screen
        name="ObrasList"
        component={Obras}
        options={{ title: "Obras" }}
      />
      <Stack.Screen
        name="WorkFormScreen"
        component={WorkForm}
        options={{ title: "Cadastro de Obra" }}
      />
    </Stack.Navigator>
  );
}

function HistoricoStack() {
  const { theme } = useThemeContext();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTitleStyle: { color: theme.colors.text },
        headerRight: () => <HeaderConfigButton />,
      }}
    >
      <Stack.Screen
        name="HistoricoList"
        component={Historico}
        options={{ title: "Histórico" }}
      />
    </Stack.Navigator>
  );
}

/* -------------------- TABS -------------------- */
function Tabs() {
  const { theme } = useThemeContext();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 60,
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
        component={Dashboard} // componente qualquer apenas para preencher, não será mostrado
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            // abre o formulário de movimentação (agora registrado no stack global)
            navigation.navigate("MovimentacaoForm");
          },
        })}
        options={{
          tabBarLabel: "",
          tabBarIcon: () => (
            <View
              style={{
                width: 55,
                height: 55,
                backgroundColor: theme.colors.primary,
                borderRadius: 30,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 20,
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
          tabBarIcon: ({ color, size }) => <Wrench color={color} size={size} />,
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
  );
}

/* -------------------- STACK GLOBAL -------------------- */
export default function AppNavigator() {
  const { theme } = useThemeContext();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* TODAS AS TABS */}
        <Stack.Screen name="Tabs" component={Tabs} />

        {/* Tela de Movimentação - acessível globalmente */}
        <Stack.Screen
          name="MovimentacaoForm"
          component={MovimentacaoForm}
          options={{
            headerShown: true,
            headerStyle: { backgroundColor: theme.colors.surface },
            headerTitleStyle: { color: theme.colors.text },
            title: "Nova Movimentação",
          }}
        />

        {/* Tela de Configurações */}
        <Stack.Screen
          name="Configuracoes"
          component={Configuracoes}
          options={{
            headerShown: true,
            headerStyle: { backgroundColor: theme.colors.surface },
            headerTitleStyle: { color: theme.colors.text },
            title: "Configurações",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
