import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

// Mock data - in a real app, this would come from your backend
const currencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$', balance: 1250.75 },
  { code: 'USDC', name: 'USD Coin', symbol: '$', balance: 500.00 },
  { code: 'EUR', name: 'Euro', symbol: '€', balance: 850.25 },
  { code: 'GBP', name: 'British Pound', symbol: '£', balance: 650.50 },
];

const accountInfo = {
  accountNumber: '1234567890',
  routingNumber: '021000021',
  accountType: 'Virtual USD Account',
};

export default function WalletScreen() {
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);

  const selectedCurrencyData = currencies.find(c => c.code === selectedCurrency);

  const handleSend = () => {
    Alert.alert('Send', `Send ${selectedCurrency} functionality would be implemented here`);
  };

  const handleReceive = () => {
    Alert.alert('Receive', `Receive ${selectedCurrency} functionality would be implemented here`);
  };

  const handleConvert = () => {
    Alert.alert('Convert', `Convert ${selectedCurrency} functionality would be implemented here`);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.headerTitle}>Wallet</ThemedText>
      </ThemedView>

      {/* Account Information */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Account Information</ThemedText>
        <ThemedView style={styles.accountCard}>
          <ThemedView style={styles.accountRow}>
            <ThemedText style={styles.accountLabel}>Account Number:</ThemedText>
            <ThemedText style={styles.accountValue}>{accountInfo.accountNumber}</ThemedText>
          </ThemedView>
          <ThemedView style={styles.accountRow}>
            <ThemedText style={styles.accountLabel}>Routing Number:</ThemedText>
            <ThemedText style={styles.accountValue}>{accountInfo.routingNumber}</ThemedText>
          </ThemedView>
          <ThemedView style={styles.accountRow}>
            <ThemedText style={styles.accountLabel}>Account Type:</ThemedText>
            <ThemedText style={styles.accountValue}>{accountInfo.accountType}</ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>

      {/* Currency Switcher */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Currency</ThemedText>
        <TouchableOpacity 
          style={styles.currencySelector}
          onPress={() => setShowCurrencyPicker(!showCurrencyPicker)}
        >
          <ThemedText style={styles.currencyText}>
            {selectedCurrency} - {selectedCurrencyData?.name}
          </ThemedText>
          <ThemedText style={styles.currencyArrow}>▼</ThemedText>
        </TouchableOpacity>

        {showCurrencyPicker && (
          <ThemedView style={styles.currencyPicker}>
            {currencies.map((currency) => (
              <TouchableOpacity
                key={currency.code}
                style={[
                  styles.currencyOption,
                  selectedCurrency === currency.code && styles.selectedCurrency
                ]}
                onPress={() => {
                  setSelectedCurrency(currency.code);
                  setShowCurrencyPicker(false);
                }}
              >
                <ThemedText style={styles.currencyOptionText}>
                  {currency.code} - {currency.name}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ThemedView>
        )}
      </ThemedView>

      {/* Balance Display */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Available Balance</ThemedText>
        <ThemedView style={styles.balanceCard}>
          <ThemedText type="title" style={styles.balanceAmount}>
            {selectedCurrencyData?.symbol}{selectedCurrencyData?.balance.toLocaleString()}
          </ThemedText>
          <ThemedText style={styles.balanceCurrency}>{selectedCurrency}</ThemedText>
        </ThemedView>
      </ThemedView>

      {/* Action Buttons */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Actions</ThemedText>
        <ThemedView style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={handleSend}>
            <ThemedText style={styles.actionButtonText}>Send</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleReceive}>
            <ThemedText style={styles.actionButtonText}>Receive</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleConvert}>
            <ThemedText style={styles.actionButtonText}>Convert</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>

      {/* All Balances */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>All Balances</ThemedText>
        {currencies.map((currency) => (
          <ThemedView key={currency.code} style={styles.balanceRow}>
            <ThemedView style={styles.balanceInfo}>
              <ThemedText style={styles.balanceCode}>{currency.code}</ThemedText>
              <ThemedText style={styles.balanceName}>{currency.name}</ThemedText>
            </ThemedView>
            <ThemedText style={styles.balanceValue}>
              {currency.symbol}{currency.balance.toLocaleString()}
            </ThemedText>
          </ThemedView>
        ))}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 40,
    paddingBottom: 10,
  },
  headerTitle: {
    textAlign: 'center',
  },
  section: {
    padding: 20,
    paddingTop: 10,
  },
  sectionTitle: {
    marginBottom: 15,
  },
  accountCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  accountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  accountLabel: {
    fontWeight: '600',
  },
  accountValue: {
    fontFamily: 'monospace',
  },
  currencySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  currencyText: {
    fontWeight: '600',
  },
  currencyArrow: {
    fontSize: 12,
  },
  currencyPicker: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  currencyOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  selectedCurrency: {
    backgroundColor: '#e3f2fd',
  },
  currencyOptionText: {
    fontWeight: '500',
  },
  balanceCard: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  balanceCurrency: {
    fontSize: 16,
    opacity: 0.7,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#0a7ea4',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  balanceInfo: {
    flex: 1,
  },
  balanceCode: {
    fontWeight: '600',
    fontSize: 16,
  },
  balanceName: {
    fontSize: 14,
    opacity: 0.7,
  },
  balanceValue: {
    fontWeight: '600',
    fontSize: 16,
  },
}); 