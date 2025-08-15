import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text, Switch, Dimensions, RefreshControl, Image, ActivityIndicator } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { ScreenHeader, ScreenWrapper } from '@/components';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

import { useTheme } from '@/context/ThemeContext';
import { useWindowDimensions } from '@/hooks/useWindowDimensions';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { 
  selectUser, 
  selectUserId,
  selectProfileData,
  selectProfileLoading,
  selectProfileError,
  selectProfileName,
  selectProfileEmail,
  selectProfileUsername,
  selectProfileUid,
  selectProfileImageUrl,
  selectProfileUserType,
  selectProfilePlan,
  selectProfileIsVerified,
  selectIsProfileLoaded,
  fetchUserProfile
} from '@/redux/selectors';
import { logout } from '@/redux/slices/authSlice';
import { H1, H2, H3, Body } from '@/typography';
import { CustomButton } from '@/components/CustomButton';

const { width: screenWidth } = Dimensions.get('window');

interface ProfileMenuItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  type: 'navigation' | 'toggle' | 'action';
  value?: boolean;
  onPress?: () => void;
}

export default function ProfileScreen() {
  const { theme } = useTheme();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  // Auth user data
  const user = useAppSelector(selectUser);
  const userId = useAppSelector(selectUserId);
  
  // Profile data from API
  const profileData = useAppSelector(selectProfileData);
  const profileLoading = useAppSelector(selectProfileLoading);
  const profileError = useAppSelector(selectProfileError);
  const profileName = useAppSelector(selectProfileName);
  const profileEmail = useAppSelector(selectProfileEmail);
  const profileUsername = useAppSelector(selectProfileUsername);
  const profileUid = useAppSelector(selectProfileUid);
  const profileImageUrl = useAppSelector(selectProfileImageUrl);
  const profileUserType = useAppSelector(selectProfileUserType);
  const profilePlan = useAppSelector(selectProfilePlan);
  const profileIsVerified = useAppSelector(selectProfileIsVerified);
  const isProfileLoaded = useAppSelector(selectIsProfileLoaded);
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const isTablet = screenWidth >= 768;

  // Fetch profile data on component mount
  useEffect(() => {
    if (userId && !isProfileLoaded) {
      const uid = typeof userId === 'string' ? parseInt(userId) : userId;
      dispatch(fetchUserProfile(uid));
    }
  }, [dispatch, userId, isProfileLoaded]);

  // Handle profile refresh
  const onRefresh = async () => {
    if (userId) {
      setRefreshing(true);
      const uid = typeof userId === 'string' ? parseInt(userId) : userId;
      await dispatch(fetchUserProfile(uid));
      setRefreshing(false);
    }
  };

  // Profile image update functionality removed for now
  // Will be re-implemented with R2 storage later

  const userStats = {
    magazinesRead: 24,
    totalDownloads: 67,
    readingTime: 156, // hours
    favoriteCategories: 8
  };

  const profileMenuItems: ProfileMenuItem[] = [
    {
      id: 'subscription',
      title: 'Subscription Plans',
      subtitle: 'Manage your subscription',
      icon: 'card-outline',
      type: 'navigation',
      onPress: () => router.push('/(app)/plans')
    },
    {
      id: 'account',
      title: 'Account Settings',
      subtitle: 'Manage your account information',
      icon: 'person-outline',
      type: 'navigation',
      onPress: () => router.push('/(app)/edit-profile')
    },
    {
      id: 'notifications',
      title: 'Notifications',
      subtitle: 'Manage notification preferences',
      icon: 'notifications-outline',
      type: 'toggle',
      value: notificationsEnabled,
      onPress: () => setNotificationsEnabled(!notificationsEnabled)
    },
    {
      id: 'appearance',
      title: 'Appearance',
      subtitle: 'Dark mode and theme settings',
      icon: 'color-palette-outline',
      type: 'toggle',
      value: darkModeEnabled,
      onPress: () => setDarkModeEnabled(!darkModeEnabled)
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      subtitle: 'Manage your privacy settings',
      icon: 'shield-outline',
      type: 'navigation',
      onPress: () => router.push('/(app)/privacy-security')
    },
    {
      id: 'storage',
      title: 'Storage & Data',
      subtitle: 'Manage downloads and cache',
      icon: 'folder-outline',
      type: 'navigation',
      onPress: () => router.push('/(app)/storage-data')
    },
    {
      id: 'help',
      title: 'Help & Support',
      subtitle: 'Get help and contact support',
      icon: 'help-circle-outline',
      type: 'navigation',
      onPress: () => router.push('/(app)/help-support')
    },
    {
      id: 'about',
      title: 'About',
      subtitle: 'App version and information',
      icon: 'information-circle-outline',
      type: 'navigation',
      onPress: () => router.push('/(app)/about')
    }
  ];

  const handleLogout = () => {
    dispatch(logout());
    router.replace('/(auth)/login');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      paddingHorizontal: isTablet ? theme.spacing['2xl'] : theme.spacing.lg,
      paddingTop: theme.spacing.lg,
      paddingBottom: theme.spacing.xl,
    },
    profileSection: {
      alignItems: 'center',
      marginBottom: theme.spacing.xl,
    },
    profileImageContainer: {
      position: 'relative',
      marginBottom: theme.spacing.lg,
    },
    profileImage: {
      width: isTablet ? 140 : 120,
      height: isTablet ? 140 : 120,
      borderRadius: isTablet ? 70 : 60,
      borderWidth: 4,
      borderColor: theme.colors.primary,
    },
    editButton: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      ...theme.shadows.md,
      elevation: 4,
    },
    profileInfo: {
      alignItems: 'center',
    },
    profileName: {
      color: theme.colors.textInverse,
      fontSize: isTablet ? theme.typography.fontSize['3xl'] : theme.typography.fontSize['2xl'],
      fontWeight: theme.typography.fontWeight.bold as any,
      marginBottom: theme.spacing.xs,
      textAlign: 'center',
    },
    profileEmail: {
      color: theme.colors.textInverse,
      fontSize: isTablet ? theme.typography.fontSize.lg : theme.typography.fontSize.base,
      marginBottom: theme.spacing.sm,
      opacity: 0.9,
      textAlign: 'center',
    },
    statsScrollView: {
      marginBottom: theme.spacing.xl,
    },
    statsScrollContainer: {
      paddingHorizontal: theme.spacing.lg,
      gap: theme.spacing.md,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: theme.spacing.xl,
      paddingHorizontal: theme.spacing.xs,
    },
    statItem: {
      alignItems: 'center',
      flex: 1,
    },
    statValue: {
      color: theme.colors.primary,
      fontSize: isTablet ? theme.typography.fontSize['2xl'] : theme.typography.fontSize.xl,
      fontWeight: theme.typography.fontWeight.bold as any,
      marginBottom: theme.spacing.xs,
      textAlign: 'center',
    },
    statLabel: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSize.xs,
      textAlign: 'center',
    },
    content: {
      flex: 1,
      paddingHorizontal: isTablet ? theme.spacing['2xl'] : theme.spacing.lg,
      maxWidth: isTablet ? 600 : '100%',
      alignSelf: isTablet ? 'center' : 'stretch',
    },
    sectionHeader: {
      marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.bold as any,
      marginBottom: theme.spacing.xs,
    },
    sectionSubtitle: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSize.sm,
    },
    menuContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      overflow: 'hidden',
      ...theme.shadows.md,
      elevation: 4,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    menuItemLast: {
      borderBottomWidth: 0,
    },
    menuIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    menuContent: {
      flex: 1,
    },
    menuTitle: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.medium as any,
      marginBottom: theme.spacing.xs,
    },
    menuSubtitle: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSize.sm,
    },
    menuAction: {
      marginLeft: theme.spacing.md,
    },
    logoutContainer: {
      marginTop: theme.spacing.xl,
      marginBottom: theme.spacing.xl,
    },
    logoutButton: {
      backgroundColor: theme.colors.error,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      ...theme.shadows.md,
      elevation: 4,
    },
    logoutText: {
      color: theme.colors.textInverse,
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.medium as any,
      marginLeft: theme.spacing.sm,
    },
    versionText: {
      color: theme.colors.textTertiary,
      fontSize: theme.typography.fontSize.xs,
      textAlign: 'center',
      marginBottom: theme.spacing.lg,
    },
    errorContainer: {
      backgroundColor: theme.colors.error,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.lg,
    },
    errorText: {
      color: theme.colors.textInverse,
      fontSize: theme.typography.fontSize.sm,
      textAlign: 'center',
    },
    profileInfoContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginTop: theme.spacing.lg,
      width: '100%',
      ...theme.shadows.sm,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: theme.spacing.xs,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    infoLabel: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.medium as any,
    },
    infoValue: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.semibold as any,
    },
    loadingContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.xl,
    },
    loadingText: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSize.base,
      marginTop: theme.spacing.md,
    },
    profileHeader: {
      padding: isTablet ? theme.spacing['2xl'] : theme.spacing.xl,
      borderRadius: theme.borderRadius.xl,
      marginBottom: theme.spacing.lg,
      alignItems: 'center',
      marginHorizontal: isTablet ? theme.spacing.xl : 0,
    },
    verifiedBadge: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      backgroundColor: theme.colors.textInverse,
      borderRadius: 12,
      padding: 2,
      ...theme.shadows.sm,
    },
    editImageOverlay: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      backgroundColor: theme.colors.primary,
      borderRadius: 16,
      width: 32,
      height: 32,
      alignItems: 'center',
      justifyContent: 'center',
      ...theme.shadows.md,
    },
    profileUsername: {
      color: theme.colors.textInverse,
      fontSize: theme.typography.fontSize.sm,
      opacity: 0.9,
      marginTop: theme.spacing.xs,
    },
    statCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      alignItems: 'center',
      width: 100,
      minWidth: 100,
      ...theme.shadows.sm,
    },
    userDetailsCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: isTablet ? theme.spacing.xl : theme.spacing.lg,
      marginTop: theme.spacing.lg,
      width: '100%',
      ...theme.shadows.md,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    cardTitle: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.bold as any,
      marginLeft: theme.spacing.sm,
    },
    detailsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: theme.spacing.sm,
    },
    detailItem: {
      width: '48%',
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      alignItems: 'center',
      minHeight: 80,
    },
    detailLabel: {
      color: theme.colors.textSecondary,
      fontSize: isTablet ? theme.typography.fontSize.sm : theme.typography.fontSize.xs,
      marginTop: theme.spacing.xs,
      textAlign: 'center',
    },
    detailValue: {
      color: theme.colors.text,
      fontSize: isTablet ? theme.typography.fontSize.base : theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.semibold as any,
      marginTop: theme.spacing.xs,
      textAlign: 'center',
    },
  });

  return (
    <ScreenWrapper>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      >
        {/* Header */}
        <ScreenHeader title="Profile" />
        <Animated.View entering={FadeInDown.delay(200)} style={styles.header}>
          {profileError && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{profileError}</Text>
            </View>
          )}
          
          {profileLoading && !profileData && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={styles.loadingText}>Loading profile...</Text>
            </View>
          )}
          
          <View style={styles.profileSection}>
            {/* Profile Header with Gradient */}
            <LinearGradient
              colors={[theme.colors.primary, theme.colors.primaryDark]}
              style={styles.profileHeader}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <TouchableOpacity 
                style={styles.profileImageContainer}
                onPress={() => router.push('/(app)/edit-profile')}
                activeOpacity={0.8}
              >
                <Image 
                  source={{ 
                    uri: profileImageUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'
                  }} 
                  style={styles.profileImage}
                />
                <View style={styles.editImageOverlay}>
                  <Ionicons name="camera" size={20} color={theme.colors.textInverse} />
                </View>
                {profileIsVerified && (
                  <View style={styles.verifiedBadge}>
                    <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />
                  </View>
                )}
              </TouchableOpacity>
              
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>
                  {profileName || user?.name || 'John Doe'}
                </Text>
                <Text style={styles.profileEmail}>
                  {profileEmail || user?.email || 'john.doe@example.com'}
                </Text>
                {profileUsername && (
                  <Text style={styles.profileUsername}>
                    @{profileUsername}
                  </Text>
                )}
              </View>
            </LinearGradient>

            {/* User Stats Cards - Horizontal Slider */}
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.statsScrollContainer}
              style={styles.statsScrollView}
            >
              <View style={styles.statCard}>
                <Ionicons name="book-outline" size={24} color={theme.colors.primary} />
                <Text style={styles.statValue}>{userStats.magazinesRead}</Text>
                <Text style={styles.statLabel} numberOfLines={1} ellipsizeMode="tail">Magazines</Text>
              </View>
              <View style={styles.statCard}>
                <Ionicons name="download-outline" size={24} color={theme.colors.primary} />
                <Text style={styles.statValue}>{userStats.totalDownloads}</Text>
                <Text style={styles.statLabel} numberOfLines={1} ellipsizeMode="tail">Downloads</Text>
              </View>
              <View style={styles.statCard}>
                <Ionicons name="time-outline" size={24} color={theme.colors.primary} />
                <Text style={styles.statValue}>{userStats.readingTime}h</Text>
                <Text style={styles.statLabel} numberOfLines={1} ellipsizeMode="tail">Reading</Text>
              </View>
              <View style={styles.statCard}>
                <Ionicons name="grid-outline" size={24} color={theme.colors.primary} />
                <Text style={styles.statValue}>{userStats.favoriteCategories}</Text>
                <Text style={styles.statLabel} numberOfLines={1} ellipsizeMode="tail">Categories</Text>
              </View>
              <View style={styles.statCard}>
                <Ionicons name="star-outline" size={24} color={theme.colors.primary} />
                <Text style={styles.statValue}>12</Text>
                <Text style={styles.statLabel} numberOfLines={1} ellipsizeMode="tail">Favorites</Text>
              </View>
              <View style={styles.statCard}>
                <Ionicons name="share-outline" size={24} color={theme.colors.primary} />
                <Text style={styles.statValue}>8</Text>
                <Text style={styles.statLabel} numberOfLines={1} ellipsizeMode="tail">Shared</Text>
              </View>
            </ScrollView>

            {/* User Details Card */}
            {profileData && (
              <View style={styles.userDetailsCard}>
                <View style={styles.cardHeader}>
                  <Ionicons name="person-circle-outline" size={24} color={theme.colors.primary} />
                  <Text style={styles.cardTitle}>Account Details</Text>
                </View>
                
                <View style={styles.detailsGrid}>
                  <View style={styles.detailItem}>
                    <Ionicons name="id-card-outline" size={16} color={theme.colors.textSecondary} />
                    <Text style={styles.detailLabel}>User ID</Text>
                    <Text style={styles.detailValue}>{profileUid}</Text>
                  </View>
                  
                  <View style={styles.detailItem}>
                    <Ionicons name="shield-outline" size={16} color={theme.colors.textSecondary} />
                    <Text style={styles.detailLabel}>User Type</Text>
                    <Text style={styles.detailValue}>{profileUserType}</Text>
                  </View>
                  
                  <View style={styles.detailItem}>
                    <Ionicons name="diamond-outline" size={16} color={theme.colors.textSecondary} />
                    <Text style={styles.detailLabel}>Plan</Text>
                    <Text style={[styles.detailValue, { color: theme.colors.primary }]}>{profilePlan}</Text>
                  </View>
                  
                  <View style={styles.detailItem}>
                    <Ionicons name="calendar-outline" size={16} color={theme.colors.textSecondary} />
                    <Text style={styles.detailLabel}>Member Since</Text>
                    <Text style={styles.detailValue}>
                      {profileData.createdAt ? new Date(profileData.createdAt).toLocaleDateString() : 'N/A'}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        </Animated.View>

        {/* Content */}
        <Animated.View entering={FadeInUp.delay(400)} style={styles.content}>
          {/* Settings Section */}
          <View style={styles.sectionHeader}>
            <H2 style={styles.sectionTitle}>Settings</H2>
            <Body style={styles.sectionSubtitle}>
              Manage your account and preferences
            </Body>
          </View>

          <View style={styles.menuContainer}>
            {profileMenuItems.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.menuItem,
                  index === profileMenuItems.length - 1 && styles.menuItemLast
                ]}
                onPress={item.onPress}
                activeOpacity={0.7}
              >
                <View style={styles.menuIcon}>
                  <Ionicons 
                    name={item.icon as any} 
                    size={20} 
                    color={theme.colors.primary} 
                  />
                </View>
                
                <View style={styles.menuContent}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  {item.subtitle && (
                    <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                  )}
                </View>
                
                <View style={styles.menuAction}>
                  {item.type === 'toggle' ? (
                    <Switch
                      value={item.value}
                      onValueChange={item.onPress}
                      trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                      thumbColor={theme.colors.textInverse}
                    />
                  ) : (
                    <Ionicons 
                      name="chevron-forward" 
                      size={20} 
                      color={theme.colors.textSecondary} 
                    />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Logout Section */}
          <View style={styles.logoutContainer}>
            <TouchableOpacity 
              style={styles.logoutButton}
              onPress={handleLogout}
              activeOpacity={0.8}
            >
              <Ionicons name="log-out-outline" size={20} color={theme.colors.textInverse} />
              <Text style={styles.logoutText}>Sign Out</Text>
            </TouchableOpacity>
          </View>

          {/* Version Info */}
          <Text style={styles.versionText}>
            EchoReads v1.0.0
          </Text>
        </Animated.View>
      </ScrollView>
    </ScreenWrapper>
  );
}