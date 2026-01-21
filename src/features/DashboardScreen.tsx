import React, {useMemo} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {SafeAreaWrapper} from '../shared/ui';
import {useSessionStore} from '../state/useSessionStore';
import {useOnboardingStore} from '../state/useOnboardingStore';
import {calculateOffer, getOfferSummary} from '../lib/quoteEngine';
import {colors, shadows, borderRadius} from '../design';
import type {RootStackParamList} from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const user = useSessionStore(state => state.user);
  const logout = useSessionStore(state => state.logout);
  const wizardData = useOnboardingStore(state => state.data);

  const handleLogout = () => {
    logout();
    navigation.reset({
      index: 0,
      routes: [{name: 'Auth'}],
    });
  };

  const handleViewOffer = () => {
    navigation.navigate('Result');
  };

  const handleCompare = () => {
    navigation.navigate('Compare');
  };

  const handleSupport = () => {
    navigation.navigate('Support');
  };

  const handleSettings = () => {
    navigation.navigate('Settings');
  };

  const calculatedOffer = useMemo(
    () => calculateOffer(wizardData.step2, wizardData.step3),
    [wizardData.step2, wizardData.step3],
  );

  const offer = useMemo(() => getOfferSummary(calculatedOffer), [calculatedOffer]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const formatUsername = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  return (
    <SafeAreaWrapper>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}>
        {/* Hero Header */}
        <View style={styles.heroSection}>
          <View style={styles.heroBackground}>
            <View style={styles.heroCircle1} />
            <View style={styles.heroCircle2} />
            <View style={styles.heroCircle3} />
          </View>
          <View style={styles.heroContent}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {(user?.username || 'U').charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.statusDot} />
            </View>
            <View style={styles.greetingContainer}>
              <Text style={styles.greetingText}>{getGreeting()},</Text>
              <Text style={styles.usernameText}>
                {formatUsername(user?.username || 'User')}
              </Text>
            </View>
            <TouchableOpacity style={styles.settingsBtn} onPress={handleSettings}>
              <Text style={styles.settingsIcon}>⚙️</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Cards Row */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, styles.statCardPrimary]}>
            <Text style={styles.statEmoji}>💰</Text>
            <Text style={styles.statValue}>{offer.amount}</Text>
            <Text style={styles.statLabel}>Approved</Text>
          </View>
          <View style={[styles.statCard, styles.statCardSecondary]}>
            <Text style={styles.statEmoji}>📈</Text>
            <Text style={styles.statValueDark}>{offer.rate}</Text>
            <Text style={styles.statLabelDark}>Rate</Text>
          </View>
        </View>

        {/* Main Offer Card */}
        <View style={styles.offerCard}>
          <View style={styles.offerHeader}>
            <View style={styles.offerBadge}>
              <Text style={styles.offerBadgeIcon}>{offer.icon}</Text>
              <Text style={styles.offerBadgeText}>Your Offer</Text>
            </View>
            <View style={styles.liveDot}>
              <View style={styles.liveDotInner} />
              <Text style={styles.liveText}>Live</Text>
            </View>
          </View>
          <Text style={styles.offerTitle}>{offer.title}</Text>
          <Text style={styles.offerDescription}>{offer.details}</Text>
          <TouchableOpacity style={styles.viewOfferBtn} onPress={handleViewOffer}>
            <Text style={styles.viewOfferText}>View Full Details</Text>
            <View style={styles.viewOfferChevron} />
          </TouchableOpacity>
        </View>

        {/* Profile Summary */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Text style={styles.profileIcon}>📋</Text>
            <Text style={styles.profileTitle}>Account Summary</Text>
          </View>
          <View style={styles.profileGrid}>
            <View style={styles.profileItem}>
              <Text style={styles.profileItemIcon}>👤</Text>
              <View style={styles.profileItemContent}>
                <Text style={styles.profileItemLabel}>Username</Text>
                <Text style={styles.profileItemValue}>{user?.username}</Text>
              </View>
            </View>
            <View style={styles.profileItem}>
              <Text style={styles.profileItemIcon}>✉️</Text>
              <View style={styles.profileItemContent}>
                <Text style={styles.profileItemLabel}>Email</Text>
                <Text style={styles.profileItemValue} numberOfLines={1}>
                  {user?.email}
                </Text>
              </View>
            </View>
            <View style={styles.profileItem}>
              <Text style={styles.profileItemIcon}>📱</Text>
              <View style={styles.profileItemContent}>
                <Text style={styles.profileItemLabel}>Phone</Text>
                <Text style={styles.profileItemValue}>{user?.phone}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={[styles.actionTile, {backgroundColor: '#FEF3C7', borderColor: '#FDE68A'}]}
            onPress={handleCompare}
            activeOpacity={0.8}>
            <View style={[styles.actionIconWrap, {backgroundColor: '#FCD34D'}]}>
              <Text style={styles.actionIcon}>📊</Text>
            </View>
            <Text style={styles.actionLabel}>Compare</Text>
            <Text style={styles.actionSub}>View options</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionTile, {backgroundColor: '#DBEAFE', borderColor: '#BFDBFE'}]}
            onPress={handleSupport}
            activeOpacity={0.8}>
            <View style={[styles.actionIconWrap, {backgroundColor: '#60A5FA'}]}>
              <Text style={styles.actionIcon}>💬</Text>
            </View>
            <Text style={styles.actionLabel}>Support</Text>
            <Text style={styles.actionSub}>Get help</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionTile, {backgroundColor: '#F3E8FF', borderColor: '#E9D5FF'}]}
            onPress={handleSettings}
            activeOpacity={0.8}>
            <View style={[styles.actionIconWrap, {backgroundColor: '#A78BFA'}]}>
              <Text style={styles.actionIcon}>⚙️</Text>
            </View>
            <Text style={styles.actionLabel}>Settings</Text>
            <Text style={styles.actionSub}>Manage</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionTile, {backgroundColor: '#ECFDF5', borderColor: '#A7F3D0'}]}
            onPress={handleViewOffer}
            activeOpacity={0.8}>
            <View style={[styles.actionIconWrap, {backgroundColor: '#34D399'}]}>
              <Text style={styles.actionIcon}>🎯</Text>
            </View>
            <Text style={styles.actionLabel}>Offers</Text>
            <Text style={styles.actionSub}>View all</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Section */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutIcon}>🚪</Text>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>Offerly v1.0</Text>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 32,
    backgroundColor: colors.background.primary,
  },
  heroSection: {
    height: 180,
    position: 'relative',
    marginBottom: 20,
  },
  heroBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#059669',
    overflow: 'hidden',
  },
  heroCircle1: {
    position: 'absolute',
    top: -40,
    right: -40,
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
  heroCircle3: {
    position: 'absolute',
    top: 20,
    left: '40%',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#047857',
    opacity: 0.3,
  },
  heroContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#059669',
  },
  statusDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  greetingContainer: {
    flex: 1,
    marginLeft: 16,
  },
  greetingText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  usernameText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 2,
  },
  settingsBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsIcon: {
    fontSize: 20,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: borderRadius.xl,
    padding: 16,
    alignItems: 'center',
  },
  statCardPrimary: {
    backgroundColor: '#059669',
    ...shadows.lg,
  },
  statCardSecondary: {
    backgroundColor: colors.background.card,
    borderWidth: 2,
    borderColor: '#D1FAE5',
  },
  statEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  statValueDark: {
    fontSize: 20,
    fontWeight: '800',
    color: '#059669',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
    marginTop: 2,
  },
  statLabelDark: {
    fontSize: 12,
    color: colors.text.muted,
    fontWeight: '500',
    marginTop: 2,
  },
  offerCard: {
    backgroundColor: colors.background.card,
    marginHorizontal: 20,
    borderRadius: borderRadius.xl,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#D1FAE5',
    ...shadows.md,
  },
  offerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  offerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
  },
  offerBadgeIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  offerBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#059669',
  },
  liveDot: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveDotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
    marginRight: 6,
  },
  liveText: {
    fontSize: 12,
    color: '#22C55E',
    fontWeight: '600',
  },
  offerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 8,
  },
  offerDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  viewOfferBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  viewOfferText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  viewOfferChevron: {
    width: 10,
    height: 10,
    borderRightWidth: 3,
    borderTopWidth: 3,
    borderColor: '#FFFFFF',
    transform: [{rotate: '45deg'}],
    marginLeft: 10,
  },
  profileCard: {
    backgroundColor: colors.background.card,
    marginHorizontal: 20,
    borderRadius: borderRadius.xl,
    padding: 20,
    marginBottom: 24,
    ...shadows.sm,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  profileIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  profileTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  profileGrid: {
    gap: 14,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileItemIcon: {
    fontSize: 20,
    width: 36,
  },
  profileItemContent: {
    flex: 1,
  },
  profileItemLabel: {
    fontSize: 12,
    color: colors.text.muted,
    fontWeight: '500',
  },
  profileItemValue: {
    fontSize: 15,
    color: colors.text.primary,
    fontWeight: '500',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginHorizontal: 20,
    marginBottom: 14,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  actionTile: {
    width: '47%',
    padding: 16,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    ...shadows.sm,
  },
  actionIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionIcon: {
    fontSize: 20,
  },
  actionLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 2,
  },
  actionSub: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    paddingVertical: 14,
    borderRadius: borderRadius.lg,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  logoutIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
  },
  footerText: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.text.muted,
    marginTop: 20,
  },
});
