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
import {SafeAreaWrapper} from '../shared/ui';
import {useSessionStore} from '../state/useSessionStore';
import {useOnboardingStore} from '../state/useOnboardingStore';
import {colors, shadows, borderRadius} from '../design';
import type {RootStackParamList} from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface SettingToggle {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  bgColor: string;
}

const notificationSettings: SettingToggle[] = [
  {
    id: 'push',
    title: 'Push Notifications',
    subtitle: 'Receive alerts about your offers',
    icon: '🔔',
    color: '#059669',
    bgColor: '#ECFDF5',
  },
  {
    id: 'email',
    title: 'Email Notifications',
    subtitle: 'Get updates via email',
    icon: '✉️',
    color: '#2563EB',
    bgColor: '#DBEAFE',
  },
  {
    id: 'sms',
    title: 'SMS Notifications',
    subtitle: 'Receive text message alerts',
    icon: '💬',
    color: '#7C3AED',
    bgColor: '#F3E8FF',
  },
  {
    id: 'marketing',
    title: 'Marketing Updates',
    subtitle: 'New offers and promotions',
    icon: '🎯',
    color: '#EA580C',
    bgColor: '#FFF7ED',
  },
];

export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const user = useSessionStore(state => state.user);
  const logout = useSessionStore(state => state.logout);
  const deleteAccount = useSessionStore(state => state.deleteAccount);
  const resetWizard = useOnboardingStore(state => state.resetWizard);
  const wizardData = useOnboardingStore(state => state.data);

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
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Sign Out',
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
      'This will permanently delete your account and all data. This action cannot be undone.',
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
    Linking.openURL('https://offerly.com/privacy');
  };

  const handleTermsOfService = () => {
    Linking.openURL('https://offerly.com/terms');
  };

  const fullName = `${wizardData.step1.firstName} ${wizardData.step1.lastName}`.trim() || 'User';

  return (
    <SafeAreaWrapper>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Hero Header */}
        <View style={styles.heroSection}>
          <View style={styles.heroBackground}>
            <View style={styles.heroCircle1} />
            <View style={styles.heroCircle2} />
          </View>
          <View style={styles.heroContent}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <View style={styles.backChevron} />
            </TouchableOpacity>
            <View style={styles.profileSection}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>
                  {fullName.charAt(0).toUpperCase()}
                </Text>
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedIcon}>✓</Text>
                </View>
              </View>
              <Text style={styles.profileName}>{fullName}</Text>
              <Text style={styles.profileEmail} numberOfLines={1}>{user?.email || 'No email'}</Text>
            </View>
          </View>
        </View>

        {/* Account Info Card */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>👤</Text>
            <Text style={styles.sectionTitle}>Account Details</Text>
          </View>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={[styles.infoIconWrap, {backgroundColor: '#ECFDF5'}]}>
                <Text style={styles.infoIcon}>📧</Text>
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user?.email || 'Not set'}</Text>
              </View>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <View style={[styles.infoIconWrap, {backgroundColor: '#DBEAFE'}]}>
                <Text style={styles.infoIcon}>📱</Text>
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>{user?.phone || 'Not set'}</Text>
              </View>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <View style={[styles.infoIconWrap, {backgroundColor: '#F3E8FF'}]}>
                <Text style={styles.infoIcon}>🆔</Text>
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Username</Text>
                <Text style={styles.infoValue}>{user?.username || 'Not set'}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Notification Settings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>🔔</Text>
            <Text style={styles.sectionTitle}>Notifications</Text>
          </View>
          <View style={styles.settingsCard}>
            {notificationSettings.map((setting, index) => (
              <View
                key={setting.id}
                style={[
                  styles.settingRow,
                  index < notificationSettings.length - 1 && styles.settingRowBorder,
                ]}>
                <View style={[styles.settingIconWrap, {backgroundColor: setting.bgColor}]}>
                  <Text style={styles.settingIcon}>{setting.icon}</Text>
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>{setting.title}</Text>
                  <Text style={styles.settingSubtitle}>{setting.subtitle}</Text>
                </View>
                <Switch
                  value={toggleStates[setting.id]}
                  onValueChange={() => handleToggle(setting.id)}
                  trackColor={{false: '#E5E7EB', true: '#10B981'}}
                  thumbColor={'#FFFFFF'}
                  ios_backgroundColor="#E5E7EB"
                />
              </View>
            ))}
          </View>
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>ℹ️</Text>
            <Text style={styles.sectionTitle}>About</Text>
          </View>
          <View style={styles.settingsCard}>
            <View style={[styles.aboutRow, styles.settingRowBorder]}>
              <Text style={styles.aboutLabel}>Version</Text>
              <View style={styles.aboutBadge}>
                <Text style={styles.aboutBadgeText}>1.0.0</Text>
              </View>
            </View>
            <View style={[styles.aboutRow, styles.settingRowBorder]}>
              <Text style={styles.aboutLabel}>Build</Text>
              <Text style={styles.aboutValue}>2026.01.21</Text>
            </View>
            <TouchableOpacity
              style={[styles.aboutRow, styles.settingRowBorder]}
              onPress={handlePrivacyPolicy}
              activeOpacity={0.7}>
              <Text style={styles.aboutLabel}>Privacy Policy</Text>
              <View style={styles.aboutArrow}>
                <View style={styles.forwardChevron} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.aboutRow}
              onPress={handleTermsOfService}
              activeOpacity={0.7}>
              <Text style={styles.aboutLabel}>Terms of Service</Text>
              <View style={styles.aboutArrow}>
                <View style={styles.forwardChevron} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutIcon}>🚪</Text>
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
            <Text style={styles.deleteIcon}>⚠️</Text>
            <Text style={styles.deleteText}>Delete Account</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerLogo}>🚀 Offerly</Text>
          <Text style={styles.footerText}>Made with care for you</Text>
          <Text style={styles.footerCopyright}>© 2026 All rights reserved</Text>
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
    backgroundColor: colors.background.primary,
  },
  heroSection: {
    height: 250,
    position: 'relative',
    marginBottom: 24,
  },
  heroBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#059669',
    overflow: 'hidden',
  },
  heroCircle1: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#10B981',
    opacity: 0.4,
  },
  heroCircle2: {
    position: 'absolute',
    bottom: -30,
    left: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#34D399',
    opacity: 0.3,
  },
  heroContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  backChevron: {
    width: 10,
    height: 10,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    borderColor: '#FFFFFF',
    transform: [{rotate: '45deg'}],
    marginLeft: 4,
  },
  profileSection: {
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    ...shadows.lg,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#059669',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  verifiedIcon: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  profileName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
  },
  infoCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    padding: 4,
    ...shadows.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  infoIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  infoIcon: {
    fontSize: 20,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.text.muted,
    fontWeight: '500',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    color: colors.text.primary,
    fontWeight: '600',
  },
  infoDivider: {
    height: 1,
    backgroundColor: colors.border.default,
    marginHorizontal: 14,
  },
  settingsCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    ...shadows.md,
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
  settingIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  settingIcon: {
    fontSize: 20,
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
    fontSize: 12,
    color: colors.text.secondary,
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  aboutLabel: {
    fontSize: 15,
    color: colors.text.primary,
    fontWeight: '500',
  },
  aboutValue: {
    fontSize: 14,
    color: colors.text.muted,
  },
  aboutBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  aboutBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
  },
  aboutArrow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  forwardChevron: {
    width: 8,
    height: 8,
    borderRightWidth: 2,
    borderTopWidth: 2,
    borderColor: colors.text.muted,
    transform: [{rotate: '45deg'}],
    marginLeft: -2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF3C7',
    paddingVertical: 16,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginBottom: 12,
  },
  logoutIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    paddingVertical: 16,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  deleteIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  deleteText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  footerLogo: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 6,
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
