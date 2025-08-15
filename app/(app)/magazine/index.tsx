import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ActivityIndicator, Modal, ScrollView } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { ScreenWrapper } from '@/components';
import { ContentCarousel, CoverCardPortrait, MasonryGrid, SectionHeader } from '@/components/home';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchMagazinesOnly } from '@/redux/actions/magazineActions';
import { selectMagazines, selectMagazineLoading, selectMagazineError } from '@/redux/selectors/magazineSelectors';

const MagazinesScreen: React.FC = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const magazines = useAppSelector(selectMagazines) as any[];
  const loading = useAppSelector(selectMagazineLoading);
  const error = useAppSelector(selectMagazineError) as string | null;

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    if (!magazines || magazines.length === 0) {
      dispatch(fetchMagazinesOnly(undefined));
    }
  }, [dispatch]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    magazines?.forEach((m: any) => {
      if (m?.category && typeof m.category === 'string') set.add(m.category);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [magazines]);

  const filteredMagazines = useMemo(() => {
    if (!selectedCategory) return magazines;
    return magazines.filter((m: any) => m.category === selectedCategory);
  }, [magazines, selectedCategory]);

  const popularMagazines = useMemo(() => {
    const score = (m: any) => (Number(m.rating ?? 0) * 1000) + Number(m.downloads ?? 0);
    return [...filteredMagazines].sort((a, b) => score(b) - score(a));
  }, [filteredMagazines]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const navigateToDetail = useCallback((id: string) => {
    router.push(`/magazine/${id}`);
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
    content: {
      paddingTop: theme.spacing.sm,
    },
    filterRow: {
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    categoryButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surfaceLight,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.full,
    },
    categoryText: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.medium as any,
      marginRight: theme.spacing.xs,
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
    loaderContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalBackdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
    },
    modalSheet: {
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.lg,
      borderTopLeftRadius: theme.borderRadius.xl,
      borderTopRightRadius: theme.borderRadius.xl,
      maxHeight: '70%',
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.md,
    },
    modalTitle: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.xl,
      fontWeight: theme.typography.fontWeight.bold as any,
    },
    modalClose: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.colors.surfaceLight,
      alignItems: 'center',
      justifyContent: 'center',
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.md,
    },
    checkbox: {
      width: 22,
      height: 22,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    optionLabel: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.medium as any,
    },
    sectionSpacer: {
      height: theme.spacing.lg,
    },
    emptyText: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSize.base,
      textAlign: 'center',
      paddingVertical: theme.spacing.lg,
    },
  });

  if (loading && (!magazines || magazines.length === 0)) {
    return (
      <ScreenWrapper>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} activeOpacity={0.8} onPress={handleBack}>
            <Ionicons name="chevron-back" size={20} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Magazines</Text>
        </View>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper bottomSafeArea>
      <Animated.View entering={FadeInDown.delay(120)} style={styles.header}>
        <TouchableOpacity style={styles.backButton} activeOpacity={0.8} onPress={handleBack}>
          <Ionicons name="chevron-back" size={20} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Magazines</Text>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={[styles.filterRow, { justifyContent: 'flex-end' }]}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.categoryButton}
            onPress={() => setCategoryOpen(true)}
          >
            <Text style={styles.categoryText}>
              {selectedCategory ? selectedCategory : 'Categories'}
            </Text>
            <Ionicons name="chevron-down" size={16} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        <SectionHeader title="Most Popular Magazines" />
        <ContentCarousel
          data={popularMagazines.slice(0, 12)}
          renderItem={(item: any, index: number) => (
            <CoverCardPortrait
              item={item}
              index={index}
              onPress={() => navigateToDetail(item._id ?? String(item.mid))}
            />
          )}
        />

        <View style={styles.sectionSpacer} />

        <SectionHeader title="All Magazines" />
        {filteredMagazines.length === 0 ? (
          <Text style={styles.emptyText}>No magazines found.</Text>
        ) : (
          <MasonryGrid
            data={filteredMagazines.slice(0, 6)}
            columns={3}
            renderItem={(item: any, idx: number) => (
              <CoverCardPortrait
                item={item}
                index={idx}
                onPress={() => navigateToDetail(item._id ?? String(item.mid))}
              />
            )}
          />
        )}
      </ScrollView>

      <Modal
        visible={categoryOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setCategoryOpen(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.modalBackdrop}
          onPress={() => setCategoryOpen(false)}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter by category</Text>
              <TouchableOpacity style={styles.modalClose} onPress={() => setCategoryOpen(false)}>
                <Ionicons name="close" size={18} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {["All", ...categories].map((cat) => {
                const isSelected = selectedCategory ? cat === selectedCategory : cat === 'All';
                return (
                  <TouchableOpacity
                    key={cat}
                    style={styles.option}
                    activeOpacity={0.85}
                    onPress={() => {
                      if (cat === 'All') setSelectedCategory(null);
                      else setSelectedCategory(cat);
                      setCategoryOpen(false);
                    }}
                  >
                    <View style={styles.checkbox}>
                      {isSelected && (
                        <Ionicons name="checkmark" size={16} color={theme.colors.primary} />
                      )}
                    </View>
                    <Text style={styles.optionLabel}>{cat}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </ScreenWrapper>
  );
};

export default MagazinesScreen;
