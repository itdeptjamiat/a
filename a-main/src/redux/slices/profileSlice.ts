import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchUserProfile, updateProfileImage, updateUserProfile } from '../actions/profileActions';

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

interface ProfileState {
  profileData: ProfileData | null;
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

const initialState: ProfileState = {
  profileData: null,
  loading: false,
  error: null,
  lastUpdated: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfileError: (state) => {
      state.error = null;
    },
    clearProfileData: (state) => {
      state.profileData = null;
      state.lastUpdated = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch User Profile
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profileData = action.payload;
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

                    // Update Profile Image
                builder
                  .addCase(updateProfileImage.pending, (state) => {
                    state.loading = true;
                    state.error = null;
                  })
                  .addCase(updateProfileImage.fulfilled, (state, action) => {
                    state.loading = false;
                    state.profileData = action.payload;
                    state.lastUpdated = new Date().toISOString();
                    state.error = null;
                  })
                  .addCase(updateProfileImage.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload as string;
                  });

                // Update User Profile
                builder
                  .addCase(updateUserProfile.pending, (state) => {
                    state.loading = true;
                    state.error = null;
                  })
                  .addCase(updateUserProfile.fulfilled, (state, action) => {
                    state.loading = false;
                    state.profileData = action.payload;
                    state.lastUpdated = new Date().toISOString();
                    state.error = null;
                  })
                  .addCase(updateUserProfile.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload as string;
                  });
  },
});

export const { clearProfileError, clearProfileData } = profileSlice.actions;
export default profileSlice.reducer; 