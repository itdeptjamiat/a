import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '@/context/ThemeContext';
import { useSelector } from 'react-redux';
import { selectUser } from '@/redux/selectors';
import { Ionicons } from '@expo/vector-icons';

interface ScreenHeaderProps {
  title: string;
  onRightPress?: () => void;
  rightContent?: React.ReactNode;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({ 
  title, 
  onRightPress, 
  rightContent, 
  showBackButton = false, 
  onBackPress 
}) => {
  const { theme } = useTheme();
  const user = useSelector(selectUser);

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.lg,
      paddingBottom: theme.spacing.md,
    },
    left: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
      ...theme.shadows.sm,
    },
    title: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize['2xl'],
      fontWeight: theme.typography.fontWeight.bold as any,
    },
    right: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    initialText: {
      color: theme.colors.textInverse,
      fontSize: 16,
      fontWeight: theme.typography.fontWeight.bold as any,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      
    },
  });

  const initial = (user?.name || user?.email || 'U').trim().charAt(0).toUpperCase();

  return (
    <Animated.View entering={FadeInDown.delay(150)} style={styles.container}>
      <View style={styles.left}>
        {showBackButton && (
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={onBackPress} 
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={20} color={theme.colors.text} />
          </TouchableOpacity>
        )}
        <Text style={styles.title}>{title}</Text>
      </View>
      {rightContent ? rightContent : (
        <TouchableOpacity style={styles.right} onPress={onRightPress} activeOpacity={0.8}>
          {user?.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <Text style={styles.initialText}>{initial}</Text>
          )}
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};


