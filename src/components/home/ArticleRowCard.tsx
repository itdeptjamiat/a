import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { Magazine } from '@/redux/slices/magazineSlice';

interface ArticleRowCardProps {
  item: Magazine;
  index?: number;
  onPress?: () => void;
}

export const ArticleRowCard: React.FC<ArticleRowCardProps> = ({ item, index = 0, onPress }) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      overflow: 'hidden',
      elevation: 2,
      marginBottom: theme.spacing.md,
    },
    touch: {
      flexDirection: 'row',
      padding: theme.spacing.md,
      alignItems: 'flex-start',
    },
    thumb: {
      width: 96,
      height: 120,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.surfaceLight,
      marginRight: theme.spacing.md,
    },
    content: {
      flex: 1,
    },
    source: {
      color: theme.colors.primary,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.medium as any,
      marginBottom: theme.spacing.xs,
    },
    title: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.bold as any,
      marginBottom: theme.spacing.xs,
    },
    snippet: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSize.base,
      marginBottom: theme.spacing.sm,
    },
    meta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.lg,
    },
    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    metaText: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSize.sm,
    },
  });

  return (
    <Animated.View entering={FadeInUp.delay(index * 70)} style={styles.container}>
      <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={styles.touch}>
        <Image source={{ uri: item.image }} style={styles.thumb} />
        <View style={styles.content}>
          <Text style={styles.source}>{item.category || 'Article'}</Text>
          <Text style={styles.title} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.snippet} numberOfLines={2}>{item.description}</Text>
          <View style={styles.meta}> 
            <View style={styles.metaItem}>
              <Ionicons name="star" size={14} color={theme.colors.warning} />
              <Text style={styles.metaText}>{(item.rating ?? 0).toFixed(1)}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={14} color={theme.colors.textSecondary} />
              <Text style={styles.metaText}>5 min</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};


