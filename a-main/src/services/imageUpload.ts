import { APIIns } from '@/axios/EchoInstance';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';

export interface ImageUploadResult {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

export class ImageUploadService {
  /**
   * Pick an image from gallery and upload it to R2 storage
   */
  static async pickAndUploadImage(userId?: number): Promise<ImageUploadResult> {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        return {
          success: false,
          error: 'Camera roll permission is required to select images'
        };
      }

      // Pick image from gallery
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5, // Reduced quality to reduce file size
        allowsMultipleSelection: false,
      });

      if (result.canceled || !result.assets || !result.assets[0]) {
        return {
          success: false,
          error: 'No image selected'
        };
      }

      const imageUri = result.assets[0].uri;
      
      // Upload the image
      return await this.uploadImageToR2(imageUri, userId);
    } catch (error) {
      console.error('Image pick and upload error:', error);
      return {
        success: false,
        error: 'Failed to pick and upload image'
      };
    }
  }

  /**
   * Take a photo with camera and upload it to R2 storage
   */
  static async takePhotoAndUpload(userId?: number): Promise<ImageUploadResult> {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        return {
          success: false,
          error: 'Camera permission is required to take photos'
        };
      }

      // Take photo
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5, // Reduced quality to reduce file size
      });

      if (result.canceled || !result.assets || !result.assets[0]) {
        return {
          success: false,
          error: 'No photo taken'
        };
      }

      const imageUri = result.assets[0].uri;
      
      // Upload the image
      return await this.uploadImageToR2(imageUri, userId);
    } catch (error) {
      console.error('Photo capture and upload error:', error);
      return {
        success: false,
        error: 'Failed to take and upload photo'
      };
    }
  }

    /**
   * Upload image from local URI to R2 storage via API
   * Uses the correct endpoint: POST /user/update-profile-img/{uid}
   */
  static async uploadImageToR2(imageUri: string, userId?: number): Promise<ImageUploadResult> {
    try {
      console.log('🔍 Image Upload - Starting upload for URI:', imageUri);

      if (!userId) {
        throw new Error('User ID is required for image upload');
      }

      // Create form data for file upload
      const formData = new FormData();
      
      // Get file name from URI
      const fileName = imageUri.split('/').pop() || 'profile-image.jpg';
      const fileExtension = fileName.split('.').pop() || 'jpg';
      const mimeType = `image/${fileExtension}`;

      // Append the image file
      formData.append('profileImage', {
        uri: imageUri,
        type: mimeType,
        name: `profile-${Date.now()}.${fileExtension}`,
      } as any);

      // Upload to the correct API endpoint
      const response = await APIIns.post(`/user/update-profile-img/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000, // 60 seconds timeout for upload
        maxContentLength: 5 * 1024 * 1024, // 5MB max
        maxBodyLength: 5 * 1024 * 1024, // 5MB max
      });

      console.log('🔍 Image Upload - API Response:', response.data);

      if (response.data.success) {
        const imageUrl = response.data.data.profilePic;
        
        Toast.show({
          type: 'success',
          text1: 'Image Uploaded',
          text2: 'Your profile image has been uploaded successfully',
        });

        return {
          success: true,
          imageUrl: imageUrl
        };
      } else {
        throw new Error(response.data.message || 'Upload failed');
      }
    } catch (error: any) {
      console.error('❌ Image Upload - Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      const errorMessage = error.response?.data?.message || 'Failed to upload image';
      
      Toast.show({
        type: 'error',
        text1: 'Upload Failed',
        text2: errorMessage,
      });

      return {
        success: false,
        error: errorMessage
      };
    }
  }

  /**
   * Validate if a URL is a valid image URL
   */
  static validateImageUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
      const pathname = urlObj.pathname.toLowerCase();
      
      return validExtensions.some(ext => pathname.endsWith(ext));
    } catch {
      return false;
    }
  }
} 