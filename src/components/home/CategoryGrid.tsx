import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useWindowDimensions } from '@/hooks/useWindowDimensions';

interface CategoryGridProps {
  onPressCategory?: (key: string) => void;
  onPressSeeAll?: () => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ onPressCategory, onPressSeeAll }) => {
  const { theme } = useTheme();
  const { width: screenWidth } = useWindowDimensions();

  // Categories from Explore screen (first 6)
  const exploreCategories = [
    {
      id: 'newspapers',
      name: 'Newspapers',
      icon: 'newspaper-outline',
      gradient: [theme.colors.info, theme.colors.primaryDark],
    },
    {
      id: 'aeroplanes',
      name: 'Aeroplanes',
      icon: 'airplane-outline', 
      gradient: [theme.colors.primary, theme.colors.primaryDark],
    },
    {
      id: 'animals',
      name: 'Animals',
      icon: 'paw-outline',
      gradient: [theme.colors.warning, theme.colors.primaryDark],
    },
    {
      id: 'art',
      name: 'Art & Culture',
      icon: 'color-palette-outline',
      gradient: [theme.colors.success, theme.colors.primaryDark],
    },
    {
      id: 'boats',
      name: 'Boats',
      icon: 'boat-outline',
      gradient: [theme.colors.primary, theme.colors.primaryDark],
    },
    {
      id: 'business',
      name: 'Business',
      icon: 'trending-up-outline',
      gradient: [theme.colors.warning, theme.colors.primaryDark],
    },
  ];

  const data = exploreCategories;

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: theme.spacing.lg,
      width: '100%',
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    tile: {
      width: '48%',
      height: 80,
      borderRadius: theme.borderRadius.lg,
      overflow: 'hidden',
      marginBottom: theme.spacing.md,
    },
    tileGradient: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.md,
    },
    label: {
      color: theme.colors.textInverse,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.semibold as any,
      textAlign: 'center',
      marginTop: theme.spacing.xs,
    },
    seeAllBtn: {
      marginTop: theme.spacing.sm,
      alignSelf: 'stretch',
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    seeAllText: {
      color: theme.colors.textInverse,
      fontWeight: theme.typography.fontWeight.semibold as any,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {data.slice(0, 6).map((c) => (
          <TouchableOpacity key={c.id} style={styles.tile} activeOpacity={0.9} onPress={() => onPressCategory?.(c.id)}>
            <LinearGradient
              colors={c.gradient as [string, string]}
              style={styles.tileGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name={c.icon as any} size={24} color={theme.colors.textInverse} />
              <Text style={styles.label} numberOfLines={2}>{c.name}</Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
      {!!onPressSeeAll && (
        <TouchableOpacity style={styles.seeAllBtn} activeOpacity={0.9} onPress={onPressSeeAll}>
          <Text style={styles.seeAllText}>See all categories</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};


