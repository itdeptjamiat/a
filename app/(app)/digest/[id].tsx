import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text, Image, Dimensions, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import Animated, { FadeInDown, FadeInUp, BounceIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '@/context/ThemeContext';
import { useWindowDimensions } from '@/hooks/useWindowDimensions';
import { H1, H2, H3, Body } from '@/typography';
import { 
  selectSelectedMagazine,
  selectMagazineDetailLoading,
} from '@/redux/selectors';
import { fetchMagazineDetail } from '@/redux/actions/magazineActions';
import { clearSelectedMagazine } from '@/redux/slices/magazineSlice';
import { AppDispatch } from '@/redux/store';
import { router, useLocalSearchParams } from 'expo-router';

const { width: screenWidth } = Dimensions.get('window');

export default function DigestViewScreen() {
  const { theme } = useTheme();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isLiked, setIsLiked] = useState(false);

  // Selectors
  const digest = useSelector(selectSelectedMagazine);
  const loading = useSelector(selectMagazineDetailLoading);

  const isTablet = screenWidth >= 768;

  useEffect(() => {
    if (id) {
      dispatch(fetchMagazineDetail(id));
    }
    
    return () => {
      dispatch(clearSelectedMagazine());
    };
  }, [dispatch, id]);

  const handleShare = async () => {
    if (digest) {
      try {
        await Share.share({
          message: `Check out this fun story: ${digest.name}\n\n${digest.description}`,
          title: digest.name,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleRead = () => {
    // Navigate to story reader
    console.log('Navigate to story reader');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    gradientBackground: {
      flex: 1,
    },
    content: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
    },
    backButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.bold as any,
    },
    headerSpacer: {
      width: 44,
    },
    headerActions: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    actionButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    storyBanner: {
      marginBottom: theme.spacing.lg,
      marginHorizontal: theme.spacing.lg,
    },
    bannerGradient: {
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
    },
    bannerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.md,
    },
    bannerTitle: {
      color: '#FFFFFF',
      fontSize: theme.typography.fontSize.xl,
      fontWeight: theme.typography.fontWeight.bold as any,
      textAlign: 'center',
      textShadowColor: 'rgba(0, 0, 0, 0.5)',
      textShadowOffset: { width: 2, height: 2 },
      textShadowRadius: 4,
    },
    storyInfo: {
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.lg,
    },
    storyMeta: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    ageBadge: {
      backgroundColor: '#4ECDC4',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 2,
      borderColor: '#FFFFFF',
    },
    ageBadgeText: {
      color: '#FFFFFF',
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.bold as any,
    },
    categoryBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.lg,
      gap: theme.spacing.xs,
      borderWidth: 2,
      borderColor: '#FFFFFF',
    },
    categoryBadgeText: {
      color: '#FFFFFF',
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.bold as any,
    },
    storyTitle: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize['2xl'],
      fontWeight: theme.typography.fontWeight.bold as any,
      lineHeight: theme.typography.lineHeight.tight,
      marginBottom: theme.spacing.md,
    },
    storyDescription: {
      color: '#FFFFFF',
      fontSize: theme.typography.fontSize.base,
      lineHeight: theme.typography.lineHeight.normal,
      fontWeight: theme.typography.fontWeight.medium as any,
      textShadowColor: 'rgba(0, 0, 0, 0.8)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.sm,
    },
    storyImageContainer: {
      marginHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
      borderRadius: theme.borderRadius.xl,
      overflow: 'hidden',
      position: 'relative',
    },
    storyImage: {
      width: '100%',
      height: 250,
    },
    imageOverlay: {
      position: 'absolute',
      bottom: theme.spacing.md,
      right: theme.spacing.md,
    },
    playButton: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 4,
      borderColor: '#FFFFFF',
      elevation: 6,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.5,
      shadowRadius: 6,
    },
    storyContent: {
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.lg,
    },
    contentHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.lg,
    },
    contentTitle: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.xl,
      fontWeight: theme.typography.fontWeight.bold as any,
    },
    contentText: {
      color: '#FFFFFF',
      fontSize: theme.typography.fontSize.base,
      lineHeight: theme.typography.lineHeight.relaxed,
      marginBottom: theme.spacing.lg,
      fontWeight: theme.typography.fontWeight.medium as any,
      textShadowColor: 'rgba(0, 0, 0, 0.8)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.sm,
    },
    funFacts: {
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.lg,
    },
    factsHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.lg,
    },
    factsTitle: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.xl,
      fontWeight: theme.typography.fontWeight.bold as any,
    },
    factsList: {
      gap: theme.spacing.md,
    },
    factItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    factText: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSize.base,
    },
    actionSection: {
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing['2xl'],
    },
    readButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.primary,
      paddingVertical: theme.spacing.lg,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.borderRadius.xl,
      gap: theme.spacing.sm,
      elevation: 4,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
    },
    readButtonText: {
      color: '#FFFFFF',
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.bold as any,
    },
    loadingContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.md,
    },
    loadingText: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSize.base,
    },
    errorContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.md,
    },
    errorText: {
      color: theme.colors.error,
      fontSize: theme.typography.fontSize.base,
    },
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Story</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.loadingContainer}>
          <Animated.View entering={BounceIn.delay(200)}>
            <Ionicons name="happy" size={48} color={theme.colors.primary} />
          </Animated.View>
          <Text style={styles.loadingText}>Loading your story... 🚀</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!digest) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Story</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="sad" size={48} color={theme.colors.error} />
          <Text style={styles.errorText}>Story not found 😢</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1a1a1a', '#2d2d2d', '#FFD700']}
        style={styles.gradientBackground}
      >
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Story</Text>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
                <Ionicons 
                  name={isLiked ? "heart" : "heart-outline"} 
                  size={24} 
                  color={isLiked ? "#FF6B6B" : theme.colors.text} 
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
                <Ionicons name="share-outline" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Story Header Banner */}
          <Animated.View entering={FadeInDown.delay(200)} style={styles.storyBanner}>
            <LinearGradient
              colors={[theme.colors.primary, theme.colors.primaryDark, '#FFD700']}
              style={styles.bannerGradient}
            >
              <View style={styles.bannerContent}>
                <Ionicons name="color-palette" size={32} color="#FFFFFF" />
                <Text style={styles.bannerTitle}>🌟 AMAZING STORY 🌟</Text>
                <Ionicons name="color-palette" size={32} color="#FFFFFF" />
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Story Info */}
          <Animated.View entering={FadeInUp.delay(300)} style={styles.storyInfo}>
            <View style={styles.storyMeta}>
              <View style={styles.ageBadge}>
                <Text style={styles.ageBadgeText}>5+</Text>
              </View>
              <View style={styles.categoryBadge}>
                <Ionicons name="star" size={16} color="#FFFFFF" />
                <Text style={styles.categoryBadgeText}>{digest.category}</Text>
              </View>
            </View>
            
            <Text style={styles.storyTitle}>{digest.name}</Text>
            <Text style={styles.storyDescription}>{digest.description}</Text>
          </Animated.View>

          {/* Story Image */}
          {digest.image && (
            <Animated.View entering={FadeInUp.delay(400)} style={styles.storyImageContainer}>
              <Image
                source={{ uri: digest.image }}
                style={styles.storyImage}
                resizeMode="cover"
              />
              <View style={styles.imageOverlay}>
                <View style={styles.playButton}>
                  <Ionicons name="play" size={32} color="#FFFFFF" />
                </View>
              </View>
            </Animated.View>
          )}

          {/* Story Content */}
          <Animated.View entering={FadeInUp.delay(500)} style={styles.storyContent}>
            <View style={styles.contentHeader}>
              <Ionicons name="book" size={24} color={theme.colors.primary} />
              <Text style={styles.contentTitle}>Story Time! 📖</Text>
            </View>
            
            <Text style={styles.contentText}>
              Once upon a time, in a magical land far, far away, there lived a brave little hero who loved to explore and discover new adventures! 🌟
            </Text>
            
            <Text style={styles.contentText}>
              Every day, this little hero would wake up with a big smile and ready to face whatever challenges came their way. With friends by their side, nothing seemed impossible! ✨
            </Text>

            <Text style={styles.contentText}>
              Together, they learned that friendship, courage, and kindness were the most powerful magic of all. And they lived happily ever after! 🎉
            </Text>
          </Animated.View>

          {/* Fun Facts */}
          <Animated.View entering={FadeInUp.delay(600)} style={styles.funFacts}>
            <View style={styles.factsHeader}>
              <Ionicons name="bulb" size={24} color="#FFD700" />
              <Text style={styles.factsTitle}>Fun Facts! 🎯</Text>
            </View>
            
            <View style={styles.factsList}>
              <View style={styles.factItem}>
                <Ionicons name="checkmark-circle" size={20} color="#4ECDC4" />
                <Text style={styles.factText}>Perfect for kids aged 5+</Text>
              </View>
              <View style={styles.factItem}>
                <Ionicons name="checkmark-circle" size={20} color="#4ECDC4" />
                <Text style={styles.factText}>Educational and fun</Text>
              </View>
              <View style={styles.factItem}>
                <Ionicons name="checkmark-circle" size={20} color="#4ECDC4" />
                <Text style={styles.factText}>Interactive reading experience</Text>
              </View>
            </View>
          </Animated.View>

          {/* Action Buttons */}
          <Animated.View entering={FadeInUp.delay(700)} style={styles.actionSection}>
            <TouchableOpacity style={styles.readButton} onPress={handleRead}>
              <Ionicons name="play-circle" size={24} color="#FFFFFF" />
              <Text style={styles.readButtonText}>Start Reading! 🚀</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
} 