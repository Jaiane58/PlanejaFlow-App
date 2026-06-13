// App.js - PlanejaFlow PRO - Versão Final Corrigida
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
  Dimensions,
  ActivityIndicator,
  Switch,
  Platform,
  Vibration,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

// Cores Principais
const COLORS = {
  primary: '#000000',
  secondary: '#0A0A0A',
  accent: '#D4AF37',
  accentDark: '#B8960F',
  accentLight: '#F5D76E',
  white: '#FFFFFF',
  gray: '#1C1C1C',
  grayLight: '#2C2C2C',
  lightGray: '#888888',
  success: '#00C853',
  error: '#FF3B30',
  warning: '#FF9500',
  info: '#007AFF',
};

const LIGHT_THEME = {
  primary: '#F5F5F5',
  secondary: '#FFFFFF',
  accent: '#D4AF37',
  text: '#1A1A1A',
  textLight: '#666666',
  cardBg: '#FFFFFF',
  border: '#E5E5E5',
  gray: '#EEEEEE',
};

// Categorias
const EXPENSE_CATEGORIES = [
  { icon: '🍽️', name: 'Alimentação', color: '#FF6B6B' },
  { icon: '🚗', name: 'Transporte', color: '#4ECDC4' },
  { icon: '🏠', name: 'Moradia', color: '#45B7D1' },
  { icon: '💡', name: 'Contas', color: '#96CEB4' },
  { icon: '💊', name: 'Saúde', color: '#FFEAA7' },
  { icon: '📚', name: 'Educação', color: '#DDA0DD' },
  { icon: '🛍️', name: 'Compras', color: '#FFB347' },
  { icon: '🎉', name: 'Lazer', color: '#FF6F61' },
  { icon: '👕', name: 'Vestuário', color: '#B19CD9' },
  { icon: '📱', name: 'Telecom', color: '#87CEEB' },
  { icon: '💳', name: 'Dívidas', color: '#E74C3C' },
  { icon: '🐾', name: 'Pets', color: '#F39C12' },
];

const INCOME_CATEGORIES = [
  { icon: '💰', name: 'Salário', color: '#00C853' },
  { icon: '💼', name: 'Freelance', color: '#2196F3' },
  { icon: '📈', name: 'Investimentos', color: '#4CAF50' },
  { icon: '🎁', name: 'Presentes', color: '#FF9800' },
  { icon: '🏠', name: 'Aluguel', color: '#FF5722' },
];

// Ícones para Metas
const GOAL_ICONS = [
  { icon: '✈️', name: 'Viagem' },
  { icon: '🏠', name: 'Casa' },
  { icon: '🚗', name: 'Carro' },
  { icon: '🎓', name: 'Estudos' },
  { icon: '💼', name: 'Negócio' },
  { icon: '❤️', name: 'Saúde' },
  { icon: '🎁', name: 'Presente' },
  { icon: '💰', name: 'Investimento' },
  { icon: '🏖️', name: 'Lazer' },
  { icon: '📱', name: 'Tecnologia' },
];

const INVESTMENT_TYPES = [
  { name: 'Renda Fixa', icon: '🏦', subTypes: ['CDB', 'LCI', 'LCA', 'Tesouro Selic', 'Tesouro IPCA', 'Tesouro Prefixado', 'Debêntures', 'CRI', 'CRA'] },
  { name: 'Renda Variável', icon: '📈', subTypes: ['Ações', 'FIIs', 'ETFs', 'BDRs', 'Criptomoedas', 'Fundos Multimercado'] },
  { name: 'Previdência', icon: '👴', subTypes: ['PGBL', 'VGBL', 'Previdência Privada'] },
  { name: 'Internacional', icon: '🌍', subTypes: ['Stocks', 'REITs', 'ETFs Globais', 'ADR'] },
];

const PAYMENT_METHODS = [
  { icon: '💵', name: 'Dinheiro' },
  { icon: '💳', name: 'Débito' },
  { icon: '💳', name: 'Crédito' },
  { icon: '📱', name: 'PIX' },
  { icon: '🏦', name: 'Transferência' },
];

const CURRENCIES = [
  { code: 'BRL', symbol: 'R$', name: 'Real' },
  { code: 'USD', symbol: 'US$', name: 'Dólar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
];

// Dados Iniciais
const INITIAL_DATA = {
  transactions: [
    { id: '1', type: 'expense', category: 'Alimentação', categoryIcon: '🍽️', amount: 350.50, date: '2024-01-13', description: 'Supermercado', paymentMethod: 'Crédito' },
    { id: '2', type: 'income', category: 'Salário', categoryIcon: '💰', amount: 8500.00, date: '2024-01-08', description: 'Salário Janeiro', paymentMethod: 'PIX' },
    { id: '3', type: 'expense', category: 'Transporte', categoryIcon: '🚗', amount: 180.00, date: '2024-01-10', description: 'Uber', paymentMethod: 'Débito' },
    { id: '4', type: 'expense', category: 'Lazer', categoryIcon: '🎉', amount: 250.00, date: '2024-01-14', description: 'Cinema', paymentMethod: 'Crédito' },
    { id: '5', type: 'expense', category: 'Moradia', categoryIcon: '🏠', amount: 2000.00, date: '2024-01-05', description: 'Aluguel', paymentMethod: 'PIX' },
  ],
  investments: [
    { id: '1', name: 'CDB Banco Inter', type: 'Renda Fixa', subType: 'CDB', amount: 15000, profitability: 12.5, institution: 'Banco Inter' },
    { id: '2', name: 'PETR4', type: 'Renda Variável', subType: 'Ações', amount: 5000, profitability: 8.3, institution: 'XP Investimentos' },
  ],
  goals: [
    { id: '1', name: 'Viagem Internacional', targetAmount: 25000, savedAmount: 12500, targetDate: '2025-06-30', priority: 'Alta', icon: '✈️' },
    { id: '2', name: 'Entrada Imóvel', targetAmount: 150000, savedAmount: 30000, targetDate: '2026-12-31', priority: 'Média', icon: '🏠' },
    { id: '3', name: 'Reserva de Emergência', targetAmount: 50000, savedAmount: 15000, targetDate: '2025-03-31', priority: 'Alta', icon: '💰' },
  ],
  cards: [
    { id: '1', name: 'Nubank', holder: 'João Silva', dueDate: 10, totalLimit: 15000, availableLimit: 9800, bestDay: 15, color: '#8B00FF', invoiceAmount: 5200 },
    { id: '2', name: 'Itaú', holder: 'João Silva', dueDate: 15, totalLimit: 8000, availableLimit: 6200, bestDay: 20, color: '#FF6200', invoiceAmount: 1800 },
  ],
};

// Componente de DatePicker
function CustomDatePicker({ visible, value, onConfirm, onCancel, darkMode }) {
  const [selectedDay, setSelectedDay] = useState(value?.getDate() || 1);
  const [selectedMonth, setSelectedMonth] = useState(value?.getMonth() || 0);
  const [selectedYear, setSelectedYear] = useState(value?.getFullYear() || 2024);

  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const days = Array.from({ length: new Date(selectedYear, selectedMonth + 1, 0).getDate() }, (_, i) => i + 1);
  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 2 + i);

  const handleConfirm = () => {
    const newDate = new Date(selectedYear, selectedMonth, selectedDay);
    onConfirm(newDate);
  };

  if (!visible) return null;

  const cardBg = darkMode ? COLORS.secondary : LIGHT_THEME.cardBg;
  const textColor = darkMode ? COLORS.white : LIGHT_THEME.text;

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <TouchableOpacity style={styles.dateModalOverlay} activeOpacity={1} onPress={onCancel}>
        <View style={[styles.dateModalContent, { backgroundColor: cardBg }]}>
          <Text style={[styles.dateModalTitle, { color: COLORS.accent }]}>📅 Selecionar Data</Text>
          
          <View style={styles.datePickerContainer}>
            <View style={styles.datePickerColumn}>
              <Text style={[styles.datePickerLabel, { color: textColor }]}>Dia</Text>
              <FlatList data={days} keyExtractor={(item) => item.toString()} renderItem={({ item }) => (
                <TouchableOpacity onPress={() => setSelectedDay(item)} style={styles.datePickerItem}>
                  <Text style={[styles.datePickerItemText, { color: textColor }, selectedDay === item && { color: COLORS.accent, fontWeight: 'bold' }]}>{item}</Text>
                </TouchableOpacity>
              )} showsVerticalScrollIndicator={false} style={styles.datePickerList} />
            </View>
            <View style={styles.datePickerColumn}>
              <Text style={[styles.datePickerLabel, { color: textColor }]}>Mês</Text>
              <FlatList data={months} keyExtractor={(item, index) => index.toString()} renderItem={({ item, index }) => (
                <TouchableOpacity onPress={() => setSelectedMonth(index)} style={styles.datePickerItem}>
                  <Text style={[styles.datePickerItemText, { color: textColor }, selectedMonth === index && { color: COLORS.accent, fontWeight: 'bold' }]}>{item}</Text>
                </TouchableOpacity>
              )} showsVerticalScrollIndicator={false} style={styles.datePickerList} />
            </View>
            <View style={styles.datePickerColumn}>
              <Text style={[styles.datePickerLabel, { color: textColor }]}>Ano</Text>
              <FlatList data={years} keyExtractor={(item) => item.toString()} renderItem={({ item }) => (
                <TouchableOpacity onPress={() => setSelectedYear(item)} style={styles.datePickerItem}>
                  <Text style={[styles.datePickerItemText, { color: textColor }, selectedYear === item && { color: COLORS.accent, fontWeight: 'bold' }]}>{item}</Text>
                </TouchableOpacity>
              )} showsVerticalScrollIndicator={false} style={styles.datePickerList} />
            </View>
          </View>
          
          <View style={styles.dateModalButtons}>
            <TouchableOpacity style={[styles.dateCancelBtn, { backgroundColor: darkMode ? COLORS.gray : LIGHT_THEME.gray }]} onPress={onCancel}>
              <Text style={[styles.dateCancelText, { color: textColor }]}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.dateConfirmBtn, { backgroundColor: COLORS.accent }]} onPress={handleConfirm}>
              <Text style={[styles.dateConfirmText, { color: COLORS.primary }]}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

function GoalAllocationModal({ visible, onClose, onAllocate, amount, darkMode }) {
  const [selectedGoalId, setSelectedGoalId] = useState(null);
  const [allocationAmount, setAllocationAmount] = useState('');
  const [goals, setGoals] = useState([]);
  
  useEffect(() => { loadGoals(); }, [visible]);
  
  const loadGoals = async () => {
    try {
      const savedData = await AsyncStorage.getItem('@PlanejaFlow:data');
      if (savedData) { const data = JSON.parse(savedData); setGoals(data.goals || []); }
    } catch (error) { console.error('Erro ao carregar metas:', error); }
  };
  
  const handleAllocate = () => {
    const allocAmount = parseFloat(allocationAmount);
    if (!selectedGoalId) { Alert.alert('Erro', 'Selecione uma meta'); return; }
    if (isNaN(allocAmount) || allocAmount <= 0) { Alert.alert('Erro', 'Digite um valor válido'); return; }
    if (allocAmount > amount) { Alert.alert('Erro', 'Valor excede o disponível'); return; }
    onAllocate(selectedGoalId, allocAmount);
    setSelectedGoalId(null);
    setAllocationAmount('');
    onClose();
  };
  
  const cardBg = darkMode ? COLORS.secondary : LIGHT_THEME.cardBg;
  const textColor = darkMode ? COLORS.white : LIGHT_THEME.text;
  
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={[styles.modalContentLarge, { backgroundColor: cardBg }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: COLORS.accent }]}>🎯 Destinar para Meta</Text>
            <TouchableOpacity onPress={onClose}><Ionicons name="close" size={24} color={COLORS.lightGray} /></TouchableOpacity>
          </View>
          <Text style={[styles.modalSubtitle, { color: COLORS.lightGray }]}>Valor disponível: R$ {amount.toFixed(2)}</Text>
          <Text style={[styles.inputLabel, { color: textColor }]}>Selecione a Meta:</Text>
          <ScrollView style={{ maxHeight: 200, marginBottom: 16 }}>
            {goals.filter(g => g.savedAmount < g.targetAmount).map(goal => {
              const progress = (goal.savedAmount / goal.targetAmount) * 100;
              return (
                <TouchableOpacity key={goal.id} style={[styles.goalSelectItem, selectedGoalId === goal.id && styles.goalSelectItemActive]} onPress={() => setSelectedGoalId(goal.id)}>
                  <View style={styles.goalSelectInfo}>
                    <Text style={[styles.goalSelectName, { color: textColor }]}>{goal.icon || '🎯'} {goal.name}</Text>
                    <Text style={[styles.goalSelectProgress, { color: COLORS.lightGray }]}>{progress.toFixed(0)}% concluída</Text>
                  </View>
                  {selectedGoalId === goal.id && <Ionicons name="checkmark-circle" size={24} color={COLORS.accent} />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <TextInput style={[styles.modalInputLarge, { backgroundColor: darkMode ? COLORS.gray : LIGHT_THEME.gray, color: textColor }]} placeholder="Valor para destinar" placeholderTextColor={COLORS.lightGray} value={allocationAmount} onChangeText={setAllocationAmount} keyboardType="decimal-pad" />
          <View style={styles.modalButtons}>
            <TouchableOpacity style={[styles.cancelButton, { backgroundColor: darkMode ? COLORS.gray : LIGHT_THEME.gray }]} onPress={onClose}><Text style={[styles.cancelButtonText, { color: textColor }]}>Pular</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.confirmButton, { backgroundColor: COLORS.accent }]} onPress={handleAllocate}><Text style={[styles.confirmButtonText, { color: COLORS.primary }]}>Destinar</Text></TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// Componente Principal
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [currency, setCurrency] = useState(CURRENCIES[0]);
  const [transactions, setTransactions] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [goals, setGoals] = useState([]);
  const [cards, setCards] = useState([]);
  
  useEffect(() => { loadData(); }, []);
  
  const loadData = async () => {
    try {
      const savedData = await AsyncStorage.getItem('@PlanejaFlow:data');
      if (savedData) {
        const data = JSON.parse(savedData);
        setTransactions(data.transactions || []);
        setInvestments(data.investments || []);
        setGoals(data.goals || []);
        setCards(data.cards || []);
      } else {
        setTransactions(INITIAL_DATA.transactions);
        setInvestments(INITIAL_DATA.investments);
        setGoals(INITIAL_DATA.goals);
        setCards(INITIAL_DATA.cards);
      }
    } catch (error) { console.error('Erro ao carregar dados:', error); }
    finally { setTimeout(() => setIsLoading(false), 500); }
  };
  
  const saveData = useCallback(async () => {
    try {
      const data = { transactions, investments, goals, cards };
      await AsyncStorage.setItem('@PlanejaFlow:data', JSON.stringify(data));
    } catch (error) { console.error('Erro ao salvar dados:', error); }
  }, [transactions, investments, goals, cards]);
  
  useEffect(() => { if (isAuthenticated) saveData(); }, [transactions, investments, goals, cards, isAuthenticated, saveData]);
  
  const handleLogin = (email, password) => {
    if (email === 'demo@planejaflow.com' && password === '123456') {
      setUser({ name: 'João Silva', email });
      setIsAuthenticated(true);
      Vibration.vibrate(50);
    } else { Alert.alert('Erro', 'Credenciais inválidas'); }
  };
  
  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent, { backgroundColor: COLORS.primary }]}>
        <ActivityIndicator size="large" color={COLORS.accent} />
        <Text style={[styles.loadingText, { color: COLORS.accent }]}>PlanejaFlow PRO</Text>
      </View>
    );
  }
  
  if (!isAuthenticated) return <LoginScreen onLogin={handleLogin} darkMode={darkMode} />;
  
  const renderScreen = () => {
    switch (currentTab) {
      case 'dashboard': return <DashboardScreen transactions={transactions} investments={investments} goals={goals} cards={cards} currency={currency} darkMode={darkMode} onNavigate={setCurrentTab} />;
      case 'transactions': return <TransactionsScreen transactions={transactions} setTransactions={setTransactions} goals={goals} setGoals={setGoals} currency={currency} darkMode={darkMode} />;
      case 'investments': return <InvestmentsScreen investments={investments} setInvestments={setInvestments} goals={goals} setGoals={setGoals} currency={currency} darkMode={darkMode} />;
      case 'goals': return <GoalsScreen goals={goals} setGoals={setGoals} currency={currency} darkMode={darkMode} />;
      case 'cards': return <CardsScreen cards={cards} setCards={setCards} currency={currency} darkMode={darkMode} />;
      case 'settings': return <SettingsScreen darkMode={darkMode} setDarkMode={setDarkMode} currency={currency} setCurrency={setCurrency} transactions={transactions} setTransactions={setTransactions} investments={investments} setInvestments={setInvestments} goals={goals} setGoals={setGoals} cards={cards} setCards={setCards} onLogout={() => setIsAuthenticated(false)} />;
      default: return <DashboardScreen transactions={transactions} investments={investments} goals={goals} cards={cards} currency={currency} darkMode={darkMode} onNavigate={setCurrentTab} />;
    }
  };
  
  const tabs = [
    { key: 'dashboard', icon: 'stats-chart', label: 'Início' },
    { key: 'transactions', icon: 'swap-horizontal', label: 'Transações' },
    { key: 'investments', icon: 'trending-up', label: 'Investir' },
    { key: 'goals', icon: 'trophy', label: 'Metas' },
    { key: 'cards', icon: 'card', label: 'Cartões' },
    { key: 'settings', icon: 'settings', label: 'Ajustes' },
  ];
  
  const bgColor = darkMode ? COLORS.primary : LIGHT_THEME.primary;
  const tabBgColor = darkMode ? COLORS.secondary : LIGHT_THEME.secondary;
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={[styles.header, { backgroundColor: darkMode ? COLORS.secondary : LIGHT_THEME.secondary, paddingTop: Platform.OS === 'android' ? 35 : 12 }]}>
        <TouchableOpacity onPress={() => setCurrentTab('dashboard')} style={styles.headerLogo}>
          <Text style={[styles.headerTitle, { color: COLORS.accent }]}>✨ PlanejaFlow</Text>
          <View style={[styles.proBadge, { backgroundColor: COLORS.accent }]}><Text style={[styles.proText, { color: COLORS.primary }]}>PRO</Text></View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCurrentTab('settings')} style={styles.avatarBtn}>
          <View style={[styles.avatar, { backgroundColor: COLORS.accent }]}><Text style={[styles.avatarText, { color: COLORS.primary }]}>{user?.name?.charAt(0) || 'U'}</Text></View>
        </TouchableOpacity>
      </View>
      
      <View style={{ flex: 1 }}>{renderScreen()}</View>
      
      <View style={[styles.tabBar, { backgroundColor: tabBgColor, height: 65, paddingBottom: Platform.OS === 'ios' ? 10 : 5 }]}>
        {tabs.map((tab) => {
          const isActive = currentTab === tab.key;
          return (
            <TouchableOpacity key={tab.key} style={styles.tabItem} onPress={() => setCurrentTab(tab.key)} activeOpacity={0.7}>
              <Ionicons name={tab.icon} size={22} color={isActive ? COLORS.accent : (darkMode ? COLORS.lightGray : LIGHT_THEME.textLight)} />
              <Text style={[styles.tabLabel, { color: darkMode ? COLORS.lightGray : LIGHT_THEME.textLight, fontSize: 11 }, isActive && styles.tabLabelActive]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

function LoginScreen({ onLogin, darkMode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const bgColor = darkMode ? COLORS.primary : LIGHT_THEME.primary;
  const cardBg = darkMode ? COLORS.secondary : LIGHT_THEME.cardBg;
  const textColor = darkMode ? COLORS.white : LIGHT_THEME.text;
  
  return (
    <SafeAreaView style={[styles.loginContainer, { backgroundColor: bgColor }]}>
      <ScrollView contentContainerStyle={styles.loginScroll}>
        <View style={[styles.loginCard, { backgroundColor: cardBg }]}>
          <Text style={[styles.loginLogo, { color: COLORS.accent }]}>✨</Text>
          <Text style={[styles.loginTitle, { color: COLORS.accent }]}>PlanejaFlow PRO</Text>
          <Text style={[styles.loginSubtitle, { color: COLORS.lightGray }]}>Sua jornada financeira começa aqui</Text>
          <TextInput style={[styles.loginInput, { backgroundColor: darkMode ? COLORS.gray : LIGHT_THEME.gray, color: textColor }]} placeholder="Email" placeholderTextColor={COLORS.lightGray} value={email} onChangeText={setEmail} autoCapitalize="none" />
          <TextInput style={[styles.loginInput, { backgroundColor: darkMode ? COLORS.gray : LIGHT_THEME.gray, color: textColor }]} placeholder="Senha" placeholderTextColor={COLORS.lightGray} value={password} onChangeText={setPassword} secureTextEntry />
          <TouchableOpacity style={[styles.loginButton, { backgroundColor: COLORS.accent }]} onPress={() => onLogin(email, password)}><Text style={[styles.loginButtonText, { color: COLORS.primary }]}>Entrar</Text></TouchableOpacity>
          <View style={styles.loginDemoCard}>
            <Text style={[styles.loginDemoTitle, { color: COLORS.accent }]}>Demo</Text>
            <Text style={[styles.loginDemoText, { color: COLORS.lightGray }]}>demo@planejaflow.com / 123456</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function DashboardScreen({ transactions, investments, goals, cards, currency, darkMode, onNavigate }) {
  const formatCurrency = (value) => `${currency.symbol} ${value.toFixed(2)}`;
  
  const totalBalance = transactions.reduce((sum, t) => t.type === 'income' ? sum + t.amount : sum - t.amount, 0);
  
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  const monthlyIncome = transactions.filter(t => {
    const tDate = new Date(t.date);
    return t.type === 'income' && tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
  }).reduce((s, t) => s + t.amount, 0);
  
  const monthlyExpenses = transactions.filter(t => {
    const tDate = new Date(t.date);
    return t.type === 'expense' && tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
  }).reduce((s, t) => s + t.amount, 0);
  
  const expensesByCategory = {};
  transactions.filter(t => t.type === 'expense').forEach(t => {
    const tDate = new Date(t.date);
    if (tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear) {
      expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
    }
  });
  const topCategories = Object.entries(expensesByCategory).sort((a, b) => b[1] - a[1]).slice(0, 3);
  
  const totalInvested = investments.reduce((s, i) => s + i.amount, 0);
  const fixedIncomeTotal = investments.filter(i => i.type === 'Renda Fixa').reduce((s, i) => s + i.amount, 0);
  const variableIncomeTotal = investments.filter(i => i.type === 'Renda Variável').reduce((s, i) => s + i.amount, 0);
  const fixedPercent = totalInvested > 0 ? (fixedIncomeTotal / totalInvested) * 100 : 0;
  const variablePercent = totalInvested > 0 ? (variableIncomeTotal / totalInvested) * 100 : 0;
  
  const recentTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
  
  const getCategoryIcon = (categoryName) => {
    const expenseCat = EXPENSE_CATEGORIES.find(c => c.name === categoryName);
    if (expenseCat) return expenseCat.icon;
    const incomeCat = INCOME_CATEGORIES.find(c => c.name === categoryName);
    if (incomeCat) return incomeCat.icon;
    return '📌';
  };
  
  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  };
  
  const bgColor = darkMode ? COLORS.primary : LIGHT_THEME.primary;
  const cardBg = darkMode ? COLORS.secondary : LIGHT_THEME.cardBg;
  const textColor = darkMode ? COLORS.white : LIGHT_THEME.text;
  
  return (
    <ScrollView style={[styles.screenContainer, { backgroundColor: bgColor }]} showsVerticalScrollIndicator={false}>
      <View style={[styles.welcomeCard, { backgroundColor: cardBg }]}>
        <Text style={[styles.welcomeText, { color: textColor }]}>💫 Olá, João!</Text>
        <Text style={[styles.welcomeSubtext, { color: COLORS.lightGray }]}>Vamos organizar suas finanças hoje?</Text>
      </View>
      
      <TouchableOpacity style={[styles.balanceCard, { backgroundColor: cardBg }]} activeOpacity={0.95}>
        <Text style={[styles.balanceLabel, { color: COLORS.lightGray }]}>💰 Saldo Total</Text>
        <Text style={[styles.balanceAmount, { color: COLORS.accent }]}>{formatCurrency(totalBalance)}</Text>
        <View style={styles.balanceRow}>
          <View style={styles.balanceItem}>
            <Text style={[styles.balanceItemLabel, { color: COLORS.lightGray }]}>Receitas (Mês)</Text>
            <Text style={[styles.balanceItemValue, { color: COLORS.success }]}>+ {formatCurrency(monthlyIncome)}</Text>
          </View>
          <View style={styles.balanceDivider} />
          <View style={styles.balanceItem}>
            <Text style={[styles.balanceItemLabel, { color: COLORS.lightGray }]}>Despesas (Mês)</Text>
            <Text style={[styles.balanceItemValue, { color: COLORS.error }]}>- {formatCurrency(monthlyExpenses)}</Text>
          </View>
        </View>
      </TouchableOpacity>
      
      {/* TOP CATEGORIAS */}
      {topCategories.length > 0 && (
        <View style={[styles.infoCard, { backgroundColor: cardBg }]}>
          <Text style={[styles.cardTitle, { color: COLORS.accent }]}>📊 Top Categorias de Gastos (Mês)</Text>
          {topCategories.map(([category, amount]) => {
            const percentage = monthlyExpenses > 0 ? (amount / monthlyExpenses) * 100 : 0;
            return (
              <View key={category} style={styles.categoryBreakdownItem}>
                <Text style={[styles.categoryBreakdownName, { color: textColor }]}>{getCategoryIcon(category)} {category}</Text>
                <View style={styles.categoryBreakdownBar}><View style={[styles.categoryBreakdownFill, { width: `${percentage}%`, backgroundColor: COLORS.accent }]} /></View>
                <View style={styles.categoryBreakdownValues}>
                  <Text style={[styles.categoryBreakdownAmount, { color: COLORS.error }]}>- {formatCurrency(amount)}</Text>
                  <Text style={[styles.categoryBreakdownPercent, { color: COLORS.lightGray }]}>{percentage.toFixed(0)}%</Text>
                </View>
              </View>
            );
          })}
        </View>
      )}
      
      {/* ÚLTIMAS TRANSAÇÕES */}
      <TouchableOpacity style={[styles.infoCard, { backgroundColor: cardBg }]} onPress={() => onNavigate('transactions')} activeOpacity={0.7}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.cardTitle, { color: COLORS.accent }]}>📋 Últimas Transações</Text>
          <Text style={[styles.viewAllText, { color: COLORS.accent }]}>Ver todas →</Text>
        </View>
        {recentTransactions.map(transaction => (
          <View key={transaction.id} style={styles.recentItem}>
            <View style={[styles.recentIcon, { backgroundColor: darkMode ? COLORS.gray : LIGHT_THEME.gray }]}><Text style={styles.recentIconText}>{getCategoryIcon(transaction.category)}</Text></View>
            <View style={styles.recentInfo}>
              <Text style={[styles.recentCategory, { color: textColor }]}>{transaction.category}</Text>
              <Text style={[styles.recentDesc, { color: COLORS.lightGray }]}>{transaction.description}</Text>
              <Text style={[styles.recentDate, { color: COLORS.lightGray }]}>{formatDate(transaction.date)}</Text>
            </View>
            <Text style={[styles.recentAmount, transaction.type === 'income' ? { color: COLORS.success } : { color: COLORS.error }]}>
              {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
            </Text>
          </View>
        ))}
      </TouchableOpacity>
      
      {/* INVESTIMENTOS */}
      <TouchableOpacity style={[styles.infoCard, { backgroundColor: cardBg }]} onPress={() => onNavigate('investments')} activeOpacity={0.7}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.cardTitle, { color: COLORS.accent }]}>📈 Investimentos</Text>
          <Text style={[styles.viewAllText, { color: COLORS.accent }]}>Ver todos →</Text>
        </View>
        <Text style={[styles.cardValue, { color: textColor }]}>{formatCurrency(totalInvested)}</Text>
        <Text style={[styles.cardSubtext, { color: COLORS.lightGray }]}>Total aplicado</Text>
        <View style={styles.investmentBreakdown}>
          <View style={styles.breakdownItem}>
            <View style={[styles.breakdownDot, { backgroundColor: COLORS.success }]} />
            <Text style={[styles.breakdownText, { color: textColor }]}>Renda Fixa</Text>
            <Text style={[styles.breakdownValue, { color: COLORS.success }]}>{formatCurrency(fixedIncomeTotal)} ({fixedPercent.toFixed(0)}%)</Text>
          </View>
          <View style={styles.breakdownItem}>
            <View style={[styles.breakdownDot, { backgroundColor: '#FF9800' }]} />
            <Text style={[styles.breakdownText, { color: textColor }]}>Renda Variável</Text>
            <Text style={[styles.breakdownValue, { color: '#FF9800' }]}>{formatCurrency(variableIncomeTotal)} ({variablePercent.toFixed(0)}%)</Text>
          </View>
        </View>
        <View style={styles.portfolioBar}>
          <View style={[styles.portfolioSegment, { width: `${fixedPercent}%`, backgroundColor: COLORS.success }]} />
          <View style={[styles.portfolioSegment, { width: `${variablePercent}%`, backgroundColor: '#FF9800' }]} />
        </View>
      </TouchableOpacity>
      
      {/* CARTÕES */}
      {cards.length > 0 && (
        <View style={[styles.infoCard, { backgroundColor: cardBg }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.cardTitle, { color: COLORS.accent }]}>💳 Cartões de Crédito</Text>
            <TouchableOpacity onPress={() => onNavigate('cards')}><Text style={[styles.viewAllText, { color: COLORS.accent }]}>Gerenciar →</Text></TouchableOpacity>
          </View>
          {cards.map(card => {
            const usedLimit = card.totalLimit - card.availableLimit;
            const usedPercent = (usedLimit / card.totalLimit) * 100;
            return (
              <View key={card.id} style={[styles.dashboardCardItem, { backgroundColor: darkMode ? COLORS.gray : LIGHT_THEME.gray, marginBottom: 12, borderRadius: 16, padding: 12 }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <Text style={[styles.dashboardCardName, { color: textColor, fontSize: 16, fontWeight: 'bold' }]}>{card.name}</Text>
                  <View style={[styles.dashboardCardBadge, { backgroundColor: card.color + '20', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 }]}>
                    <Text style={{ color: card.color, fontSize: 10, fontWeight: 'bold' }}>Fatura: {formatCurrency(card.invoiceAmount || usedLimit)}</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                  <View><Text style={[styles.dashboardCardLabel, { color: COLORS.lightGray, fontSize: 10 }]}>Limite</Text><Text style={[styles.dashboardCardValue, { color: textColor, fontSize: 14, fontWeight: 'bold' }]}>{formatCurrency(card.totalLimit)}</Text></View>
                  <View><Text style={[styles.dashboardCardLabel, { color: COLORS.lightGray, fontSize: 10 }]}>Disponível</Text><Text style={[styles.dashboardCardValue, { color: COLORS.success, fontSize: 14, fontWeight: 'bold' }]}>{formatCurrency(card.availableLimit)}</Text></View>
                  <View><Text style={[styles.dashboardCardLabel, { color: COLORS.lightGray, fontSize: 10 }]}>Usado</Text><Text style={[styles.dashboardCardValue, { color: COLORS.warning, fontSize: 14, fontWeight: 'bold' }]}>{formatCurrency(usedLimit)}</Text></View>
                </View>
                <View style={styles.cardProgressBar}><View style={[styles.cardProgressFill, { width: `${usedPercent}%`, backgroundColor: usedPercent > 80 ? COLORS.warning : COLORS.accent }]} /></View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
                  <Text style={[styles.dashboardCardInfo, { color: COLORS.lightGray, fontSize: 10 }]}>Vence dia {card.dueDate}</Text>
                  <Text style={[styles.dashboardCardInfo, { color: COLORS.lightGray, fontSize: 10 }]}>Melhor dia: {card.bestDay}</Text>
                </View>
              </View>
            );
          })}
        </View>
      )}
      
      {/* METAS */}
      {goals.length > 0 && (
        <TouchableOpacity style={[styles.infoCard, { backgroundColor: cardBg }]} onPress={() => onNavigate('goals')} activeOpacity={0.7}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.cardTitle, { color: COLORS.accent }]}>🎯 Metas em Andamento</Text>
            <Text style={[styles.viewAllText, { color: COLORS.accent }]}>Ver todas →</Text>
          </View>
          {goals.slice(0, 2).map(goal => {
            const progress = (goal.savedAmount / goal.targetAmount) * 100;
            const remaining = goal.targetAmount - goal.savedAmount;
            return (
              <View key={goal.id} style={styles.goalDashboardItem}>
                <View style={styles.goalDashboardHeader}>
                  <Text style={[styles.goalDashboardName, { color: textColor }]}><Text style={{ fontSize: 20 }}>{goal.icon || '🎯'}</Text> {goal.name}</Text>
                  <View style={[styles.priorityBadge, { backgroundColor: goal.priority === 'Alta' ? COLORS.error + '20' : (goal.priority === 'Média' ? COLORS.warning + '20' : COLORS.success + '20') }]}>
                    <Text style={[styles.priorityBadgeText, { color: goal.priority === 'Alta' ? COLORS.error : (goal.priority === 'Média' ? COLORS.warning : COLORS.success) }]}>{goal.priority}</Text>
                  </View>
                </View>
                <View style={styles.progressBar}><View style={[styles.progressFill, { width: `${progress}%` }]} /></View>
                <View style={styles.goalDashboardValues}>
                  <Text style={[styles.goalDashboardSaved, { color: COLORS.success }]}>{formatCurrency(goal.savedAmount)}</Text>
                  <Text style={[styles.goalDashboardRemaining, { color: COLORS.lightGray }]}>Faltam {formatCurrency(remaining)}</Text>
                </View>
                <Text style={[styles.goalDashboardPercent, { color: COLORS.accent }]}>{progress.toFixed(0)}% concluída</Text>
              </View>
            );
          })}
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

function TransactionsScreen({ transactions, setTransactions, goals, setGoals, currency, darkMode }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedType, setSelectedType] = useState('expense');
  const [selectedCategory, setSelectedCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [selectedPayment, setSelectedPayment] = useState(PAYMENT_METHODS[0]);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGoalAllocation, setShowGoalAllocation] = useState(false);
  const [pendingAmount, setPendingAmount] = useState(0);
  
  const categories = selectedType === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
  
  const saveTransaction = () => {
    if (!amount || !description) { Alert.alert('Atenção', 'Preencha todos os campos'); return; }
    const transactionAmount = parseFloat(amount);
    const transactionData = {
      id: editingTransaction?.id || Date.now().toString(),
      type: selectedType,
      category: selectedCategory.name,
      categoryIcon: selectedCategory.icon,
      amount: transactionAmount,
      date: date.toISOString().split('T')[0],
      description,
      paymentMethod: selectedPayment.name,
    };
    if (editingTransaction) {
      setTransactions(transactions.map(t => t.id === editingTransaction.id ? transactionData : t));
      Alert.alert('Sucesso', 'Transação atualizada!');
      setModalVisible(false);
    } else {
      setTransactions([transactionData, ...transactions]);
      if (selectedType === 'income') {
        setPendingAmount(transactionAmount);
        setModalVisible(false);
        setShowGoalAllocation(true);
      } else {
        Alert.alert('Sucesso', 'Transação adicionada!');
        setModalVisible(false);
      }
    }
    Vibration.vibrate(50);
  };
  
  const handleAllocateToGoal = (goalId, allocAmount) => {
    setGoals(goals.map(g => g.id === goalId ? { ...g, savedAmount: g.savedAmount + allocAmount } : g));
    Alert.alert('Sucesso', `R$ ${allocAmount.toFixed(2)} destinado para a meta!`);
    setShowGoalAllocation(false);
    setPendingAmount(0);
  };
  
  const deleteTransaction = (id) => {
    Alert.alert('Excluir', 'Tem certeza?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => { setTransactions(transactions.filter(t => t.id !== id)); Vibration.vibrate(50); } }
    ]);
  };
  
  const formatCurrency = (value) => `${currency.symbol} ${value.toFixed(2)}`;
  const formatDate = (date) => { const d = new Date(date); return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`; };
  
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const total = totalIncome - totalExpense;
  
  const getCategoryIcon = (categoryName) => {
    const expenseCat = EXPENSE_CATEGORIES.find(c => c.name === categoryName);
    if (expenseCat) return expenseCat.icon;
    const incomeCat = INCOME_CATEGORIES.find(c => c.name === categoryName);
    if (incomeCat) return incomeCat.icon;
    return '📌';
  };
  
  const bgColor = darkMode ? COLORS.primary : LIGHT_THEME.primary;
  const cardBg = darkMode ? COLORS.secondary : LIGHT_THEME.cardBg;
  const textColor = darkMode ? COLORS.white : LIGHT_THEME.text;
  
  return (
    <View style={[styles.screenContainer, { backgroundColor: bgColor }]}>
      <View style={styles.transactionSummary}>
        <View style={[styles.summaryCard, { backgroundColor: cardBg }]}><Text style={[styles.summaryLabel, { color: COLORS.lightGray }]}>Receitas</Text><Text style={[styles.summaryIncome, { color: COLORS.success }]}>+ {formatCurrency(totalIncome)}</Text></View>
        <View style={[styles.summaryCard, { backgroundColor: cardBg }]}><Text style={[styles.summaryLabel, { color: COLORS.lightGray }]}>Despesas</Text><Text style={[styles.summaryExpense, { color: COLORS.error }]}>- {formatCurrency(totalExpense)}</Text></View>
        <View style={[styles.summaryCard, { backgroundColor: cardBg }]}><Text style={[styles.summaryLabel, { color: COLORS.lightGray }]}>Saldo</Text><Text style={[styles.summaryTotal, { color: total >= 0 ? COLORS.success : COLORS.error }]}>{formatCurrency(total)}</Text></View>
      </View>
      
      <TouchableOpacity style={[styles.addButton, { backgroundColor: COLORS.accent }]} onPress={() => { setEditingTransaction(null); setAmount(''); setDescription(''); setSelectedType('expense'); setSelectedCategory(EXPENSE_CATEGORIES[0]); setDate(new Date()); setModalVisible(true); }}>
        <Ionicons name="add-circle" size={24} color={COLORS.primary} /><Text style={[styles.addButtonText, { color: COLORS.primary }]}>Nova Transação</Text>
      </TouchableOpacity>
      
      <FlatList data={transactions} keyExtractor={item => item.id} renderItem={({ item }) => (
        <TouchableOpacity style={[styles.transactionItem, { backgroundColor: cardBg }]} onPress={() => { setEditingTransaction(item); setAmount(item.amount.toString()); setDescription(item.description); setSelectedType(item.type); setSelectedCategory((item.type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES).find(c => c.name === item.category) || (item.type === 'expense' ? EXPENSE_CATEGORIES[0] : INCOME_CATEGORIES[0])); setDate(new Date(item.date)); setModalVisible(true); }} onLongPress={() => deleteTransaction(item.id)} activeOpacity={0.7}>
          <View style={[styles.transactionIcon, { backgroundColor: darkMode ? COLORS.gray : LIGHT_THEME.gray }]}><Text style={styles.transactionIconText}>{getCategoryIcon(item.category)}</Text></View>
          <View style={styles.transactionInfo}><Text style={[styles.transactionCategory, { color: textColor }]}>{item.category}</Text><Text style={[styles.transactionDesc, { color: COLORS.lightGray }]}>{item.description}</Text><Text style={[styles.transactionDate, { color: COLORS.lightGray }]}>{formatDate(item.date)}</Text></View>
          <Text style={[styles.transactionAmount, item.type === 'income' ? { color: COLORS.success } : { color: COLORS.error }]}>{item.type === 'income' ? '+' : '-'} {formatCurrency(item.amount)}</Text>
        </TouchableOpacity>
      )} ListEmptyComponent={<View style={styles.emptyState}><Text style={[styles.emptyStateText, { color: COLORS.lightGray }]}>Nenhuma transação</Text></View>} />
      
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}><View style={[styles.modalContentLarge, { backgroundColor: cardBg }]}>
          <View style={styles.modalHeader}><Text style={[styles.modalTitle, { color: COLORS.accent }]}>{editingTransaction ? '✏️ Editar' : '➕ Nova Transação'}</Text><TouchableOpacity onPress={() => setModalVisible(false)}><Ionicons name="close" size={24} color={COLORS.lightGray} /></TouchableOpacity></View>
          <ScrollView>
            <View style={styles.typeToggle}>
              <TouchableOpacity style={[styles.typeToggleBtn, selectedType === 'expense' && styles.typeToggleActive, { backgroundColor: selectedType === 'expense' ? COLORS.accent : (darkMode ? COLORS.gray : LIGHT_THEME.gray) }]} onPress={() => { setSelectedType('expense'); setSelectedCategory(EXPENSE_CATEGORIES[0]); }}><Text style={[styles.typeToggleText, { color: selectedType === 'expense' ? COLORS.primary : textColor }]}>📉 Despesa</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.typeToggleBtn, selectedType === 'income' && styles.typeToggleActive, { backgroundColor: selectedType === 'income' ? COLORS.accent : (darkMode ? COLORS.gray : LIGHT_THEME.gray) }]} onPress={() => { setSelectedType('income'); setSelectedCategory(INCOME_CATEGORIES[0]); }}><Text style={[styles.typeToggleText, { color: selectedType === 'income' ? COLORS.primary : textColor }]}>📈 Receita</Text></TouchableOpacity>
            </View>
            <TextInput style={[styles.modalInputLarge, { backgroundColor: darkMode ? COLORS.gray : LIGHT_THEME.gray, color: textColor }]} placeholder="Valor" placeholderTextColor={COLORS.lightGray} value={amount} onChangeText={setAmount} keyboardType="decimal-pad" />
            <TextInput style={[styles.modalInputLarge, { backgroundColor: darkMode ? COLORS.gray : LIGHT_THEME.gray, color: textColor }]} placeholder="Descrição" placeholderTextColor={COLORS.lightGray} value={description} onChangeText={setDescription} />
            <TouchableOpacity style={[styles.dateButton, { backgroundColor: darkMode ? COLORS.gray : LIGHT_THEME.gray }]} onPress={() => setShowDatePicker(true)}><Text style={[styles.dateButtonText, { color: textColor }]}>📅 {formatDate(date)}</Text></TouchableOpacity>
            <CustomDatePicker visible={showDatePicker} value={date} onConfirm={(d) => { setShowDatePicker(false); if (d) setDate(d); }} onCancel={() => setShowDatePicker(false)} darkMode={darkMode} />
            <Text style={[styles.inputLabel, { color: textColor }]}>📂 Categoria:</Text>
            <ScrollView horizontal><View style={{ flexDirection: 'row' }}>{categories.map((cat, idx) => (<TouchableOpacity key={idx} style={[styles.categoryChip, selectedCategory.name === cat.name && styles.categoryChipActive, { backgroundColor: selectedCategory.name === cat.name ? COLORS.accent : (darkMode ? COLORS.gray : LIGHT_THEME.gray), marginRight: 8 }]} onPress={() => setSelectedCategory(cat)}><Text style={[styles.categoryChipText, { color: selectedCategory.name === cat.name ? COLORS.primary : textColor }]}>{cat.icon} {cat.name}</Text></TouchableOpacity>))}</View></ScrollView>
            <Text style={[styles.inputLabel, { color: textColor }]}>💳 Pagamento:</Text>
            <ScrollView horizontal><View style={{ flexDirection: 'row' }}>{PAYMENT_METHODS.map((method, idx) => (<TouchableOpacity key={idx} style={[styles.paymentChip, selectedPayment.name === method.name && styles.paymentChipActive, { backgroundColor: selectedPayment.name === method.name ? COLORS.accent : (darkMode ? COLORS.gray : LIGHT_THEME.gray), marginRight: 8 }]} onPress={() => setSelectedPayment(method)}><Text style={[styles.paymentChipText, { color: selectedPayment.name === method.name ? COLORS.primary : textColor }]}>{method.icon} {method.name}</Text></TouchableOpacity>))}</View></ScrollView>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.cancelButton, { backgroundColor: darkMode ? COLORS.gray : LIGHT_THEME.gray }]} onPress={() => setModalVisible(false)}><Text style={[styles.cancelButtonText, { color: textColor }]}>Cancelar</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.confirmButton, { backgroundColor: COLORS.accent }]} onPress={saveTransaction}><Text style={[styles.confirmButtonText, { color: COLORS.primary }]}>{editingTransaction ? 'Atualizar' : 'Adicionar'}</Text></TouchableOpacity>
            </View>
          </ScrollView>
        </View></View>
      </Modal>
      <GoalAllocationModal visible={showGoalAllocation} onClose={() => setShowGoalAllocation(false)} onAllocate={handleAllocateToGoal} amount={pendingAmount} darkMode={darkMode} />
    </View>
  );
}

function InvestmentsScreen({ investments, setInvestments, goals, setGoals, currency, darkMode }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingInvestment, setEditingInvestment] = useState(null);
  const [name, setName] = useState('');
  const [selectedType, setSelectedType] = useState(INVESTMENT_TYPES[0]);
  const [selectedSubType, setSelectedSubType] = useState('');
  const [amount, setAmount] = useState('');
  const [profitability, setProfitability] = useState('');
  const [institution, setInstitution] = useState('');
  const [showGoalAllocation, setShowGoalAllocation] = useState(false);
  const [pendingAmount, setPendingAmount] = useState(0);
  
  const saveInvestment = () => {
    if (!name || !amount) { Alert.alert('Erro', 'Preencha nome e valor'); return; }
    const investmentAmount = parseFloat(amount);
    const investmentData = { id: editingInvestment?.id || Date.now().toString(), name, type: selectedType.name, subType: selectedSubType, amount: investmentAmount, profitability: parseFloat(profitability) || 0, institution: institution || 'Não informada' };
    if (editingInvestment) {
      setInvestments(investments.map(i => i.id === editingInvestment.id ? investmentData : i));
      Alert.alert('Sucesso', 'Investimento atualizado!');
      setModalVisible(false);
    } else {
      setInvestments([investmentData, ...investments]);
      setPendingAmount(investmentAmount);
      setModalVisible(false);
      setShowGoalAllocation(true);
    }
    Vibration.vibrate(50);
  };
  
  const handleAllocateToGoal = (goalId, allocAmount) => {
    setGoals(goals.map(g => g.id === goalId ? { ...g, savedAmount: g.savedAmount + allocAmount } : g));
    Alert.alert('Sucesso', `R$ ${allocAmount.toFixed(2)} destinado para a meta!`);
    setShowGoalAllocation(false);
    setPendingAmount(0);
  };
  
  const deleteInvestment = (id) => {
    Alert.alert('Excluir', 'Tem certeza?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => { setInvestments(investments.filter(i => i.id !== id)); Vibration.vibrate(50); } }
    ]);
  };
  
  const formatCurrency = (value) => `${currency.symbol} ${value.toFixed(2)}`;
  const totalInvested = investments.reduce((s, i) => s + i.amount, 0);
  const bgColor = darkMode ? COLORS.primary : LIGHT_THEME.primary;
  const cardBg = darkMode ? COLORS.secondary : LIGHT_THEME.cardBg;
  const textColor = darkMode ? COLORS.white : LIGHT_THEME.text;
  
  return (
    <View style={[styles.screenContainer, { backgroundColor: bgColor }]}>
      <View style={[styles.investHeader, { backgroundColor: cardBg }]}><Text style={[styles.investTotalLabel, { color: COLORS.lightGray }]}>💰 Patrimônio Total</Text><Text style={[styles.investTotalValue, { color: COLORS.accent }]}>{formatCurrency(totalInvested)}</Text></View>
      <TouchableOpacity style={[styles.addButton, { backgroundColor: COLORS.accent }]} onPress={() => { setEditingInvestment(null); setName(''); setSelectedType(INVESTMENT_TYPES[0]); setSelectedSubType(''); setAmount(''); setProfitability(''); setInstitution(''); setModalVisible(true); }}><Ionicons name="add-circle" size={24} color={COLORS.primary} /><Text style={[styles.addButtonText, { color: COLORS.primary }]}>Novo Investimento</Text></TouchableOpacity>
      <FlatList data={investments} keyExtractor={item => item.id} renderItem={({ item }) => (
        <TouchableOpacity style={[styles.investItem, { backgroundColor: cardBg }]} onPress={() => { setEditingInvestment(item); setName(item.name); setSelectedType(INVESTMENT_TYPES.find(t => t.name === item.type) || INVESTMENT_TYPES[0]); setSelectedSubType(item.subType || ''); setAmount(item.amount.toString()); setProfitability(item.profitability?.toString() || ''); setInstitution(item.institution); setModalVisible(true); }} onLongPress={() => deleteInvestment(item.id)} activeOpacity={0.7}>
          <Text style={[styles.investItemName, { color: textColor }]}>{item.name}</Text>
          <Text style={[styles.investItemType, { color: COLORS.lightGray }]}>{item.type} {item.subType ? `• ${item.subType}` : ''}</Text>
          <Text style={[styles.investItemAmount, { color: COLORS.accent }]}>{formatCurrency(item.amount)}</Text>
          {item.profitability > 0 && <Text style={[styles.investItemProfit, { color: COLORS.success }]}>📈 {item.profitability}%</Text>}
          <Text style={[styles.investItemInstitution, { color: COLORS.lightGray }]}>🏦 {item.institution}</Text>
        </TouchableOpacity>
      )} ListEmptyComponent={<View style={styles.emptyState}><Text style={[styles.emptyStateText, { color: COLORS.lightGray }]}>Nenhum investimento</Text></View>} />
      
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}><View style={[styles.modalContentLarge, { backgroundColor: cardBg }]}>
          <View style={styles.modalHeader}><Text style={[styles.modalTitle, { color: COLORS.accent }]}>{editingInvestment ? '✏️ Editar' : '📈 Novo Investimento'}</Text><TouchableOpacity onPress={() => setModalVisible(false)}><Ionicons name="close" size={24} color={COLORS.lightGray} /></TouchableOpacity></View>
          <ScrollView>
            <Text style={[styles.inputLabel, { color: textColor }]}>Tipo:</Text>
            <ScrollView horizontal><View style={{ flexDirection: 'row' }}>{INVESTMENT_TYPES.map(type => (<TouchableOpacity key={type.name} style={[styles.investTypeChip, selectedType.name === type.name && styles.investTypeChipActive, { backgroundColor: selectedType.name === type.name ? COLORS.accent : (darkMode ? COLORS.gray : LIGHT_THEME.gray), marginRight: 8 }]} onPress={() => { setSelectedType(type); setSelectedSubType(''); }}><Text style={[styles.investTypeChipText, { color: selectedType.name === type.name ? COLORS.primary : textColor }]}>{type.icon} {type.name}</Text></TouchableOpacity>))}</View></ScrollView>
            {selectedType.subTypes.length > 0 && (<><Text style={[styles.inputLabel, { color: textColor }]}>Subtipo:</Text><ScrollView horizontal><View style={{ flexDirection: 'row' }}>{selectedType.subTypes.map(sub => (<TouchableOpacity key={sub} style={[styles.subtypeChip, selectedSubType === sub && styles.subtypeChipActive, { backgroundColor: selectedSubType === sub ? COLORS.accent : (darkMode ? COLORS.gray : LIGHT_THEME.gray), marginRight: 8 }]} onPress={() => setSelectedSubType(sub)}><Text style={[styles.subtypeChipText, { color: selectedSubType === sub ? COLORS.primary : textColor }]}>{sub}</Text></TouchableOpacity>))}</View></ScrollView></>)}
            <TextInput style={[styles.modalInputLarge, { backgroundColor: darkMode ? COLORS.gray : LIGHT_THEME.gray, color: textColor }]} placeholder="Nome do ativo" placeholderTextColor={COLORS.lightGray} value={name} onChangeText={setName} />
            <TextInput style={[styles.modalInputLarge, { backgroundColor: darkMode ? COLORS.gray : LIGHT_THEME.gray, color: textColor }]} placeholder="Valor aplicado" placeholderTextColor={COLORS.lightGray} value={amount} onChangeText={setAmount} keyboardType="decimal-pad" />
            <TextInput style={[styles.modalInputLarge, { backgroundColor: darkMode ? COLORS.gray : LIGHT_THEME.gray, color: textColor }]} placeholder="Rentabilidade (%)" placeholderTextColor={COLORS.lightGray} value={profitability} onChangeText={setProfitability} keyboardType="decimal-pad" />
            <TextInput style={[styles.modalInputLarge, { backgroundColor: darkMode ? COLORS.gray : LIGHT_THEME.gray, color: textColor }]} placeholder="Instituição" placeholderTextColor={COLORS.lightGray} value={institution} onChangeText={setInstitution} />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.cancelButton, { backgroundColor: darkMode ? COLORS.gray : LIGHT_THEME.gray }]} onPress={() => setModalVisible(false)}><Text style={[styles.cancelButtonText, { color: textColor }]}>Cancelar</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.confirmButton, { backgroundColor: COLORS.accent }]} onPress={saveInvestment}><Text style={[styles.confirmButtonText, { color: COLORS.primary }]}>{editingInvestment ? 'Atualizar' : 'Adicionar'}</Text></TouchableOpacity>
            </View>
          </ScrollView>
        </View></View>
      </Modal>
      <GoalAllocationModal visible={showGoalAllocation} onClose={() => setShowGoalAllocation(false)} onAllocate={handleAllocateToGoal} amount={pendingAmount} darkMode={darkMode} />
    </View>
  );
}

function GoalsScreen({ goals, setGoals, currency, darkMode }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [contributionModal, setContributionModal] = useState(null);
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [savedAmount, setSavedAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [priority, setPriority] = useState('Média');
  const [selectedIcon, setSelectedIcon] = useState('🎯');
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [contributionAmount, setContributionAmount] = useState('');
  
  const saveGoal = () => {
    if (!name || !targetAmount) { Alert.alert('Erro', 'Preencha nome e valor'); return; }
    const goalData = { id: editingGoal?.id || Date.now().toString(), name, targetAmount: parseFloat(targetAmount), savedAmount: parseFloat(savedAmount) || 0, targetDate, priority, icon: selectedIcon };
    if (editingGoal) { setGoals(goals.map(g => g.id === editingGoal.id ? goalData : g)); Alert.alert('Sucesso', 'Meta atualizada!'); }
    else { setGoals([goalData, ...goals]); Alert.alert('Sucesso', 'Meta criada!'); }
    setModalVisible(false);
    Vibration.vibrate(50);
  };
  
  const addContribution = (goal, amount) => {
    setGoals(goals.map(g => g.id === goal.id ? { ...g, savedAmount: g.savedAmount + amount } : g));
    setContributionModal(null);
    setContributionAmount('');
    Vibration.vibrate(50);
    Alert.alert('Sucesso', `R$ ${amount.toFixed(2)} adicionado!`);
  };
  
  const deleteGoal = (id) => {
    Alert.alert('Excluir', 'Tem certeza?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => { setGoals(goals.filter(g => g.id !== id)); Vibration.vibrate(50); } }
    ]);
  };
  
  const formatCurrency = (value) => `${currency.symbol} ${value.toFixed(2)}`;
  const formatDate = (date) => date ? new Date(date).toLocaleDateString('pt-BR') : 'Sem data';
  const bgColor = darkMode ? COLORS.primary : LIGHT_THEME.primary;
  const cardBg = darkMode ? COLORS.secondary : LIGHT_THEME.cardBg;
  const textColor = darkMode ? COLORS.white : LIGHT_THEME.text;
  
  return (
    <View style={[styles.screenContainer, { backgroundColor: bgColor }]}>
      <TouchableOpacity style={[styles.addButton, { backgroundColor: COLORS.accent }]} onPress={() => { setEditingGoal(null); setName(''); setTargetAmount(''); setSavedAmount(''); setTargetDate(''); setPriority('Média'); setSelectedIcon('🎯'); setModalVisible(true); }}><Ionicons name="add-circle" size={24} color={COLORS.primary} /><Text style={[styles.addButtonText, { color: COLORS.primary }]}>Nova Meta</Text></TouchableOpacity>
      <FlatList data={goals} keyExtractor={item => item.id} renderItem={({ item }) => {
        const progress = (item.savedAmount / item.targetAmount) * 100;
        const remaining = item.targetAmount - item.savedAmount;
        const priorityColor = item.priority === 'Alta' ? COLORS.error : (item.priority === 'Média' ? COLORS.warning : COLORS.success);
        return (
          <TouchableOpacity style={[styles.goalCard, { backgroundColor: cardBg }]} onPress={() => { setEditingGoal(item); setName(item.name); setTargetAmount(item.targetAmount.toString()); setSavedAmount(item.savedAmount.toString()); setTargetDate(item.targetDate || ''); setPriority(item.priority); setSelectedIcon(item.icon || '🎯'); setModalVisible(true); }} activeOpacity={0.7}>
            <View style={styles.goalHeader}>
              <Text style={[styles.goalTitle, { color: textColor }]}><Text style={{ fontSize: 32 }}>{item.icon || '🎯'}</Text> {item.name}</Text>
              <View style={[styles.priorityBadge, { backgroundColor: priorityColor + '20' }]}><Text style={[styles.priorityText, { color: priorityColor }]}>{item.priority}</Text></View>
            </View>
            <View style={styles.goalProgressSection}><View style={styles.goalProgressHeader}><Text style={[styles.goalProgressLabel, { color: COLORS.lightGray }]}>Progresso</Text><Text style={[styles.goalPercent, { color: COLORS.accent }]}>{progress.toFixed(0)}%</Text></View><View style={styles.progressBar}><View style={[styles.progressFill, { width: `${progress}%` }]} /></View></View>
            <View style={styles.goalAmounts}><View><Text style={[styles.goalAmountLabel, { color: COLORS.lightGray }]}>Guardado</Text><Text style={[styles.goalAmountValue, { color: COLORS.success }]}>{formatCurrency(item.savedAmount)}</Text></View><View><Text style={[styles.goalAmountLabel, { color: COLORS.lightGray }]}>Meta</Text><Text style={[styles.goalAmountValue, { color: textColor }]}>{formatCurrency(item.targetAmount)}</Text></View><View><Text style={[styles.goalAmountLabel, { color: COLORS.lightGray }]}>Faltam</Text><Text style={[styles.goalAmountValue, { color: COLORS.warning }]}>{formatCurrency(remaining)}</Text></View></View>
            {item.targetDate && <Text style={[styles.goalDate, { color: COLORS.lightGray }]}>📅 {formatDate(item.targetDate)}</Text>}
            <View style={styles.goalActions}><TouchableOpacity style={[styles.contributeBtn, { backgroundColor: COLORS.accent }]} onPress={() => setContributionModal(item)}><Text style={[styles.contributeBtnText, { color: COLORS.primary }]}>+ Contribuir</Text></TouchableOpacity><TouchableOpacity style={[styles.deleteGoalBtn, { backgroundColor: darkMode ? COLORS.gray : LIGHT_THEME.gray }]} onPress={() => deleteGoal(item.id)}><Text style={[styles.deleteGoalBtnText, { color: COLORS.error }]}>Excluir</Text></TouchableOpacity></View>
          </TouchableOpacity>
        );
      }} ListEmptyComponent={<View style={styles.emptyState}><Text style={[styles.emptyStateText, { color: COLORS.lightGray }]}>Nenhuma meta</Text></View>} />
      
      <Modal visible={modalVisible} animationType="slide" transparent><View style={styles.modalContainer}><View style={[styles.modalContentLarge, { backgroundColor: cardBg }]}>
        <View style={styles.modalHeader}><Text style={[styles.modalTitle, { color: COLORS.accent }]}>{editingGoal ? '✏️ Editar Meta' : '🎯 Nova Meta'}</Text><TouchableOpacity onPress={() => setModalVisible(false)}><Ionicons name="close" size={24} color={COLORS.lightGray} /></TouchableOpacity></View>
        <ScrollView>
          <TouchableOpacity style={[styles.iconPickerBtn, { backgroundColor: darkMode ? COLORS.gray : LIGHT_THEME.gray, padding: 12, borderRadius: 12, alignItems: 'center', marginBottom: 12 }]} onPress={() => setShowIconPicker(true)}>
            <Text style={{ fontSize: 48 }}>{selectedIcon}</Text>
            <Text style={[styles.iconPickerText, { color: textColor, marginTop: 4 }]}>Toque para escolher um ícone</Text>
          </TouchableOpacity>
          
          {showIconPicker && (
            <Modal transparent animationType="fade" visible={showIconPicker}>
              <View style={styles.modalContainer}>
                <View style={[styles.modalContentLarge, { backgroundColor: cardBg }]}>
                  <Text style={[styles.modalTitle, { color: COLORS.accent, marginBottom: 16 }]}>Escolha um Ícone</Text>
                  <FlatList
                    data={GOAL_ICONS}
                    numColumns={4}
                    keyExtractor={(item) => item.icon}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={[styles.iconOption, { backgroundColor: darkMode ? COLORS.gray : LIGHT_THEME.gray, margin: 6, padding: 12, borderRadius: 12, alignItems: 'center', width: 70 }]}
                        onPress={() => { setSelectedIcon(item.icon); setShowIconPicker(false); }}
                      >
                        <Text style={{ fontSize: 32 }}>{item.icon}</Text>
                        <Text style={[styles.iconOptionText, { color: textColor, fontSize: 10, marginTop: 4 }]}>{item.name}</Text>
                      </TouchableOpacity>
                    )}
                  />
                  <TouchableOpacity style={[styles.confirmButton, { backgroundColor: COLORS.accent, marginTop: 16 }]} onPress={() => setShowIconPicker(false)}><Text style={[styles.confirmButtonText, { color: COLORS.primary }]}>Fechar</Text></TouchableOpacity>
                </View>
              </View>
            </Modal>
          )}
          
          <TextInput style={[styles.modalInputLarge, { backgroundColor: darkMode ? COLORS.gray : LIGHT_THEME.gray, color: textColor }]} placeholder="Nome da meta" placeholderTextColor={COLORS.lightGray} value={name} onChangeText={setName} />
          <TextInput style={[styles.modalInputLarge, { backgroundColor: darkMode ? COLORS.gray : LIGHT_THEME.gray, color: textColor }]} placeholder="Valor total" placeholderTextColor={COLORS.lightGray} value={targetAmount} onChangeText={setTargetAmount} keyboardType="decimal-pad" />
          <TextInput style={[styles.modalInputLarge, { backgroundColor: darkMode ? COLORS.gray : LIGHT_THEME.gray, color: textColor }]} placeholder="Já guardado" placeholderTextColor={COLORS.lightGray} value={savedAmount} onChangeText={setSavedAmount} keyboardType="decimal-pad" />
          <TextInput style={[styles.modalInputLarge, { backgroundColor: darkMode ? COLORS.gray : LIGHT_THEME.gray, color: textColor }]} placeholder="Data alvo (AAAA-MM-DD)" placeholderTextColor={COLORS.lightGray} value={targetDate} onChangeText={setTargetDate} />
          <Text style={[styles.inputLabel, { color: textColor }]}>Prioridade:</Text>
          <View style={styles.priorityOptions}>{['Alta', 'Média', 'Baixa'].map(p => (<TouchableOpacity key={p} style={[styles.priorityChip, priority === p && styles.priorityChipActive, { backgroundColor: priority === p ? COLORS.accent : (darkMode ? COLORS.gray : LIGHT_THEME.gray) }]} onPress={() => setPriority(p)}><Text style={[styles.priorityChipText, { color: priority === p ? COLORS.primary : textColor }]}>{p}</Text></TouchableOpacity>))}</View>
          <View style={styles.modalButtons}><TouchableOpacity style={[styles.cancelButton, { backgroundColor: darkMode ? COLORS.gray : LIGHT_THEME.gray }]} onPress={() => setModalVisible(false)}><Text style={[styles.cancelButtonText, { color: textColor }]}>Cancelar</Text></TouchableOpacity><TouchableOpacity style={[styles.confirmButton, { backgroundColor: COLORS.accent }]} onPress={saveGoal}><Text style={[styles.confirmButtonText, { color: COLORS.primary }]}>{editingGoal ? 'Atualizar' : 'Criar'}</Text></TouchableOpacity></View>
        </ScrollView>
      </View></View></Modal>
      
      {contributionModal && (<Modal visible={!!contributionModal} transparent><View style={styles.modalContainer}><View style={[styles.modalContentSmall, { backgroundColor: cardBg }]}>
        <View style={styles.modalHeader}><Text style={[styles.modalTitle, { color: COLORS.accent }]}>🎯 Contribuir</Text><TouchableOpacity onPress={() => setContributionModal(null)}><Ionicons name="close" size={24} color={COLORS.lightGray} /></TouchableOpacity></View>
        <Text style={[styles.modalSubtitle, { color: COLORS.lightGray }]}>Restante: {formatCurrency(contributionModal.targetAmount - contributionModal.savedAmount)}</Text>
        <TextInput style={[styles.modalInputLarge, { backgroundColor: darkMode ? COLORS.gray : LIGHT_THEME.gray, color: textColor, fontSize: 24, textAlign: 'center' }]} placeholder="Valor" placeholderTextColor={COLORS.lightGray} keyboardType="decimal-pad" value={contributionAmount} onChangeText={setContributionAmount} />
        <View style={styles.modalButtons}><TouchableOpacity style={[styles.cancelButton, { backgroundColor: darkMode ? COLORS.gray : LIGHT_THEME.gray }]} onPress={() => setContributionModal(null)}><Text style={[styles.cancelButtonText, { color: textColor }]}>Cancelar</Text></TouchableOpacity><TouchableOpacity style={[styles.confirmButton, { backgroundColor: COLORS.accent }]} onPress={() => { const amt = parseFloat(contributionAmount); if (!isNaN(amt) && amt > 0) addContribution(contributionModal, amt); else Alert.alert('Erro', 'Valor inválido'); }}><Text style={[styles.confirmButtonText, { color: COLORS.primary }]}>Adicionar</Text></TouchableOpacity></View>
      </View></View></Modal>)}
    </View>
  );
}

function CardsScreen({ cards, setCards, currency, darkMode }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [name, setName] = useState('');
  const [holder, setHolder] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [totalLimit, setTotalLimit] = useState('');
  const [availableLimit, setAvailableLimit] = useState('');
  const [bestDay, setBestDay] = useState('');
  const [cardColor, setCardColor] = useState('#1a1a1a');
  const [invoiceAmount, setInvoiceAmount] = useState('');
  
  const saveCard = () => {
    if (!name || !totalLimit) { Alert.alert('Erro', 'Preencha nome e limite'); return; }
    const cardData = { id: editingCard?.id || Date.now().toString(), name, holder: holder || 'Titular', dueDate: parseInt(dueDate) || 10, totalLimit: parseFloat(totalLimit), availableLimit: parseFloat(availableLimit) || parseFloat(totalLimit), bestDay: parseInt(bestDay) || 15, color: cardColor, invoiceAmount: parseFloat(invoiceAmount) || 0 };
    if (editingCard) { setCards(cards.map(c => c.id === editingCard.id ? cardData : c)); Alert.alert('Sucesso', 'Cartão atualizado!'); }
    else { setCards([cardData, ...cards]); Alert.alert('Sucesso', 'Cartão adicionado!'); }
    setModalVisible(false);
    Vibration.vibrate(50);
  };
  
  const deleteCard = (id) => {
    Alert.alert('Excluir', 'Tem certeza?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => { setCards(cards.filter(c => c.id !== id)); Vibration.vibrate(50); } }
    ]);
  };
  
  const formatCurrency = (value) => `${currency.symbol} ${value.toFixed(2)}`;
  const bgColor = darkMode ? COLORS.primary : LIGHT_THEME.primary;
  const cardBg = darkMode ? COLORS.secondary : LIGHT_THEME.cardBg;
  const textColor = darkMode ? COLORS.white : LIGHT_THEME.text;
  
  return (
    <View style={[styles.screenContainer, { backgroundColor: bgColor }]}>
      <TouchableOpacity style={[styles.addButton, { backgroundColor: COLORS.accent }]} onPress={() => { setEditingCard(null); setName(''); setHolder(''); setDueDate(''); setTotalLimit(''); setAvailableLimit(''); setBestDay(''); setInvoiceAmount(''); setCardColor('#1a1a1a'); setModalVisible(true); }}><Ionicons name="add-circle" size={24} color={COLORS.primary} /><Text style={[styles.addButtonText, { color: COLORS.primary }]}>Novo Cartão</Text></TouchableOpacity>
      <FlatList data={cards} keyExtractor={item => item.id} renderItem={({ item }) => {
        const usedLimit = item.totalLimit - item.availableLimit;
        const usedPercent = (usedLimit / item.totalLimit) * 100;
        return (
          <View style={[styles.cardItem, { backgroundColor: item.color }]}>
            <View style={styles.cardHeader}><Text style={styles.cardName}>{item.name}</Text><Text style={styles.cardFlag}>💳</Text></View>
            <View style={styles.cardDetails}><View><Text style={styles.cardLabel}>Titular</Text><Text style={styles.cardValue}>{item.holder}</Text></View><View><Text style={styles.cardLabel}>Vencimento</Text><Text style={styles.cardValue}>Dia {item.dueDate}</Text></View></View>
            <View style={styles.cardLimits}><Text style={styles.cardLimit}>Limite: {formatCurrency(item.totalLimit)}</Text><Text style={styles.cardAvailable}>Disponível: {formatCurrency(item.availableLimit)}</Text></View>
            <View style={styles.cardProgressBar}><View style={[styles.cardProgressFill, { width: `${usedPercent}%`, backgroundColor: usedPercent > 80 ? COLORS.warning : '#FFFFFF' }]} /></View>
            <Text style={styles.cardUsedInfo}>Usado: {formatCurrency(usedLimit)} ({usedPercent.toFixed(0)}%)</Text>
            <View style={styles.cardActions}><TouchableOpacity style={[styles.cardEditBtn, { backgroundColor: 'rgba(255,255,255,0.2)', padding: 8, borderRadius: 8, marginTop: 12 }]} onPress={() => { setEditingCard(item); setName(item.name); setHolder(item.holder); setDueDate(item.dueDate.toString()); setTotalLimit(item.totalLimit.toString()); setAvailableLimit(item.availableLimit.toString()); setBestDay(item.bestDay.toString()); setInvoiceAmount((item.invoiceAmount || usedLimit).toString()); setCardColor(item.color); setModalVisible(true); }}><Text style={[styles.cardEditText, { color: COLORS.white }]}>Editar</Text></TouchableOpacity><TouchableOpacity style={[styles.cardDeleteBtn, { backgroundColor: 'rgba(255,59,48,0.3)', padding: 8, borderRadius: 8, marginTop: 12 }]} onPress={() => deleteCard(item.id)}><Text style={[styles.cardDeleteText, { color: COLORS.white }]}>Excluir</Text></TouchableOpacity></View>
          </View>
        );
      }} ListEmptyComponent={<View style={styles.emptyState}><Text style={[styles.emptyStateText, { color: COLORS.lightGray }]}>Nenhum cartão</Text></View>} />
      
      <Modal visible={modalVisible} animationType="slide" transparent><View style={styles.modalContainer}><View style={[styles.modalContentLarge, { backgroundColor: cardBg }]}>
        <View style={styles.modalHeader}><Text style={[styles.modalTitle, { color: COLORS.accent }]}>{editingCard ? '✏️ Editar' : '💳 Novo Cartão'}</Text><TouchableOpacity onPress={() => setModalVisible(false)}><Ionicons name="close" size={24} color={COLORS.lightGray} /></TouchableOpacity></View>
        <ScrollView>
          <TextInput style={[styles.modalInputLarge, { backgroundColor: darkMode ? COLORS.gray : LIGHT_THEME.gray, color: textColor }]} placeholder="Nome" placeholderTextColor={COLORS.lightGray} value={name} onChangeText={setName} />
          <TextInput style={[styles.modalInputLarge, { backgroundColor: darkMode ? COLORS.gray : LIGHT_THEME.gray, color: textColor }]} placeholder="Titular" placeholderTextColor={COLORS.lightGray} value={holder} onChangeText={setHolder} />
          <TextInput style={[styles.modalInputLarge, { backgroundColor: darkMode ? COLORS.gray : LIGHT_THEME.gray, color: textColor }]} placeholder="Dia vencimento" placeholderTextColor={COLORS.lightGray} value={dueDate} onChangeText={setDueDate} keyboardType="numeric" />
          <TextInput style={[styles.modalInputLarge, { backgroundColor: darkMode ? COLORS.gray : LIGHT_THEME.gray, color: textColor }]} placeholder="Limite total" placeholderTextColor={COLORS.lightGray} value={totalLimit} onChangeText={setTotalLimit} keyboardType="decimal-pad" />
          <TextInput style={[styles.modalInputLarge, { backgroundColor: darkMode ? COLORS.gray : LIGHT_THEME.gray, color: textColor }]} placeholder="Limite disponível" placeholderTextColor={COLORS.lightGray} value={availableLimit} onChangeText={setAvailableLimit} keyboardType="decimal-pad" />
          <TextInput style={[styles.modalInputLarge, { backgroundColor: darkMode ? COLORS.gray : LIGHT_THEME.gray, color: textColor }]} placeholder="Valor da fatura atual" placeholderTextColor={COLORS.lightGray} value={invoiceAmount} onChangeText={setInvoiceAmount} keyboardType="decimal-pad" />
          <TextInput style={[styles.modalInputLarge, { backgroundColor: darkMode ? COLORS.gray : LIGHT_THEME.gray, color: textColor }]} placeholder="Melhor dia comprar" placeholderTextColor={COLORS.lightGray} value={bestDay} onChangeText={setBestDay} keyboardType="numeric" />
          <Text style={[styles.inputLabel, { color: textColor }]}>Cor:</Text>
          <View style={styles.colorOptions}>{['#1a1a1a', '#D4AF37', '#1E3A8A', '#991B1B', '#065F46', '#5B21B6', '#8B00FF', '#FF6200'].map(color => (<TouchableOpacity key={color} style={[styles.colorOption, { backgroundColor: color }, cardColor === color && styles.colorOptionSelected]} onPress={() => setCardColor(color)} />))}</View>
          <View style={styles.modalButtons}><TouchableOpacity style={[styles.cancelButton, { backgroundColor: darkMode ? COLORS.gray : LIGHT_THEME.gray }]} onPress={() => setModalVisible(false)}><Text style={[styles.cancelButtonText, { color: textColor }]}>Cancelar</Text></TouchableOpacity><TouchableOpacity style={[styles.confirmButton, { backgroundColor: COLORS.accent }]} onPress={saveCard}><Text style={[styles.confirmButtonText, { color: COLORS.primary }]}>{editingCard ? 'Atualizar' : 'Adicionar'}</Text></TouchableOpacity></View>
        </ScrollView>
      </View></View></Modal>
    </View>
  );
}

function SettingsScreen({ darkMode, setDarkMode, currency, setCurrency, transactions, setTransactions, investments, setInvestments, goals, setGoals, cards, setCards, onLogout }) {
  // Exportar como JSON
  const exportData = async () => {
    const data = { transactions, investments, goals, cards, exportDate: new Date().toISOString() };
    const jsonString = JSON.stringify(data, null, 2);
    try {
      await Share.share({ message: jsonString, title: 'planejaflow_backup.json' });
      Alert.alert('Sucesso', 'Dados exportados! Compartilhe e salve o arquivo.');
    } catch (error) { Alert.alert('Erro', 'Falha ao exportar'); }
  };
  
  // Importar de JSON
  const importData = () => {
    Alert.prompt(
      'Importar Dados',
      'Cole o conteúdo JSON do backup:',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Importar',
          onPress: (jsonString) => {
            if (jsonString) {
              try {
                const importedData = JSON.parse(jsonString);
                if (importedData.transactions) setTransactions(importedData.transactions);
                if (importedData.investments) setInvestments(importedData.investments);
                if (importedData.goals) setGoals(importedData.goals);
                if (importedData.cards) setCards(importedData.cards);
                Alert.alert('Sucesso', 'Dados importados com sucesso!');
              } catch (parseError) {
                Alert.alert('Erro', 'Formato JSON inválido');
              }
            } else { Alert.alert('Erro', 'Nenhum dado fornecido'); }
          }
        }
      ],
      'plain-text'
    );
  };
  
  const resetAllData = () => {
    Alert.alert('Redefinir Dados', 'Tem certeza?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Confirmar', style: 'destructive', onPress: () => {
          setTransactions(INITIAL_DATA.transactions);
          setInvestments(INITIAL_DATA.investments);
          setGoals(INITIAL_DATA.goals);
          setCards(INITIAL_DATA.cards);
          Vibration.vibrate(100);
          Alert.alert('Concluído', 'Dados redefinidos');
        }
      }
    ]);
  };
  
  const bgColor = darkMode ? COLORS.primary : LIGHT_THEME.primary;
  const cardBg = darkMode ? COLORS.secondary : LIGHT_THEME.cardBg;
  const textColor = darkMode ? COLORS.white : LIGHT_THEME.text;
  
  return (
    <ScrollView style={[styles.screenContainer, { backgroundColor: bgColor }]} showsVerticalScrollIndicator={false}>
      <View style={[styles.settingsSection, { backgroundColor: cardBg }]}>
        <View style={styles.profileHeader}><View style={[styles.profileAvatar, { backgroundColor: COLORS.accent }]}><Text style={[styles.profileAvatarText, { color: COLORS.primary }]}>👤</Text></View><View><Text style={[styles.profileName, { color: textColor }]}>João Silva</Text><Text style={[styles.profileEmail, { color: COLORS.lightGray }]}>demo@planejaflow.com</Text></View></View>
      </View>
      
      <View style={[styles.settingsSection, { backgroundColor: cardBg }]}>
        <Text style={[styles.sectionTitle, { color: COLORS.accent }]}>🎨 Aparência</Text>
        <View style={styles.settingRow}><View style={styles.settingInfo}><Ionicons name="moon" size={24} color={darkMode ? COLORS.accent : COLORS.lightGray} /><Text style={[styles.settingLabel, { color: textColor }]}>Modo Escuro</Text></View><Switch value={darkMode} onValueChange={setDarkMode} trackColor={{ false: COLORS.gray, true: COLORS.accent }} /></View>
      </View>
      
      <View style={[styles.settingsSection, { backgroundColor: cardBg }]}>
        <Text style={[styles.sectionTitle, { color: COLORS.accent }]}>💰 Moeda</Text>
        <ScrollView horizontal><View style={{ flexDirection: 'row' }}>{CURRENCIES.map(curr => (<TouchableOpacity key={curr.code} style={[styles.currencyOption, currency.code === curr.code && styles.currencyOptionActive, { backgroundColor: currency.code === curr.code ? COLORS.accent : (darkMode ? COLORS.gray : LIGHT_THEME.gray), marginRight: 8 }]} onPress={() => setCurrency(curr)}><Text style={[styles.currencySymbol, { color: currency.code === curr.code ? COLORS.primary : textColor }]}>{curr.symbol}</Text><Text style={[styles.currencyName, { color: currency.code === curr.code ? COLORS.primary : COLORS.lightGray }]}>{curr.name}</Text></TouchableOpacity>))}</View></ScrollView>
      </View>
      
      <View style={[styles.settingsSection, { backgroundColor: cardBg }]}>
        <Text style={[styles.sectionTitle, { color: COLORS.accent }]}>📄 Backup</Text>
        <TouchableOpacity style={[styles.settingButton, { backgroundColor: darkMode ? COLORS.gray : LIGHT_THEME.gray }]} onPress={exportData}>
          <Ionicons name="share-outline" size={20} color={COLORS.accent} />
          <Text style={[styles.settingButtonText, { color: textColor }]}>Exportar Dados (JSON)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.settingButton, { backgroundColor: darkMode ? COLORS.gray : LIGHT_THEME.gray }]} onPress={importData}>
          <Ionicons name="download-outline" size={20} color={COLORS.accent} />
          <Text style={[styles.settingButtonText, { color: textColor }]}>Importar Dados (JSON)</Text>
        </TouchableOpacity>
        <Text style={[styles.importHint, { color: COLORS.lightGray, fontSize: 11, marginTop: 8, textAlign: 'center' }]}>
          O backup é em formato JSON. Compartilhe o arquivo e para restaurar, cole o conteúdo.
        </Text>
      </View>
      
      <View style={[styles.settingsSection, { backgroundColor: cardBg }]}>
        <Text style={[styles.sectionTitle, { color: COLORS.error }]}>⚠️ Área de Risco</Text>
        <TouchableOpacity style={[styles.dangerButton, { backgroundColor: 'rgba(255,59,48,0.1)' }]} onPress={resetAllData}><Ionicons name="trash-outline" size={20} color={COLORS.error} /><Text style={[styles.dangerButtonText, { color: COLORS.error }]}>Redefinir Todos os Dados</Text></TouchableOpacity>
      </View>
      
      <TouchableOpacity style={[styles.logoutButton, { backgroundColor: COLORS.error }]} onPress={onLogout}><Ionicons name="log-out-outline" size={20} color={COLORS.white} /><Text style={[styles.logoutButtonText, { color: COLORS.white }]}>Sair da Conta</Text></TouchableOpacity>
      <Text style={[styles.footerText, { color: COLORS.lightGray, textAlign: 'center', marginBottom: 32 }]}>PlanejaFlow PRO v2.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerContent: { justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 28, fontWeight: 'bold', marginTop: 20 },
  screenContainer: { flex: 1, padding: 16 },
  
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16 },
  headerLogo: { flexDirection: 'row', alignItems: 'center', marginRight: 8 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  proBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12, marginLeft: 6 },
  proText: { fontSize: 10, fontWeight: 'bold' },
  avatarBtn: { padding: 4 },
  avatar: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 18, fontWeight: 'bold' },
  
  tabBar: { flexDirection: 'row', height: 65, borderTopWidth: 0.5, borderTopColor: 'rgba(212,175,55,0.2)' },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tabLabel: { fontSize: 11, fontWeight: '500', marginTop: 4 },
  tabLabelActive: { color: COLORS.accent, fontWeight: '600' },
  
  loginContainer: { flex: 1 },
  loginScroll: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  loginCard: { borderRadius: 24, padding: 32, alignItems: 'center', elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 12 },
  loginLogo: { fontSize: 48, marginBottom: 8 },
  loginTitle: { fontSize: 28, fontWeight: 'bold', marginBottom: 8 },
  loginSubtitle: { fontSize: 14, marginBottom: 32, textAlign: 'center' },
  loginInput: { width: '100%', padding: 14, borderRadius: 12, marginBottom: 16, fontSize: 16 },
  loginButton: { width: '100%', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  loginButtonText: { fontSize: 16, fontWeight: 'bold' },
  loginDemoCard: { marginTop: 24, padding: 16, borderRadius: 12, alignItems: 'center', width: '100%' },
  loginDemoTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 4 },
  loginDemoText: { fontSize: 12 },
  
  welcomeCard: { padding: 20, borderRadius: 20, marginBottom: 16 },
  welcomeText: { fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  welcomeSubtext: { fontSize: 14 },
  balanceCard: { padding: 20, borderRadius: 20, marginBottom: 16 },
  balanceLabel: { fontSize: 14, marginBottom: 8 },
  balanceAmount: { fontSize: 40, fontWeight: 'bold', marginBottom: 16 },
  balanceRow: { flexDirection: 'row', justifyContent: 'space-between' },
  balanceItem: { flex: 1, alignItems: 'center' },
  balanceItemLabel: { fontSize: 12, marginBottom: 4 },
  balanceItemValue: { fontSize: 16, fontWeight: 'bold' },
  balanceDivider: { width: 1, marginHorizontal: 16 },
  
  infoCard: { padding: 16, borderRadius: 20, marginBottom: 16 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  cardValue: { fontSize: 32, fontWeight: 'bold', marginTop: 4 },
  cardSubtext: { fontSize: 12, marginTop: 4 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  viewAllText: { fontSize: 12, fontWeight: '500' },
  
  investmentBreakdown: { marginTop: 12, gap: 8 },
  breakdownItem: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  breakdownDot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  breakdownText: { fontSize: 13, flex: 1 },
  breakdownValue: { fontSize: 13, fontWeight: 'bold', marginRight: 4 },
  breakdownPercent: { fontSize: 12 },
  portfolioBar: { flexDirection: 'row', height: 8, borderRadius: 4, overflow: 'hidden', marginTop: 8 },
  portfolioSegment: { height: '100%' },
  
  categoryBreakdownItem: { marginBottom: 12 },
  categoryBreakdownName: { fontSize: 13, marginBottom: 4 },
  categoryBreakdownBar: { height: 6, backgroundColor: 'rgba(136,136,136,0.2)', borderRadius: 3, overflow: 'hidden', marginBottom: 4 },
  categoryBreakdownFill: { height: '100%', borderRadius: 3 },
  categoryBreakdownValues: { flexDirection: 'row', justifyContent: 'space-between' },
  categoryBreakdownAmount: { fontSize: 12, fontWeight: '500' },
  categoryBreakdownPercent: { fontSize: 11 },
  
  progressBar: { height: 8, backgroundColor: 'rgba(136,136,136,0.2)', borderRadius: 4, overflow: 'hidden', marginVertical: 6 },
  progressFill: { height: '100%', backgroundColor: COLORS.accent, borderRadius: 4 },
  
  transactionSummary: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  summaryCard: { flex: 1, padding: 12, borderRadius: 16, alignItems: 'center' },
  summaryLabel: { fontSize: 12, marginBottom: 4 },
  summaryIncome: { fontSize: 14, fontWeight: 'bold' },
  summaryExpense: { fontSize: 14, fontWeight: 'bold' },
  summaryTotal: { fontSize: 14, fontWeight: 'bold' },
  addButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, borderRadius: 16, marginBottom: 16 },
  addButtonText: { fontSize: 16, fontWeight: 'bold' },
  transactionItem: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 16, marginBottom: 8 },
  transactionIcon: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  transactionIconText: { fontSize: 24, fontWeight: 'bold' },
  transactionInfo: { flex: 1 },
  transactionCategory: { fontSize: 14, fontWeight: '500', marginBottom: 2 },
  transactionDesc: { fontSize: 12, marginBottom: 2 },
  transactionDate: { fontSize: 10 },
  transactionAmount: { fontSize: 16, fontWeight: 'bold' },
  
  investHeader: { padding: 20, borderRadius: 20, marginBottom: 16, alignItems: 'center' },
  investTotalLabel: { fontSize: 14, marginBottom: 4 },
  investTotalValue: { fontSize: 36, fontWeight: 'bold', marginBottom: 16 },
  investItem: { padding: 16, borderRadius: 16, marginBottom: 8 },
  investItemName: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  investItemType: { fontSize: 12, marginBottom: 8 },
  investItemAmount: { fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  investItemProfit: { fontSize: 12, marginBottom: 2 },
  investItemInstitution: { fontSize: 11 },
  investTypeChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8 },
  investTypeChipText: { fontSize: 13, fontWeight: '500' },
  subtypeChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginRight: 8 },
  subtypeChipText: { fontSize: 12, fontWeight: '500' },
  
  goalCard: { padding: 16, borderRadius: 20, marginBottom: 12 },
  goalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  goalTitle: { fontSize: 18, fontWeight: 'bold' },
  priorityBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
  priorityText: { fontSize: 12, fontWeight: '500' },
  goalProgressSection: { marginBottom: 12 },
  goalProgressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  goalProgressLabel: { fontSize: 12 },
  goalPercent: { fontSize: 12, fontWeight: 'bold' },
  goalAmounts: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  goalAmountLabel: { fontSize: 10, marginBottom: 4 },
  goalAmountValue: { fontSize: 14, fontWeight: 'bold' },
  goalDate: { fontSize: 11, marginBottom: 12 },
  goalActions: { flexDirection: 'row', gap: 12 },
  contributeBtn: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
  contributeBtnText: { fontSize: 14, fontWeight: 'bold' },
  deleteGoalBtn: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
  deleteGoalBtnText: { fontSize: 14 },
  
  cardItem: { padding: 16, borderRadius: 20, marginBottom: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  cardName: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' },
  cardFlag: { color: COLORS.white, fontSize: 28 },
  cardDetails: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  cardLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 10, marginBottom: 4 },
  cardValue: { color: COLORS.white, fontSize: 14, fontWeight: 'bold' },
  cardLimits: { marginBottom: 12 },
  cardLimit: { color: COLORS.white, fontSize: 12, marginBottom: 4 },
  cardAvailable: { color: COLORS.white, fontSize: 12 },
  cardUsedInfo: { color: 'rgba(255,255,255,0.7)', fontSize: 10, marginTop: 4 },
  cardProgressBar: { height: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 3, overflow: 'hidden' },
  cardProgressFill: { height: '100%', borderRadius: 3 },
  cardActions: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  cardEditBtn: { flex: 1, alignItems: 'center' },
  cardEditText: { fontSize: 12, fontWeight: 'bold' },
  cardDeleteBtn: { flex: 1, alignItems: 'center' },
  cardDeleteText: { fontSize: 12, fontWeight: 'bold' },
  
  settingsSection: { padding: 20, borderRadius: 20, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  profileHeader: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  profileAvatar: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
  profileAvatarText: { fontSize: 28 },
  profileName: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  profileEmail: { fontSize: 13 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  settingInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  settingLabel: { fontSize: 16 },
  settingButton: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 12, marginBottom: 8 },
  settingButtonText: { fontSize: 14 },
  importHint: { fontSize: 11, textAlign: 'center', marginTop: 8 },
  currencyOption: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, marginRight: 8, alignItems: 'center' },
  currencySymbol: { fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  currencyName: { fontSize: 12 },
  dangerButton: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 12 },
  dangerButtonText: { fontSize: 14, fontWeight: '500' },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, borderRadius: 16, marginBottom: 24 },
  logoutButtonText: { fontSize: 16, fontWeight: 'bold' },
  footerText: { fontSize: 12, marginBottom: 4 },
  
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)' },
  modalContentLarge: { width: '92%', borderRadius: 24, padding: 20, maxHeight: '85%' },
  modalContentSmall: { width: '85%', borderRadius: 24, padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 22, fontWeight: 'bold' },
  modalCloseBtn: { padding: 4 },
  modalSubtitle: { fontSize: 13, textAlign: 'center', marginBottom: 16 },
  modalInputLarge: { padding: 14, borderRadius: 12, marginBottom: 12, fontSize: 16 },
  inputLabel: { fontSize: 14, fontWeight: '500', marginBottom: 8 },
  typeToggle: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  typeToggleBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  typeToggleText: { fontSize: 14, fontWeight: '500' },
  dateButton: { padding: 14, borderRadius: 12, marginBottom: 12, alignItems: 'center' },
  dateButtonText: { fontSize: 14 },
  categoryChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8 },
  categoryChipText: { fontSize: 13, fontWeight: '500' },
  paymentChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8 },
  paymentChipText: { fontSize: 13, fontWeight: '500' },
  modalButtons: { flexDirection: 'row', gap: 12, marginTop: 16 },
  cancelButton: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  cancelButtonText: { fontSize: 14 },
  confirmButton: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  confirmButtonText: { fontSize: 14, fontWeight: 'bold' },
  
  priorityOptions: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  priorityChip: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
  priorityChipText: { fontSize: 14, fontWeight: '500' },
  
  colorOptions: { flexDirection: 'row', gap: 12, marginBottom: 16, flexWrap: 'wrap' },
  colorOption: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: 'transparent' },
  colorOptionSelected: { borderColor: COLORS.accent, transform: [{ scale: 1.1 }] },
  
  goalSelectItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: 'transparent' },
  goalSelectItemActive: { borderColor: COLORS.accent },
  goalSelectInfo: { flex: 1 },
  goalSelectName: { fontSize: 14, fontWeight: '500' },
  goalSelectProgress: { fontSize: 11, marginTop: 2 },
  
  dateModalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)' },
  dateModalContent: { width: '90%', borderRadius: 24, padding: 20 },
  dateModalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  datePickerContainer: { flexDirection: 'row', height: 200, marginBottom: 20 },
  datePickerColumn: { flex: 1, alignItems: 'center' },
  datePickerLabel: { fontSize: 14, fontWeight: 'bold', marginBottom: 8 },
  datePickerList: { width: '100%' },
  datePickerItem: { paddingVertical: 6, alignItems: 'center' },
  datePickerItemText: { fontSize: 16 },
  dateModalButtons: { flexDirection: 'row', gap: 12 },
  dateCancelBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  dateCancelText: { fontSize: 14 },
  dateConfirmBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  dateConfirmText: { fontSize: 14, fontWeight: 'bold', color: COLORS.primary },
  
  emptyState: { padding: 40, alignItems: 'center' },
  emptyStateText: { fontSize: 16, marginBottom: 8 },
  emptyStateSubtext: { fontSize: 13 },
  
  dashboardCardItem: { marginBottom: 12, borderRadius: 16, padding: 12 },
  dashboardCardName: { fontSize: 16, fontWeight: 'bold' },
  dashboardCardBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
  dashboardCardLabel: { fontSize: 10 },
  dashboardCardValue: { fontSize: 14, fontWeight: 'bold' },
  dashboardCardInfo: { fontSize: 10 },
  
  goalDashboardItem: { marginBottom: 16 },
  goalDashboardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  goalDashboardName: { fontSize: 14, fontWeight: '500' },
  goalDashboardValues: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  goalDashboardSaved: { fontSize: 12, fontWeight: '500' },
  goalDashboardRemaining: { fontSize: 11 },
  goalDashboardPercent: { fontSize: 11, marginTop: 4, textAlign: 'right' },
  
  recentItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(136,136,136,0.1)' },
  recentIcon: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  recentIconText: { fontSize: 20, fontWeight: 'bold' },
  recentInfo: { flex: 1 },
  recentCategory: { fontSize: 14, fontWeight: '500', marginBottom: 2 },
  recentDesc: { fontSize: 12, marginBottom: 2 },
  recentDate: { fontSize: 10 },
  recentAmount: { fontSize: 14, fontWeight: 'bold' },
  
  iconPickerBtn: { alignItems: 'center' },
  iconPickerText: { fontSize: 12 },
  iconOption: { alignItems: 'center' },
  iconOptionText: { fontSize: 10 },
});

// APENAS UM EXPORT DEFAULT NO FINAL DO ARQUIVO
export default App;

