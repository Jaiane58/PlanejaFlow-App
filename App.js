import React, { useState, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  Alert,
  ActivityIndicator,
  Switch,
  Platform,
  Vibration,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const COLORS = {
  primary: '#000000',
  secondary: '#0A0A0A',
  accent: '#D4AF37',
  white: '#FFFFFF',
  gray: '#1C1C1C',
  lightGray: '#888888',
  success: '#00C853',
  error: '#FF3B30',
  warning: '#FF9500',
};

const EXPENSE_CATEGORIES = [
  { icon: '🍽️', name: 'Alimentação' },
  { icon: '🚗', name: 'Transporte' },
  { icon: '🏠', name: 'Moradia' },
  { icon: '💡', name: 'Contas' },
  { icon: '💊', name: 'Saúde' },
  { icon: '📚', name: 'Educação' },
  { icon: '🛍️', name: 'Compras' },
  { icon: '🎉', name: 'Lazer' },
];

const INCOME_CATEGORIES = [
  { icon: '💰', name: 'Salário' },
  { icon: '💼', name: 'Freelance' },
  { icon: '📈', name: 'Investimentos' },
];

const PAYMENT_METHODS = [
  { icon: '💵', name: 'Dinheiro' },
  { icon: '💳', name: 'Cartão' },
  { icon: '📱', name: 'PIX' },
];

const CURRENCIES = [
  { code: 'BRL', symbol: 'R$', name: 'Real' },
];

const INITIAL_DATA = {
  transactions: [
    { id: '1', type: 'expense', category: 'Alimentação', amount: 350.50, date: '2025-01-13', description: 'Supermercado' },
    { id: '2', type: 'income', category: 'Salário', amount: 8500.00, date: '2025-01-08', description: 'Salário' },
  ],
  investments: [],
  goals: [],
  cards: [],
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [currency, setCurrency] = useState(CURRENCIES[0]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const handleLogin = (email, password) => {
    if (email === 'demo@planejaflow.com' && password === '123456') {
      setIsAuthenticated(true);
    } else {
      Alert.alert('Erro', 'Credenciais inválidas');
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent, { backgroundColor: COLORS.primary }]}>
        <ActivityIndicator size="large" color={COLORS.accent} />
        <Text style={[styles.loadingText, { color: COLORS.accent }]}>PlanejaFlow PRO</Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: COLORS.primary }]}>
        <View style={styles.loginContainer}>
          <Text style={[styles.loginTitle, { color: COLORS.accent }]}>✨ PlanejaFlow PRO</Text>
          <TextInput style={styles.loginInput} placeholder="Email" placeholderTextColor={COLORS.lightGray} />
          <TextInput style={styles.loginInput} placeholder="Senha" placeholderTextColor={COLORS.lightGray} secureTextEntry />
          <TouchableOpacity style={[styles.loginButton, { backgroundColor: COLORS.accent }]} onPress={() => handleLogin('demo@planejaflow.com', '123456')}>
            <Text style={[styles.loginButtonText, { color: COLORS.primary }]}>Entrar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.primary }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: COLORS.accent }]}>✨ PlanejaFlow</Text>
      </View>
      <View style={styles.dashboard}>
        <Text style={[styles.balanceAmount, { color: COLORS.accent }]}>R$ 8.500,00</Text>
        <TouchableOpacity style={[styles.addButton, { backgroundColor: COLORS.accent }]}>
          <Text style={[styles.addButtonText, { color: COLORS.primary }]}>Nova Transação</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.tabBar}>
        <Text style={styles.tabLabel}>Início</Text>
        <Text style={styles.tabLabel}>Transações</Text>
        <Text style={styles.tabLabel}>Ajustes</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerContent: { justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 28, fontWeight: 'bold', marginTop: 20 },
  loginContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  loginTitle: { fontSize: 32, fontWeight: 'bold', marginBottom: 40 },
  loginInput: { width: '100%', padding: 14, borderRadius: 12, marginBottom: 16, fontSize: 16, backgroundColor: '#1C1C1C', color: '#FFF' },
  loginButton: { width: '100%', padding: 16, borderRadius: 12, alignItems: 'center' },
  loginButtonText: { fontSize: 16, fontWeight: 'bold' },
  header: { padding: 20, alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  dashboard: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  balanceAmount: { fontSize: 48, fontWeight: 'bold', marginBottom: 20 },
  addButton: { padding: 16, borderRadius: 12, alignItems: 'center' },
  addButtonText: { fontSize: 16, fontWeight: 'bold' },
  tabBar: { flexDirection: 'row', justifyContent: 'space-around', padding: 16, borderTopWidth: 1, borderTopColor: '#333' },
  tabLabel: { fontSize: 14, color: '#FFF' },
});
