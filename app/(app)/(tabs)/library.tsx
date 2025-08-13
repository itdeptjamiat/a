import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, FlatList, ActivityIndicator, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '@/context/ThemeContext';
import { ScreenHeader, ScreenWrapper } from '@/components';
import { CoverCardPortrait } from '@/components/home';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchMagazinesOnly } from '@/redux/actions/magazineActions';
import { selectMagazines, selectMagazineLoading, selectMagazineError } from '@/redux/selectors/magazineSelectors';

type LibraryTab = 'favorites' | 'downloads' | 'recentlyRead' | 'bookmarks';
type SortOption = 'newArrivals' | 'titleAsc' | 'titleDesc' | 'recentlyRead';

const MyLibraryScreen: React.FC = () => {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();

  const [activeTab, setActiveTab] = useState<LibraryTab>('favorites');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>('newArrivals');
  const [showSortOptions, setShowSortOptions] = useState(false);

  const allMagazines = useAppSelector(selectMagazines); // Using magazines as placeholder for all content types
  const loading = useAppSelector(selectMagazineLoading);
  const error = useAppSelector(selectMagazineError);

  useEffect(() => {
    // Fetch all content for demonstration, ideally separate fetches for each tab
    dispatch(fetchMagazinesOnly(undefined));
  }, [dispatch]);

  const getFilteredAndSortedContent = useCallback(() => {
    let content: any[] = [];
    switch (activeTab) {
      case 'favorites':
        // Placeholder: filter allMagazines for some favorites
        content = allMagazines.filter((_, idx) => idx % 3 === 0);
        break;
      case 'downloads':
        // Placeholder: filter allMagazines for some downloads
        content = allMagazines.filter((_, idx) => idx % 2 === 0);
        break;
      case 'recentlyRead':
        // Placeholder: empty or some recently read items
        content = [];
        break;
      case 'bookmarks':
        // Placeholder: filter allMagazines for some bookmarks
        content = allMagazines.filter((_, idx) => idx % 4 === 0);
        break;
      default:
        content = [];
    }

    switch (sortOption) {
      case 'newArrivals':
        return [...content].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'titleAsc':
        return [...content].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      case 'titleDesc':
        return [...content].sort((a, b) => (b.name || '').localeCompare(a.name || ''));
      case 'recentlyRead':
        // This sort option only makes sense for recentlyRead tab
        return content; // Already handled by placeholder logic
      default:
        return content;
    }
  }, [activeTab, sortOption, allMagazines]);

  const displayedContent = getFilteredAndSortedContent();

  const handleToggleEdit = useCallback(() => {
    setIsEditing((prev) => !prev);
    setSelectedItems([]); // Clear selections when toggling edit mode
  }, []);

  const handleSelectItem = useCallback((id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedItems.length === displayedContent.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(displayedContent.map((item) => item.mid));
    }
  }, [selectedItems, displayedContent]);

  const handleRemoveSelected = useCallback(() => {
    // Logic to remove selected items from state/backend
    console.log('Removing items:', selectedItems);
    setSelectedItems([]);
    setIsEditing(false);
  }, [selectedItems]);

  const renderContentGrid = useCallback(() => {
    if (loading) {
      return (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      );
    }
    if (error) {
      return (
        <View style={styles.centerContent}>
          <Text style={{ color: theme.colors.error }}>Error: {error}</Text>
        </View>
      );
    }
    if (displayedContent.length === 0) {
      return (
        <View style={styles.centerContent}>
          {activeTab === 'recentlyRead' ? (
            <View style={styles.emptyStateContainer}>
              <Ionicons name="checkmark-circle" size={48} color={theme.colors.textSecondary} />
              <Text style={styles.emptyStateTitle}>Recently read</Text>
              <Text style={styles.emptyStateText}>Once you start reading, titles will appear here – so you don’t lose track.</Text>
            </View>
          ) : (
            <Text style={styles.emptyStateText}>No items in this section.</Text>
          )}
        </View>
      );
    }

    return (
      <FlatList
        data={displayedContent}
        keyExtractor={(item) => String(item.mid)}
        numColumns={2} // Two columns as per screenshots
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => {
              if (isEditing) {
                handleSelectItem(item.mid);
              } else {
                // Navigate to detail page
                console.log('Navigate to item:', item.name);
              }
            }}
            activeOpacity={0.8}
          >
            <CoverCardPortrait item={item} index={0} onPress={() => {}} />
            {isEditing && (
              <View style={styles.selectOverlay}>
                <Ionicons
                  name={selectedItems.includes(item.mid) ? 'checkmark-circle' : 'ellipse-outline'}
                  size={24}
                  color={selectedItems.includes(item.mid) ? theme.colors.primary : theme.colors.textInverse}
                />
              </View>
            )}
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.gridContainer}
      />
    );
  }, [loading, error, displayedContent, isEditing, selectedItems, handleSelectItem, activeTab, theme]);

  const styles = StyleSheet.create({
    headerRight: {
      color: theme.colors.primary,
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.semibold as any,
    },
    tabsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    tabButton: {
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
    },
    tabText: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.medium as any,
    },
    activeTabText: {
      color: theme.colors.text,
      fontWeight: theme.typography.fontWeight.bold as any,
    },
    activeTabIndicator: {
      height: 3,
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.full,
      position: 'absolute',
      bottom: 0,
      left: '20%',
      right: '20%',
    },
    controlsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
    },
    sortButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.surfaceLight,
    },
    sortText: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSize.sm,
      marginLeft: theme.spacing.xs,
    },
    sortOptionModalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    sortOptionModalContent: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      width: '80%',
      maxWidth: 300,
    },
    sortOptionItem: {
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
    },
    sortOptionText: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.base,
    },
    editBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    editButton: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.primary,
    },
    editButtonText: {
      color: theme.colors.textInverse,
      fontWeight: theme.typography.fontWeight.bold as any,
    },
    gridContainer: {
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.xl,
    },
    gridItem: {
      flex: 1,
      margin: theme.spacing.sm,
      maxWidth: '47%', // Approx half width minus margin
    },
    selectOverlay: {
      position: 'absolute',
      top: theme.spacing.sm,
      right: theme.spacing.sm,
      backgroundColor: 'rgba(255,255,255,0.7)',
      borderRadius: theme.borderRadius.full,
      padding: 2,
    },
    centerContent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.lg,
    },
    emptyStateContainer: {
      alignItems: 'center',
      paddingVertical: theme.spacing.xl,
    },
    emptyStateTitle: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.xl,
      fontWeight: theme.typography.fontWeight.bold as any,
      marginTop: theme.spacing.md,
    },
    emptyStateText: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSize.base,
      textAlign: 'center',
      marginTop: theme.spacing.sm,
      maxWidth: '80%',
    },
  });

  return (
    <ScreenWrapper>
      <ScreenHeader
        title="My Library"
        rightContent={isEditing ? (
          <TouchableOpacity onPress={handleToggleEdit}>
            <Text style={styles.headerRight}>Cancel</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleToggleEdit}>
            <Text style={styles.headerRight}>Edit</Text>
          </TouchableOpacity>
        )}
      />

      <View style={styles.tabsContainer}>
        <TouchableOpacity style={styles.tabButton} onPress={() => setActiveTab('favorites')}>
          <Text style={[styles.tabText, activeTab === 'favorites' && styles.activeTabText]}>Favorites</Text>
          {activeTab === 'favorites' && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton} onPress={() => setActiveTab('downloads')}>
          <Text style={[styles.tabText, activeTab === 'downloads' && styles.activeTabText]}>Downloads</Text>
          {activeTab === 'downloads' && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton} onPress={() => setActiveTab('recentlyRead')}>
          <Text style={[styles.tabText, activeTab === 'recentlyRead' && styles.activeTabText]}>Recently read</Text>
          {activeTab === 'recentlyRead' && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton} onPress={() => setActiveTab('bookmarks')}>
          <Text style={[styles.tabText, activeTab === 'bookmarks' && styles.activeTabText]}>Bookmarks</Text>
          {activeTab === 'bookmarks' && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>
        </View>
        
      <View style={styles.controlsContainer}>
        {!isEditing && (
          <TouchableOpacity style={styles.sortButton} onPress={() => setShowSortOptions(true)}>
            <Ionicons name="filter" size={16} color={theme.colors.textSecondary} />
            <Text style={styles.sortText}>Sort By {sortOption === 'newArrivals' ? 'New Arrivals' : sortOption === 'titleAsc' ? 'Title (A-Z)' : sortOption === 'titleDesc' ? 'Title (Z-A)' : 'Recently read'}</Text>
        </TouchableOpacity>
        )}
        {isEditing && (
          <TouchableOpacity onPress={handleSelectAll}>
            <Text style={styles.headerRight}>{selectedItems.length === displayedContent.length ? 'Deselect all' : 'Select all'}</Text>
            </TouchableOpacity>
        )}
        </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {renderContentGrid()}
      </ScrollView>

      {isEditing && (
        <View style={styles.editBar}>
          <Text style={styles.tabText}>{selectedItems.length} selected</Text>
        <TouchableOpacity 
            style={[styles.editButton, selectedItems.length === 0 && { opacity: 0.5 }]} // Dim if no items selected
            onPress={handleRemoveSelected}
            disabled={selectedItems.length === 0}
        >
            <Ionicons name="trash-outline" size={20} color={theme.colors.textInverse} />
            <Text style={styles.editButtonText}>Remove ({selectedItems.length})</Text>
        </TouchableOpacity>
        </View>
      )}

      <Modal
        transparent={true}
        visible={showSortOptions}
        onRequestClose={() => setShowSortOptions(false)}
        animationType="fade"
              >
                <TouchableOpacity
          style={styles.sortOptionModalOverlay}
          activeOpacity={1}
          onPress={() => setShowSortOptions(false)}
        >
          <View style={styles.sortOptionModalContent}>
            {['newArrivals', 'titleAsc', 'titleDesc', 'recentlyRead'].map((option) => (
                          <TouchableOpacity 
                key={option}
                style={styles.sortOptionItem}
                onPress={() => {
                  setSortOption(option as SortOption);
                  setShowSortOptions(false);
                }}
              >
                <Text style={[styles.sortOptionText, sortOption === option && { fontWeight: theme.typography.fontWeight.bold as any }]}>
                  {option === 'newArrivals' ? 'New Arrivals' : option === 'titleAsc' ? 'Title (A-Z)' : option === 'titleDesc' ? 'Title (Z-A)' : 'Recently read'}
                              </Text>
                </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </ScreenWrapper>
  );
};

export default MyLibraryScreen;
