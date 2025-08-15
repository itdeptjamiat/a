import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Base selectors
const selectPlansState = (state: RootState) => state.plans;

// Memoized selectors
export const selectPlans = createSelector(
  [selectPlansState],
  (plans) => plans.plans
);

export const selectPlansLoading = createSelector(
  [selectPlansState],
  (plans) => plans.loading
);

export const selectPlansError = createSelector(
  [selectPlansState],
  (plans) => plans.error
);

export const selectPlansLastUpdated = createSelector(
  [selectPlansState],
  (plans) => plans.lastUpdated
);

export const selectCurrentPlan = createSelector(
  [selectPlansState],
  (plans) => plans.currentPlan
);

// Computed selectors
export const selectActivePlans = createSelector(
  [selectPlans],
  (plans) => plans.filter((plan: any) => plan.isActive)
);

export const selectFreePlan = createSelector(
  [selectActivePlans],
  (plans) => plans.find((plan: any) => plan.planType === 'free')
);

export const selectPaidPlans = createSelector(
  [selectActivePlans],
  (plans) => plans.filter((plan: any) => plan.planType !== 'free')
);

export const selectPlansCount = createSelector(
  [selectActivePlans],
  (plans) => plans.length
);

export const selectIsPlansLoaded = createSelector(
  [selectPlans, selectPlansLoading],
  (plans, loading) => !loading && plans.length > 0
);

export const selectCurrentPlanDetails = createSelector(
  [selectPlans, selectCurrentPlan],
  (plans, currentPlanId) => {
    if (!currentPlanId) return null;
    return plans.find((plan: any) => plan._id === currentPlanId);
  }
);

export const selectPlanById = createSelector(
  [selectPlans, (state: RootState, planId: string) => planId],
  (plans, planId) => plans.find((plan: any) => plan._id === planId)
);

export const selectPlansWithDiscounts = createSelector(
  [selectActivePlans],
  (plans) => plans.filter((plan: any) => plan.discountPercentage > 0)
);

export const selectMostPopularPlan = createSelector(
  [selectPaidPlans],
  (plans) => {
    if (plans.length === 0) return null;
    // For now, return the first paid plan, but this could be enhanced with popularity logic
    return plans[0];
  }
);

export const selectPlansSortedByPrice = createSelector(
  [selectActivePlans],
  (plans) => [...plans].sort((a: any, b: any) => a.finalPrice - b.finalPrice)
); 