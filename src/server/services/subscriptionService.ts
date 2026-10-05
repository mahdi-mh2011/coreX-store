import {
  SubscriptionPlanType,
  SubscriptionRecord,
  UserAccount,
  DailyRewardRecord,
  UserEntitlements,
  PLUS_PLANS,
  FREE_TIER_LIMITS,
} from '../types/subscription.types';

export class SubscriptionService {
  // Mock in-memory storage for demonstration & testing
  private users: Map<string, UserAccount> = new Map();
  private subscriptions: Map<string, SubscriptionRecord> = new Map();
  private dailyRewards: Map<string, DailyRewardRecord[]> = new Map();
  private transactions: Array<{
    id: string;
    userId: string;
    type: string;
    amountIQD: number;
    balanceAfterIQD: number;
    description: string;
    date: string;
  }> = [];

  constructor() {
    this.seedDefaultData();
  }

  private seedDefaultData() {
    // Seed sample user
    const sampleUser: UserAccount = {
      id: 'usr-default',
      email: 'customer@corex.iq',
      name: 'علي الكرخي',
      cardNumber: '9182736450',
      walletBalanceIQD: 10000,
      dailyPurchaseCount: 2,
      lastPurchaseDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.users.set(sampleUser.id, sampleUser);
  }

  public getUser(userId: string): UserAccount | undefined {
    return this.users.get(userId);
  }

  public saveUser(user: UserAccount): void {
    user.updatedAt = new Date().toISOString();
    this.users.set(user.id, user);
  }

  public getActiveSubscription(userId: string): SubscriptionRecord | null {
    for (const sub of this.subscriptions.values()) {
      if (sub.userId === userId && sub.status === 'active') {
        // Check if subscription has naturally expired
        const now = new Date();
        const end = new Date(sub.currentPeriodEnd);
        if (now > end) {
          sub.status = 'expired';
          sub.updatedAt = now.toISOString();
          return null;
        }
        return sub;
      }
    }
    return null;
  }

  public getUserEntitlements(userId: string): UserEntitlements {
    const user = this.getUser(userId);
    const activeSub = this.getActiveSubscription(userId);
    const isPlus = activeSub !== null && activeSub.status === 'active';

    const todayStr = new Date().toISOString().split('T')[0];
    const userPurchaseCount = user
      ? user.lastPurchaseDate === todayStr
        ? user.dailyPurchaseCount
        : 0
      : 0;

    // Check Daily Reward 50 IQD eligibility (once every 24h for active Plus)
    let dailyRewardEligible = false;
    let nextDailyRewardAvailableAt: string | null = null;

    if (isPlus && user) {
      if (!user.lastDailyRewardAt) {
        dailyRewardEligible = true;
      } else {
        const lastDisbursed = new Date(user.lastDailyRewardAt).getTime();
        const nextEligibleTime = lastDisbursed + 24 * 60 * 60 * 1000;
        const now = Date.now();
        if (now >= nextEligibleTime) {
          dailyRewardEligible = true;
        } else {
          nextDailyRewardAvailableAt = new Date(nextEligibleTime).toISOString();
        }
      }
    }

    const dailyLimit = isPlus ? 'unconstrained' : FREE_TIER_LIMITS.maxDailyPurchases;
    const canPurchaseToday = isPlus ? true : userPurchaseCount < FREE_TIER_LIMITS.maxDailyPurchases;

    // Calculate exact remaining days and formatted duration
    let remainingDays = 0;
    let remainingDurationFormatted = '';
    let expirationDate: string | null = null;

    if (activeSub && activeSub.currentPeriodEnd) {
      expirationDate = activeSub.currentPeriodEnd;
      const msDiff = new Date(activeSub.currentPeriodEnd).getTime() - Date.now();
      if (msDiff > 0) {
        remainingDays = Math.ceil(msDiff / (24 * 60 * 60 * 1000));
        const hours = Math.floor((msDiff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
        remainingDurationFormatted = remainingDays > 1
          ? `${remainingDays} يوماً${hours > 0 ? ` و${hours} ساعة` : ''}`
          : `${hours} ساعة`;
      } else {
        remainingDurationFormatted = 'منتهي الصلاحية';
      }
    }

    return {
      tier: isPlus ? 'plus' : 'free',
      isPlus,
      statusDisplay: isPlus ? 'Plus Subscription' : 'Free Tier',
      subscriptionStatus: activeSub ? activeSub.status : 'none',
      adFree: isPlus,
      dailyPurchaseCount: userPurchaseCount,
      dailyPurchaseLimit: dailyLimit,
      canPurchaseToday,
      dailyRewardEligible,
      nextDailyRewardAvailableAt,
      activePlan: activeSub?.planType || null,
      subscriptionType: activeSub?.subscriptionType || activeSub?.planType || null,
      expiresAt: activeSub?.currentPeriodEnd || null,
      expirationDate: expirationDate,
      cancellationRequested: activeSub?.cancellationRequested || false,
      cancellationDate: activeSub?.cancellationDate || null,
      remainingDays,
      remainingDurationFormatted,
    };
  }

  public subscribe(userId: string, planType: SubscriptionPlanType): {
    success: boolean;
    subscription?: SubscriptionRecord;
    message: string;
    newBalance?: number;
  } {
    const user = this.getUser(userId);
    if (!user) {
      return { success: false, message: 'المستخدم غير موجود' };
    }

    const plan = PLUS_PLANS[planType];
    if (!plan) {
      return { success: false, message: 'خطة الاشتراك غير صالحة' };
    }

    if (user.walletBalanceIQD < plan.priceIQD) {
      return {
        success: false,
        message: `رصيد المحفظة غير كافٍ. تحتاج إلى ${plan.priceIQD.toLocaleString()} د.ع للاشتراك في باقة ${plan.titleArabic}.`,
      };
    }

    // Deduct subscription fee from wallet
    user.walletBalanceIQD -= plan.priceIQD;

    const now = new Date();
    const currentPeriodStart = now.toISOString();
    const periodEnd = new Date(now.getTime() + plan.durationDays * 24 * 60 * 60 * 1000);
    const currentPeriodEnd = periodEnd.toISOString();

    const subscription: SubscriptionRecord = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId,
      tier: 'plus',
      planType,
      subscriptionType: planType,
      priceIQD: plan.priceIQD,
      renewsEveryDays: plan.durationDays,
      status: 'active',
      startsAt: currentPeriodStart,
      currentPeriodStart,
      currentPeriodEnd,
      expirationDate: currentPeriodEnd,
      cancellationRequested: false,
      cancellationDate: null,
      cancelAtPeriodEnd: false,
      autoRenew: true,
      createdAt: currentPeriodStart,
      updatedAt: currentPeriodStart,
    };

    this.subscriptions.set(subscription.id, subscription);
    this.saveUser(user);

    // Record ledger transaction
    this.transactions.push({
      id: `tx-sub-${Date.now()}`,
      userId,
      type: 'subscription_fee',
      amountIQD: -plan.priceIQD,
      balanceAfterIQD: user.walletBalanceIQD,
      description: `رسوم ${plan.titleArabic} (${plan.priceIQD.toLocaleString()} د.ع)`,
      date: now.toISOString(),
    });

    // Automatically disburse first 50 IQD daily reward upon initial subscription
    this.disburseDailyReward(userId, subscription.id);

    return {
      success: true,
      subscription,
      message: `تم تفعيل ${plan.titleArabic} بنجاح! تم حجب الإعلانات وإتاحة المعاملات غير المحدودة.`,
      newBalance: user.walletBalanceIQD,
    };
  }

  public cancelSubscription(userId: string): {
    success: boolean;
    message: string;
    subscription?: SubscriptionRecord;
    entitlements?: UserEntitlements;
  } {
    const activeSub = this.getActiveSubscription(userId);
    if (!activeSub) {
      return {
        success: false,
        message: 'لا يوجد اشتراك Plus نشط لهذا الحساب لإلغائه.',
      };
    }

    const now = new Date().toISOString();
    activeSub.cancellationRequested = true;
    activeSub.cancellationDate = now;
    activeSub.cancelAtPeriodEnd = true;
    activeSub.autoRenew = false;
    activeSub.updatedAt = now;

    this.subscriptions.set(activeSub.id, activeSub);

    const entitlements = this.getUserEntitlements(userId);
    return {
      success: true,
      message: `تم إلغاء اشتراك بلس (Plus Subscription) بنجاح. ستظل المزايا فعالة حتى تاريخ الانتهاء في ${new Date(activeSub.currentPeriodEnd).toLocaleDateString('ar-IQ')} (${entitlements.remainingDurationFormatted}).`,
      subscription: activeSub,
      entitlements,
    };
  }

  public disburseDailyReward(userId: string, subscriptionId?: string): {
    success: boolean;
    reward?: DailyRewardRecord;
    message: string;
    newBalance?: number;
  } {
    const user = this.getUser(userId);
    if (!user) {
      return { success: false, message: 'المستخدم غير موجود' };
    }

    const activeSub = this.getActiveSubscription(userId);
    if (!activeSub) {
      return {
        success: false,
        message: 'مكافأة 50 د.ع اليومية مخصصة فقط لمشتركي باقة Plus النشطين.',
      };
    }

    const now = new Date();
    const nowTime = now.getTime();

    // Check 24-hour rate limit
    if (user.lastDailyRewardAt) {
      const lastTime = new Date(user.lastDailyRewardAt).getTime();
      const diffMs = nowTime - lastTime;
      const twentyFourHoursMs = 24 * 60 * 60 * 1000;
      if (diffMs < twentyFourHoursMs) {
        const remainingHours = Math.ceil((twentyFourHoursMs - diffMs) / (60 * 60 * 1000));
        return {
          success: false,
          message: `تم استلام مكافأة اليوم بالفعل. تتاح المكافأة التالية بعد قرابة ${remainingHours} ساعة.`,
        };
      }
    }

    // Set 7-day expiration window
    const expiresAt = new Date(nowTime + 7 * 24 * 60 * 60 * 1000).toISOString();

    const reward: DailyRewardRecord = {
      id: `rwd-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId,
      subscriptionId: subscriptionId || activeSub.id,
      amountIQD: 50,
      disbursedAt: now.toISOString(),
      expiresAt,
      status: 'claimed',
      claimedAt: now.toISOString(),
    };

    const userRewards = this.dailyRewards.get(userId) || [];
    userRewards.push(reward);
    this.dailyRewards.set(userId, userRewards);

    // Top-up wallet
    user.walletBalanceIQD += 50;
    user.lastDailyRewardAt = now.toISOString();
    this.saveUser(user);

    // Record ledger
    this.transactions.push({
      id: `tx-rwd-${Date.now()}`,
      userId,
      type: 'daily_reward_disbursement',
      amountIQD: 50,
      balanceAfterIQD: user.walletBalanceIQD,
      description: 'مكافأة Plus اليومية (+50 د.ع) صالحة لمدة 7 أيام',
      date: now.toISOString(),
    });

    return {
      success: true,
      reward,
      message: 'تم إضافة مكافأة 50 د.ع اليومية إلى محفظتك بنجاح!',
      newBalance: user.walletBalanceIQD,
    };
  }

  public processPurchase(userId: string, itemTitle: string, priceIQD: number): {
    success: boolean;
    message: string;
    newBalance?: number;
    dailyPurchaseCount?: number;
    remainingDailyQuota?: number | 'unconstrained';
  } {
    const user = this.getUser(userId);
    if (!user) {
      return { success: false, message: 'المستخدم غير مسجل' };
    }

    const todayStr = new Date().toISOString().split('T')[0];
    if (user.lastPurchaseDate !== todayStr) {
      user.dailyPurchaseCount = 0;
      user.lastPurchaseDate = todayStr;
    }

    const entitlements = this.getUserEntitlements(userId);

    // Free users constraint check: daily_purchase_count <= 5
    if (!entitlements.isPlus) {
      if (user.dailyPurchaseCount >= FREE_TIER_LIMITS.maxDailyPurchases) {
        return {
          success: false,
          message: `تم الوصول إلى الحد الأقصى للمعاملات اليومية للحساب المجاني (5 مشتريات/يوم). يرجى الترقية إلى باقة Plus للتمتع بعدد غير محدود من المعاملات يومياً!`,
          dailyPurchaseCount: user.dailyPurchaseCount,
          remainingDailyQuota: 0,
        };
      }
    }

    // Check balance
    if (user.walletBalanceIQD < priceIQD) {
      return {
        success: false,
        message: `رصيد المحفظة غير كافٍ لإتمام عملية الشراء (${priceIQD.toLocaleString()} د.ع).`,
      };
    }

    // Deduct and increment daily transaction counter
    user.walletBalanceIQD -= priceIQD;
    user.dailyPurchaseCount += 1;
    this.saveUser(user);

    const remaining = entitlements.isPlus
      ? 'unconstrained'
      : Math.max(0, FREE_TIER_LIMITS.maxDailyPurchases - user.dailyPurchaseCount);

    this.transactions.push({
      id: `tx-buy-${Date.now()}`,
      userId,
      type: 'product_purchase',
      amountIQD: -priceIQD,
      balanceAfterIQD: user.walletBalanceIQD,
      description: `شراء: ${itemTitle}`,
      date: new Date().toISOString(),
    });

    return {
      success: true,
      message: `تمت عملية الشراء بنجاح!`,
      newBalance: user.walletBalanceIQD,
      dailyPurchaseCount: user.dailyPurchaseCount,
      remainingDailyQuota: remaining,
    };
  }

  public cronResetDailyCounters(): { resetUsersCount: number; timestamp: string } {
    const todayStr = new Date().toISOString().split('T')[0];
    let count = 0;
    for (const user of this.users.values()) {
      if (user.dailyPurchaseCount > 0 || user.lastPurchaseDate !== todayStr) {
        user.dailyPurchaseCount = 0;
        user.lastPurchaseDate = todayStr;
        user.updatedAt = new Date().toISOString();
        count++;
      }
    }
    return { resetUsersCount: count, timestamp: new Date().toISOString() };
  }

  public cronDisbursePlusDailyRewards(): { disbursedCount: number; timestamp: string } {
    let disbursedCount = 0;
    const nowTime = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000;

    for (const sub of this.subscriptions.values()) {
      if (sub.status === 'active') {
        const user = this.users.get(sub.userId);
        if (user) {
          const lastDisbursed = user.lastDailyRewardAt
            ? new Date(user.lastDailyRewardAt).getTime()
            : 0;
          if (nowTime - lastDisbursed >= twentyFourHours) {
            this.disburseDailyReward(user.id, sub.id);
            disbursedCount++;
          }
        }
      }
    }
    return { disbursedCount, timestamp: new Date().toISOString() };
  }

  public cronExpireUnclaimedRewards(): { expiredCount: number; timestamp: string } {
    let expiredCount = 0;
    const nowTime = Date.now();

    for (const [userId, rewards] of this.dailyRewards.entries()) {
      for (const reward of rewards) {
        if (reward.status === 'available') {
          const expiryTime = new Date(reward.expiresAt).getTime();
          if (nowTime > expiryTime) {
            reward.status = 'expired';
            reward.expiredAt = new Date().toISOString();
            expiredCount++;
          }
        }
      }
    }
    return { expiredCount, timestamp: new Date().toISOString() };
  }

  public getDailyRewards(userId: string): DailyRewardRecord[] {
    return this.dailyRewards.get(userId) || [];
  }

  public getTransactions(userId: string) {
    return this.transactions.filter((tx) => tx.userId === userId);
  }
}

export const subscriptionService = new SubscriptionService();
