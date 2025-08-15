import { createAsyncThunk } from '@reduxjs/toolkit';
import Toast from 'react-native-toast-message';
import { APIIns } from '@/axios/EchoInstance';

interface ProfileData {
  _id: string;
  username: string;
  name: string;
  email: string;
  uid: number;
  profilePic?: string;
  userType?: string;
  plan?: string;
  isVerified?: boolean;
  createdAt?: string;
  __v?: number;
}

interface UpdateProfileImageData {
  uid: number;
  profileImageUrl: string;
}

interface UpdateProfileData {
  uid: number;
  name?: string;
  email?: string;
  username?: string;
  profilePic?: string;
}

// Fetch user profile data
export const fetchUserProfile = createAsyncThunk(
  'profile/fetchUserProfile',
  async (uid: number, { rejectWithValue }) => {
    try {
      console.log('🔍 Profile Debug - Fetching profile for UID:', uid);
      
      const response = await APIIns.get(`/user/profile/${uid}`);
      console.log('🔍 Profile Debug - API Response:', response.data);
      
      if (response.data.success) {
        // Map the API response to our ProfileData interface
        const userData = response.data.data.user;
        const profileData: ProfileData = {
          _id: userData._id,
          username: userData.username,
          name: userData.name,
          email: userData.email,
          uid: userData.uid,
          profilePic: userData.profilePic,
          userType: userData.userType,
          plan: userData.plan,
          isVerified: userData.isVerified,
          createdAt: userData.createdAt,
          __v: userData.__v,
        };
        
        console.log('🔍 Profile Debug - Mapped profile data:', profileData);
        
        Toast.show({
          type: 'success',
          text1: 'Profile Loaded',
          text2: 'Your profile data has been updated',
        });
        
        return profileData;
      } else {
        throw new Error(response.data.message || 'Failed to fetch profile');
      }
    } catch (error: any) {
      console.error('❌ Profile Debug - Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      
      const message = error.response?.data?.message || 'Failed to fetch profile data';
      Toast.show({
        type: 'error',
        text1: 'Profile Error',
        text2: message,
      });
      return rejectWithValue(message);
    }
  }
);

// Update profile image
export const updateProfileImage = createAsyncThunk(
  'profile/updateProfileImage',
  async (data: UpdateProfileImageData, { rejectWithValue }) => {
    try {
      console.log('🔍 Profile Debug - Updating profile image:', data);
      
      const response = await APIIns.put('/user/change-profile-img', data);
      console.log('🔍 Profile Debug - Update Response:', response.data);
      
      if (response.data.success) {
        // Map the API response to our ProfileData interface
        const userData = response.data.data.user;
        const profileData: ProfileData = {
          _id: userData._id,
          username: userData.username,
          name: userData.name,
          email: userData.email,
          uid: userData.uid,
          profilePic: userData.profilePic,
          userType: userData.userType,
          plan: userData.plan,
          isVerified: userData.isVerified,
          createdAt: userData.createdAt,
          __v: userData.__v,
        };
        
        console.log('🔍 Profile Debug - Updated profile data:', profileData);
        
        Toast.show({
          type: 'success',
          text1: 'Profile Updated',
          text2: 'Your profile image has been updated successfully',
        });
        
        return profileData;
      } else {
        throw new Error(response.data.message || 'Failed to update profile image');
      }
    } catch (error: any) {
      console.error('❌ Profile Debug - Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      
      const message = error.response?.data?.message || 'Failed to update profile image';
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: message,
      });
      return rejectWithValue(message);
    }
  }
);

// Update user profile (name, email, username, profilePic)
export const updateUserProfile = createAsyncThunk(
  'profile/updateUserProfile',
  async (data: UpdateProfileData, { rejectWithValue }) => {
    try {
      console.log('🔍 Profile Debug - Updating user profile:', data);
      
      const response = await APIIns.put(`/user/profile/${data.uid}`, {
        name: data.name,
        email: data.email,
        username: data.username,
        profilePic: data.profilePic,
      });
      console.log('🔍 Profile Debug - Update Profile Response:', response.data);
      
      if (response.data.success) {
        // Map the API response to our ProfileData interface
        const userData = response.data.data.user;
        const profileData: ProfileData = {
          _id: userData._id,
          username: userData.username,
          name: userData.name,
          email: userData.email,
          uid: userData.uid,
          profilePic: userData.profilePic,
          userType: userData.userType,
          plan: userData.plan,
          isVerified: userData.isVerified,
          createdAt: userData.createdAt,
          __v: userData.__v,
        };
        
        console.log('🔍 Profile Debug - Updated profile data:', profileData);
        
        Toast.show({
          type: 'success',
          text1: 'Profile Updated',
          text2: 'Your profile has been updated successfully',
        });
        
        return profileData;
      } else {
        throw new Error(response.data.message || 'Failed to update profile');
      }
    } catch (error: any) {
      console.error('❌ Profile Debug - Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      
      const message = error.response?.data?.message || 'Failed to update profile';
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: message,
      });
      return rejectWithValue(message);
    }
  }
); 