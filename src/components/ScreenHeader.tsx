import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '@/context/ThemeContext';
import { useSelector } from 'react-redux';
import { selectUser } from '@/redux/selectors';

interface ScreenHeaderProps {
  title: string;
  onRightPress?: () => void;
  rightContent?: React.ReactNode; // Add this line
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({ title, onRightPress, rightContent }) => {
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
      <Text style={styles.title}>{title}</Text>
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


