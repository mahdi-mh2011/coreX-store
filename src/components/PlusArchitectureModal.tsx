import React, { useState } from 'react';
import {
  X,
  Code2,
  Database,
  Layers,
  Clock,
  Play,
  Copy,
  Check,
  ShieldCheck,
  Coins,
  Infinity as InfinityIcon,
  Crown,
  FileCode,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Terminal,
} from 'lucide-react';
import { subscriptionService } from '../server/services/subscriptionService';
import { subscriptionCron, CronExecutionResult } from '../server/cron/subscriptionCron';

interface PlusArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId?: string;
}

export const PlusArchitectureModal: React.FC<PlusArchitectureModalProps> = ({
  isOpen,
  onClose,
  currentUserId = 'usr-default',
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'sql' | 'json' | 'middleware' | 'cron' | 'apiTest'>('overview');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Live API test state
  const [apiLog, setApiLog] = useState<Array<{ time: string; endpoint: string; status: number; response: any }>>([]);
  const [selectedPlanForSub, setSelectedPlanForSub] = useState<'monthly' | 'yearly'>('monthly');
  const [purchaseItemName, setPurchaseItemName] = useState('بطاقة ألعاب 600 UC');
  const [purchasePrice, setPurchasePrice] = useState(12000);
  const [cronLogs, setCronLogs] = useState<CronExecutionResult[]>([]);

  if (!isOpen) return null;

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Run interactive API test
  const testGetStatus = () => {
    const entitlements = subscriptionService.getUserEntitlements(currentUserId);
    const user = subscriptionService.getUser(currentUserId);
    const result = {
      status: 200,
      endpoint: 'GET /api/subscriptions/status',
      time: new Date().toLocaleTimeString(),
      response: {
        success: true,
        userId: currentUserId,
        walletBalanceIQD: user?.walletBalanceIQD || 0,
        entitlements,
      },
    };
    setApiLog((prev) => [result, ...prev]);
  };

  const testSubscribe = (plan: 'monthly' | 'yearly') => {
    const res = subscriptionService.subscribe(currentUserId, plan);
    const result = {
      status: res.success ? 200 : 400,
      endpoint: `POST /api/subscriptions/subscribe [plan=${plan}]`,
      time: new Date().toLocaleTimeString(),
      response: res,
    };
    setApiLog((prev) => [result, ...prev]);
  };

  const testCancelSubscription = () => {
    const res = subscriptionService.cancelSubscription(currentUserId);
    const result = {
      status: res.success ? 200 : 400,
      endpoint: 'POST /api/subscriptions/cancel_subscription',
      time: new Date().toLocaleTimeString(),
      response: res,
    };
    setApiLog((prev) => [result, ...prev]);
  };

  const testClaimReward = () => {
    const res = subscriptionService.disburseDailyReward(currentUserId);
    const result = {
      status: res.success ? 200 : 400,
      endpoint: 'POST /api/subscriptions/daily-reward/claim',
      time: new Date().toLocaleTimeString(),
      response: res,
    };
    setApiLog((prev) => [result, ...prev]);
  };

  const testPurchase = () => {
    const res = subscriptionService.processPurchase(currentUserId, purchaseItemName, purchasePrice);
    const result = {
      status: res.success ? 200 : 429,
      endpoint: `POST /api/transactions/purchase [item="${purchaseItemName}"]`,
      time: new Date().toLocaleTimeString(),
      response: res,
    };
    setApiLog((prev) => [result, ...prev]);
  };

  const testRunCron = (job: 'reset_counters' | 'disburse_rewards' | 'expire_rewards') => {
    let log: CronExecutionResult;
    if (job === 'reset_counters') {
      log = subscriptionCron.runDailyCounterReset();
    } else if (job === 'disburse_rewards') {
      log = subscriptionCron.runDailyRewardDisbursement();
    } else {
      log = subscriptionCron.runRewardExpirationSweep();
    }
    setCronLogs((prev) => [log, ...prev]);
  };

  const SQL_SNIPPET = `-- PLUS SUBSCRIPTION: POSTGRESQL SCHEMA
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    card_number VARCHAR(10) UNIQUE NOT NULL,
    wallet_balance_iqd NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (wallet_balance_iqd >= 0),
    daily_purchase_count INT NOT NULL DEFAULT 0 CHECK (daily_purchase_count >= 0),
    last_purchase_date DATE NOT NULL DEFAULT CURRENT_DATE,
    last_daily_reward_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tier VARCHAR(50) NOT NULL DEFAULT 'plus',
    subscription_type VARCHAR(50) NOT NULL DEFAULT 'monthly' CHECK (subscription_type IN ('monthly', 'yearly')),
    plan_type VARCHAR(20) NOT NULL CHECK (plan_type IN ('monthly', 'yearly')),
    price_iqd NUMERIC(10, 2) NOT NULL CHECK (price_iqd IN (2000.00, 15000.00)),
    renews_every_days INT NOT NULL CHECK (renews_every_days IN (30, 365)),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'past_due', 'canceled', 'expired')),
    starts_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    current_period_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    current_period_end TIMESTAMPTZ NOT NULL,
    expiration_date TIMESTAMPTZ NOT NULL, -- Exact expiration timestamp
    cancellation_requested BOOLEAN NOT NULL DEFAULT FALSE, -- Tracks user-initiated cancellation
    cancellation_date TIMESTAMPTZ, -- Timestamp of cancellation request
    cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
    auto_renew BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE daily_rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
    amount_iqd NUMERIC(10, 2) NOT NULL DEFAULT 50.00,
    disbursed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL, -- disbursed_at + INTERVAL '7 days'
    status VARCHAR(20) NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'claimed', 'expired', 'used'))
);`;

  const JSON_SCHEMA_SNIPPET = `{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "PlusSubscriptionSystemSchema",
  "definitions": {
    "User": {
      "type": "object",
      "required": ["id", "email", "cardNumber", "walletBalanceIQD", "dailyPurchaseCount", "lastPurchaseDate"],
      "properties": {
        "id": { "type": "string", "format": "uuid" },
        "cardNumber": { "type": "string", "pattern": "^[0-9]{10}$" },
        "walletBalanceIQD": { "type": "number", "minimum": 0 },
        "dailyPurchaseCount": { "type": "integer", "minimum": 0 },
        "lastPurchaseDate": { "type": "string", "format": "date" },
        "lastDailyRewardAt": { "type": ["string", "null"], "format": "date-time" }
      }
    },
    "Subscription": {
      "type": "object",
      "required": ["userId", "tier", "planType", "subscriptionType", "priceIQD", "status", "currentPeriodEnd", "expirationDate"],
      "properties": {
        "tier": { "type": "string", "enum": ["plus"] },
        "subscriptionType": { "type": "string", "enum": ["monthly", "yearly"] },
        "planType": { "type": "string", "enum": ["monthly", "yearly"] },
        "priceIQD": { "type": "number", "enum": [2000, 15000] },
        "renewsEveryDays": { "type": "integer", "enum": [30, 365] },
        "status": { "type": "string", "enum": ["active", "past_due", "canceled", "expired"] },
        "expirationDate": { "type": "string", "format": "date-time", "description": "Exact expiration date" },
        "cancellationRequested": { "type": "boolean", "default": false, "description": "User requested cancellation" },
        "cancellationDate": { "type": ["string", "null"], "format": "date-time" }
      }
    },
    "DailyReward": {
      "type": "object",
      "required": ["userId", "amountIQD", "disbursedAt", "expiresAt", "status"],
      "properties": {
        "amountIQD": { "type": "number", "const": 50 },
        "expiresAt": { "type": "string", "format": "date-time", "description": "+7 days expiration" },
        "status": { "type": "string", "enum": ["available", "claimed", "expired", "used"] }
      }
    }
  }
}`;

  const MIDDLEWARE_SNIPPET = `// Express Middleware for Transaction Limits & Ad Stripping
export const enforceDailyTransactionLimit = (req, res, next) => {
  const { isPlus, dailyPurchaseCount } = req.entitlements;
  
  // Plus tier: unconstrained daily purchases
  if (isPlus) return next();

  // Free tier: restricted to 5 purchases per day
  if (dailyPurchaseCount >= 5) {
    return res.status(429).json({
      error: 'DAILY_PURCHASE_LIMIT_EXCEEDED',
      limit: 5,
      currentCount: dailyPurchaseCount,
      message: 'وصلت إلى الحد الأقصى للمعاملات اليومية (5 مشتريات/يوم) المسموح بها للحساب المجاني.',
      upgradePrompt: {
        plan: 'Plus Subscription',
        monthlyIQD: 2000,
        yearlyIQD: 15000,
        perks: ['معاملات غير محدودة', 'بدون إعلانات 100%', 'مكافأة 50 د.ع يومياً']
      }
    });
  }
  next();
};

export const adFilterMiddleware = (req, res, next) => {
  const isAdFree = req.entitlements?.adFree;
  const originalJson = res.json.bind(res);
  res.json = (data) => {
    if (isAdFree && data) {
      delete data.ads;
      delete data.bannerAd;
      data.adFreeApplied = true;
    }
    return originalJson(data);
  };
  next();
};`;

  const CRON_SNIPPET = `// Cron Jobs (node-cron / Cloud Scheduler)
import cron from 'node-cron';

// 1. Midnight Daily Counter Reset (00:00:00)
cron.schedule('0 0 * * *', async () => {
  await db.query(\`
    UPDATE users 
    SET daily_purchase_count = 0, last_purchase_date = CURRENT_DATE 
    WHERE daily_purchase_count > 0 OR last_purchase_date < CURRENT_DATE
  \`);
  console.log('[Cron] Daily purchase counters reset to 0.');
});

// 2. Daily 50 IQD Reward Disbursement for Active Plus Members (Every 24h)
cron.schedule('0 1 * * *', async () => {
  const activePlusUsers = await db.query(\`
    SELECT s.user_id, s.id as sub_id FROM subscriptions s
    JOIN users u ON u.id = s.user_id
    WHERE s.status = 'active'
      AND (u.last_daily_reward_at IS NULL OR u.last_daily_reward_at <= NOW() - INTERVAL '24 hours')
  \`);
  for (const row of activePlusUsers.rows) {
    await db.query('BEGIN');
    await db.query(\`
      INSERT INTO daily_rewards (user_id, subscription_id, amount_iqd, expires_at)
      VALUES ($1, $2, 50.00, NOW() + INTERVAL '7 days')
    \`, [row.user_id, row.sub_id]);
    await db.query(\`
      UPDATE users SET wallet_balance_iqd = wallet_balance_iqd + 50.00, last_daily_reward_at = NOW()
      WHERE id = $1
    \`, [row.user_id]);
    await db.query('COMMIT');
  }
});

// 3. 7-Day Unclaimed Reward Expiration Sweeper
cron.schedule('0 2 * * *', async () => {
  await db.query(\`
    UPDATE daily_rewards
    SET status = 'expired', expired_at = NOW()
    WHERE status = 'available' AND expires_at < NOW()
  \`);
});`;

  return (
    <div className="fixed inset-0 z-[2900] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 animate-in fade-in duration-200">
      <div className="bg-[#0b1120] border-2 border-amber-500/60 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden text-right flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-[#111c38] to-slate-900 p-5 border-b border-[#1e293b] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Code2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  هندسة معمارية باقة Plus (Plus Subscription System Architecture)
                </h3>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-mono">
                  v2.0 Production
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                مخطط قواعد البيانات (SQL/JSON)، الميدلوير (Middleware)، المهام المجدولة (Cron)، ومحاكي واجهات REST
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-[#0e1629] px-4 py-2 border-b border-[#1e293b] flex items-center gap-2 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeTab === 'overview'
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>نظرة عامة والمصفوفة</span>
          </button>

          <button
            onClick={() => setActiveTab('sql')}
            className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeTab === 'sql'
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>مخطط SQL (PostgreSQL)</span>
          </button>

          <button
            onClick={() => setActiveTab('json')}
            className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeTab === 'json'
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>مخطط JSON Schema</span>
          </button>

          <button
            onClick={() => setActiveTab('middleware')}
            className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeTab === 'middleware'
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>الميدلوير (Middleware)</span>
          </button>

          <button
            onClick={() => setActiveTab('cron')}
            className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeTab === 'cron'
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>المهام المجدولة (Cron Jobs)</span>
          </button>

          <button
            onClick={() => setActiveTab('apiTest')}
            className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeTab === 'apiTest'
                ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                : 'text-emerald-400 hover:text-white hover:bg-emerald-950/40 border border-emerald-500/30'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>محاكي REST API واختبار حي</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs font-sans">
          {/* TAB 1: OVERVIEW & COMPARISON MATRIX */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Plan 1: Monthly */}
                <div className="p-4 rounded-2xl bg-[#131d31] border border-amber-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-400 text-sm">الباقة الشهرية (Monthly Plan)</span>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-mono">
                      2,000 IQD / 30 Days
                    </span>
                  </div>
                  <p className="text-slate-300 text-xs">
                    تتجدد كل 30 يوماً بقيمة 2,000 دينار عراقي مع إتاحة كافة مميزات الفئة الذهبية Plus.
                  </p>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Renews: every 30 days • Cost: 2,000 IQD
                  </div>
                </div>

                {/* Plan 2: Yearly */}
                <div className="p-4 rounded-2xl bg-[#131d31] border border-yellow-500/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-yellow-400 text-sm">الباقة السنوية (Yearly Plan)</span>
                    <span className="text-[10px] bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded-full font-mono">
                      15,000 IQD / 365 Days
                    </span>
                  </div>
                  <p className="text-slate-300 text-xs">
                    تتجدد كل 365 يوماً بقيمة 15,000 دينار عراقي (توفير 9,000 د.ع بنسبة خصم 38%).
                  </p>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Renews: every 365 days • Cost: 15,000 IQD
                  </div>
                </div>
              </div>

              {/* Specification Entitlements Matrix */}
              <div className="p-4 rounded-2xl bg-[#0f172a] border border-[#1e293b] space-y-3">
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span>مصفوفة الصلاحيات والمزايا (Entitlements Matrix)</span>
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                        <th className="py-2.5 px-3">الميزة / المعيار</th>
                        <th className="py-2.5 px-3">الحساب المجاني (Free Tier)</th>
                        <th className="py-2.5 px-3 text-amber-400">عضوية بلس (Plus Tier)</th>
                        <th className="py-2.5 px-3">آلية التحقق والتنفيذ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      <tr>
                        <td className="py-3 px-3 font-semibold text-white flex items-center gap-1.5">
                          <Coins className="w-4 h-4 text-amber-400" />
                          <span>المكافآت اليومية (Daily Rewards)</span>
                        </td>
                        <td className="py-3 px-3 text-slate-400">لا توجد (0 د.ع)</td>
                        <td className="py-3 px-3 text-emerald-400 font-bold">50 د.ع كل 24 ساعة</td>
                        <td className="py-3 px-3 text-slate-400 text-[10px] font-mono">
                          صرف آلي + نافذة صلاحية 7 أيام
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-3 font-semibold text-white flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-emerald-400" />
                          <span>تجربة بدون إعلانات (Ad-Free)</span>
                        </td>
                        <td className="py-3 px-3 text-red-400">تظهر الإعلانات والنوافذ</td>
                        <td className="py-3 px-3 text-emerald-400 font-bold">حجب كامل 100% (Zero Ads)</td>
                        <td className="py-3 px-3 text-slate-400 text-[10px] font-mono">
                          <code className="text-amber-300">subscription_status == 'active'</code>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-3 font-semibold text-white flex items-center gap-1.5">
                          <InfinityIcon className="w-4 h-4 text-blue-400" />
                          <span>حد المعاملات اليومية (Transactions)</span>
                        </td>
                        <td className="py-3 px-3 text-amber-300 font-mono">
                          أقصى حد: 5 معاملات / يوم
                        </td>
                        <td className="py-3 px-3 text-emerald-400 font-bold">
                          غير محدودة (Unconstrained)
                        </td>
                        <td className="py-3 px-3 text-slate-400 text-[10px] font-mono">
                          <code className="text-amber-300">daily_purchase_count &le; 5</code>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SQL SCHEMA */}
          {activeTab === 'sql' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 text-xs font-mono">schema.sql (PostgreSQL DDL)</span>
                <button
                  onClick={() => handleCopy('sql', SQL_SNIPPET)}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 cursor-pointer text-xs"
                >
                  {copiedKey === 'sql' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'sql' ? 'تم النسخ!' : 'نسخ الكود'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-2xl bg-black/80 border border-slate-800 text-[11px] text-amber-200/90 font-mono overflow-x-auto leading-relaxed text-left" dir="ltr">
                {SQL_SNIPPET}
              </pre>
            </div>
          )}

          {/* TAB 3: JSON SCHEMA */}
          {activeTab === 'json' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 text-xs font-mono">schema.json (Draft-07 NoSQL / Document)</span>
                <button
                  onClick={() => handleCopy('json', JSON_SCHEMA_SNIPPET)}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 cursor-pointer text-xs"
                >
                  {copiedKey === 'json' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'json' ? 'تم النسخ!' : 'نسخ الكود'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-2xl bg-black/80 border border-slate-800 text-[11px] text-cyan-200/90 font-mono overflow-x-auto leading-relaxed text-left" dir="ltr">
                {JSON_SCHEMA_SNIPPET}
              </pre>
            </div>
          )}

          {/* TAB 4: MIDDLEWARE */}
          {activeTab === 'middleware' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 text-xs font-mono">subscriptionMiddleware.ts (Express)</span>
                <button
                  onClick={() => handleCopy('middleware', MIDDLEWARE_SNIPPET)}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 cursor-pointer text-xs"
                >
                  {copiedKey === 'middleware' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'middleware' ? 'تم النسخ!' : 'نسخ الكود'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-2xl bg-black/80 border border-slate-800 text-[11px] text-emerald-200/90 font-mono overflow-x-auto leading-relaxed text-left" dir="ltr">
                {MIDDLEWARE_SNIPPET}
              </pre>
            </div>
          )}

          {/* TAB 5: CRON JOBS */}
          {activeTab === 'cron' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 text-xs font-mono">subscriptionCron.ts (node-cron / workers)</span>
                <button
                  onClick={() => handleCopy('cron', CRON_SNIPPET)}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 cursor-pointer text-xs"
                >
                  {copiedKey === 'cron' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'cron' ? 'تم النسخ!' : 'نسخ الكود'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-2xl bg-black/80 border border-slate-800 text-[11px] text-amber-200/90 font-mono overflow-x-auto leading-relaxed text-left" dir="ltr">
                {CRON_SNIPPET}
              </pre>
            </div>
          )}

          {/* TAB 6: REST API TESTER & SIMULATION CONSOLE */}
          {activeTab === 'apiTest' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-[#0f172a] border border-[#1e293b] space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-xs flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    <span>منصة اختبار ومحاكاة واجهات REST API للباك إند</span>
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono">User ID: {currentUserId}</span>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
                  {/* Test 1: GET Status */}
                  <button
                    onClick={testGetStatus}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-[11px] flex items-center justify-between cursor-pointer border border-slate-700"
                  >
                    <span>GET /status</span>
                    <span className="text-[9px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded font-sans">فحص الحالة</span>
                  </button>

                  {/* Test 2: POST Subscribe */}
                  <button
                    onClick={() => testSubscribe(selectedPlanForSub)}
                    className="p-2.5 rounded-xl bg-amber-950/40 hover:bg-amber-900/50 text-amber-200 font-mono text-[11px] flex items-center justify-between cursor-pointer border border-amber-500/30"
                  >
                    <span>POST /subscribe</span>
                    <span className="text-[9px] bg-amber-500 text-black font-bold px-1.5 py-0.5 rounded font-sans">
                      {selectedPlanForSub === 'monthly' ? '2,000 د.ع' : '15,000 د.ع'}
                    </span>
                  </button>

                  {/* Test 3: POST Cancel Subscription */}
                  <button
                    onClick={testCancelSubscription}
                    className="p-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/50 text-red-200 font-mono text-[11px] flex items-center justify-between cursor-pointer border border-red-500/30"
                  >
                    <span>POST /cancel</span>
                    <span className="text-[9px] bg-red-500/30 text-red-300 px-1.5 py-0.5 rounded font-sans">إلغاء الاشتراك</span>
                  </button>

                  {/* Test 4: Claim 50 IQD */}
                  <button
                    onClick={testClaimReward}
                    className="p-2.5 rounded-xl bg-yellow-950/40 hover:bg-yellow-900/50 text-yellow-200 font-mono text-[11px] flex items-center justify-between cursor-pointer border border-yellow-500/30"
                  >
                    <span>POST /daily-reward</span>
                    <span className="text-[9px] bg-yellow-500/30 text-yellow-300 px-1.5 py-0.5 rounded font-sans">+50 د.ع</span>
                  </button>

                  {/* Test 5: Purchase Guard */}
                  <button
                    onClick={testPurchase}
                    className="p-2.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-200 font-mono text-[11px] flex items-center justify-between cursor-pointer border border-emerald-500/30"
                  >
                    <span>POST /purchase</span>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-sans">فحص الـ 5 معاملات</span>
                  </button>
                </div>

                {/* Sub & Cron Quick Controls */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800 text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">تغيير باقة الاشتراك للاختبار:</span>
                    <select
                      value={selectedPlanForSub}
                      onChange={(e) => setSelectedPlanForSub(e.target.value as any)}
                      className="bg-slate-800 text-white px-2 py-1 rounded-lg border border-slate-700 text-xs"
                    >
                      <option value="monthly">باقة بلس الشهرية (2,000 د.ع)</option>
                      <option value="yearly">باقة بلس السنوية (15,000 د.ع)</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">تشغيل الكرون يدوياً:</span>
                    <button
                      onClick={() => testRunCron('reset_counters')}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] cursor-pointer"
                    >
                      تصفير المعاملات (00:00)
                    </button>
                    <button
                      onClick={() => testRunCron('disburse_rewards')}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded text-[10px] cursor-pointer"
                    >
                      صرف 50 د.ع
                    </button>
                    <button
                      onClick={() => testRunCron('expire_rewards')}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-red-300 rounded text-[10px] cursor-pointer"
                    >
                      أرشفة منتهية 7 أيام
                    </button>
                  </div>
                </div>
              </div>

              {/* Console Output Log */}
              <div className="p-3.5 rounded-2xl bg-black/90 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>سجل الاستجابات المباشرة (Live Response Stream):</span>
                  {apiLog.length > 0 && (
                    <button
                      onClick={() => setApiLog([])}
                      className="text-red-400 hover:underline cursor-pointer"
                    >
                      مسح السجل
                    </button>
                  )}
                </div>

                {apiLog.length === 0 ? (
                  <div className="py-6 text-center text-slate-600 text-[11px] font-mono">
                    انقر فوق أي من الأزرار أعلاه لتجربة واجهات REST API ومشاهدة الاستجابة وهيكل JSON.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto font-mono text-[11px]" dir="ltr">
                    {apiLog.map((log, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-left">
                        <div className="flex items-center justify-between pb-1 mb-1 border-b border-slate-800 text-[10px]">
                          <span className={log.status === 200 ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                            HTTP {log.status} • {log.endpoint}
                          </span>
                          <span className="text-slate-500">{log.time}</span>
                        </div>
                        <pre className="text-slate-300 text-[10px] overflow-x-auto">
                          {JSON.stringify(log.response, null, 2)}
                        </pre>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Cron Run Log if any */}
              {cronLogs.length > 0 && (
                <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-[11px] space-y-1">
                  <div className="font-bold text-amber-300">سجل تشغيل مهام الكرون (Cron Runs):</div>
                  {cronLogs.map((c, idx) => (
                    <div key={idx} className="text-slate-300 flex items-center justify-between text-[10px]">
                      <span>⚙️ {c.jobName}: {c.details}</span>
                      <span className="text-slate-500 font-mono">{new Date(c.executedAt).toLocaleTimeString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#0a0f1d] border-t border-[#1e293b] flex items-center justify-between text-xs">
          <div className="text-slate-400 flex items-center gap-1.5 text-[11px]">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>نظام اشتراك بلس متوافق 100% مع معايير الإنتاج ومواصفات الدينار العراقي (IQD).</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition cursor-pointer"
          >
            إغلاق النافذة
          </button>
        </div>
      </div>
    </div>
  );
};
