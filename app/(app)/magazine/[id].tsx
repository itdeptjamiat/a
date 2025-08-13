import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Image, Dimensions, TouchableOpacity, Alert, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import Animated, { FadeInDown, FadeInUp, FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';

import { useTheme } from '@/context/ThemeContext';
import { useWindowDimensions } from '@/hooks/useWindowDimensions';
import { H1, H2, H3, Body } from '@/typography';
import { CustomButton } from '@/components/CustomButton';
import { 
  selectMagazineError,
  selectSelectedMagazine,
  selectMagazineDetailLoading,
} from '@/redux/selectors';
import { fetchMagazineDetail } from '@/redux/actions/magazineActions';
import { clearSelectedMagazine } from '@/redux/slices/magazineSlice';
import { AppDispatch } from '@/redux/store';

const { width: screenWidth } = Dimensions.get('window');

export default function MagazineDetailScreen() {
  const { theme } = useTheme();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Selectors
  const magazine = useSelector(selectSelectedMagazine);
  const loading = useSelector(selectMagazineDetailLoading);
  const error = useSelector(selectMagazineError);

  const isTablet = screenWidth >= 768;

  useEffect(() => {
    if (id) {
      dispatch(fetchMagazineDetail(id as string));
    }

    return () => {
      dispatch(clearSelectedMagazine());
    };
  }, [id, dispatch]);

  const handleDownload = async () => {
    if (!magazine?.file) {
      Alert.alert('Error', 'No file available for download');
      return;
    }

    setIsDownloading(true);
    try {
      // Create download directory if it doesn't exist
      const downloadDir = `${FileSystem.documentDirectory}magazines/`;
      const dirInfo = await FileSystem.getInfoAsync(downloadDir);
      
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(downloadDir, { intermediates: true });
      }

      const fileName = `${magazine.name.replace(/\s+/g, '_')}.pdf`;
      const fileUri = `${downloadDir}${fileName}`;

      const downloadResumable = FileSystem.createDownloadResumable(
        magazine.file,
        fileUri,
        {},
        (downloadProgress) => {
          const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
          console.log(`Download progress: ${progress * 100}%`);
        }
      );

      const result = await downloadResumable.downloadAsync();
      if (result) {
        console.log('Download completed:', result.uri);
        
        Alert.alert(
          'Download Complete',
          `"${magazine.name}" has been downloaded successfully!`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Download Failed', 'Failed to download the magazine. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleRead = () => {
    if (magazine?.file) {
      // Navigate to reader screen with magazine data
      router.push({
        pathname: '/(app)/reader',
        params: { 
          magazineId: magazine._id,
          fileUrl: magazine.file,
          title: magazine.name
        }
      });
    } else {
      Alert.alert('Error', 'No file available for reading');
    }
  };

  const renderRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Ionicons key={i} name="star" size={16} color={theme.colors.warning} />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Ionicons key={i} name="star-half" size={16} color={theme.colors.warning} />
        );
      } else {
        stars.push(
          <Ionicons key={i} name="star-outline" size={16} color={theme.colors.textTertiary} />
        );
    }
    }
    return stars;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    gradientBackground: {
      flex: 1,
    },
    content: {
      flex: 1,
    },
    header: {
      position: 'relative',
      height: screenHeight * 0.4,
    },
    headerImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    headerOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    backButton: {
      position: 'absolute',
      top: 50,
      left: 20,
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    headerContent: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: theme.spacing.xl,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    headerTitle: {
      color: '#FFFFFF',
      fontSize: theme.typography.fontSize['3xl'],
      fontWeight: theme.typography.fontWeight.bold as any,
      marginBottom: theme.spacing.sm,
      textShadowColor: 'rgba(0, 0, 0, 1)',
      textShadowOffset: { width: 3, height: 3 },
      textShadowRadius: 6,
    },
    headerCategory: {
      color: '#FFFFFF',
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.semibold as any,
      marginBottom: theme.spacing.md,
      textShadowColor: 'rgba(0, 0, 0, 1)',
      textShadowOffset: { width: 2, height: 2 },
      textShadowRadius: 4,
    },
    headerStats: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.lg,
    },
    statItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.md,
    },
    statText: {
      color: '#FFFFFF',
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.medium as any,
      textShadowColor: 'rgba(0, 0, 0, 1)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
    },
    body: {
      flex: 1,
      padding: isTablet ? theme.spacing['2xl'] : theme.spacing.lg,
      backgroundColor: '#1F2937',
    },
    section: {
      marginBottom: theme.spacing['2xl'],
    },
    sectionTitle: {
      color: '#FFFFFF',
      fontSize: theme.typography.fontSize.xl,
      fontWeight: theme.typography.fontWeight.bold as any,
      marginBottom: theme.spacing.md,
    },
    description: {
      color: '#E5E7EB',
      fontSize: theme.typography.fontSize.base,
      lineHeight: theme.typography.lineHeight.relaxed * theme.typography.fontSize.base,
      marginBottom: theme.spacing.lg,
    },
    ratingSection: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    ratingStars: {
      flexDirection: 'row',
      gap: 2,
    },
    ratingText: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.medium as any,
    },
    reviewsCount: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSize.sm,
    },
    actionButtons: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      marginBottom: theme.spacing.xl,
    },
    button: {
      flex: 1,
      height: 50,
      borderRadius: theme.borderRadius.lg,
    },
    typeBadge: {
      position: 'absolute',
      top: 20,
      right: 20,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.full,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      zIndex: 10,
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    typeText: {
      color: '#FFFFFF',
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.semibold as any,
      textTransform: 'uppercase' as any,
      textShadowColor: 'rgba(0, 0, 0, 0.5)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
    },
    freeBadge: {
      backgroundColor: '#10B981',
      borderColor: '#10B981',
    },
    proBadge: {
      backgroundColor: '#F59E0B',
      borderColor: '#F59E0B',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.xl,
    },
    errorText: {
      color: theme.colors.error,
      fontSize: theme.typography.fontSize.lg,
      textAlign: 'center',
      marginBottom: theme.spacing.lg,
    },
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <H2 style={{ color: theme.colors.text }}>Loading magazine...</H2>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !magazine) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color={theme.colors.error} />
          <H2 style={styles.errorText}>
            {error || 'Magazine not found'}
          </H2>
          <CustomButton
            title="Go Back"
            onPress={() => router.back()}
            variant="primary"
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1a1a1a', '#2d2d2d', '#FFD700']}
        style={styles.gradientBackground}
      >
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header with Image */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.header}>
          <Image 
            source={{ uri: magazine.image || 'https://via.placeholder.com/400x600/1a1a1a/ffffff?text=Magazine' }} 
            style={styles.headerImage} 
          />
          <LinearGradient
            colors={['rgba(0, 0, 0, 0.2)', 'rgba(0, 0, 0, 0.9)']}
            style={styles.headerOverlay}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          />
          
          {/* Type Badge */}
          <View style={[
            styles.typeBadge,
            magazine.type === 'free' ? styles.freeBadge : styles.proBadge
          ]}>
            <Text style={styles.typeText}>{magazine.type.toUpperCase()}</Text>
          </View>

          {/* Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Header Content */}
          <View style={styles.headerContent}>
            <H1 style={styles.headerTitle}>{magazine.name}</H1>
            <Text style={styles.headerCategory}>{magazine.category}</Text>
                          <View style={styles.headerStats}>
                <View style={styles.statItem}>
                  <Ionicons name="download-outline" size={18} color="#FFFFFF" />
                  <Text style={styles.statText}>{magazine.downloads} downloads</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="star" size={18} color="#FBBF24" />
                  <Text style={styles.statText}>{magazine.rating.toFixed(1)}</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Body Content */}
        <Animated.View entering={FadeInUp.delay(400)} style={styles.body}>
          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <CustomButton
              title="Read Now"
              onPress={handleRead}
              variant="gradient"
              style={styles.button}
              icon={<Ionicons name="book-outline" size={20} color={theme.colors.textInverse} />}
                />
            <CustomButton
              title={isDownloading ? "Downloading..." : "Download"}
              onPress={handleDownload}
              variant="primary"
              style={styles.button}
              loading={isDownloading}
              icon={<Ionicons name="download-outline" size={20} color={theme.colors.textInverse} />}
            />
              </View>
              
          {/* Rating Section */}
          <View style={styles.section}>
            <View style={styles.ratingSection}>
              <View style={styles.ratingStars}>
                {renderRatingStars(magazine.rating)}
              </View>
              <Text style={styles.ratingText}>{magazine.rating.toFixed(1)}</Text>
              <Text style={styles.reviewsCount}>
                ({magazine.reviews.length} reviews)
                </Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <H2 style={styles.sectionTitle}>About this magazine</H2>
            <Body style={styles.description}>
              {magazine.description || 'No description available for this magazine.'}
            </Body>
          </View>

          {/* Reviews Section */}
          {magazine.reviews.length > 0 && (
            <View style={styles.section}>
              <H2 style={styles.sectionTitle}>Recent Reviews</H2>
                {magazine.reviews.slice(0, 3).map((review, index) => (
                <View key={review._id} style={{
                  backgroundColor: theme.colors.surface,
                  padding: theme.spacing.md,
                  borderRadius: theme.borderRadius.lg,
                  marginBottom: theme.spacing.md,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.sm }}>
                    <View style={styles.ratingStars}>
                      {renderRatingStars(review.rating)}
                    </View>
                    <Text style={{ color: theme.colors.textSecondary, fontSize: theme.typography.fontSize.sm, marginLeft: theme.spacing.sm }}>
                      {new Date(review.time).toLocaleDateString()}
                    </Text>
                  </View>
                  <Text style={{ color: theme.colors.text, fontSize: theme.typography.fontSize.sm }}>
                      {review.review}
                    </Text>
                  </View>
                ))}
            </View>
          )}
        </Animated.View>
              </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
} 