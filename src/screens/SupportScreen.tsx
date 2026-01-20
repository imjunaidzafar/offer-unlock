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
import {SafeAreaWrapper} from '../components/ui';
import {colors, shadows, borderRadius} from '../theme';
import type {RootStackParamList} from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    id: '1',
    question: 'How do I apply for an offer?',
    answer:
      'Complete the 3-step wizard with your personal information, income details, and preferences. Once submitted, you\'ll receive a personalized offer instantly.',
  },
  {
    id: '2',
    question: 'Is my information secure?',
    answer:
      'Yes! We use bank-level encryption to protect your data. Your information is never shared with third parties without your explicit consent.',
  },
  {
    id: '3',
    question: 'How long does approval take?',
    answer:
      'Most offers are approved instantly. In some cases, additional verification may take 1-2 business days.',
  },
  {
    id: '4',
    question: 'Can I change my offer type later?',
    answer:
      'You can start a new application at any time by using the "Start Over" option. Each application is evaluated independently.',
  },
  {
    id: '5',
    question: 'What credit score do I need?',
    answer:
      'We offer products for all credit levels. Your specific offer terms will be based on your credit profile, income, and other factors.',
  },
  {
    id: '6',
    question: 'How do I contact support?',
    answer:
      'You can reach us via email at support@offerunlock.com, call us at 1-800-UNLOCK-1, or use the contact options below.',
  },
];

interface ContactOption {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  action: () => void;
}

const FAQAccordion: React.FC<{item: FAQItem}> = ({item}) => {
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
      style={styles.faqItem}
      onPress={toggleOpen}
      activeOpacity={0.7}>
      <View style={styles.faqHeader}>
        <Text style={styles.faqQuestion}>{item.question}</Text>
        <Animated.Text style={[styles.faqArrow, arrowStyle]}>▼</Animated.Text>
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
    Linking.openURL('mailto:support@offerunlock.com?subject=Support Request');
  };

  const handleCall = () => {
    Linking.openURL('tel:+18006865251');
  };

  const handleChat = () => {
    // In a real app, this would open a chat interface
    Linking.openURL('mailto:support@offerunlock.com?subject=Chat Support Request');
  };

  const contactOptions: ContactOption[] = [
    {
      id: 'email',
      icon: '✉️',
      title: 'Email Us',
      subtitle: 'support@offerunlock.com',
      action: handleEmail,
    },
    {
      id: 'phone',
      icon: '📞',
      title: 'Call Us',
      subtitle: '1-800-UNLOCK-1',
      action: handleCall,
    },
    {
      id: 'chat',
      icon: '💬',
      title: 'Live Chat',
      subtitle: 'Available 24/7',
      action: handleChat,
    },
  ];

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
            <Text style={styles.title}>Help & Support</Text>
            <Text style={styles.subtitle}>
              We're here to help you 24/7
            </Text>
          </View>
        </View>

        {/* Contact Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <View style={styles.contactGrid}>
            {contactOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.contactCard}
                onPress={option.action}
                activeOpacity={0.7}>
                <Text style={styles.contactIcon}>{option.icon}</Text>
                <Text style={styles.contactTitle}>{option.title}</Text>
                <Text style={styles.contactSubtitle}>{option.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          <View style={styles.faqContainer}>
            {faqItems.map((item) => (
              <FAQAccordion key={item.id} item={item} />
            ))}
          </View>
        </View>

        {/* Help Card */}
        <View style={styles.helpCard}>
          <Text style={styles.helpIcon}>🤝</Text>
          <View style={styles.helpContent}>
            <Text style={styles.helpTitle}>Still need help?</Text>
            <Text style={styles.helpText}>
              Our support team is available around the clock to assist you with any questions.
            </Text>
          </View>
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
    marginBottom: 16,
  },
  contactGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  contactCard: {
    flex: 1,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: 16,
    alignItems: 'center',
    ...shadows.sm,
  },
  contactIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  contactTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  contactSubtitle: {
    fontSize: 11,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  faqContainer: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.sm,
  },
  faqItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
    flex: 1,
    paddingRight: 12,
  },
  faqArrow: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  faqAnswerContainer: {
    overflow: 'hidden',
  },
  faqAnswer: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 22,
    marginTop: 12,
  },
  helpCard: {
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDE9FE',
    borderRadius: borderRadius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },
  helpIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  helpContent: {
    flex: 1,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.accent.primary,
    marginBottom: 4,
  },
  helpText: {
    fontSize: 13,
    color: '#6D28D9',
    lineHeight: 20,
  },
});
