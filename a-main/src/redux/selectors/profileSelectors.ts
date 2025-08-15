import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Base selectors
const selectProfileState = (state: RootState) => state.profile;

// Memoized selectors
export const selectProfileData = createSelector(
  [selectProfileState],
  (profile) => profile.profileData
);

export const selectProfileLoading = createSelector(
  [selectProfileState],
  (profile) => profile.loading
);

export const selectProfileError = createSelector(
  [selectProfileState],
  (profile) => profile.error
);

export const selectProfileLastUpdated = createSelector(
  [selectProfileState],
  (profile) => profile.lastUpdated
);

// Computed selectors
export const selectProfileName = createSelector(
  [selectProfileData],
  (profileData) => profileData?.name || ''
);

export const selectProfileEmail = createSelector(
  [selectProfileData],
  (profileData) => profileData?.email || ''
);

export const selectProfileUsername = createSelector(
  [selectProfileData],
  (profileData) => profileData?.username || ''
);

export const selectProfileUid = createSelector(
  [selectProfileData],
  (profileData) => profileData?.uid || 0
);

export const selectProfileImage = createSelector(
  [selectProfileData],
  (profileData) => profileData?.profilePic || null
);

export const selectProfileId = createSelector(
  [selectProfileData],
  (profileData) => profileData?._id || ''
);

export const selectIsProfileLoaded = createSelector(
  [selectProfileData, selectProfileLoading],
  (profileData, loading) => !loading && !!profileData
);

export const selectProfileDisplayName = createSelector(
  [selectProfileName, selectProfileUsername],
  (name, username) => name || username || 'User'
);

export const selectProfileImageUrl = createSelector(
  [selectProfileImage],
  (profilePic) => profilePic || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'
);

export const selectProfileUserType = createSelector(
  [selectProfileData],
  (profileData) => profileData?.userType || 'User'
);

export const selectProfilePlan = createSelector(
  [selectProfileData],
  (profileData) => profileData?.plan || 'Free'
);

export const selectProfileIsVerified = createSelector(
  [selectProfileData],
  (profileData) => profileData?.isVerified || false
); 