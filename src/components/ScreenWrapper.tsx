import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
  bottomSafeArea?: boolean;
  keyboardAvoidingView?: boolean;
  keyboardOffset?: number;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  style,
  bottomSafeArea = false,
  keyboardAvoidingView = false,
  keyboardOffset = 0,
}) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
    },
  });

  const safeAreaEdges: Edge[] = bottomSafeArea 
    ? ['top', 'bottom'] 
    : ['top'];

  const content = (
    <View style={[styles.content, style]}>
      {children}
    </View>
  );

  if (keyboardAvoidingView) {
    return (
      <SafeAreaView style={styles.container} edges={safeAreaEdges}>
        <KeyboardAvoidingView
          style={styles.content}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={keyboardOffset}
        >
          {content}
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={safeAreaEdges}>
      {content}
    </SafeAreaView>
  );
};
