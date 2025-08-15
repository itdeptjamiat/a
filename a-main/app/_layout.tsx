import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { store, persistor } from '@/redux/store';
import { ThemeProvider } from '@/context/ThemeContext';
import { useAppSelector } from '@/redux/hooks';
import { selectToken } from '@/redux/selectors';
import { attachAuthToken } from '@/axios/EchoInstance';

// Simple fallback loading for persistence rehydration
const LoadingScreen = () => null;

function RootLayoutNav() {
  const token = useAppSelector(selectToken);

  useEffect(() => {
    // Attach token to axios instance when token changes
    if (token) {
      attachAuthToken(token);
    }
  }, [token]);

  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
      </Stack>
      <Toast />
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <Provider store={store}>
          <PersistGate 
            loading={<LoadingScreen />}
            persistor={persistor}
          >
            <RootLayoutNav />
          </PersistGate>
        </Provider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}



/*
import { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, Easing, ActivityIndicator, StyleSheet } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { store, persistor } from '@/redux/store';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { selectToken, selectUser } from '@/redux/selectors';
import { attachAuthToken } from '@/axios/EchoInstance';
import { checkTokenExists } from '@/services/storage';

// Modern, themed loading screen
const LoadingScreen = () => {
  const { theme } = useTheme();
  const scale = useRef(new Animated.Value(0.96)).current;
  const opacity = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    const scaleAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.04,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.96,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    const opacityAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.8,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    scaleAnimation.start();
    opacityAnimation.start();

    return () => {
      scaleAnimation.stop();
      opacityAnimation.stop();
    };
  }, [scale, opacity]);

  return (
    <LinearGradient
      colors={[theme.colors.surfaceDark, theme.colors.background]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <View style={styles.center}>
        <Animated.View
          style={[
            styles.card,
            { 
              backgroundColor: theme.colors.surface, 
              borderColor: theme.colors.border, 
              borderRadius: theme.borderRadius.lg 
            },
            theme.shadows.lg,
            { 
              transform: [{ scale }],
              opacity 
            },
          ]}
        >
          {/* App Icon Placeholder 
          <View style={[
            styles.iconPlaceholder, 
            { 
              backgroundColor: theme.colors.primary,
              borderRadius: theme.borderRadius.xl 
            }
          ]}>
            <Text style={[
              styles.iconText, 
              { color: theme.colors.textInverse }
            ]}>
              E
            </Text>
          </View>
          
          <Text style={[
            styles.title, 
            { 
              color: theme.colors.text, 
              fontSize: theme.typography.fontSize['2xl'] 
            }
          ]}>
            EchoReads
          </Text>
          
          <ActivityIndicator size="large" color={theme.colors.primary} />
          
          <Text style={[
            styles.subtitle, 
            { color: theme.colors.textSecondary }
          ]}>
            Preparing your experience...
          </Text>
        </Animated.View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '82%',
    maxWidth: 360,
    paddingVertical: 28,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderWidth: 1,
  },
  iconPlaceholder: {
    width: 72,
    height: 72,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 32,
    fontWeight: '700',
  },
  title: {
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    marginTop: 10,
    fontSize: 14,
  },
});

function RootLayoutNav() {
  const token = useAppSelector(selectToken);
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isRehydrated, setIsRehydrated] = useState(false);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  useEffect(() => {
    // Check if Redux Persist has rehydrated
    const checkRehydration = async () => {
      try {
        // Wait for persistor to be ready
        await persistor.persist();
        console.log('🔍 App Debug - Persistor ready');
        
        // Give a bit more time for state to settle
        setTimeout(() => {
          setIsRehydrated(true);
        }, 1500);
      } catch (error) {
        console.error('🔍 App Debug - Error waiting for persistor:', error);
        setIsRehydrated(true);
      }
    };

    checkRehydration();
  }, []);

  useEffect(() => {
    // Only check authentication after rehydration is complete
    if (!isRehydrated) {
      console.log('🔍 App Debug - Waiting for rehydration...');
      return;
    }

    // Attach token to axios instance when token changes
    if (token) {
      console.log('🔍 App Debug - Token found, attaching to axios:', token.substring(0, 20) + '...');
      attachAuthToken(token);
    } else {
      console.log('🔍 App Debug - No token found in Redux state');
    }
  }, [token, isRehydrated]);

  // Authentication check - only after rehydration and only once
  useEffect(() => {
    if (!isRehydrated || hasCheckedAuth) {
      return;
    }

    console.log('🔍 App Debug - Checking authentication state...');
    setHasCheckedAuth(true);

    const performAuthCheck = async () => {
      if (token) {
        console.log('🔍 App Debug - Token found in Redux, staying on app');
        return;
      }

      // Backup check: look directly in AsyncStorage
      const tokenExists = await checkTokenExists();
      if (tokenExists) {
        console.log('🔍 App Debug - Token found in AsyncStorage, waiting for Redux to catch up');
        // Don't redirect, let Redux catch up
        return;
      }

      console.log('🔍 App Debug - No token found anywhere, redirecting to login');
      router.replace('/(auth)/login');
    };

    performAuthCheck();
  }, [token, router, isRehydrated, hasCheckedAuth]);

  // Show loading while rehydrating
  if (!isRehydrated) {
    return <LoadingScreen />;
  }

  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
      </Stack>
      <Toast />
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <Provider store={store}>
          <PersistGate 
            loading={<LoadingScreen />}
            persistor={persistor}
          >
            <RootLayoutNav />
          </PersistGate>
        </Provider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
*/