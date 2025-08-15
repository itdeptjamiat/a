import { Stack } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

export default function AppLayout() {
  const { theme } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="plans" options={{ headerShown: false }} />
      <Stack.Screen name="edit-profile" options={{ headerShown: false }} />
      <Stack.Screen name="storage-data" options={{ headerShown: false }} />
      <Stack.Screen name="help-support" options={{ headerShown: false }} />
      <Stack.Screen name="about" options={{ headerShown: false }} />
      <Stack.Screen name="privacy-security" options={{ headerShown: false }} />
      <Stack.Screen name="reader" options={{ headerShown: false }} />
      <Stack.Screen name="article" options={{ headerShown: false }} />
      <Stack.Screen name="magazine" options={{ headerShown: false }} />
      <Stack.Screen name="digest" options={{ headerShown: false }} />
      <Stack.Screen name="content" options={{ headerShown: false }} />
    </Stack>
  );
}