import React, { useEffect, useMemo, useState } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { useTheme } from '@/context/ThemeContext';
import { useWindowDimensions } from '@/hooks/useWindowDimensions';
import { SectionHeader, ContentCarousel, CategoryTabs, FeaturedHero, CoverCardPortrait, CategoryGrid, MasonryGrid, ArticleRowCard } from '@/components/home';
import { ScreenHeader, ScreenWrapper } from '@/components';
import { 
  fetchMagazinesOnly,
  fetchArticlesOnly,
  fetchDigestsOnly,
  selectMagazines,
  selectArticles,
  selectDigests,
  selectMagazineLoading,
  selectMagazineError,
} from '@/redux/selectors';
import { AppDispatch } from '@/redux/store';
import { router } from 'expo-router';

type CategoryKey = 'magazines' | 'digests' | 'articles';

export default function HomeScreen() {
  const { theme } = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const dispatch = useDispatch<AppDispatch>();

  const [refreshing, setRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('');

  const magazines = useSelector(selectMagazines);
  const articles = useSelector(selectArticles);
  const digests = useSelector(selectDigests);
  const loading = useSelector(selectMagazineLoading);
  const error = useSelector(selectMagazineError);

  const isTablet = screenWidth >= 768;

  useEffect(() => {
    dispatch(fetchMagazinesOnly(undefined));
    dispatch(fetchArticlesOnly(undefined));
    dispatch(fetchDigestsOnly(undefined));
  }, [dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      dispatch(fetchMagazinesOnly(undefined)),
      dispatch(fetchArticlesOnly(undefined)),
      dispatch(fetchDigestsOnly(undefined)),
    ]);
    setRefreshing(false);
  };

  const featuredMagazine = useMemo(() => magazines[0] ?? null, [magazines]);
  const featuredDigest = useMemo(() => digests[0] ?? null, [digests]);
  const featuredArticle = useMemo(() => articles[0] ?? null, [articles]);

  const recentlyPublishedMagazines = useMemo(() =>
    [...magazines].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [magazines]
  );
  const recommendedMagazines = useMemo(() =>
    [...magazines].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)),
    [magazines]
  );
  const popularDigests = useMemo(() =>
    [...digests].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)),
    [digests]
  );
  const newDigests = useMemo(() =>
    [...digests].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [digests]
  );
  const newArticles = useMemo(() =>
    [...articles].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [articles]
  );
  const trendingArticles = useMemo(() =>
    [...articles].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)),
    [articles]
  );

  const handleSeeAll = (type: CategoryKey) => {
    router.push(`/content/${type}`);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
    },
    section: {
      marginTop: theme.spacing.lg,
    },
    sectionInner: {
      paddingVertical: theme.spacing.sm,
    },
    heroSpacer: {
      height: theme.spacing.lg,
    },
  });

  return (
    <ScreenWrapper>
      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Screen Header */}
        <ScreenHeader title="Home" />

        {/* Top category navigation */}
        <CategoryTabs active={activeCategory} onChange={(key) => {
          switch (key) {
            case 'magazines':
              router.push('/(app)/magazine/');
              break;
            case 'digests':
              // setActiveCategory('digests');
              break;
            case 'articles':
              router.push('/(app)/article/');
              break;
            default:
              break;
          }
        }} /> 

        {/* Featured Magazine */}
        <View style={styles.heroSpacer} />
        <SectionHeader title="Featured Magazine" />
        <FeaturedHero
          item={featuredMagazine}
          onPress={() => featuredMagazine && router.push(`/magazine/${featuredMagazine.mid}`)}
        />

        {/* Recently Published (Magazines) */}
        <View style={styles.section}>
          <SectionHeader
            title="Recently Published"
            onPressSeeAll={() => handleSeeAll('magazines')}
          />
          <ContentCarousel
            data={recentlyPublishedMagazines.slice(0, 12)}
            renderItem={(item, index) => (
              <CoverCardPortrait
                item={item as any}
                index={index}
                onPress={() => router.push(`/magazine/${(item as any).mid}`)}
              />
            )}
          />
        </View>

        <View style={styles.section}>
          <SectionHeader title="Recommended Magazines" onPressSeeAll={() => handleSeeAll('magazines')} />
          <ContentCarousel
            data={recommendedMagazines.slice(0, 12)}
            renderItem={(item, index) => (
              <CoverCardPortrait
                item={item as any}
                index={index}
                onPress={() => router.push(`/magazine/${(item as any).mid}`)}
              />
            )}
          />
        </View>

        {/* Digest sections */}
        <View style={styles.section}>
          <SectionHeader title="Featured Digest" onPressSeeAll={() => handleSeeAll('digests')} />
          <FeaturedHero
            item={featuredDigest}
            onPress={() => featuredDigest && router.push(`/digest/${featuredDigest.mid}`)}
          />
        </View>
        <View style={styles.section}>
          <SectionHeader title="Popular Digests" onPressSeeAll={() => handleSeeAll('digests')} />
          <ContentCarousel
            data={popularDigests.slice(0, 12)}
            renderItem={(item, index) => (
              <CoverCardPortrait
                item={item as any}
                index={index}
                onPress={() => router.push(`/digest/${(item as any).mid}`)}
              />
            )}
          />
          </View>
        <View style={styles.section}>
          <SectionHeader title="New Paigham Digests for You" onPressSeeAll={() => handleSeeAll('digests')} />
          <ContentCarousel
            data={newDigests.slice(0, 12)}
            renderItem={(item, index) => (
              <CoverCardPortrait
                item={item as any}
                index={index}
                onPress={() => router.push(`/digest/${(item as any).mid}`)}
              />
            )}
          />
          </View>

        {/* Articles */}
        <View style={styles.section}>
          <SectionHeader title="Featured Article" onPressSeeAll={() => handleSeeAll('articles')} />
          {featuredArticle && (
            <Animated.View entering={FadeInDown.delay(100)}>
              <ArticleRowCard item={featuredArticle as any} onPress={() => router.push(`/article/${featuredArticle.mid}`)} />
        </Animated.View>
          )}
          </View>
                <View style={styles.section}>
          <SectionHeader title="New Articles" onPressSeeAll={() => handleSeeAll('articles')} />
          <ContentCarousel
            data={newArticles.slice(0, 10)}
            itemWidth={isTablet ? 420 : 320}
            renderItem={(item, index) => (
              <ArticleRowCard item={item as any} index={index} onPress={() => router.push(`/article/${(item as any).mid}`)} />
            )}
          />
            </View>
        <View style={styles.section}>
          <SectionHeader title="Trending Articles" onPressSeeAll={() => handleSeeAll('articles')} />
          <ContentCarousel
            data={trendingArticles.slice(0, 10)}
            itemWidth={isTablet ? 420 : 320}
            renderItem={(item, index) => (
              <ArticleRowCard item={item as any} index={index} onPress={() => router.push(`/article/${(item as any).mid}`)} />
            )}
          />
            </View>

        {/* Explore Categories 2x3 with See All */}
        <View style={styles.section}>
          <SectionHeader title="Explore Categories" onPressSeeAll={() => router.push('/search')} />
          <CategoryGrid onPressCategory={() => router.push('/search')} onPressSeeAll={() => router.push('/search')} />
            </View>

                {/* Magazines Grid 3x2 */}
        <View style={styles.section}>
          <SectionHeader title="All Magazines" onPressSeeAll={() => handleSeeAll('magazines')} />
          <MasonryGrid
            data={magazines.slice(0, 6)}
            columns={3}
            renderItem={(item, idx) => (
              <CoverCardPortrait
                item={item as any}
                index={idx}
                onPress={() => router.push(`/magazine/${(item as any).mid}`)}
              />
            )}
          />
          </View>

        {/* Paigham Digests Grid 3x2 */}
        <View style={styles.section}>
          <SectionHeader title="Paigham Digests" onPressSeeAll={() => handleSeeAll('digests')} />
          <MasonryGrid
            data={digests.slice(0, 6)}
            columns={3}
            renderItem={(item, idx) => (
              <CoverCardPortrait
                item={item as any}
                index={idx}
                onPress={() => router.push(`/digest/${(item as any).mid}`)}
              />
            )}
          />
          </View>

        {/* Articles 1x6 */}
        <View style={styles.section}>
          <SectionHeader title="Latest Articles" onPressSeeAll={() => handleSeeAll('articles')} />
          {articles.slice(0, 6).map((item, index) => (
            <ArticleRowCard
              key={item._id || index}
              item={item as any}
              index={index}
              onPress={() => router.push(`/article/${(item as any).mid}`)}
            />
          ))}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}


