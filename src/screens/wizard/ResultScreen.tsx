import React, {useEffect, useMemo} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withDelay,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import {SafeAreaWrapper, Button} from '../../components/ui';
import {useWizardStore} from '../../store/useWizardStore';
import {useAuthStore} from '../../store/useAuthStore';
import {
  calculateOffer,
  getOfferSummary,
  formatCurrency,
  formatCurrencyDecimal,
  type CalculatedOffer,
} from '../../utils/offerCalculator';
import {colors, shadows, borderRadius} from '../../theme';
import type {RootStackParamList} from '../../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const ResultScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const wizardData = useWizardStore(state => state.data);
  const user = useAuthStore(state => state.user);
  const resetWizard = useWizardStore(state => state.resetWizard);
  const logout = useAuthStore(state => state.logout);

  const checkmarkScale = useSharedValue(0);
  const cardOpacity = useSharedValue(0);
  const cardTranslateY = useSharedValue(30);

  useEffect(() => {
    checkmarkScale.value = withSequence(
      withSpring(1.2, {damping: 8, stiffness: 200}),
      withSpring(1, {damping: 12, stiffness: 150}),
    );

    cardOpacity.value = withDelay(
      300,
      withTiming(1, {duration: 400, easing: Easing.out(Easing.ease)}),
    );
    cardTranslateY.value = withDelay(
      300,
      withSpring(0, {damping: 15, stiffness: 100}),
    );
  }, [checkmarkScale, cardOpacity, cardTranslateY]);

  const checkmarkStyle = useAnimatedStyle(() => ({
    transform: [{scale: checkmarkScale.value}],
  }));

  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{translateY: cardTranslateY.value}],
  }));

  const calculatedOffer = useMemo(
    () => calculateOffer(wizardData.step2, wizardData.step3),
    [wizardData.step2, wizardData.step3],
  );

  const offer = useMemo(() => {
    const summary = getOfferSummary(calculatedOffer);

    switch (calculatedOffer.type) {
      case 'loan':
        return {
          ...summary,
          term: `${calculatedOffer.term} months`,
          monthlyPayment: formatCurrencyDecimal(calculatedOffer.monthlyPayment),
        };
      case 'credit-card':
        return {
          ...summary,
          term: calculatedOffer.introPeriod > 0
            ? `${calculatedOffer.introPeriod} mo intro`
            : 'No intro period',
          cashBack: `${calculatedOffer.cashBack}% cash back`,
        };
      case 'insurance':
        return {
          ...summary,
          term: `${calculatedOffer.termYears} year term`,
          monthlyPremium: formatCurrencyDecimal(calculatedOffer.monthlyPremium),
        };
    }
  }, [calculatedOffer]);

  const handleGoToDashboard = () => {
    navigation.reset({
      index: 0,
      routes: [{name: 'Home'}],
    });
  };

  const handleStartOver = () => {
    resetWizard();
    logout();
    navigation.reset({
      index: 0,
      routes: [{name: 'Auth'}],
    });
  };

  return (
    <SafeAreaWrapper backgroundColor={colors.accent.primary}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Animated.View style={[styles.checkmarkContainer, checkmarkStyle]}>
            <Text style={styles.checkmark}>✓</Text>
          </Animated.View>
          <Text style={styles.congratsTitle}>Congratulations!</Text>
          <Text style={styles.congratsSubtitle}>
            {wizardData.step1.firstName || user?.username || 'You'}'ve unlocked
            an exclusive offer
          </Text>
        </View>

        <Animated.View style={[styles.offerCard, cardStyle]}>
          <View style={styles.offerHeader}>
            <View style={styles.offerIconContainer}>
              <Text style={styles.offerIcon}>{offer.icon}</Text>
            </View>
            <View style={styles.offerBadge}>
              <Text style={styles.offerBadgeText}>EXCLUSIVE</Text>
            </View>
          </View>

          <Text style={styles.offerTitle}>{offer.title}</Text>

          <View style={styles.offerDetails}>
            <View style={styles.offerDetailItem}>
              <Text style={styles.offerDetailLabel}>Amount</Text>
              <Text style={styles.offerDetailValue}>{offer.amount}</Text>
            </View>
            <View style={styles.offerDetailDivider} />
            <View style={styles.offerDetailItem}>
              <Text style={styles.offerDetailLabel}>Rate</Text>
              <Text style={styles.offerDetailValue}>{offer.rate}</Text>
            </View>
            <View style={styles.offerDetailDivider} />
            <View style={styles.offerDetailItem}>
              <Text style={styles.offerDetailLabel}>Term</Text>
              <Text style={styles.offerDetailValue}>{offer.term}</Text>
            </View>
          </View>

          {/* Additional Details */}
          <View style={styles.additionalInfo}>
            <Text style={styles.additionalInfoText}>{offer.details}</Text>
          </View>

          <View style={styles.offerActions}>
            <Button
              title="Accept Offer"
              onPress={handleGoToDashboard}
              style={styles.acceptButton}
            />
            <Button
              title="Go to Dashboard"
              onPress={handleGoToDashboard}
              variant="outline"
              style={styles.dashboardButton}
            />
          </View>
        </Animated.View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            This offer was personalized based on your profile and preferences.
          </Text>
          <Button
            title="Start Over"
            onPress={handleStartOver}
            variant="outline"
            textStyle={styles.startOverText}
            style={styles.startOverButton}
          />
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 32,
  },
  checkmarkContainer: {
    width: 88,
    height: 88,
    borderRadius: 28,
    backgroundColor: colors.background.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    ...shadows.lg,
  },
  checkmark: {
    fontSize: 44,
    color: colors.accent.primary,
    fontWeight: '700',
  },
  congratsTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text.inverse,
    marginBottom: 8,
    textAlign: 'center',
  },
  congratsSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
  },
  offerCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    padding: 24,
    marginBottom: 24,
    ...shadows.lg,
  },
  offerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  offerIconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  offerIcon: {
    fontSize: 24,
  },
  offerBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
  },
  offerBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D97706',
    letterSpacing: 0.5,
  },
  offerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 20,
  },
  offerDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    padding: 16,
    marginBottom: 24,
  },
  offerDetailItem: {
    flex: 1,
    alignItems: 'center',
  },
  offerDetailLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  offerDetailValue: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text.primary,
  },
  offerDetailDivider: {
    width: 1,
    backgroundColor: colors.border.default,
  },
  additionalInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  additionalInfoText: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  offerActions: {
    gap: 12,
  },
  acceptButton: {
    backgroundColor: colors.success,
  },
  dashboardButton: {
    borderColor: colors.border.default,
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 24,
  },
  footerText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  startOverButton: {
    borderColor: 'rgba(255, 255, 255, 0.4)',
    backgroundColor: 'transparent',
  },
  startOverText: {
    color: colors.text.inverse,
  },
});
