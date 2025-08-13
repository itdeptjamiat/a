import React, { useCallback, useEffect, useMemo } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { ScreenWrapper } from '@/components';
import { FeaturedHero, ArticleRowCard } from '@/components/home';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchArticlesOnly } from '@/redux/actions/magazineActions';
import { selectArticles, selectMagazineLoading, selectMagazineError } from '@/redux/selectors/magazineSelectors';

const ArticlesScreen: React.FC = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const articles = useAppSelector(selectArticles) as any[];
  const loading = useAppSelector(selectMagazineLoading);
  const error = useAppSelector(selectMagazineError) as string | null;

  useEffect(() => {
    if (!articles || articles.length === 0) {
      dispatch(fetchArticlesOnly(undefined));
    }
  }, [dispatch]);

  const sortedByDate = useMemo(() => {
    return [...articles].sort((a, b) => {
      const aTime = new Date(a.createdAt ?? 0).getTime();
      const bTime = new Date(b.createdAt ?? 0).getTime();
      return bTime - aTime;
    });
  }, [articles]);

  const featured = useMemo(() => sortedByDate[0] ?? null, [sortedByDate]);
  const rest = useMemo(() => (featured ? sortedByDate.slice(1) : sortedByDate), [sortedByDate, featured]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const navigateToDetail = useCallback((id: string) => {
    router.push(`/article/${id}`);
  }, [router]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: theme.borderRadius.full,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.surfaceLight,
      marginRight: theme.spacing.md,
    },
    title: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize['2xl'],
      fontWeight: theme.typography.fontWeight.bold as any,
    },
    listContent: {
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.xl,
    },
    separator: {
      height: 1,
      backgroundColor: theme.colors.border,
      marginVertical: theme.spacing.md,
    },
    loaderContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    errorContainer: {
      padding: theme.spacing.lg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    errorText: {
      color: theme.colors.error,
      fontSize: theme.typography.fontSize.base,
    },
    emptyText: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSize.base,
      textAlign: 'center',
      paddingVertical: theme.spacing.lg,
    },
  });

  if (loading && (!articles || articles.length === 0)) {
    return (
      <ScreenWrapper>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} activeOpacity={0.8} onPress={handleBack}>
            <Ionicons name="chevron-back" size={20} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Articles</Text>
        </View>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <Animated.View entering={FadeInDown.delay(120)} style={styles.header}>
        <TouchableOpacity style={styles.backButton} activeOpacity={0.8} onPress={handleBack}>
          <Ionicons name="chevron-back" size={20} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Articles</Text>
      </Animated.View>

      <FlatList
        data={rest}
        keyExtractor={(item: any, idx) => item._id?.toString?.() ?? String(item.mid ?? idx)}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          featured ? (
            <View>
              <FeaturedHero item={featured as any} onPress={() => navigateToDetail(featured._id ?? String(featured.mid))} />
              <View style={styles.separator} />
              <ArticleRowCard item={featured as any} index={0} onPress={() => navigateToDetail(featured._id ?? String(featured.mid))} />
              <View style={styles.separator} />
            </View>
          ) : null
        }
        renderItem={({ item, index }) => (
          <ArticleRowCard
            item={item as any}
            index={index}
            onPress={() => navigateToDetail(item._id ?? String(item.mid))}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={styles.emptyText}>No articles found.</Text>}
      />

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
    </ScreenWrapper>
  );
};

export default ArticlesScreen;


