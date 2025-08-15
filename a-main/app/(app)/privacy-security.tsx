import React, { useState } from 'react';
import { 
  View, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  Text, 
  Switch,
  Alert,
  Modal
} from 'react-native';
import { ScreenHeader, ScreenWrapper } from '@/components';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import { useTheme } from '@/context/ThemeContext';
import { useWindowDimensions } from '@/hooks/useWindowDimensions';
import { H1, H2, H3, Body } from '@/typography';

interface SecurityOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'toggle' | 'navigation' | 'action';
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
}

export default function PrivacySecurityScreen() {
  const { theme } = useTheme();
  const { isTablet } = useWindowDimensions();
  
  const [securityOptions, setSecurityOptions] = useState<SecurityOption[]>([
    {
      id: 'biometric',
      title: 'Biometric Authentication',
      description: 'Use fingerprint or face ID to unlock the app',
      icon: 'finger-print',
      type: 'toggle',
      value: false,
      onToggle: (value) => {
        setSecurityOptions(prev => 
          prev.map(option => 
            option.id === 'biometric' ? { ...option, value } : option
          )
        );
      }
    },
    {
      id: 'app-lock',
      title: 'App Lock',
      description: 'Require PIN or password to access the app',
      icon: 'lock-closed',
      type: 'toggle',
      value: false,
      onToggle: (value) => {
        setSecurityOptions(prev => 
          prev.map(option => 
            option.id === 'app-lock' ? { ...option, value } : option
          )
        );
      }
    },
    {
      id: 'data-encryption',
      title: 'Data Encryption',
      description: 'Encrypt downloaded content for enhanced security',
      icon: 'shield-checkmark',
      type: 'toggle',
      value: true,
      onToggle: (value) => {
        setSecurityOptions(prev => 
          prev.map(option => 
            option.id === 'data-encryption' ? { ...option, value } : option
          )
        );
      }
    },
    {
      id: 'screenshot-protection',
      title: 'Screenshot Protection',
      description: 'Prevent screenshots and screen recording',
      icon: 'eye-off',
      type: 'toggle',
      value: true,
      onToggle: (value) => {
        setSecurityOptions(prev => 
          prev.map(option => 
            option.id === 'screenshot-protection' ? { ...option, value } : option
          )
        );
      }
    },
    {
      id: 'activity-tracking',
      title: 'Activity Tracking',
      description: 'Track reading activity and analytics',
      icon: 'analytics',
      type: 'toggle',
      value: true,
      onToggle: (value) => {
        setSecurityOptions(prev => 
          prev.map(option => 
            option.id === 'activity-tracking' ? { ...option, value } : option
          )
        );
      }
    },
    {
      id: 'data-sharing',
      title: 'Data Sharing',
      description: 'Allow sharing reading data for recommendations',
      icon: 'share-social',
      type: 'toggle',
      value: false,
      onToggle: (value) => {
        setSecurityOptions(prev => 
          prev.map(option => 
            option.id === 'data-sharing' ? { ...option, value } : option
          )
        );
      }
    },
    {
      id: 'location-services',
      title: 'Location Services',
      description: 'Use location for personalized content',
      icon: 'location',
      type: 'toggle',
      value: false,
      onToggle: (value) => {
        setSecurityOptions(prev => 
          prev.map(option => 
            option.id === 'location-services' ? { ...option, value } : option
          )
        );
      }
    },
    {
      id: 'notifications',
      title: 'Push Notifications',
      description: 'Receive notifications for new content',
      icon: 'notifications',
      type: 'toggle',
      value: true,
      onToggle: (value) => {
        setSecurityOptions(prev => 
          prev.map(option => 
            option.id === 'notifications' ? { ...option, value } : option
          )
        );
      }
    }
  ]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to permanently delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            // Implement account deletion logic
            Alert.alert('Account Deleted', 'Your account has been permanently deleted.');
          }
        }
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'Your data will be exported and sent to your email address. This may take a few minutes.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Export', 
          onPress: () => {
            // Implement data export logic
            Alert.alert('Data Export', 'Your data export has been initiated. You will receive an email when it\'s ready.');
          }
        }
      ]
    );
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
      color: theme.colors.textInverse,
      fontSize: isTablet ? theme.typography.fontSize['2xl'] : theme.typography.fontSize.xl,
      fontWeight: theme.typography.fontWeight.bold as any,
      textAlign: 'center',
      marginBottom: theme.spacing.sm,
      textShadowColor: 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 3,
    },
    heroSubtitle: {
      color: theme.colors.textInverse + 'E6',
      fontSize: theme.typography.fontSize.base,
      textAlign: 'center',
      fontWeight: theme.typography.fontWeight.medium as any,
    },
    optionsContainer: {
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
    },
    optionCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      ...theme.shadows.sm,
    },
    optionIcon: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: theme.colors.primary + '20',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    optionInfo: {
      flex: 1,
    },
    optionTitle: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.bold as any,
      marginBottom: theme.spacing.xs,
    },
    optionDescription: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSize.sm,
      lineHeight: theme.typography.lineHeight.relaxed * theme.typography.fontSize.sm,
    },
    actionContainer: {
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
    },
    actionCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      ...theme.shadows.sm,
    },
    actionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    actionItemLast: {
      borderBottomWidth: 0,
    },
    actionInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    actionIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.primary + '20',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    actionText: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.medium as any,
    },
    actionIconRight: {
      color: theme.colors.textSecondary,
    },
    deleteButton: {
      backgroundColor: theme.colors.error,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      alignItems: 'center',
      marginHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
      ...theme.shadows.md,
    },
    deleteButtonText: {
      color: theme.colors.textInverse,
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.medium as any,
    },
    infoSection: {
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
    },
    infoCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      ...theme.shadows.sm,
    },
    infoTitle: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.bold as any,
      marginBottom: theme.spacing.sm,
    },
    infoText: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSize.sm,
      lineHeight: theme.typography.lineHeight.relaxed * theme.typography.fontSize.sm,
      marginBottom: theme.spacing.sm,
    },
  });

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <ScreenHeader title="Privacy & Security" />
        
        <Animated.View entering={FadeInDown.delay(200)} style={styles.header}>
          <View style={styles.content}>
            {/* Hero Section */}
            <View style={styles.heroSection}>
              <LinearGradient
                colors={[theme.colors.primary, theme.colors.primaryDark]}
                style={styles.heroGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="shield-checkmark" size={48} color={theme.colors.textInverse} style={{ marginBottom: theme.spacing.md }} />
                <Text style={styles.heroTitle}>Privacy & Security</Text>
                <Text style={styles.heroSubtitle}>
                  Control your data and protect your privacy
                </Text>
              </LinearGradient>
            </View>

            {/* Security Options */}
            <Animated.View entering={FadeInUp.delay(300)} style={styles.optionsContainer}>
              <View style={styles.sectionHeader}>
                <H2 style={styles.sectionTitle}>Security Settings</H2>
                <Body style={styles.sectionSubtitle}>
                  Configure how your account is protected
                </Body>
              </View>

              {securityOptions.slice(0, 4).map((option) => (
                <View key={option.id} style={styles.optionCard}>
                  <View style={styles.optionIcon}>
                    <Ionicons 
                      name={option.icon as any} 
                      size={24} 
                      color={theme.colors.primary} 
                    />
                  </View>
                  
                  <View style={styles.optionInfo}>
                    <Text style={styles.optionTitle}>{option.title}</Text>
                    <Text style={styles.optionDescription}>{option.description}</Text>
                  </View>
                  
                  {option.type === 'toggle' && (
                    <Switch
                      value={option.value}
                      onValueChange={option.onToggle}
                      trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                      thumbColor={theme.colors.textInverse}
                    />
                  )}
                </View>
              ))}
            </Animated.View>

            {/* Privacy Options */}
            <Animated.View entering={FadeInUp.delay(500)} style={styles.optionsContainer}>
              <View style={styles.sectionHeader}>
                <H2 style={styles.sectionTitle}>Privacy Settings</H2>
                <Body style={styles.sectionSubtitle}>
                  Control how your data is used and shared
                </Body>
              </View>

              {securityOptions.slice(4).map((option) => (
                <View key={option.id} style={styles.optionCard}>
                  <View style={styles.optionIcon}>
                    <Ionicons 
                      name={option.icon as any} 
                      size={24} 
                      color={theme.colors.primary} 
                    />
                  </View>
                  
                  <View style={styles.optionInfo}>
                    <Text style={styles.optionTitle}>{option.title}</Text>
                    <Text style={styles.optionDescription}>{option.description}</Text>
                  </View>
                  
                  {option.type === 'toggle' && (
                    <Switch
                      value={option.value}
                      onValueChange={option.onToggle}
                      trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                      thumbColor={theme.colors.textInverse}
                    />
                  )}
                </View>
              ))}
            </Animated.View>

            {/* Data Management */}
            <Animated.View entering={FadeInUp.delay(700)} style={styles.actionContainer}>
              <View style={styles.sectionHeader}>
                <H2 style={styles.sectionTitle}>Data Management</H2>
                <Body style={styles.sectionSubtitle}>
                  Manage your account data and privacy
                </Body>
              </View>

              <View style={styles.actionCard}>
                <TouchableOpacity
                  style={styles.actionItem}
                  onPress={handleExportData}
                  activeOpacity={0.7}
                >
                  <View style={styles.actionInfo}>
                    <View style={styles.actionIcon}>
                      <Ionicons name="download" size={20} color={theme.colors.primary} />
                    </View>
                    <Text style={styles.actionText}>Export My Data</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} style={styles.actionIconRight} />
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.actionItem}
                  onPress={() => Alert.alert('Coming Soon', 'This feature will be available soon!')}
                  activeOpacity={0.7}
                >
                  <View style={styles.actionInfo}>
                    <View style={styles.actionIcon}>
                      <Ionicons name="eye" size={20} color={theme.colors.primary} />
                    </View>
                    <Text style={styles.actionText}>View My Data</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} style={styles.actionIconRight} />
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.actionItem}
                  onPress={() => Alert.alert('Coming Soon', 'This feature will be available soon!')}
                  activeOpacity={0.7}
                >
                  <View style={styles.actionInfo}>
                    <View style={styles.actionIcon}>
                      <Ionicons name="trash" size={20} color={theme.colors.primary} />
                    </View>
                    <Text style={styles.actionText}>Delete My Data</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} style={styles.actionIconRight} />
                </TouchableOpacity>
              </View>
            </Animated.View>

            {/* Privacy Information */}
            <Animated.View entering={FadeInUp.delay(900)} style={styles.infoSection}>
              <View style={styles.sectionHeader}>
                <H2 style={styles.sectionTitle}>Privacy Information</H2>
                <Body style={styles.sectionSubtitle}>
                  Learn more about how we protect your privacy
                </Body>
              </View>

              <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>Data Protection</Text>
                <Text style={styles.infoText}>
                  We use industry-standard encryption to protect your personal data. 
                  All data is stored securely and we never share your information with third parties 
                  without your explicit consent.
                </Text>
                
                <Text style={styles.infoTitle}>Reading Analytics</Text>
                <Text style={styles.infoText}>
                  We collect anonymous reading analytics to improve our service and provide 
                  personalized recommendations. You can disable this feature in the settings above.
                </Text>
                
                <Text style={styles.infoTitle}>Content Security</Text>
                <Text style={styles.infoText}>
                  Downloaded content is encrypted and protected. Screenshot protection 
                  prevents unauthorized copying of premium content.
                </Text>
              </View>
            </Animated.View>

            {/* Delete Account Button */}
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDeleteAccount}
              activeOpacity={0.8}
            >
              <Text style={styles.deleteButtonText}>Delete Account</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </ScreenWrapper>
  );
} 