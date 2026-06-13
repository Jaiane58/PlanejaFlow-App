import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const EXPENSE_CATEGORIES = [
  { icon: '🍽️', name: 'Alimentação' }, { icon: '🚗', name: 'Transporte' },
  { icon: '🏠', name: 'Moradia' }, { icon: '💡', name: 'Contas' },
  { icon: '💊', name: 'Saúde' }, { icon: '📚', name: 'Educação' },
  { icon: '🛍️', name: 'Compras' }, { icon: '🎉', name: 'Lazer' },
  { icon: '👕', name: 'Vestuário' }, { icon: '📱', name: 'Telecom' },
  { icon: '💳', name: 'Dívidas' }, { icon: '🐾', name: 'Pets' },
];

const INCOME_CATEGORIES = [
  { icon: '💰', name: 'Salário' }, { icon: '💼', name: 'Freelance' },
  { icon: '📈', name: 'Investimentos' }, { icon: '🎁', name: 'Presentes' },
  { icon: '🏠', name: 'Aluguel' },
];

export default function CategoryModal({ visible, onClose, onSelect, type, darkMode }) {
  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
  const bgColor = darkMode ? '#0A0A0A' : '#FFFFFF';
  const textColor = darkMode ? '#FFFFFF' : '#1A1A1A';

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, { backgroundColor: bgColor }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: '#D4AF37' }]}>📂 Selecione uma Categoria</Text>
            <TouchableOpacity onPress={onClose}><Ionicons name="close" size={24} color="#888" /></TouchableOpacity>
          </View>
          <FlatList
            data={categories}
            numColumns={3}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
              <TouchableOpacity style={[styles.categoryItem, { backgroundColor: darkMode ? '#1C1C1C' : '#EEEEEE' }]} onPress={() => { onSelect(item); onClose(); }}>
                <Text style={styles.categoryIcon}>{item.icon}</Text>
                <Text style={[styles.categoryName, { color: textColor }]}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)' },
  modalContent: { width: '92%', borderRadius: 24, padding: 20, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold' },
  categoryItem: { flex: 1, margin: 6, padding: 12, borderRadius: 12, alignItems: 'center' },
  categoryIcon: { fontSize: 28, marginBottom: 4 },
  categoryName: { fontSize: 11, fontWeight: '500', textAlign: 'center' },
});
