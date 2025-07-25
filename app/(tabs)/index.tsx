import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Mock data - in a real app, this would come from your backend
const mockBalances = {
  usd: 1250.75,
  usdc: 500.00,
  eur: 850.50,
};

const mockTransactions = [
  {
    id: '1',
    type: 'received',
    amount: 250.00,
    currency: 'USD',
    description: 'Payment from John Doe',
    date: '2024-01-15',
    time: '14:30',
  },
  {
    id: '2',
    type: 'sent',
    amount: 75.50,
    currency: 'USD',
    description: 'Coffee shop payment',
    date: '2024-01-14',
    time: '09:15',
  },
  {
    id: '3',
    type: 'received',
    amount: 1000.00,
    currency: 'USDC',
    description: 'Stablecoin deposit',
    date: '2024-01-13',
    time: '16:45',
  },
];

const mockNotifications = [
  {
    id: '1',
    type: 'fx_alert',
    message: 'EUR/USD rate favorable for conversion',
    isRead: false,
  },
  {
    id: '2',
    type: 'transaction',
    message: 'Payment received: $250.00',
    isRead: true,
  },
];

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [notifications, setNotifications] = useState(mockNotifications);

  const totalBalance = mockBalances.usd + mockBalances.usdc + mockBalances.eur;

  const handleQuickAction = (action: string) => {
    Alert.alert('Quick Action', `${action} action would be triggered here`);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const formatCurrency = (amount: number, currency: string) => {
    // Handle non-standard currency codes like USDC
    const validCurrency = currency === 'USDC' ? 'USD' : currency;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: validCurrency,
    }).format(amount);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <ThemedText style={styles.headerTitle}>Financial Overview</ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          {formatCurrency(totalBalance, 'USD')} total
        </ThemedText>
      </ThemedView>

      {/* Wallet Balances */}
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Wallet Balances</ThemedText>
        <View style={styles.balancesContainer}>
          <View style={[styles.balanceCard, { backgroundColor: colors.background, borderColor: colors.icon }]}>
            <ThemedText style={styles.balanceLabel}>USD</ThemedText>
            <ThemedText style={styles.balanceAmount}>
              {formatCurrency(mockBalances.usd, 'USD')}
            </ThemedText>
          </View>
          <View style={[styles.balanceCard, { backgroundColor: colors.background, borderColor: colors.icon }]}>
            <ThemedText style={styles.balanceLabel}>USDC</ThemedText>
            <ThemedText style={styles.balanceAmount}>
              {formatCurrency(mockBalances.usdc, 'USD')}
            </ThemedText>
          </View>
          <View style={[styles.balanceCard, { backgroundColor: colors.background, borderColor: colors.icon }]}>
            <ThemedText style={styles.balanceLabel}>EUR</ThemedText>
            <ThemedText style={styles.balanceAmount}>
              {formatCurrency(mockBalances.eur, 'EUR')}
            </ThemedText>
          </View>
        </View>
      </ThemedView>

      {/* Quick Actions */}
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Quick Actions</ThemedText>
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.tint }]}
            onPress={() => handleQuickAction('Add Funds')}
          >
            <ThemedText style={[styles.actionButtonText, { color: colors.background }]}>
              Add Funds
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.tint }]}
            onPress={() => handleQuickAction('Withdraw')}
          >
            <ThemedText style={[styles.actionButtonText, { color: colors.background }]}>
              Withdraw
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.tint }]}
            onPress={() => handleQuickAction('Send')}
          >
            <ThemedText style={[styles.actionButtonText, { color: colors.background }]}>
              Send
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>

      {/* Notifications */}
      {notifications.length > 0 && (
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Notifications</ThemedText>
          {notifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              style={[
                styles.notificationItem,
                { 
                  backgroundColor: colors.background,
                  borderColor: colors.icon,
                  opacity: notification.isRead ? 0.7 : 1,
                }
              ]}
              onPress={() => markNotificationAsRead(notification.id)}
            >
              <View style={styles.notificationContent}>
                <ThemedText style={styles.notificationMessage}>
                  {notification.message}
                </ThemedText>
                {!notification.isRead && (
                  <View style={[styles.unreadDot, { backgroundColor: colors.tint }]} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ThemedView>
      )}

      {/* Recent Transactions */}
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Recent Transactions</ThemedText>
        {mockTransactions.map((transaction) => (
          <View 
            key={transaction.id}
            style={[styles.transactionItem, { backgroundColor: colors.background, borderColor: colors.icon }]}
          >
            <View style={styles.transactionLeft}>
              <ThemedText style={styles.transactionDescription}>
                {transaction.description}
              </ThemedText>
              <ThemedText style={[styles.transactionDate, { color: colors.icon }]}>
                {transaction.date} at {transaction.time}
              </ThemedText>
            </View>
            <View style={styles.transactionRight}>
              <ThemedText 
                style={[
                  styles.transactionAmount,
                  { color: transaction.type === 'received' ? '#4CAF50' : '#F44336' }
                ]}
              >
                {transaction.type === 'received' ? '+' : '-'}
                {formatCurrency(transaction.amount, transaction.currency)}
              </ThemedText>
            </View>
          </View>
        ))}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 18,
    opacity: 0.8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  balancesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  balanceCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  notificationItem: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notificationMessage: {
    flex: 1,
    fontSize: 14,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  transactionLeft: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
});
