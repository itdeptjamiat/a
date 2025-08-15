import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAppSelector } from '@/redux/hooks';
import { selectToken, selectIsAuthenticated } from '@/redux/selectors';

export default function Index() {
  const router = useRouter();
  const token = useAppSelector(selectToken);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  useEffect(() => {
    // Simple token check - if we have a token, go to app, otherwise go to login
    if (token && isAuthenticated) {
      router.replace('/(app)/(tabs)');
      console.log("home......", token, isAuthenticated);
    } else {
      router.replace('/(auth)/login');
      console.log("auth......", token, isAuthenticated);
    }
  }, [token, isAuthenticated, router]);

  // Return null - the default app launch screen will show during navigation
  return null;
}
