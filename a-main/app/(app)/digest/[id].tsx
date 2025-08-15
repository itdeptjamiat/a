import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScreenWrapper } from '@/components';
import { SectionHeader } from '@/components/home';
import { useTheme } from '@/context/ThemeContext';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchDigestsOnly } from '@/redux/actions/magazineActions';
import { selectDigests } from '@/redux/selectors/magazineSelectors';
import { DigestCard } from './index'; // Import DigestCard from the same directory

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SingleDigestScreen: React.FC = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const dispatch = useAppDispatch();

  // For now, using all digests and filtering, replace with single digest fetch later
  const allDigests = useAppSelector(selectDigests);
  const digest = allDigests.find(d => String(d.mid) === id);

  useEffect(() => {
    // Fetch all digests if not already available, or a specific digest by ID
    if (!digest) {
      dispatch(fetchDigestsOnly(undefined));
    }
  }, [dispatch, digest, id]);

  const handleReadPress = useCallback(() => {
    if (digest?.mid) {
      router.push(`/reader?mid=${digest.mid}`);
    }
  }, [router, digest]);

  const handleMoreDigestsPress = useCallback((digestId: string) => {
    router.push(`/digest/${digestId}`);
  }, [router]);

  if (!digest) {
    return (
      <ScreenWrapper>
        <View style={styles.center}>
          <Text style={{ color: theme.colors.text }}>Digest not found.</Text>
        </View>
      </ScreenWrapper>
    );
  }

  // Filter out the current digest from the "More Paigham Digests" section
  const moreDigests = allDigests.filter(d => String(d.mid) !== id).slice(0, 5); // Show up to 5 other digests

  const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      backgroundColor: theme.colors.background,
    },
    headerImage: {
      width: SCREEN_WIDTH,
      height: SCREEN_WIDTH * 0.7, // Aspect ratio for hero image
      justifyContent: 'flex-end',
      padding: theme.spacing.md,
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.4)',
    },
    playButtonContainer: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: [{ translateX: -30 }, { translateY: -30 }],
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.full,
      padding: theme.spacing.sm,
      ...theme.shadows.md,
    },
    title: {
      color: theme.colors.textInverse,
      fontSize: theme.typography.fontSize['4xl'],
      fontWeight: theme.typography.fontWeight.extrabold as any,
      marginBottom: theme.spacing.xs,
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: { width: -1, height: 1 },
      textShadowRadius: 10,
    },
    category: {
      color: theme.colors.textInverse,
      fontSize: theme.typography.fontSize.xl,
      fontWeight: theme.typography.fontWeight.semibold as any,
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: { width: -1, height: 1 },
      textShadowRadius: 5,
    },
    contentSection: {
      padding: theme.spacing.lg,
      backgroundColor: theme.colors.surface,
      borderTopLeftRadius: theme.borderRadius.xl,
      borderTopRightRadius: theme.borderRadius.xl,
      marginTop: -theme.spacing.xl, // Overlap with image
    },
    description: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSize.base,
      lineHeight: theme.typography.lineHeight.relaxed,
      marginBottom: theme.spacing.xl,
    },
    readButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    readButtonText: {
      color: theme.colors.textInverse,
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.bold as any,
    },
    sectionHeader: {
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      marginTop: theme.spacing.lg,
    },
    digestList: {
      paddingHorizontal: theme.spacing.md,
      paddingBottom: theme.spacing.xl,
    },
    center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  return (
    <ScreenWrapper bottomSafeArea>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.delay(100)}>
          <ImageBackground source={{ uri: digest.image }} style={styles.headerImage}>
            <LinearGradient
              colors={['transparent', theme.colors.background]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 0, y: 1 }}
              style={styles.overlay}
            />
            <TouchableOpacity style={styles.playButtonContainer} onPress={handleReadPress}>
              <Ionicons name="play" size={40} color={theme.colors.textInverse} />
            </TouchableOpacity>
            <Text style={styles.title}>{digest.name}</Text>
            <Text style={styles.category}>{digest.category}</Text>
          </ImageBackground>
        </Animated.View>

        <View style={styles.contentSection}>
          <Text style={styles.description}>{digest.description}</Text>

          <TouchableOpacity style={styles.readButton} onPress={handleReadPress}>
            <Text style={styles.readButtonText}>Read Digest</Text>
          </TouchableOpacity>
        </View>

        {moreDigests.length > 0 && (
          <View>
            <Text style={[styles.sectionTitle, styles.sectionHeader]}>More Paigham Digests</Text>
            <FlatList
              horizontal
              data={moreDigests}
              renderItem={({ item }) => <DigestCard digest={item} onPress={handleMoreDigestsPress} />}
              keyExtractor={(item) => String(item.mid)}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.digestList}
            />
          </View>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
};

export default SingleDigestScreen;
