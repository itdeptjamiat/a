import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { Magazine } from '@/redux/slices/magazineSlice';

interface CoverCardPortraitProps {
  item: Magazine;
  index?: number;
  onPress?: () => void;
}

export const CoverCardPortrait: React.FC<CoverCardPortraitProps> = ({ item, index = 0, onPress }) => {
  const { theme } = useTheme();
  const { width } = Dimensions.get('window');

  const cardWidth = width >= 768 ? 190 : 150;
  const cardHeight = Math.round(cardWidth * 1.3); // portrait ratio ~ 5:8

  const styles = StyleSheet.create({
    container: {
      width: cardWidth,
      height: cardHeight + 60,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.surface,
      overflow: 'hidden',
      elevation: 4,
      shadowColor: theme.colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      marginRight: theme.spacing.xs,
    },
    cover: {
      width: cardWidth,
      height: cardHeight,
      backgroundColor: theme.colors.surfaceLight,
    },
    meta: {
      padding: theme.spacing.sm,
    },
    title: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.semibold as any,
    },
    category: {
      marginTop: theme.spacing.xs,
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSize.xs,
    },
    badges: {
      position: 'absolute',
      top: theme.spacing.sm,
      left: theme.spacing.sm,
      right: theme.spacing.sm,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    typeBadge: {
      backgroundColor: item.type === 'pro' ? theme.colors.primary : theme.colors.success,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.full,
    },
    typeText: {
      color: theme.colors.textInverse,
      fontSize: theme.typography.fontSize.xs,
      fontWeight: theme.typography.fontWeight.bold as any,
    },
    rating: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
      paddingHorizontal: theme.spacing.xs,
      paddingVertical: 2,
      borderRadius: theme.borderRadius.sm,
    },
    ratingText: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.xs,
      marginLeft: 4,
    },
  });

  return (
    <Animated.View entering={FadeInUp.delay(index * 80)} style={styles.container}>
      <TouchableOpacity style={{ flex: 1 }} activeOpacity={0.9} onPress={onPress}>
        <View>
          <Image source={{ uri: item.image }} style={styles.cover} resizeMode="cover" />
          <View style={styles.badges}>
            <View style={styles.typeBadge}>
              <Text style={styles.typeText}>{item.type.toUpperCase()}</Text>
            </View>
            <View style={styles.rating}>
              <Ionicons name="star" size={12} color={theme.colors.warning} />
              <Text style={styles.ratingText}>{(item.rating ?? 0).toFixed(1)}</Text>
            </View>
          </View>
        </View>
        <View style={styles.meta}>
          <Text style={styles.title} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.category} numberOfLines={1}>{item.category}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};


