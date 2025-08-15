import React, { useEffect, useState } from 'react';
import { 
  View, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  Text, 
  RefreshControl, 
  ActivityIndicator,
  Dimensions,
  Alert
} from 'react-native';
import { ScreenHeader, ScreenWrapper } from '@/components';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp, SlideInRight, FadeIn } from 'react-native-reanimated';

import { useTheme } from '@/context/ThemeContext';
import { useWindowDimensions } from '@/hooks/useWindowDimensions';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { 
  selectPlans,
  selectPlansLoading,
  selectPlansError,
  selectActivePlans,
  selectFreePlan,
  selectPaidPlans,
  selectCurrentPlan,
  selectIsPlansLoaded,
  fetchSubscriptionPlans,
  subscribeToPlan
} from '@/redux/selectors';
import { H1, H2, H3, Body } from '@/typography';

const { width: screenWidth } = Dimensions.get('window');

export default function PlansScreen() {
  const { theme } = useTheme();
  const { isTablet } = useWindowDimensions();
  const dispatch = useAppDispatch();
  
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  
  const plans = useAppSelector(selectActivePlans);
  const freePlan = useAppSelector(selectFreePlan);
  const paidPlans = useAppSelector(selectPaidPlans);
  const currentPlan = useAppSelector(selectCurrentPlan);
  const loading = useAppSelector(selectPlansLoading);
  const error = useAppSelector(selectPlansError);
  const isPlansLoaded = useAppSelector(selectIsPlansLoaded);

  // Fetch plans on component mount
  useEffect(() => {
    if (!isPlansLoaded) {
      dispatch(fetchSubscriptionPlans());
    }
  }, [dispatch, isPlansLoaded]);

  // Handle refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchSubscriptionPlans());
    setRefreshing(false);
  };

  // Handle plan selection
  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };

  // Handle subscription
  const handleSubscribe = (planId: string) => {
    Alert.alert(
      'Confirm Subscription',
      'Are you sure you want to subscribe to this plan?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Subscribe',
          onPress: () => {
            dispatch(subscribeToPlan(planId));
            setSelectedPlan(null);
          },
        },
      ]
    );
  };

  // Get plan icon based on plan type
  const getPlanIcon = (planType: string) => {
    switch (planType.toLowerCase()) {
      case 'free':
        return 'person-outline';
      case 'echopro':
        return 'star-outline';
      case 'echoproplus':
        return 'diamond-outline';
      default:
        return 'card-outline';
    }
  };

  // Get plan color based on plan type
  const getPlanColor = (planType: string) => {
    switch (planType.toLowerCase()) {
      case 'free':
        return [theme.colors.surface, theme.colors.surfaceLight]; // Theme-based gradient
      case 'echopro':
        return [theme.colors.primary, theme.colors.primaryDark]; // Primary gradient
      case 'echoproplus':
        return [theme.colors.success, theme.colors.info]; // Success gradient
      default:
        return [theme.colors.primary, theme.colors.primaryDark];
    }
  };

  // Get plan accent color
  const getPlanAccentColor = (planType: string) => {
    switch (planType.toLowerCase()) {
      case 'free':
        return theme.colors.textSecondary;
      case 'echopro':
        return theme.colors.primary;
      case 'echoproplus':
        return theme.colors.success;
      default:
        return theme.colors.primary;
    }
  };

  // Format price display
  const formatPrice = (price: number, currency: string) => {
    if (price === 0) return 'Free';
    return `${currency}${price}`;
  };

  // Format duration
  const formatDuration = (duration: number) => {
    if (duration === 1) return 'month';
    if (duration === 30) return 'month';
    return `${duration} days`;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    premiumHeader: {
      marginHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
      borderRadius: theme.borderRadius.xl,
      overflow: 'hidden',
      ...theme.shadows.lg,
    },
    premiumHeaderGradient: {
      padding: theme.spacing.xl,
      alignItems: 'center',
    },
    premiumIcon: {
      marginBottom: theme.spacing.md,
    },
    premiumTitle: {
      fontSize: isTablet ? theme.typography.fontSize['2xl'] : theme.typography.fontSize.xl,
      fontWeight: theme.typography.fontWeight.bold as any,
      color: '#FFFFFF',
      textAlign: 'center',
      marginBottom: theme.spacing.sm,
      textShadowColor: 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 3,
    },
    premiumSubtitle: {
      fontSize: theme.typography.fontSize.base,
      color: 'rgba(255, 255, 255, 0.9)',
      textAlign: 'center',
      fontWeight: theme.typography.fontWeight.medium as any,
    },
    header: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.xl,
    },
    errorContainer: {
      backgroundColor: theme.colors.error + '20',
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.md,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.error,
    },
    errorText: {
      color: theme.colors.error,
      fontSize: theme.typography.fontSize.sm,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.xl,
    },
    loadingText: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSize.base,
      marginTop: theme.spacing.md,
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
    plansContainer: {
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.xl,
    },
    planCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      marginBottom: theme.spacing.lg,
      overflow: 'hidden',
      ...theme.shadows.xl,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    planHeader: {
      padding: theme.spacing.xl,
      alignItems: 'center',
      position: 'relative',
    },
    planIcon: {
      width: 80,
      height: 80,
      borderRadius: 40,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.lg,
      borderWidth: 2,
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    planType: {
      fontSize: isTablet ? theme.typography.fontSize['2xl'] : theme.typography.fontSize.xl,
      fontWeight: theme.typography.fontWeight.bold as any,
      color: theme.colors.textInverse,
      marginBottom: theme.spacing.xs,
      textTransform: 'capitalize',
      textShadowColor: 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 3,
    },
    planDescription: {
      fontSize: theme.typography.fontSize.base,
      color: theme.colors.textInverse + 'E6',
      textAlign: 'center',
      marginBottom: theme.spacing.lg,
      fontWeight: theme.typography.fontWeight.medium as any,
    },
    priceContainer: {
      flexDirection: 'row',
      alignItems: 'baseline',
      justifyContent: 'center',
      marginBottom: theme.spacing.sm,
    },
    price: {
      fontSize: isTablet ? theme.typography.fontSize['4xl'] : theme.typography.fontSize['2xl'],
      fontWeight: theme.typography.fontWeight.bold as any,
      color: theme.colors.textInverse,
      textShadowColor: 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 3,
    },
    originalPrice: {
      fontSize: theme.typography.fontSize.lg,
      color: theme.colors.textInverse + 'B3',
      textDecorationLine: 'line-through',
      marginLeft: theme.spacing.sm,
      fontWeight: theme.typography.fontWeight.medium as any,
    },
    duration: {
      fontSize: theme.typography.fontSize.base,
      color: theme.colors.textInverse + 'CC',
      marginBottom: theme.spacing.lg,
      fontWeight: theme.typography.fontWeight.medium as any,
    },
    discountBadge: {
      position: 'absolute',
      top: theme.spacing.lg,
      right: theme.spacing.lg,
      backgroundColor: '#FF6B6B',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
      transform: [{ rotate: '15deg' }],
      ...theme.shadows.md,
    },
    discountText: {
      color: theme.colors.textInverse,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.bold as any,
    },
    featuresContainer: {
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.lg,
    },
    featureItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    featureIcon: {
      marginRight: theme.spacing.sm,
      width: 20,
      alignItems: 'center',
    },
    featureText: {
      flex: 1,
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.text,
    },
    featureTextDisabled: {
      color: theme.colors.textSecondary,
    },
    actionContainer: {
      padding: theme.spacing.lg,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    subscribeButton: {
      paddingVertical: theme.spacing.lg,
      borderRadius: theme.borderRadius.lg,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      ...theme.shadows.md,
      elevation: 8,
    },
    subscribeButtonText: {
      color: theme.colors.textInverse,
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.bold as any,
      marginLeft: theme.spacing.sm,
    },
    currentPlanBadge: {
      backgroundColor: theme.colors.success + '20',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    currentPlanText: {
      color: theme.colors.success,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.medium as any,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.xl,
    },
    emptyText: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSize.base,
      textAlign: 'center',
      marginTop: theme.spacing.md,
    },
    mainFeatureSection: {
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
    },
    mainFeatureTitle: {
      color: theme.colors.text,
      fontSize: isTablet ? theme.typography.fontSize['2xl'] : theme.typography.fontSize.xl,
      fontWeight: theme.typography.fontWeight.bold as any,
      marginBottom: theme.spacing.lg,
      textAlign: 'center',
    },
    featuresList: {
      marginBottom: theme.spacing.xl,
    },
    mainFeatureItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
    },
    mainFeatureText: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.medium as any,
      marginLeft: theme.spacing.md,
    },
  });

  if (loading && !isPlansLoaded) {
    return (
      <ScreenWrapper>
        <ScreenHeader title="Subscription Plans" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading subscription plans...</Text>
        </View>
      </ScreenWrapper>
    );
  }

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
        <ScreenHeader title="Subscription Plans" />
        
        <Animated.View entering={FadeInDown.delay(200)} style={styles.header}>
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Something went wrong. Please try again. Thanks</Text>
            </View>
          )}
          
          <View style={styles.content}>
            {/* Main Feature Section */}
            <Animated.View entering={FadeInDown.delay(300)} style={styles.mainFeatureSection}>
              <Text style={styles.mainFeatureTitle}>Unlimited access to all your favorite magazines</Text>
              
              {/* Features List */}
              <View style={styles.featuresList}>
                <View style={styles.mainFeatureItem}>
                  <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />
                  <Text style={styles.mainFeatureText}>More than 8000 magazines</Text>
                </View>
                <View style={styles.mainFeatureItem}>
                  <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />
                  <Text style={styles.mainFeatureText}>Family access, 5 profiles</Text>
                </View>
                <View style={styles.mainFeatureItem}>
                  <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />
                  <Text style={styles.mainFeatureText}>The latest issues</Text>
                </View>
                <View style={styles.mainFeatureItem}>
                  <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />
                  <Text style={styles.mainFeatureText}>Offline reading</Text>
                </View>
                <View style={styles.mainFeatureItem}>
                  <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />
                  <Text style={styles.mainFeatureText}>Cancel at anytime</Text>
                </View>
              </View>
            </Animated.View>

            {/* Plans Container */}
            <View style={styles.plansContainer}>
              {plans.length === 0 ? (
                <Animated.View entering={FadeInUp.delay(400)} style={styles.emptyContainer}>
                  <Ionicons name="card-outline" size={64} color={theme.colors.textSecondary} />
                  <Text style={styles.emptyText}>No subscription plans available</Text>
                </Animated.View>
              ) : (
                plans.map((plan, index) => (
                  <Animated.View 
                    key={plan._id}
                    entering={SlideInRight.delay(200 + index * 100)}
                    style={[
                      styles.planCard,
                      { transform: [{ scale: currentPlan === plan._id ? 1.02 : 1 }] }
                    ]}
                  >
                    {/* Plan Header */}
                    <LinearGradient
                      colors={getPlanColor(plan.planType) as [string, string]}
                      style={styles.planHeader}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Animated.View entering={FadeIn.delay(300 + index * 50)}>
                        <View style={[
                          styles.planIcon, 
                          { backgroundColor: 'rgba(255, 255, 255, 0.2)' }
                        ]}>
                          <Ionicons 
                            name={getPlanIcon(plan.planType) as any} 
                            size={32} 
                            color="#FFFFFF" 
                          />
                        </View>
                        
                        <Text style={styles.planType}>{plan.planType}</Text>
                        <Text style={styles.planDescription}>{plan.description}</Text>
                        
                        <View style={styles.priceContainer}>
                          <Text style={styles.price}>
                            {formatPrice(plan.finalPrice, plan.currency)}
                          </Text>
                        {plan.discountPercentage > 0 && (
                          <Text style={styles.originalPrice}>
                            {formatPrice(plan.price, plan.currency)}
                          </Text>
                        )}
                      </View>
                      
                                              <Text style={styles.duration}>per {formatDuration(plan.duration)}</Text>
                        </Animated.View>
                      </LinearGradient>

                    {/* Features */}
                    <View style={styles.featuresContainer}>
                      {plan.processedFeatures?.map((feature, featureIndex) => (
                        <View key={featureIndex} style={styles.featureItem}>
                          <View style={styles.featureIcon}>
                            <Ionicons 
                              name={feature.isAvailable ? "checkmark-circle" : "close-circle"} 
                              size={16} 
                              color={feature.isAvailable ? theme.colors.success : theme.colors.error} 
                            />
                          </View>
                          <Text style={[
                            styles.featureText,
                            !feature.isAvailable && styles.featureTextDisabled
                          ]}>
                            {feature.feature}
                          </Text>
                        </View>
                      ))}
                    </View>

                    {/* Action */}
                    <View style={styles.actionContainer}>
                      {currentPlan === plan._id ? (
                        <View style={styles.currentPlanBadge}>
                          <Ionicons name="checkmark-circle" size={16} color={theme.colors.success} />
                          <Text style={styles.currentPlanText}>Current Plan</Text>
                        </View>
                      ) : (
                        <TouchableOpacity
                          style={[
                            styles.subscribeButton,
                            { backgroundColor: getPlanAccentColor(plan.planType) }
                          ]}
                          onPress={() => handleSubscribe(plan._id)}
                          activeOpacity={0.8}
                        >
                          <Ionicons name="card-outline" size={20} color={theme.colors.textInverse} />
                          <Text style={styles.subscribeButtonText}>
                            {plan.planType === 'free' ? 'Get Started' : 'Subscribe Now'}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </Animated.View>
                ))
              )}
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </ScreenWrapper>
  );
} 