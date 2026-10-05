import { Router } from 'express';
import { subscriptionController } from '../controllers/subscriptionController';
import {
  attachSubscriptionEntitlements,
  enforceDailyTransactionLimit,
  requirePlusSubscription,
  adFilterMiddleware,
} from '../middleware/subscriptionMiddleware';

export const subscriptionRouter = Router();

// Public / general endpoints
subscriptionRouter.get('/plans', (req, res) => subscriptionController.getPlans(req, res));

// User status & entitlements
subscriptionRouter.get(
  '/status',
  attachSubscriptionEntitlements,
  adFilterMiddleware,
  (req, res) => subscriptionController.getStatus(req, res)
);

// Subscribe to Plus Monthly (2,000 IQD) or Yearly (15,000 IQD)
subscriptionRouter.post(
  '/subscribe',
  attachSubscriptionEntitlements,
  (req, res) => subscriptionController.subscribe(req, res)
);

// Cancel Plus Subscription (cancel_subscription endpoint)
subscriptionRouter.post(
  '/cancel',
  attachSubscriptionEntitlements,
  requirePlusSubscription,
  (req, res) => subscriptionController.cancelSubscription(req, res)
);

subscriptionRouter.post(
  '/cancel_subscription',
  attachSubscriptionEntitlements,
  requirePlusSubscription,
  (req, res) => subscriptionController.cancelSubscription(req, res)
);

// Claim 50 IQD Daily Reward (Restricted to active Plus subscribers)
subscriptionRouter.post(
  '/daily-reward/claim',
  attachSubscriptionEntitlements,
  requirePlusSubscription,
  (req, res) => subscriptionController.claimDailyReward(req, res)
);

// Purchase product with daily limit enforcement (Free <= 5/day, Plus = unlimited)
subscriptionRouter.post(
  '/purchase',
  attachSubscriptionEntitlements,
  enforceDailyTransactionLimit,
  (req, res) => subscriptionController.processPurchase(req, res)
);

// Wallet update
subscriptionRouter.post(
  '/wallet/update',
  attachSubscriptionEntitlements,
  (req, res) => subscriptionController.updateWallet(req, res)
);

// Manual trigger for background cron jobs
subscriptionRouter.post(
  '/cron/trigger',
  attachSubscriptionEntitlements,
  (req, res) => subscriptionController.triggerCron(req, res)
);
