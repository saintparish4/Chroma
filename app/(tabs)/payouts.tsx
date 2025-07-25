'use client';

import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Types
interface Beneficiary {
  id: string;
  name: string;
  accountNumber: string;
  bankName: string;
  country: string;
  currency: string;
}

interface PayoutHistory {
  id: string;
  amount: number;
  currency: string;
  recipient: string;
  status: 'pending' | 'completed' | 'failed';
  date: string;
  fxRate?: number;
}

interface FXQuote {
  fromCurrency: string;
  toCurrency: string;
  amount: number;
  rate: number;
  convertedAmount: number;
  fees: number;
  totalCost: number;
}

// Mock data
const mockBeneficiaries: Beneficiary[] = [
  {
    id: '1',
    name: 'John Smith',
    accountNumber: '****1234',
    bankName: 'Chase Bank',
    country: 'USA',
    currency: 'USD',
  },
  {
    id: '2',
    name: 'Maria Garcia',
    accountNumber: '****5678',
    bankName: 'Santander',
    country: 'Spain',
    currency: 'EUR',
  },
];

const mockPayoutHistory: PayoutHistory[] = [
  {
    id: '1',
    amount: 1000,
    currency: 'USD',
    recipient: 'John Smith',
    status: 'completed',
    date: '2024-01-15',
    fxRate: 1.0,
  },
  {
    id: '2',
    amount: 500,
    currency: 'EUR',
    recipient: 'Maria Garcia',
    status: 'pending',
    date: '2024-01-14',
    fxRate: 0.85,
  },
];

export default function PayoutsScreen() {
  const colorScheme = useColorScheme();
  const [selectedTab, setSelectedTab] = useState<'new' | 'history'>('new');
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null);
  const [amount, setAmount] = useState('');
  const [showFXQuote, setShowFXQuote] = useState(false);
  const [fxQuote, setFxQuote] = useState<FXQuote | null>(null);

  const colors = Colors[colorScheme ?? 'light'];

  const handleNewTransfer = () => {
    if (!selectedBeneficiary) {
      Alert.alert('Error', 'Please select a beneficiary');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    // Generate mock FX quote
    const mockQuote: FXQuote = {
      fromCurrency: 'USDC',
      toCurrency: selectedBeneficiary.currency,
      amount: parseFloat(amount),
      rate: selectedBeneficiary.currency === 'USD' ? 1.0 : 0.85,
      convertedAmount: parseFloat(amount) * (selectedBeneficiary.currency === 'USD' ? 1.0 : 0.85),
      fees: 2.50,
      totalCost: parseFloat(amount) + 2.50,
    };

    setFxQuote(mockQuote);
    setShowFXQuote(true);
  };

  const handleConfirmTransfer = () => {
    Alert.alert(
      'Transfer Confirmed',
      `Your transfer of ${fxQuote?.amount} ${fxQuote?.fromCurrency} to ${selectedBeneficiary?.name} has been initiated.`,
      [
        {
          text: 'OK',
          onPress: () => {
            setShowFXQuote(false);
            setAmount('');
            setSelectedBeneficiary(null);
            setSelectedTab('history');
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#10B981';
      case 'pending':
        return '#F59E0B';
      case 'failed':
        return '#EF4444';
      default:
        return colors.icon;
    }
  };

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <ThemedText style={styles.headerTitle}>Payouts</ThemedText>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color={colors.tint} />
        </TouchableOpacity>
      </ThemedView>

      {/* Tab Navigation */}
      <ThemedView style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'new' && styles.activeTab]}
          onPress={() => setSelectedTab('new')}
        >
          <ThemedText style={[styles.tabText, selectedTab === 'new' && styles.activeTabText]}>
            New Transfer
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'history' && styles.activeTab]}
          onPress={() => setSelectedTab('history')}
        >
          <ThemedText style={[styles.tabText, selectedTab === 'history' && styles.activeTabText]}>
            History
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {selectedTab === 'new' ? (
          <ThemedView style={styles.newTransferContainer}>
            {/* Beneficiary Selection */}
            <ThemedView style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Select Beneficiary</ThemedText>
              {mockBeneficiaries.map((beneficiary) => (
                <TouchableOpacity
                  key={beneficiary.id}
                  style={[
                    styles.beneficiaryCard,
                    selectedBeneficiary?.id === beneficiary.id && styles.selectedBeneficiary,
                  ]}
                  onPress={() => setSelectedBeneficiary(beneficiary)}
                >
                  <ThemedView style={styles.beneficiaryInfo}>
                    <ThemedText style={styles.beneficiaryName}>{beneficiary.name}</ThemedText>
                    <ThemedText style={styles.beneficiaryDetails}>
                      {beneficiary.bankName} • {beneficiary.accountNumber}
                    </ThemedText>
                    <ThemedText style={styles.beneficiaryCountry}>
                      {beneficiary.country} • {beneficiary.currency}
                    </ThemedText>
                  </ThemedView>
                  {selectedBeneficiary?.id === beneficiary.id && (
                    <Ionicons name="checkmark-circle" size={24} color={colors.tint} />
                  )}
                </TouchableOpacity>
              ))}
            </ThemedView>

            {/* Amount Input */}
            <ThemedView style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Amount</ThemedText>
              <ThemedView style={styles.amountInput}>
                <ThemedText style={styles.currencyLabel}>USDC</ThemedText>
                <ThemedText style={styles.amountText}>{amount || '0'}</ThemedText>
              </ThemedView>
              <ThemedView style={styles.amountButtons}>
                {['100', '500', '1000', '5000'].map((value) => (
                  <TouchableOpacity
                    key={value}
                    style={styles.amountButton}
                    onPress={() => setAmount(value)}
                  >
                    <ThemedText style={styles.amountButtonText}>${value}</ThemedText>
                  </TouchableOpacity>
                ))}
              </ThemedView>
            </ThemedView>

            {/* Transfer Button */}
            <TouchableOpacity style={styles.transferButton} onPress={handleNewTransfer}>
              <ThemedText style={styles.transferButtonText}>Continue to Quote</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        ) : (
          <ThemedView style={styles.historyContainer}>
            {mockPayoutHistory.map((payout) => (
              <ThemedView key={payout.id} style={styles.historyCard}>
                <ThemedView style={styles.historyHeader}>
                  <ThemedText style={styles.historyAmount}>
                    {payout.amount} {payout.currency}
                  </ThemedText>
                  <ThemedView style={[styles.statusBadge, { backgroundColor: getStatusColor(payout.status) }]}>
                    <ThemedText style={styles.statusText}>{payout.status}</ThemedText>
                  </ThemedView>
                </ThemedView>
                <ThemedText style={styles.historyRecipient}>{payout.recipient}</ThemedText>
                <ThemedText style={styles.historyDate}>{payout.date}</ThemedText>
                {payout.fxRate && (
                  <ThemedText style={styles.historyFX}>FX Rate: {payout.fxRate}</ThemedText>
                )}
              </ThemedView>
            ))}
          </ThemedView>
        )}
      </ScrollView>

      {/* FX Quote Modal */}
      <Modal visible={showFXQuote} animationType="slide" transparent>
        <ThemedView style={styles.modalOverlay}>
          <ThemedView style={styles.modalContent}>
            <ThemedView style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Transfer Quote</ThemedText>
              <TouchableOpacity onPress={() => setShowFXQuote(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </ThemedView>

            {fxQuote && (
              <ThemedView style={styles.quoteDetails}>
                <ThemedView style={styles.quoteRow}>
                  <ThemedText style={styles.quoteLabel}>You send:</ThemedText>
                  <ThemedText style={styles.quoteValue}>
                    {fxQuote.amount} {fxQuote.fromCurrency}
                  </ThemedText>
                </ThemedView>
                <ThemedView style={styles.quoteRow}>
                  <ThemedText style={styles.quoteLabel}>They receive:</ThemedText>
                  <ThemedText style={styles.quoteValue}>
                    {fxQuote.convertedAmount.toFixed(2)} {fxQuote.toCurrency}
                  </ThemedText>
                </ThemedView>
                <ThemedView style={styles.quoteRow}>
                  <ThemedText style={styles.quoteLabel}>Exchange rate:</ThemedText>
                  <ThemedText style={styles.quoteValue}>1 {fxQuote.fromCurrency} = {fxQuote.rate} {fxQuote.toCurrency}</ThemedText>
                </ThemedView>
                <ThemedView style={styles.quoteRow}>
                  <ThemedText style={styles.quoteLabel}>Fees:</ThemedText>
                  <ThemedText style={styles.quoteValue}>${fxQuote.fees}</ThemedText>
                </ThemedView>
                <ThemedView style={[styles.quoteRow, styles.totalRow]}>
                  <ThemedText style={styles.totalLabel}>Total cost:</ThemedText>
                  <ThemedText style={styles.totalValue}>${fxQuote.totalCost}</ThemedText>
                </ThemedView>
              </ThemedView>
            )}

            <ThemedView style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowFXQuote(false)}>
                <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmTransfer}>
                <ThemedText style={styles.confirmButtonText}>Confirm Transfer</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  addButton: {
    padding: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#111827',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  newTransferContainer: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  beneficiaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedBeneficiary: {
    borderColor: '#0a7ea4',
    backgroundColor: '#F0F9FF',
  },
  beneficiaryInfo: {
    flex: 1,
  },
  beneficiaryName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  beneficiaryDetails: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  beneficiaryCountry: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  amountInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  currencyLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 12,
    color: '#6B7280',
  },
  amountText: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  amountButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amountButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  amountButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  transferButton: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  transferButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  historyContainer: {
    flex: 1,
  },
  historyCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  historyRecipient: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 2,
  },
  historyFX: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  quoteDetails: {
    marginBottom: 24,
  },
  quoteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  totalRow: {
    borderBottomWidth: 0,
    borderTopWidth: 2,
    borderTopColor: '#E5E7EB',
    marginTop: 8,
    paddingTop: 16,
  },
  quoteLabel: {
    fontSize: 16,
    color: '#6B7280',
  },
  quoteValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0a7ea4',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#0a7ea4',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
}); 