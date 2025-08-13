import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl, TouchableOpacity, Text, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import Animated, { FadeInDown, FadeInUp, FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '@/context/ThemeContext';
import { useWindowDimensions } from '@/hooks/useWindowDimensions';
import { H1, H2, H3, Body } from '@/typography';
import { PostCard } from '@/components/PostCard';
import { CustomButton } from '@/components/CustomButton';
import { 
  fetchMagazines,
  selectMagazines,
  selectArticles,
  selectDigests,
  selectMagazineLoading,
  selectMagazineError,
  selectMagazinesCount,
  selectArticlesCount,
  selectDigestsCount,
  selectUser,
} from '@/redux/selectors';
import { AppDispatch } from '@/redux/store';
import { router } from 'expo-router';



const { width: screenWidth } = Dimensions.get('window');

export default function HomeScreen() {
  const { theme } = useTheme();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const dispatch = useDispatch<AppDispatch>();

  const [refreshing, setRefreshing] = useState(false);

  // Selectors
  const magazines = useSelector(selectMagazines);
  const articles = useSelector(selectArticles);
  const digests = useSelector(selectDigests);
  const loading = useSelector(selectMagazineLoading);
  const error = useSelector(selectMagazineError);
  const magazinesCount = useSelector(selectMagazinesCount);
  const articlesCount = useSelector(selectArticlesCount);
  const digestsCount = useSelector(selectDigestsCount);
  const user = useSelector(selectUser);



  const isTablet = screenWidth >= 768;

  useEffect(() => {
    dispatch(fetchMagazines());
  }, [dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchMagazines());
    setRefreshing(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning!';
    if (hour < 17) return 'Good afternoon!';
    return 'Good evening!';
  };

  // Get all content mixed together
  const getAllContent = () => {
    const allContent = [...magazines, ...articles, ...digests];
    
    // Debug logging
    console.log('🔍 Home Debug - All content counts:');
    console.log(`🔍 Home Debug - Magazines: ${magazines.length}`);
    console.log(`🔍 Home Debug - Articles: ${articles.length}`);
    console.log(`🔍 Home Debug - Digests: ${digests.length}`);
    console.log(`🔍 Home Debug - Total mixed content: ${allContent.length}`);
    
    return allContent;
  };

  // Content type buttons with clean, compact design
  const contentTypeButtons = [
    {
      id: 'magazines',
      title: 'Magazines',
      icon: 'book-outline',
    },
    {
      id: 'articles',
      title: 'Articles',
      icon: 'document-text-outline',
    },
    {
      id: 'digests',
      title: 'Digests',
      icon: 'newspaper-outline',
    },
  ];

  // Get latest content (first 3 items)
  const getLatestContent = () => {
    const allContent = getAllContent();
    return allContent.slice(0, 3);
  };

  // Get recommended content (items 4-6)
  const getRecommendedContent = () => {
    const allContent = getAllContent();
    return allContent.slice(3, 6);
  };

  // Get featured content (items 7-9)
  const getFeaturedContent = () => {
    const allContent = getAllContent();
    return allContent.slice(6, 9);
  };

  // Get popular content (items 10-12)
  const getPopularContent = () => {
    const allContent = getAllContent();
    return allContent.slice(9, 12);
  };

  // Categories based on available content
  const getCategories = () => {
    const allContent = [...magazines, ...articles, ...digests];
    const categories = [...new Set(allContent.map(item => item.category))];
    
    const categoryGradients = [
      ['#4A90E2', '#357ABD'],
      ['#9B59B6', '#8E44AD'],
      ['#E74C3C', '#C0392B'],
      ['#27AE60', '#229954'],
      ['#F39C12', '#E67E22'],
      ['#8B4513', '#A0522D'],
    ];

    return categories.slice(0, 6).map((category, index) => ({
      id: index.toString(),
      title: category,
      gradient: categoryGradients[index % categoryGradients.length],
    }));
  };

  const categories = getCategories();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
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
      marginRight: theme.spacing.lg,
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
    content: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: isTablet ? theme.spacing['2xl'] : theme.spacing.lg,
      paddingTop: theme.spacing.lg,
      paddingBottom: theme.spacing.xl,
    },
    headerTitle: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize['3xl'],
      fontWeight: theme.typography.fontWeight.bold as any,
    },
    profileButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: theme.colors.surface,
    },
    profileText: {
      color: theme.colors.textInverse,
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.bold as any,
    },
    profileImage: {
      width: 40,
      height: 40,
      borderRadius: 20,
      resizeMode: 'cover',
    },
    contentTypeSection: {
      marginBottom: theme.spacing['2xl'],
    },
    contentTypeScrollContainer: {
      paddingLeft: isTablet ? theme.spacing['2xl'] : theme.spacing.lg,
    },
    contentTypeButton: {
      width: 110,
      height: 44,
      marginRight: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.surface,
      ...theme.shadows.sm,
      elevation: 2,
      borderWidth: 1,
      borderColor: theme.colors.border,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.md,
    },
    contentTypeButtonActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
      ...theme.shadows.md,
      elevation: 4,
    },
    contentTypeContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    contentTypeIcon: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.sm,
    },
    contentTypeIconActive: {
      backgroundColor: theme.colors.textInverse,
    },
    contentTypeTitle: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.semibold as any,
    },
    contentTypeTitleActive: {
      color: theme.colors.textInverse,
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
      color: theme.colors.text,
    },
    horizontalScrollContainer: {
      paddingLeft: isTablet ? theme.spacing['2xl'] : theme.spacing.lg,
    },
    newspaperCard: {
      width: 120,
      height: 160,
      marginRight: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.surface,
      overflow: 'hidden',
      ...theme.shadows.md,
      elevation: 4,
    },
    newspaperImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    newspaperInfo: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      padding: theme.spacing.sm,
    },
    newspaperTitle: {
      color: theme.colors.textInverse,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.semibold as any,
      marginBottom: theme.spacing.xs,
    },
    newspaperDate: {
      color: 'rgba(255, 255, 255, 0.8)',
      fontSize: theme.typography.fontSize.xs,
    },
    newspaperDescription: {
      color: '#FFFFFF',
      fontSize: theme.typography.fontSize.xs,
      lineHeight: theme.typography.lineHeight.tight,
      fontWeight: theme.typography.fontWeight.medium as any,
      textShadowColor: 'rgba(0, 0, 0, 0.8)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 1,
      marginTop: theme.spacing.xs,
    },
    recommendedCard: {
      width: 200,
      marginRight: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.surface,
      overflow: 'hidden',
      ...theme.shadows.md,
      elevation: 4,
    },
    recommendedImage: {
      width: '100%',
      height: 120,
      resizeMode: 'cover',
    },
    recommendedContent: {
      padding: theme.spacing.md,
    },
    recommendedCategory: {
      color: theme.colors.primary,
      fontSize: theme.typography.fontSize.xs,
      fontWeight: theme.typography.fontWeight.medium as any,
      marginBottom: theme.spacing.xs,
    },
    recommendedHeadline: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.semibold as any,
      marginBottom: theme.spacing.xs,
      lineHeight: theme.typography.lineHeight?.tight as any * theme.typography.fontSize.base,
    },
    recommendedDescription: {
      color: '#FFFFFF',
      fontSize: theme.typography.fontSize.sm,
      lineHeight: theme.typography.lineHeight?.normal as any * theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.medium as any,
      textShadowColor: 'rgba(0, 0, 0, 0.8)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 1,
    },
    magazineCard: {
      width: 150,
      marginRight: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.surface,
      overflow: 'hidden',
      ...theme.shadows.md,
      elevation: 4,
    },
    magazineImage: {
      width: '100%',
      height: 200,
      resizeMode: 'cover',
    },
    magazineInfo: {
      padding: theme.spacing.sm,
    },
    magazineTitle: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.semibold as any,
      marginBottom: theme.spacing.xs,
    },
    magazineCategory: {
      color: theme.colors.primary,
      fontSize: theme.typography.fontSize.xs,
      fontWeight: theme.typography.fontWeight.medium as any,
    },
    categoryGrid: {
      paddingHorizontal: isTablet ? theme.spacing['2xl'] : theme.spacing.lg,
      marginBottom: theme.spacing.lg,
    },
    categoryRow: {
      flexDirection: 'row',
      marginBottom: theme.spacing.md,
    },
    categoryButton: {
      flex: 1,
      height: 80,
      marginHorizontal: theme.spacing.xs,
      borderRadius: theme.borderRadius.lg,
      overflow: 'hidden',
      ...theme.shadows.md,
      elevation: 4,
    },
    categoryGradient: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.md,
    },
    categoryText: {
      color: theme.colors.textInverse,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.semibold as any,
      textAlign: 'center',
    },
    allCategoriesButton: {
      height: 60,
      marginHorizontal: theme.spacing.xs,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      ...theme.shadows.md,
      elevation: 4,
    },
    allCategoriesText: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.semibold as any,
    },
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing['3xl'],
    },
    emptyIcon: {
      marginBottom: theme.spacing.lg,
    },
    emptyTitle: {
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
      textAlign: 'center',
    },
    emptySubtitle: {
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: theme.spacing.xl,
    },
  });

  const handleContentPress = (content: any) => {
    // Debug logging
    console.log('🔍 Navigation Debug - Content pressed:', {
      id: content._id,
      mid: content.mid,
      name: content.name,
      type: content.magzineType,
      category: content.category
    });
    
    // Use mid for API calls as that's what the API expects
    const contentId = content.mid;
    
    // Determine content type and navigate accordingly
    if (content.magzineType === 'magzine') {
      console.log('🔍 Navigation Debug - Navigating to magazine:', contentId);
      router.push(`/magazine/${contentId}`);
    } else if (content.magzineType === 'article') {
      console.log('🔍 Navigation Debug - Navigating to article:', contentId);
      router.push(`/article/${contentId}`);
    } else if (content.magzineType === 'digest') {
      console.log('🔍 Navigation Debug - Navigating to digest:', contentId);
      router.push(`/digest/${contentId}`);
    } else {
      // Default to magazine if type is unknown
      console.log('🔍 Navigation Debug - Unknown type, defaulting to magazine:', contentId);
      router.push(`/magazine/${contentId}`);
    }
  };

  const renderContentTypeButton = (contentType: any) => {
    return (
      <Animated.View
        key={contentType.id}
        entering={FadeInUp.delay(contentType.id === 'magazines' ? 200 : contentType.id === 'articles' ? 300 : 400)}
      >
        <TouchableOpacity
          style={styles.contentTypeButton}
          onPress={() => router.push(`/content/${contentType.id}`)}
          activeOpacity={0.8}
        >
          <View style={styles.contentTypeContent}>
            <View style={styles.contentTypeIcon}>
              <Ionicons
                name={contentType.icon as any}
                size={14}
                color={theme.colors.textInverse}
              />
            </View>
            <Text style={styles.contentTypeTitle}>
              {contentType.title}
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderNewspaperCard = (newspaper: any) => (
    <TouchableOpacity
      key={newspaper._id}
      style={styles.newspaperCard}
      onPress={() => handleContentPress(newspaper)}
      activeOpacity={0.9}
    >
      <Image 
        source={{ uri: newspaper.image || 'https://via.placeholder.com/120x160/1a1a1a/ffffff?text=Magazine' }} 
        style={styles.newspaperImage} 
      />
      <View style={styles.newspaperInfo}>
        <Text style={styles.newspaperTitle}>{newspaper.name}</Text>
        <Text style={styles.newspaperDate}>{newspaper.category}</Text>
        <Text style={styles.newspaperDescription} numberOfLines={2}>
          {newspaper.description || 'No description available'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderRecommendedCard = (item: any) => (
    <TouchableOpacity
      key={item._id}
      style={styles.recommendedCard}
      onPress={() => handleContentPress(item)}
      activeOpacity={0.9}
    >
      <Image 
        source={{ uri: item.image || 'https://via.placeholder.com/200x120/1a1a1a/ffffff?text=Magazine' }} 
        style={styles.recommendedImage} 
      />
      <View style={styles.recommendedContent}>
        <Text style={styles.recommendedCategory}>{item.category}</Text>
        <Text style={styles.recommendedHeadline} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.recommendedDescription} numberOfLines={2}>
          {item.description || 'No description available'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderContentCard = (item: any, index: number, section: string) => {
    const cardWidth = isTablet ? 200 : 160;
    const cardHeight = isTablet ? 280 : 220;

    return (
      <Animated.View
        key={item._id || index}
        entering={FadeInUp.delay(index * 100)}
        style={[styles.contentCard, { width: cardWidth, height: cardHeight }]}
      >
    <TouchableOpacity
          style={styles.cardTouchable}
          onPress={() => handleContentPress(item)}
          activeOpacity={0.8}
        >
          <View style={styles.cardImageContainer}>
            <Image
              source={{ 
                uri: item.image || 'https://via.placeholder.com/300x400/1F2937/FFFFFF?text=Content'
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
                name={item.magzineType === 'magzine' ? 'book-outline' : 
                      item.magzineType === 'article' ? 'document-text-outline' : 
                      'newspaper-outline'} 
                size={12} 
                color="#FFFFFF" 
              />
              <Text style={styles.typeText}>
                {item.magzineType === 'magzine' ? 'Magazine' : 
                 item.magzineType === 'article' ? 'Article' : 'Digest'}
              </Text>
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

  const renderCategoryButton = (category: any) => (
    <TouchableOpacity
      key={category.id}
      style={styles.categoryButton}
      onPress={() => handleContentPress(category)}
      activeOpacity={0.9}
    >
      <LinearGradient
        colors={category.gradient}
        style={styles.categoryGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.categoryText}>{category.title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons
        name="book-outline"
        size={64}
        color={theme.colors.textTertiary}
        style={styles.emptyIcon}
      />
      <H2 style={styles.emptyTitle}>
        {loading ? 'Loading...' : 'No content found'}
      </H2>
      <Body style={styles.emptySubtitle}>
        {loading 
          ? 'Loading your content...' 
          : 'No content available at the moment. Try refreshing or check back later.'
        }
      </Body>
      {!loading && (
        <CustomButton
          title="Refresh"
          onPress={onRefresh}
          variant="gradient"
        />
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.header}>
          <Text style={styles.headerTitle}>Home</Text>
          <TouchableOpacity style={styles.profileButton}>
            {user?.avatar && user.avatar !== '' ? (
              <Image 
                source={{ uri: user.avatar }} 
                style={styles.profileImage}
              />
            ) : (
              <Text style={styles.profileText}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </Text>
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* Content Type Buttons */}
        <Animated.View entering={FadeInUp.delay(300)} style={styles.contentTypeSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.contentTypeScrollContainer}
          >
            {contentTypeButtons.map(renderContentTypeButton)}
          </ScrollView>
        </Animated.View>



        {/* Latest Content */}
        <Animated.View entering={FadeInUp.delay(400)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Latest Content</Text>
            <Ionicons name="chevron-forward" size={20} style={styles.sectionArrow} />
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContainer}
          >
            {getLatestContent().map((item, index) => renderContentCard(item, index, 'latest'))}
          </ScrollView>
        </Animated.View>

        {/* Recommended for you */}
        <Animated.View entering={FadeInUp.delay(500)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended for you</Text>
            <Ionicons name="chevron-forward" size={20} style={styles.sectionArrow} />
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContainer}
          >
            {getRecommendedContent().map((item, index) => renderContentCard(item, index, 'recommended'))}
          </ScrollView>
        </Animated.View>

        {/* You might like */}
        <Animated.View entering={FadeInUp.delay(600)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>You might like</Text>
            <Ionicons name="chevron-forward" size={20} style={styles.sectionArrow} />
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContainer}
          >
            {getFeaturedContent().map((item, index) => renderContentCard(item, index, 'featured'))}
          </ScrollView>
        </Animated.View>

        {/* Categories Grid */}
        <Animated.View entering={FadeInUp.delay(700)} style={styles.section}>
          <View style={styles.categoryGrid}>
            <View style={styles.categoryRow}>
              {categories.slice(0, 2).map(renderCategoryButton)}
            </View>
            <View style={styles.categoryRow}>
              {categories.slice(2, 4).map(renderCategoryButton)}
            </View>
            <View style={styles.categoryRow}>
              {categories.slice(4, 6).map(renderCategoryButton)}
            </View>
            <TouchableOpacity style={styles.allCategoriesButton}>
              <Text style={styles.allCategoriesText}>All categories</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Favourited by others */}
        <Animated.View entering={FadeInUp.delay(800)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Favourited by others</Text>
            <Ionicons name="chevron-forward" size={20} style={styles.sectionArrow} />
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContainer}
          >
            {getPopularContent().map((item, index) => renderContentCard(item, index, 'popular'))}
          </ScrollView>
        </Animated.View>

        {/* Empty State */}
        {(loading || getAllContent().length === 0) && renderEmptyState()}
      </ScrollView>
    </SafeAreaView>
  );
}