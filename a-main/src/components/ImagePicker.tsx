import React, { useState } from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';

import * as ExpoImagePicker from 'expo-image-picker';

interface ImagePickerProps {
  currentImageUrl?: string | null;
  onImageSelected: (imageUrl: string) => void;
  size?: number;
  disabled?: boolean;
  loading?: boolean;
}

export const ImagePicker: React.FC<ImagePickerProps> = ({
  currentImageUrl,
  onImageSelected,
  size = 120,
  disabled = false,
  loading = false,
}) => {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const requestPermissions = async () => {
    const { status } = await ExpoImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Sorry, we need camera roll permissions to make this work!',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    if (disabled || loading) return;

    try {
      setIsLoading(true);
      
      // Show options for image selection
      Alert.alert(
        'Update Profile Image',
        'Choose how you want to update your profile image:',
        [
          {
            text: 'Choose from Gallery',
            onPress: async () => {
              const hasPermission = await requestPermissions();
              if (!hasPermission) return;

              const result = await ExpoImagePicker.launchImageLibraryAsync({
                mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
              });

              if (!result.canceled && result.assets && result.assets[0]) {
                const imageUri = result.assets[0].uri;
                onImageSelected(imageUri);
              }
            }
          },
          {
            text: 'Take Photo',
            onPress: async () => {
              const { status } = await ExpoImagePicker.requestCameraPermissionsAsync();
              if (status !== 'granted') {
                Alert.alert(
                  'Camera Permission Required',
                  'Sorry, we need camera permissions to take a photo!',
                  [{ text: 'OK' }]
                );
                return;
              }

              const result = await ExpoImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
              });

              if (!result.canceled && result.assets && result.assets[0]) {
                const imageUri = result.assets[0].uri;
                onImageSelected(imageUri);
              }
            }
          },
          {
            text: 'Use Custom URL',
            onPress: () => {
              Alert.prompt(
                'Enter Image URL',
                'Please enter a valid image URL:',
                [
                  {
                    text: 'Cancel',
                    style: 'cancel'
                  },
                  {
                    text: 'Update',
                    onPress: (url) => {
                      if (url && url.trim()) {
                        onImageSelected(url.trim());
                      }
                    }
                  }
                ],
                'plain-text',
                'https://example.com/image.jpg'
              );
            }
          },
          {
            text: 'Cancel',
            style: 'cancel'
          }
        ]
      );
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      position: 'relative',
    },
    image: {
      width: size,
      height: size,
      borderRadius: size / 2,
      borderWidth: 4,
      borderColor: theme.colors.primary,
    },
    editButton: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: size * 0.3,
      height: size * 0.3,
      borderRadius: (size * 0.3) / 2,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      ...theme.shadows.md,
      elevation: 4,
      opacity: disabled ? 0.5 : 1,
    },
    loadingOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      borderRadius: size / 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <Image 
        source={{ 
          uri: currentImageUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'
        }} 
        style={styles.image}
      />
      
      {(loading || isLoading) && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color={theme.colors.textInverse} />
        </View>
      )}
      
      <TouchableOpacity 
        style={styles.editButton}
        onPress={pickImage}
        disabled={disabled || loading || isLoading}
        activeOpacity={0.8}
      >
        <Ionicons 
          name="camera" 
          size={size * 0.15} 
          color={theme.colors.textInverse} 
        />
      </TouchableOpacity>
    </View>
  );
}; 