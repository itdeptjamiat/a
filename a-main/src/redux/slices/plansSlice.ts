import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchSubscriptionPlans, subscribeToPlan } from '../actions/plansActions';

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
  processedFeatures: PlanFeature[];
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

interface PlansState {
  plans: SubscriptionPlan[];
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
  currentPlan: string | null;
}

const initialState: PlansState = {
  plans: [],
  loading: false,
  error: null,
  lastUpdated: null,
  currentPlan: null,
};

const plansSlice = createSlice({
  name: 'plans',
  initialState,
  reducers: {
    clearPlansError: (state) => {
      state.error = null;
    },
    clearPlansData: (state) => {
      state.plans = [];
      state.lastUpdated = null;
    },
    setCurrentPlan: (state, action: PayloadAction<string>) => {
      state.currentPlan = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch Subscription Plans
    builder
      .addCase(fetchSubscriptionPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptionPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = action.payload;
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(fetchSubscriptionPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Subscribe to Plan
    builder
      .addCase(subscribeToPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(subscribeToPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPlan = action.payload;
        state.error = null;
      })
      .addCase(subscribeToPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearPlansError, clearPlansData, setCurrentPlan } = plansSlice.actions;
export default plansSlice.reducer; 