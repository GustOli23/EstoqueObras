import React, { useState, createContext, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const materials_mock = [
  {
    id: "mat1",
    nome: "Cimento CP II-32",
    unidade_medida: "sacos",
    quantidade: 4,
    estoque_minimo: 5,
    valor_unitario: 35.5,
  },
  {
    id: "mat2",
    nome: "Tijolo Baiano 6 Furos",
    unidade_medida: "unid",
    quantidade: 500,
    estoque_minimo: 400,
    valor_unitario: 1.1,
  },
  {
    id: "mat3",
    nome: "Areia Média",
    unidade_medida: "m³",
    quantidade: 2.5,
    estoque_minimo: 5,
    valor_unitario: 100.0,
  },
  {
    id: "mat4",
    nome: 'Vergalhão 3/8"',
    unidade_medida: "barras",
    quantidade: 15,
    estoque_minimo: 20,
    valor_unitario: 50.0,
  },
];

const obras_mock = [
  {
    id: "obra1",
    nome_cliente: "Casa do João",
    status: "ativa",
    local: "Rua A, 123",
  },
  {
    id: "obra2",
    nome_cliente: "Residência Ana",
    status: "arquivada",
    local: "Av. B, 456",
  },
  {
    id: "obra3",
    nome_cliente: "Prédio Comercial",
    status: "ativa",
    local: "Centro",
  },
];

const movimentacoes_mock = [
  {
    id: "mov1",
    tipo: "saida",
    material_id: "mat1",
    material_nome: "Cimento CP II-32",
    obra_id: "obra1",
    obra_nome: "Casa do João",
    quantidade: 5,
    valor_total: 177.5,
    observacao: "Início da fundação",
    created_date: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "mov2",
    tipo: "saida",
    material_id: "mat3",
    material_nome: "Areia Média",
    obra_id: "obra3",
    obra_nome: "Prédio Comercial",
    quantidade: 1,
    valor_total: 100.0,
    observacao: "Primeira carga",
    created_date: new Date(Date.now() - 3600000).toISOString(),
  },
];

const STORAGE_KEYS = {
  materials: "@data_materials",
  obras: "@data_obras",
  movimentacoes: "@data_movimentacoes",
};

const DataContext = createContext();
export const useData = () => useContext(DataContext);

export function DataProvider({ children }) {
  const [materials, setMaterials] = useState([]);
  const [obras, setObras] = useState([]);
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedMaterials = await AsyncStorage.getItem(
          STORAGE_KEYS.materials
        );
        const storedObras = await AsyncStorage.getItem(STORAGE_KEYS.obras);
        const storedMovs = await AsyncStorage.getItem(
          STORAGE_KEYS.movimentacoes
        );

        setMaterials(
          storedMaterials ? JSON.parse(storedMaterials) : materials_mock
        );
        setObras(storedObras ? JSON.parse(storedObras) : obras_mock);
        setMovimentacoes(
          storedMovs ? JSON.parse(storedMovs) : movimentacoes_mock
        );
      } catch (error) {
        console.error("Erro ao carregar dados locais:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const saveData = async (key, data) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Erro ao salvar ${key}:`, error);
    }
  };

  const createMaterial = (data) => {
    const newMaterial = {
      ...data,
      id: `mat${Date.now()}`,
      created_date: new Date().toISOString(),
    };
    const updated = [newMaterial, ...materials];
    setMaterials(updated);
    saveData(STORAGE_KEYS.materials, updated);
    return newMaterial;
  };

  const updateMaterial = (id, data) => {
    const updated = materials.map((m) => (m.id === id ? { ...m, ...data } : m));
    setMaterials(updated);
    saveData(STORAGE_KEYS.materials, updated);
  };

  const deleteMaterial = (id) => {
    const updated = materials.filter((m) => m.id !== id);
    setMaterials(updated);
    saveData(STORAGE_KEYS.materials, updated);
  };

  const createObra = (data) => {
    const newObra = {
      ...data,
      id: `obra${Date.now()}`,
      created_date: new Date().toISOString(),
      status: "ativa",
    };
    const updated = [newObra, ...obras];
    setObras(updated);
    saveData(STORAGE_KEYS.obras, updated);
    return newObra;
  };

  const updateObra = (id, data) => {
    const updated = obras.map((o) => (o.id === id ? { ...o, ...data } : o));
    setObras(updated);
    saveData(STORAGE_KEYS.obras, updated);
  };

  const deleteObra = (id) => {
    const updated = obras.filter((o) => o.id !== id);
    setObras(updated);
    saveData(STORAGE_KEYS.obras, updated);
  };

  const createMovimentacao = (data) => {
    const newMov = {
      ...data,
      id: `mov${Date.now()}`,
      created_date: new Date().toISOString(),
    };

    const materialToUpdate = materials.find((m) => m.id === data.material_id);
    if (materialToUpdate) {
      const quantidadeMov = parseFloat(data.quantidade);
      let novaQuantidade = materialToUpdate.quantidade;

      if (data.tipo === "saida") novaQuantidade -= quantidadeMov;
      else if (data.tipo === "entrada") novaQuantidade += quantidadeMov;

      updateMaterial(materialToUpdate.id, { quantidade: novaQuantidade });
    }

    const updated = [newMov, ...movimentacoes];
    setMovimentacoes(updated);
    saveData(STORAGE_KEYS.movimentacoes, updated);
    return newMov;
  };

  const resetDatabase = async () => {
    try {
      setIsLoading(true);

      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));

      setMaterials(materials_mock);
      setObras(obras_mock);
      setMovimentacoes(movimentacoes_mock);

      await AsyncStorage.setItem(
        STORAGE_KEYS.materials,
        JSON.stringify(materials_mock)
      );
      await AsyncStorage.setItem(
        STORAGE_KEYS.obras,
        JSON.stringify(obras_mock)
      );
      await AsyncStorage.setItem(
        STORAGE_KEYS.movimentacoes,
        JSON.stringify(movimentacoes_mock)
      );

      console.log("✅ Banco de dados restaurado para o estado inicial.");
    } catch (error) {
      console.error("Erro ao restaurar banco de dados:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    isLoading,
    materials,
    obras,
    movimentacoes,

    createMaterial,
    updateMaterial,
    deleteMaterial,
    createObra,
    updateObra,
    deleteObra,
    createMovimentacao,

    resetDatabase,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
