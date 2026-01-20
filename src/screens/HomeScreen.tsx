import React from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {SafeAreaWrapper, Button} from '../components/ui';
import {useAuthStore} from '../store/useAuthStore';
import {useWizardStore, useWizardData} from '../store/useWizardStore';
import {colors, shadows, borderRadius} from '../theme';
import type {RootStackParamList} from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const wizardData = useWizardStore(state => state.data);

  const handleLogout = () => {
    // Only logout, don't reset wizard data
    // User can log back in and go directly to Home
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

  const getOfferDetails = () => {
    const offerType = wizardData.step3.offerType;
    switch (offerType) {
      case 'loan':
        return {
          title: 'Personal Loan',
          amount: '$15,000',
          rate: '5.9% APR',
          icon: '💰',
        };
      case 'credit-card':
        return {
          title: 'Premium Credit Card',
          amount: '$10,000 Limit',
          rate: '0% Intro APR',
          icon: '💳',
        };
      case 'insurance':
        return {
          title: 'Life Insurance',
          amount: '$500,000 Coverage',
          rate: '$29/month',
          icon: '🛡️',
        };
      default:
        return {
          title: 'Special Offer',
          amount: 'Exclusive Deal',
          rate: 'Limited Time',
          icon: '🎁',
        };
    }
  };

  const offer = getOfferDetails();

  return (
    <SafeAreaWrapper>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerGradient}>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.username}>{user?.username || 'User'}</Text>
          </View>
        </View>

        {/* Profile Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>👤</Text>
            </View>
            <Text style={styles.cardTitle}>Your Profile</Text>
          </View>
          <View style={styles.profileInfo}>
            <View style={styles.profileRow}>
              <Text style={styles.label}>Username</Text>
              <Text style={styles.value}>{user?.username}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.profileRow}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{user?.email}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.profileRow}>
              <Text style={styles.label}>Phone</Text>
              <Text style={styles.value}>{user?.phone}</Text>
            </View>
          </View>
        </View>

        {/* Offer Card */}
        <View style={[styles.card, styles.offerCard]}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconContainer, styles.offerIconContainer]}>
              <Text style={styles.icon}>{offer.icon}</Text>
            </View>
            <Text style={styles.cardTitle}>Your Offer</Text>
          </View>
          <View style={styles.offerDetails}>
            <Text style={styles.offerTitle}>{offer.title}</Text>
            <Text style={styles.offerAmount}>{offer.amount}</Text>
            <View style={styles.offerBadge}>
              <Text style={styles.offerBadgeText}>{offer.rate}</Text>
            </View>
          </View>
          <Button
            title="View Offer Details"
            onPress={handleViewOffer}
            style={styles.viewOfferButton}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={handleCompare}
              activeOpacity={0.7}>
              <Text style={styles.actionIcon}>📊</Text>
              <Text style={styles.actionText}>Compare</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={handleSupport}
              activeOpacity={0.7}>
              <Text style={styles.actionIcon}>📞</Text>
              <Text style={styles.actionText}>Support</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={handleSettings}
              activeOpacity={0.7}>
              <Text style={styles.actionIcon}>⚙️</Text>
              <Text style={styles.actionText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Button */}
        <View style={styles.footer}>
          <Button title="Logout" onPress={handleLogout} variant="outline" />
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerGradient: {
    backgroundColor: colors.gradient.start,
    borderRadius: borderRadius.xl,
    padding: 24,
    ...shadows.lg,
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  username: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.inverse,
  },
  card: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    marginHorizontal: 24,
    marginBottom: 16,
    padding: 20,
    ...shadows.md,
  },
  offerCard: {
    borderWidth: 2,
    borderColor: colors.accent.primary,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  offerIconContainer: {
    backgroundColor: '#EDE9FE',
  },
  icon: {
    fontSize: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  profileInfo: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    padding: 16,
  },
  profileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border.default,
  },
  label: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  value: {
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: '500',
  },
  offerDetails: {
    alignItems: 'center',
    marginBottom: 20,
  },
  offerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  offerAmount: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.accent.primary,
    marginBottom: 12,
  },
  offerBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
  },
  offerBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.success,
  },
  viewOfferButton: {
    marginTop: 8,
  },
  actionsSection: {
    paddingHorizontal: 24,
    marginTop: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionCard: {
    flex: 1,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    ...shadows.sm,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  footer: {
    paddingHorizontal: 24,
    marginTop: 'auto',
    paddingTop: 16,
  },
});
