import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {SafeAreaWrapper, Button} from '../components/ui';
import {colors, shadows, borderRadius} from '../theme';
import type {RootStackParamList} from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface OfferOption {
  id: string;
  title: string;
  icon: string;
  tagline: string;
  features: string[];
  rate: string;
  amount: string;
  term: string;
  highlight: string;
  color: string;
}

const offerOptions: OfferOption[] = [
  {
    id: 'loan',
    title: 'Personal Loan',
    icon: '💰',
    tagline: 'Flexible funds for any purpose',
    features: [
      'Fixed monthly payments',
      'No collateral required',
      'Quick approval process',
      'Use for any purpose',
    ],
    rate: '5.9% - 12.9% APR',
    amount: 'Up to $50,000',
    term: '12 - 60 months',
    highlight: 'Best for large purchases',
    color: '#10B981',
  },
  {
    id: 'credit-card',
    title: 'Credit Card',
    icon: '💳',
    tagline: 'Rewards on every purchase',
    features: [
      '0% intro APR for 18 months',
      'Cash back on purchases',
      'No annual fee',
      'Build credit history',
    ],
    rate: '0% intro, then 14.9%',
    amount: 'Up to $10,000 limit',
    term: 'Revolving credit',
    highlight: 'Best for everyday spending',
    color: '#7C3AED',
  },
  {
    id: 'insurance',
    title: 'Life Insurance',
    icon: '🛡️',
    tagline: 'Protect what matters most',
    features: [
      'Term & whole life options',
      'Guaranteed acceptance',
      'Lock in low rates',
      'Tax-free death benefit',
    ],
    rate: 'From $19/month',
    amount: 'Up to $1,000,000',
    term: '10 - 30 year terms',
    highlight: 'Best for family protection',
    color: '#F59E0B',
  },
];

export const CompareScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedOffer, setSelectedOffer] = useState<string | null>(null);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSelectOffer = (offerId: string) => {
    setSelectedOffer(offerId);
  };

  const handleApply = () => {
    // Navigate back to home - in a real app, this would start an application
    navigation.goBack();
  };

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
            <Text style={styles.title}>Compare Offers</Text>
            <Text style={styles.subtitle}>
              Find the perfect financial product for your needs
            </Text>
          </View>
        </View>

        {/* Offer Cards */}
        <View style={styles.cardsContainer}>
          {offerOptions.map((offer) => (
            <TouchableOpacity
              key={offer.id}
              style={[
                styles.offerCard,
                selectedOffer === offer.id && styles.offerCardSelected,
                selectedOffer === offer.id && {borderColor: offer.color},
              ]}
              onPress={() => handleSelectOffer(offer.id)}
              activeOpacity={0.7}>
              {/* Card Header */}
              <View style={styles.cardHeader}>
                <View style={[styles.iconContainer, {backgroundColor: `${offer.color}15`}]}>
                  <Text style={styles.icon}>{offer.icon}</Text>
                </View>
                {selectedOffer === offer.id && (
                  <View style={[styles.selectedBadge, {backgroundColor: offer.color}]}>
                    <Text style={styles.selectedBadgeText}>Selected</Text>
                  </View>
                )}
              </View>

              <Text style={styles.offerTitle}>{offer.title}</Text>
              <Text style={styles.offerTagline}>{offer.tagline}</Text>

              {/* Stats */}
              <View style={styles.statsContainer}>
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>Rate</Text>
                  <Text style={[styles.statValue, {color: offer.color}]}>{offer.rate}</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>Amount</Text>
                  <Text style={styles.statValue}>{offer.amount}</Text>
                </View>
              </View>

              {/* Features */}
              <View style={styles.featuresContainer}>
                {offer.features.map((feature, index) => (
                  <View key={index} style={styles.featureRow}>
                    <Text style={[styles.checkmark, {color: offer.color}]}>✓</Text>
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>

              {/* Highlight */}
              <View style={[styles.highlightBadge, {backgroundColor: `${offer.color}15`}]}>
                <Text style={[styles.highlightText, {color: offer.color}]}>
                  {offer.highlight}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Apply Button */}
        {selectedOffer && (
          <View style={styles.footer}>
            <Button
              title="Apply for Selected Offer"
              onPress={handleApply}
              style={styles.applyButton}
            />
          </View>
        )}
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
  cardsContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  offerCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    padding: 20,
    borderWidth: 2,
    borderColor: 'transparent',
    ...shadows.md,
  },
  offerCardSelected: {
    borderWidth: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 24,
  },
  selectedBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
  },
  selectedBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.inverse,
  },
  offerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  offerTagline: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    padding: 12,
    marginBottom: 16,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text.primary,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border.default,
    marginHorizontal: 8,
  },
  featuresContainer: {
    marginBottom: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkmark: {
    fontSize: 16,
    fontWeight: '700',
    marginRight: 10,
  },
  featureText: {
    fontSize: 14,
    color: colors.text.primary,
    flex: 1,
  },
  highlightBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
  },
  highlightText: {
    fontSize: 12,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  applyButton: {
    backgroundColor: colors.accent.primary,
  },
});
