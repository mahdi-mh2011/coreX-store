// TypeScript types and interfaces for the Plus Subscription System

export type SubscriptionTier = 'free' | 'plus';
export type SubscriptionPlanType = 'monthly' | 'yearly';
export type SubscriptionStatus = 'active' | 'past_due' | 'canceled' | 'expired';
export type DailyRewardStatus = 'available' | 'claimed' | 'expired' | 'used';

export interface PlanConfig {
  planType: SubscriptionPlanType;
  titleArabic: string;
  titleEnglish: string;
  priceIQD: number;
  durationDays: number;
  dailyRewardIQD: number;
  adFree: boolean;
  unlimitedPurchases: boolean;
}

export const PLUS_PLANS: Record<SubscriptionPlanType, PlanConfig> = {
  monthly: {
    planType: 'monthly',
    titleArabic: 'اشتراك بلس الشهري',
    titleEnglish: 'Plus Monthly Plan',
    priceIQD: 2000,
    durationDays: 30,
    dailyRewardIQD: 50,
    adFree: true,
    unlimitedPurchases: true,
  },
  yearly: {
    planType: 'yearly',
    titleArabic: 'اشتراك بلس السنوي',
    titleEnglish: 'Plus Yearly Plan',
    priceIQD: 15000,
    durationDays: 365,
    dailyRewardIQD: 50,
    adFree: true,
    unlimitedPurchases: true,
  },
};

export const FREE_TIER_LIMITS = {
  maxDailyPurchases: 5,
  adFree: false,
  dailyRewardIQD: 0,
};

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  cardNumber: string; // 10-digit
  walletBalanceIQD: number;
  dailyPurchaseCount: number;
  lastPurchaseDate: string; // YYYY-MM-DD
  lastDailyRewardAt?: string | null;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionRecord {
  id: string;
  userId: string;
  tier: 'plus';
  planType: SubscriptionPlanType;
  subscriptionType: SubscriptionPlanType;
  priceIQD: number;
  renewsEveryDays: number;
  status: SubscriptionStatus;
  startsAt: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  expirationDate: string;
  cancellationRequested: boolean;
  cancellationDate?: string | null;
  cancelAtPeriodEnd: boolean;
  autoRenew: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DailyRewardRecord {
  id: string;
  userId: string;
  subscriptionId?: string;
  amountIQD: number; // 50 IQD
  disbursedAt: string;
  expiresAt: string; // disbursedAt + 7 days
  status: DailyRewardStatus;
  claimedAt?: string | null;
  expiredAt?: string | null;
}

export interface UserEntitlements {
  tier: SubscriptionTier;
  isPlus: boolean;
  statusDisplay: string; // "Plus Subscription" / "اشتراك بلس"
  subscriptionStatus: SubscriptionStatus | 'none';
  adFree: boolean;
  dailyPurchaseCount: number;
  dailyPurchaseLimit: number | 'unconstrained';
  canPurchaseToday: boolean;
  dailyRewardEligible: boolean;
  nextDailyRewardAvailableAt?: string | null;
  activePlan?: SubscriptionPlanType | null;
  subscriptionType?: SubscriptionPlanType | null;
  expiresAt?: string | null;
  expirationDate?: string | null;
  cancellationRequested: boolean;
  cancellationDate?: string | null;
  remainingDays?: number;
  remainingDurationFormatted?: string;
}
