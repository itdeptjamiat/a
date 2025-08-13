import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';

interface SectionHeaderProps {
  title: string;
  onPressSeeAll?: () => void;
  containerStyle?: ViewStyle;
  rightActionLabel?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  onPressSeeAll,
  containerStyle,
  rightActionLabel = 'See All',
}) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.md,
    },
    title: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.xl,
      fontWeight: theme.typography.fontWeight.bold as any,
    },
    action: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    actionText: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSize.sm,
      marginRight: theme.spacing.xs,
      fontWeight: theme.typography.fontWeight.medium as any,
    },
  });

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.title}>{title}</Text>
      {!!onPressSeeAll && (
        <TouchableOpacity style={styles.action} onPress={onPressSeeAll} activeOpacity={0.8}>
          <Text style={styles.actionText}>{rightActionLabel}</Text>
          <Ionicons name="chevron-forward" size={18} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      )}
    </View>
  );
};


