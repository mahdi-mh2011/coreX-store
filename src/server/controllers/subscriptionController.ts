import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/subscriptionMiddleware';
import { subscriptionService } from '../services/subscriptionService';
import { subscriptionCron } from '../cron/subscriptionCron';
import { PLUS_PLANS, FREE_TIER_LIMITS, SubscriptionPlanType } from '../types/subscription.types';

export class SubscriptionController {
  /**
   * GET /api/subscriptions/plans
   * Returns list of subscription plans and entitlements
   */
  public getPlans(req: AuthenticatedRequest, res: Response): void {
    res.json({
      success: true,
      plans: Object.values(PLUS_PLANS),
      freeTierLimits: FREE_TIER_LIMITS,
      currency: 'IQD',
      currencyArabic: 'د.ع',
    });
  }

  /**
   * GET /api/subscriptions/status
   * Returns status, active entitlements, daily purchase count, and remaining quota
   */
  public getStatus(req: AuthenticatedRequest, res: Response): void {
    const userId = req.userId || 'usr-default';
    const entitlements = subscriptionService.getUserEntitlements(userId);
    const user = subscriptionService.getUser(userId);

    res.json({
      success: true,
      userId,
      walletBalanceIQD: user?.walletBalanceIQD || 0,
      entitlements,
      planDetails: entitlements.activePlan ? PLUS_PLANS[entitlements.activePlan] : null,
      serverTime: new Date().toISOString(),
    });
  }

  /**
   * POST /api/subscriptions/subscribe
   * Subscribes to Monthly (2,000 IQD) or Yearly (15,000 IQD)
   */
  public subscribe(req: AuthenticatedRequest, res: Response): void {
    const userId = req.userId || (req.body.userId as string) || 'usr-default';
    const planType = req.body.planType as SubscriptionPlanType;

    if (!planType || (planType !== 'monthly' && planType !== 'yearly')) {
      res.status(400).json({
        success: false,
        error: 'INVALID_PLAN_TYPE',
        message: 'نوع الباقة غير صالح. يرجى اختيار monthly (2,000 د.ع) أو yearly (15,000 د.ع).',
      });
      return;
    }

    const result = subscriptionService.subscribe(userId, planType);
    if (!result.success) {
      res.status(400).json({
        success: false,
        error: 'SUBSCRIPTION_FAILED',
        message: result.message,
      });
      return;
    }

    const entitlements = subscriptionService.getUserEntitlements(userId);

    res.status(200).json({
      success: true,
      message: result.message,
      subscription: result.subscription,
      newBalance: result.newBalance,
      entitlements,
    });
  }

  /**
   * POST /api/subscriptions/cancel
   * POST /api/subscriptions/cancel_subscription
   * Handles user-requested subscription cancellation while preserving access until expirationDate
   */
  public cancelSubscription(req: AuthenticatedRequest, res: Response): void {
    const userId = req.userId || (req.body.userId as string) || 'usr-default';
    const result = subscriptionService.cancelSubscription(userId);

    if (!result.success) {
      res.status(400).json({
        success: false,
        error: 'CANCELLATION_FAILED',
        message: result.message,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: result.message,
      subscription: result.subscription,
      entitlements: result.entitlements,
    });
  }

  /**
   * POST /api/subscriptions/daily-reward/claim
   * Claims 50 IQD every 24 hours for active Plus subscribers (7-day expiration)
   */
  public claimDailyReward(req: AuthenticatedRequest, res: Response): void {
    const userId = req.userId || 'usr-default';
    const result = subscriptionService.disburseDailyReward(userId);

    if (!result.success) {
      res.status(400).json({
        success: false,
        error: 'DAILY_REWARD_CLAIM_FAILED',
        message: result.message,
      });
      return;
    }

    const entitlements = subscriptionService.getUserEntitlements(userId);

    res.status(200).json({
      success: true,
      message: result.message,
      reward: result.reward,
      newBalance: result.newBalance,
      entitlements,
    });
  }

  /**
   * POST /api/transactions/purchase
   * Purchases a product/item, guarded by enforceDailyTransactionLimit
   */
  public processPurchase(req: AuthenticatedRequest, res: Response): void {
    const userId = req.userId || 'usr-default';
    const { itemTitle, priceIQD } = req.body;

    if (!itemTitle || typeof priceIQD !== 'number' || priceIQD <= 0) {
      res.status(400).json({
        success: false,
        error: 'INVALID_PURCHASE_DATA',
        message: 'بيانات الشراء غير صالحة. يرجى تزويد اسم السلعة وسعرها بالدينار العراقي.',
      });
      return;
    }

    const result = subscriptionService.processPurchase(userId, itemTitle, priceIQD);

    if (!result.success) {
      res.status(400).json({
        success: false,
        error: 'PURCHASE_FAILED',
        message: result.message,
        dailyPurchaseCount: result.dailyPurchaseCount,
        remainingDailyQuota: result.remainingDailyQuota,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: result.message,
      newBalance: result.newBalance,
      dailyPurchaseCount: result.dailyPurchaseCount,
      remainingDailyQuota: result.remainingDailyQuota,
    });
  }

  /**
   * POST /api/wallet/update
   * Top-up or deduct wallet balance
   */
  public updateWallet(req: AuthenticatedRequest, res: Response): void {
    const userId = req.userId || 'usr-default';
    const { amountIQD, action } = req.body;

    const user = subscriptionService.getUser(userId);
    if (!user) {
      res.status(404).json({ success: false, message: 'المستخدم غير مسجل' });
      return;
    }

    if (action === 'topup') {
      user.walletBalanceIQD += Number(amountIQD) || 0;
    } else if (action === 'deduct') {
      if (user.walletBalanceIQD < amountIQD) {
        res.status(400).json({ success: false, message: 'الرصيد غير كافٍ' });
        return;
      }
      user.walletBalanceIQD -= Number(amountIQD) || 0;
    }

    subscriptionService.saveUser(user);

    res.json({
      success: true,
      walletBalanceIQD: user.walletBalanceIQD,
      message: `تم تحديث رصيد المحفظة إلى ${user.walletBalanceIQD.toLocaleString()} د.ع بنجاح.`,
    });
  }

  /**
   * POST /api/subscriptions/cron/trigger
   * Manually executes a background cron job for verification & testing
   */
  public triggerCron(req: AuthenticatedRequest, res: Response): void {
    const { jobType } = req.body;
    let result;

    switch (jobType) {
      case 'reset_counters':
        result = subscriptionCron.runDailyCounterReset();
        break;
      case 'disburse_rewards':
        result = subscriptionCron.runDailyRewardDisbursement();
        break;
      case 'expire_rewards':
        result = subscriptionCron.runRewardExpirationSweep();
        break;
      default:
        res.status(400).json({
          success: false,
          message: 'Unknown jobType. Allowed: reset_counters, disburse_rewards, expire_rewards',
        });
        return;
    }

    res.json({
      success: true,
      jobExecuted: jobType,
      result,
    });
  }
}

export const subscriptionController = new SubscriptionController();
