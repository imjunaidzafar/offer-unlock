import React, {useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
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

export const ResultScreen: React.FC = () => {
  const wizardData = useWizardStore((state) => state.data);
  const user = useAuthStore((state) => state.user);
  const resetWizard = useWizardStore((state) => state.resetWizard);
  const logout = useAuthStore((state) => state.logout);

  // Animation values
  const checkmarkScale = useSharedValue(0);
  const cardOpacity = useSharedValue(0);
  const cardTranslateY = useSharedValue(30);

  useEffect(() => {
    // Checkmark animation
    checkmarkScale.value = withSequence(
      withSpring(1.2, {damping: 8, stiffness: 200}),
      withSpring(1, {damping: 12, stiffness: 150}),
    );

    // Card animation
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

  const getOfferDetails = () => {
    const offerType = wizardData.step3.offerType;
    switch (offerType) {
      case 'loan':
        return {
          title: 'Personal Loan',
          amount: '$15,000',
          rate: '6.99% APR',
          term: '36 months',
        };
      case 'credit-card':
        return {
          title: 'Premium Credit Card',
          amount: '$10,000 limit',
          rate: '0% intro APR',
          term: '18 months',
        };
      case 'insurance':
        return {
          title: 'Life Insurance',
          amount: '$500,000 coverage',
          rate: '$45/month',
          term: '20 year term',
        };
      default:
        return {
          title: 'Special Offer',
          amount: '$10,000',
          rate: 'Competitive rates',
          term: 'Flexible terms',
        };
    }
  };

  const offer = getOfferDetails();

  const handleStartOver = () => {
    resetWizard();
    logout();
  };

  return (
    <SafeAreaWrapper backgroundColor="#4F46E5">
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Animated.View style={[styles.checkmarkContainer, checkmarkStyle]}>
            <Text style={styles.checkmark}>✓</Text>
          </Animated.View>
          <Text style={styles.congratsTitle}>Congratulations!</Text>
          <Text style={styles.congratsSubtitle}>
            {wizardData.step1.firstName || user?.username || 'You'}'ve unlocked an exclusive offer
          </Text>
        </View>

        <Animated.View style={[styles.offerCard, cardStyle]}>
          <View style={styles.offerBadge}>
            <Text style={styles.offerBadgeText}>EXCLUSIVE</Text>
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

          <View style={styles.offerActions}>
            <Button
              title="Accept Offer"
              onPress={() => {}}
              style={styles.acceptButton}
            />
            <Button
              title="View Details"
              onPress={() => {}}
              variant="outline"
              style={styles.detailsButton}
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
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  checkmark: {
    fontSize: 40,
    color: '#4F46E5',
    fontWeight: '700',
  },
  congratsTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  congratsSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  offerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
  },
  offerBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 16,
  },
  offerBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#D97706',
  },
  offerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 20,
  },
  offerDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  offerDetailItem: {
    flex: 1,
    alignItems: 'center',
  },
  offerDetailLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  offerDetailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  offerDetailDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
  },
  offerActions: {
    gap: 12,
  },
  acceptButton: {
    backgroundColor: '#10B981',
  },
  detailsButton: {
    borderColor: '#D1D5DB',
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
  },
  startOverButton: {
    borderColor: 'rgba(255, 255, 255, 0.5)',
    backgroundColor: 'transparent',
  },
  startOverText: {
    color: '#FFFFFF',
  },
});
