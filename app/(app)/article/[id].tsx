import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text, Image, Dimensions, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
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

export default function ArticleViewScreen() {
  const { theme } = useTheme();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Selectors
  const article = useSelector(selectSelectedMagazine);
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
    if (article) {
      try {
        await Share.share({
          message: `Check out this article: ${article.name}\n\n${article.description}`,
          title: article.name,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleRead = () => {
    // Navigate to article reader
    console.log('Navigate to article reader');
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
    articleHeader: {
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.lg,
    },
    articleMeta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    articleCategory: {
      color: theme.colors.primary,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.medium as any,
    },
    articleStats: {
      flexDirection: 'row',
      gap: theme.spacing.lg,
    },
    statItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    statText: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSize.sm,
    },
    articleTitle: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize['2xl'],
      fontWeight: theme.typography.fontWeight.bold as any,
      lineHeight: theme.typography.lineHeight.tight,
      marginBottom: theme.spacing.md,
    },
    articleDescription: {
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
    articleImageContainer: {
      marginHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
      borderRadius: theme.borderRadius.lg,
      overflow: 'hidden',
    },
    articleImage: {
      width: '100%',
      height: 200,
    },
    articleContent: {
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing['2xl'],
    },
    contentText: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.base,
      lineHeight: theme.typography.lineHeight.relaxed,
      marginBottom: theme.spacing.lg,
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
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.borderRadius.lg,
      gap: theme.spacing.sm,
    },
    readButtonText: {
      color: theme.colors.textInverse,
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.semibold as any,
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
          <Text style={styles.headerTitle}>Article</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.loadingContainer}>
          <Ionicons name="refresh" size={32} color={theme.colors.textSecondary} />
          <Text style={styles.loadingText}>Loading article...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!article) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Article</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={32} color={theme.colors.error} />
          <Text style={styles.errorText}>Article not found</Text>
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
            <Text style={styles.headerTitle}>Article</Text>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.actionButton} onPress={handleBookmark}>
                <Ionicons 
                  name={isBookmarked ? "bookmark" : "bookmark-outline"} 
                  size={24} 
                  color={isBookmarked ? theme.colors.primary : theme.colors.text} 
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
                <Ionicons name="share-outline" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Article Header */}
          <Animated.View entering={FadeInDown.delay(200)} style={styles.articleHeader}>
            <View style={styles.articleMeta}>
              <Text style={styles.articleCategory}>{article.category}</Text>
              <View style={styles.articleStats}>
                <View style={styles.statItem}>
                  <Ionicons name="time-outline" size={16} color={theme.colors.textSecondary} />
                  <Text style={styles.statText}>5 min read</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="calendar-outline" size={16} color={theme.colors.textSecondary} />
                  <Text style={styles.statText}>Today</Text>
                </View>
              </View>
            </View>
            
            <Text style={styles.articleTitle}>{article.name}</Text>
            <Text style={styles.articleDescription}>{article.description}</Text>
          </Animated.View>

          {/* Article Image */}
          {article.image && (
            <Animated.View entering={FadeInUp.delay(300)} style={styles.articleImageContainer}>
              <Image
                source={{ uri: article.image }}
                style={styles.articleImage}
                resizeMode="cover"
              />
            </Animated.View>
          )}

          {/* Article Content */}
          <Animated.View entering={FadeInUp.delay(400)} style={styles.articleContent}>
            <Text style={styles.contentText}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </Text>
            
            <Text style={styles.contentText}>
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </Text>

            <Text style={styles.contentText}>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
            </Text>
          </Animated.View>

          {/* Action Buttons */}
          <Animated.View entering={FadeInUp.delay(500)} style={styles.actionSection}>
            <TouchableOpacity style={styles.readButton} onPress={handleRead}>
              <Ionicons name="book-outline" size={20} color={theme.colors.textInverse} />
              <Text style={styles.readButtonText}>Read Full Article</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
} 