import React from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { Magazine } from '@/redux/slices/magazineSlice';

interface FeaturedHeroProps {
  item?: Magazine | null;
  onPress?: () => void;
}

export const FeaturedHero: React.FC<FeaturedHeroProps> = ({ item, onPress }) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      height: 280,
      marginHorizontal: theme.spacing.lg,
      borderRadius: theme.borderRadius.xl,
      overflow: 'hidden',
      backgroundColor: theme.colors.surface,
      ...theme.shadows.lg,
    },
    image: {
      width: '100%',
      height: '100%',
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'flex-end',
    },
    content: {
      padding: theme.spacing.lg,
    },
    title: {
      color: '#FFFFFF',
      fontSize: theme.typography.fontSize['2xl'],
      fontWeight: theme.typography.fontWeight.extrabold as any,
      marginBottom: theme.spacing.xs,
    },
    subtitle: {
      color: '#FFFFFF',
      opacity: 0.9,
      fontSize: theme.typography.fontSize.base,
      marginBottom: theme.spacing.md,
    },
    cta: {
      alignSelf: 'flex-start',
      backgroundColor: 'rgba(255,255,255,0.2)',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.4)',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.full,
      flexDirection: 'row',
      alignItems: 'center',
    },
    ctaText: {
      color: '#FFFFFF',
      marginLeft: theme.spacing.xs,
      fontWeight: theme.typography.fontWeight.semibold as any,
    },
    touchFill: {
      flex: 1,
    },
  });

  if (!item) return null;

  return (
    <Animated.View entering={FadeInDown.delay(100)} style={styles.container}>
      <TouchableOpacity activeOpacity={0.9} style={styles.touchFill} onPress={onPress}>
        <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
        <LinearGradient
          colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,0.6)"]}
          style={styles.overlay}
        >
          <View style={styles.content}>
            <Text style={styles.title} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.subtitle} numberOfLines={2}>{item.description}</Text>
            <View style={styles.cta}>
              <Ionicons name="book" size={16} color="#FFFFFF" />
              <Text style={styles.ctaText}>Read now</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};


