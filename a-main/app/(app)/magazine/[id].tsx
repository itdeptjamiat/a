import React, { useEffect, useMemo, useCallback, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, ActivityIndicator, Modal, ScrollView } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { ScreenWrapper } from '@/components';
import { MasonryGrid, CoverCardPortrait, SectionHeader } from '@/components/home';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchMagazineDetail, fetchMagazinesOnly } from '@/redux/actions/magazineActions';
import { selectMagazines, selectSelectedMagazine, selectMagazineDetailLoading, selectMagazineError } from '@/redux/selectors/magazineSelectors';

const MagazineDetailScreen: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const loading = useAppSelector(selectMagazineDetailLoading);
  const error = useAppSelector(selectMagazineError);
  const selected = useAppSelector(selectSelectedMagazine) as any;
  const magazines = useAppSelector(selectMagazines) as any[];

  const [headerMenuOpen, setHeaderMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  useEffect(() => {
    if (id) dispatch(fetchMagazineDetail(String(id)));
    if (!magazines || magazines.length === 0) dispatch(fetchMagazinesOnly(undefined));
  }, [dispatch, id]);

  const issues = useMemo(() => {
    // Placeholder: use first 6 magazines as issues grid for now
    return magazines.slice(0, 6);
  }, [magazines]);

  const handleBack = useCallback(() => router.back(), [router]);

  const handleRead = useCallback(() => {
    if (!selected?.mid) return;
    router.push(`/reader?mid=${String(selected.mid)}`);
  }, [selected]);

  const styles = StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
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
    },
    dotsButton: {
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
    scrollContent: {
      paddingBottom: theme.spacing['2xl'],
    },
    hero: {
      marginHorizontal: theme.spacing.lg,
      borderRadius: theme.borderRadius.xl,
      overflow: 'hidden',
      backgroundColor: theme.colors.surface,
      ...theme.shadows.lg,
    },
    heroImage: {
      width: '100%',
      height: 220,
    },
    name: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize['2xl'],
      fontWeight: theme.typography.fontWeight.extrabold as any,
      textAlign: 'center',
      marginTop: theme.spacing.lg,
    },
    metaDate: {
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginTop: theme.spacing.xs,
    },
    ctaRow: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      marginTop: theme.spacing.lg,
    },
    cta: {
      flex: 1,
      height: 56,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    ctaPrimary: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primaryDark,
    },
    ctaText: {
      color: theme.colors.text,
      fontWeight: theme.typography.fontWeight.bold as any,
    },
    ctaTextPrimary: {
      color: theme.colors.textInverse,
    },
    section: {
      marginTop: theme.spacing['2xl'],
    },
    descriptionWrap: {
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.lg,
    },
    descriptionTitle: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.xl,
      fontWeight: theme.typography.fontWeight.bold as any,
      marginBottom: theme.spacing.sm,
    },
    descriptionText: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSize.base,
    },
    menuSheet: {
      position: 'absolute',
      right: theme.spacing.lg,
      top: 64,
      width: 220,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      borderWidth: 1,
      borderColor: theme.colors.border,
      ...theme.shadows.md,
      overflow: 'hidden',
    },
    bottomOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.25)',
      justifyContent: 'flex-end',
    },
    bottomSheet: {
      width: '100%',
      backgroundColor: theme.colors.surface,
      borderTopLeftRadius: theme.borderRadius.xl,
      borderTopRightRadius: theme.borderRadius.xl,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingBottom: theme.spacing.lg,
      ...theme.shadows.md,
      overflow: 'hidden',
    },
    bottomHandle: {
      alignSelf: 'center',
      width: 36,
      height: 4,
      borderRadius: 2,
      backgroundColor: theme.colors.border,
      marginVertical: theme.spacing.sm,
    },
    menuHeader: {
      padding: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    menuTitle: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.bold as any,
    },
    menuItem: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
    },
    menuText: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.base,
    },
  });

  if (loading && !selected) {
    return (
      <ScreenWrapper>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper bottomSafeArea={true} >
      <Animated.View entering={FadeInDown.delay(120)} style={styles.header}>
        <TouchableOpacity style={styles.backButton} activeOpacity={0.85} onPress={handleBack}>
          <Ionicons name="chevron-back" size={20} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Magazine</Text>
        <TouchableOpacity style={styles.dotsButton} activeOpacity={0.85} onPress={() => setHeaderMenuOpen((s) => !s)}>
          <Ionicons name="ellipsis-horizontal" size={20} color={theme.colors.text} />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {error ? (
          <View style={{ padding: theme.spacing.lg }}>
            <Text style={{ color: theme.colors.error }}>{error}</Text>
          </View>
        ) : null}

        {!!selected && (
          <>
            <Animated.View entering={FadeInUp.delay(140)} style={styles.hero}>
              <Image source={{ uri: selected.image }} style={styles.heroImage} resizeMode="cover" />
            </Animated.View>
            <Text style={styles.name}>{selected.name}</Text>
            <Text style={styles.metaDate}>{new Date(selected.createdAt).toDateString()}</Text>

            <View style={styles.ctaRow}>
              <TouchableOpacity style={[styles.cta, styles.ctaPrimary]} activeOpacity={0.9} onPress={handleRead}>
                <Ionicons name="book" size={18} color={theme.colors.textInverse} />
                <Text style={[styles.ctaText, styles.ctaTextPrimary]}>Read</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cta} activeOpacity={0.9} onPress={() => setMoreMenuOpen(true)}>
                <Ionicons name="ellipsis-horizontal" size={18} color={theme.colors.text} />
                <Text style={styles.ctaText}>More</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <SectionHeader title="Issues" />
              <MasonryGrid
                data={issues.slice(0, 6)}
                columns={3}
                renderItem={(item: any, idx: number) => (
                  <CoverCardPortrait
                    item={item}
                    index={idx}
                    onPress={() => router.push(`/magazine/${item._id ?? String(item.mid)}`)}
                  />
                )}
              />
            </View>

            <View style={styles.descriptionWrap}>
              <Text style={styles.descriptionTitle}>{selected.name}</Text>
              <Text style={styles.descriptionText}>{selected.description || 'No description available.'}</Text>
            </View>
          </>
        )}
      </ScrollView>

      <Modal transparent visible={headerMenuOpen} onRequestClose={() => setHeaderMenuOpen(false)}>
        <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={() => setHeaderMenuOpen(false)}>
          <View style={styles.menuSheet}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>{selected?.name ?? 'Options'}</Text>
            </View>
            <TouchableOpacity style={styles.menuItem} onPress={() => setHeaderMenuOpen(false)}>
              <Ionicons name="search" size={18} color={theme.colors.text} />
              <Text style={styles.menuText}>Preview cover</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => setHeaderMenuOpen(false)}>
              <Ionicons name="download" size={18} color={theme.colors.text} />
              <Text style={styles.menuText}>Download issue</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => setHeaderMenuOpen(false)}>
              <Ionicons name="share-social" size={18} color={theme.colors.text} />
              <Text style={styles.menuText}>Share issue</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => setHeaderMenuOpen(false)}>
              <Ionicons name="star" size={18} color={theme.colors.text} />
              <Text style={styles.menuText}>Favorite</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => setHeaderMenuOpen(false)}>
              <Ionicons name="eye-off" size={18} color={theme.colors.text} />
              <Text style={styles.menuText}>Hide</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal transparent visible={moreMenuOpen} onRequestClose={() => setMoreMenuOpen(false)}>
        <TouchableOpacity style={styles.bottomOverlay} activeOpacity={1} onPress={() => setMoreMenuOpen(false)}>
          <View style={styles.bottomSheet}>
            <View style={styles.bottomHandle} />
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>More</Text>
            </View>
            <TouchableOpacity style={styles.menuItem} onPress={() => setMoreMenuOpen(false)}>
              <Ionicons name="search" size={18} color={theme.colors.text} />
              <Text style={styles.menuText}>Preview cover</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => setMoreMenuOpen(false)}>
              <Ionicons name="download" size={18} color={theme.colors.text} />
              <Text style={styles.menuText}>Download</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => setMoreMenuOpen(false)}>
              <Ionicons name="share-social" size={18} color={theme.colors.text} />
              <Text style={styles.menuText}>Share issue</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </ScreenWrapper>
  );
};

export default MagazineDetailScreen;
