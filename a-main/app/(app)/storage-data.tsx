import React, { useState, useEffect } from 'react';
import { 
  View, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  Text, 
  Alert,
  ActivityIndicator,
  Switch
} from 'react-native';
import { ScreenHeader, ScreenWrapper } from '@/components';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import * as FileSystem from 'expo-file-system';

import { useTheme } from '@/context/ThemeContext';
import { useWindowDimensions } from '@/hooks/useWindowDimensions';
import { H1, H2, H3, Body } from '@/typography';

interface StorageItem {
  id: string;
  name: string;
  size: string;
  type: 'magazine' | 'article' | 'digest' | 'cache';
  date: string;
  isDownloaded: boolean;
}

interface StorageStats {
  totalDownloaded: number;
  totalCache: number;
  availableSpace: number;
  usedSpace: number;
}

export default function StorageDataScreen() {
  const { theme } = useTheme();
  const { isTablet } = useWindowDimensions();
  
  const [storageStats, setStorageStats] = useState<StorageStats>({
    totalDownloaded: 0,
    totalCache: 0,
    availableSpace: 0,
    usedSpace: 0,
  });
  
  const [downloadedItems, setDownloadedItems] = useState<StorageItem[]>([]);
  const [cacheItems, setCacheItems] = useState<StorageItem[]>([]);
  const [autoDownload, setAutoDownload] = useState(false);
  const [wifiOnly, setWifiOnly] = useState(true);
  const [loading, setLoading] = useState(true);

  // Real device storage data
  useEffect(() => {
    const loadStorageData = async () => {
      try {
        setLoading(true);
        
        // Get real device storage information
        const documentDirectory = FileSystem.documentDirectory;
        const cacheDirectory = FileSystem.cacheDirectory;
        
        if (documentDirectory && cacheDirectory) {
          // Get document directory info
          const docInfo = await FileSystem.getInfoAsync(documentDirectory);
          const cacheInfo = await FileSystem.getInfoAsync(cacheDirectory);
          
          // Calculate storage usage (in MB)
          const downloadedSize = docInfo.exists ? (docInfo.size || 0) / (1024 * 1024) : 0;
          const cacheSize = cacheInfo.exists ? (cacheInfo.size || 0) / (1024 * 1024) : 0;
          
          // For demo purposes, we'll use estimated values since we can't get total device storage
          // In a real app, you might use a native module to get actual device storage
          const estimatedTotalSpace = 64 * 1024; // 64 GB in MB
          const estimatedUsedSpace = downloadedSize + cacheSize + (Math.random() * 1000); // Add some random usage
          const estimatedAvailableSpace = estimatedTotalSpace - estimatedUsedSpace;
          
          setStorageStats({
            totalDownloaded: Math.round(downloadedSize * 100) / 100, // MB
            totalCache: Math.round(cacheSize * 100) / 100, // MB
            availableSpace: Math.round(estimatedAvailableSpace * 100) / 100, // MB
            usedSpace: Math.round(estimatedUsedSpace * 100) / 100, // MB
          });
        }

        // Mock downloaded items
        setDownloadedItems([
          {
            id: '1',
            name: 'The West Flow Magazine',
            size: '45.2 MB',
            type: 'magazine',
            date: '2024-01-15',
            isDownloaded: true,
          },
          {
            id: '2',
            name: 'Technology Trends Article',
            size: '12.8 MB',
            type: 'article',
            date: '2024-01-14',
            isDownloaded: true,
          },
          {
            id: '3',
            name: 'Kids Adventure Digest',
            size: '28.5 MB',
            type: 'digest',
            date: '2024-01-13',
            isDownloaded: true,
          },
        ]);

        // Mock cache items
        setCacheItems([
          {
            id: 'cache1',
            name: 'App Cache',
            size: '156.7 MB',
            type: 'cache',
            date: '2024-01-15',
            isDownloaded: false,
          },
          {
            id: 'cache2',
            name: 'Image Cache',
            size: '89.3 MB',
            type: 'cache',
            date: '2024-01-15',
            isDownloaded: false,
          },
        ]);

        setLoading(false);
      } catch (error) {
        console.error('Error loading storage data:', error);
        setLoading(false);
      }
    };

    loadStorageData();
  }, []);

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'Are you sure you want to clear all cached data? This will free up storage space but may slow down the app temporarily.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Cache',
          style: 'destructive',
          onPress: () => {
            // Clear cache logic here
            setCacheItems([]);
            setStorageStats(prev => ({
              ...prev,
              totalCache: 0,
              usedSpace: prev.usedSpace - prev.totalCache,
            }));
          },
        },
      ]
    );
  };

  const handleDeleteDownload = (item: StorageItem) => {
    Alert.alert(
      'Delete Download',
      `Are you sure you want to delete "${item.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setDownloadedItems(prev => prev.filter(i => i.id !== item.id));
            // Update storage stats
            const sizeInMB = parseFloat(item.size.replace(' MB', ''));
            setStorageStats(prev => ({
              ...prev,
              totalDownloaded: prev.totalDownloaded - (sizeInMB / 1024),
              usedSpace: prev.usedSpace - (sizeInMB / 1024),
            }));
          },
        },
      ]
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'magazine':
        return 'book-outline';
      case 'article':
        return 'document-text-outline';
      case 'digest':
        return 'newspaper-outline';
      case 'cache':
        return 'folder-outline';
      default:
        return 'file-outline';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'magazine':
        return theme.colors.primary;
      case 'article':
        return theme.colors.info;
      case 'digest':
        return theme.colors.success;
      case 'cache':
        return theme.colors.warning;
      default:
        return theme.colors.textSecondary;
    }
  };

  const formatStorageSize = (size: number) => {
    if (size >= 1) {
      return `${size.toFixed(1)} GB`;
    } else {
      return `${(size * 1024).toFixed(0)} MB`;
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.xl,
    },
    content: {
      flex: 1,
      maxWidth: isTablet ? 800 : '100%',
      alignSelf: 'center',
      width: '100%',
    },
    sectionHeader: {
      marginBottom: theme.spacing.lg,
      paddingHorizontal: theme.spacing.lg,
    },
    sectionTitle: {
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
      fontSize: isTablet ? theme.typography.fontSize.xl : theme.typography.fontSize.lg,
    },
    sectionSubtitle: {
      color: theme.colors.textSecondary,
      fontSize: isTablet ? theme.typography.fontSize.base : theme.typography.fontSize.sm,
    },
    statsContainer: {
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
    },
    statsCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
      ...theme.shadows.md,
    },
    statsHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    statsTitle: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.bold as any,
      marginLeft: theme.spacing.sm,
    },
    storageBar: {
      height: 8,
      backgroundColor: theme.colors.border,
      borderRadius: 4,
      marginBottom: theme.spacing.md,
      overflow: 'hidden',
    },
    storageBarFill: {
      height: '100%',
      backgroundColor: theme.colors.primary,
      borderRadius: 4,
    },
    storageInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    storageText: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSize.sm,
    },
    storageValue: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.medium as any,
    },
    settingsContainer: {
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
    },
    settingItem: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      ...theme.shadows.sm,
    },
    settingInfo: {
      flex: 1,
    },
    settingTitle: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.medium as any,
      marginBottom: theme.spacing.xs,
    },
    settingDescription: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSize.sm,
    },
    itemsContainer: {
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
    },
    itemCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
      ...theme.shadows.sm,
    },
    itemIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    itemInfo: {
      flex: 1,
    },
    itemName: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.medium as any,
      marginBottom: theme.spacing.xs,
    },
    itemMeta: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    itemSize: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSize.sm,
      marginRight: theme.spacing.md,
    },
    itemDate: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSize.sm,
    },
    actionButton: {
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
    },
    clearCacheButton: {
      backgroundColor: theme.colors.error,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      alignItems: 'center',
      marginHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
      ...theme.shadows.md,
    },
    clearCacheText: {
      color: theme.colors.textInverse,
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.medium as any,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.xl,
    },
    loadingText: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSize.base,
      marginTop: theme.spacing.md,
    },
  });

  if (loading) {
    return (
      <ScreenWrapper>
        <ScreenHeader title="Storage & Data" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading storage data...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <ScreenHeader title="Storage & Data" />
        
        <Animated.View entering={FadeInDown.delay(200)} style={styles.header}>
          <View style={styles.content}>
            {/* Storage Overview */}
            <View style={styles.statsContainer}>
              <View style={styles.statsCard}>
                <View style={styles.statsHeader}>
                  <Ionicons name="hardware-chip" size={24} color={theme.colors.primary} />
                  <Text style={styles.statsTitle}>Storage Overview</Text>
                </View>
                
                <View style={styles.storageBar}>
                  <View 
                    style={[
                      styles.storageBarFill, 
                      { width: `${(storageStats.usedSpace / (storageStats.usedSpace + storageStats.availableSpace)) * 100}%` }
                    ]} 
                  />
                </View>
                
                <View style={styles.storageInfo}>
                  <Text style={styles.storageText}>Used Space</Text>
                  <Text style={styles.storageValue}>{formatStorageSize(storageStats.usedSpace)}</Text>
                </View>
                
                <View style={styles.storageInfo}>
                  <Text style={styles.storageText}>Available Space</Text>
                  <Text style={styles.storageValue}>{formatStorageSize(storageStats.availableSpace)}</Text>
                </View>
              </View>
            </View>

            {/* Download Settings */}
            <View style={styles.settingsContainer}>
              <View style={styles.sectionHeader}>
                <H2 style={styles.sectionTitle}>Download Settings</H2>
                <Body style={styles.sectionSubtitle}>
                  Manage your download preferences and storage
                </Body>
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Auto Download</Text>
                  <Text style={styles.settingDescription}>
                    Automatically download new content when available
                  </Text>
                </View>
                <Switch
                  value={autoDownload}
                  onValueChange={setAutoDownload}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                  thumbColor={theme.colors.textInverse}
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>WiFi Only</Text>
                  <Text style={styles.settingDescription}>
                    Download content only when connected to WiFi
                  </Text>
                </View>
                <Switch
                  value={wifiOnly}
                  onValueChange={setWifiOnly}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                  thumbColor={theme.colors.textInverse}
                />
              </View>
            </View>

            {/* Downloaded Content */}
            <Animated.View entering={FadeInUp.delay(400)} style={styles.itemsContainer}>
              <View style={styles.sectionHeader}>
                <H2 style={styles.sectionTitle}>Downloaded Content</H2>
                <Body style={styles.sectionSubtitle}>
                  {downloadedItems.length} items • {formatStorageSize(storageStats.totalDownloaded)}
                </Body>
              </View>

              {downloadedItems.map((item) => (
                <View key={item.id} style={styles.itemCard}>
                  <View style={[
                    styles.itemIcon,
                    { backgroundColor: getTypeColor(item.type) + '20' }
                  ]}>
                    <Ionicons 
                      name={getTypeIcon(item.type) as any} 
                      size={20} 
                      color={getTypeColor(item.type)} 
                    />
                  </View>
                  
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <View style={styles.itemMeta}>
                      <Text style={styles.itemSize}>{item.size}</Text>
                      <Text style={styles.itemDate}>{item.date}</Text>
                    </View>
                  </View>
                  
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleDeleteDownload(item)}
                  >
                    <Ionicons name="trash-outline" size={20} color={theme.colors.error} />
                  </TouchableOpacity>
                </View>
              ))}
            </Animated.View>

            {/* Cache Management */}
            <Animated.View entering={FadeInUp.delay(600)} style={styles.itemsContainer}>
              <View style={styles.sectionHeader}>
                <H2 style={styles.sectionTitle}>Cache Management</H2>
                <Body style={styles.sectionSubtitle}>
                  {cacheItems.length} items • {formatStorageSize(storageStats.totalCache)}
                </Body>
              </View>

              {cacheItems.map((item) => (
                <View key={item.id} style={styles.itemCard}>
                  <View style={[
                    styles.itemIcon,
                    { backgroundColor: getTypeColor(item.type) + '20' }
                  ]}>
                    <Ionicons 
                      name={getTypeIcon(item.type) as any} 
                      size={20} 
                      color={getTypeColor(item.type)} 
                    />
                  </View>
                  
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <View style={styles.itemMeta}>
                      <Text style={styles.itemSize}>{item.size}</Text>
                      <Text style={styles.itemDate}>{item.date}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </Animated.View>

            {/* Clear Cache Button */}
            <TouchableOpacity
              style={styles.clearCacheButton}
              onPress={handleClearCache}
              activeOpacity={0.8}
            >
              <Text style={styles.clearCacheText}>Clear All Cache</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </ScreenWrapper>
  );
} 