import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  Modal,
  FlatList,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  accent: '#D4AF37',
  success: '#00C853',
  error: '#FF3B30',
  warning: '#FF9500',
  lightGray: '#888888',
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
  { icon: '👕', name: 'Vestuário' },
  { icon: '📱', name: 'Telecom' },
  { icon: '💳', name: 'Dívidas' },
  { icon: '🐾', name: 'Pets' },
  { icon: '💰', name: 'Outros' },
];

const INCOME_CATEGORIES = [
  { icon: '💰', name: 'Salário' },
  { icon: '💼', name: 'Freelance' },
  { icon: '📈', name: 'Investimentos' },
  { icon: '🎁', name: 'Presentes' },
  { icon: '🏠', name: 'Aluguel' },
];

export default function PDFImporter({ onImport, darkMode, currency }) {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const formatCurrency = (value) => `${currency.symbol} ${value.toFixed(2)}`;

  const simulateAISuggestion = async () => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return [
      { description: "Supermercado Extra", amount: 350.50, type: "expense", suggestedCategory: "Alimentação", confidence: 95 },
      { description: "Uber Viagem", amount: 45.90, type: "expense", suggestedCategory: "Transporte", confidence: 98 },
      { description: "Salário", amount: 8500.00, type: "income", suggestedCategory: "Salário", confidence: 99 },
    ];
  };

  const handleImportPDF = async () => {
    try {
      setLoading(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });
      if (result.type === 'success') {
        const suggestions = await simulateAISuggestion();
        setSuggestions(suggestions);
        setCurrentIndex(0);
        setShowModal(true);
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao processar o PDF');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmSuggestion = () => {
    const current = suggestions[currentIndex];
    if (current && onImport) {
      onImport({
        description: current.description,
        amount: Math.abs(current.amount),
        type: current.type,
        category: current.suggestedCategory,
      });
    }
    if (currentIndex + 1 < suggestions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowModal(false);
      Alert.alert('Sucesso', `${suggestions.length} transações importadas!`);
      setSuggestions([]);
      setCurrentIndex(0);
    }
  };

  const handleManualCategory = (category) => {
    const current = suggestions[currentIndex];
    if (current && onImport) {
      onImport({
        description: current.description,
        amount: Math.abs(current.amount),
        type: current.type,
        category: category.name,
      });
    }
    if (currentIndex + 1 < suggestions.length) {
      setCurrentIndex(currentIndex + 1);
      setSelectedTransaction(null);
    } else {
      setShowModal(false);
      Alert.alert('Sucesso', `${suggestions.length} transações importadas!`);
      setSuggestions([]);
      setCurrentIndex(0);
    }
  };

  const currentItem = suggestions[currentIndex];
  const categories = currentItem?.type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
  const textColor = darkMode ? '#FFFFFF' : '#1A1A1A';

  return (
    <View>
      <TouchableOpacity
        style={[styles.importButton, { backgroundColor: COLORS.accent }]}
        onPress={handleImportPDF}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#000" />
        ) : (
          <>
            <Ionicons name="document-text-outline" size={24} color="#000" />
            <Text style={styles.importButtonText}>🤖 Importar com IA</Text>
          </>
        )}
      </TouchableOpacity>

      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: darkMode ? '#0A0A0A' : '#FFFFFF' }]}>
            <Text style={[styles.modalTitle, { color: COLORS.accent }]}>🤖 IA Analisando...</Text>
            {currentItem && (
              <ScrollView>
                <View style={styles.suggestionCard}>
                  <Text style={[styles.transactionDesc, { color: textColor, fontSize: 18, fontWeight: 'bold' }]}>
                    {currentItem.description}
                  </Text>
                  <Text style={[styles.transactionAmount, { color: currentItem.type === 'expense' ? COLORS.error : COLORS.success, fontSize: 24, marginVertical: 10 }]}>
                    {currentItem.type === 'expense' ? '-' : '+'} {formatCurrency(Math.abs(currentItem.amount))}
                  </Text>
                  <View style={styles.suggestionBox}>
                    <Text style={[styles.suggestionLabel, { color: COLORS.lightGray }]}>🤖 IA sugere:</Text>
                    <Text style={[styles.suggestionCategory, { color: COLORS.accent, fontSize: 20, fontWeight: 'bold' }]}>
                      {currentItem.suggestedCategory}
                    </Text>
                    <Text style={[styles.confidence, { color: COLORS.lightGray }]}>Confiança: {currentItem.confidence}%</Text>
                  </View>
                  <View style={styles.buttonRow}>
                    <TouchableOpacity style={[styles.confirmButton, { backgroundColor: COLORS.success }]} onPress={handleConfirmSuggestion}>
                      <Ionicons name="checkmark-circle" size={24} color="#FFF" />
                      <Text style={styles.buttonText}>Confirmar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.editButton, { backgroundColor: COLORS.warning }]} onPress={() => setSelectedTransaction(currentItem)}>
                      <Ionicons name="create" size={24} color="#FFF" />
                      <Text style={styles.buttonText}>Corrigir</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            )}
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${((currentIndex + 1) / suggestions.length) * 100}%`, backgroundColor: COLORS.accent }]} />
            </View>
            <Text style={[styles.progressText, { color: COLORS.lightGray }]}>
              {currentIndex + 1} de {suggestions.length} transações
            </Text>
          </View>
        </View>
      </Modal>

      <Modal visible={!!selectedTransaction} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: darkMode ? '#0A0A0A' : '#FFFFFF', maxHeight: '80%' }]}>
            <Text style={[styles.modalTitle, { color: COLORS.accent, marginBottom: 16 }]}>✏️ Selecione a Categoria</Text>
            <Text style={[styles.transactionDesc, { color: textColor, fontSize: 16, marginBottom: 20 }]}>{selectedTransaction?.description}</Text>
            <FlatList
              data={categories}
              numColumns={2}
              keyExtractor={(item) => item.name}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.categoryOption, { backgroundColor: darkMode ? '#1C1C1C' : '#EEEEEE' }]}
                  onPress={() => handleManualCategory(item)}
                >
                  <Text style={{ fontSize: 24 }}>{item.icon}</Text>
                  <Text style={[styles.categoryOptionText, { color: textColor }]}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={[styles.cancelButton, { backgroundColor: COLORS.error, marginTop: 16 }]} onPress={() => setSelectedTransaction(null)}>
              <Text style={[styles.buttonText, { color: '#FFF' }]}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  importButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, borderRadius: 16, marginBottom: 16 },
  importButtonText: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)' },
  modalContent: { width: '92%', borderRadius: 24, padding: 20, maxHeight: '85%' },
  modalTitle: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  suggestionCard: { padding: 16, borderRadius: 16, marginBottom: 16 },
  transactionDesc: { fontWeight: '500', marginBottom: 4 },
  transactionAmount: { fontWeight: 'bold' },
  suggestionBox: { backgroundColor: 'rgba(212,175,55,0.1)', padding: 16, borderRadius: 12, marginVertical: 16, alignItems: 'center' },
  suggestionLabel: { fontSize: 12, marginBottom: 4 },
  suggestionCategory: { fontSize: 20, fontWeight: 'bold' },
  confidence: { fontSize: 12, marginTop: 4 },
  buttonRow: { flexDirection: 'row', gap: 12, marginTop: 16 },
  confirmButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, borderRadius: 12 },
  editButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, borderRadius: 12 },
  cancelButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, borderRadius: 12 },
  buttonText: { fontSize: 14, fontWeight: 'bold', color: '#FFF' },
  progressBar: { height: 4, backgroundColor: 'rgba(136,136,136,0.2)', borderRadius: 2, overflow: 'hidden', marginTop: 16 },
  progressFill: { height: '100%', borderRadius: 2 },
  progressText: { fontSize: 12, textAlign: 'center', marginTop: 8 },
  categoryOption: { flex: 1, margin: 6, padding: 12, borderRadius: 12, alignItems: 'center', gap: 4 },
  categoryOptionText: { fontSize: 12, fontWeight: '500' },
});
