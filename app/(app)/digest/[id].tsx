import React, { useEffect, useCallback, useMemo } from 'react';
import { View, StyleSheet, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '@/components';
import { SectionHeader } from '@/components/home';
import { useTheme } from '@/context/ThemeContext';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchMagazineDetail } from '@/redux/actions/magazineActions';
import { selectSelectedMagazine, selectMagazineDetailLoading, selectMagazineError, selectDigests } from '@/redux/selectors/magazineSelectors';

const SingleDigestScreen: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { theme } = useTheme();
  const dispatch = useAppDispatch();

  const loading = useAppSelector(selectMagazineDetailLoading);
  const error = useAppSelector(selectMagazineError);
  const selectedDigest = useAppSelector(selectSelectedMagazine) as any; // Reusing magazine selector, will fetch digest by ID
  const allDigests = useAppSelector(selectDigests) as any[];

  useEffect(() => {
    if (id) {
      // Assuming fetchMagazineDetail can fetch any content by ID, if not, a new action is needed
      dispatch(fetchMagazineDetail(String(id)));
    }
  }, [dispatch, id]);

  const handleBack = useCallback(() => router.back(), [router]);
  const handleRead = useCallback(() => {
    // Navigate to PDF reader or content view when implemented
    console.log('Read Digest:', selectedDigest?.name);
    // router.push(`/reader?mid=${selectedDigest?.mid}`);
  }, [selectedDigest]);

  const relatedDigests = useMemo(() => {
    // Placeholder for related digests: filter by category or just show some random ones
    if (!allDigests.length || !selectedDigest?.category) return allDigests.slice(0, 4);
    return allDigests.filter(d => d.category === selectedDigest.category && d.mid !== selectedDigest.mid).slice(0, 4);
  }, [allDigests, selectedDigest]);

  const styles = StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      backgroundColor: theme.colors.background,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: theme.borderRadius.full,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.surfaceLight,
    },
    title: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize['2xl'],
      fontWeight: theme.typography.fontWeight.bold as any,
    },
    dotsButton: {
      width: 40,
      height: 40,
      borderRadius: theme.borderRadius.full,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.surfaceLight,
    },
    scrollContent: {
      paddingBottom: theme.spacing['2xl'],
    },
    hero: {
      marginHorizontal: theme.spacing.lg,
      borderRadius: theme.borderRadius.xl,
      overflow: 'hidden',
      backgroundColor: theme.colors.surface,
      ...theme.shadows.lg,
      height: 250,
      justifyContent: 'center',
      alignItems: 'center',
    },
    heroImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    heroPlayButton: {
      position: 'absolute',
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      ...theme.shadows.lg,
    },
    name: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize['2xl'],
      fontWeight: theme.typography.fontWeight.extrabold as any,
      textAlign: 'center',
      marginTop: theme.spacing.lg,
    },
    category: {
      color: theme.colors.textSecondary,
      textAlign: 'center',
      fontSize: theme.typography.fontSize.base,
      marginTop: theme.spacing.xs,
    },
    descriptionWrap: {
      paddingHorizontal: theme.spacing.lg,
      marginTop: theme.spacing.lg,
    },
    descriptionText: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSize.base,
      lineHeight: theme.typography.lineHeight.normal,
    },
    ctaRow: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      marginTop: theme.spacing.xl,
    },
    ctaButton: {
      flex: 1,
      height: 56,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: theme.spacing.sm,
      ...theme.shadows.md,
    },
    ctaText: {
      color: theme.colors.textInverse,
      fontWeight: theme.typography.fontWeight.bold as any,
      fontSize: theme.typography.fontSize.base,
    },
    relatedSection: {
      marginTop: theme.spacing['2xl'],
      paddingHorizontal: theme.spacing.lg,
    },
    relatedList: {
      paddingVertical: theme.spacing.md,
    },
    relatedCard: {
      width: 120,
      borderRadius: theme.borderRadius.lg,
      overflow: 'hidden',
      backgroundColor: theme.colors.surface,
      marginRight: theme.spacing.md,
      ...theme.shadows.sm,
    },
    relatedImage: {
      width: '100%',
      height: 120,
      resizeMode: 'cover',
    },
    relatedTitle: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.bold as any,
      padding: theme.spacing.sm,
    },
    center: { // Add this style definition
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

  if (loading && !selectedDigest) {
    return (
      <ScreenWrapper>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </ScreenWrapper>
    );
  }

  if (error) {
    return (
      <ScreenWrapper>
        <View style={styles.center}>
          <Text style={{ color: theme.colors.error }}>Error: {error}</Text>
        </View>
      </ScreenWrapper>
    );
  }

  if (!selectedDigest) {
    return (
      <ScreenWrapper>
        <View style={styles.center}>
          <Text style={{ color: theme.colors.textSecondary }}>Digest not found.</Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper bottomSafeArea>
      <Animated.View entering={FadeInDown.delay(120)} style={styles.header}>
        <TouchableOpacity style={styles.backButton} activeOpacity={0.85} onPress={handleBack}>
          <Ionicons name="chevron-back" size={20} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Digest</Text>
        <TouchableOpacity style={styles.dotsButton} activeOpacity={0.85} onPress={() => console.log('More options')}>
          <Ionicons name="ellipsis-horizontal" size={20} color={theme.colors.text} />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Animated.View entering={FadeInUp.delay(140)} style={styles.hero}>
          <Image source={{ uri: selectedDigest.image }} style={styles.heroImage} />
          <TouchableOpacity style={styles.heroPlayButton} activeOpacity={0.8} onPress={handleRead}>
            <Ionicons name="play" size={32} color={theme.colors.textInverse} />
          </TouchableOpacity>
        </Animated.View>

        <Text style={styles.name}>{selectedDigest.name}</Text>
        <Text style={styles.category}>{selectedDigest.category}</Text>

        <View style={styles.ctaRow}>
          <TouchableOpacity style={styles.ctaButton} activeOpacity={0.9} onPress={handleRead}>
            <Ionicons name="book-outline" size={20} color={theme.colors.textInverse} />
            <Text style={styles.ctaText}>Read Now</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.descriptionWrap}>
          <Text style={styles.descriptionText}>{selectedDigest.description || 'No description available for this digest.'}</Text>
        </View>

        {relatedDigests.length > 0 && (
          <View style={styles.relatedSection}>
            <SectionHeader title="More Paigham Digests" />
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={relatedDigests}
              keyExtractor={(item) => String(item.mid)}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.relatedCard} onPress={() => router.push(`/digest/${item.mid}`)}>
                  <Image source={{ uri: item.image }} style={styles.relatedImage} />
                  <Text style={styles.relatedTitle} numberOfLines={2}>{item.name}</Text>
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.relatedList}
            />
          </View>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
};

export default SingleDigestScreen;
