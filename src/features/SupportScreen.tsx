import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {SafeAreaWrapper} from '../shared/ui';
import {colors, shadows, borderRadius} from '../design';
import type {RootStackParamList} from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  icon: string;
}

const faqItems: FAQItem[] = [
  {
    id: '1',
    question: 'How do I apply for an offer?',
    answer:
      'Complete the 3-step wizard with your personal information, income details, and preferences. Once submitted, you\'ll receive a personalized offer instantly.',
    icon: '📝',
  },
  {
    id: '2',
    question: 'Is my information secure?',
    answer:
      'Yes! We use bank-level encryption to protect your data. Your information is never shared with third parties without your explicit consent.',
    icon: '🔒',
  },
  {
    id: '3',
    question: 'How long does approval take?',
    answer:
      'Most offers are approved instantly. In some cases, additional verification may take 1-2 business days.',
    icon: '⏱️',
  },
  {
    id: '4',
    question: 'Can I change my offer type later?',
    answer:
      'You can start a new application at any time by using the "Start Over" option. Each application is evaluated independently.',
    icon: '🔄',
  },
  {
    id: '5',
    question: 'What credit score do I need?',
    answer:
      'We offer products for all credit levels. Your specific offer terms will be based on your credit profile, income, and other factors.',
    icon: '📊',
  },
];

interface ContactOption {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  color: string;
  bgColor: string;
  action: () => void;
}

const FAQAccordion: React.FC<{item: FAQItem; index: number}> = ({item, index}) => {
  const [isOpen, setIsOpen] = useState(false);
  const height = useSharedValue(0);
  const rotation = useSharedValue(0);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    height.value = withTiming(isOpen ? 0 : 1, {duration: 300});
    rotation.value = withTiming(isOpen ? 0 : 180, {duration: 300});
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: height.value,
    maxHeight: height.value * 200,
  }));

  const arrowStyle = useAnimatedStyle(() => ({
    transform: [{rotate: `${rotation.value}deg`}],
  }));

  return (
    <TouchableOpacity
      style={[styles.faqItem, index === faqItems.length - 1 && styles.faqItemLast]}
      onPress={toggleOpen}
      activeOpacity={0.7}>
      <View style={styles.faqHeader}>
        <View style={styles.faqIconWrap}>
          <Text style={styles.faqIcon}>{item.icon}</Text>
        </View>
        <Text style={styles.faqQuestion}>{item.question}</Text>
        <Animated.View style={[styles.faqArrowWrap, arrowStyle]}>
          <View style={styles.faqArrowChevron} />
        </Animated.View>
      </View>
      <Animated.View style={[styles.faqAnswerContainer, animatedStyle]}>
        <Text style={styles.faqAnswer}>{item.answer}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

export const SupportScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleBack = () => {
    navigation.goBack();
  };

  const handleEmail = () => {
    Linking.openURL('mailto:support@offerly.com?subject=Support Request');
  };

  const handleCall = () => {
    Linking.openURL('tel:+18006865251');
  };

  const handleChat = () => {
    Linking.openURL('mailto:support@offerly.com?subject=Chat Support Request');
  };

  const contactOptions: ContactOption[] = [
    {
      id: 'email',
      icon: '✉️',
      title: 'Email Us',
      subtitle: 'support@offerly.com',
      color: '#059669',
      bgColor: '#ECFDF5',
      action: handleEmail,
    },
    {
      id: 'phone',
      icon: '📞',
      title: 'Call Us',
      subtitle: '1-800-UNLOCK-1',
      color: '#2563EB',
      bgColor: '#DBEAFE',
      action: handleCall,
    },
    {
      id: 'chat',
      icon: '💬',
      title: 'Live Chat',
      subtitle: 'Available 24/7',
      color: '#7C3AED',
      bgColor: '#F3E8FF',
      action: handleChat,
    },
  ];

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
              <Text style={styles.heroEmoji}>🎧</Text>
              <Text style={styles.heroTitle}>Help & Support</Text>
              <Text style={styles.heroSubtitle}>
                We're here to help you 24/7
              </Text>
            </View>
          </View>
        </View>

        {/* Contact Options */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>📱</Text>
            <Text style={styles.sectionTitle}>Contact Us</Text>
          </View>
          <View style={styles.contactContainer}>
            {contactOptions.map((option, index) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.contactRow,
                  index < contactOptions.length - 1 && styles.contactRowBorder,
                ]}
                onPress={option.action}
                activeOpacity={0.7}>
                <View style={[styles.contactIconWrap, {backgroundColor: option.bgColor}]}>
                  <Text style={styles.contactIcon}>{option.icon}</Text>
                </View>
                <View style={styles.contactContent}>
                  <Text style={styles.contactTitle}>{option.title}</Text>
                  <Text style={styles.contactSubtitle}>{option.subtitle}</Text>
                </View>
                <View style={[styles.contactArrow, {backgroundColor: option.bgColor}]}>
                  <View style={[styles.contactArrowChevron, {borderColor: option.color}]} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>❓</Text>
            <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          </View>
          <View style={styles.faqContainer}>
            {faqItems.map((item, index) => (
              <FAQAccordion key={item.id} item={item} index={index} />
            ))}
          </View>
        </View>

        {/* Help Card */}
        <View style={styles.helpCard}>
          <View style={styles.helpIconWrap}>
            <Text style={styles.helpIcon}>🤝</Text>
          </View>
          <View style={styles.helpContent}>
            <Text style={styles.helpTitle}>Still need help?</Text>
            <Text style={styles.helpText}>
              Our support team is available around the clock to assist you.
            </Text>
          </View>
          <TouchableOpacity style={styles.helpButton} onPress={handleEmail}>
            <Text style={styles.helpButtonText}>Get in Touch</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Response time: Under 24 hours</Text>
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
    height: 200,
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
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
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
  contactContainer: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    ...shadows.md,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  contactRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
  },
  contactIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  contactIcon: {
    fontSize: 22,
  },
  contactContent: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 2,
  },
  contactSubtitle: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  contactArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactArrowChevron: {
    width: 8,
    height: 8,
    borderRightWidth: 2,
    borderTopWidth: 2,
    transform: [{rotate: '45deg'}],
    marginLeft: -2,
  },
  faqContainer: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.md,
  },
  faqItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
  },
  faqItemLast: {
    borderBottomWidth: 0,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  faqIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  faqIcon: {
    fontSize: 18,
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    flex: 1,
    paddingRight: 8,
  },
  faqArrowWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  faqArrowChevron: {
    width: 8,
    height: 8,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: colors.text.muted,
    transform: [{rotate: '45deg'}],
    marginTop: -2,
  },
  faqAnswerContainer: {
    overflow: 'hidden',
  },
  faqAnswer: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 22,
    marginTop: 12,
    marginLeft: 48,
  },
  helpCard: {
    marginHorizontal: 20,
    backgroundColor: '#ECFDF5',
    borderRadius: borderRadius.xl,
    padding: 20,
    borderWidth: 1,
    borderColor: '#D1FAE5',
    marginBottom: 16,
  },
  helpIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 16,
    ...shadows.md,
  },
  helpIcon: {
    fontSize: 28,
  },
  helpContent: {
    alignItems: 'center',
    marginBottom: 16,
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 6,
  },
  helpText: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  helpButton: {
    backgroundColor: '#059669',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: borderRadius.lg,
    alignSelf: 'center',
  },
  helpButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  footerText: {
    fontSize: 13,
    color: colors.text.muted,
  },
});
