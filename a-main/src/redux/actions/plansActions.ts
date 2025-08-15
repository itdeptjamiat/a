import { createAsyncThunk } from '@reduxjs/toolkit';
import Toast from 'react-native-toast-message';
import { APIIns } from '@/axios/EchoInstance';

interface PlanFeature {
  feature: string;
  isAvailable: boolean;
}

interface SubscriptionPlan {
  _id: string;
  planType: string;
  price: number;
  currency: string;
  duration: number;
  features: string[];
  maxDownloads: number;
  maxMagazines: number;
  isActive: boolean;
  description: string;
  discountPercentage: number;
  discountValidUntil: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
  finalPrice: number;
  hasActiveDiscount: boolean | null;
}

interface PlansResponse {
  success: boolean;
  count: number;
  plans: SubscriptionPlan[];
}

// Fetch all subscription plans
export const fetchSubscriptionPlans = createAsyncThunk(
  'plans/fetchSubscriptionPlans',
  async (_, { rejectWithValue }) => {
    try {
      console.log('🔍 Plans Debug - Fetching subscription plans');
      
      const response = await APIIns.get('/plans');
      console.log('🔍 Plans Debug - API Response:', response.data);
      
      if (response.data.success) {
        const plansData: PlansResponse = response.data;
        
        // Process features to extract availability
        const processedPlans = plansData.plans.map(plan => {
          const processedFeatures = plan.features.map(feature => {
            const isAvailable = !feature.includes('❌');
            const cleanFeature = feature.replace(/❌|✅/g, '').trim();
            return {
              feature: cleanFeature,
              isAvailable
            };
          });
          
          return {
            ...plan,
            processedFeatures
          };
        });
        
        console.log('🔍 Plans Debug - Processed plans:', processedPlans);
        
        Toast.show({
          type: 'success',
          text1: 'Plans Loaded',
          text2: 'Subscription plans have been updated',
        });
        
        return processedPlans;
      } else {
        throw new Error('Failed to fetch subscription plans');
      }
    } catch (error: any) {
      console.error('❌ Plans Debug - Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      
      const message = error.response?.data?.message || 'Failed to fetch subscription plans';
      Toast.show({
        type: 'error',
        text1: 'Plans Error',
        text2: message,
      });
      return rejectWithValue(message);
    }
  }
);

// Subscribe to a plan (placeholder for future implementation)
export const subscribeToPlan = createAsyncThunk(
  'plans/subscribeToPlan',
  async (planId: string, { rejectWithValue }) => {
    try {
      console.log('🔍 Plans Debug - Subscribing to plan:', planId);
      
      // TODO: Implement actual subscription API call
      // const response = await APIIns.post('/subscribe', { planId });
      
      // For now, just simulate success
      Toast.show({
        type: 'success',
        text1: 'Subscription Updated',
        text2: 'Your subscription has been updated successfully',
      });
      
      return planId;
    } catch (error: any) {
      console.error('❌ Plans Debug - Subscription error:', error);
      
      const message = error.response?.data?.message || 'Failed to update subscription';
      Toast.show({
        type: 'error',
        text1: 'Subscription Failed',
        text2: message,
      });
      return rejectWithValue(message);
    }
  }
); 