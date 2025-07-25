import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';

interface SettingItemProps {
  title: string;
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  showChevron?: boolean;
}

function SettingItem({ title, subtitle, icon, onPress, rightElement, showChevron = true }: SettingItemProps) {
  const iconColor = useThemeColor({}, 'icon');
  const textColor = useThemeColor({}, 'text');
  
  return (
    <TouchableOpacity style={styles.settingItem} onPress={onPress} disabled={!onPress}>
      <ThemedView style={styles.settingItemLeft}>
        <Ionicons name={icon} size={24} color={iconColor} style={styles.settingIcon} />
        <ThemedView style={styles.settingTextContainer}>
          <ThemedText style={styles.settingTitle}>{title}</ThemedText>
          {subtitle && <ThemedText style={[styles.settingSubtitle, { color: iconColor }]}>{subtitle}</ThemedText>}
        </ThemedView>
      </ThemedView>
      <ThemedView style={styles.settingItemRight}>
        {rightElement}
        {showChevron && onPress && <Ionicons name="chevron-forward" size={20} color={iconColor} />}
      </ThemedView>
    </TouchableOpacity>
  );
}

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <ThemedView style={styles.section}>
      <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
      <ThemedView style={styles.sectionContent}>
        {children}
      </ThemedView>
    </ThemedView>
  );
}

export default function SettingsScreen() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  const handleKYCResubmission = () => {
    Alert.alert('KYC Resubmission', 'Redirecting to KYC verification form...');
  };

  const handleSecuritySettings = () => {
    Alert.alert('Security Settings', 'Opening security configuration...');
  };

  const handleCurrencySettings = () => {
    Alert.alert('Currency Settings', 'Opening currency preferences...');
  };

  const handleLanguageSettings = () => {
    Alert.alert('Language Settings', 'Opening language preferences...');
  };

  const handleBankAccounts = () => {
    Alert.alert('Bank Accounts', 'Opening linked bank accounts...');
  };

  const handleNotificationSettings = () => {
    Alert.alert('Notification Settings', 'Opening notification preferences...');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Settings</ThemedText>
        <ThemedText style={styles.headerSubtitle}>Manage your account and preferences</ThemedText>
      </ThemedView>

      <SettingsSection title="Identity Verification">
        <SettingItem
          title="KYC Status"
          subtitle="Verified • Last updated 2 days ago"
          icon="checkmark-circle-outline"
          rightElement={
            <ThemedView style={styles.statusBadge}>
              <ThemedText style={styles.statusText}>Verified</ThemedText>
            </ThemedView>
          }
          showChevron={false}
        />
        <SettingItem
          title="Resubmit KYC"
          subtitle="Update your verification documents"
          icon="document-outline"
          onPress={handleKYCResubmission}
        />
      </SettingsSection>

      <SettingsSection title="Security">
        <SettingItem
          title="Two-Factor Authentication"
          subtitle="Add an extra layer of security"
          icon="shield-outline"
          rightElement={
            <Switch
              value={twoFactorEnabled}
              onValueChange={setTwoFactorEnabled}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={twoFactorEnabled ? '#f5dd4b' : '#f4f3f4'}
            />
          }
          showChevron={false}
        />
        <SettingItem
          title="Security Settings"
          subtitle="Password, PIN, and biometrics"
          icon="lock-closed-outline"
          onPress={handleSecuritySettings}
        />
      </SettingsSection>

      <SettingsSection title="Preferences">
        <SettingItem
          title="Currency"
          subtitle="USD - US Dollar"
          icon="wallet"
          onPress={handleCurrencySettings}
        />
        <SettingItem
          title="Language"
          subtitle="English"
          icon="globe-outline"
          onPress={handleLanguageSettings}
        />
      </SettingsSection>

      <SettingsSection title="Banking">
        <SettingItem
          title="Linked Bank Accounts"
          subtitle="2 accounts connected"
          icon="card-outline"
          onPress={handleBankAccounts}
        />
      </SettingsSection>

      <SettingsSection title="Notifications">
        <SettingItem
          title="Push Notifications"
          subtitle="Receive alerts on your device"
          icon="notifications-outline"
          rightElement={
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={pushNotifications ? '#f5dd4b' : '#f4f3f4'}
            />
          }
          showChevron={false}
        />
        <SettingItem
          title="Email Notifications"
          subtitle="Receive updates via email"
          icon="mail-outline"
          rightElement={
            <Switch
              value={emailNotifications}
              onValueChange={setEmailNotifications}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={emailNotifications ? '#f5dd4b' : '#f4f3f4'}
            />
          }
          showChevron={false}
        />
        <SettingItem
          title="SMS Notifications"
          subtitle="Receive updates via SMS"
          icon="chatbubble-outline"
          rightElement={
            <Switch
              value={smsNotifications}
              onValueChange={setSmsNotifications}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={smsNotifications ? '#f5dd4b' : '#f4f3f4'}
            />
          }
          showChevron={false}
        />
        <SettingItem
          title="Notification Preferences"
          subtitle="Customize notification types"
          icon="settings-outline"
          onPress={handleNotificationSettings}
        />
      </SettingsSection>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  headerSubtitle: {
    fontSize: 16,
    marginTop: 5,
    opacity: 0.7,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    marginHorizontal: 20,
  },
  sectionContent: {
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    borderRadius: 12,
    marginHorizontal: 20,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 12,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
}); 