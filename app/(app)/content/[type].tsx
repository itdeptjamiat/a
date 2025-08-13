import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl, TouchableOpacity, Text, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '@/context/ThemeContext';
import { useWindowDimensions } from '@/hooks/useWindowDimensions';
import { H1, H2, H3, Body } from '@/typography';
import { 
  fetchMagazines,
  selectMagazines,
  selectArticles,
  selectDigests,
  selectMagazineLoading,
  selectMagazineError,
} from '@/redux/selectors';
import { AppDispatch } from '@/redux/store';
import { router, useLocalSearchParams } from 'expo-router';

const { width: screenWidth } = Dimensions.get('window');

export default function ContentTypeScreen() {
  const { theme } = useTheme();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const dispatch = useDispatch<AppDispatch>();
  const [refreshing, setRefreshing] = useState(false);
  const { type } = useLocalSearchParams<{ type: string }>();

  // Selectors
  const magazines = useSelector(selectMagazines);
  const articles = useSelector(selectArticles);
  const digests = useSelector(selectDigests);
  const loading = useSelector(selectMagazineLoading);
  const error = useSelector(selectMagazineError);

  const isTablet = screenWidth >= 768;

  useEffect(() => {
    dispatch(fetchMagazines());
  }, [dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchMagazines());
    setRefreshing(false);
  };

  // Get content based on type
  const getContent = () => {
    let content;
    switch (type) {
      case 'magazines':
        content = magazines;
        break;
      case 'articles':
        content = articles;
        break;
      case 'digests':
        content = digests;
        break;
      default:
        content = magazines;
        break;
    }
    
    // Debug logging
    console.log(`🔍 Content Debug - Type: ${type}`);
    console.log(`🔍 Content Debug - Magazines count: ${magazines.length}`);
    console.log(`🔍 Content Debug - Articles count: ${articles.length}`);
    console.log(`🔍 Content Debug - Digests count: ${digests.length}`);
    console.log(`🔍 Content Debug - Selected content count: ${content.length}`);
    
    return content;
  };

  const getTypeTitle = () => {
    switch (type) {
      case 'magazines':
        return 'Magazines';
      case 'articles':
        return 'Articles';
      case 'digests':
        return 'Digests';
      default:
        return 'Content';
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'magazines':
        return 'book-outline';
      case 'articles':
        return 'document-text-outline';
      case 'digests':
        return 'newspaper-outline';
      default:
        return 'book-outline';
    }
  };

  const content = getContent();

  const handleContentPress = (item: any) => {
    if (type === 'magazines') {
      router.push(`/magazine/${item.mid}`);
    } else if (type === 'articles') {
      router.push(`/article/${item.mid}`);
    } else if (type === 'digests') {
      router.push(`/digest/${item.mid}`);
    }
  };

  const renderPopularCard = (item: any, index: number) => {
    const cardWidth = isTablet ? 200 : 160;
    const cardHeight = isTablet ? 280 : 220;

    return (
      <Animated.View
        key={item._id || index}
        entering={FadeInUp.delay(index * 100)}
        style={[styles.popularCard, { width: cardWidth, height: cardHeight }]}
      >
        <TouchableOpacity
          style={styles.cardTouchable}
          onPress={() => handleContentPress(item)}
          activeOpacity={0.8}
        >
          <View style={styles.cardImageContainer}>
            <Image
              source={{ 
                uri: item.image || 'https://via.placeholder.com/300x400/1F2937/FFFFFF?text=Cover'
              }}
              style={styles.cardImage}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['transparent', 'rgba(0, 0, 0, 0.8)']}
              style={styles.cardOverlay}
            />
            
            {/* Type Badge */}
            <View style={styles.typeBadge}>
              <Ionicons 
                name={getTypeIcon() as any} 
                size={12} 
                color="#FFFFFF" 
              />
              <Text style={styles.typeText}>{type?.charAt(0).toUpperCase() + type?.slice(1)}</Text>
            </View>

            {/* Rating */}
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={12} color="#FBBF24" />
              <Text style={styles.ratingText}>{item.rating?.toFixed(1) || '4.0'}</Text>
            </View>
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle} numberOfLines={2}>
              {item.name || item.title || 'Untitled'}
            </Text>
            <Text style={styles.cardCategory} numberOfLines={1}>
              {item.category || 'General'}
            </Text>
            <Text style={styles.cardDescription} numberOfLines={2}>
              {item.description || 'No description available'}
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderAllTitlesCard = (item: any, index: number) => {
    const cardWidth = isTablet ? 200 : 160;
    const cardHeight = isTablet ? 280 : 220;

    return (
      <Animated.View
        key={item._id || index}
        entering={FadeInUp.delay(index * 100)}
        style={[styles.allTitlesCard, { width: cardWidth, height: cardHeight }]}
      >
        <TouchableOpacity
          style={styles.cardTouchable}
          onPress={() => handleContentPress(item)}
          activeOpacity={0.8}
        >
          <View style={styles.cardImageContainer}>
            <Image
              source={{ 
                uri: item.image || 'https://via.placeholder.com/300x400/1F2937/FFFFFF?text=Cover'
              }}
              style={styles.cardImage}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['transparent', 'rgba(0, 0, 0, 0.8)']}
              style={styles.cardOverlay}
            />
            
            {/* Type Badge */}
            <View style={styles.typeBadge}>
              <Ionicons 
                name={getTypeIcon() as any} 
                size={12} 
                color="#FFFFFF" 
              />
              <Text style={styles.typeText}>{type?.charAt(0).toUpperCase() + type?.slice(1)}</Text>
            </View>

            {/* Rating */}
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={12} color="#FBBF24" />
              <Text style={styles.ratingText}>{item.rating?.toFixed(1) || '4.0'}</Text>
            </View>
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle} numberOfLines={2}>
              {item.name || item.title || 'Untitled'}
            </Text>
            <Text style={styles.cardCategory} numberOfLines={1}>
              {item.category || 'General'}
            </Text>
            <Text style={styles.cardDescription} numberOfLines={2}>
              {item.description || 'No description available'}
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderArticleItem = (item: any, index: number) => {
    return (
      <Animated.View
        key={item._id || index}
        entering={FadeInUp.delay(index * 100)}
        style={styles.articleItem}
      >
        <TouchableOpacity
          style={styles.articleTouchable}
          onPress={() => handleContentPress(item)}
          activeOpacity={0.8}
        >
          <View style={styles.articleContent}>
            {/* Article Source */}
            <Text style={styles.articleSource}>
              {item.category || 'General'}
            </Text>
            
            {/* Article Headline */}
            <Text style={styles.articleHeadline} numberOfLines={2}>
              {item.name || item.title || 'Untitled Article'}
            </Text>
            
            {/* Article Snippet */}
            <Text style={styles.articleSnippet} numberOfLines={2}>
              {item.description || 'No description available for this article.'}
            </Text>
            
            {/* Article Meta */}
            <View style={styles.articleMeta}>
              <View style={styles.articleMetaItem}>
                <Ionicons name="time-outline" size={16} color={theme.colors.textSecondary} />
                <Text style={styles.articleMetaText}>5 min read</Text>
              </View>
              <View style={styles.articleMetaItem}>
                <Ionicons name="calendar-outline" size={16} color={theme.colors.textSecondary} />
                <Text style={styles.articleMetaText}>Today</Text>
              </View>
            </View>
          </View>
          
          {/* Article Image (if available) */}
          <View style={styles.articleImageContainer}>
            <Image
              source={{ 
                uri: item.image || 'https://via.placeholder.com/80x80/1F2937/FFFFFF?text=Article'
              }}
              style={styles.articleImage}
              resizeMode="cover"
            />
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderDigestCard = (item: any, index: number) => {
    const cardWidth = isTablet ? 200 : 160;
    const cardHeight = isTablet ? 280 : 220;

    return (
      <Animated.View
        key={item._id || index}
        entering={FadeInUp.delay(index * 150).springify()}
        style={[styles.digestCard, { width: cardWidth, height: cardHeight }]}
      >
        <TouchableOpacity
          style={styles.digestCardTouchable}
          onPress={() => handleContentPress(item)}
          activeOpacity={0.8}
        >
          <View style={styles.digestCardImageContainer}>
            <Image
              source={{ 
                uri: item.image || 'https://via.placeholder.com/300x400/FF6B9D/FFFFFF?text=Story'
              }}
              style={styles.digestCardImage}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['transparent', 'rgba(255, 107, 157, 0.9)']}
              style={styles.digestCardOverlay}
            />
            
            {/* Super Fun Badge */}
            <View style={styles.digestBadge}>
              <Ionicons name="star" size={14} color="#FFFFFF" />
              <Text style={styles.digestBadgeText}>SUPER FUN!</Text>
            </View>

            {/* Age Badge */}
            <View style={styles.ageBadge}>
              <Text style={styles.ageBadgeText}>5+</Text>
            </View>

            {/* Play Button */}
            <View style={styles.playButton}>
              <Ionicons name="play" size={20} color="#FFFFFF" />
            </View>
          </View>

          <View style={styles.digestCardContent}>
            <Text style={styles.digestCardTitle} numberOfLines={2}>
              {item.name || item.title || 'Amazing Story'}
            </Text>
            <Text style={styles.digestCardCategory} numberOfLines={1}>
              {item.category || 'Adventure'}
            </Text>
            <Text style={styles.digestCardDescription} numberOfLines={2}>
              {item.description || 'An exciting story for kids!'}
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: isTablet ? theme.spacing['2xl'] : theme.spacing.lg,
      paddingTop: theme.spacing.lg,
      paddingBottom: theme.spacing.xl,
    },
    backButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    headerTitle: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize['2xl'],
      fontWeight: theme.typography.fontWeight.bold as any,
      flex: 1,
    },
    headerIcon: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    contentSection: {
      paddingHorizontal: isTablet ? theme.spacing['2xl'] : theme.spacing.lg,
    },
    contentGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: theme.spacing.lg,
    },
    contentCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      overflow: 'hidden',
      elevation: 4,
      shadowColor: theme.colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    cardTouchable: {
      flex: 1,
    },
    cardImageContainer: {
      position: 'relative',
      height: '60%',
    },
    cardImage: {
      width: '100%',
      height: '100%',
    },
    cardOverlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '50%',
    },
    typeBadge: {
      position: 'absolute',
      top: theme.spacing.sm,
      left: theme.spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.sm,
      gap: theme.spacing.xs,
    },
    typeText: {
      color: '#FFFFFF',
      fontSize: theme.typography.fontSize.xs,
      fontWeight: theme.typography.fontWeight.medium as any,
    },
    ratingContainer: {
      position: 'absolute',
      top: theme.spacing.sm,
      right: theme.spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.sm,
      gap: theme.spacing.xs,
    },
    ratingText: {
      color: '#FFFFFF',
      fontSize: theme.typography.fontSize.xs,
      fontWeight: theme.typography.fontWeight.medium as any,
    },
    cardContent: {
      padding: theme.spacing.md,
      flex: 1,
    },
    cardTitle: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.semibold as any,
      marginBottom: theme.spacing.xs,
    },
    cardCategory: {
      color: theme.colors.primary,
      fontSize: theme.typography.fontSize.xs,
      fontWeight: theme.typography.fontWeight.medium as any,
      marginBottom: theme.spacing.xs,
    },
    cardDescription: {
      color: '#FFFFFF',
      fontSize: theme.typography.fontSize.xs,
      lineHeight: theme.typography.lineHeight.tight,
      fontWeight: theme.typography.fontWeight.medium as any,
      textShadowColor: 'rgba(0, 0, 0, 0.8)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 1,
    },
    emptyState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing['2xl'],
    },
    emptyIcon: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.lg,
    },
    emptyTitle: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.xl,
      fontWeight: theme.typography.fontWeight.bold as any,
      marginBottom: theme.spacing.sm,
      textAlign: 'center',
    },
    emptyDescription: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSize.base,
      textAlign: 'center',
      lineHeight: theme.typography.lineHeight.normal,
    },
    section: {
      marginBottom: theme.spacing['2xl'],
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: isTablet ? theme.spacing['2xl'] : theme.spacing.lg,
      marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.xl,
      fontWeight: theme.typography.fontWeight.bold as any,
    },
    sectionArrow: {
      color: theme.colors.textSecondary,
    },
    horizontalScrollContainer: {
      paddingLeft: isTablet ? theme.spacing['2xl'] : theme.spacing.lg,
      paddingRight: theme.spacing.lg,
    },
    popularCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      overflow: 'hidden',
      elevation: 4,
      shadowColor: theme.colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      marginRight: theme.spacing.lg,
    },
    allTitlesCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      overflow: 'hidden',
      elevation: 4,
      shadowColor: theme.colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      marginRight: theme.spacing.lg,
    },
    articlesContainer: {
      paddingHorizontal: isTablet ? theme.spacing['2xl'] : theme.spacing.lg,
    },
    articleItem: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing.md,
      overflow: 'hidden',
      elevation: 1,
      shadowColor: theme.colors.text,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
    articleTouchable: {
      flexDirection: 'row',
      padding: theme.spacing.lg,
      alignItems: 'flex-start',
    },
    articleContent: {
      flex: 1,
      marginRight: theme.spacing.lg,
    },
    articleSource: {
      color: theme.colors.primary,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.medium as any,
      marginBottom: theme.spacing.xs,
    },
    articleHeadline: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.bold as any,
      marginBottom: theme.spacing.sm,
      lineHeight: theme.typography.lineHeight.tight,
    },
    articleSnippet: {
      color: '#FFFFFF',
      fontSize: theme.typography.fontSize.base,
      lineHeight: theme.typography.lineHeight.normal,
      marginBottom: theme.spacing.md,
      fontWeight: theme.typography.fontWeight.medium as any,
      textShadowColor: 'rgba(0, 0, 0, 0.8)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
    },
    articleMeta: {
      flexDirection: 'row',
      gap: theme.spacing.lg,
    },
    articleMetaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    articleMetaText: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSize.sm,
    },
    articleImageContainer: {
      width: 80,
      height: 80,
      borderRadius: theme.borderRadius.md,
      overflow: 'hidden',
      backgroundColor: theme.colors.surfaceLight,
    },
    articleImage: {
      width: '100%',
      height: '100%',
    },
    // Digest Styles - Kid-Friendly Design
    digestContainer: {
      paddingHorizontal: isTablet ? theme.spacing['2xl'] : theme.spacing.lg,
    },
    digestSection: {
      marginBottom: theme.spacing['2xl'],
    },
    digestSectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: isTablet ? theme.spacing['2xl'] : theme.spacing.lg,
      marginBottom: theme.spacing.lg,
    },
    digestTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    digestSectionTitle: {
      color: '#FFD700',
      fontSize: theme.typography.fontSize.xl,
      fontWeight: theme.typography.fontWeight.bold as any,
      textShadowColor: 'rgba(0, 0, 0, 0.5)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
    },
    digestCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      overflow: 'hidden',
      elevation: 6,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      marginRight: theme.spacing.lg,
      borderWidth: 2,
      borderColor: theme.colors.primary,
    },
    digestCardTouchable: {
      flex: 1,
    },
    digestCardImageContainer: {
      position: 'relative',
      height: '60%',
    },
    digestCardImage: {
      width: '100%',
      height: '100%',
    },
    digestCardOverlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '50%',
    },
    digestBadge: {
      position: 'absolute',
      top: theme.spacing.sm,
      left: theme.spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FF6B6B',
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.lg,
      gap: theme.spacing.xs,
      borderWidth: 2,
      borderColor: '#FFFFFF',
    },
    digestBadgeText: {
      color: '#FFFFFF',
      fontSize: theme.typography.fontSize.xs,
      fontWeight: theme.typography.fontWeight.bold as any,
    },
    ageBadge: {
      position: 'absolute',
      top: theme.spacing.sm,
      right: theme.spacing.sm,
      backgroundColor: '#4ECDC4',
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 2,
      borderColor: '#FFFFFF',
    },
    ageBadgeText: {
      color: '#FFFFFF',
      fontSize: theme.typography.fontSize.xs,
      fontWeight: theme.typography.fontWeight.bold as any,
    },
    digestCardContent: {
      padding: theme.spacing.md,
      flex: 1,
      backgroundColor: theme.colors.surface,
    },
    digestCardTitle: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.bold as any,
      marginBottom: theme.spacing.xs,
    },
    digestCardCategory: {
      color: theme.colors.primary,
      fontSize: theme.typography.fontSize.xs,
      fontWeight: theme.typography.fontWeight.medium as any,
      marginBottom: theme.spacing.xs,
    },
    digestCardDescription: {
      color: '#FFFFFF',
      fontSize: theme.typography.fontSize.xs,
      lineHeight: theme.typography.lineHeight.tight,
      fontWeight: theme.typography.fontWeight.medium as any,
      textShadowColor: 'rgba(0, 0, 0, 0.8)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 1,
    },
    digestEmptyState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing['2xl'],
    },
    digestEmptyIcon: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: theme.colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.lg,
      borderWidth: 3,
      borderColor: theme.colors.primary,
    },
    digestEmptyTitle: {
      color: theme.colors.primary,
      fontSize: theme.typography.fontSize.xl,
      fontWeight: theme.typography.fontWeight.bold as any,
      marginBottom: theme.spacing.sm,
      textAlign: 'center',
      textShadowColor: 'rgba(0, 0, 0, 0.5)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
    },
    digestEmptyDescription: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSize.base,
      textAlign: 'center',
      lineHeight: theme.typography.lineHeight.normal,
    },
    // New Super Attractive Digest Styles
    digestBanner: {
      marginBottom: theme.spacing.lg,
      marginHorizontal: isTablet ? theme.spacing['2xl'] : theme.spacing.lg,
    },
    digestBannerGradient: {
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
    },
    digestBannerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.md,
    },
    digestBannerTitle: {
      color: '#FFFFFF',
      fontSize: theme.typography.fontSize['2xl'],
      fontWeight: theme.typography.fontWeight.bold as any,
      textAlign: 'center',
      textShadowColor: 'rgba(0, 0, 0, 0.5)',
      textShadowOffset: { width: 2, height: 2 },
      textShadowRadius: 4,
    },
    digestIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    playButton: {
      position: 'absolute',
      bottom: theme.spacing.sm,
      right: theme.spacing.sm,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 3,
      borderColor: '#FFFFFF',
      elevation: 4,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.5,
      shadowRadius: 4,
    },
    digestEmptyEmojis: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: theme.spacing.lg,
      marginTop: theme.spacing.lg,
    },
    digestEmptyEmoji: {
      fontSize: 32,
    },
  });

  if (loading && content.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{getTypeTitle()}</Text>
          <View style={styles.headerIcon}>
            <Ionicons name={getTypeIcon() as any} size={20} color={theme.colors.textInverse} />
          </View>
        </View>
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Ionicons name="refresh" size={32} color={theme.colors.textSecondary} />
          </View>
          <Text style={styles.emptyTitle}>Loading...</Text>
          <Text style={styles.emptyDescription}>Please wait while we fetch your content</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    console.log('🔍 Content Debug - Error occurred:', error);
  }
  
  if (error && content.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{getTypeTitle()}</Text>
          <View style={styles.headerIcon}>
            <Ionicons name={getTypeIcon() as any} size={20} color={theme.colors.textInverse} />
          </View>
        </View>
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Ionicons name="alert-circle" size={32} color={theme.colors.error} />
          </View>
          <Text style={styles.emptyTitle}>Something went wrong</Text>
          <Text style={styles.emptyDescription}>Unable to load content. Please try again later.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{getTypeTitle()}</Text>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {content.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name={getTypeIcon() as any} size={32} color={theme.colors.textSecondary} />
            </View>
            <Text style={styles.emptyTitle}>No {getTypeTitle()} Found</Text>
            <Text style={styles.emptyDescription}>
              We couldn't find any {getTypeTitle().toLowerCase()} at the moment. Check back later for new content.
            </Text>
          </View>
        ) : (
          <>
            {type === 'articles' ? (
              // Articles - Vertical List Layout
              <View style={styles.articlesContainer}>
                {content.length > 0 ? (
                  content.map((item, index) => renderArticleItem(item, index))
                ) : (
                  <View style={styles.emptyState}>
                    <View style={styles.emptyIcon}>
                      <Ionicons name="document-text-outline" size={32} color={theme.colors.textSecondary} />
                    </View>
                    <Text style={styles.emptyTitle}>No Articles Found</Text>
                    <Text style={styles.emptyDescription}>
                      We couldn't find any articles at the moment. Check back later for new content.
                    </Text>
                  </View>
                )}
              </View>
            ) : type === 'digests' ? (
              // Digests - Super Attractive Cartoon Layout for Kids
              <View style={styles.digestContainer}>
                {/* Animated Header Banner */}
                <Animated.View 
                  entering={FadeInDown.delay(100)}
                  style={styles.digestBanner}
                >
                  <LinearGradient
                    colors={[theme.colors.primary, theme.colors.primaryDark, '#FFD700']}
                    style={styles.digestBannerGradient}
                  >
                    <View style={styles.digestBannerContent}>
                      <Ionicons name="color-palette" size={32} color="#FFFFFF" />
                      <Text style={styles.digestBannerTitle}>🌟 KIDS ZONE 🌟</Text>
                      <Ionicons name="color-palette" size={32} color="#FFFFFF" />
                    </View>
                  </LinearGradient>
                </Animated.View>

                {content.length > 0 ? (
                  <>
                    {/* Magical Stories Section */}
                    <Animated.View entering={FadeInUp.delay(200)} style={styles.digestSection}>
                      <View style={styles.digestSectionHeader}>
                        <View style={styles.digestTitleContainer}>
                          <View style={styles.digestIconContainer}>
                            <Ionicons name="sparkles" size={28} color="#FFD700" />
                          </View>
                          <Text style={styles.digestSectionTitle}>✨ Magical Stories ✨</Text>
                          <View style={styles.digestIconContainer}>
                            <Ionicons name="sparkles" size={28} color="#FFD700" />
                          </View>
                        </View>
                      </View>
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.horizontalScrollContainer}
                      >
                        {content.slice(0, 6).map((item, index) => renderDigestCard(item, index))}
                      </ScrollView>
                    </Animated.View>

                    {/* Super Heroes Section */}
                    <Animated.View entering={FadeInUp.delay(300)} style={styles.digestSection}>
                      <View style={styles.digestSectionHeader}>
                        <View style={styles.digestTitleContainer}>
                          <View style={styles.digestIconContainer}>
                            <Ionicons name="flash" size={28} color="#FF6B6B" />
                          </View>
                          <Text style={styles.digestSectionTitle}>🦸‍♂️ Super Heroes 🦸‍♀️</Text>
                          <View style={styles.digestIconContainer}>
                            <Ionicons name="flash" size={28} color="#FF6B6B" />
                          </View>
                        </View>
                      </View>
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.horizontalScrollContainer}
                      >
                        {content.slice(6).map((item, index) => renderDigestCard(item, index))}
                      </ScrollView>
                    </Animated.View>
                  </>
                ) : (
                  <Animated.View entering={FadeInUp.delay(400)} style={styles.digestEmptyState}>
                                         <View style={styles.digestEmptyIcon}>
                       <Ionicons name="happy" size={64} color={theme.colors.primary} />
                     </View>
                    <Text style={styles.digestEmptyTitle}>🎈 No Stories Yet! 🎈</Text>
                    <Text style={styles.digestEmptyDescription}>
                      We're cooking up some amazing adventures for you! 🚀✨
                    </Text>
                    <View style={styles.digestEmptyEmojis}>
                      <Text style={styles.digestEmptyEmoji}>🎨</Text>
                      <Text style={styles.digestEmptyEmoji}>🎭</Text>
                      <Text style={styles.digestEmptyEmoji}>🎪</Text>
                    </View>
                  </Animated.View>
                )}
              </View>
            ) : (
              // Magazines - Regular Horizontal Card Layout
              <>
                {content.length > 0 ? (
                  <>
                    {/* Most Popular Section */}
                    <View style={styles.section}>
                      <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Most popular titles</Text>
                        <Ionicons name="chevron-forward" size={20} style={styles.sectionArrow} />
                      </View>
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.horizontalScrollContainer}
                      >
                        {content.slice(0, 6).map((item, index) => renderPopularCard(item, index))}
                      </ScrollView>
                    </View>

                    {/* All Titles Section */}
                    <View style={styles.section}>
                      <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>All titles</Text>
                        <Ionicons name="chevron-forward" size={20} style={styles.sectionArrow} />
                      </View>
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.horizontalScrollContainer}
                      >
                        {content.slice(6).map((item, index) => renderAllTitlesCard(item, index))}
                      </ScrollView>
                    </View>
                  </>
                ) : (
                  <View style={styles.emptyState}>
                    <View style={styles.emptyIcon}>
                      <Ionicons name={getTypeIcon() as any} size={32} color={theme.colors.textSecondary} />
                    </View>
                    <Text style={styles.emptyTitle}>No {getTypeTitle()} Found</Text>
                    <Text style={styles.emptyDescription}>
                      We couldn't find any {getTypeTitle().toLowerCase()} at the moment. Check back later for new content.
                    </Text>
                  </View>
                )}
              </>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
} 