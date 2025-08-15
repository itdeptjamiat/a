import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { 
  selectUser, 
  selectUserId,
  selectProfileData,
  selectProfileLoading,
  selectProfileError,
  fetchUserProfile,
  updateProfileImage
} from '@/redux/selectors';
import { useTheme } from '@/context/ThemeContext';

export const PersistenceTest: React.FC = () => {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  
  const user = useAppSelector(selectUser);
  const userId = useAppSelector(selectUserId);
  const profileData = useAppSelector(selectProfileData);
  const profileLoading = useAppSelector(selectProfileLoading);
  const profileError = useAppSelector(selectProfileError);

  const testProfileFetch = () => {
    if (userId) {
      const uid = typeof userId === 'string' ? parseInt(userId) : userId;
      console.log('🔍 Testing Profile Fetch - User ID:', uid);
      dispatch(fetchUserProfile(uid));
    } else {
      console.log('❌ No user ID available for profile fetch');
    }
  };

  const testProfileImageUpdate = () => {
    console.log('🔍 Profile Image Update - Disabled for now (will be implemented with R2 storage)');
    Alert.alert(
      'Image Update',
      'Profile image update functionality is temporarily disabled. Will be re-implemented with R2 storage.',
      [{ text: 'OK' }]
    );
  };

  useEffect(() => {
    console.log('🔍 PersistenceTest - User:', user);
    console.log('🔍 PersistenceTest - User ID:', userId);
    console.log('🔍 PersistenceTest - Profile Data:', profileData);
    console.log('🔍 PersistenceTest - Profile Loading:', profileLoading);
    console.log('🔍 PersistenceTest - Profile Error:', profileError);
  }, [user, userId, profileData, profileLoading, profileError]);

  const styles = StyleSheet.create({
    container: {
      padding: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      margin: theme.spacing.md,
      ...theme.shadows.sm,
    },
    title: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.bold as any,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    text: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs,
    },
    button: {
      backgroundColor: theme.colors.primary,
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      marginTop: theme.spacing.sm,
      alignItems: 'center',
    },
    buttonText: {
      color: theme.colors.textInverse,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.medium as any,
    },
    errorText: {
      color: theme.colors.error,
      fontSize: theme.typography.fontSize.sm,
      marginTop: theme.spacing.sm,
    },
    successText: {
      color: theme.colors.success,
      fontSize: theme.typography.fontSize.sm,
      marginTop: theme.spacing.sm,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>API Test Panel</Text>
      
      <Text style={styles.text}>User ID: {userId || 'Not available'}</Text>
      <Text style={styles.text}>Profile Loading: {profileLoading ? 'Yes' : 'No'}</Text>
      <Text style={styles.text}>Profile Data: {profileData ? 'Loaded' : 'Not loaded'}</Text>
      
      {profileError && (
        <Text style={styles.errorText}>Error: {profileError}</Text>
      )}
      
      {profileData && (
        <Text style={styles.successText}>
          Profile: {profileData.name} ({profileData.email})
        </Text>
      )}
      
      <TouchableOpacity style={styles.button} onPress={testProfileFetch}>
        <Text style={styles.buttonText}>Test Profile Fetch</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={testProfileImageUpdate}>
        <Text style={styles.buttonText}>Test Profile Image Update</Text>
      </TouchableOpacity>
    </View>
  );
}; 