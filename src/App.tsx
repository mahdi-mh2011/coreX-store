/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Wallet,
  Send,
  PlusCircle,
  Settings,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Copy,
  Key,
  LogOut,
  Gamepad2,
  Smartphone,
  Sparkles,
  History,
  QrCode,
  Mail,
  Lock,
  User,
  UserPlus,
  ShoppingBag,
  Gift,
  ArrowRight,
  Info,
  Check,
  Zap,
  PhoneCall,
  Flame,
  ChevronLeft,
  X,
  Maximize2,
  Minimize2,
  Trash2,
  Plus,
  ShieldCheck,
  ShieldAlert,
  MessageSquare,
  Bot,
  Wrench,
  Clock,
  SendHorizontal,
  ExternalLink,
  Loader2,
  LogIn,
  Users,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  Eye,
  EyeOff,
  RefreshCw,
  AlertTriangle,
  Bell,
  Megaphone,
  Coins,
  HeartHandshake,
  Award,
  Sliders,
  Monitor,
  Crown,
  Code2,
  Infinity as InfinityIcon,
  Moon,
  Sun,
  Palette,
  Contrast,
} from 'lucide-react';
import { EthicalAd, INITIAL_ETHICAL_ADS, AdSystemStats } from './data/ethicalAds';
import { AdSenseSettings, DEFAULT_ADSENSE_SETTINGS, GoogleAdCreative } from './data/adsenseConfig';
import { EthicalCharterModal } from './components/EthicalCharterModal';
import { RandomMobileAdPopup } from './components/RandomMobileAdPopup';
import { MobileSponsorCard } from './components/MobileSponsorCard';
import { GentleAdBanner } from './components/GentleAdBanner';
import { GoogleAdSenseUnit } from './components/GoogleAdSenseUnit';
import { SubscriptionModal } from './components/SubscriptionModal';
import { PlusArchitectureModal } from './components/PlusArchitectureModal';
import { AdminAdRevenueSubTab } from './components/AdminAdRevenueSubTab';
import { DesktopAdminDashboard } from './components/DesktopAdminDashboard';

// The strictly designated Developer / Admin credentials requested by the user
export const ADMIN_EMAIL = 'jafarmhmd04@gmail.com';
export const ADMIN_PASSWORD = 'Mahdi1212';

// Application Theme Type: Midnight Slate vs High Contrast Charcoal ("وضع داكن آخر أكثر تباينًا بلمسات رمادية داكنة")
export type AppTheme = 'midnight' | 'charcoal';

// Purchased digital code item interface
export interface PurchasedItem {
  id: string;
  title: string;
  price: number;
  currency: 'د.ع';
  code: string;
  date: string;
}

// Financial Transaction record interface - strictly in Iraqi Dinars (د.ع)
export interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'buy' | 'recharge';
  title: string;
  amount: number; // in Iraqi Dinars (د.ع)
  date: string;
  status: 'completed' | 'pending';
  recipientCardNumber?: string;
  code?: string;
}

// User wallet account - Only Name and Card Number ("رقم بطاقتك")
export interface UserData {
  name: string;
  email: string;
  pass: string;
  balance: number; // in Iraqi Dinars (د.ع)
  cardNumber: number | string; // "رقم بطاقتك"
  joinedDate: string;
  isAdFreeSubscriber?: boolean;
  subscriptionPlan?: 'monthly' | 'yearly' | null;
  subscriptionExpiry?: string | null;
  dailyPurchaseCount?: number;
  lastPurchaseDate?: string;
  lastDailyRewardAt?: string | null;
  subscriptionTier?: 'free' | 'plus';
  cancellationRequested?: boolean;
  cancellationDate?: string | null;
}

// Default visitor / unauthenticated guest account
export const DEFAULT_GUEST_USER: UserData = {
  name: 'زائر المتجر (يرجى تسجيل الدخول)',
  email: '',
  pass: '',
  balance: 0,
  cardNumber: '0000000000',
  joinedDate: '2026',
  isAdFreeSubscriber: false,
  subscriptionPlan: undefined,
  subscriptionExpiry: undefined,
  dailyPurchaseCount: 0,
  lastPurchaseDate: new Date().toISOString().split('T')[0],
  subscriptionTier: 'free',
};

// 10-digit card number generator helper
export const generate10DigitCardNumber = () => Math.floor(1000000000 + Math.random() * 9000000000).toString();

// App Notification interface
export interface AppNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'deduction' | 'transfer' | 'addition' | 'admin_broadcast';
  isRead: boolean;
  targetEmail?: string; // 'all' or specific user email
}

export const DEFAULT_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'رسالة من الإدارة 📢',
    message: 'أهلاً بك في متجر coreX! جميع المعاملات بالدينار العراقي (د.ع) فقط وبوابات الدفع قيد الربط وستتوفر قريباً.',
    date: 'اليوم',
    type: 'admin_broadcast',
    isRead: false,
    targetEmail: 'all',
  },
  {
    id: 'notif-2',
    title: 'تم إصدار بطاقتك بنجاح 💳',
    message: 'تم تفعيل رقم بطاقتك المكون من 10 أرقام. يمكنك نسخه ومشاركته لإرسال واستلام الأموال.',
    date: 'اليوم',
    type: 'addition',
    isRead: false,
    targetEmail: 'all',
  },
];

// Stored User Accounts for Admin with Isolated Records ("كل حساب له معاملات خاصه وسجل خاص وكلشي كل حساب يختلف عن حساب")
export interface StoredUserAccount {
  id: string;
  name: string;
  email: string;
  pass?: string; // كلمة المرور للحساب
  cardNumber: string; // "رقم بطاقتهم" (10 أرقام)
  balance: number; // الرصيد الحالي (يبدأ من 0 د.ع)
  totalTransferred: number; // شكد حولوا (إجمالي المبالغ المرسلة)
  totalWithdrawnOrSpent: number; // شكد سحبوا / اشتروا (إجمالي السحب والمشتريات)
  totalCommission: number; // العمولات (عمولات المتجر والإدارة المجمعة)
  transfersCount: number; // عدد الحوالات
  purchasesCount: number; // عدد السحوبات أو المشتريات
  dailyPurchaseCount?: number; // عدد مشتريات اليوم (أقصى حد 5 للحساب المجاني، غير محدود لـ Plus)
  lastPurchaseDate?: string; // تاريخ آخر عملية شراء لتصفير العداد يومياً
  lastDailyRewardAt?: string | null; // تاريخ صرف مكافأة 50 د.ع اليومية (كل 24 ساعة)
  subscriptionTier?: 'free' | 'plus';
  joinedDate: string;
  lastActive: string;
  isAdFreeSubscriber?: boolean;
  subscriptionPlan?: 'monthly' | 'yearly' | null;
  subscriptionExpiry?: string | null;
  cancellationRequested?: boolean;
  cancellationDate?: string | null;
  transactions?: Transaction[]; // سجل العمليات والمعاملات الخاص بهذا الحساب حصراً
  purchasedCodes?: PurchasedItem[]; // أكواد البطاقات المشتراة الخاصة بهذا الحساب حصراً
}

// Scoped Storage Helpers: Every account has completely isolated transactions & records
export const getUserTransactionsKey = (email: string) => `corex_tx_${email.trim().toLowerCase()}`;
export const getUserPurchasesKey = (email: string) => `corex_purchases_${email.trim().toLowerCase()}`;

export const loadUserTransactions = (email: string, storedList: StoredUserAccount[]): Transaction[] => {
  if (!email) return [];
  const key = getUserTransactionsKey(email);
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {}
  const found = storedList.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  return found?.transactions ? [...found.transactions] : [];
};

export const loadUserPurchases = (email: string, storedList: StoredUserAccount[]): PurchasedItem[] => {
  if (!email) return [];
  const key = getUserPurchasesKey(email);
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {}
  const found = storedList.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  return found?.purchasedCodes ? [...found.purchasedCodes] : [];
};

export const DEFAULT_STORED_USERS: StoredUserAccount[] = [
  {
    id: 'usr-dev-01',
    name: 'جعفر محمد (المطور والمدير العام)',
    email: 'jafarmhmd04@gmail.com',
    pass: 'Mahdi1212',
    cardNumber: '1029384756', // 10 أرقام
    balance: 999999999, // رصيد غير محدود للمطور
    totalTransferred: 500000,
    totalWithdrawnOrSpent: 250000,
    totalCommission: 25000,
    transfersCount: 24,
    purchasesCount: 18,
    joinedDate: '2026/01/01',
    lastActive: 'الآن (متصل)',
    isAdFreeSubscriber: true,
    subscriptionPlan: 'yearly',
    subscriptionExpiry: '2027/12/31',
    transactions: [
      {
        id: 'tx-dev-1',
        type: 'recharge',
        title: 'إيداع وتأسيس الخزينة المركزية',
        amount: 999999999,
        date: '2026/01/01 10:00 ص',
        status: 'completed',
      },
      {
        id: 'tx-dev-2',
        type: 'buy',
        title: 'شراء: بطاقة فيزا coreX الرقمية',
        amount: -15000,
        date: '2026/01/02 11:30 ص',
        status: 'completed',
        code: 'VISA-CX-9921-4412-8819',
      },
      {
        id: 'tx-dev-3',
        type: 'receive',
        title: 'عمولات تحويل الحسابات (+25,000 د.ع)',
        amount: 25000,
        date: '2026/01/05 03:00 م',
        status: 'completed',
      },
    ],
    purchasedCodes: [
      {
        id: 'purch-dev-1',
        title: 'بطاقة فيزا coreX الرقمية',
        price: 15000,
        currency: 'د.ع',
        code: 'VISA-CX-9921-4412-8819',
        date: '2026/01/02 11:30 ص',
      },
    ],
  },
  {
    id: 'usr-1',
    name: 'أحمد علي حسن',
    email: 'ahmed.ali@gmail.com',
    pass: '123456',
    cardNumber: '7492018432', // 10 أرقام
    balance: 0,
    totalTransferred: 45000,
    totalWithdrawnOrSpent: 27000,
    totalCommission: 1500,
    transfersCount: 3,
    purchasesCount: 2,
    joinedDate: '2026/09/15',
    lastActive: 'منذ ساعتين',
    isAdFreeSubscriber: true,
    subscriptionPlan: 'yearly',
    subscriptionExpiry: '2027/09/15',
    transactions: [
      {
        id: 'tx-ahmed-1',
        type: 'recharge',
        title: 'تعبئة رصيد المحفظة',
        amount: 40000,
        date: '2026/09/15 01:00 م',
        status: 'completed',
      },
      {
        id: 'tx-ahmed-2',
        type: 'buy',
        title: 'شراء: بطاقة بلايستيشن ستور 10$',
        amount: -15000,
        date: '2026/09/16 04:15 م',
        status: 'completed',
        code: 'PSN-7731-9920-1142',
      },
      {
        id: 'tx-ahmed-3',
        type: 'send',
        title: 'إرسال أموال لرقم البطاقة: 8831920451',
        amount: -25000,
        date: '2026/09/20 02:40 م',
        status: 'completed',
        recipientCardNumber: '8831920451',
      },
    ],
    purchasedCodes: [
      {
        id: 'purch-ahmed-1',
        title: 'بطاقة بلايستيشن ستور 10$',
        price: 15000,
        currency: 'د.ع',
        code: 'PSN-7731-9920-1142',
        date: '2026/09/16 04:15 م',
      },
    ],
  },
];

// Product interface - Currency is strictly Iraqi Dinar (د.ع)
export interface Product {
  id: number | string;
  name: string;
  price: number; // in Iraqi Dinars (د.ع)
  currency: 'د.ع';
  img: string;
  category?: string;
  description?: string;
  codePrefix?: string;
}

// Support ticket interface matching user specifications
export interface SupportTicket {
  id: number | string;
  email: string;
  issue: string;
  date: string;
  status?: 'pending' | 'resolved';
}


interface ChatMessage {
  id: string;
  text: string;
  sender: 'ai' | 'user';
  time?: string;
  isTicketPrompt?: boolean;
  issueDraft?: string;
}

// Initial default products - Strictly Iraqi Dinar (د.ع)
const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'بطاقة فيزا coreX الرقمية',
    price: 15000,
    currency: 'د.ع',
    category: 'banking',
    description: 'بطاقة فيزا رقمية مسبقة الدفع للاستخدام في المواقع وتفعيل الحسابات',
    img: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80',
    codePrefix: 'VISA-CX',
  },
  {
    id: 2,
    name: 'بطاقة ماستر كارد الرقمية',
    price: 35000,
    currency: 'د.ع',
    category: 'banking',
    description: 'بطاقة ماستركارد رقمية مفعلة للشراء الآمن والاشتراكات',
    img: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&auto=format&fit=crop&q=80',
    codePrefix: 'MC-CX',
  },
  {
    id: 3,
    name: 'بطاقة ألعاب ببجي 600 UC',
    price: 12000,
    currency: 'د.ع',
    category: 'gaming',
    description: 'شحن فوري لحساب ببجي موبايل عبر كود الاسترداد الرسمي',
    img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
    codePrefix: 'PUBG-600',
  },
  {
    id: 4,
    name: 'بطاقة بلايستيشن ستور PSN',
    price: 15000,
    currency: 'د.ع',
    category: 'gaming',
    description: 'شحن محفظة بلايستيشن ستور الحساب الأمريكي',
    img: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
    codePrefix: 'PSN-10US',
  },
  {
    id: 5,
    name: 'رصيد آسياسيل 5,000 د.ع',
    price: 5000,
    currency: 'د.ع',
    category: 'telecom',
    description: 'كارت شحن فوري لشبكة آسياسيل العراق مع تسليم الكود',
    img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
    codePrefix: 'ASIA-5K',
  },
  {
    id: 6,
    name: 'رصيد زين العراق 10,000 د.ع',
    price: 10000,
    currency: 'د.ع',
    category: 'telecom',
    description: 'شحن رصيد زين العراق فوري مع كود التعبئة المعتمد',
    img: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&auto=format&fit=crop&q=80',
    codePrefix: 'ZAIN-10K',
  },
  {
    id: 7,
    name: 'رصيد كورك تليكوم 5,000 د.ع',
    price: 5000,
    currency: 'د.ع',
    category: 'telecom',
    description: 'كارت شحن فوري لشبكة كورك تليكوم العراق',
    img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
    codePrefix: 'KOREK-5K',
  },
  {
    id: 8,
    name: 'بطاقة ستيم Steam Wallet',
    price: 25000,
    currency: 'د.ع',
    category: 'gaming',
    description: 'بطاقة رصيد منصة ستيم العالمية لشراء الألعاب والإضافات',
    img: 'https://images.unsplash.com/photo-1612287232230-e836b281b957?w=600&auto=format&fit=crop&q=80',
    codePrefix: 'STM-CX',
  },
];

export default function App() {
  // Navigation tabs: 'store' | 'wallet' | 'card' | 'settings' | 'admin' - Persists active tab across reloads
  const [activeTab, setActiveTab] = useState<'store' | 'wallet' | 'card' | 'settings' | 'admin'>(() => {
    try {
      const saved = localStorage.getItem('corex_active_tab');
      if (saved === 'admin' || saved === 'wallet' || saved === 'card' || saved === 'settings' || saved === 'store') {
        return saved as 'store' | 'wallet' | 'card' | 'settings' | 'admin';
      }
    } catch (e) {}
    return 'store';
  });

  // Sync active tab to localStorage
  useEffect(() => {
    localStorage.setItem('corex_active_tab', activeTab);
  }, [activeTab]);

  // Current User Account state - Persists reliably across page reloads / refreshes
  const [userData, setUserData] = useState<UserData>(() => {
    try {
      const saved = localStorage.getItem('corex_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.email) {
          if (parsed.email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
            if (parsed.pass !== ADMIN_PASSWORD) {
              return DEFAULT_GUEST_USER;
            }
          }
          const rawCard = parsed.cardNumber || parsed.id || '';
          const card10 = rawCard && rawCard.toString().length === 10 ? rawCard.toString() : '1029384756';
          return {
            ...parsed,
            cardNumber: card10,
          };
        }
      }
    } catch (e) {}
    return DEFAULT_GUEST_USER;
  });

  // Authentication State: persists reliably upon page reload / refresh
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      const savedUser = localStorage.getItem('corex_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed && parsed.email) {
          if (parsed.email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
            return parsed.pass === ADMIN_PASSWORD;
          }
          return true;
        }
      }
    } catch (e) {}
    return false;
  });

  // VIP Ad-Free Subscription Modal State ("الشهر ٢٠٠٠ دينار عراقي السنه ١٥٠٠٠ دع دينار عراقي يلغي الاعلانات")
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);

  // Plus Architecture & API Documentation Modal State
  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState(false);

  // Plus Subscription Cancellation Confirmation Modal State
  const [isCancelConfirmModalOpen, setIsCancelConfirmModalOpen] = useState(false);

  // Notifications State for all customers
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('corex_notifications');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return DEFAULT_NOTIFICATIONS;
  });
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [adminBroadcastTitle, setAdminBroadcastTitle] = useState('');
  const [adminBroadcastMsg, setAdminBroadcastMsg] = useState('');
  const [adminBroadcastTarget, setAdminBroadcastTarget] = useState('all');

  // Check if current user is the Admin/Developer (STRICTLY ONLY jafarmhmd04@gmail.com WITH Mahdi1212)
  const isAdmin = isLoggedIn && userData.email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() && userData.pass === ADMIN_PASSWORD;

  // Guarantee non-admins can never access or view admin tab
  useEffect(() => {
    if (activeTab === 'admin' && !isAdmin) {
      setActiveTab('store');
      localStorage.setItem('corex_active_tab', 'store');
    }
  }, [activeTab, isAdmin]);

  // Products state from localStorage
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('my_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((p) => ({
            ...p,
            price: p.price < 500 ? Math.round(p.price * 1500) : p.price,
            currency: 'د.ع' as const,
          }));
        }
      } catch (e) {}
    }
    return DEFAULT_PRODUCTS;
  });

  // Support tickets state from localStorage
  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem('support_tickets');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [];
  });

  // Stored Users Registry for Multi-Account Switcher (Strictly MAX 2 ACCOUNTS: "وتبديل الحسابات كحد اقصى ٢ حسابات فقط")
  const [storedUsers, setStoredUsers] = useState<StoredUserAccount[]>(() => {
    const saved = localStorage.getItem('corex_stored_users');
    let list: StoredUserAccount[] = DEFAULT_STORED_USERS;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          list = parsed;
        }
      } catch (e) {}
    }
    // Guarantee that Developer account is ALWAYS present in storedUsers with password Mahdi1212
    const devIdx = list.findIndex((u) => u.email.toLowerCase() === ADMIN_EMAIL.toLowerCase());
    if (devIdx === -1) {
      list = [DEFAULT_STORED_USERS[0], ...list];
    } else {
      list[devIdx] = {
        ...list[devIdx],
        pass: ADMIN_PASSWORD,
        cardNumber: list[devIdx].cardNumber || '1029384756',
        name: list[devIdx].name || 'جعفر محمد (المطور والمدير العام)',
      };
    }
    // Strictly cap at MAX 2 ACCOUNTS ONLY ("كحد اقصى ٢ حسابات فقط")
    if (list.length > 2) {
      list = list.slice(0, 2);
    }
    return list;
  });

  // Admin sub-tab selection: 'accounts' | 'broadcast' | 'products' | 'tickets' | 'ads'
  const [adminSubTab, setAdminSubTab] = useState<'accounts' | 'broadcast' | 'products' | 'tickets' | 'ads'>('accounts');

  // ========================================================
  // ETHICAL ADS & AD MONETIZATION REVENUE SYSTEM (CleanAds)
  // ========================================================
  const [ethicalAds, setEthicalAds] = useState<EthicalAd[]>(() => {
    const saved = localStorage.getItem('corex_ethical_ads');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return INITIAL_ETHICAL_ADS;
  });

  const [adStats, setAdStats] = useState<AdSystemStats>(() => {
    const saved = localStorage.getItem('corex_ad_stats');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      totalAdminAdProfitIQD: 184500, // Total profits generated for the site owner
      todayAdminProfitIQD: 12600,
      totalImpressions: 14250,
      totalClicks: 890,
      totalCleanAdsFiltered: 1420,
    };
  });

  // Google AdSense live configuration state - disabled per owner instruction ("خلي الموقع بدون اعلانات سوف انا اضيف كوكل ادسنس")
  const [adsenseSettings, setAdSenseSettings] = useState<AdSenseSettings>(() => {
    try {
      const saved = localStorage.getItem('corex_adsense_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...parsed, isAdsEnabled: false };
      }
    } catch (e) {}
    return { ...DEFAULT_ADSENSE_SETTINGS, isAdsEnabled: false };
  });

  // Sync AdSense settings to localStorage
  useEffect(() => {
    localStorage.setItem('corex_adsense_settings', JSON.stringify(adsenseSettings));
  }, [adsenseSettings]);

  // Dynamically manage Google AdSense script (removed when ads are disabled)
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const scriptId = 'google-adsense-script';
      const existingScript = document.getElementById(scriptId);
      if (!adsenseSettings?.isAdsEnabled) {
        if (existingScript) existingScript.remove();
      } else if (adsenseSettings?.isAdsEnabled && adsenseSettings?.publisherId) {
        const pubId = adsenseSettings.publisherId.startsWith('ca-')
          ? adsenseSettings.publisherId
          : `ca-${adsenseSettings.publisherId}`;
        const expectedSrc = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${pubId}`;
        if (!existingScript) {
          const script = document.createElement('script');
          script.id = scriptId;
          script.async = true;
          script.crossOrigin = 'anonymous';
          script.src = expectedSrc;
          document.head.appendChild(script);
        } else if (existingScript.getAttribute('src') !== expectedSrc) {
          existingScript.setAttribute('src', expectedSrc);
        }
      }
    }
  }, [adsenseSettings?.isAdsEnabled, adsenseSettings?.publisherId]);

  // Random gentle ad popup that appears spontaneously to mobile visitors
  const [randomPopupAd, setRandomPopupAd] = useState<EthicalAd | null>(null);
  const [isCharterModalOpen, setIsCharterModalOpen] = useState(false);
  const [preferredCategories, setPreferredCategories] = useState<string[]>([
    'تعليم وتقنية',
    'عمل خيري وبيئة',
    'صحة وغذاء طبيعي',
    'ثقافة وكتب',
    'مشاريع وطنية',
  ]);
  const [searchUserQuery, setSearchUserQuery] = useState('');
  const [adminTopUpUser, setAdminTopUpUser] = useState<StoredUserAccount | null>(null);
  const [adminTopUpAmount, setAdminTopUpAmount] = useState('');
  const [viewingUserAccount, setViewingUserAccount] = useState<StoredUserAccount | null>(null);

  // Login & Register Modal State
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [loginEmailInput, setLoginEmailInput] = useState('');
  const [loginPassInput, setLoginPassInput] = useState('');
  const [regNameInput, setRegNameInput] = useState('');

  // Add Product form inputs (Strictly IQD)
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodImg, setProdImg] = useState('');

  // Confirm delete modal
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Theme state: 'midnight' (current dark mode) vs 'charcoal' (high contrast charcoal dark mode)
  const [appTheme, setAppTheme] = useState<AppTheme>(() => {
    try {
      const saved = localStorage.getItem('corex_app_theme');
      if (saved === 'charcoal' || saved === 'midnight') return saved;
    } catch (e) {}
    return 'midnight';
  });

  // Sync theme to localStorage and document.body
  useEffect(() => {
    localStorage.setItem('corex_app_theme', appTheme);
    if (typeof document !== 'undefined') {
      if (appTheme === 'charcoal') {
        document.body.classList.add('theme-charcoal');
        document.body.classList.remove('theme-midnight');
      } else {
        document.body.classList.add('theme-midnight');
        document.body.classList.remove('theme-charcoal');
      }
    }
  }, [appTheme]);

  // Purchases and Transactions - strictly isolated per account ("و كل حساب له معاملات خاصه و وسجل خاص وكلشي كل حساب يختلف عن حساب")
  const [purchases, setPurchases] = useState<PurchasedItem[]>(() => {
    return loadUserPurchases(userData.email, DEFAULT_STORED_USERS);
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    return loadUserTransactions(userData.email, DEFAULT_STORED_USERS);
  });

  // Synchronize and load user-specific records whenever authenticated user changes
  useEffect(() => {
    if (isLoggedIn && userData.email) {
      setTransactions(loadUserTransactions(userData.email, storedUsers));
      setPurchases(loadUserPurchases(userData.email, storedUsers));
    } else {
      setTransactions([]);
      setPurchases([]);
    }
  }, [isLoggedIn, userData.email]);

  // Modals for wallet
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState(false);
  const [sendRecipientCardNumber, setSendRecipientCardNumber] = useState('');
  const [sendAmountInput, setSendAmountInput] = useState('');
  const [voucherCodeInput, setVoucherCodeInput] = useState('');
  const [purchasedModalItem, setPurchasedModalItem] = useState<{ title: string; code: string; price: number; currency: 'د.ع' } | null>(null);
  const [changePassInput, setChangePassInput] = useState('');

  // Category filter
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Toast notification
  const [toast, setToast] = useState<{
    type: 'success' | 'error' | 'info';
    title: string;
    message: string;
  } | null>(null);

  // ========================================================
  // AI CHAT WIDGET (coreX AI Text Assistant - Strictly IQD)
  // ========================================================
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'init-msg',
      sender: 'ai',
      text: 'أهلاً بك! أنا مساعد coreX AI الذكي. جميع المعاملات بالدينار العراقي (د.ع) فقط. كيف يمكنني مساعدتك اليوم؟',
    },
  ]);
  const [ticketEmailInput, setTicketEmailInput] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    if (isChatOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatOpen]);

  // Low balance (< 1,000 IQD) Toast notification reminder when opening the wallet
  useEffect(() => {
    if (activeTab === 'wallet' && isLoggedIn && userData.balance < 1000) {
      showToast(
        'تنبيه انخفاض الرصيد ⚠️',
        `رصيد محفظتك الحالي (${userData.balance.toLocaleString()} د.ع) أقل من 1,000 د.ع. يرجى المبادرة بتعبئة الرصيد للاستمرار في التسوق والتحويل!`,
        'error'
      );
    }
  }, [activeTab, isLoggedIn, userData.balance]);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('my_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('support_tickets', JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    if (isLoggedIn && userData.email) {
      localStorage.setItem('corex_is_logged_in', 'true');
      localStorage.setItem('corex_user', JSON.stringify(userData));

      // Keep storedUsers registry updated so customer accounts and developer account stay permanently stored
      setStoredUsers((prev) => {
        const idx = prev.findIndex((u) => u.email.toLowerCase() === userData.email.toLowerCase());
        if (idx !== -1) {
          const target = prev[idx];
          if (
            target.balance !== userData.balance ||
            target.name !== userData.name ||
            target.isAdFreeSubscriber !== userData.isAdFreeSubscriber ||
            target.subscriptionPlan !== userData.subscriptionPlan
          ) {
            const nextList = [...prev];
            nextList[idx] = {
              ...target,
              name: userData.name,
              balance: userData.balance,
              cardNumber: userData.cardNumber.toString(),
              isAdFreeSubscriber: userData.isAdFreeSubscriber,
              subscriptionPlan: userData.subscriptionPlan,
              subscriptionExpiry: userData.subscriptionExpiry,
            };
            return nextList;
          }
        }
        return prev;
      });
    }
  }, [isLoggedIn, userData]);

  // Save user-isolated purchases
  useEffect(() => {
    if (isLoggedIn && userData.email) {
      const pKey = getUserPurchasesKey(userData.email);
      localStorage.setItem(pKey, JSON.stringify(purchases));
      setStoredUsers((prev) =>
        prev.map((u) =>
          u.email.toLowerCase() === userData.email.toLowerCase()
            ? { ...u, purchasedCodes: purchases }
            : u
        )
      );
    }
  }, [purchases, isLoggedIn, userData.email]);

  // Save user-isolated transactions
  useEffect(() => {
    if (isLoggedIn && userData.email) {
      const txKey = getUserTransactionsKey(userData.email);
      localStorage.setItem(txKey, JSON.stringify(transactions));
      setStoredUsers((prev) =>
        prev.map((u) =>
          u.email.toLowerCase() === userData.email.toLowerCase()
            ? { ...u, transactions }
            : u
        )
      );
    }
  }, [transactions, isLoggedIn, userData.email]);

  useEffect(() => {
    localStorage.setItem('corex_stored_users', JSON.stringify(storedUsers));
  }, [storedUsers]);

  useEffect(() => {
    localStorage.setItem('corex_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('corex_ethical_ads', JSON.stringify(ethicalAds));
  }, [ethicalAds]);

  useEffect(() => {
    localStorage.setItem('corex_ad_stats', JSON.stringify(adStats));
  }, [adStats]);

  // Record impression: Generates ad revenue for the ADMIN
  const recordAdImpression = (ad: EthicalAd) => {
    const earnedIQD = ad.adminRevenuePerViewIQD || 400;
    setEthicalAds((prev) =>
      prev.map((a) => (a.id === ad.id ? { ...a, viewsCount: a.viewsCount + 1 } : a))
    );
    setAdStats((prev) => ({
      ...prev,
      totalAdminAdProfitIQD: prev.totalAdminAdProfitIQD + earnedIQD,
      todayAdminProfitIQD: prev.todayAdminProfitIQD + earnedIQD,
      totalImpressions: prev.totalImpressions + 1,
    }));
  };

  // Record click: Generates extra ad revenue for the ADMIN
  const recordAdClick = (ad: EthicalAd) => {
    const earnedIQD = ad.adminRevenuePerClickIQD || 1800;
    setEthicalAds((prev) =>
      prev.map((a) => (a.id === ad.id ? { ...a, clicksCount: a.clicksCount + 1 } : a))
    );
    setAdStats((prev) => ({
      ...prev,
      totalAdminAdProfitIQD: prev.totalAdminAdProfitIQD + earnedIQD,
      todayAdminProfitIQD: prev.todayAdminProfitIQD + earnedIQD,
      totalClicks: prev.totalClicks + 1,
    }));
  };

  // Google AdSense live impression tracker (Earnings strictly for ADMIN)
  const handleAdSenseImpression = (creative: GoogleAdCreative) => {
    const earnedIQD = creative.revenuePerViewIQD || 450;
    setAdSenseSettings((prev) => ({
      ...prev,
      totalImpressions: prev.totalImpressions + 1,
      todayEarningsIQD: prev.todayEarningsIQD + earnedIQD,
      totalEarningsIQD: prev.totalEarningsIQD + earnedIQD,
    }));
    setAdStats((prev) => ({
      ...prev,
      totalImpressions: prev.totalImpressions + 1,
      totalAdminAdProfitIQD: prev.totalAdminAdProfitIQD + earnedIQD,
      todayAdminProfitIQD: prev.todayAdminProfitIQD + earnedIQD,
    }));
  };

  // Google AdSense live click tracker (Earnings strictly for ADMIN)
  const handleAdSenseClick = (creative: GoogleAdCreative) => {
    const earnedIQD = creative.revenuePerClickIQD || 2200;
    setAdSenseSettings((prev) => ({
      ...prev,
      totalClicks: prev.totalClicks + 1,
      todayEarningsIQD: prev.todayEarningsIQD + earnedIQD,
      totalEarningsIQD: prev.totalEarningsIQD + earnedIQD,
    }));
    setAdStats((prev) => ({
      ...prev,
      totalClicks: prev.totalClicks + 1,
      totalAdminAdProfitIQD: prev.totalAdminAdProfitIQD + earnedIQD,
      todayAdminProfitIQD: prev.todayAdminProfitIQD + earnedIQD,
    }));
  };

  // Admin withdraws all ad revenue (AdSense + Sponsors) directly into his Admin Wallet balance
  const handleWithdrawProfitsToAdminWallet = () => {
    if (!isAdmin) return;
    const profitToWithdraw = adStats.totalAdminAdProfitIQD + adsenseSettings.totalEarningsIQD;
    if (profitToWithdraw <= 0) {
      showToast('تنبيه', 'لا توجد أرباح إعلانات أو أدسنس جديدة غير مسحوبة حالياً.', 'info');
      return;
    }

    setUserData((prev) => ({
      ...prev,
      balance: prev.balance + profitToWithdraw,
    }));

    const newTx: Transaction = {
      id: 'tx-adsense-profit-' + Date.now(),
      type: 'recharge',
      title: 'إيداع أرباح Google AdSense والرعايات في المحفظة',
      amount: profitToWithdraw,
      date: new Date().toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' }),
      status: 'completed',
    };
    setTransactions((prev) => [newTx, ...prev]);

    setAdStats((prev) => ({
      ...prev,
      totalAdminAdProfitIQD: 0,
      todayAdminProfitIQD: 0,
    }));

    setAdSenseSettings((prev) => ({
      ...prev,
      totalEarningsIQD: 0,
      todayEarningsIQD: 0,
    }));

    showToast(
      'تم إيداع الأرباح 💰',
      `تم تحويل +${profitToWithdraw.toLocaleString()} د.ع من أرباح Google AdSense والرعايات إلى بطاقتك بنجاح!`,
      'success'
    );
  };

  // Automatic 50 IQD Daily Reward Disbursement effect for active Plus Subscribers (Every 24 Hours)
  useEffect(() => {
    if (!isLoggedIn || !userData.isAdFreeSubscriber) return;

    const now = Date.now();
    const lastDisbursedTime = userData.lastDailyRewardAt
      ? new Date(userData.lastDailyRewardAt).getTime()
      : 0;
    const twentyFourHours = 24 * 60 * 60 * 1000;

    // If 24h have passed since last reward, disburse 50 IQD with 7-day expiration window
    if (now - lastDisbursedTime >= twentyFourHours) {
      const nowStr = new Date().toISOString();
      setUserData((prev) => ({
        ...prev,
        balance: prev.balance + 50,
        lastDailyRewardAt: nowStr,
      }));

      const rewardTx: Transaction = {
        id: 'tx-rwd-' + Date.now(),
        type: 'receive',
        title: 'مكافأة Plus اليومية (+50 د.ع)',
        amount: 50,
        date: new Date().toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' }),
        status: 'completed',
      };
      setTransactions((prev) => [rewardTx, ...prev]);

      addNotification(
        'مكافأة Plus اليومية 50 د.ع 🎁',
        'تم صرف وإيداع 50 دينار عراقي في محفظتك تلقائياً لعضويتك النشطة في باقة بلس! المكافأة صالحة للاستخدام لمدة 7 أيام.',
        'addition',
        userData.email
      );

      showToast(
        'مكافأة Plus اليومية (+50 د.ع) 🎁',
        'تم إيداع مكافأة 50 دينار عراقي في محفظتك بنجاح! صالحة للاستخدام لمدة 7 أيام.',
        'success'
      );
    }
  }, [isLoggedIn, userData.isAdFreeSubscriber, userData.lastDailyRewardAt, userData.email]);

  // Manual claim helper for Daily Reward
  const handleClaimDailyReward = () => {
    if (!userData.isAdFreeSubscriber) {
      showToast(
        'ميزة خاصة بمشتركي Plus',
        'المكافأة اليومية (50 د.ع كل 24 ساعة) حصرية لمشتركي باقة Plus. يرجى الاشتراك للتفعيل!',
        'info'
      );
      setIsSubscriptionModalOpen(true);
      return;
    }

    const now = Date.now();
    const lastDisbursedTime = userData.lastDailyRewardAt
      ? new Date(userData.lastDailyRewardAt).getTime()
      : 0;
    const twentyFourHours = 24 * 60 * 60 * 1000;

    if (now - lastDisbursedTime < twentyFourHours) {
      const remainingHours = Math.ceil((twentyFourHours - (now - lastDisbursedTime)) / (60 * 60 * 1000));
      showToast(
        'تم الاستلام اليوم',
        `لقد استلمت مكافأة الـ 50 د.ع لليوم بالفعل. تتاح المكافأة التالية بعد قرابة ${remainingHours} ساعة.`,
        'info'
      );
      return;
    }

    const nowStr = new Date().toISOString();
    setUserData((prev) => ({
      ...prev,
      balance: prev.balance + 50,
      lastDailyRewardAt: nowStr,
    }));

    const rewardTx: Transaction = {
      id: 'tx-rwd-' + Date.now(),
      type: 'receive',
      title: 'مكافأة Plus اليومية (+50 د.ع)',
      amount: 50,
      date: new Date().toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' }),
      status: 'completed',
    };
    setTransactions((prev) => [rewardTx, ...prev]);

    showToast(
      'تم استلام مكافأة 50 د.ع 🎁',
      'تمت إضافة 50 دينار عراقي إلى رصيد محفظتك بنجاح! صالحة للاستخدام لمدة 7 أيام.',
      'success'
    );
  };

  // Subscription handler: Payment gateways currently unavailable per request ("واجعل غير متوفر بوابه دفع الان لا يمكنه الاشتراك")
  const handleSubscribeAdFree = (
    plan: 'monthly' | 'yearly',
    gatewayName: string = 'بوابة دفع إلكترونية',
    transactionRef?: string
  ) => {
    showToast(
      'بوابات الدفع غير متوفرة حالياً 🔒',
      'عذراً، خدمة بوابات الدفع الإلكتروني غير متوفرة حالياً ولا يمكن الاشتراك الذاتي الآن. يمكن لإدارة المتجر تفعيل الاشتراك لحسابك مباشرة ومجاناً عبر رقم بطاقتك.',
      'info'
    );
    setIsSubscriptionModalOpen(false);
  };

  // Developer / Admin handler: Can subscribe ANY user via card number or from accounts list ("وخلي الحساب المطور يكدر يشترك اي شخص اشتراك عن طريق رقم بطاقته او عن طريق من قائمه حسابات")
  const handleAdminSetSubscription = (
    userIdOrCardNumber: string,
    plan: 'monthly' | 'yearly' | 'lifetime' | 'cancel'
  ) => {
    const target = storedUsers.find(
      (u) =>
        u.id === userIdOrCardNumber ||
        u.cardNumber === userIdOrCardNumber ||
        u.email.toLowerCase() === userIdOrCardNumber.toLowerCase()
    );

    if (!target) {
      showToast('خطأ', 'لم يتم العثور على صاحب البطاقة أو الحساب.', 'error');
      return;
    }

    const durationDays = plan === 'monthly' ? 30 : plan === 'yearly' ? 365 : 3650;
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + durationDays);
    const expiryStr = plan === 'lifetime' ? '2099-12-31' : expiryDate.toISOString().split('T')[0];

    const isSub = plan !== 'cancel';
    const subPlan = isSub ? (plan === 'lifetime' ? 'yearly' : plan) : undefined;
    const subTier = isSub ? 'plus' : 'free';

    setStoredUsers((prev) =>
      prev.map((u) =>
        u.id === target.id || u.cardNumber === target.cardNumber
          ? {
              ...u,
              isAdFreeSubscriber: isSub,
              subscriptionPlan: subPlan,
              subscriptionExpiry: isSub ? expiryStr : undefined,
              subscriptionTier: subTier,
            }
          : u
      )
    );

    if (userData.email.toLowerCase() === target.email.toLowerCase() || userData.cardNumber === target.cardNumber) {
      const updatedCurr: UserData = {
        ...userData,
        isAdFreeSubscriber: isSub,
        subscriptionPlan: subPlan,
        subscriptionExpiry: isSub ? expiryStr : undefined,
        subscriptionTier: subTier,
      };
      setUserData(updatedCurr);
      localStorage.setItem('corex_user', JSON.stringify(updatedCurr));
    }

    if (isSub) {
      addNotification(
        'هدية اشتراك بلس من المطور 👑',
        `قام مطور المتجر بتفعيل اشتراك بلس لحسابك مجاناً عبر رقم بطاقتك (${target.cardNumber}) لغاية ${expiryStr}! تصفح خالٍ تماماً من الإعلانات ومعاملات غير محدودة.`,
        'addition',
        target.email
      );
    }

    showToast(
      isSub ? 'تم تفعيل الاشتراك 👑' : 'تم إلغاء الاشتراك',
      isSub
        ? `تم تفعيل اشتراك بلس للمستخدم (${target.name}) صاحب البطاقة (${target.cardNumber}) بنجاح وبدون أي خصم من رصيده!`
        : `تم إلغاء اشتراك بلس للمستخدم (${target.name}).`,
      'success'
    );
  };

  // Helper to compute exact expiration date and remaining duration
  const getSubscriptionExpirationDetails = () => {
    if (!userData.isAdFreeSubscriber || !userData.subscriptionExpiry) {
      return null;
    }

    const expiry = new Date(userData.subscriptionExpiry);
    const now = new Date();
    const diffMs = expiry.getTime() - now.getTime();

    if (diffMs <= 0) {
      return {
        isExpired: true,
        expiryDateFormatted: userData.subscriptionExpiry,
        remainingDays: 0,
        remainingHours: 0,
        durationText: 'منتهي الصلاحية',
      };
    }

    const totalDays = Math.ceil(diffMs / (24 * 60 * 60 * 1000));
    const hours = Math.floor((diffMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));

    let durationText = '';
    if (totalDays > 30) {
      const months = Math.floor(totalDays / 30);
      const remainingDays = totalDays % 30;
      durationText = `${totalDays} يوماً (قرابة ${months} شهر ${remainingDays > 0 ? `و${remainingDays} يوم` : ''})`;
    } else if (totalDays > 1) {
      durationText = `${totalDays} يوماً${hours > 0 ? ` و${hours} ساعة` : ''}`;
    } else {
      durationText = `${hours} ساعة فقط`;
    }

    return {
      isExpired: false,
      expiryDateFormatted: userData.subscriptionExpiry,
      remainingDays: totalDays,
      remainingHours: hours,
      durationText,
    };
  };

  // Handle user-requested subscription cancellation (cancel_subscription)
  const handleCancelSubscription = () => {
    if (!userData.isAdFreeSubscriber) return;

    const cancellationDateStr = new Date().toISOString();
    setUserData((prev) => ({
      ...prev,
      cancellationRequested: true,
      cancellationDate: cancellationDateStr,
    }));

    // Update stored users list
    setStoredUsers((prev) =>
      prev.map((u) =>
        u.email.toLowerCase() === userData.email.toLowerCase()
          ? { ...u, cancellationRequested: true, cancellationDate: cancellationDateStr }
          : u
      )
    );

    // Audit transaction
    const cancelTx: Transaction = {
      id: 'tx-cancel-' + Date.now(),
      type: 'buy',
      title: 'طلب إلغاء اشتراك بلس (إيقاف التجديد التلقائي)',
      amount: 0,
      date: new Date().toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' }),
      status: 'completed',
    };
    setTransactions((prev) => [cancelTx, ...prev]);

    addNotification(
      'تم إلغاء تجديد اشتراك بلس ⚠️',
      `تم استلام طلب إلغاء اشتراك بلس بنجاح. ستظل مزايا الباقة (حجب الإعلانات، 50 د.ع يومياً، والشراء غير المحدود) متاحة لحسابك حتى تاريخ انتهاء الصلاحية المحدد في ${userData.subscriptionExpiry}.`,
      'admin_broadcast',
      userData.email
    );

    setIsCancelConfirmModalOpen(false);
    showToast(
      'تم تسجيل طلب إلغاء الاشتراك ⚠️',
      `تم إيقاف التجديد التلقائي. تظل مزايا باقة Plus سارية حتى ${userData.subscriptionExpiry}.`,
      'info'
    );
  };

  // Handle re-activating auto-renewal if previously cancelled
  const handleReactivateSubscription = () => {
    setUserData((prev) => ({
      ...prev,
      cancellationRequested: false,
      cancellationDate: null,
    }));

    setStoredUsers((prev) =>
      prev.map((u) =>
        u.email.toLowerCase() === userData.email.toLowerCase()
          ? { ...u, cancellationRequested: false, cancellationDate: null }
          : u
      )
    );

    showToast(
      'تم استئناف الاشتراك بنجاح 👑',
      'تمت إعادة تفعيل التجديد التلقائي لاشتراك Plus الخاص بك بنجاح!',
      'success'
    );
  };

  const showToast = (title: string, message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ title, message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Low balance detection & Toast alert for Wallet (< 1,000 IQD / د.ع)
  // "إظهار تنبيه مرئي (Toast) أو أيقونة تحذير عند انخفاض الرصيد عن ١٠٠٠ د.ع، لتذكير المستخدم بضرورة تعبئة الرصيد"
  const prevBalanceRef = useRef<number>(userData.balance);
  const lastLowBalanceWarningRef = useRef<number>(0);

  useEffect(() => {
    if (isLoggedIn && userData.balance < 1000 && activeTab === 'wallet') {
      const now = Date.now();
      // Alert when entering wallet or when balance drops below 1,000 IQD (rate-limited so it doesn't spam)
      if (now - lastLowBalanceWarningRef.current > 20000 || prevBalanceRef.current >= 1000) {
        lastLowBalanceWarningRef.current = now;
        showToast(
          '⚠️ تنبيه انخفاض الرصيد',
          `رصيدك الحالي (${userData.balance.toLocaleString()} د.ع) أقل من 1,000 د.ع. يُرجى تعبئة الرصيد لتجنب توقف المعاملات والتحويلات.`,
          'error'
        );
      }
    }
    prevBalanceRef.current = userData.balance;
  }, [activeTab, userData.balance, isLoggedIn]);

  // Helper to add in-app notifications
  const addNotification = (
    title: string,
    message: string,
    type: 'deduction' | 'transfer' | 'addition' | 'admin_broadcast',
    targetEmail: string = 'all'
  ) => {
    const newNotif: AppNotification = {
      id: 'notif-' + Date.now(),
      title,
      message,
      date: new Date().toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' }),
      type,
      isRead: false,
      targetEmail,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Helper to sync user to admin registry
  const registerUserInStorage = (
    name: string,
    email: string,
    cardNumber: string,
    balance: number = 0,
    pass?: string
  ) => {
    setStoredUsers((prev) => {
      const idx = prev.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          name: email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'جعفر محمد (المطور والمدير العام)' : name,
          cardNumber,
          pass: pass || updated[idx].pass,
          lastActive: 'الآن (متصل)',
        };
        localStorage.setItem('corex_stored_users', JSON.stringify(updated));
        return updated;
      } else {
        const newAccount: StoredUserAccount = {
          id: email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'usr-dev-01' : 'usr-' + Date.now(),
          name,
          email,
          pass,
          cardNumber,
          balance,
          totalTransferred: 0,
          totalWithdrawnOrSpent: 0,
          totalCommission: 0,
          transfersCount: 0,
          purchasesCount: 0,
          joinedDate: new Date().toLocaleDateString('ar-IQ'),
          lastActive: 'الآن (تسجيل جديد)',
        };
        const updated = [newAccount, ...prev];
        localStorage.setItem('corex_stored_users', JSON.stringify(updated));
        return updated;
      }
    });
  };

  // ========================================================
  // AUTHENTICATION LOGIC (Login & Logout by Email & Password)
  // Only jafarmhmd04@gmail.com is granted Administrator role!
  // Any regular customer starts with 0 د.ع ("ليس لدي أموال")
  // Card numbers are strictly 10 digits
  // ========================================================
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const email = loginEmailInput.trim().toLowerCase();
    const pass = loginPassInput.trim();

    if (!email || !pass) {
      showToast('تنبيه', 'يرجى إدخال البريد الإلكتروني والرمز / كلمة المرور.', 'error');
      return;
    }

    if (authMode === 'login') {
      // Check if Developer / Admin Account (strictly verified via ADMIN_EMAIL and ADMIN_PASSWORD)
      if (email === ADMIN_EMAIL.toLowerCase()) {
        if (pass !== ADMIN_PASSWORD) {
          showToast(
            'خطأ في تسجيل الدخول',
            'الرمز السري غير صحيح. يرجى التأكد من الرمز والمحاولة مرة أخرى.',
            'error'
          );
          return;
        }

        const adminUser: UserData = {
          name: 'جعفر محمد (المطور والمدير العام)',
          email: ADMIN_EMAIL,
          pass: ADMIN_PASSWORD,
          balance: userData.email === ADMIN_EMAIL && userData.balance > 0 ? userData.balance : 100000,
          cardNumber: '1029384756', // 10 أرقام
          joinedDate: '2026',
          isAdFreeSubscriber: true,
          subscriptionPlan: 'yearly',
          subscriptionExpiry: '2027/12/31',
          dailyPurchaseCount: 0,
          lastPurchaseDate: new Date().toISOString().split('T')[0],
          lastDailyRewardAt: new Date().toISOString(),
          subscriptionTier: 'plus',
        };
        setUserData(adminUser);
        setIsLoggedIn(true);
        localStorage.setItem('corex_is_logged_in', 'true');
        localStorage.setItem('corex_user', JSON.stringify(adminUser));
        registerUserInStorage('جعفر محمد (المطور والمدير العام)', ADMIN_EMAIL, '1029384756', adminUser.balance, ADMIN_PASSWORD);
        setIsLoginModalOpen(false);
        setLoginEmailInput('');
        setLoginPassInput('');
        showToast(
          'تم تسجيل الدخول',
          'مرحباً بك يا مدير المتجر! تم التحقق من هويتك وتفعيل لوحة المطور بنجاح.',
          'success'
        );
      } else {
        // Regular customer account - strictly 0 د.ع ("ليس لدي أموال")
        const existingStored = storedUsers.find((u) => u.email.toLowerCase() === email);
        if (existingStored && existingStored.pass && existingStored.pass !== pass) {
          showToast('خطأ في كلمة المرور', 'كلمة المرور / الرمز غير صحيح لهذا الحساب.', 'error');
          return;
        }

        const cardNum = existingStored ? existingStored.cardNumber : generate10DigitCardNumber();
        const userName = existingStored ? existingStored.name : email.split('@')[0];
        const userBal = existingStored ? existingStored.balance : 0; // Starts with 0 IQD

        const customerUser: UserData = {
          name: userName,
          email,
          pass,
          balance: userBal,
          cardNumber: cardNum,
          joinedDate: existingStored?.joinedDate || '2026',
          isAdFreeSubscriber: existingStored ? existingStored.isAdFreeSubscriber : false,
          subscriptionPlan: existingStored ? existingStored.subscriptionPlan : undefined,
          subscriptionExpiry: existingStored ? existingStored.subscriptionExpiry : undefined,
          subscriptionTier: existingStored && existingStored.isAdFreeSubscriber ? 'plus' : 'free',
        };
        setUserData(customerUser);
        setIsLoggedIn(true);
        localStorage.setItem('corex_is_logged_in', 'true');
        localStorage.setItem('corex_user', JSON.stringify(customerUser));
        setIsLoginModalOpen(false);
        setLoginEmailInput('');
        setLoginPassInput('');
        registerUserInStorage(userName, email, cardNum, userBal, pass);
        showToast('تم تسجيل الدخول', `أهلاً بك (${userName})! تم حفظ وتثبيت حسابك بنجاح.`, 'info');
      }
    } else {
      // Register Mode
      if (email === ADMIN_EMAIL.toLowerCase()) {
        showToast(
          'تنبيه',
          'هذا البريد الإلكتروني مسجل مسبقاً. يرجى التبديل لتسجيل الدخول.',
          'error'
        );
        setAuthMode('login');
        return;
      }

      const name = regNameInput.trim() || email.split('@')[0];
      const cardNum = generate10DigitCardNumber(); // 10 أرقام حصراً
      const initBal = 0; // 0 د.ع for regular users!

      const newUser: UserData = {
        name,
        email,
        pass,
        balance: initBal,
        cardNumber: cardNum,
        joinedDate: '2026',
        isAdFreeSubscriber: false,
        subscriptionTier: 'free',
      };
      setUserData(newUser);
      setIsLoggedIn(true);
      localStorage.setItem('corex_is_logged_in', 'true');
      localStorage.setItem('corex_user', JSON.stringify(newUser));
      setIsLoginModalOpen(false);
      setLoginEmailInput('');
      setLoginPassInput('');
      setRegNameInput('');
      registerUserInStorage(name, email, cardNum, 0, pass);
      addNotification(
        'تم إصدار بطاقتك الرقمية الجديدة 💳',
        `تم إنشاء حسابك وتفعيل رقم بطاقتك المكون من 10 أرقام (${cardNum}) برصيد 0 د.ع.`,
        'addition',
        email
      );
      showToast(
        'تم إنشاء الحساب',
        `تم إنشاء حسابك بنجاح! رقم بطاقتك (10 أرقام): ${newUser.cardNumber}`,
        'success'
      );
    }
  };

  // Sign out function
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData(DEFAULT_GUEST_USER);
    localStorage.setItem('corex_is_logged_in', 'false');
    localStorage.removeItem('corex_user');
    setActiveTab('store');
    showToast('تم تسجيل الخروج', 'تم تسجيل خروجك من الحساب بنجاح. يمنع الشراء وتعبئة الرصيد إلا بعد تسجيل الدخول.', 'info');
  };

  // Multi-Account Switcher states in Settings (Strictly MAX 2 ACCOUNTS: "وتبديل الحسابات كحد اقصى ٢ حسابات فقط وحساب تجريبي لا يوجد ماكو انشاء حساب سريع تنشى عن طريق بريد واسم ورمز")
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const [newAccName, setNewAccName] = useState('');
  const [newAccEmail, setNewAccEmail] = useState('');
  const [newAccPass, setNewAccPass] = useState('');
  const [showPassChangeVisibility, setShowPassChangeVisibility] = useState(false);

  // Instant one-click Account Switcher ("تبديل ما بين الحسابات من الإعدادات بضغطة زر وكل حساب يختلف من كل شيء")
  const handleSwitchAccount = (targetUser: StoredUserAccount) => {
    if (isLoggedIn && userData.email.toLowerCase() === targetUser.email.toLowerCase()) {
      showToast('الحساب الحالي', 'أنت تستخدم هذا الحساب بالفعل حالياً.', 'info');
      return;
    }

    // 1. First, save current active user's state into storedUsers & localStorage
    if (isLoggedIn && userData.email) {
      setStoredUsers((prev) => {
        const idx = prev.findIndex((u) => u.email.toLowerCase() === userData.email.toLowerCase());
        if (idx !== -1) {
          const next = [...prev];
          next[idx] = {
            ...next[idx],
            name: userData.name,
            pass: userData.pass || next[idx].pass,
            balance: userData.balance,
            cardNumber: userData.cardNumber.toString(),
            isAdFreeSubscriber: userData.isAdFreeSubscriber,
            subscriptionPlan: userData.subscriptionPlan,
            subscriptionExpiry: userData.subscriptionExpiry,
            transactions: transactions,
            purchasedCodes: purchases,
          };
          localStorage.setItem('corex_stored_users', JSON.stringify(next));
          return next;
        }
        return prev;
      });
    }

    // 2. Locate fresh target account data
    const freshTarget = storedUsers.find((u) => u.email.toLowerCase() === targetUser.email.toLowerCase()) || targetUser;

    const newUserData: UserData = {
      name: freshTarget.name,
      email: freshTarget.email,
      pass: freshTarget.pass || '',
      balance: freshTarget.balance,
      cardNumber: freshTarget.cardNumber,
      joinedDate: freshTarget.joinedDate || '2026',
      isAdFreeSubscriber: freshTarget.isAdFreeSubscriber,
      subscriptionPlan: freshTarget.subscriptionPlan,
      subscriptionExpiry: freshTarget.subscriptionExpiry,
      subscriptionTier: freshTarget.subscriptionTier || (freshTarget.isAdFreeSubscriber ? 'plus' : 'free'),
      dailyPurchaseCount: freshTarget.dailyPurchaseCount || 0,
      lastPurchaseDate: freshTarget.lastPurchaseDate,
      lastDailyRewardAt: freshTarget.lastDailyRewardAt,
      cancellationRequested: freshTarget.cancellationRequested,
      cancellationDate: freshTarget.cancellationDate,
    };

    setUserData(newUserData);
    setIsLoggedIn(true);
    localStorage.setItem('corex_is_logged_in', 'true');
    localStorage.setItem('corex_user', JSON.stringify(newUserData));

    // 3. Immediately load isolated transactions & purchases for the target account
    const userTx = loadUserTransactions(freshTarget.email, storedUsers);
    const userPurch = loadUserPurchases(freshTarget.email, storedUsers);
    setTransactions(userTx);
    setPurchases(userPurch);

    showToast(
      'تم تبديل الحساب بنجاح 🔄',
      `تم الانتقال إلى (${freshTarget.name}) • بطاقتك: ${freshTarget.cardNumber} • الرصيد: ${freshTarget.balance.toLocaleString()} د.ع`,
      'success'
    );
  };

  // Add / Create Second Account from Settings (Strictly via name, email, and password - strictly MAX 2 ACCOUNTS)
  const handleCreateSecondAccount = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (storedUsers.length >= 2) {
      showToast('الحد الأقصى للحسابات', 'الحد الأقصى المسموح به هو حسابين (2) فقط لا غير. يمكنك حذف الحساب الثانوي لإضافة حساب بديل.', 'error');
      return;
    }

    if (!newAccName.trim()) {
      showToast('بيانات مطلوبة', 'يرجى إدخال اسم صاحب الحساب.', 'error');
      return;
    }

    if (!newAccEmail.trim()) {
      showToast('بيانات مطلوبة', 'يرجى إدخال البريد الإلكتروني للحساب الجديد.', 'error');
      return;
    }

    if (!newAccPass.trim()) {
      showToast('بيانات مطلوبة', 'يرجى إدخال الرمز السري أو كلمة المرور للحساب الجديد.', 'error');
      return;
    }

    const cleanEmail = newAccEmail.trim().toLowerCase();
    if (storedUsers.some((u) => u.email.toLowerCase() === cleanEmail)) {
      showToast('حساب موجود', 'هذا البريد الإلكتروني مسجل مسبقاً في قائمة الحسابات المحفوظة.', 'error');
      return;
    }

    const name = newAccName.trim();
    const cardNum = generate10DigitCardNumber();

    const newAccount: StoredUserAccount = {
      id: `usr-${Date.now()}`,
      name,
      email: cleanEmail,
      pass: newAccPass.trim(),
      cardNumber: cardNum,
      balance: 0, // Starts at 0 IQD
      totalTransferred: 0,
      totalWithdrawnOrSpent: 0,
      totalCommission: 0,
      transfersCount: 0,
      purchasesCount: 0,
      joinedDate: '2026',
      lastActive: 'الآن',
      isAdFreeSubscriber: false,
      subscriptionTier: 'free',
      transactions: [],
      purchasedCodes: [],
    };

    const nextList = [newAccount, ...storedUsers].slice(0, 2);
    setStoredUsers(nextList);
    localStorage.setItem('corex_stored_users', JSON.stringify(nextList));

    setNewAccName('');
    setNewAccEmail('');
    setNewAccPass('');
    setIsAddAccountOpen(false);

    showToast(
      'تم إنشاء الحساب الثاني بنجاح 🎉',
      `تم تسجيل حساب (${name}) برقم بطاقة (${cardNum}) بالاسم والبريد والرمز بنجاح. يمكنك التبديل بين الحسابين بضغطة زر واحدة!`,
      'success'
    );
  };

  // Delete second account from switcher list to allow registering another one
  const handleDeleteStoredAccount = (id: string, email: string, name: string) => {
    if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      showToast('ممنوع الحذف', 'لا يمكن حذف حساب الإدارة والمطور.', 'error');
      return;
    }
    if (isLoggedIn && userData.email.toLowerCase() === email.toLowerCase()) {
      showToast('ممنوع الحذف', 'لا يمكنك حذف الحساب النشط حالياً. يرجى التبديل للحساب الآخر أولاً.', 'error');
      return;
    }
    setStoredUsers((prev) => {
      const filtered = prev.filter((u) => u.id !== id);
      localStorage.setItem('corex_stored_users', JSON.stringify(filtered));
      return filtered;
    });
    showToast('تم الحذف', `تم حذف حساب (${name}) من قائمة الحسابات المحفوظة. يمكنك الآن إنشاء حساب ثانٍ بديل.`, 'info');
  };

  // Update and save password/PIN for active account in Settings
  const handleChangePassword = () => {
    if (!changePassInput.trim()) {
      showToast('تنبيه', 'يرجى إدخال الرمز أو كلمة المرور الجديدة أولاً.', 'error');
      return;
    }
    const newPass = changePassInput.trim();
    setUserData((prev) => {
      const updated = { ...prev, pass: newPass };
      localStorage.setItem('corex_user', JSON.stringify(updated));
      return updated;
    });
    setStoredUsers((prev) => {
      const updated = prev.map((u) =>
        u.email.toLowerCase() === userData.email.toLowerCase() ? { ...u, pass: newPass } : u
      );
      localStorage.setItem('corex_stored_users', JSON.stringify(updated));
      return updated;
    });
    setChangePassInput('');
    showToast('تم تحديث الرمز', `تم حفظ وتثبيت كلمة المرور / الرمز الجديد للحساب (${userData.name}) بنجاح.`, 'success');
  };

  // Fast pre-fill helper for customer accounts
  const handleFastLogin = (email: string, pass: string) => {
    setLoginEmailInput(email);
    setLoginPassInput(pass);
    setAuthMode('login');
  };

  // Add Product (Strictly in IQD / د.ع)
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      showToast('صلاحية مرفوضة', 'عذراً، هذا الإجراء متاح فقط للإدارة المعتمدة.', 'error');
      return;
    }

    if (!prodName.trim() || !prodPrice) {
      showToast('تنبيه', 'يرجى إدخال اسم السلعة وسعرها بالدينار العراقي.', 'error');
      return;
    }

    const priceNum = parseInt(prodPrice, 10);
    if (isNaN(priceNum) || priceNum <= 0) {
      showToast('تنبيه', 'يرجى إدخال سعر صحيح بالدينار العراقي (د.ع).', 'error');
      return;
    }

    const defaultImg = prodImg.trim() || 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80';

    const newProd: Product = {
      id: Date.now(),
      name: prodName.trim(),
      price: priceNum,
      currency: 'د.ع',
      img: defaultImg,
      description: `بطاقة رقمية فورية - السعر ${priceNum.toLocaleString()} د.ع`,
      codePrefix: 'CARD-' + Math.floor(100 + Math.random() * 900),
    };

    setProducts([newProd, ...products]);
    setProdName('');
    setProdPrice('');
    setProdImg('');
    showToast('تمت الإضافة', `تمت إضافة (${newProd.name}) بسعر ${priceNum.toLocaleString()} د.ع إلى المتجر بنجاح!`, 'success');
  };

  // Delete Product
  const confirmDeleteProduct = () => {
    if (!isAdmin) {
      showToast('صلاحية مرفوضة', 'عذراً، الحذف متاح فقط للحساب الإداري.', 'error');
      return;
    }
    if (!productToDelete) return;
    setProducts(products.filter((p) => p.id !== productToDelete.id));
    showToast('تم الحذف', `تم حذف (${productToDelete.name}) من المتجر.`, 'info');
    setProductToDelete(null);
  };

  // Open Recharge Balance Modal (Strictly requires login or signup)
  const handleOpenRechargeModal = () => {
    if (!isLoggedIn || !userData.email) {
      showToast('تسجيل الدخول مطلوب', 'ممنوع تعبئة الرصيد إلا عن طريق تسجيل الدخول أو إنشاء حساب جديد!', 'error');
      setIsLoginModalOpen(true);
      return;
    }
    setIsRechargeModalOpen(true);
  };

  // Buy Product (Strictly in IQD)
  const handleBuyProduct = (product: Product) => {
    if (!isLoggedIn || !userData.email) {
      showToast('تسجيل الدخول مطلوب', 'ممنوع الشراء إلا عن طريق تسجيل الدخول أو إنشاء حساب جديد!', 'error');
      setIsLoginModalOpen(true);
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const isToday = (userData.lastPurchaseDate || '') === todayStr;
    const currentDailyCount = isToday ? (userData.dailyPurchaseCount || 0) : 0;

    // Daily Transaction Limit Guard:
    // Free Users: Restricted to a maximum of 5 purchase transactions per day (daily_purchase_count <= 5)
    // Plus Users: Unlimited purchase transactions per day (unconstrained)
    if (!userData.isAdFreeSubscriber && currentDailyCount >= 5) {
      showToast(
        'وصلت للحد الأقصى اليومي (5 مشتريات/يوم)',
        'الحسابات المجانية مقيدة بحد أقصى 5 معاملات شراء يومياً. يرجى الترقية إلى باقة بلس (Plus Subscription) للتمتع بعدد غير محدود من المعاملات يومياً!',
        'error'
      );
      setIsSubscriptionModalOpen(true);
      return;
    }

    const generatedCode = `${product.codePrefix || 'CX'}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const costInIQD = product.price;

    if (userData.balance >= costInIQD) {
      const nextCount = currentDailyCount + 1;
      setUserData((prev) => ({
        ...prev,
        balance: prev.balance - costInIQD,
        dailyPurchaseCount: nextCount,
        lastPurchaseDate: todayStr,
      }));

      const newPurchase: PurchasedItem = {
        id: 'purch-' + Date.now(),
        title: product.name,
        price: product.price,
        currency: 'د.ع',
        code: generatedCode,
        date: new Date().toLocaleDateString('ar-IQ') + ' ' + new Date().toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' }),
      };

      const newTx: Transaction = {
        id: 'tx-' + Date.now(),
        type: 'buy',
        title: `شراء: ${product.name}`,
        amount: -costInIQD,
        date: new Date().toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' }),
        status: 'completed',
        code: generatedCode,
      };

      setPurchases([newPurchase, ...purchases]);
      setTransactions([newTx, ...transactions]);

      setPurchasedModalItem({
        title: product.name,
        code: generatedCode,
        price: product.price,
        currency: 'د.ع',
      });

      // Update stored users registry (شكد سحبوا / اشتروا)
      setStoredUsers((prev) =>
        prev.map((u) => {
          if (u.email.toLowerCase() === userData.email.toLowerCase() || u.cardNumber === userData.cardNumber.toString()) {
            return {
              ...u,
              balance: Math.max(0, u.balance - costInIQD),
              totalWithdrawnOrSpent: u.totalWithdrawnOrSpent + costInIQD,
              purchasesCount: u.purchasesCount + 1,
              dailyPurchaseCount: nextCount,
              lastPurchaseDate: todayStr,
              lastActive: 'الآن (شراء بطاقة)',
            };
          }
          return u;
        })
      );

      // Add deduction notification
      addNotification(
        'تم استقطاع مبلغ للشراء 🛒',
        `تم استقطاع ${costInIQD.toLocaleString()} د.ع من حسابك لشراء كرت (${product.name}). الكود الرقمي جاهز في محفظتك. (${userData.isAdFreeSubscriber ? 'معاملات Plus غير محدودة' : `عملية ${nextCount} من 5 اليوم`})`,
        'deduction',
        userData.email
      );
    } else {
      showToast(
        'رصيد غير كافٍ',
        `سعر البطاقة ${costInIQD.toLocaleString()} د.ع بينما رصيدك الحالي ${userData.balance.toLocaleString()} د.ع. يرجى الانتظار لحين تفعيل بوابات الدفع قريباً.`,
        'error'
      );
      handleOpenRechargeModal();
    }
  };

  // Send Money (Uses "رقم بطاقتك" - 10 digits) & Tracks "شكد حولوا" and "العمولات"
  const handleProcessSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn || !userData.email) {
      showToast('تسجيل الدخول مطلوب', 'ممنوع إرسال الأموال إلا عن طريق تسجيل الدخول أو إنشاء حساب جديد!', 'error');
      setIsLoginModalOpen(true);
      return;
    }

    const recipient = sendRecipientCardNumber.trim();
    const amount = parseInt(sendAmountInput, 10);
    const commissionFee = Math.max(250, Math.round(amount * 0.02)); // 2% عمولة المتجر والإدارة

    if (!recipient) {
      showToast('خطأ', 'يرجى إدخال رقم بطاقة المستلم المكون من 10 أرقام.', 'error');
      return;
    }
    if (recipient === userData.cardNumber.toString()) {
      showToast('خطأ', 'لا يمكنك التحويل لنفس رقم بطاقتك!', 'error');
      return;
    }
    if (isNaN(amount) || amount < 1000 || amount > 50000) {
      showToast('المبلغ غير مسموح', 'المبلغ يجب أن يكون بين 1,000 و 50,000 د.ع.', 'error');
      return;
    }
    if (userData.balance < amount) {
      showToast('رصيد غير كافٍ', 'رصيدك الحالي غير كافٍ لإتمام عملية الإرسال (ليس لديك أموال كافية).', 'error');
      return;
    }

    setUserData((prev) => ({ ...prev, balance: prev.balance - amount }));
    const newTx: Transaction = {
      id: 'tx-' + Date.now(),
      type: 'send',
      title: `إرسال أموال لرقم البطاقة: ${recipient}`,
      amount: -amount,
      date: new Date().toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' }),
      status: 'completed',
      recipientCardNumber: recipient,
    };
    setTransactions([newTx, ...transactions]);

    // Update stored users registry and recipient's isolated transactions
    const recUser = storedUsers.find((u) => u.cardNumber === recipient);
    let updatedRecTx: Transaction[] | undefined;
    if (recUser) {
      const recTx: Transaction = {
        id: 'tx-rcv-' + Date.now(),
        type: 'receive',
        title: `استلام أموال من رقم البطاقة: ${userData.cardNumber}`,
        amount: amount,
        date: new Date().toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' }),
        status: 'completed',
        recipientCardNumber: userData.cardNumber.toString(),
      };
      const recExisting = loadUserTransactions(recUser.email, storedUsers);
      updatedRecTx = [recTx, ...recExisting];
      localStorage.setItem(getUserTransactionsKey(recUser.email), JSON.stringify(updatedRecTx));
    }

    setStoredUsers((prev) =>
      prev.map((u) => {
        if (u.email.toLowerCase() === userData.email.toLowerCase() || u.cardNumber === userData.cardNumber.toString()) {
          return {
            ...u,
            balance: Math.max(0, u.balance - amount),
            totalTransferred: u.totalTransferred + amount,
            totalCommission: u.totalCommission + commissionFee,
            transfersCount: u.transfersCount + 1,
            lastActive: 'الآن (تحويل أموال)',
          };
        }
        if (u.cardNumber === recipient) {
          return {
            ...u,
            balance: u.balance + amount,
            lastActive: 'الآن (استلام أموال)',
            transactions: updatedRecTx || u.transactions,
          };
        }
        return u;
      })
    );

    // Notifications for sender & recipient
    addNotification(
      'تم استقطاع وتحويل أموال 💸',
      `تم استقطاع ${amount.toLocaleString()} د.ع من رصيدك وتم تحويلها بنجاح إلى رقم البطاقة (${recipient}) (عمولة التحويل: ${commissionFee.toLocaleString()} د.ع).`,
      'transfer',
      userData.email
    );

    if (recUser) {
      addNotification(
        'تم استلام حوالة مالية 💰',
        `تمت إضافة +${amount.toLocaleString()} د.ع إلى حسابك محولة من رقم البطاقة (${userData.cardNumber}).`,
        'addition',
        recUser.email
      );
    }

    setIsSendModalOpen(false);
    setSendRecipientCardNumber('');
    setSendAmountInput('');
    showToast('تم التحويل', `تم إرسال ${amount.toLocaleString()} د.ع لرقم البطاقة (${recipient}) بنجاح (عمولة المتجر: ${commissionFee.toLocaleString()} د.ع).`, 'success');
  };

  // Recharge Balance Notice (Strictly through official payment gateways - Coming Soon!)
  const handleRedeemVoucher = () => {
    showToast(
      'تنبيه بوابات الدفع',
      'لا يمكن تعبئة الرصيد إلا عبر بوابات الدفع الإلكترونية الرسمية (زين كاش، آسيا حوالة، كي كارد، ماستركارد)، وهي قيد الربط وستتوفر قريباً جداً ⏳.',
      'info'
    );
  };

  // Admin Broadcast Message to Customers
  const handleSendAdminBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    const title = adminBroadcastTitle.trim() || 'رسالة هامة من الإدارة 📢';
    const body = adminBroadcastMsg.trim();
    if (!body) {
      showToast('خطأ', 'يرجى كتابة نص الرسالة أولاً.', 'error');
      return;
    }

    addNotification(title, body, 'admin_broadcast', adminBroadcastTarget);
    setAdminBroadcastTitle('');
    setAdminBroadcastMsg('');
    showToast('تم إرسال الإشعار للزبائن', 'تم بث الرسالة بنجاح وستظهر في مركز الإشعارات لدى الزبائن فوراً!', 'success');
  };

  // Admin Manual Top-up for a User Account
  const handleAdminTopUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin || !adminTopUpUser) return;
    const amt = parseInt(adminTopUpAmount, 10);
    if (isNaN(amt) || amt <= 0) {
      showToast('خطأ', 'يرجى إدخال مبلغ صحيح بالدينار العراقي.', 'error');
      return;
    }

    const rechargeTx: Transaction = {
      id: 'tx-topup-' + Date.now(),
      type: 'recharge',
      title: 'شحن رصيد من الإدارة (+)',
      amount: amt,
      date: new Date().toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' }),
      status: 'completed',
    };

    if (userData.email.toLowerCase() === adminTopUpUser.email.toLowerCase()) {
      setTransactions((prev) => [rechargeTx, ...prev]);
    } else {
      const uKey = getUserTransactionsKey(adminTopUpUser.email);
      const existing = loadUserTransactions(adminTopUpUser.email, storedUsers);
      const updatedTx = [rechargeTx, ...existing];
      localStorage.setItem(uKey, JSON.stringify(updatedTx));
    }

    setStoredUsers((prev) =>
      prev.map((u) => {
        if (u.id === adminTopUpUser.id) {
          const userExistingTx = loadUserTransactions(u.email, prev);
          return {
            ...u,
            balance: u.balance + amt,
            lastActive: 'الآن (شحن إداري)',
            transactions: [rechargeTx, ...userExistingTx],
          };
        }
        return u;
      })
    );

    // If current logged in user is this user, update active balance
    if (userData.email.toLowerCase() === adminTopUpUser.email.toLowerCase()) {
      setUserData((prev) => ({ ...prev, balance: prev.balance + amt }));
    }

    // Add addition notification for the recipient user
    addNotification(
      'تمت إضافة رصيد إلى حسابك 🎁',
      `تمت إضافة +${amt.toLocaleString()} د.ع إلى رصيد بطاقتك (${adminTopUpUser.cardNumber}) من قبل إدارة المتجر.`,
      'addition',
      adminTopUpUser.email
    );

    showToast('تم الشحن الإداري', `تم إضافة +${amt.toLocaleString()} د.ع لحساب (${adminTopUpUser.name}) بنجاح!`, 'success');
    setAdminTopUpUser(null);
    setAdminTopUpAmount('');
  };

  // Admin delete a user account from registry
  const handleAdminDeleteUser = (id: string, name: string) => {
    if (!isAdmin) return;
    setStoredUsers((prev) => prev.filter((u) => u.id !== id));
    showToast('تم الحذف', `تم حذف حساب (${name}) من قاعدة البيانات.`, 'info');
  };

  // Copy helper
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast('تم النسخ', `تم نسخ ${label} بنجاح: ${text}`, 'info');
  };

  // Delete or Resolve Ticket
  const handleDeleteTicket = (id: number | string) => {
    setTickets(tickets.filter((t) => t.id !== id));
    showToast('تمت العملية', 'تم إزالة بلاغ الصيانة بنجاح.', 'info');
  };

  // Direct handlers for DesktopAdminDashboard
  const handleDirectTopUp = (user: StoredUserAccount, amount: number) => {
    const rechargeTx: Transaction = {
      id: 'tx-topup-' + Date.now(),
      type: 'recharge',
      title: 'شحن رصيد من الإدارة (+)',
      amount: amount,
      date: new Date().toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' }),
      status: 'completed',
    };

    if (userData.email.toLowerCase() === user.email.toLowerCase()) {
      setTransactions((prev) => [rechargeTx, ...prev]);
    } else {
      const uKey = getUserTransactionsKey(user.email);
      const existing = loadUserTransactions(user.email, storedUsers);
      const updatedTx = [rechargeTx, ...existing];
      localStorage.setItem(uKey, JSON.stringify(updatedTx));
    }

    setStoredUsers((prev) =>
      prev.map((u) => {
        if (u.id === user.id) {
          const userExistingTx = loadUserTransactions(u.email, prev);
          return {
            ...u,
            balance: u.balance + amount,
            transactions: [rechargeTx, ...userExistingTx],
          };
        }
        return u;
      })
    );
    if (userData.email.toLowerCase() === user.email.toLowerCase()) {
      setUserData((prev) => ({ ...prev, balance: prev.balance + amount }));
    }
    addNotification(
      'شحن رصيد من الإدارة 🎁',
      `تم شحن حسابك بمبلغ +${amount.toLocaleString()} د.ع من قبل إدارة المتجر.`,
      'addition',
      user.email
    );
    showToast('تم الشحن الإداري', `تم إضافة +${amount.toLocaleString()} د.ع لحساب (${user.name}) بنجاح!`, 'success');
  };

  const handleDirectAddProduct = (name: string, price: number, img: string) => {
    const newProd: Product = {
      id: Date.now(),
      name,
      price,
      currency: 'د.ع',
      img: img || 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80',
      description: `بطاقة رقمية فورية - السعر ${price.toLocaleString()} د.ع`,
      codePrefix: 'CARD-' + Math.floor(100 + Math.random() * 900),
    };
    setProducts((prev) => [newProd, ...prev]);
    showToast('تمت الإضافة', `تمت إضافة (${name}) بسعر ${price.toLocaleString()} د.ع إلى المتجر بنجاح!`, 'success');
  };

  const handleDirectSendBroadcast = (title: string, message: string, target: string) => {
    addNotification(title, message, 'admin_broadcast', target);
    showToast('تم إرسال الإشعار للزبائن', 'تم بث الرسالة بنجاح وستظهر في مركز الإشعارات لدى الزبائن فوراً!', 'success');
  };

  // Developer capability: Edit card name of any user ("واجعل حساب المطور يكدر يغير اسم بطاقت اي شخص")
  const handleUpdateUserName = (userId: string, newName: string) => {
    if (!isAdmin) {
      showToast('خطأ في الصلاحيات', 'يمنع تعديل اسم البطاقة إلا لحساب المطور المعتمد!', 'error');
      return;
    }
    const cleanName = newName.trim();
    if (!cleanName) return;

    let targetCardNum = '';
    let targetEmail = '';

    setStoredUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          targetCardNum = u.cardNumber;
          targetEmail = u.email;
          return {
            ...u,
            name: cleanName,
            lastActive: 'تم تعديل اسم البطاقة بواسطة المطور',
          };
        }
        return u;
      })
    );

    // If currently active user matches target user, sync name
    if (userData.email && targetEmail && userData.email.toLowerCase() === targetEmail.toLowerCase()) {
      setUserData((prev) => ({ ...prev, name: cleanName }));
    }

    addNotification(
      'تحديث اسم البطاقة 💳',
      `تم تحديث وتعديل اسم صاحب البطاقة رقم (${targetCardNum}) إلى: "${cleanName}" بنجاح بواسطة المطور.`,
      'addition',
      targetEmail
    );

    showToast('تم تعديل اسم البطاقة', `تم تغيير اسم صاحب البطاقة إلى (${cleanName}) بنجاح!`, 'success');
  };

  // Toggle chat window
  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);
  };

  // ========================================================
  // ARABIC AI CHAT ENGINE - 100% EXCLUSIVELY IRAQI DINARS (د.ع)
  // ========================================================
  const handleSendChatMsg = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = chatInput.trim();
    if (!text) return;

    setChatInput('');

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text,
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsAiLoading(true);

    setTimeout(() => {
      const q = text.toLowerCase();
      let replyText = '';
      let isTicket = false;

      // 1. Issue / Technical problem
      const isProblem =
        q.includes('مشكلة') ||
        q.includes('خطأ') ||
        q.includes('لا يعمل') ||
        q.includes('صيانة') ||
        q.includes('عطل') ||
        q.includes('كود لم يصل') ||
        q.includes('فشل') ||
        q.includes('ما يشتغل') ||
        q.includes('ما وصلني') ||
        q.includes('ما استلمت');

      if (isProblem) {
        replyText = 'لقد سجلت بلاغك بخصوص المشكلة. يرجى تأكيد بريدك الإلكتروني في الحقل أدناه لإرسال تذكرة الصيانة مباشرة إلى حساب الإدارة:';
        isTicket = true;
      }
      // 2. Ethical Ads & Sponsorships questions ("اعلانات", "رعاية", "اعلانات لطيفة")
      else if (
        q.includes('اعلان') ||
        q.includes('إعلان') ||
        q.includes('اعلانات') ||
        q.includes('إعلانات') ||
        q.includes('رعاية') ||
        q.includes('رعايات') ||
        q.includes('اخلاق') ||
        q.includes('أخلاق') ||
        q.includes('لطيف')
      ) {
        replyText = `جميع الإعلانات والرعايات المعروضة في متجر coreX هي إعلانات هادفة ولطيفة وأخلاقية 100% 🌿 (تعليم، مبادرات وطنية، أعمال خيرية، ثقافة وصحة).\n\nنحن نحظر تماماً أي إعلانات قمار أو مراهنات أو محتوى خادش. هذه الإعلانات تظهر للزوار برفق لدعم استمرار خدمات المتجر وتطويره بالدينار العراقي (د.ع).`;
      }
      // 3. Management & Security questions
      else if (q.includes('ادارة') || q.includes('إدارة') || q.includes('مدير') || q.includes('ادمن') || q.includes('admin') || q.includes('jafar')) {
        replyText = 'فريق إدارة ودعم متجر coreX يعمل على مدار الساعة لخدمتكم وضمان أمان جميع العمليات والبطاقات بالدينار العراقي (د.ع). لأي مساعدة، يمكنك كتابة استفسارك هنا مباشرة.';
      }
      // 3. Card Number questions ("رقم بطاقتك")
      else if (q.includes('رقم بطاقت') || q.includes('رقم البطاقة') || q.includes('ايدي') || q.includes('معرف')) {
        replyText = `في متجر coreX التعامل الرسمي هو بـ "رقم بطاقتك". رقم بطاقتك الحالي هو: (${userData.cardNumber}) ويظهر دائماً مع اسمك في البطاقة والمحفظة.`;
      }
      // 4. Currency questions
      else if (q.includes('عملة') || q.includes('عملتكم') || q.includes('دينار') || q.includes('دولار')) {
        replyText = 'جميع المعاملات والأسعار في متجر coreX هي بالدينار العراقي (د.ع) فقط حصراً! لا نستخدم أي عملة أخرى.';
      }
      // 5. Greetings
      else if (
        q.includes('مرحبا') ||
        q.includes('سلام') ||
        q.includes('أهلا') ||
        q.includes('أهلاً') ||
        q.includes('هلا') ||
        q.includes('شلونك') ||
        q.includes('صباح') ||
        q.includes('مساء') ||
        q === 'hi' ||
        q === 'hello'
      ) {
        replyText = `أهلاً وسهلاً بك يا ${userData.name}! ${isAdmin ? 'أنت مسجل حالياً كمدير المتجر بالحساب الإداري.' : ''} العملة الرسمية للمتجر هي الدينار العراقي (د.ع). كيف يمكنني مساعدتك اليوم؟`;
      }
      // 6. Products List & Prices
      else if (
        q.includes('بطاق') ||
        q.includes('كروت') ||
        q.includes('سلع') ||
        q.includes('منتجات') ||
        q.includes('شنو عندك') ||
        q.includes('ماذا تبيع')
      ) {
        const listStr = products
          .slice(0, 7)
          .map((p) => `• ${p.name}: ${p.price.toLocaleString()} د.ع`)
          .join('\n');
        replyText = `السلع والبطاقات المتوفرة بالدينار العراقي (د.ع) فقط:\n${listStr}\n\nيمكنك اختيار أي بطاقة والضغط على زر "شراء" لتوليد كود التفعيل فورياً!`;
      }
      // 7. Wallet & Balance & Recharge
      else if (
        q.includes('رصيد') ||
        q.includes('محفظ') ||
        q.includes('شحن') ||
        q.includes('تعبئ') ||
        q.includes('فلوس') ||
        q.includes('بواب')
      ) {
        replyText = `رصيد محفظتك الحالي هو: ${userData.balance.toLocaleString()} د.ع.\nورقم بطاقتك هو: (${userData.cardNumber}).\nتنبيه هام: يبدأ أي حساب عميل جديد برصيد 0 د.ع (ليس لديك أموال). لا يمكن لأي شخص تعبئة بطاقته إلا عبر بوابات الدفع الإلكترونية الرسمية، وبوابات الدفع غير متوفرة حالياً وستتوفر قريباً جداً ⏳.`;
      }
      // 8. Money Transfer
      else if (
        q.includes('تحويل') ||
        q.includes('ارسال') ||
        q.includes('إرسال') ||
        q.includes('ادز') ||
        q.includes('احول')
      ) {
        replyText = 'يمكنك إرسال الأموال بالدينار العراقي لأي مستخدم بإدخال "رقم بطاقة المستلم" والمبلغ (من 1,000 إلى 50,000 د.ع) وسيتم التحويل فوراً بدون رسوم.';
      } else {
        replyText = `أهلاً بك! في متجر coreX جميع التعاملات بالدينار العراقي (د.ع) فقط، ورقم بطاقتك هو (${userData.cardNumber}). يمكنك الاستفسار عن أي سلعة أو شحن الرصيد أو كتابة "مشكلة" لرفع بلاغ صيانة للإدارة.`;
      }

      setIsAiLoading(false);

      const aiMsg: ChatMessage = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        text: replyText,
        isTicketPrompt: isTicket,
        issueDraft: isTicket ? text : undefined,
      };

      setChatMessages((prev) => [...prev, aiMsg]);
      if (isTicket) {
        setTicketEmailInput(userData.email || '');
      }
    }, 250);
  };

  // Submit in-chat support ticket
  const handleSubmitTicket = (issue: string) => {
    const emailToUse = ticketEmailInput.trim() || userData.email || 'customer@corex-store.iq';
    const newTicket: SupportTicket = {
      id: Date.now(),
      email: emailToUse,
      issue,
      date: new Date().toLocaleString('ar-IQ'),
      status: 'pending',
    };

    setTickets((prev) => [newTicket, ...prev]);

    const confirmMsg: ChatMessage = {
      id: 'ai-confirm-' + Date.now(),
      sender: 'ai',
      text: `تم رفع إشعار وتذكرة صيانة لفريق الإدارة والدعم بنجاح. سيتم إرسال رسالة إلى بريدك الإلكتروني (${emailToUse}) فور معالجة المشكلة.`,
    };

    setChatMessages((prev) => [...prev, confirmMsg]);
    showToast('تم رفع البلاغ للإدارة', `تم تسجيل تذكرة الصيانة بنجاح للبريد ${emailToUse}`, 'success');
  };

  const filteredProducts = products.filter((p) => {
    if (selectedCategory === 'all') return true;
    return p.category === selectedCategory;
  });

  return (
    <div className={`min-h-screen ${appTheme === 'charcoal' ? 'theme-charcoal bg-[#09090b]' : 'theme-midnight bg-[#0f172a]'} text-[#f8fafc] p-3 sm:p-6 pb-24 flex flex-col font-sans select-none relative transition-colors duration-200`}>
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[2500] w-[90%] max-w-md animate-in slide-in-from-top-4 duration-200">
          <div
            className={`p-4 rounded-xl shadow-2xl backdrop-blur-md flex items-start gap-3 border text-right ${
              toast.type === 'error'
                ? 'bg-red-950/95 border-red-500/50 text-red-200'
                : toast.type === 'success'
                ? 'bg-emerald-950/95 border-emerald-500/50 text-emerald-200'
                : 'bg-indigo-950/95 border-indigo-500/50 text-indigo-200'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {toast.type === 'error' ? (
                <AlertCircle className="w-5 h-5 text-red-400" />
              ) : toast.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <Info className="w-5 h-5 text-indigo-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm text-white">{toast.title}</div>
              <div className="text-xs mt-0.5 opacity-90">{toast.message}</div>
            </div>
            <button onClick={() => setToast(null)} className="opacity-70 hover:opacity-100 p-0.5">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className={activeTab === "admin" && isAdmin ? "w-full max-w-7xl mx-auto flex-1 flex flex-col" : "w-full max-w-md mx-auto min-h-screen bg-[#0f172a] sm:border-x sm:border-[#334155]/60 flex flex-col pb-24 relative shadow-2xl"}>
        {/* HEADER (MOBILE STORE ONLY) */}
        {activeTab !== 'admin' && (
          <header className="flex flex-wrap justify-between items-center gap-2 p-3 sm:p-4 bg-[#1e293b] border border-[#334155] rounded-2xl mb-4 shadow-lg sticky top-0 z-30 backdrop-blur-md bg-[#1e293b]/95">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#4f46e5] to-[#00e5ff] flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-white m-0">
                  متجر coreX الرقمي
                </h1>
                <p className="text-[10px] text-emerald-400 font-mono mt-0.5">
                  تطبيق الهاتف • بالدينار العراقي (د.ع)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Quick Admin Desktop Toggle */}
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => setActiveTab('admin')}
                  className="px-2.5 py-1.5 rounded-xl bg-purple-600/90 hover:bg-purple-600 text-white font-bold text-xs flex items-center gap-1.5 transition shadow active:scale-95 cursor-pointer border border-purple-400/40"
                  title="التبديل إلى لوحة تحكم الكمبيوتر المخصصة للديسكتوب"
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>التحكم (ديسكتوب) 🖥️</span>
                </button>
              )}

              {/* VIP Ad-Free Subscription Button */}
              <button
                type="button"
                onClick={() => setIsSubscriptionModalOpen(true)}
                className={`px-2.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition shadow active:scale-95 cursor-pointer ${
                  userData.isAdFreeSubscriber
                    ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40'
                    : 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-black hover:brightness-105 shadow-amber-500/20'
                }`}
                title="اشتراك باقة إلغاء الإعلانات: الشهر بـ 2,000 د.ع أو السنة بـ 15,000 د.ع"
              >
                <Crown
                  className={`w-3.5 h-3.5 ${
                    userData.isAdFreeSubscriber
                      ? 'fill-amber-400 text-amber-400'
                      : 'fill-black text-black'
                  }`}
                />
                <span>{userData.isAdFreeSubscriber ? 'VIP بدون إعلانات 👑' : 'إلغاء الإعلانات ⭐'}</span>
              </button>

              {/* Notifications Button */}
              <button
                type="button"
                onClick={() => setIsNotificationsOpen(true)}
                className="relative p-2 rounded-xl bg-[#0f172a] hover:bg-[#1a2436] border border-[#334155] text-[#94a3b8] hover:text-white transition"
                title="مركز الإشعارات والعمليات"
              >
                <Bell className="w-4 h-4 text-amber-400" />
                {notifications.filter((n) => !n.isRead && (n.targetEmail === 'all' || n.targetEmail === userData.email)).length > 0 && (
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-red-500 text-white font-mono text-[9px] font-bold animate-pulse">
                    {notifications.filter((n) => !n.isRead && (n.targetEmail === 'all' || n.targetEmail === userData.email)).length}
                  </span>
                )}
              </button>

              {/* Authentication */}
              {!isLoggedIn ? (
                <button
                  className="btn bg-[#4f46e5] hover:bg-[#4338ca] text-white text-xs font-bold px-3 py-1.5 rounded-xl border-none cursor-pointer transition shadow-md shadow-indigo-600/20 active:scale-95 flex items-center gap-1"
                  id="login-btn"
                  onClick={() => {
                    setAuthMode('login');
                    setIsLoginModalOpen(true);
                  }}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>دخول</span>
                </button>
              ) : (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setActiveTab('settings')}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] border border-[#334155] text-xs transition cursor-pointer"
                    title="فتح قسم الإعدادات والتحكم بالحساب"
                  >
                    <span className={`w-2 h-2 rounded-full ${isAdmin ? 'bg-purple-400 animate-pulse' : 'bg-emerald-400'}`}></span>
                    <span className="font-bold text-white max-w-[90px] truncate text-[11px]">
                      {isAdmin ? 'المطور (جعفر)' : userData.name}
                    </span>
                    <Settings className="w-3 h-3 text-[#94a3b8]" />
                  </button>
                  <button
                    className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-400 transition cursor-pointer"
                    id="logout-btn"
                    onClick={handleLogout}
                    title="تسجيل الخروج من الحساب"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </header>
        )}

        {/* TAB: DESKTOP ADMIN CONTROL PANEL (لوحة التحكم غير مخصصة للهاتف / للكمبيوتر فقط) */}
        {activeTab === 'admin' && isAdmin && (
          <div className="w-full max-w-7xl mx-auto py-2 animate-in fade-in duration-200">
            <DesktopAdminDashboard
              storedUsers={storedUsers}
              products={products}
              tickets={tickets}
              notifications={notifications}
              ethicalAds={ethicalAds}
              adStats={adStats}
              adsenseSettings={adsenseSettings}
              onUpdateAdSenseSettings={(newSettings) => {
                setAdSenseSettings(newSettings);
                showToast('Google AdSense', 'تم تحديث إعدادات وربط إعلانات Google AdSense بنجاح!', 'success');
              }}
              onAddProduct={handleDirectAddProduct}
              onDeleteProduct={(p) => setProductToDelete(p)}
              onSendBroadcast={handleDirectSendBroadcast}
              onAdminTopUp={handleDirectTopUp}
              onAdminDeleteUser={handleAdminDeleteUser}
              onDeleteTicket={handleDeleteTicket}
              onAddAd={(newAd) => {
                setEthicalAds((prev) => [newAd, ...prev]);
                showToast('تمت إضافة الراعي', `تمت إضافة الراعي (${newAd.sponsorName}) بنجاح!`, 'success');
              }}
              onToggleAd={(id) => {
                setEthicalAds((prev) =>
                  prev.map((a) => (a.id === id ? { ...a, isActive: !a.isActive } : a))
                );
                showToast('تم التحديث', 'تم تغيير حالة ظهور الإعلان بنجاح.', 'info');
              }}
              onDeleteAd={(id) => {
                setEthicalAds((prev) => prev.filter((a) => a.id !== id));
                showToast('تم الحذف', 'تم حذف الإعلان من النظام بنجاح.', 'info');
              }}
              onWithdrawProfitsToAdminWallet={handleWithdrawProfitsToAdminWallet}
              onSwitchToMobilePreview={() => setActiveTab('store')}
              onOpenPlusArchitecture={() => setIsArchitectureModalOpen(true)}
              onUpdateUserName={handleUpdateUserName}
              onAdminSetSubscription={handleAdminSetSubscription}
              onLogout={handleLogout}
            />
          </div>
        )}

        {/* TAB 1: STORE VIEW */}
        {activeTab === 'store' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Real Official Google AdSense Header Banner Unit (Only when explicitly enabled by owner and user not ad-free) */}
            {adsenseSettings.isAdsEnabled && !userData.isAdFreeSubscriber && (
              <div className="w-full">
                <GoogleAdSenseUnit
                  slotType="header_banner"
                  settings={adsenseSettings}
                  onAdImpression={handleAdSenseImpression}
                  onAdClick={handleAdSenseClick}
                />
              </div>
            )}

            {/* VIP Ad-Free Active Banner (only shown if user is actually subscribed) */}
            {userData.isAdFreeSubscriber && (
              <div className="w-full rounded-2xl bg-gradient-to-r from-amber-950/40 via-[#1e293b] to-yellow-950/30 border border-amber-500/40 p-3 shadow-md flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                    <Crown className="w-4 h-4 fill-amber-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-white">
                      <span>حساب VIP نشط: تم حجب كافة الإعلانات بالكامل</span>
                      <span className="text-[9px] bg-amber-400 text-black px-1.5 py-0.5 rounded-full font-bold">
                        {userData.subscriptionPlan === 'yearly' ? 'سنوي' : 'شهري'} ✓
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-300 mt-0.5">
                      تصفح نقي وسلس بدون أي إعلانات • ينتهي: <span className="font-mono text-amber-300 font-bold">{userData.subscriptionExpiry || '2027'}</span>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsSubscriptionModalOpen(true)}
                  className="px-2.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-[11px] border border-amber-500/40 transition shrink-0 cursor-pointer"
                >
                  إدارة الاشتراك
                </button>
              </div>
            )}

            {/* Guest Mandatory Login/Signup Notice for Purchasing & Recharging */}
            {!isLoggedIn && (
              <div className="w-full rounded-2xl bg-gradient-to-r from-indigo-950/70 via-[#1e293b] to-blue-950/60 border-2 border-indigo-500/50 p-4 shadow-xl flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shrink-0 shadow">
                    <LogIn className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 font-bold text-white text-sm">
                      <span>تنبيه نظام المتجر: تسجيل الدخول إلزامي للشراء والشحن</span>
                      <span className="text-[10px] bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full border border-red-500/30 font-bold">
                        ممنوع الشراء كزائر
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                      وفقاً لقوانين المتجر، يمنع منعاً باتاً شراء أي كرت أو تعبئة رصيدك إلا عن طريق تسجيل الدخول أو إنشاء حساب جديد لربط الرصيد والبطاقة بهويتك.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login');
                      setIsLoginModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition shadow active:scale-95 cursor-pointer flex items-center gap-1.5"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>تسجيل الدخول</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('register');
                      setIsLoginModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#334155] hover:bg-[#475569] text-white font-bold text-xs transition border border-slate-600 active:scale-95 cursor-pointer"
                  >
                    إنشاء حساب جديد
                  </button>
                </div>
              </div>
            )}

            {/* MAIN PRODUCTS VIEW */}
            <main>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">السلع المتاحة</h2>
                  <p className="text-xs text-[#94a3b8] mt-0.5">
                    الأسعار جميعها بالدينار العراقي (د.ع) مع تسليم فوري لكود الكرت
                  </p>
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-3 py-1.5 rounded-lg font-medium transition ${
                      selectedCategory === 'all'
                        ? 'bg-[#4f46e5] text-white'
                        : 'bg-[#1e293b] text-[#94a3b8] hover:text-white'
                    }`}
                  >
                    الكل ({products.length})
                  </button>
                  <button
                    onClick={() => setSelectedCategory('banking')}
                    className={`px-3 py-1.5 rounded-lg font-medium transition ${
                      selectedCategory === 'banking'
                        ? 'bg-[#4f46e5] text-white'
                        : 'bg-[#1e293b] text-[#94a3b8] hover:text-white'
                    }`}
                  >
                    بطاقات بنكية
                  </button>
                  <button
                    onClick={() => setSelectedCategory('gaming')}
                    className={`px-3 py-1.5 rounded-lg font-medium transition ${
                      selectedCategory === 'gaming'
                        ? 'bg-[#4f46e5] text-white'
                        : 'bg-[#1e293b] text-[#94a3b8] hover:text-white'
                    }`}
                  >
                    ألعاب وشدات
                  </button>
                  <button
                    onClick={() => setSelectedCategory('telecom')}
                    className={`px-3 py-1.5 rounded-lg font-medium transition ${
                      selectedCategory === 'telecom'
                        ? 'bg-[#4f46e5] text-white'
                        : 'bg-[#1e293b] text-[#94a3b8] hover:text-white'
                    }`}
                  >
                    رصيد واتصالات
                  </button>
                </div>
              </div>

              {/* PRODUCTS GRID (#products-container / .products-grid) */}
              <div
                className="products-grid grid grid-cols-2 gap-2.5"
                id="products-container"
                style={{ marginTop: '15px' }}
              >
                {filteredProducts.map((p, pIdx) => (
                  <React.Fragment key={p.id}>
                    {/* Real Official Google AdSense In-Feed Ad Unit (Only if enabled by owner and user not ad-free) */}
                    {pIdx === 2 && adsenseSettings.isAdsEnabled && !userData.isAdFreeSubscriber && (
                      <div className="col-span-2 my-1">
                        <GoogleAdSenseUnit
                          slotType="infeed_card"
                          settings={adsenseSettings}
                          onAdImpression={handleAdSenseImpression}
                          onAdClick={handleAdSenseClick}
                        />
                      </div>
                    )}
                  <div
                    key={p.id}
                    className="product-card bg-[#1e293b] border border-[#334155] rounded-xl p-4 flex flex-col justify-between shadow-md hover:border-indigo-500/50 transition group"
                  >
                    <div>
                      <img
                        src={p.img}
                        alt={p.name}
                        className="w-full h-32 object-cover rounded-lg mb-2.5 bg-[#0f172a]"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80';
                        }}
                      />
                      <div className="font-bold text-sm text-white line-clamp-1">
                        <strong>{p.name}</strong>
                      </div>
                      <div className="text-[11px] text-[#94a3b8] mt-1 line-clamp-2">
                        {p.description || 'كود شحن فوري مع تسليم مباشر'}
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-[#334155]">
                      <div
                        style={{ color: 'var(--success)', margin: '5px 0' }}
                        className="font-bold font-mono text-base text-[#10b981]"
                      >
                        {p.price.toLocaleString()} د.ع
                      </div>

                      {isAdmin ? (
                        <button
                          type="button"
                          className="btn btn-danger w-full bg-[#ef4444] hover:bg-[#dc2626] text-white py-2 rounded-lg text-xs font-bold transition cursor-pointer"
                          onClick={() => setProductToDelete(p)}
                        >
                          حذف
                        </button>
                      ) : (
                        <button
                          type="button"
                          className={`btn w-full py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                            isLoggedIn
                              ? 'bg-[#4f46e5] hover:bg-[#4338ca] text-white shadow-md active:scale-95'
                              : 'bg-indigo-950/70 hover:bg-indigo-900 text-indigo-300 border border-indigo-500/40'
                          }`}
                          style={{ width: '100%' }}
                          onClick={() => handleBuyProduct(p)}
                        >
                          {isLoggedIn ? (
                            <>
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>شراء</span>
                            </>
                          ) : (
                            <>
                              <LogIn className="w-3.5 h-3.5" />
                              <span>شراء (سجل الدخول)</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                  </React.Fragment>
                ))}
              </div>
            </main>
          </div>
        )}

        {/* TAB 2: WALLET VIEW (STRICTLY IQD & "رقم بطاقتك") */}
        {activeTab === 'wallet' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* PROMINENT WELCOME MESSAGE & REGISTRATION GUIDE FOR UNREGISTERED VISITORS */}
            {!isLoggedIn && (
              <div className="bg-gradient-to-br from-[#1e1b4b] via-[#1e293b] to-[#0f172a] border-2 border-indigo-500/70 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden text-right space-y-5 animate-in fade-in slide-in-from-top-4 duration-300">
                {/* Background ambient light */}
                <div className="absolute -top-24 -left-24 w-60 h-60 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

                {/* Banner Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
                  <div className="flex items-center gap-3.5">
                    <div className="w-13 h-13 rounded-2xl bg-indigo-600/30 border border-indigo-400/50 flex items-center justify-center text-indigo-300 shadow-lg shadow-indigo-600/20">
                      <Sparkles className="w-7 h-7 text-amber-300 animate-pulse" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                          مرحباً بك في المحفظة المالية الرقمية
                        </span>
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-full font-bold">
                          دليل الزائر الجديد ✨
                        </span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                        كيف تبدأ باستخدام الدينار العراقي (د.ع) والحصول على رقم بطاقتك؟
                      </h2>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('register');
                        setIsLoginModalOpen(true);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 active:scale-95 transition cursor-pointer"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>إنشاء حساب جديد مجاناً</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('login');
                        setIsLoginModalOpen(true);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 font-bold text-xs transition cursor-pointer"
                    >
                      تسجيل الدخول
                    </button>
                  </div>
                </div>

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-3xl relative z-10">
                  أهلاً بك زائرنا العزيز! لتتمكن من استخدام العملة العراقية <strong className="text-white">(د.ع)</strong> وإرسال واستلام الأموال وشحن الرصيد والتسوق الفوري، تحتاج إلى حساب خاص يصدر معه <strong className="text-amber-300">رقم بطاقتك الرقمية الرسمية المكون من 10 أرقام</strong> تلقائياً وفورياً. اتبع الخطوات البسيطة التالية:
                </p>

                {/* 3 Clear Step Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 relative z-10">
                  <div className="p-4 rounded-2xl bg-[#0f172a]/90 border border-indigo-500/40 hover:border-indigo-400/60 transition space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-300 font-bold font-mono text-xs flex items-center justify-center border border-indigo-400/30">
                        1
                      </span>
                      <UserPlus className="w-4 h-4 text-indigo-400" />
                    </div>
                    <h4 className="font-bold text-white text-xs">الخطوة الأولى: فتح نافذة التسجيل</h4>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      انقر على زر <strong className="text-indigo-300">"إنشاء حساب جديد"</strong> بالأعلى أو من رأس الموقع لفتح استمارة التسجيل.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#0f172a]/90 border border-indigo-500/40 hover:border-indigo-400/60 transition space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-300 font-bold font-mono text-xs flex items-center justify-center border border-indigo-400/30">
                        2
                      </span>
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    </div>
                    <h4 className="font-bold text-white text-xs">الخطوة الثانية: إدخال بياناتك الأساسية</h4>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      أدخل اسمك الكريم، بريدك الإلكتروني، وكلمة المرور الخاصة بك لتأمين حسابك ومحفظتك (يستغرق أقل من دقيقة).
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-gradient-to-b from-[#0f172a]/90 to-amber-950/30 border border-amber-500/40 space-y-2 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-300 font-bold font-mono text-xs flex items-center justify-center border border-amber-400/40">
                        3
                      </span>
                      <CreditCard className="w-4 h-4 text-amber-400" />
                    </div>
                    <h4 className="font-bold text-amber-200 text-xs">الخطوة الثالثة: استلام بطاقتك والعملة (د.ع)</h4>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      فور إتمام التسجيل، يتم إصدار <strong className="text-amber-300">رقم بطاقتك الرقمية (10 أرقام)</strong> ورصيدك الافتتاحي بالدينار العراقي (د.ع) لتستمتع بكافة خدمات المنصة!
                    </p>
                  </div>
                </div>

                {/* Footer Note */}
                <div className="p-3.5 rounded-2xl bg-indigo-950/60 border border-indigo-500/40 flex flex-wrap items-center justify-between gap-3 text-xs relative z-10">
                  <div className="flex items-center gap-2 text-slate-300">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>
                      لديك حساب سابق؟ سجّل دخولك مباشرة لاستعادة رقم بطاقتك ورصيدك المحفوظ.
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login');
                      setIsLoginModalOpen(true);
                    }}
                    className="text-indigo-300 hover:text-white font-bold underline cursor-pointer text-xs"
                  >
                    الانتقال لتسجيل الدخول ←
                  </button>
                </div>
              </div>
            )}

            {/* PROMINENT LOW-BALANCE WARNING ALERT (< 1,000 IQD / د.ع) */}
            {/* "إظهار تنبيه مرئي (Toast) أو أيقونة تحذير عند انخفاض الرصيد عن ١٠٠٠ د.ع، لتذكير المستخدم بضرورة تعبئة الرصيد" */}
            {isLoggedIn && userData.balance < 1000 && (
              <div className="rounded-2xl p-4 sm:p-5 bg-gradient-to-r from-red-950/70 via-amber-950/60 to-orange-950/70 border-2 border-amber-500/80 shadow-2xl flex flex-wrap items-center justify-between gap-4 text-right animate-in fade-in slide-in-from-top-3 duration-300">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/25 border-2 border-amber-500/50 flex items-center justify-center text-amber-400 shrink-0 shadow-lg shadow-amber-500/20 animate-pulse">
                    <AlertTriangle className="w-7 h-7 text-amber-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                        تنبيه أمان المحفظة
                      </span>
                      <span className="text-[10px] bg-red-500/30 text-red-200 border border-red-500/50 px-2.5 py-0.5 rounded-full font-bold font-mono animate-pulse">
                        الرصيد أقل من 1,000 د.ع ⚠️
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-white mt-1">
                      رصيدك الحالي منخفض: <span className="text-amber-400 font-mono font-bold">{userData.balance.toLocaleString()} د.ع</span> فقط
                    </h3>
                    <p className="text-xs text-amber-200/90 mt-1 max-w-xl leading-relaxed">
                      نود تذكيرك بأن رصيدك الحالي أقل من 1,000 د.ع. يُرجى تعبئة وتغذية رصيد المحفظة لتتمكن من شراء البطاقات الرقمية، تحويل الأموال، وإتمام عملياتك بسلاسة وبدون توقف.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 mr-auto">
                  <button
                    type="button"
                    onClick={handleOpenRechargeModal}
                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-xl shadow-amber-500/30 transition active:scale-95 cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4 stroke-[3]" />
                    <span>تعبئة الرصيد الآن 💳</span>
                  </button>
                </div>
              </div>
            )}

            <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6 shadow-xl relative overflow-hidden">
              {/* Unregistered Visitor Notice Banner in Balance Card */}
              {!isLoggedIn && (
                <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 text-amber-300">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>أنت تشاهد حالياً وضع الزائر التجريبي. سجّل حسابك الآن ليتم إصدار رقم بطاقتك الرسمي الدائم وحفظ رصيدك بالدينار العراقي (د.ع).</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('register');
                      setIsLoginModalOpen(true);
                    }}
                    className="px-3 py-1 rounded-lg bg-amber-500 text-black hover:bg-amber-400 font-bold cursor-pointer text-[11px] shrink-0"
                  >
                    تسجيل الآن
                  </button>
                </div>
              )}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold text-[#94a3b8] flex items-center gap-1.5">
                      <Wallet className="w-4 h-4 text-[#00e5ff]" />
                      رصيد محفظتك الحالي بالدينار العراقي
                    </span>
                    {isLoggedIn && userData.balance < 1000 && (
                      <button
                        type="button"
                        onClick={handleOpenRechargeModal}
                        className="text-[10px] bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1.5 animate-pulse transition cursor-pointer"
                        title="انقر لتعبئة الرصيد فوراً"
                      >
                        <AlertTriangle className="w-3 h-3 text-red-400" />
                        <span>رصيد منخفض (&lt; 1,000 د.ع) - اضغط للتعبئة</span>
                      </button>
                    )}
                  </div>

                  <div className="text-3xl sm:text-4xl font-black text-white mt-2 font-mono flex items-baseline gap-2">
                    <span className={isLoggedIn && userData.balance < 1000 ? "text-amber-400 font-extrabold" : "text-[#00e5ff]"}>
                      {userData.balance.toLocaleString()}
                    </span>
                    <span className="text-sm font-normal text-[#94a3b8]">دينار عراقي (د.ع)</span>
                  </div>

                  {/* Shows ONLY Name and Card Number ("رقم بطاقتك") with copy button */}
                  <div className="text-xs text-[#94a3b8] mt-2 flex items-center gap-2 flex-wrap">
                    <span className="text-white font-bold">{userData.name}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-amber-400 font-mono font-bold">
                        رقم بطاقتك: {userData.cardNumber}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(userData.cardNumber.toString(), 'رقم بطاقتك')}
                        className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-white transition flex items-center gap-1 text-[11px] border border-slate-700 cursor-pointer"
                        title="نسخ رقم بطاقتك"
                      >
                        <Copy className="w-3 h-3" />
                        <span>نسخ</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (!isLoggedIn || !userData.email) {
                        showToast('تسجيل الدخول مطلوب', 'ممنوع إرسال الأموال إلا بعد تسجيل الدخول أو إنشاء حساب جديد!', 'error');
                        setIsLoginModalOpen(true);
                        return;
                      }
                      setIsSendModalOpen(true);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold text-xs flex items-center gap-2 shadow-md transition cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>إرسال أموال</span>
                  </button>
                  <button
                    onClick={handleOpenRechargeModal}
                    className="px-4 py-2.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs flex items-center gap-2 shadow-md transition cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>تعبئة رصيد</span>
                  </button>
                </div>
              </div>
            </div>

            {/* PLUS SUBSCRIPTION MANAGEMENT & STATUS CARD */}
            <div className="bg-gradient-to-r from-amber-950/40 via-[#1e293b] to-yellow-950/30 border-2 border-amber-500/40 rounded-2xl p-5 shadow-xl space-y-3.5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 shadow">
                    <Crown className="w-6 h-6 fill-amber-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#94a3b8] font-sans">حالة الاشتراك:</span>
                      <h3 className="font-bold text-sm text-white">
                        {userData.isAdFreeSubscriber
                          ? 'Plus Subscription (اشتراك بلس)'
                          : 'حساب مجاني'}
                      </h3>
                      <span
                        className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                          userData.isAdFreeSubscriber
                            ? userData.cancellationRequested
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-amber-400 text-black font-semibold'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {userData.isAdFreeSubscriber
                          ? userData.cancellationRequested
                            ? 'Plus Subscription (تم طلب الإلغاء)'
                            : 'Plus Subscription (اشتراك بلس)'
                          : 'حساب مجاني'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      {userData.isAdFreeSubscriber ? (
                        <>
                          نوع الباقة:{' '}
                          <strong className="text-amber-300">
                            {userData.subscriptionPlan === 'yearly'
                              ? 'السنوية (15,000 د.ع / 365 يوماً)'
                              : 'الشهرية (2,000 د.ع / 30 يوماً)'}
                          </strong>
                        </>
                      ) : (
                        <>
                          الباقة الشهرية:{' '}
                          <strong className="text-amber-400 font-mono">2,000 د.ع</strong> • الباقة
                          السنوية (الأوفر):{' '}
                          <strong className="text-emerald-400 font-mono">15,000 د.ع</strong> لإلغاء الإعلانات، 50 د.ع يومياً، وشراء غير محدود.
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setIsSubscriptionModalOpen(true)}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition shadow active:scale-95 cursor-pointer ${
                      userData.isAdFreeSubscriber
                        ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40'
                        : 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-black hover:brightness-105 shadow-amber-500/20'
                    }`}
                  >
                    <Crown
                      className={`w-4 h-4 ${
                        userData.isAdFreeSubscriber ? 'fill-amber-400' : 'fill-black'
                      }`}
                    />
                    <span>
                      {userData.isAdFreeSubscriber
                        ? 'تفاصيل / تمديد الاشتراك'
                        : 'ترقية إلى Plus الآن ⭐'}
                    </span>
                  </button>

                  {userData.isAdFreeSubscriber && !userData.cancellationRequested && (
                    <button
                      type="button"
                      onClick={() => setIsCancelConfirmModalOpen(true)}
                      className="px-3 py-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-300 hover:text-white font-bold text-xs transition cursor-pointer"
                    >
                      إلغاء الاشتراك
                    </button>
                  )}

                  {userData.isAdFreeSubscriber && userData.cancellationRequested && (
                    <button
                      type="button"
                      onClick={handleReactivateSubscription}
                      className="px-3 py-2.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 hover:text-white font-bold text-xs transition cursor-pointer"
                    >
                      استئناف التجديد
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setIsArchitectureModalOpen(true)}
                    className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition border border-slate-700 cursor-pointer"
                    title="عرض المخططات وواجهات REST البرمجية للباك إند"
                  >
                    <Code2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>هندسة النظام والـ API</span>
                  </button>
                </div>
              </div>

              {/* Exact Expiration Date, Remaining Duration & Overall Details */}
              {userData.isAdFreeSubscriber && (
                <div className="pt-2.5 border-t border-[#334155]/70 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs bg-black/25 p-3 rounded-xl font-mono">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[#94a3b8] font-sans text-[11px]">تاريخ انتهاء الصلاحية المحدد:</span>
                    <strong className="text-white text-xs">{userData.subscriptionExpiry || '2027'}</strong>
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <span className="text-[#94a3b8] font-sans text-[11px]">المدة المتبقية:</span>
                    <strong className="text-emerald-400 font-sans font-bold text-xs">
                      {getSubscriptionExpirationDetails()?.durationText || 'غير محدد'}
                    </strong>
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <span className="text-[#94a3b8] font-sans text-[11px]">حالة التجديد:</span>
                    <strong className={`font-sans text-xs ${userData.cancellationRequested ? 'text-red-300' : 'text-amber-300'}`}>
                      {userData.cancellationRequested
                        ? 'تم طلب الإلغاء (سارٍ حتى الانتهاء)'
                        : 'يتجدد تلقائياً'}
                    </strong>
                  </div>
                </div>
              )}
            </div>

            {/* MEMBER ENTITLEMENTS ROW: DAILY REWARDS & DAILY PURCHASE LIMIT */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Card 1: 50 IQD Daily Reward */}
              <div className="p-4 rounded-2xl bg-[#1e293b] border border-amber-500/30 shadow flex flex-col justify-between gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                      <Coins className="w-4 h-4 text-amber-400" />
                      <span>مكافأة 50 د.ع اليومية (Daily Rewards)</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      صرف تلقائي كل 24 ساعة لمشتركي Plus مع نافذة صلاحية 7 أيام للمكافآت.
                    </p>
                  </div>
                  <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                    +50 د.ع / 24h
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <div className="text-[10px] text-slate-400 font-mono">
                    {userData.isAdFreeSubscriber ? (
                      userData.lastDailyRewardAt ? (
                        <span>آخر استلام: {new Date(userData.lastDailyRewardAt).toLocaleTimeString('ar-IQ')}</span>
                      ) : (
                        <span className="text-emerald-400">جاهزة للاستلام!</span>
                      )
                    ) : (
                      <span className="text-amber-400/80">تتطلب اشتراك بلس نشط</span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleClaimDailyReward}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1 transition shadow cursor-pointer"
                  >
                    <Coins className="w-3.5 h-3.5" />
                    <span>{userData.isAdFreeSubscriber ? 'فحص / استلام المكافأة' : 'تفعيل المكافأة'}</span>
                  </button>
                </div>
              </div>

              {/* Card 2: Daily Purchase Quota */}
              <div className="p-4 rounded-2xl bg-[#1e293b] border border-blue-500/30 shadow flex flex-col justify-between gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                      <InfinityIcon className="w-4 h-4 text-blue-400" />
                      <span>حد المعاملات اليومية (Daily Transactions)</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {userData.isAdFreeSubscriber
                        ? 'تتمتع بحرية كاملة لإجراء عدد غير محدود من عمليات الشراء يومياً.'
                        : 'الحساب المجاني مقيد بـ 5 عمليات شراء كحد أقصى يومياً.'}
                    </p>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                    userData.isAdFreeSubscriber
                      ? 'bg-blue-500/20 text-blue-300'
                      : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {userData.isAdFreeSubscriber ? 'غير محدود ♾️' : `${(userData.lastPurchaseDate === new Date().toISOString().split('T')[0] ? (userData.dailyPurchaseCount || 0) : 0)} / 5`}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <div className="text-[10px] text-slate-400 font-mono">
                    {userData.isAdFreeSubscriber ? (
                      <span className="text-emerald-400">مشتريات اليوم: {userData.dailyPurchaseCount || 0} (غير مقيد)</span>
                    ) : (
                      <span>المتبقي اليوم: {Math.max(0, 5 - (userData.lastPurchaseDate === new Date().toISOString().split('T')[0] ? (userData.dailyPurchaseCount || 0) : 0))} معاملات</span>
                    )}
                  </div>

                  {!userData.isAdFreeSubscriber && (
                    <button
                      type="button"
                      onClick={() => setIsSubscriptionModalOpen(true)}
                      className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] transition cursor-pointer"
                    >
                      إلغاء القيد (Plus)
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Purchased Codes */}
              <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between pb-3 border-b border-[#334155] mb-3">
                  <div className="flex items-center gap-2 font-bold text-sm text-white">
                    <Key className="w-4 h-4 text-emerald-400" />
                    <span>أكواد البطاقات المشتراة ({purchases.length})</span>
                  </div>
                  <span className="text-[11px] text-[#94a3b8]">تسليم مباشر</span>
                </div>

                {purchases.length === 0 ? (
                  <div className="text-center py-8 text-xs text-[#94a3b8]">
                    لم تقم بشراء أي بطاقة حتى الآن. اشترِ أي بطاقة وستظهر شفرتها السرية هنا.
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                    {purchases.map((item) => (
                      <div key={item.id} className="p-3 rounded-xl bg-[#0f172a] border border-[#334155]">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-bold text-white">{item.title}</span>
                          <span className="text-[#10b981] font-mono">
                            {item.price.toLocaleString()} د.ع
                          </span>
                        </div>
                        <div className="flex items-center justify-between bg-[#1e293b] px-3 py-1.5 rounded-lg border border-[#334155]">
                          <span className="font-mono text-sm font-black text-[#00e5ff] tracking-wider select-all">
                            {item.code}
                          </span>
                          <button
                            onClick={() => copyToClipboard(item.code, 'كود البطاقة')}
                            className="text-xs text-indigo-400 hover:text-white flex items-center gap-1"
                          >
                            <Copy className="w-3 h-3" />
                            <span>نسخ</span>
                          </button>
                        </div>
                        <div className="text-[10px] text-[#94a3b8] mt-1 text-left font-mono">{item.date}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Transactions History */}
              <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between pb-3 border-b border-[#334155] mb-3">
                  <div className="flex items-center gap-2 font-bold text-sm text-white">
                    <History className="w-4 h-4 text-indigo-400" />
                    <span>سجل التحويلات والعمليات (د.ع)</span>
                  </div>
                  <span className="text-[11px] text-[#94a3b8]">آخر الحركات</span>
                </div>

                {transactions.length === 0 ? (
                  <div className="text-center py-8 text-xs text-[#94a3b8]">
                    لا توجد تحويلات سابقة مسجلة.
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                    {transactions.map((tx) => (
                      <div
                        key={tx.id}
                        className="p-2.5 rounded-xl bg-[#0f172a] border border-[#334155] flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                              tx.amount > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                            }`}
                          >
                            {tx.amount > 0 ? <PlusCircle className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                          </div>
                          <div>
                            <div className="font-bold text-white">{tx.title}</div>
                            <div className="text-[10px] text-[#94a3b8]">{tx.date}</div>
                          </div>
                        </div>

                        <div
                          className={`font-mono font-bold ${
                            tx.amount > 0 ? 'text-emerald-400' : 'text-red-400'
                          }`}
                        >
                          {tx.amount > 0 ? '+' : ''}
                          {tx.amount.toLocaleString()} د.ع
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DEDICATED CARD VIEW ("قسم البطاقة مخصص فقط للبطاقة") */}
        {activeTab === 'card' && (
          <div className="max-w-xl mx-auto w-full space-y-6 animate-in fade-in duration-200">
            {/* Header banner explaining this section is dedicated to the digital card */}
            <div className="flex items-center justify-between pb-2 border-b border-[#334155]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-[#00e5ff] flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white m-0">قسم البطاقة الرقمية 💳</h2>
                  <p className="text-[11px] text-[#94a3b8] m-0">قسم مخصص فقط لعرض بيانات وتفاصيل بطاقتك الرقمية</p>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                <Check className="w-3 h-3 stroke-[3]" />
                <span>بطاقة نشطة ومفعلة</span>
              </span>
            </div>

            {/* Digital Card Component - Strictly Displays ONLY "بطاقة" (Card) with no tier badges */}
            <div className="rainbow-border p-6 rounded-2xl bg-[#161b24] text-white shadow-2xl relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-[#00e5ff]" />
                    <span>بطاقة</span>
                  </div>
                  <span className="text-[10px] text-indigo-300 font-mono tracking-wider">coreX DIGITAL CARD</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <div className="w-8 h-6 rounded bg-amber-400 border border-amber-300 flex items-center justify-center text-[9px] font-black text-black">
                    CHIP
                  </div>
                </div>
              </div>

              {/* CARD DETAILS: Strictly shows ONLY Name & "رقم بطاقتك" as explicitly requested with Copy button */}
              <div className="mt-8 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-xs text-[#94a3b8]">اسمك:</span>
                  <span className="font-bold text-sm text-white">{userData.name}</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-[#94a3b8]">رقم بطاقتك:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base sm:text-lg font-black text-amber-400 tracking-wider">
                      {userData.cardNumber}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(userData.cardNumber.toString(), 'رقم بطاقتك')}
                      className="px-2 py-1 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 hover:text-white transition flex items-center gap-1 text-xs border border-amber-400/30 cursor-pointer"
                      title="نسخ رقم بطاقتك"
                    >
                      <Copy className="w-3 h-3" />
                      <span className="text-[10px] font-bold">نسخ</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Dedicated Card Info & Quick Actions */}
            <div className="bg-[#1e293b] p-5 rounded-2xl border border-[#334155] space-y-3.5 shadow-lg">
              <div className="flex items-center justify-between pb-2 border-b border-[#334155]">
                <div className="font-bold text-xs text-white flex items-center gap-2">
                  <Info className="w-4 h-4 text-indigo-400" />
                  <span>معلومات واستخدامات البطاقة</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">10 أرقام فريدة</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>رقم بطاقتك هذا مخصص لاستلام الأموال والتحويلات المباشرة من المستخدمين الآخرين.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>كل حساب تمتلكه يحمل رقم بطاقة مستقل خاص به ورصيد منفصل بالدينار العراقي (د.ع).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#00e5ff] font-bold">•</span>
                  <span>تأكد من مشاركة رقم البطاقة الصحيح الموضح أعلاه عند طلب التحويل المالي لحسابك.</span>
                </li>
              </ul>

              <div className="pt-2 border-t border-[#334155] flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400">للتحكم بالحسابات وتبديلها أو تغيير الرمز:</span>
                <button
                  type="button"
                  onClick={() => setActiveTab('settings')}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition flex items-center gap-1.5 shadow cursor-pointer active:scale-95"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>الانتقال لقسم الإعدادات ⚙️</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: DEDICATED SETTINGS & ACCOUNT CONTROL VIEW ("التحكم بالحسابات من قسم الإعدادات وليس من قسم البطاقة") */}
        {activeTab === 'settings' && (
          <div className="max-w-xl mx-auto w-full space-y-6 animate-in fade-in duration-200">
            {/* Settings Header Banner */}
            <div className="flex items-center justify-between pb-2 border-b border-[#334155]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white m-0">قسم الإعدادات والتحكم بالحسابات ⚙️</h2>
                  <p className="text-[11px] text-[#94a3b8] m-0">إدارة وتبديل الحسابات، كلمة المرور، مظهر التطبيق والاشتراك</p>
                </div>
              </div>
              <span className="text-[10px] bg-slate-800 text-amber-300 border border-slate-700 px-2.5 py-1 rounded-full font-bold">
                الحساب الحالي: {userData.name}
              </span>
            </div>

            {/* MULTI-ACCOUNT SWITCHER (STRICTLY MAX 2 ACCOUNTS: "وتبديل الحسابات كحد اقصى ٢ حسابات فقط وحساب تجريبي لا يوجد ماكو انشاء حساب سريع تنشى عن طريق بريد واسم ورمز") */}
            <div className="bg-[#1e293b] p-5 rounded-2xl border border-[#334155] space-y-4 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#334155]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-white">إدارة وتبديل الحسابات</h3>
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-bold font-mono">
                        كحد أقصى حسابين (2) فقط
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      التبديل الفوري بين الحسابين بضغطة زر واحدة دون تسجيل خروج • الحسابات المسجلة: ({storedUsers.length} من 2)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {storedUsers.length < 2 ? (
                    <button
                      type="button"
                      onClick={() => setIsAddAccountOpen(!isAddAccountOpen)}
                      className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow transition cursor-pointer"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>{isAddAccountOpen ? 'إغلاق الاستمارة' : 'إنشاء الحساب الثاني'}</span>
                    </button>
                  ) : (
                    <span className="text-[11px] bg-slate-800 text-amber-300 border border-slate-700 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                      <span>الحد الأقصى مكتمل (2 من 2)</span>
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                لا حاجة لتسجيل الخروج! يمكنك التبديل بحرية بين حسابين كحد أقصى (2) بضغطة زر واحدة. يتم إنشاء الحساب الثاني عبر إدخال <strong className="text-amber-300">الاسم، البريد الإلكتروني، والرمز السري</strong>. كل حساب مستقل تماماً برصيده بالدينار العراقي (د.ع) ورقم بطاقته (10 أرقام) وسجل معاملاته:
              </p>

              {/* Form to Add / Register a Second Account (Strictly name, email, and password) */}
              {isAddAccountOpen && storedUsers.length < 2 && (
                <form
                  onSubmit={handleCreateSecondAccount}
                  className="p-4 rounded-xl bg-[#0f172a] border border-indigo-500/50 space-y-3.5 animate-in fade-in slide-in-from-top-2 duration-200"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-indigo-900/50">
                    <span className="font-bold text-xs text-white flex items-center gap-1.5">
                      <UserPlus className="w-4 h-4 text-indigo-400" />
                      إنشاء الحساب الثاني (بالاسم والبريد والرمز السري)
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsAddAccountOpen(false)}
                      className="text-slate-400 hover:text-white cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] text-slate-300 block mb-1 font-semibold">1. اسم صاحب الحساب:</label>
                      <input
                        type="text"
                        value={newAccName}
                        onChange={(e) => setNewAccName(e.target.value)}
                        placeholder="مثلاً: علي الكرخي"
                        required
                        className="w-full p-2.5 rounded-xl bg-[#1e293b] border border-[#334155] text-xs text-white outline-none focus:border-indigo-400"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-300 block mb-1 font-semibold">2. البريد الإلكتروني:</label>
                      <input
                        type="email"
                        value={newAccEmail}
                        onChange={(e) => setNewAccEmail(e.target.value)}
                        placeholder="user2@example.com"
                        required
                        className="w-full p-2.5 rounded-xl bg-[#1e293b] border border-[#334155] text-xs text-white outline-none dir-ltr text-right focus:border-indigo-400"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-300 block mb-1 font-semibold">3. الرمز السري / كلمة المرور:</label>
                      <input
                        type="password"
                        value={newAccPass}
                        onChange={(e) => setNewAccPass(e.target.value)}
                        placeholder="رمز الدخول للحساب"
                        required
                        className="w-full p-2.5 rounded-xl bg-[#1e293b] border border-[#334155] text-xs text-white outline-none focus:border-indigo-400"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#334155]/60 text-xs">
                    <span className="text-[11px] text-slate-400">
                      يتم إصدار رقم بطاقة مكون من 10 أرقام ورصيد 0 د.ع للحساب تلقائياً.
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAddAccountOpen(false)}
                        className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs cursor-pointer"
                      >
                        إلغاء
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>إنشاء وتثبيت الحساب الثاني ✓</span>
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* LIST OF STORED ACCOUNTS (STRICTLY 2 MAX) */}
              <div className="space-y-2.5">
                {storedUsers.slice(0, 2).map((acc, accIdx) => {
                  const isActive = isLoggedIn && userData.email.toLowerCase() === acc.email.toLowerCase();
                  const isDev = acc.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

                  return (
                    <div
                      key={acc.id || acc.email}
                      className={`p-3.5 rounded-xl border-2 transition flex flex-wrap items-center justify-between gap-3 ${
                        isActive
                          ? 'bg-[#0f172a] border-emerald-500 shadow-md shadow-emerald-500/10'
                          : 'bg-[#0f172a]/70 border-[#334155] hover:border-slate-500'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border ${
                            isActive
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                              : 'bg-indigo-600/20 text-indigo-300 border-indigo-500/30'
                          }`}
                        >
                          {acc.name ? acc.name.charAt(0) : 'ح'}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-white text-xs">{acc.name}</h4>
                            <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700 font-mono">
                              حساب #{accIdx + 1}
                            </span>
                            {isActive && (
                              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                                <Check className="w-3 h-3 stroke-[3]" />
                                <span>الحساب النشط حالياً</span>
                              </span>
                            )}
                            {isDev && (
                              <span className="text-[9px] bg-purple-500/20 text-purple-300 border border-purple-500/40 px-1.5 py-0.5 rounded font-bold">
                                إدارة
                              </span>
                            )}
                            {acc.isAdFreeSubscriber && (
                              <span className="text-[9px] bg-amber-400 text-black px-1.5 py-0.5 rounded font-bold">
                                VIP Plus
                              </span>
                            )}
                            <span className="text-[9px] bg-slate-800 text-emerald-400 border border-slate-700 px-1.5 py-0.5 rounded font-bold flex items-center gap-1">
                              <Lock className="w-2.5 h-2.5" />
                              <span>الرمز مسجل ومحمي</span>
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1 flex-wrap">
                            <span className="font-mono text-amber-400 font-bold">
                              بطاقة: {acc.cardNumber}
                            </span>
                            <span>•</span>
                            <span className="font-mono dir-ltr">{acc.email}</span>
                            <span>•</span>
                            <span className="font-bold font-mono text-emerald-400">
                              الرصيد: {acc.balance.toLocaleString()} د.ع
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mr-auto">
                        {isActive ? (
                          <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>مفعّل الآن</span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSwitchAccount(acc)}
                            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow transition active:scale-95 cursor-pointer"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>تبديل لهذا الحساب</span>
                          </button>
                        )}

                        {!isActive && !isDev && (
                          <button
                            type="button"
                            onClick={() => handleDeleteStoredAccount(acc.id, acc.email, acc.name)}
                            className="p-1.5 rounded-lg bg-red-950/30 hover:bg-red-900/50 text-red-400 border border-red-500/30 transition cursor-pointer"
                            title="حذف هذا الحساب لإفساح المجال لإنشاء حساب ثانٍ جديد"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Status note when only 1 account exists */}
              {storedUsers.length < 2 && (
                <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between gap-3 text-xs text-slate-300">
                  <div className="flex items-center gap-2 text-indigo-300">
                    <UserPlus className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>لديك حساب واحد مسجل حالياً. متاح لك إنشاء الحساب الثاني عبر إدخال الاسم والبريد والرمز.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAddAccountOpen(true)}
                    className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs cursor-pointer shrink-0"
                  >
                    إنشاء الحساب الثاني
                  </button>
                </div>
              )}
            </div>

            {/* PASSWORD CONTROL & ACCOUNT MANAGEMENT ("التحكم بتغير كلمه المرور") */}
            <div className="bg-[#1e293b] p-5 rounded-2xl border border-[#334155] space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-[#334155]">
                <div className="font-bold text-sm text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-indigo-400" />
                  <span>التحكم بكلمة المرور والرمز السري (Password Control)</span>
                </div>
                <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 font-mono">
                  الحساب النشط: {userData.name}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-[#94a3b8]">
                  <span>البريد الإلكتروني للحساب الحالي:</span>
                  <span className="text-white font-mono dir-ltr">{userData.email}</span>
                </div>
                <div className="flex justify-between items-center text-[#94a3b8]">
                  <span>رقم بطاقتك:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400 font-mono font-bold">{userData.cardNumber}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(userData.cardNumber.toString(), 'رقم بطاقتك')}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-white transition text-[10px] flex items-center gap-1 border border-slate-700 cursor-pointer"
                      title="نسخ رقم بطاقتك"
                    >
                      <Copy className="w-3 h-3" />
                      <span>نسخ</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Password update form */}
              <div className="pt-3 border-t border-[#334155] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-xs text-white flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-[#00e5ff]" />
                    <span>تغيير الرمز السري / كلمة المرور للحساب الحالي:</span>
                  </label>
                  <span className="text-[10px] text-slate-400">
                    يحفظ التعديل فوراً في بيانات الحساب المحفوظة
                  </span>
                </div>

                <div className="relative">
                  <input
                    type={showPassChangeVisibility ? 'text' : 'password'}
                    value={changePassInput}
                    onChange={(e) => setChangePassInput(e.target.value)}
                    placeholder="أدخل كلمة المرور أو الرمز الجديد هنا..."
                    className="w-full p-2.5 pl-10 rounded-xl border border-[#334155] bg-[#0f172a] text-white text-xs outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassChangeVisibility(!showPassChangeVisibility)}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                    title={showPassChangeVisibility ? 'إخفاء الرمز' : 'إظهار الرمز'}
                  >
                    {showPassChangeVisibility ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleChangePassword}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>حفظ وتثبيت كلمة المرور الجديدة 🔒</span>
                </button>
              </div>
            </div>

            {/* THEME & APPEARANCE SWITCHER ("مفتاح تبديل بين الوضع الداكن الحالي ووضع داكن آخر أكثر تباينًا بلمسات رمادية داكنة") */}
            <div className="bg-[#1e293b] p-5 rounded-2xl border border-[#334155] space-y-4 shadow-lg">
              <div className="flex items-center justify-between pb-2 border-b border-[#334155]">
                <div className="font-bold text-sm text-white flex items-center gap-2">
                  <Palette className="w-4 h-4 text-indigo-400" />
                  <span>مظهر التطبيق والوضع الداكن (Theme & Appearance)</span>
                </div>
                <span className={`text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full border ${
                  appTheme === 'charcoal'
                    ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                    : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                }`}>
                  {appTheme === 'charcoal' ? 'رمادي عالي التباين (Charcoal)' : 'داكن كحلي (Midnight Slate)'}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                يمكنك التبديل بسهولة بين الوضع المظلم الحالي (الدرجات الكحلية الهادئة) ووضع داكن آخر نقي وعالي التباين بلمسات رمادية وفحمية داكنة مريحة للعينين والشاشات الحديثة:
              </p>

              {/* Theme Selector Toggle Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Mode 1: Midnight Slate (Current default) */}
                <button
                  type="button"
                  onClick={() => {
                    setAppTheme('midnight');
                    showToast('تم تغيير المظهر 🎨', 'تم تفعيل الوضع الداكن الكحلي الهادئ (Midnight Slate).', 'info');
                  }}
                  className={`p-3.5 rounded-xl border-2 text-right transition cursor-pointer flex flex-col justify-between gap-3 relative ${
                    appTheme === 'midnight'
                      ? 'bg-[#0f172a] border-indigo-500 shadow-lg shadow-indigo-500/10'
                      : 'bg-[#0f172a]/60 border-[#334155] hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-indigo-950/80 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                        <Moon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-white">الوضع الداكن الكحلي</div>
                        <div className="text-[10px] text-indigo-300 font-mono">Midnight Slate (الحالي)</div>
                      </div>
                    </div>

                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      appTheme === 'midnight' ? 'border-indigo-400 bg-indigo-500 text-white' : 'border-slate-600'
                    }`}>
                      {appTheme === 'midnight' && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    خلفيات كحلية وداكنة كلاسيكية ناعمة مستوحاة من سماء الليل (#0f172a و #1e293b).
                  </p>

                  <div className="flex items-center gap-1.5 pt-1.5 border-t border-[#334155]/60 text-[10px] text-[#94a3b8]">
                    <span className="w-3 h-3 rounded-full bg-[#0f172a] border border-[#334155]"></span>
                    <span className="w-3 h-3 rounded-full bg-[#1e293b] border border-[#334155]"></span>
                    <span className="w-3 h-3 rounded-full bg-[#2563eb]"></span>
                    <span className="mr-auto font-semibold">ناعم ومتزن للعين</span>
                  </div>
                </button>

                {/* Mode 2: High Contrast Charcoal */}
                <button
                  type="button"
                  onClick={() => {
                    setAppTheme('charcoal');
                    showToast('تم تغيير المظهر 🎨', 'تم تفعيل الوضع الرمادي الداكن عالي التباين (High Contrast Charcoal).', 'success');
                  }}
                  className={`p-3.5 rounded-xl border-2 text-right transition cursor-pointer flex flex-col justify-between gap-3 relative ${
                    appTheme === 'charcoal'
                      ? 'bg-[#18181b] border-amber-400 shadow-lg shadow-amber-500/10'
                      : 'bg-[#18181b]/60 border-[#3f3f46] hover:border-zinc-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-600 flex items-center justify-center text-amber-300">
                        <Contrast className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-white">الوضع الرمادي الداكن</div>
                        <div className="text-[10px] text-amber-300 font-mono">High Contrast Charcoal</div>
                      </div>
                    </div>

                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      appTheme === 'charcoal' ? 'border-amber-400 bg-amber-400 text-black' : 'border-zinc-600'
                    }`}>
                      {appTheme === 'charcoal' && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>

                  <p className="text-[11px] text-zinc-300 leading-relaxed">
                    خلفيات فحمية ورمادية داكنة بنسبة تباين عالية ونقاء استثنائي للخطوط والأزرار (#09090b و #18181b).
                  </p>

                  <div className="flex items-center gap-1.5 pt-1.5 border-t border-[#3f3f46]/60 text-[10px] text-zinc-400">
                    <span className="w-3 h-3 rounded-full bg-[#09090b] border border-zinc-700"></span>
                    <span className="w-3 h-3 rounded-full bg-[#18181b] border border-zinc-700"></span>
                    <span className="w-3 h-3 rounded-full bg-[#f59e0b]"></span>
                    <span className="mr-auto font-semibold">أعلى تباين وأوضح قراءة</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Plus Subscription Settings Card */}
            <div className="bg-[#1e293b] p-5 rounded-2xl border border-amber-500/40 space-y-3 shadow-lg">
              <div className="flex items-center justify-between pb-2 border-b border-[#334155]">
                <div className="font-bold text-sm text-white flex items-center gap-2">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <span>اشتراك بلس (Plus Subscription)</span>
                </div>
                <span
                  className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                    userData.isAdFreeSubscriber
                      ? userData.cancellationRequested
                        ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                        : 'bg-amber-400 text-black'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {userData.isAdFreeSubscriber
                    ? userData.cancellationRequested
                      ? 'تم طلب الإلغاء (سارٍ حتى الانتهاء)'
                      : 'Plus Subscription (اشتراك بلس)'
                    : 'غير مفعل'}
                </span>
              </div>

              <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-[#94a3b8]">حالة الاشتراك:</span>
                  <span className="font-bold text-amber-300">
                    {userData.isAdFreeSubscriber ? 'Plus Subscription (اشتراك بلس)' : 'حساب مجاني'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-[#94a3b8]">نوع الباقة:</span>
                  <span className="font-bold text-white">
                    {userData.isAdFreeSubscriber
                      ? userData.subscriptionPlan === 'yearly'
                        ? 'الباقة السنوية (15,000 د.ع / 365 يوماً)'
                        : 'الباقة الشهرية (2,000 د.ع / 30 يوماً)'
                      : 'الشهر: 2,000 د.ع • السنة: 15,000 د.ع'}
                  </span>
                </div>
                {userData.isAdFreeSubscriber && (
                  <>
                    <div className="flex justify-between items-center text-[11px] font-mono">
                      <span className="text-[#94a3b8] font-sans">تاريخ انتهاء الصلاحية المحدد:</span>
                      <span className="font-bold text-amber-300">{userData.subscriptionExpiry}</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-[#94a3b8]">المدة المتبقية:</span>
                      <span className="font-bold text-emerald-400 font-sans">
                        {getSubscriptionExpirationDetails()?.durationText || 'غير محدد'}
                      </span>
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsSubscriptionModalOpen(true)}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-black font-bold text-xs flex items-center justify-center gap-2 transition hover:brightness-105 active:scale-95 shadow cursor-pointer"
                >
                  <Crown className="w-4 h-4 fill-black" />
                  <span>
                    {userData.isAdFreeSubscriber ? 'تفاصيل / تمديد الاشتراك' : 'الاشتراك في باقة Plus ⭐'}
                  </span>
                </button>

                {userData.isAdFreeSubscriber && !userData.cancellationRequested && (
                  <button
                    type="button"
                    onClick={() => setIsCancelConfirmModalOpen(true)}
                    className="px-3 py-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 text-red-300 hover:text-white font-bold text-xs transition cursor-pointer"
                  >
                    إلغاء الاشتراك
                  </button>
                )}

                {userData.isAdFreeSubscriber && userData.cancellationRequested && (
                  <button
                    type="button"
                    onClick={handleReactivateSubscription}
                    className="px-3 py-2.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 hover:text-white font-bold text-xs transition cursor-pointer"
                  >
                    استئناف التجديد
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setIsArchitectureModalOpen(true)}
                className="w-full py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-amber-300 font-bold text-xs flex items-center justify-center gap-2 transition border border-amber-500/30 cursor-pointer font-mono"
              >
                <Code2 className="w-4 h-4" />
                <span>عرض وثائق وهندسة نظام Plus والـ API 🛠️</span>
              </button>
            </div>

            {/* Logout / Login Account Card in Settings */}
            <div className="bg-[#1e293b] p-5 rounded-2xl border border-[#334155] shadow-lg">
              {isLoggedIn ? (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-right">
                    <span className="font-bold text-xs text-white block">تسجيل الخروج من الحساب</span>
                    <span className="text-[11px] text-slate-400">يمكنك تسجيل الخروج أو التبديل للحساب الثاني مباشرة من الأعلى</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-400 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>تسجيل الخروج</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-right">
                    <span className="font-bold text-xs text-white block">حساب غير مسجل</span>
                    <span className="text-[11px] text-slate-400">سجل الدخول لحفظ بطاقتك وتفعيل الحسابات المتعددة</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login');
                      setIsLoginModalOpen(true);
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#4f46e5] hover:bg-[#4338ca] text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>تسجيل الدخول</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* FIXED MOBILE BOTTOM NAVIGATION BAR */}
        {activeTab !== "admin" && (
          <nav className="fixed bottom-0 left-0 right-0 sm:max-w-md sm:mx-auto z-40 bg-[#1e293b]/95 backdrop-blur-md border-t border-[#334155] px-2 py-1.5 flex items-center justify-around shadow-2xl text-[10px] font-bold">
            <button
              type="button"
              onClick={() => setActiveTab("store")}
              className={`flex-1 py-1 flex flex-col items-center gap-1 transition ${
                activeTab === "store" ? "text-indigo-400 font-black" : "text-[#94a3b8] hover:text-white"
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
              <span>المتجر</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("wallet")}
              className={`flex-1 py-1 flex flex-col items-center gap-1 transition ${
                activeTab === "wallet" ? "text-indigo-400 font-black" : "text-[#94a3b8] hover:text-white"
              }`}
            >
              <Wallet className="w-5 h-5" />
              <span>المحفظة</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("card")}
              className={`flex-1 py-1 flex flex-col items-center gap-1 transition ${
                activeTab === "card" ? "text-indigo-400 font-black" : "text-[#94a3b8] hover:text-white"
              }`}
              title="قسم البطاقة الرقمية المخصص للبطاقة فقط"
            >
              <CreditCard className="w-5 h-5" />
              <span>البطاقة</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("settings")}
              className={`flex-1 py-1 flex flex-col items-center gap-1 transition ${
                activeTab === "settings" ? "text-indigo-400 font-black" : "text-[#94a3b8] hover:text-white"
              }`}
              title="قسم الإعدادات للتحكم بالحسابات والرمز والمظهر"
            >
              <Settings className="w-5 h-5" />
              <span>الإعدادات</span>
            </button>

            <button
              type="button"
              onClick={toggleChat}
              className="flex-1 py-1 flex flex-col items-center gap-1 text-[#94a3b8] hover:text-white transition"
            >
              <Bot className="w-5 h-5 text-[#00e5ff]" />
              <span>المساعد</span>
            </button>

            {isAdmin && (
              <button
                type="button"
                onClick={() => setActiveTab("admin")}
                className="flex-1 py-1 flex flex-col items-center gap-1 text-purple-400 hover:text-purple-300 font-black transition"
                title="فتح لوحة تحكم الكمبيوتر"
              >
                <Monitor className="w-5 h-5" />
                <span>الديسكتوب</span>
              </button>
            )}
          </nav>
        )}
      </div>

      {/* Chat Box Container (Opened via bottom nav bar when needed) */}
      <div
        className="chat-box fixed bottom-20 left-3 sm:left-5 w-[92vw] sm:w-[380px] h-[480px] bg-[#1e293b] rounded-2xl border border-[#334155] shadow-2xl z-[999] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200"
        id="chat-box"
        style={{ display: isChatOpen ? 'flex' : 'none' }}
      >
        {/* Chat Header (.chat-header) */}
        <div className="chat-header bg-[#0f172a] p-3.5 font-bold flex justify-between items-center border-b border-[#334155] text-xs text-white">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-r from-indigo-500 to-[#00e5ff] flex items-center justify-center text-black font-black text-[11px] shadow">
              AI
            </div>
            <div>
              <div className="font-bold text-white">مساعد coreX AI</div>
              <div className="text-[10px] text-emerald-400 font-normal">العملة: دينار عراقي (د.ع) فقط</div>
            </div>
          </div>

          <span style={{ cursor: 'pointer' }} onClick={toggleChat} className="p-1 hover:text-red-400 text-sm">
            ✕
          </span>
        </div>

        {/* Chat Messages (#chat-messages, .chat-messages) */}
        <div className="chat-messages flex-1 p-3 overflow-y-auto flex flex-col gap-2.5 text-xs" id="chat-messages">
          {chatMessages.map((m) => (
            <div
              key={m.id}
              className={`msg p-3 rounded-2xl max-w-[88%] text-xs leading-relaxed ${
                m.sender === 'ai'
                  ? 'msg-ai bg-[#243044] text-[#f8fafc] self-start rounded-tr-none border border-[#334155]'
                  : 'msg-user bg-[#4f46e5] text-white self-end rounded-tl-none shadow'
              }`}
            >
              <div className="whitespace-pre-line">{m.text}</div>

              {/* If AI requested ticket confirmation, render interactive inline form */}
              {m.isTicketPrompt && m.issueDraft && (
                <div className="mt-2.5 pt-2 border-t border-white/20 space-y-2">
                  <div className="text-[11px] text-amber-300 font-semibold">تأكيد البريد الإلكتروني لإرسال التذكرة:</div>
                  <input
                    type="email"
                    value={ticketEmailInput}
                    onChange={(e) => setTicketEmailInput(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full p-2 rounded-lg bg-[#0f172a] text-white text-xs border border-[#475569] outline-none dir-ltr text-left"
                  />
                  <button
                    type="button"
                    onClick={() => handleSubmitTicket(m.issueDraft!)}
                    className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1 shadow"
                  >
                    <SendHorizontal className="w-3.5 h-3.5" />
                    <span>إرسال التذكرة للإدارة والصيانة</span>
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* AI thinking state */}
          {isAiLoading && (
            <div className="msg-ai bg-[#243044] p-3 rounded-2xl rounded-tr-none text-xs self-start flex items-center gap-2 text-indigo-300 border border-[#334155]">
              <Loader2 className="w-4 h-4 animate-spin text-[#00e5ff]" />
              <span>جاري الرد...</span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Quick Prompt Chips */}
        <div className="px-3 py-1.5 bg-[#121927] border-t border-[#2a3548] flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
          <button
            onClick={() => {
              setChatInput('ما هو رقم بطاقتي؟');
            }}
            className="px-2 py-1 rounded-full bg-[#1e293b] hover:bg-[#28374e] text-amber-300 whitespace-nowrap border border-[#334155]"
          >
            💳 رقم بطاقتي
          </button>
          <button
            onClick={() => {
              setChatInput('كيف تتم حماية حسابي ورصيدي؟');
            }}
            className="px-2 py-1 rounded-full bg-[#1e293b] hover:bg-[#28374e] text-indigo-300 whitespace-nowrap border border-[#334155]"
          >
            🛡️ حماية الحساب
          </button>
          <button
            onClick={() => {
              setChatInput('ما هي أسعار البطاقات بالدينار العراقي؟');
            }}
            className="px-2 py-1 rounded-full bg-[#1e293b] hover:bg-[#28374e] text-slate-300 whitespace-nowrap border border-[#334155]"
          >
            💰 أسعار البطاقات
          </button>
        </div>

        {/* Chat Input (.chat-input, #chat-in) */}
        <form onSubmit={handleSendChatMsg} className="chat-input flex items-center p-2 bg-[#0f172a] border-t border-[#334155] gap-1.5">
          <input
            type="text"
            id="chat-in"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="اكتب استفسارك أو مشكلتك هنا..."
            className="flex-1 p-2.5 rounded-xl border border-[#334155] bg-[#1e293b] text-white text-xs outline-none focus:border-[#4f46e5]"
          />

          <button
            type="submit"
            disabled={isAiLoading || !chatInput.trim()}
            className="btn bg-[#4f46e5] hover:bg-[#4338ca] disabled:opacity-50 text-white text-xs px-4 py-2.5 rounded-xl font-bold transition flex items-center justify-center cursor-pointer"
          >
            إرسال
          </button>
        </form>
      </div>

      {/* ======================================================== */}
      {/* MODAL: LOGIN / REGISTER (Email & Password/Code)          */}
      {/* Only jafarmhmd04@gmail.com is granted Administrator role!*/}
      {/* ======================================================== */}
      {isLoginModalOpen && (
        <div
          className="modal fixed inset-0 z-[1500] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          id="login-modal"
          style={{ display: 'flex' }}
        >
          <div className="modal-content bg-[#1e293b] p-6 rounded-2xl border border-[#334155] w-full max-w-sm text-right shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#334155]">
              <div className="flex items-center gap-2 font-bold text-base text-white">
                <LogIn className="w-5 h-5 text-[#4f46e5]" />
                <h2>{authMode === 'login' ? 'تسجيل الدخول إلى الحساب' : 'إنشاء حساب جديد'}</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsLoginModalOpen(false)}
                className="text-[#94a3b8] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Toggle Mode */}
            <div className="flex bg-[#0f172a] p-1 rounded-xl mb-4 border border-[#334155] text-xs font-bold">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-1.5 rounded-lg transition ${
                  authMode === 'login' ? 'bg-[#4f46e5] text-white shadow' : 'text-[#94a3b8]'
                }`}
              >
                تسجيل الدخول
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className={`flex-1 py-1.5 rounded-lg transition ${
                  authMode === 'register' ? 'bg-[#4f46e5] text-white shadow' : 'text-[#94a3b8]'
                }`}
              >
                إنشاء حساب
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-3.5">
              {authMode === 'register' && (
                <div className="input-group">
                  <label className="block mb-1 text-xs font-semibold text-[#94a3b8]">اسمك الكامل</label>
                  <input
                    type="text"
                    value={regNameInput}
                    onChange={(e) => setRegNameInput(e.target.value)}
                    placeholder="أدخل اسمك"
                    className="w-full p-2.5 rounded-xl border border-[#334155] bg-[#0f172a] text-white text-xs outline-none focus:border-[#4f46e5]"
                    required
                  />
                </div>
              )}

              <div className="input-group">
                <label className="block mb-1 text-xs font-semibold text-[#94a3b8]">البريد الإلكتروني</label>
                <input
                  type="email"
                  id="username_input"
                  value={loginEmailInput}
                  onChange={(e) => setLoginEmailInput(e.target.value)}
                  placeholder="example@gmail.com"
                  className="w-full p-2.5 rounded-xl border border-[#334155] bg-[#0f172a] text-white text-xs outline-none focus:border-[#4f46e5] dir-ltr text-left"
                  required
                  autoFocus
                />
              </div>

              <div className="input-group">
                <label className="block mb-1 text-xs font-semibold text-[#94a3b8]">الرمز / كلمة المرور</label>
                <input
                  type="password"
                  id="password_input"
                  value={loginPassInput}
                  onChange={(e) => setLoginPassInput(e.target.value)}
                  placeholder="******"
                  className="w-full p-2.5 rounded-xl border border-[#334155] bg-[#0f172a] text-white text-xs outline-none focus:border-[#4f46e5]"
                  required
                />
              </div>

              {/* Demo test account helper strictly for regular customer */}
              <div className="p-2.5 rounded-xl bg-[#0f172a] border border-[#334155] text-xs flex items-center justify-between">
                <span className="text-[11px] text-[#94a3b8]">حساب تجريبي للزبائن:</span>
                <button
                  type="button"
                  onClick={() => handleFastLogin('user@corex.iq', '1234')}
                  className="text-slate-300 hover:text-white text-[11px] font-mono px-2 py-1 rounded bg-[#1e293b] border border-[#334155] cursor-pointer"
                >
                  user@corex.iq / 1234
                </button>
              </div>

              <div style={{ display: 'flex', gap: '10px' }} className="pt-2">
                <button
                  type="submit"
                  className="btn flex-1 bg-[#4f46e5] hover:bg-[#4338ca] text-white font-bold py-2.5 rounded-xl border-none cursor-pointer transition text-xs"
                >
                  {authMode === 'login' ? 'دخول' : 'إنشاء الحساب'}
                </button>
                <button
                  type="button"
                  className="btn btn-danger bg-[#ef4444] hover:bg-[#dc2626] text-white font-bold py-2.5 px-4 rounded-xl border-none cursor-pointer transition text-xs"
                  onClick={() => setIsLoginModalOpen(false)}
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: CONFIRM DELETE PRODUCT                            */}
      {/* ======================================================== */}
      {productToDelete && (
        <div className="fixed inset-0 z-[1500] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e293b] p-5 rounded-2xl border border-red-500/40 w-full max-w-sm text-center shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">تأكيد حذف السلعة</h3>
            <p className="text-xs text-[#94a3b8] mt-1">
              هل أنت متأكد من حذف السلعة: <br />
              <strong className="text-white text-sm font-bold">"{productToDelete.name}"</strong>؟
            </p>

            <div className="flex gap-2.5 mt-5">
              <button
                type="button"
                onClick={confirmDeleteProduct}
                className="btn btn-danger flex-1 bg-[#ef4444] hover:bg-[#dc2626] text-white font-bold py-2 rounded-xl border-none cursor-pointer transition text-xs"
              >
                نعم، احذف السلعة
              </button>
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="flex-1 bg-[#334155] hover:bg-[#475569] text-white font-bold py-2 rounded-xl border-none cursor-pointer transition text-xs"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: PURCHASE SUCCESS RECEIPT (STRICTLY IQD)            */}
      {/* ======================================================== */}
      {purchasedModalItem && (
        <div className="fixed inset-0 z-[1600] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e293b] p-6 rounded-2xl border border-emerald-500/40 w-full max-w-sm text-center shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 mx-auto mb-2 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-white">تمت عملية الشراء بنجاح!</h3>
            <p className="text-xs text-[#94a3b8] mt-1">{purchasedModalItem.title}</p>
            <div className="text-xs font-mono font-bold text-emerald-400 mt-0.5">
              السعر: {purchasedModalItem.price.toLocaleString()} د.ع
            </div>

            <div className="my-4 p-3 bg-[#0f172a] rounded-xl border border-[#334155]">
              <span className="text-[11px] text-[#94a3b8] block mb-1">كود البطاقة الرقمي (Digital Code):</span>
              <span className="font-mono text-base font-black text-emerald-400 tracking-wider select-all block">
                {purchasedModalItem.code}
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(purchasedModalItem.code, 'كود البطاقة')}
                className="mt-2.5 w-full py-2 rounded-lg bg-[#1e293b] hover:bg-[#283548] text-indigo-400 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition border border-[#334155]"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>نسخ الكود</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setPurchasedModalItem(null);
                setActiveTab('wallet');
              }}
              className="btn w-full py-2.5 rounded-xl bg-[#4f46e5] hover:bg-[#4338ca] text-white font-bold text-xs cursor-pointer transition shadow-md shadow-indigo-600/20"
            >
              عرض في محفظة الأكواد
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: SEND MONEY (USES "رقم بطاقة المستلم")              */}
      {/* ======================================================== */}
      {isSendModalOpen && (
        <div className="fixed inset-0 z-[1500] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e293b] p-5 rounded-2xl border border-[#334155] w-full max-w-sm text-right shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-[#334155] mb-3">
              <div className="flex items-center gap-2 font-bold text-sm text-white">
                <Send className="w-4 h-4 text-blue-400" />
                <span>إرسال أموال بين البطاقات</span>
              </div>
              <button onClick={() => setIsSendModalOpen(false)} className="text-[#94a3b8] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleProcessSend} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#94a3b8] mb-1">
                  رقم بطاقة المستلم (المكون من 10 أرقام)
                </label>
                <input
                  type="text"
                  maxLength={10}
                  value={sendRecipientCardNumber}
                  onChange={(e) => setSendRecipientCardNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="أدخل رقم بطاقة المستلم (مثال: 7492018432)"
                  className="w-full p-2.5 rounded-xl border border-[#334155] bg-[#0f172a] text-white text-xs outline-none font-mono"
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <label className="text-[#94a3b8]">المبلغ بالدينار العراقي (1000 - 50000 د.ع)</label>
                  <span className="text-emerald-400 font-mono">رصيدك: {userData.balance.toLocaleString()} د.ع</span>
                </div>
                <input
                  type="number"
                  min="1000"
                  max="50000"
                  value={sendAmountInput}
                  onChange={(e) => setSendAmountInput(e.target.value)}
                  placeholder="المبلغ بالدينار"
                  className="w-full p-2.5 rounded-xl border border-[#334155] bg-[#0f172a] text-white text-xs outline-none font-mono"
                  required
                />
              </div>

              {/* Fast IQD chips */}
              <div className="flex items-center gap-1.5 justify-center py-1">
                {[5000, 10000, 25000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setSendAmountInput(amt.toString())}
                    className="px-2.5 py-1 rounded-lg bg-[#0f172a] hover:bg-[#253248] text-[10px] text-emerald-400 font-mono border border-[#334155]"
                  >
                    {amt.toLocaleString()} د.ع
                  </button>
                ))}
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="btn flex-1 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold py-2 rounded-xl text-xs"
                >
                  إرسال الآن
                </button>
                <button
                  type="button"
                  onClick={() => setIsSendModalOpen(false)}
                  className="bg-[#334155] hover:bg-[#475569] text-white font-bold py-2 px-4 rounded-xl text-xs"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: RECHARGE BALANCE (STRICTLY VIA PAYMENT GATEWAYS)   */}
      {/* "واي شخص ما يصير يعبى بطاقته الى عن طريق بوابات دفع      */}
      {/*  ولا يتوفر بوابات دفع قريباً"                             */}
      {/* ======================================================== */}
      {isRechargeModalOpen && (
        <div className="fixed inset-0 z-[1500] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e293b] p-5 sm:p-6 rounded-2xl border border-[#334155] w-full max-w-md text-right shadow-2xl animate-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#334155]">
              <div className="flex items-center gap-2 font-bold text-base text-white">
                <PlusCircle className="w-5 h-5 text-amber-400" />
                <span>تعبئة رصيد المحفظة والبطاقة</span>
              </div>
              <button onClick={() => setIsRechargeModalOpen(false)} className="text-[#94a3b8] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Official Gateway Warning / Notice */}
            <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-amber-300">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                <span>بوابات الدفع الإلكتروني غير متوفرة حالياً</span>
              </div>
              <p className="leading-relaxed">
                تنبيه نظام المتجر: لا يمكن لأي شخص تعبئة بطاقته ومحفظته إلا عن طريق بوابات الدفع الإلكترونية الرسمية المعتمدة (زين كاش، آسيا حوالة، كي كارد، ماستركارد/فيزا).
              </p>
              <div className="pt-1 flex items-center gap-1.5 font-bold text-amber-400">
                <Clock className="w-3.5 h-3.5" />
                <span>حالة البوابات: قيد الربط البرمجي وستتوفر قريباً جداً ⏳</span>
              </div>
            </div>

            {/* Current Balance Display */}
            <div className="p-3 bg-[#0f172a] rounded-xl border border-[#334155] flex items-center justify-between text-xs">
              <span className="text-[#94a3b8]">رصيدك الحالي:</span>
              <span className="font-mono font-bold text-base text-amber-400">
                {userData.balance.toLocaleString()} د.ع
              </span>
            </div>

            {/* Supported Upcoming Gateways Grid (Disabled / Coming Soon) */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-[#94a3b8] block">بوابات الدفع المعتمدة (ستتوفر قريباً):</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-[#0f172a] border border-[#334155] opacity-60 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                  <span className="text-white font-bold">زين كاش (ZainCash)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#0f172a] border border-[#334155] opacity-60 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                  <span className="text-white font-bold">آسيا حوالة (AsiaHawala)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#0f172a] border border-[#334155] opacity-60 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                  <span className="text-white font-bold">كي كارد (Qi Card)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#0f172a] border border-[#334155] opacity-60 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                  <span className="text-white font-bold">فيزا / ماستركارد</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-[#334155]">
              <button
                type="button"
                onClick={() => {
                  setIsRechargeModalOpen(false);
                  handleSubmitTicket(`طلب إشعار فور إطلاق بوابات الدفع الإلكتروني لرقم بطاقتي: ${userData.cardNumber}`);
                  showToast('تم تسجيل رغبتك', 'سيتم إشعارك فور تفعيل بوابات الدفع لشحن رصيد بطاقتك.', 'info');
                }}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <SendHorizontal className="w-4 h-4" />
                <span>إشعار الإدارة برغبتي في التعبئة عند الإطلاق</span>
              </button>

              <button
                type="button"
                onClick={() => setIsRechargeModalOpen(false)}
                className="w-full py-2.5 rounded-xl bg-[#334155] hover:bg-[#475569] text-white text-xs font-bold transition"
              >
                حسناً، فهمت
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADMIN MANUAL TOP-UP FOR A USER                    */}
      {/* ======================================================== */}
      {adminTopUpUser && (
        <div className="fixed inset-0 z-[1600] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e293b] p-6 rounded-2xl border border-emerald-500/40 w-full max-w-sm text-right shadow-2xl animate-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#334155]">
              <div className="flex items-center gap-2 font-bold text-sm text-white">
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>شحن رصيد إداري يدوي</span>
              </div>
              <button onClick={() => setAdminTopUpUser(null)} className="text-[#94a3b8] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-[#0f172a] rounded-xl border border-[#334155] text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-[#94a3b8]">اسم الشخص:</span>
                <span className="font-bold text-white">{adminTopUpUser.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#94a3b8]">البريد الإلكتروني:</span>
                <span className="font-mono text-white dir-ltr">{adminTopUpUser.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#94a3b8]">رقم بطاقتهم:</span>
                <span className="font-mono font-bold text-amber-400">{adminTopUpUser.cardNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#94a3b8]">الرصيد الحالي:</span>
                <span className="font-mono font-bold text-emerald-400">{adminTopUpUser.balance.toLocaleString()} د.ع</span>
              </div>
            </div>

            <form onSubmit={handleAdminTopUpSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#94a3b8] mb-1">
                  المبلغ المراد إضافته بالدينار العراقي (د.ع)
                </label>
                <input
                  type="number"
                  min="1000"
                  step="500"
                  value={adminTopUpAmount}
                  onChange={(e) => setAdminTopUpAmount(e.target.value)}
                  placeholder="المبلغ بالدينار"
                  className="w-full p-2.5 rounded-xl border border-[#334155] bg-[#0f172a] text-white text-xs outline-none font-mono"
                  required
                />
              </div>

              <div className="flex gap-2">
                {[10000, 25000, 50000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAdminTopUpAmount(amt.toString())}
                    className="flex-1 py-1 rounded bg-[#0f172a] hover:bg-[#223046] text-[11px] text-emerald-400 font-mono border border-[#334155]"
                  >
                    +{amt.toLocaleString()}
                  </button>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition"
                >
                  تأكيد الشحن الإداري
                </button>
                <button
                  type="button"
                  onClick={() => setAdminTopUpUser(null)}
                  className="px-4 py-2.5 rounded-xl bg-[#334155] hover:bg-[#475569] text-white font-bold text-xs"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: VIEW STORED USER ACCOUNT DETAILS                  */}
      {/* ======================================================== */}
      {viewingUserAccount && (
        <div className="fixed inset-0 z-[1600] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e293b] p-6 rounded-2xl border border-indigo-500/40 w-full max-w-md text-right shadow-2xl animate-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#334155]">
              <div className="flex items-center gap-2 font-bold text-sm text-white">
                <Eye className="w-4 h-4 text-indigo-400" />
                <span>تقرير حساب ومعلومات المستخدم</span>
              </div>
              <button onClick={() => setViewingUserAccount(null)} className="text-[#94a3b8] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#0f172a] rounded-xl border border-[#334155] space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[#94a3b8]">اسم صاحب الحساب:</span>
                  <span className="font-bold text-white text-sm">{viewingUserAccount.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#94a3b8]">البريد الإلكتروني:</span>
                  <span className="font-mono text-white dir-ltr">{viewingUserAccount.email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#94a3b8]">رقم بطاقتهم:</span>
                  <span className="font-mono font-bold text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
                    {viewingUserAccount.cardNumber}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#94a3b8]">الرصيد الحالي:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {viewingUserAccount.balance.toLocaleString()} د.ع
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-[#0f172a] rounded-xl border border-[#334155]">
                  <span className="text-[#94a3b8] block mb-1">شكد حولوا (التحويلات):</span>
                  <div className="font-mono font-bold text-amber-400 text-sm">
                    {viewingUserAccount.totalTransferred.toLocaleString()} د.ع
                  </div>
                  <span className="text-[10px] text-[#94a3b8] mt-0.5 block">
                    عدد التحويلات: {viewingUserAccount.transfersCount}
                  </span>
                </div>

                <div className="p-3 bg-[#0f172a] rounded-xl border border-[#334155]">
                  <span className="text-[#94a3b8] block mb-1">شكد سحبوا / اشتروا:</span>
                  <div className="font-mono font-bold text-indigo-300 text-sm">
                    {viewingUserAccount.totalWithdrawnOrSpent.toLocaleString()} د.ع
                  </div>
                  <span className="text-[10px] text-[#94a3b8] mt-0.5 block">
                    عدد العمليات: {viewingUserAccount.purchasesCount}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-xl flex items-center justify-between">
                <span className="text-emerald-300 font-bold">العمولات المستقطعة لحساب المتجر:</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  +{viewingUserAccount.totalCommission.toLocaleString()} د.ع
                </span>
              </div>

              <div className="flex justify-between text-[11px] text-[#94a3b8] pt-1">
                <span>تاريخ الانضمام: {viewingUserAccount.joinedDate}</span>
                <span>آخر نشاط: {viewingUserAccount.lastActive}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#334155]">
              <button
                type="button"
                onClick={() => setViewingUserAccount(null)}
                className="w-full py-2.5 rounded-xl bg-[#334155] hover:bg-[#475569] text-white text-xs font-bold"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: CUSTOMER NOTIFICATIONS CENTER                     */}
      {/* ======================================================== */}
      {isNotificationsOpen && (
        <div className="fixed inset-0 z-[1600] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e293b] p-5 sm:p-6 rounded-2xl border border-amber-500/40 w-full max-w-md text-right shadow-2xl animate-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between pb-3 border-b border-[#334155]">
              <div className="flex items-center gap-2 font-bold text-base text-white">
                <Bell className="w-5 h-5 text-amber-400" />
                <span>مركز الإشعارات والعمليات</span>
              </div>
              <button onClick={() => setIsNotificationsOpen(false)} className="text-[#94a3b8] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between py-2 text-xs">
              <span className="text-[#94a3b8]">
                إشعاراتك الخاصة ورسائل الإدارة المعتمدة
              </span>
              <button
                type="button"
                onClick={() => {
                  setNotifications((prev) =>
                    prev.map((n) =>
                      n.targetEmail === 'all' || n.targetEmail === userData.email
                        ? { ...n, isRead: true }
                        : n
                    )
                  );
                  showToast('تم التحديث', 'تم تعيين جميع الإشعارات كمقروءة.', 'info');
                }}
                className="text-xs text-indigo-400 hover:text-white font-bold cursor-pointer"
              >
                تعيين الكل كمقروء ✓
              </button>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto space-y-2.5 my-2 pr-1">
              {notifications.filter((n) => n.targetEmail === 'all' || n.targetEmail === userData.email).length === 0 ? (
                <div className="text-center py-12 text-xs text-[#94a3b8]">
                  لا توجد إشعارات جديدة حالياً.
                </div>
              ) : (
                notifications
                  .filter((n) => n.targetEmail === 'all' || n.targetEmail === userData.email)
                  .map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3 rounded-xl border text-xs transition ${
                        notif.isRead
                          ? 'bg-[#0f172a] border-[#334155] text-slate-300'
                          : 'bg-[#1a2538] border-amber-500/40 text-white shadow-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2 font-bold text-sm">
                          {notif.type === 'deduction' && <ArrowUpRight className="w-4 h-4 text-red-400" />}
                          {notif.type === 'transfer' && <Send className="w-4 h-4 text-blue-400" />}
                          {notif.type === 'addition' && <PlusCircle className="w-4 h-4 text-emerald-400" />}
                          {notif.type === 'admin_broadcast' && <Megaphone className="w-4 h-4 text-pink-400" />}
                          <span>{notif.title}</span>
                        </div>
                        <span className="text-[10px] text-[#94a3b8] font-mono">{notif.date}</span>
                      </div>
                      <p className="text-xs text-[#94a3b8] leading-relaxed pr-6">{notif.message}</p>
                    </div>
                  ))
              )}
            </div>

            <div className="pt-3 border-t border-[#334155] flex gap-2">
              <button
                type="button"
                onClick={() => setIsNotificationsOpen(false)}
                className="w-full py-2.5 rounded-xl bg-[#334155] hover:bg-[#475569] text-white text-xs font-bold transition"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Real Google AdSense Interstitial Popup (Only when enabled by owner and visitor not ad-free) */}
      {randomPopupAd && adsenseSettings.isAdsEnabled && !userData.isAdFreeSubscriber && (
        <GoogleAdSenseUnit
          slotType="interstitial"
          settings={adsenseSettings}
          onAdImpression={handleAdSenseImpression}
          onAdClick={handleAdSenseClick}
          onCloseInterstitial={() => setRandomPopupAd(null)}
        />
      )}

      {/* ======================================================== */}
      {/* MODAL: PLUS SUBSCRIPTION (2,000 / 15,000 IQD)            */}
      {/* إلغاء الإعلانات 100% • 50 د.ع يومياً • معاملات غير محدودة */}
      {/* ======================================================== */}
      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        userData={userData}
        onSubscribe={handleSubscribeAdFree}
        onOpenRecharge={() => setIsRechargeModalOpen(true)}
        onOpenArchitectureDocs={() => setIsArchitectureModalOpen(true)}
        onCancelSubscription={() => setIsCancelConfirmModalOpen(true)}
        onReactivateSubscription={handleReactivateSubscription}
      />

      {/* ======================================================== */}
      {/* MODAL: CONFIRM PLUS SUBSCRIPTION CANCELLATION            */}
      {/* cancel_subscription API Endpoint Flow                    */}
      {/* ======================================================== */}
      {isCancelConfirmModalOpen && (
        <div className="fixed inset-0 z-[2900] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e293b] p-6 rounded-2xl border border-red-500/40 w-full max-w-md text-right shadow-2xl animate-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#334155]">
              <div className="flex items-center gap-2 font-bold text-base text-red-400">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <span>تأكيد إلغاء اشتراك بلس (Cancel Subscription)</span>
              </div>
              <button
                onClick={() => setIsCancelConfirmModalOpen(false)}
                className="text-[#94a3b8] hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <p className="text-slate-300">
                هل أنت متأكد من رغبتك في إلغاء التجديد التلقائي لـ <strong className="text-white">اشتراك بلس (Plus Subscription)</strong>؟
              </p>

              <div className="p-3.5 bg-[#0f172a] rounded-xl border border-[#334155] space-y-2 font-mono text-[11px]">
                <div className="flex justify-between items-center">
                  <span className="text-[#94a3b8] font-sans">حالة الاشتراك الحالية:</span>
                  <span className="font-bold text-amber-300 font-sans">Plus Subscription (اشتراك بلس)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#94a3b8] font-sans">تاريخ انتهاء الصلاحية المحدد:</span>
                  <span className="font-bold text-white">{userData.subscriptionExpiry}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#94a3b8] font-sans">المدة المتبقية للاستفادة:</span>
                  <span className="font-bold text-emerald-400 font-sans">
                    {getSubscriptionExpirationDetails()?.durationText || 'غير محدد'}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-amber-950/30 border border-amber-500/30 rounded-xl text-amber-200 text-[11px] space-y-1">
                <span className="font-bold block text-amber-300 font-sans">معلومات وضمانات الإلغاء:</span>
                <p>
                  • لن تخسر أي يوم مدفوع: ستظل جميع مزايا Plus (حجب الإعلانات 100%، مكافأة 50 د.ع اليومية، والعمليات غير المحدودة) فعالة بالكامل حتى تاريخ انتهاء الصلاحية المحدد أعلاه.
                </p>
                <p>
                  • سيتم إيقاف التجديد التلقائي عبر نقطة النهاية البرمجية (<code className="text-amber-300 font-mono">POST /cancel_subscription</code>) ولن يتم خصم أي مبالغ لاحقاً.
                </p>
              </div>
            </div>

            <div className="flex gap-2.5 pt-2 border-t border-[#334155]">
              <button
                type="button"
                onClick={handleCancelSubscription}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition shadow-md cursor-pointer"
              >
                تأكيد إلغاء التجديد
              </button>
              <button
                type="button"
                onClick={() => setIsCancelConfirmModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-[#334155] hover:bg-[#475569] text-white font-bold text-xs transition cursor-pointer"
              >
                إبقاء الاشتراك
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: PLUS ARCHITECTURE & REST API TEST CONSOLE         */}
      {/* ======================================================== */}
      <PlusArchitectureModal
        isOpen={isArchitectureModalOpen}
        onClose={() => setIsArchitectureModalOpen(false)}
        currentUserId={userData.email || 'usr-default'}
      />

      {/* ======================================================== */}
      {/* MODAL: ETHICAL CHARTER & AD PREFERENCES                  */}
      {/* ======================================================== */}
      <EthicalCharterModal
        isOpen={isCharterModalOpen}
        onClose={() => setIsCharterModalOpen(false)}
        selectedCategories={preferredCategories}
        onToggleCategory={(cat) => {
          setPreferredCategories((prev) =>
            prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
          );
        }}
      />
    </div>
  );
}
