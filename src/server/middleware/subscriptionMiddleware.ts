import { Request, Response, NextFunction } from 'express';
import { subscriptionService } from '../services/subscriptionService';
import { UserEntitlements, FREE_TIER_LIMITS } from '../types/subscription.types';

// Extend Express Request to include resolved user & entitlements
export interface AuthenticatedRequest extends Request {
  userId?: string;
  entitlements?: UserEntitlements;
}

/**
 * Middleware: Attach Subscription Entitlements
 * Resolves current user's Plus status, ad-free entitlement, and daily purchase limit.
 */
export const attachSubscriptionEntitlements = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const userId = (req.headers['x-user-id'] as string) || (req.query.userId as string) || 'usr-default';
  req.userId = userId;

  try {
    const entitlements = subscriptionService.getUserEntitlements(userId);
    req.entitlements = entitlements;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'ENTITLEMENT_RESOLUTION_FAILED',
      message: 'تعذر التحقق من اشتراك وصلاحيات المستخدم.',
    });
  }
};

/**
 * Middleware: Enforce Daily Transaction Limit
 * - Free Users: restricted to maximum 5 purchases per day (daily_purchase_count <= 5)
 * - Plus Users: unconstrained / unlimited purchases per day
 */
export const enforceDailyTransactionLimit = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const entitlements = req.entitlements;
  if (!entitlements) {
    res.status(500).json({
      success: false,
      error: 'ENTITLEMENTS_NOT_FOUND',
      message: 'لم يتم العثور على بيانات الصلاحيات في الطلب.',
    });
    return;
  }

  // Plus subscribers have unlimited daily transactions
  if (entitlements.isPlus) {
    return next();
  }

  // Free Tier enforcement
  if (entitlements.dailyPurchaseCount >= FREE_TIER_LIMITS.maxDailyPurchases) {
    res.status(429).json({
      success: false,
      error: 'DAILY_PURCHASE_LIMIT_EXCEEDED',
      code: 429,
      limit: FREE_TIER_LIMITS.maxDailyPurchases,
      currentCount: entitlements.dailyPurchaseCount,
      message: 'وصلت إلى الحد الأقصى للمعاملات اليومية (5 مشتريات/يوم) المسموح بها للحساب المجاني.',
      upgradePrompt: {
        action: 'UPGRADE_TO_PLUS',
        title: 'الترقية إلى باقة بلس (Plus Subscription)',
        monthlyPriceIQD: 2000,
        yearlyPriceIQD: 15000,
        perks: [
          'معاملات شراء يومية غير محدودة',
          'تصفح نقي وخالٍ 100% من جميع الإعلانات',
          'مكافأة يومية 50 د.ع كل 24 ساعة في محفظتك',
        ],
      },
    });
    return;
  }

  next();
};

/**
 * Middleware: Require Active Plus Subscription
 * Blocks non-subscribers with HTTP 403 Forbidden.
 */
export const requirePlusSubscription = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const entitlements = req.entitlements;

  if (!entitlements || !entitlements.isPlus) {
    res.status(403).json({
      success: false,
      error: 'PLUS_SUBSCRIPTION_REQUIRED',
      code: 403,
      message: 'هذه الميزة متاحة حصراً لمشتركي باقة Plus (2,000 د.ع شهرياً أو 15,000 د.ع سنوياً).',
    });
    return;
  }

  next();
};

/**
 * Middleware: Restrict / Strip Ads for Active Plus Subscribers
 * Modifies response payload to omit ads when subscription_status == 'active'.
 */
export const adFilterMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const entitlements = req.entitlements;
  const originalJson = res.json.bind(res);

  res.json = (body: any) => {
    if (entitlements?.adFree && body && typeof body === 'object') {
      // Strip ads from payload if present
      if (Array.isArray(body.ads)) {
        body.ads = [];
      }
      if (body.bannerAd) {
        body.bannerAd = null;
      }
      if (body.interstitialAd) {
        body.interstitialAd = null;
      }
      body.adFreeApplied = true;
    }
    return originalJson(body);
  };

  next();
};
