import React from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';

type CategoryKey = 'magazines' | 'digests' | 'articles';

interface CategoryTabsProps {
  active: CategoryKey;
  onChange: (key: CategoryKey) => void;
}

const categories: Array<{ key: CategoryKey; label: string; icon: keyof typeof Ionicons.glyphMap }> = [
  { key: 'magazines', label: 'Magazines', icon: 'book-outline' },
  { key: 'digests', label: 'Digests', icon: 'newspaper-outline' },
  { key: 'articles', label: 'Articles', icon: 'document-text-outline' },
];

export const CategoryTabs: React.FC<CategoryTabsProps> = ({ active, onChange }) => {
  const { theme } = useTheme();
  const press = useSharedValue(1);

  const animated = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(press.value) }],
  }));

  const styles = StyleSheet.create({
    container: {
      paddingVertical: theme.spacing.md,
    },
    scroll: {
      paddingHorizontal: theme.spacing.lg,
    },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: theme.borderRadius.full,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      marginRight: theme.spacing.sm,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    chipActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primaryDark,
    },
    label: {
      color: theme.colors.text,
      marginLeft: theme.spacing.xs,
      fontWeight: theme.typography.fontWeight.medium as any,
    },
    labelActive: {
      color: theme.colors.textInverse,
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {categories.map(({ key, label, icon }) => {
          const isActive = key === active;
          return (
            <Animated.View key={key} style={animated}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => onChange(key)}
                style={[styles.chip, isActive && styles.chipActive]}
              >
                <Ionicons
                  name={icon as any}
                  size={16}
                  color={isActive ? theme.colors.textInverse : theme.colors.text}
                />
                <Text style={[styles.label, isActive && styles.labelActive]}>{label}</Text>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </ScrollView>
    </View>
  );
};


