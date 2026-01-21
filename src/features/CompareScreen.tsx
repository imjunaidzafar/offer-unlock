import React, {useState, useMemo} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {SafeAreaWrapper} from '../shared/ui';
import {useOnboardingStore} from '../state/useOnboardingStore';
import {
  calculateAllOffers,
  formatCurrency,
  formatCurrencyDecimal,
} from '../lib/quoteEngine';
import {colors, shadows, borderRadius} from '../design';
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
  bgColor: string;
}

export const CompareScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedOffer, setSelectedOffer] = useState<string | null>(null);
  const wizardData = useOnboardingStore(state => state.data);

  const calculatedOffers = useMemo(
    () => calculateAllOffers(wizardData.step2),
    [wizardData.step2],
  );

  const offerOptions: OfferOption[] = useMemo(() => {
    const {loan, creditCard, insurance} = calculatedOffers;

    return [
      {
        id: 'loan',
        title: 'Personal Loan',
        icon: '💰',
        tagline: 'Flexible funds for any purpose',
        features: [
          `${formatCurrencyDecimal(loan.monthlyPayment)}/month payment`,
          'No collateral required',
          'Quick approval process',
          'Use for any purpose',
        ],
        rate: `${loan.apr}% APR`,
        amount: formatCurrency(loan.approvedAmount),
        term: `${loan.term} months`,
        highlight: 'Best for large purchases',
        color: '#059669',
        bgColor: '#ECFDF5',
      },
      {
        id: 'credit-card',
        title: 'Credit Card',
        icon: '💳',
        tagline: 'Rewards on every purchase',
        features: [
          creditCard.introPeriod > 0
            ? `0% intro APR for ${creditCard.introPeriod} months`
            : `${creditCard.regularApr}% APR`,
          `${creditCard.cashBack}% cash back on purchases`,
          'No annual fee',
          'Build credit history',
        ],
        rate: creditCard.introPeriod > 0
          ? `0% intro, then ${creditCard.regularApr}%`
          : `${creditCard.regularApr}% APR`,
        amount: `${formatCurrency(creditCard.creditLimit)} limit`,
        term: 'Revolving credit',
        highlight: 'Best for everyday spending',
        color: '#7C3AED',
        bgColor: '#F3E8FF',
      },
      {
        id: 'insurance',
        title: 'Life Insurance',
        icon: '🛡️',
        tagline: 'Protect what matters most',
        features: [
          `${formatCurrencyDecimal(insurance.monthlyPremium)}/month premium`,
          'Guaranteed acceptance',
          'Lock in low rates',
          'Tax-free death benefit',
        ],
        rate: `${formatCurrencyDecimal(insurance.monthlyPremium)}/month`,
        amount: `${formatCurrency(insurance.coverageAmount)} coverage`,
        term: `${insurance.termYears} year term`,
        highlight: 'Best for family protection',
        color: '#EA580C',
        bgColor: '#FFF7ED',
      },
    ];
  }, [calculatedOffers]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSelectOffer = (offerId: string) => {
    setSelectedOffer(offerId === selectedOffer ? null : offerId);
  };

  const handleApply = () => {
    navigation.goBack();
  };

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
            <View style={styles.heroText}>
              <Text style={styles.heroEmoji}>📊</Text>
              <Text style={styles.heroTitle}>Compare Offers</Text>
              <Text style={styles.heroSubtitle}>
                Find the perfect product for your needs
              </Text>
            </View>
          </View>
        </View>

        {/* Selection Badge */}
        <View style={styles.selectionBadge}>
          <Text style={styles.selectionIcon}>💡</Text>
          <Text style={styles.selectionText}>
            {selectedOffer ? 'Tap again to deselect' : 'Tap a card to select'}
          </Text>
        </View>

        {/* Offer Cards */}
        <View style={styles.cardsContainer}>
          {offerOptions.map((offer) => {
            const isSelected = selectedOffer === offer.id;
            return (
              <TouchableOpacity
                key={offer.id}
                style={[
                  styles.offerCard,
                  isSelected && styles.offerCardSelected,
                  isSelected && {borderColor: offer.color},
                ]}
                onPress={() => handleSelectOffer(offer.id)}
                activeOpacity={0.8}>
                {/* Card Header */}
                <View style={styles.cardHeader}>
                  <View style={[styles.iconContainer, {backgroundColor: offer.bgColor}]}>
                    <Text style={styles.icon}>{offer.icon}</Text>
                  </View>
                  <View style={styles.cardHeaderText}>
                    <Text style={styles.offerTitle}>{offer.title}</Text>
                    <Text style={styles.offerTagline}>{offer.tagline}</Text>
                  </View>
                  {isSelected && (
                    <View style={[styles.selectedCheck, {backgroundColor: offer.color}]}>
                      <Text style={styles.checkIcon}>✓</Text>
                    </View>
                  )}
                </View>

                {/* Stats Row */}
                <View style={[styles.statsRow, {backgroundColor: offer.bgColor}]}>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Rate</Text>
                    <Text style={[styles.statValue, {color: offer.color}]}>{offer.rate}</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Amount</Text>
                    <Text style={styles.statValue}>{offer.amount}</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Term</Text>
                    <Text style={styles.statValue}>{offer.term}</Text>
                  </View>
                </View>

                {/* Features */}
                <View style={styles.featuresContainer}>
                  {offer.features.map((feature, index) => (
                    <View key={index} style={styles.featureRow}>
                      <View style={[styles.featureDot, {backgroundColor: offer.color}]} />
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                </View>

                {/* Highlight Badge */}
                <View style={[styles.highlightBadge, {backgroundColor: offer.bgColor}]}>
                  <Text style={styles.highlightIcon}>⭐</Text>
                  <Text style={[styles.highlightText, {color: offer.color}]}>
                    {offer.highlight}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Apply Button */}
        {selectedOffer && (
          <View style={styles.footer}>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyButtonText}>Apply for Selected Offer</Text>
              <View style={styles.applyArrowChevron} />
            </TouchableOpacity>
          </View>
        )}
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
    height: 200,
    position: 'relative',
    marginBottom: 16,
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
    marginBottom: 16,
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
  heroText: {
    alignItems: 'center',
  },
  heroEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
  },
  selectionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF3C7',
    marginHorizontal: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: borderRadius.full,
    marginBottom: 20,
  },
  selectionIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  selectionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#92400E',
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
    borderColor: '#E5E7EB',
    ...shadows.md,
  },
  offerCardSelected: {
    borderWidth: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 26,
  },
  cardHeaderText: {
    flex: 1,
    marginLeft: 14,
  },
  offerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 2,
  },
  offerTagline: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  selectedCheck: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIcon: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '700',
    includeFontPadding: false,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    borderRadius: borderRadius.lg,
    padding: 14,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: colors.text.muted,
    fontWeight: '500',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text.primary,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  featuresContainer: {
    marginBottom: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 12,
  },
  featureText: {
    fontSize: 14,
    color: colors.text.primary,
    flex: 1,
  },
  highlightBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: borderRadius.full,
  },
  highlightIcon: {
    fontSize: 12,
    marginRight: 6,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    paddingVertical: 16,
    borderRadius: borderRadius.xl,
    ...shadows.lg,
  },
  applyButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  applyArrowChevron: {
    width: 10,
    height: 10,
    borderRightWidth: 3,
    borderTopWidth: 3,
    borderColor: '#FFFFFF',
    transform: [{rotate: '45deg'}],
    marginLeft: 10,
  },
});
