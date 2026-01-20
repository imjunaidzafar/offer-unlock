import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Linking,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {SafeAreaWrapper, Button} from '../components/ui';
import {useAuthStore} from '../store/useAuthStore';
import {useWizardStore} from '../store/useWizardStore';
import {colors, shadows, borderRadius} from '../theme';
import type {RootStackParamList} from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface SettingToggle {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
}

const notificationSettings: SettingToggle[] = [
  {
    id: 'push',
    title: 'Push Notifications',
    subtitle: 'Receive alerts about your offers',
    icon: '🔔',
  },
  {
    id: 'email',
    title: 'Email Notifications',
    subtitle: 'Get updates via email',
    icon: '✉️',
  },
  {
    id: 'sms',
    title: 'SMS Notifications',
    subtitle: 'Receive text message alerts',
    icon: '💬',
  },
  {
    id: 'marketing',
    title: 'Marketing Updates',
    subtitle: 'New offers and promotions',
    icon: '🎯',
  },
];

export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const deleteAccount = useAuthStore(state => state.deleteAccount);
  const resetWizard = useWizardStore(state => state.resetWizard);
  const wizardData = useWizardStore(state => state.data);

  const [toggleStates, setToggleStates] = useState<Record<string, boolean>>({
    push: true,
    email: true,
    sms: false,
    marketing: false,
  });

  const handleBack = () => {
    navigation.goBack();
  };

  const handleToggle = (id: string) => {
    setToggleStates(prev => ({...prev, [id]: !prev[id]}));
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            logout();
            navigation.reset({
              index: 0,
              routes: [{name: 'Auth'}],
            });
          },
        },
      ],
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            resetWizard();
            deleteAccount();
            navigation.reset({
              index: 0,
              routes: [{name: 'Auth'}],
            });
          },
        },
      ],
    );
  };

  const handlePrivacyPolicy = () => {
    Linking.openURL('https://offerunlock.com/privacy');
  };

  const handleTermsOfService = () => {
    Linking.openURL('https://offerunlock.com/terms');
  };

  const fullName = `${wizardData.step1.firstName} ${wizardData.step1.lastName}`.trim() || 'User';

  return (
    <SafeAreaWrapper>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Settings</Text>
            <Text style={styles.subtitle}>Manage your account preferences</Text>
          </View>
        </View>

        {/* Profile Card */}
        <View style={styles.section}>
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>
                {fullName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{fullName}</Text>
              <Text style={styles.profileEmail}>{user?.email || 'No email'}</Text>
              <Text style={styles.profilePhone}>{user?.phone || 'No phone'}</Text>
            </View>
            <View style={styles.profileBadge}>
              <Text style={styles.profileBadgeText}>Verified</Text>
            </View>
          </View>
        </View>

        {/* Notification Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.settingsCard}>
            {notificationSettings.map((setting, index) => (
              <View
                key={setting.id}
                style={[
                  styles.settingRow,
                  index < notificationSettings.length - 1 && styles.settingRowBorder,
                ]}>
                <Text style={styles.settingIcon}>{setting.icon}</Text>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>{setting.title}</Text>
                  <Text style={styles.settingSubtitle}>{setting.subtitle}</Text>
                </View>
                <Switch
                  value={toggleStates[setting.id]}
                  onValueChange={() => handleToggle(setting.id)}
                  trackColor={{false: colors.border.default, true: colors.accent.primary}}
                  thumbColor={colors.background.card}
                />
              </View>
            ))}
          </View>
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.settingsCard}>
            <View style={[styles.infoRow, styles.settingRowBorder]}>
              <Text style={styles.infoLabel}>Version</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
            <View style={[styles.infoRow, styles.settingRowBorder]}>
              <Text style={styles.infoLabel}>Build</Text>
              <Text style={styles.infoValue}>2026.01.20</Text>
            </View>
            <TouchableOpacity
              style={[styles.infoRow, styles.settingRowBorder]}
              onPress={handlePrivacyPolicy}
              activeOpacity={0.7}>
              <Text style={styles.infoLabel}>Privacy Policy</Text>
              <Text style={styles.infoArrow}>→</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.infoRow}
              onPress={handleTermsOfService}
              activeOpacity={0.7}>
              <Text style={styles.infoLabel}>Terms of Service</Text>
              <Text style={styles.infoArrow}>→</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="outline"
            style={styles.logoutButton}
          />
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeleteAccount}>
            <Text style={styles.deleteButtonText}>Delete Account</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Made with ❤️ by Offer Unlock</Text>
          <Text style={styles.footerCopyright}>© 2026 All rights reserved</Text>
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.background.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    ...shadows.sm,
  },
  backIcon: {
    fontSize: 20,
    color: colors.text.primary,
    textAlign: 'center',
    lineHeight: 22,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 12,
  },
  profileCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.md,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: colors.accent.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.inverse,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 2,
  },
  profilePhone: {
    fontSize: 13,
    color: colors.text.muted,
  },
  profileBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  profileBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#059669',
  },
  settingsCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  settingRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
  },
  settingIcon: {
    fontSize: 22,
    marginRight: 14,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  infoLabel: {
    fontSize: 15,
    color: colors.text.primary,
  },
  infoValue: {
    fontSize: 15,
    color: colors.text.secondary,
  },
  infoArrow: {
    fontSize: 16,
    color: colors.text.muted,
  },
  logoutButton: {
    marginBottom: 12,
  },
  deleteButton: {
    alignItems: 'center',
    padding: 14,
  },
  deleteButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.error,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  footerCopyright: {
    fontSize: 12,
    color: colors.text.muted,
  },
});
