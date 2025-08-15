import React, { useState } from 'react';
import { 
  View, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  Text, 
  Linking,
  Alert
} from 'react-native';
import { ScreenHeader, ScreenWrapper } from '@/components';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import { useTheme } from '@/context/ThemeContext';
import { useWindowDimensions } from '@/hooks/useWindowDimensions';
import { H1, H2, H3, Body } from '@/typography';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface SupportOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  action: () => void;
  color: string;
}

export default function HelpSupportScreen() {
  const { theme } = useTheme();
  const { isTablet } = useWindowDimensions();
  
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const faqData: FAQItem[] = [
    {
      id: '1',
      question: 'How do I download magazines for offline reading?',
      answer: 'To download magazines for offline reading, simply tap the download icon next to any magazine. Make sure you have sufficient storage space and a stable internet connection. Downloaded content will be available in your Library tab.',
      category: 'Downloads'
    },
    {
      id: '2',
      question: 'How do I manage my subscription?',
      answer: 'You can manage your subscription by going to Profile > Subscription Plans. Here you can view your current plan, upgrade, downgrade, or cancel your subscription. All changes will take effect at the end of your current billing cycle.',
      category: 'Subscription'
    },
    {
      id: '3',
      question: 'How do I update my profile picture?',
      answer: 'To update your profile picture, go to Profile > Account Settings. You can choose to upload from your gallery, take a new photo, or enter a custom image URL. The image will be automatically uploaded to our secure servers.',
      category: 'Profile'
    },
    {
      id: '4',
      question: 'What file formats are supported?',
      answer: 'EchoReads supports PDF, EPUB, and web-based content. Most magazines are available in PDF format, while articles and digests may be available in multiple formats. The app will automatically choose the best format for your device.',
      category: 'Content'
    },
    {
      id: '5',
      question: 'How do I report inappropriate content?',
      answer: 'If you encounter inappropriate content, you can report it by tapping the three dots menu on any content item and selecting "Report". Our team will review the content within 24 hours and take appropriate action.',
      category: 'Content'
    },
    {
      id: '6',
      question: 'How do I enable parental controls?',
      answer: 'Parental controls are available in the Profile > Privacy & Security section. You can set content restrictions, reading time limits, and monitor your child\'s reading activity. These features are available on premium plans.',
      category: 'Safety'
    }
  ];

  const supportOptions: SupportOption[] = [
    {
      id: 'email',
      title: 'Email Support',
      description: 'Get help via email within 24 hours',
      icon: 'mail-outline',
      color: '#4CAF50',
      action: () => {
        Linking.openURL('mailto:support@echoreads.online?subject=Help Request');
      }
    },
    {
      id: 'chat',
      title: 'Live Chat',
      description: 'Chat with our support team',
      icon: 'chatbubbles-outline',
      color: '#2196F3',
      action: () => {
        Alert.alert(
          'Live Chat',
          'Live chat is available during business hours (9 AM - 6 PM GMT). Would you like to start a chat?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Start Chat', onPress: () => {
              // Implement live chat functionality
              Alert.alert('Coming Soon', 'Live chat feature will be available soon!');
            }}
          ]
        );
      }
    },
    {
      id: 'phone',
      title: 'Phone Support',
      description: 'Call us for immediate assistance',
      icon: 'call-outline',
      color: '#FF9800',
      action: () => {
        Alert.alert(
          'Phone Support',
          'Call us at +1 (555) 123-4567\nAvailable: Mon-Fri 9 AM - 6 PM GMT',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Call Now', onPress: () => {
              Linking.openURL('tel:+15551234567');
            }}
          ]
        );
      }
    },
    {
      id: 'community',
      title: 'Community Forum',
      description: 'Connect with other readers',
      icon: 'people-outline',
      color: '#9C27B0',
      action: () => {
        Linking.openURL('https://community.echoreads.online');
      }
    }
  ];

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.xl,
    },
    content: {
      flex: 1,
      maxWidth: isTablet ? 800 : '100%',
      alignSelf: 'center',
      width: '100%',
    },
    sectionHeader: {
      marginBottom: theme.spacing.lg,
      paddingHorizontal: theme.spacing.lg,
    },
    sectionTitle: {
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
      fontSize: isTablet ? theme.typography.fontSize.xl : theme.typography.fontSize.lg,
    },
    sectionSubtitle: {
      color: theme.colors.textSecondary,
      fontSize: isTablet ? theme.typography.fontSize.base : theme.typography.fontSize.sm,
    },
    heroSection: {
      marginHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
      borderRadius: theme.borderRadius.xl,
      overflow: 'hidden',
      ...theme.shadows.lg,
    },
    heroGradient: {
      padding: theme.spacing.xl,
      alignItems: 'center',
    },
    heroTitle: {
      color: '#FFFFFF',
      fontSize: isTablet ? theme.typography.fontSize['2xl'] : theme.typography.fontSize.xl,
      fontWeight: theme.typography.fontWeight.bold as any,
      textAlign: 'center',
      marginBottom: theme.spacing.sm,
      textShadowColor: 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 3,
    },
    heroSubtitle: {
      color: 'rgba(255, 255, 255, 0.9)',
      fontSize: theme.typography.fontSize.base,
      textAlign: 'center',
      fontWeight: theme.typography.fontWeight.medium as any,
    },
    supportOptionsContainer: {
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
    },
    supportGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: theme.spacing.md,
    },
    supportCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      alignItems: 'center',
      width: isTablet ? '48%' : '100%',
      marginBottom: theme.spacing.md,
      ...theme.shadows.md,
    },
    supportIcon: {
      width: 60,
      height: 60,
      borderRadius: 30,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.md,
    },
    supportTitle: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.bold as any,
      textAlign: 'center',
      marginBottom: theme.spacing.xs,
    },
    supportDescription: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSize.sm,
      textAlign: 'center',
    },
    faqContainer: {
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
    },
    faqItem: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing.md,
      overflow: 'hidden',
      ...theme.shadows.sm,
    },
    faqHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: theme.spacing.lg,
    },
    faqQuestion: {
      flex: 1,
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.medium as any,
      marginRight: theme.spacing.md,
    },
    faqAnswer: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSize.sm,
      lineHeight: theme.typography.lineHeight.relaxed * theme.typography.fontSize.sm,
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.lg,
    },
    categoryBadge: {
      backgroundColor: theme.colors.primary + '20',
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.sm,
      marginBottom: theme.spacing.sm,
      alignSelf: 'flex-start',
    },
    categoryText: {
      color: theme.colors.primary,
      fontSize: theme.typography.fontSize.xs,
      fontWeight: theme.typography.fontWeight.medium as any,
    },
    contactInfoContainer: {
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
    },
    contactCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      ...theme.shadows.sm,
    },
    contactItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    contactIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.primary + '20',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    contactText: {
      flex: 1,
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.base,
    },
  });

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <ScreenHeader title="Help & Support" />
        
        <Animated.View entering={FadeInDown.delay(200)} style={styles.header}>
          <View style={styles.content}>
            {/* Hero Section */}
            <View style={styles.heroSection}>
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.heroGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="help-circle" size={48} color="#FFFFFF" style={{ marginBottom: theme.spacing.md }} />
                <Text style={styles.heroTitle}>How can we help you?</Text>
                <Text style={styles.heroSubtitle}>
                  Get answers to your questions and connect with our support team
                </Text>
              </LinearGradient>
            </View>

            {/* Support Options */}
            <Animated.View entering={FadeInUp.delay(300)} style={styles.supportOptionsContainer}>
              <View style={styles.sectionHeader}>
                <H2 style={styles.sectionTitle}>Get Support</H2>
                <Body style={styles.sectionSubtitle}>
                  Choose the best way to get help with your issue
                </Body>
              </View>

              <View style={styles.supportGrid}>
                {supportOptions.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={styles.supportCard}
                    onPress={option.action}
                    activeOpacity={0.8}
                  >
                    <View style={[
                      styles.supportIcon,
                      { backgroundColor: option.color + '20' }
                    ]}>
                      <Ionicons 
                        name={option.icon as any} 
                        size={28} 
                        color={option.color} 
                      />
                    </View>
                    <Text style={styles.supportTitle}>{option.title}</Text>
                    <Text style={styles.supportDescription}>{option.description}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Animated.View>

            {/* FAQ Section */}
            <Animated.View entering={FadeInUp.delay(500)} style={styles.faqContainer}>
              <View style={styles.sectionHeader}>
                <H2 style={styles.sectionTitle}>Frequently Asked Questions</H2>
                <Body style={styles.sectionSubtitle}>
                  Find quick answers to common questions
                </Body>
              </View>

              {faqData.map((faq) => (
                <View key={faq.id} style={styles.faqItem}>
                  <TouchableOpacity
                    style={styles.faqHeader}
                    onPress={() => toggleFAQ(faq.id)}
                    activeOpacity={0.7}
                  >
                    <View style={{ flex: 1 }}>
                      <View style={styles.categoryBadge}>
                        <Text style={styles.categoryText}>{faq.category}</Text>
                      </View>
                      <Text style={styles.faqQuestion}>{faq.question}</Text>
                    </View>
                    <Ionicons 
                      name={expandedFAQ === faq.id ? "chevron-up" : "chevron-down"} 
                      size={20} 
                      color={theme.colors.textSecondary} 
                    />
                  </TouchableOpacity>
                  
                  {expandedFAQ === faq.id && (
                    <Animated.View entering={FadeInUp.delay(100)}>
                      <Text style={styles.faqAnswer}>{faq.answer}</Text>
                    </Animated.View>
                  )}
                </View>
              ))}
            </Animated.View>

            {/* Contact Information */}
            <Animated.View entering={FadeInUp.delay(700)} style={styles.contactInfoContainer}>
              <View style={styles.sectionHeader}>
                <H2 style={styles.sectionTitle}>Contact Information</H2>
                <Body style={styles.sectionSubtitle}>
                  Reach out to us through any of these channels
                </Body>
              </View>

              <View style={styles.contactCard}>
                <View style={styles.contactItem}>
                  <View style={styles.contactIcon}>
                    <Ionicons name="mail" size={20} color={theme.colors.primary} />
                  </View>
                  <Text style={styles.contactText}>support@echoreads.online</Text>
                </View>
                
                <View style={styles.contactItem}>
                  <View style={styles.contactIcon}>
                    <Ionicons name="call" size={20} color={theme.colors.primary} />
                  </View>
                  <Text style={styles.contactText}>+1 (555) 123-4567</Text>
                </View>
                
                <View style={styles.contactItem}>
                  <View style={styles.contactIcon}>
                    <Ionicons name="time" size={20} color={theme.colors.primary} />
                  </View>
                  <Text style={styles.contactText}>Mon-Fri 9 AM - 6 PM GMT</Text>
                </View>
                
                <View style={styles.contactItem}>
                  <View style={styles.contactIcon}>
                    <Ionicons name="location" size={20} color={theme.colors.primary} />
                  </View>
                  <Text style={styles.contactText}>123 Reading Street, Digital City, DC 12345</Text>
                </View>
              </View>
            </Animated.View>
          </View>
        </Animated.View>
      </ScrollView>
    </ScreenWrapper>
  );
} 