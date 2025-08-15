import React from 'react';
import { 
  View, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  Text, 
  Linking,
  Image
} from 'react-native';
import { ScreenHeader, ScreenWrapper } from '@/components';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import { useTheme } from '@/context/ThemeContext';
import { useWindowDimensions } from '@/hooks/useWindowDimensions';
import { H1, H2, H3, Body } from '@/typography';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  bio: string;
}

interface AppFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export default function AboutScreen() {
  const { theme } = useTheme();
  const { isTablet } = useWindowDimensions();

  const appVersion = '1.0.0';
  const buildNumber = '2024.01.15';
  const lastUpdated = 'January 15, 2024';

  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      bio: 'Passionate about making reading accessible to everyone through technology.'
    },
    {
      id: '2',
      name: 'Michael Chen',
      role: 'CTO',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      bio: 'Leading the technical vision and ensuring seamless user experiences.'
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      role: 'Head of Content',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      bio: 'Curating the best content and ensuring quality across all publications.'
    }
  ];

  const appFeatures: AppFeature[] = [
    {
      id: '1',
      title: 'Offline Reading',
      description: 'Download and read your favorite content without internet connection',
      icon: 'cloud-download-outline'
    },
    {
      id: '2',
      title: 'Personalized Recommendations',
      description: 'AI-powered suggestions based on your reading preferences',
      icon: 'bulb-outline'
    },
    {
      id: '3',
      title: 'Multi-format Support',
      description: 'Support for PDF, EPUB, and web-based content',
      icon: 'document-text-outline'
    },
    {
      id: '4',
      title: 'Parental Controls',
      description: 'Safe reading environment for children with content filtering',
      icon: 'shield-checkmark-outline'
    },
    {
      id: '5',
      title: 'Reading Analytics',
      description: 'Track your reading progress and discover insights',
      icon: 'analytics-outline'
    },
    {
      id: '6',
      title: 'Cross-platform Sync',
      description: 'Seamlessly sync your library across all devices',
      icon: 'sync-outline'
    }
  ];

  const handleLinkPress = (url: string) => {
    Linking.openURL(url);
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
    appLogo: {
      width: 80,
      height: 80,
      borderRadius: 20,
      marginBottom: theme.spacing.lg,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    appName: {
      color: '#FFFFFF',
      fontSize: isTablet ? theme.typography.fontSize['3xl'] : theme.typography.fontSize['2xl'],
      fontWeight: theme.typography.fontWeight.bold as any,
      textAlign: 'center',
      marginBottom: theme.spacing.sm,
      textShadowColor: 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 3,
    },
    appTagline: {
      color: 'rgba(255, 255, 255, 0.9)',
      fontSize: theme.typography.fontSize.base,
      textAlign: 'center',
      fontWeight: theme.typography.fontWeight.medium as any,
      marginBottom: theme.spacing.lg,
    },
    versionInfo: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
    },
    versionText: {
      color: '#FFFFFF',
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.medium as any,
    },
    aboutSection: {
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
    },
    aboutCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
      ...theme.shadows.md,
    },
    aboutText: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.base,
      lineHeight: theme.typography.lineHeight.relaxed * theme.typography.fontSize.base,
      marginBottom: theme.spacing.md,
    },
    featuresContainer: {
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
    },
    featuresGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: theme.spacing.md,
    },
    featureCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      width: isTablet ? '48%' : '100%',
      marginBottom: theme.spacing.md,
      alignItems: 'center',
      ...theme.shadows.sm,
    },
    featureIcon: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: theme.colors.primary + '20',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.md,
    },
    featureTitle: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.bold as any,
      textAlign: 'center',
      marginBottom: theme.spacing.xs,
    },
    featureDescription: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSize.sm,
      textAlign: 'center',
      lineHeight: theme.typography.lineHeight.relaxed * theme.typography.fontSize.sm,
    },
    teamContainer: {
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
    },
    teamCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      ...theme.shadows.sm,
    },
    teamMember: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    memberAvatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginRight: theme.spacing.md,
    },
    memberInfo: {
      flex: 1,
    },
    memberName: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.bold as any,
      marginBottom: theme.spacing.xs,
    },
    memberRole: {
      color: theme.colors.primary,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.medium as any,
      marginBottom: theme.spacing.xs,
    },
    memberBio: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSize.sm,
      lineHeight: theme.typography.lineHeight.relaxed * theme.typography.fontSize.sm,
    },
    linksContainer: {
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
    },
    linkCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      ...theme.shadows.sm,
    },
    linkItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    linkItemLast: {
      borderBottomWidth: 0,
    },
    linkText: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.medium as any,
    },
    linkIcon: {
      color: theme.colors.textSecondary,
    },
    statsContainer: {
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: theme.spacing.md,
    },
    statCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      width: isTablet ? '48%' : '100%',
      marginBottom: theme.spacing.md,
      alignItems: 'center',
      ...theme.shadows.sm,
    },
    statValue: {
      color: theme.colors.primary,
      fontSize: isTablet ? theme.typography.fontSize['2xl'] : theme.typography.fontSize.xl,
      fontWeight: theme.typography.fontWeight.bold as any,
      marginBottom: theme.spacing.xs,
    },
    statLabel: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSize.sm,
      textAlign: 'center',
    },
  });

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <ScreenHeader title="About" />
        
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
                <View style={styles.appLogo}>
                  <Ionicons name="book" size={40} color="#FFFFFF" />
                </View>
                <Text style={styles.appName}>EchoReads</Text>
                <Text style={styles.appTagline}>
                  Your gateway to unlimited reading experiences
                </Text>
                <View style={styles.versionInfo}>
                  <Text style={styles.versionText}>Version {appVersion} • Build {buildNumber}</Text>
                </View>
              </LinearGradient>
            </View>

            {/* About Section */}
            <Animated.View entering={FadeInUp.delay(300)} style={styles.aboutSection}>
              <View style={styles.sectionHeader}>
                <H2 style={styles.sectionTitle}>About EchoReads</H2>
                <Body style={styles.sectionSubtitle}>
                  Revolutionizing the way you read and discover content
                </Body>
              </View>

              <View style={styles.aboutCard}>
                <Text style={styles.aboutText}>
                  EchoReads is a modern reading platform designed to bring the world's best content to your fingertips. 
                  Whether you're interested in magazines, articles, or educational digests, we provide a seamless 
                  reading experience across all your devices.
                </Text>
                <Text style={styles.aboutText}>
                  Our mission is to make quality reading accessible to everyone, fostering a love for knowledge 
                  and continuous learning. With advanced features like offline reading, personalized recommendations, 
                  and parental controls, we ensure a safe and engaging reading environment for users of all ages.
                </Text>
                <Text style={styles.aboutText}>
                  Last updated: {lastUpdated}
                </Text>
              </View>
            </Animated.View>

            {/* Features Section */}
            <Animated.View entering={FadeInUp.delay(500)} style={styles.featuresContainer}>
              <View style={styles.sectionHeader}>
                <H2 style={styles.sectionTitle}>Key Features</H2>
                <Body style={styles.sectionSubtitle}>
                  Discover what makes EchoReads special
                </Body>
              </View>

              <View style={styles.featuresGrid}>
                {appFeatures.map((feature) => (
                  <View key={feature.id} style={styles.featureCard}>
                    <View style={styles.featureIcon}>
                      <Ionicons 
                        name={feature.icon as any} 
                        size={24} 
                        color={theme.colors.primary} 
                      />
                    </View>
                    <Text style={styles.featureTitle}>{feature.title}</Text>
                    <Text style={styles.featureDescription}>{feature.description}</Text>
                  </View>
                ))}
              </View>
            </Animated.View>

            {/* Team Section */}
            <Animated.View entering={FadeInUp.delay(700)} style={styles.teamContainer}>
              <View style={styles.sectionHeader}>
                <H2 style={styles.sectionTitle}>Our Team</H2>
                <Body style={styles.sectionSubtitle}>
                  Meet the people behind EchoReads
                </Body>
              </View>

              {teamMembers.map((member) => (
                <View key={member.id} style={styles.teamCard}>
                  <View style={styles.teamMember}>
                    <Image 
                      source={{ uri: member.avatar }} 
                      style={styles.memberAvatar}
                    />
                    <View style={styles.memberInfo}>
                      <Text style={styles.memberName}>{member.name}</Text>
                      <Text style={styles.memberRole}>{member.role}</Text>
                      <Text style={styles.memberBio}>{member.bio}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </Animated.View>

            {/* Stats Section */}
            <Animated.View entering={FadeInUp.delay(900)} style={styles.statsContainer}>
              <View style={styles.sectionHeader}>
                <H2 style={styles.sectionTitle}>EchoReads by the Numbers</H2>
                <Body style={styles.sectionSubtitle}>
                  Our impact in numbers
                </Body>
              </View>

              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>50K+</Text>
                  <Text style={styles.statLabel}>Active Readers</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>10K+</Text>
                  <Text style={styles.statLabel}>Publications</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>1M+</Text>
                  <Text style={styles.statLabel}>Pages Read</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>4.8★</Text>
                  <Text style={styles.statLabel}>App Rating</Text>
                </View>
              </View>
            </Animated.View>

            {/* Links Section */}
            <Animated.View entering={FadeInUp.delay(1100)} style={styles.linksContainer}>
              <View style={styles.sectionHeader}>
                <H2 style={styles.sectionTitle}>Legal & Links</H2>
                <Body style={styles.sectionSubtitle}>
                  Important information and resources
                </Body>
              </View>

              <View style={styles.linkCard}>
                <TouchableOpacity
                  style={styles.linkItem}
                  onPress={() => handleLinkPress('https://echoreads.online/privacy')}
                >
                  <Text style={styles.linkText}>Privacy Policy</Text>
                  <Ionicons name="chevron-forward" size={20} style={styles.linkIcon} />
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.linkItem}
                  onPress={() => handleLinkPress('https://echoreads.online/terms')}
                >
                  <Text style={styles.linkText}>Terms of Service</Text>
                  <Ionicons name="chevron-forward" size={20} style={styles.linkIcon} />
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.linkItem}
                  onPress={() => handleLinkPress('https://echoreads.online/licenses')}
                >
                  <Text style={styles.linkText}>Open Source Licenses</Text>
                  <Ionicons name="chevron-forward" size={20} style={styles.linkIcon} />
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.linkItem, styles.linkItemLast]}
                  onPress={() => handleLinkPress('https://echoreads.online')}
                >
                  <Text style={styles.linkText}>Visit Website</Text>
                  <Ionicons name="chevron-forward" size={20} style={styles.linkIcon} />
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        </Animated.View>
      </ScrollView>
    </ScreenWrapper>
  );
} 