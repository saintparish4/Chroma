'use client';

import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { Alert, ScrollView, Share, StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';

// Types
interface Transaction {
  id: string;
  type: 'onramp' | 'offramp' | 'payout';
  amount: number;
  currency: string;
  status: 'pending' | 'complete' | 'failed';
  date: Date;
  description: string;
  receiptUrl?: string;
}

// Mock data
const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'onramp',
    amount: 500,
    currency: 'USD',
    status: 'complete',
    date: new Date('2024-01-15'),
    description: 'Bank transfer from Chase',
    receiptUrl: 'https://example.com/receipt1.pdf'
  },
  {
    id: '2',
    type: 'payout',
    amount: 250,
    currency: 'USD',
    status: 'pending',
    date: new Date('2024-01-14'),
    description: 'Payout to Bank of America'
  },
  {
    id: '3',
    type: 'offramp',
    amount: 100,
    currency: 'USD',
    status: 'failed',
    date: new Date('2024-01-13'),
    description: 'Withdrawal to PayPal'
  },
  {
    id: '4',
    type: 'onramp',
    amount: 1000,
    currency: 'USD',
    status: 'complete',
    date: new Date('2024-01-12'),
    description: 'Credit card deposit',
    receiptUrl: 'https://example.com/receipt4.pdf'
  },
  {
    id: '5',
    type: 'payout',
    amount: 750,
    currency: 'USD',
    status: 'complete',
    date: new Date('2024-01-11'),
    description: 'Payout to Wells Fargo',
    receiptUrl: 'https://example.com/receipt5.pdf'
  }
];

export default function ActivityScreen() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'onramp' | 'offramp' | 'payout'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'complete' | 'failed'>('all');
  
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  const filteredTransactions = useMemo(() => {
    return mockTransactions.filter(transaction => {
      const typeMatch = selectedFilter === 'all' || transaction.type === selectedFilter;
      const statusMatch = selectedStatus === 'all' || transaction.status === selectedStatus;
      return typeMatch && statusMatch;
    }).sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [selectedFilter, selectedStatus]);

  const handleDownloadReceipt = async (transaction: Transaction) => {
    if (!transaction.receiptUrl) {
      Alert.alert('No Receipt', 'Receipt not available for this transaction.');
      return;
    }

    try {
      await Share.share({
        url: transaction.receiptUrl,
        title: `Receipt for ${transaction.description}`,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to download receipt.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete': return '#10B981';
      case 'pending': return '#F59E0B';
      case 'failed': return '#EF4444';
      default: return textColor;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'onramp': return 'arrow-down-circle';
      case 'offramp': return 'arrow-up-circle';
      case 'payout': return 'card';
      default: return 'swap-horizontal';
    }
  };

  const FilterButton = ({ 
    title, 
    value, 
    currentValue, 
    onPress 
  }: { 
    title: string; 
    value: string; 
    currentValue: string; 
    onPress: () => void;
  }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        { 
          backgroundColor: currentValue === value ? tintColor : backgroundColor,
          borderColor: tintColor
        }
      ]}
      onPress={onPress}
    >
      <ThemedText style={[
        styles.filterButtonText,
        { color: currentValue === value ? '#fff' : tintColor }
      ]}>
        {title}
      </ThemedText>
    </TouchableOpacity>
  );

  const TransactionCard = ({ transaction }: { transaction: Transaction }) => (
    <ThemedView style={styles.transactionCard}>
      <ThemedView style={styles.transactionHeader}>
        <ThemedView style={styles.transactionIcon}>
          <Ionicons 
            name={getTypeIcon(transaction.type) as any} 
            size={24} 
            color={tintColor} 
          />
        </ThemedView>
        <ThemedView style={styles.transactionInfo}>
          <ThemedText type="defaultSemiBold">{transaction.description}</ThemedText>
          <ThemedText style={styles.transactionDate}>
            {transaction.date.toLocaleDateString()}
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.transactionAmount}>
          <ThemedText type="defaultSemiBold">
            {transaction.type === 'onramp' ? '+' : '-'}${transaction.amount}
          </ThemedText>
          <ThemedText style={styles.transactionCurrency}>{transaction.currency}</ThemedText>
        </ThemedView>
      </ThemedView>
      
      <ThemedView style={styles.transactionFooter}>
        <ThemedView style={styles.statusContainer}>
          <ThemedView style={[styles.statusDot, { backgroundColor: getStatusColor(transaction.status) }]} />
          <ThemedText style={[styles.statusText, { color: getStatusColor(transaction.status) }]}>
            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
          </ThemedText>
        </ThemedView>
        
        {transaction.receiptUrl && (
          <TouchableOpacity 
            style={styles.receiptButton}
            onPress={() => handleDownloadReceipt(transaction)}
          >
            <Ionicons name="download-outline" size={16} color={tintColor} />
            <ThemedText style={[styles.receiptButtonText, { color: tintColor }]}>
              Receipt
            </ThemedText>
          </TouchableOpacity>
        )}
      </ThemedView>
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Activity</ThemedText>
        <ThemedText type="subtitle">Track your transactions</ThemedText>
      </ThemedView>

      <ThemedView style={styles.filtersContainer}>
        <ThemedText type="defaultSemiBold" style={styles.filterLabel}>Type:</ThemedText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          <FilterButton title="All" value="all" currentValue={selectedFilter} onPress={() => setSelectedFilter('all')} />
          <FilterButton title="Onramp" value="onramp" currentValue={selectedFilter} onPress={() => setSelectedFilter('onramp')} />
          <FilterButton title="Offramp" value="offramp" currentValue={selectedFilter} onPress={() => setSelectedFilter('offramp')} />
          <FilterButton title="Payout" value="payout" currentValue={selectedFilter} onPress={() => setSelectedFilter('payout')} />
        </ScrollView>
      </ThemedView>

      <ThemedView style={styles.filtersContainer}>
        <ThemedText type="defaultSemiBold" style={styles.filterLabel}>Status:</ThemedText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          <FilterButton title="All" value="all" currentValue={selectedStatus} onPress={() => setSelectedStatus('all')} />
          <FilterButton title="Pending" value="pending" currentValue={selectedStatus} onPress={() => setSelectedStatus('pending')} />
          <FilterButton title="Complete" value="complete" currentValue={selectedStatus} onPress={() => setSelectedStatus('complete')} />
          <FilterButton title="Failed" value="failed" currentValue={selectedStatus} onPress={() => setSelectedStatus('failed')} />
        </ScrollView>
      </ThemedView>

      <ScrollView style={styles.transactionsList} showsVerticalScrollIndicator={false}>
        {filteredTransactions.length === 0 ? (
          <ThemedView style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={48} color={textColor} />
            <ThemedText type="subtitle" style={styles.emptyStateText}>No transactions found</ThemedText>
            <ThemedText style={styles.emptyStateSubtext}>Try adjusting your filters</ThemedText>
          </ThemedView>
        ) : (
          filteredTransactions.map(transaction => (
            <TransactionCard key={transaction.id} transaction={transaction} />
          ))
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 24,
  },
  filtersContainer: {
    marginBottom: 16,
  },
  filterLabel: {
    marginBottom: 8,
  },
  filterScroll: {
    flexDirection: 'row',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  transactionsList: {
    flex: 1,
  },
  transactionCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  transactionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: 'rgba(10, 122, 164, 0.1)',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDate: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 2,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  transactionCurrency: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 2,
  },
  transactionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  receiptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  receiptButtonText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    opacity: 0.7,
  },
}); 