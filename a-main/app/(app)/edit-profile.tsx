import React, { useState, useEffect } from 'react';
import { 
  View, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  Text, 
  TextInput, 
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { ScreenHeader, ScreenWrapper } from '@/components';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { ImageUploadService } from '@/services/imageUpload';

import { useTheme } from '@/context/ThemeContext';
import { useWindowDimensions } from '@/hooks/useWindowDimensions';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { 
  selectProfileData,
  selectProfileLoading,
  selectProfileError,
  selectProfileUid,
  selectUserId,
  updateUserProfile,
  updateProfileImage
} from '@/redux/selectors';
import { useRouter } from 'expo-router';
import { H1, H2, H3, Body } from '@/typography';

export default function EditProfileScreen() {
  const { theme } = useTheme();
  const { isTablet } = useWindowDimensions();
  const dispatch = useAppDispatch();
  const userId = useAppSelector(selectUserId);
  const router = useRouter();
  
  const profileData = useAppSelector(selectProfileData);
  const profileUid = useAppSelector(selectProfileUid);
  const loading = useAppSelector(selectProfileLoading);
  const error = useAppSelector(selectProfileError);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    profilePic: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  // Initialize form data when profile data is loaded
  useEffect(() => {
    if (profileData) {
      setFormData({
        name: profileData.name || '',
        email: profileData.email || '',
        username: profileData.username || '',
        profilePic: profileData.profilePic || ''
      });
    }
  }, [profileData]);

  // Validation functions
  const validateName = (name: string) => {
    if (!name.trim()) return 'Name is required';
    if (name.trim().length < 2) return 'Name must be at least 2 characters';
    return '';
  };

  const validateEmail = (email: string) => {
    if (!email.trim()) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email';
    return '';
  };

  const validateUsername = (username: string) => {
    if (!username.trim()) return 'Username is required';
    if (username.trim().length < 3) return 'Username must be at least 3 characters';
    if (!/^[a-zA-Z0-9_]+$/.test(username)) return 'Username can only contain letters, numbers, and underscores';
    return '';
  };



  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    const nameError = validateName(formData.name);
    if (nameError) errors.name = nameError;
    
    const emailError = validateEmail(formData.email);
    if (emailError) errors.email = emailError;
    
    const usernameError = validateUsername(formData.username);
    if (usernameError) errors.username = usernameError;
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImagePicker = async () => {
    try {
      setIsUploadingImage(true);
      const result = await ImageUploadService.pickAndUploadImage(typeof userId === 'number' ? userId : undefined);
      
      if (result.success && result.imageUrl) {
        handleInputChange('profilePic', result.imageUrl);
      } else if (result.error) {
        Alert.alert('Upload Failed', result.error);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick and upload image. Please try again.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleCameraCapture = async () => {
    try {
      setIsUploadingImage(true);
      const result = await ImageUploadService.takePhotoAndUpload(typeof userId === 'number' ? userId : undefined);
      
      if (result.success && result.imageUrl) {
        handleInputChange('profilePic', result.imageUrl);
      } else if (result.error) {
        Alert.alert('Upload Failed', result.error);
      }
    } catch (error) {
      console.error('Error capturing photo:', error);
      Alert.alert('Error', 'Failed to capture and upload photo. Please try again.');
    } finally {
      setIsUploadingImage(false);
    }
  };



  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors before submitting.');
      return;
    }

    if (!profileUid) {
      Alert.alert('Error', 'User ID not found. Please try again.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Update profile data
      await dispatch(updateUserProfile({
        uid: profileUid,
        name: formData.name,
        email: formData.email,
        username: formData.username,
        profilePic: formData.profilePic
      })).unwrap();

      Alert.alert(
        'Success',
        'Profile updated successfully!',
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
    } catch (error) {
      console.error('Profile update error:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
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
      maxWidth: isTablet ? 600 : '100%',
      alignSelf: 'center',
      width: '100%',
    },
    sectionHeader: {
      marginBottom: theme.spacing.lg,
      paddingHorizontal: theme.spacing.lg,
    },
    mainSectionTitle: {
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
      fontSize: isTablet ? theme.typography.fontSize.xl : theme.typography.fontSize.lg,
    },
    sectionSubtitle: {
      color: theme.colors.textSecondary,
      fontSize: isTablet ? theme.typography.fontSize.base : theme.typography.fontSize.sm,
    },
    formContainer: {
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.xl,
    },
    formSection: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing.lg,
      overflow: 'hidden',
      ...theme.shadows.md,
    },
    sectionTitle: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.bold as any,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.lg,
    },
    inputGroup: {
      marginBottom: theme.spacing.lg,
      paddingHorizontal: theme.spacing.lg,
    },
    inputLabel: {
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.medium as any,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      fontSize: theme.typography.fontSize.base,
      color: theme.colors.text,
      backgroundColor: theme.colors.background,
    },
    inputError: {
      borderColor: theme.colors.error,
    },
    errorText: {
      color: theme.colors.error,
      fontSize: theme.typography.fontSize.xs,
      marginTop: theme.spacing.xs,
    },
    imageSection: {
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.lg,
    },
    imagePreview: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: theme.spacing.md,
      alignSelf: 'center',
      borderWidth: 2,
      borderColor: theme.colors.primary,
    },
    imageActionsContainer: {
      marginTop: theme.spacing.lg,
      paddingHorizontal: theme.spacing.lg,
    },
    imageActionsTitle: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.bold as any,
      marginBottom: theme.spacing.md,
      textAlign: 'center',
    },
    imageIconsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    imageIconButton: {
      alignItems: 'center',
      minWidth: 120,
      paddingHorizontal: theme.spacing.sm,
    },
    imageIconGradient: {
      width: 70,
      height: 70,
      borderRadius: 35,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.sm,
      ...theme.shadows.lg,
      elevation: 8,
    },
    imageIconText: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.medium as any,
      textAlign: 'center',
    },
    actionContainer: {
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.xl,
    },
    submitButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: theme.spacing.md,
    },
    submitButtonText: {
      color: theme.colors.textInverse,
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.bold as any,
      marginLeft: theme.spacing.sm,
    },
    cancelButton: {
      backgroundColor: theme.colors.surface,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    cancelButtonText: {
      color: theme.colors.text,
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

  if (loading && !profileData) {
    return (
      <ScreenWrapper>
        <ScreenHeader title="Edit Profile" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading profile data...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <ScreenHeader 
            title="Edit Profile" 
            showBackButton={true}
            onBackPress={() => router.back()}
          />
          
          <Animated.View entering={FadeInDown.delay(200)} style={styles.header}>
            <View style={styles.content}>
              {/* Section Header */}
              <View style={styles.sectionHeader}>
                <H2 style={styles.mainSectionTitle}>Update Your Profile</H2>
                <Body style={styles.sectionSubtitle}>
                  Make changes to your profile information
                </Body>
              </View>

              {/* Form Container */}
              <View style={styles.formContainer}>
                {/* Profile Image Section */}
                <View style={styles.formSection}>
                  <Text style={styles.sectionTitle}>Profile Picture</Text>
                  <View style={styles.imageSection}>
                    {formData.profilePic && (
                      <Animated.Image 
                        source={{ uri: formData.profilePic }} 
                        style={styles.imagePreview}
                        entering={FadeInUp.delay(300)}
                      />
                    )}
                    <View style={styles.imageActionsContainer}>
                      <Text style={styles.imageActionsTitle}>Change Profile Picture</Text>
                      <View style={styles.imageIconsContainer}>
                        <Animated.View entering={FadeInUp.delay(300)}>
                          <TouchableOpacity
                          style={[
                            styles.imageIconButton,
                            isUploadingImage && { opacity: 0.6 }
                          ]}
                          onPress={handleImagePicker}
                          disabled={isUploadingImage}
                          activeOpacity={0.7}
                        >
                          <LinearGradient
                            colors={[theme.colors.primary, theme.colors.primaryDark]}
                            style={styles.imageIconGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                          >
                            {isUploadingImage ? (
                              <ActivityIndicator size="small" color={theme.colors.textInverse} />
                            ) : (
                              <Ionicons name="images" size={24} color={theme.colors.textInverse} />
                            )}
                          </LinearGradient>
                          <Text style={styles.imageIconText}>
                            {isUploadingImage ? 'Uploading...' : 'Gallery'}
                          </Text>
                        </TouchableOpacity>
                        </Animated.View>
                        
                        <Animated.View entering={FadeInUp.delay(500)}>
                          <TouchableOpacity
                          style={[
                            styles.imageIconButton,
                            isUploadingImage && { opacity: 0.6 }
                          ]}
                          onPress={handleCameraCapture}
                          disabled={isUploadingImage}
                          activeOpacity={0.7}
                        >
                          <LinearGradient
                            colors={[theme.colors.success, theme.colors.info]}
                            style={styles.imageIconGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                          >
                            {isUploadingImage ? (
                              <ActivityIndicator size="small" color={theme.colors.textInverse} />
                            ) : (
                              <Ionicons name="camera" size={24} color={theme.colors.textInverse} />
                            )}
                          </LinearGradient>
                          <Text style={styles.imageIconText}>
                            {isUploadingImage ? 'Uploading...' : 'Camera'}
                          </Text>
                        </TouchableOpacity>
                        </Animated.View>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Personal Information Section */}
                <View style={styles.formSection}>
                  <Text style={styles.sectionTitle}>Personal Information</Text>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Full Name</Text>
                    <TextInput
                      style={[
                        styles.input,
                        validationErrors.name && styles.inputError
                      ]}
                      value={formData.name}
                      onChangeText={(text) => handleInputChange('name', text)}
                      placeholder="Enter your full name"
                      placeholderTextColor={theme.colors.textSecondary}
                    />
                    {validationErrors.name && (
                      <Text style={styles.errorText}>{validationErrors.name}</Text>
                    )}
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Email Address</Text>
                    <TextInput
                      style={[
                        styles.input,
                        validationErrors.email && styles.inputError
                      ]}
                      value={formData.email}
                      onChangeText={(text) => handleInputChange('email', text)}
                      placeholder="Enter your email address"
                      placeholderTextColor={theme.colors.textSecondary}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                    {validationErrors.email && (
                      <Text style={styles.errorText}>{validationErrors.email}</Text>
                    )}
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Username</Text>
                    <TextInput
                      style={[
                        styles.input,
                        validationErrors.username && styles.inputError
                      ]}
                      value={formData.username}
                      onChangeText={(text) => handleInputChange('username', text)}
                      placeholder="Enter your username"
                      placeholderTextColor={theme.colors.textSecondary}
                      autoCapitalize="none"
                    />
                    {validationErrors.username && (
                      <Text style={styles.errorText}>{validationErrors.username}</Text>
                    )}
                  </View>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionContainer}>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                  activeOpacity={0.8}
                >
                  {isSubmitting ? (
                    <ActivityIndicator size="small" color={theme.colors.textInverse} />
                  ) : (
                    <Ionicons name="checkmark" size={20} color={theme.colors.textInverse} />
                  )}
                  <Text style={styles.submitButtonText}>
                    {isSubmitting ? 'Updating...' : 'Update Profile'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => router.back()}
                  activeOpacity={0.8}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
} 