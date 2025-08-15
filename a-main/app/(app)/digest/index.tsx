import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Image, FlatList, Dimensions } from 'react-native';
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ScreenWrapper } from '@/components';
import { SectionHeader } from '@/components/home';
import { useTheme } from '@/context/ThemeContext';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchDigestsOnly } from '@/redux/actions/magazineActions';
import { selectDigests } from '@/redux/selectors/magazineSelectors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface KidsCategoryCardProps {
  title: string;
  icon: string;
  colors: string[];
  onPress: () => void;
}

const KidsCategoryCard: React.FC<KidsCategoryCardProps> = ({
  title, icon, colors, onPress
}) => {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.95);
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1);
  }, [scale]);

  const styles = StyleSheet.create({
    card: {
      width: (SCREEN_WIDTH / 3) - theme.spacing.md, // Responsive width
      height: (SCREEN_WIDTH / 3) - theme.spacing.md,
      borderRadius: theme.borderRadius.xl, // More rounded
      overflow: 'hidden',
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: theme.spacing.sm,
      marginVertical: theme.spacing.sm,
      ...theme.shadows.md, // Playful shadow
    },
    icon: {
      marginBottom: theme.spacing.xs,
    },
    title: {
      color: theme.colors.textInverse,
      fontSize: theme.typography.fontSize.sm, // Slightly larger
      fontWeight: theme.typography.fontWeight.bold as any,
      textAlign: 'center',
      paddingHorizontal: theme.spacing.xs,
    },
  });
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1} // Use 1 to rely on reanimated for feedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[styles.card, animatedStyle]}>
        <LinearGradient colors={colors} style={StyleSheet.absoluteFill}>
          <View style={styles.card}>
            <Ionicons name={icon as any} size={40} color={theme.colors.textInverse} style={styles.icon} />
            <Text style={styles.title}>{title}</Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
};

interface DigestCardProps {
  digest: any;
  onPress: (id: string) => void;
}

const DigestCard: React.FC<DigestCardProps> = ({ digest, onPress }) => {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.98);
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1);
  }, [scale]);

  const styles = StyleSheet.create({
    card: {
      width: 160, // Slightly wider
      borderRadius: theme.borderRadius.xl, // More rounded
      overflow: 'hidden',
      backgroundColor: theme.colors.surface,
      marginHorizontal: theme.spacing.sm,
      marginBottom: theme.spacing.md,
      ...theme.shadows.lg, // More prominent shadow
    },
    image: {
      width: '100%',
      height: 160, // Taller image
      resizeMode: 'cover',
      borderTopLeftRadius: theme.borderRadius.xl,
      borderTopRightRadius: theme.borderRadius.xl,
    },
    content: {
      padding: theme.spacing.md, // More padding
    },
    title: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.lg, // Larger title
      fontWeight: theme.typography.fontWeight.bold as any,
      lineHeight: theme.typography.lineHeight.tight, // Tighter line height
    },
    category: {
      color: theme.colors.primary, // Highlight category with primary color
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.medium as any,
      marginTop: theme.spacing.xs,
    },
  });
  return (
    <TouchableOpacity
      onPress={() => onPress(digest.mid)}
      activeOpacity={1}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[styles.card, animatedStyle]}>
        <Image source={{ uri: digest.image }} style={styles.image} />
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>{digest.name}</Text>
          <Text style={styles.category} numberOfLines={1}>{digest.category}</Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const DigestHomeScreen: React.FC = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const dispatch = useAppDispatch();

  // State for different digest sections (will be populated by API calls)
  const [featuredDigests, setFeaturedDigests] = useState([]);
  const [popularDigests, setPopularDigests] = useState([]);
  const [newDigests, setNewDigests] = useState([]);

  // Placeholder for API calls - replace with actual thunks/selectors later
  useEffect(() => {
    // Dispatch actions to fetch data for each section
    // For now, simulate data from selectDigests
    const allDigests = useAppSelector(selectDigests);

    // Simulate fetching different categories of digests
    setFeaturedDigests(allDigests.filter((_, i) => i % 3 === 0).slice(0, 5));
    setPopularDigests(allDigests.filter((_, i) => i % 3 === 1).slice(0, 5));
    setNewDigests(allDigests.filter((_, i) => i % 3 === 2).slice(0, 5));

    // TODO: Replace with actual API calls using fetchFeaturedDigest, fetchPopularDigests, fetchNewDigests
    // dispatch(fetchFeaturedDigest());
    // dispatch(fetchPopularDigests());
    // dispatch(fetchNewDigests());
  }, [dispatch]); // Dependency on dispatch

  const handleDigestPress = useCallback((id: string) => {
    router.push(`/digest/${id}`);
  }, [router]);

  const categories = [
    { title: 'Animals', icon: 'paw', colors: ['#FFD700', theme.colors.primaryLight] },
    { title: 'Space', icon: 'planet', colors: ['#8A2BE2', theme.colors.primaryLight] },
    { title: 'Stories', icon: 'book', colors: ['#32CD32', theme.colors.primaryLight] },
    { title: 'Science', icon: 'flask', colors: ['#1E90FF', theme.colors.primaryLight] },
    { title: 'Nature', icon: 'leaf', colors: ['#FF6347', theme.colors.primaryLight] },
    { title: 'History', icon: 'hourglass', colors: ['#BA55D3', theme.colors.primaryLight] },
    // Add more kid-friendly categories with vibrant colors
    { title: 'Adventure', icon: 'map', colors: ['#00BFFF', '#1E90FF'] },
    { title: 'Fantasy', icon: 'sparkles', colors: ['#FF1493', '#FF69B4'] },
    { title: 'Robots', icon: 'hardware-chip', colors: ['#7B68EE', '#6A5ACD'] },
  ];

  const styles = StyleSheet.create({
    header: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      backgroundColor: theme.colors.background,
    },
    welcomeText: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize['3xl'], // Larger for impact
      fontWeight: theme.typography.fontWeight.extrabold as any, // Extrabold
      textAlign: 'center',
      marginTop: theme.spacing.md,
    },
    greetingText: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSize.lg, // Larger
      textAlign: 'center',
      marginBottom: theme.spacing.lg,
    },
    section: {
      marginTop: theme.spacing.lg,
      // No horizontal padding here, done in FlatList contentContainerStyle
    },
    categoryListContainer: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.md,
      justifyContent: 'center', // Center items horizontally if they don't fill full width
      alignItems: 'center',
    },
    digestList: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
    },
    sectionTitle: {
      fontSize: theme.typography.fontSize['2xl'],
      fontWeight: theme.typography.fontWeight.bold as any,
      color: theme.colors.text,
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.md,
    },
  });

  const renderSection = ({ item }: { item: { type: string; title: string; data: any[] } }) => {
    switch (item.type) {
      case 'header':
        return (
          <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
            <LinearGradient
              colors={[theme.colors.primaryLight, theme.colors.primaryDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFillObject}
            />
            <Text style={styles.welcomeText}>Welcome to Kids Zone!</Text>
            <Text style={styles.greetingText}>Explore amazing stories and learn new things.</Text>
          </Animated.View>
        );
      
      case 'categories':
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryListContainer}
            >
              {categories.map((category) => (
                <KidsCategoryCard
                  key={category.title}
                  title={category.title}
                  icon={category.icon}
                  colors={category.colors}
                  onPress={() => console.log('Category tapped:', category.title)}
                />
              ))}
            </ScrollView>
          </View>
        );
      
      case 'featured':
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Featured Paigham Digests</Text>
            <FlatList
              horizontal
              data={featuredDigests}
              renderItem={({ item }) => <DigestCard digest={item} onPress={handleDigestPress} />}
              keyExtractor={(item) => String(item.mid)}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.digestList}
            />
          </View>
        );
      
      case 'popular':
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Popular Digests</Text>
            <FlatList
              horizontal
              data={popularDigests}
              renderItem={({ item }) => <DigestCard digest={item} onPress={handleDigestPress} />}
              keyExtractor={(item) => String(item.mid)}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.digestList}
            />
          </View>
        );
      
      case 'new':
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>New Releases</Text>
            <FlatList
              horizontal
              data={newDigests}
              renderItem={({ item }) => <DigestCard digest={item} onPress={handleDigestPress} />}
              keyExtractor={(item) => String(item.mid)}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.digestList}
            />
          </View>
        );
      
      default:
        return null;
    }
  };

  const sections = [
    { type: 'header', title: '', data: [] },
    { type: 'categories', title: 'Categories', data: categories },
    { type: 'featured', title: 'Featured', data: featuredDigests },
    { type: 'popular', title: 'Popular', data: popularDigests },
    { type: 'new', title: 'New', data: newDigests },
  ];

  return (
    <ScreenWrapper bottomSafeArea>
      <FlatList
        data={sections}
        renderItem={renderSection}
        keyExtractor={(item) => item.type}
        showsVerticalScrollIndicator={false}
      />
    </ScreenWrapper>
  );
};

export default DigestHomeScreen;
