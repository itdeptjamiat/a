import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ScreenWrapper } from '@/components';
import { SectionHeader } from '@/components/home';
import { useTheme } from '@/context/ThemeContext';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchDigestsOnly } from '@/redux/actions/magazineActions';
import { selectDigests } from '@/redux/selectors/magazineSelectors';

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
  const styles = StyleSheet.create({
    card: {
      width: 100,
      height: 100,
      borderRadius: theme.borderRadius.md,
      overflow: 'hidden',
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: theme.spacing.sm,
      ...theme.shadows.sm,
    },
    icon: {
      marginBottom: theme.spacing.xs,
    },
    title: {
      color: theme.colors.textInverse,
      fontSize: theme.typography.fontSize.xs,
      fontWeight: theme.typography.fontWeight.bold as any,
      textAlign: 'center',
    },
  });
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <LinearGradient colors={colors} style={styles.card}>
        <Ionicons name={icon as any} size={36} color={theme.colors.textInverse} style={styles.icon} />
        <Text style={styles.title}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

interface DigestCardProps {
  digest: any;
  onPress: (id: string) => void;
}

const DigestCard: React.FC<DigestCardProps> = ({ digest, onPress }) => {
  const { theme } = useTheme();
  const styles = StyleSheet.create({
    card: {
      width: 140,
      borderRadius: theme.borderRadius.lg,
      overflow: 'hidden',
      backgroundColor: theme.colors.surface,
      marginHorizontal: theme.spacing.sm,
      marginBottom: theme.spacing.md,
      ...theme.shadows.md,
    },
    image: {
      width: '100%',
      height: 140,
      resizeMode: 'cover',
    },
    content: {
      padding: theme.spacing.sm,
    },
    title: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.bold as any,
    },
    author: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSize.xs,
    },
  });
  return (
    <TouchableOpacity onPress={() => onPress(digest.mid)} activeOpacity={0.8}>
      <View style={styles.card}>
        <Image source={{ uri: digest.image }} style={styles.image} />
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>{digest.name}</Text>
          <Text style={styles.author} numberOfLines={1}>{digest.category}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const DigestHomeScreen: React.FC = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const digests = useAppSelector(selectDigests);

  useEffect(() => {
    dispatch(fetchDigestsOnly(undefined));
  }, [dispatch]);

  const handleDigestPress = useCallback((id: string) => {
    router.push(`/digest/${id}`);
  }, [router]);

  const categories = [
    { title: 'Animals', icon: 'paw', colors: ['#FFD700', '#FFA500'] },
    { title: 'Space', icon: 'planet', colors: ['#8A2BE2', '#4B0082'] },
    { title: 'Stories', icon: 'book', colors: ['#32CD32', '#008000'] },
    { title: 'Science', icon: 'flask', colors: ['#1E90FF', '#0000CD'] },
    { title: 'Nature', icon: 'leaf', colors: ['#FF6347', '#FF4500'] },
    { title: 'History', icon: 'hourglass', colors: ['#BA55D3', '#8A2BE2'] },
  ];

  const styles = StyleSheet.create({
    header: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      backgroundColor: theme.colors.background,
    },
    welcomeText: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.xl,
      fontWeight: theme.typography.fontWeight.bold as any,
    },
    greetingText: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSize.sm,
    },
    section: {
      marginTop: theme.spacing.lg,
      paddingHorizontal: theme.spacing.lg,
    },
    categoryList: {
      paddingVertical: theme.spacing.md,
    },
    digestList: {
      paddingHorizontal: theme.spacing.sm,
    },
  });

  const renderSection = ({ item }: { item: { type: string; title: string; data: any[] } }) => {
    switch (item.type) {
      case 'header':
        return (
          <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
            <Text style={styles.welcomeText}>Welcome to Kids Zone!</Text>
            <Text style={styles.greetingText}>Explore amazing stories and learn new things.</Text>
          </Animated.View>
        );
      
      case 'categories':
        return (
          <View style={styles.section}>
            <SectionHeader title="Categories" />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryList}
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
            <SectionHeader title="Featured Paigham Digests" />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.digestList}
            >
              {digests.slice(0, 5).map((digest) => (
                <DigestCard key={String(digest.mid)} digest={digest} onPress={handleDigestPress} />
              ))}
            </ScrollView>
          </View>
        );
      
      case 'popular':
        return (
          <View style={styles.section}>
            <SectionHeader title="Popular Digests" />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.digestList}
            >
              {digests.slice(5, 10).map((digest) => (
                <DigestCard key={String(digest.mid)} digest={digest} onPress={handleDigestPress} />
              ))}
            </ScrollView>
          </View>
        );
      
      case 'new':
        return (
          <View style={styles.section}>
            <SectionHeader title="New Releases" />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.digestList}
            >
              {digests.slice(10, 15).map((digest) => (
                <DigestCard key={String(digest.mid)} digest={digest} onPress={handleDigestPress} />
              ))}
            </ScrollView>
          </View>
        );
      
      default:
        return null;
    }
  };

  const sections = [
    { type: 'header', title: '', data: [] },
    { type: 'categories', title: 'Categories', data: categories },
    { type: 'featured', title: 'Featured', data: digests.slice(0, 5) },
    { type: 'popular', title: 'Popular', data: digests.slice(5, 10) },
    { type: 'new', title: 'New', data: digests.slice(10, 15) },
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
