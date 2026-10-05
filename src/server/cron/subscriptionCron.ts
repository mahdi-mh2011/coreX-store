import { subscriptionService } from '../services/subscriptionService';

/**
 * Scheduled Cron Jobs for Plus Subscription Maintenance
 * Standard cron expressions:
 *  - Midnight reset: '0 0 * * *' (Every day at 00:00:00 Asia/Baghdad or UTC)
 *  - Daily 50 IQD disbursement check: '0 1 * * *' (Every day at 01:00:00)
 *  - 7-Day reward expiration check: '0 2 * * *' (Every day at 02:00:00)
 */

export interface CronExecutionResult {
  jobName: string;
  executedAt: string;
  affectedRecords: number;
  details: string;
}

export class SubscriptionCronScheduler {
  private isRunning: boolean = false;
  private intervalTimer: NodeJS.Timeout | null = null;
  private executionLogs: CronExecutionResult[] = [];

  /**
   * Run the Midnight Daily Counter Reset
   * Resets daily_purchase_count to 0 for all users on the new day.
   */
  public runDailyCounterReset(): CronExecutionResult {
    const result = subscriptionService.cronResetDailyCounters();
    const log: CronExecutionResult = {
      jobName: 'RESET_DAILY_PURCHASE_COUNTERS',
      executedAt: result.timestamp,
      affectedRecords: result.resetUsersCount,
      details: `تمت تصفية عدادات الشراء اليومية لـ ${result.resetUsersCount} مستخدم.`,
    };
    this.recordLog(log);
    return log;
  }

  /**
   * Run Daily 50 IQD Disbursement for Active Plus Members
   * Checks every 24h and grants 50 IQD into the user's wallet with a 7-day expiration window.
   */
  public runDailyRewardDisbursement(): CronExecutionResult {
    const result = subscriptionService.cronDisbursePlusDailyRewards();
    const log: CronExecutionResult = {
      jobName: 'DISBURSE_PLUS_DAILY_50_IQD_REWARDS',
      executedAt: result.timestamp,
      affectedRecords: result.disbursedCount,
      details: `تم إيداع مكافأة 50 د.ع اليومية لـ ${result.disbursedCount} مشترك نشط في باقة Plus.`,
    };
    this.recordLog(log);
    return log;
  }

  /**
   * Run 7-Day Expiration Sweeper
   * Marks unclaimed daily rewards older than 7 days as 'expired'.
   */
  public runRewardExpirationSweep(): CronExecutionResult {
    const result = subscriptionService.cronExpireUnclaimedRewards();
    const log: CronExecutionResult = {
      jobName: 'SWEEP_EXPIRED_7_DAY_REWARDS',
      executedAt: result.timestamp,
      affectedRecords: result.expiredCount,
      details: `تم تدقيق المكافآت وأرشفة ${result.expiredCount} مكافأة منتهية الصلاحية تجاوزت نافذة 7 أيام.`,
    };
    this.recordLog(log);
    return log;
  }

  /**
   * Start the scheduler timer (simulates cron runner)
   */
  public startScheduler(intervalMs: number = 60000): void {
    if (this.isRunning) return;
    this.isRunning = true;
    console.log('[Cron] Plus Subscription scheduler started.');

    this.intervalTimer = setInterval(() => {
      const now = new Date();
      // In production with 'node-cron':
      // cron.schedule('0 0 * * *', () => this.runDailyCounterReset());
      // cron.schedule('0 1 * * *', () => this.runDailyRewardDisbursement());
      // cron.schedule('0 2 * * *', () => this.runRewardExpirationSweep());
    }, intervalMs);
  }

  public stopScheduler(): void {
    if (this.intervalTimer) {
      clearInterval(this.intervalTimer);
      this.intervalTimer = null;
    }
    this.isRunning = false;
  }

  private recordLog(log: CronExecutionResult) {
    this.executionLogs.unshift(log);
    if (this.executionLogs.length > 50) {
      this.executionLogs.pop();
    }
  }

  public getRecentLogs(): CronExecutionResult[] {
    return this.executionLogs;
  }
}

export const subscriptionCron = new SubscriptionCronScheduler();
