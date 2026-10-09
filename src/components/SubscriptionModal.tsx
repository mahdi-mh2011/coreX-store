import React, { useState } from 'react';
import {
  Crown,
  Sparkles,
  Check,
  X,
  ShieldCheck,
  Zap,
  Wallet,
  Calendar,
  AlertCircle,
  Coins,
  Infinity as InfinityIcon,
  CreditCard,
  Smartphone,
  CheckCircle2,
  Loader2,
  Lock,
} from 'lucide-react';
import { UserData } from '../App';

export interface SubscriptionPlan {
  id: 'monthly' | 'yearly';
  title: string;
  englishTitle: string;
  price: number;
  period: string;
  durationDays: number;
  badge?: string;
  savings?: string;
  description: string;
}

export const PLUS_SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'monthly',
    title: 'اشتراك بلس الشهري',
    englishTitle: 'Plus Monthly Plan',
    price: 2000,
    period: 'شهر (30 يوماً)',
    durationDays: 30,
    badge: 'الأكثر مرونة',
    description: 'تجديد كل 30 يوماً بقيمة 2,000 د.ع عبر بوابات الدفع الإلكتروني مع تصفح خالٍ تماماً من الإعلانات ومكافأة 50 د.ع يومياً.',
  },
  {
    id: 'yearly',
    title: 'اشتراك بلس السنوي (VIP)',
    englishTitle: 'Plus Yearly Plan',
    price: 15000,
    period: 'سنة (365 يوماً)',
    durationDays: 365,
    badge: 'الأوفر قيمة ⭐',
    savings: 'وفر 9,000 د.ع (خصم 38%)',
    description: 'تجديد سنوي كل 365 يوماً بقيمة 15,000 د.ع فقط عبر بوابات الدفع الإلكتروني مع كافة مزايا باقة بلس الذهبية غير المحدودة.',
  },
];

export interface PaymentGatewayOption {
  id: string;
  name: string;
  englishName: string;
  icon: string;
  badge: string;
  placeholder: string;
}

export const PAYMENT_GATEWAYS: PaymentGatewayOption[] = [
  {
    id: 'zaincash',
    name: 'زين كاش (ZainCash)',
    englishName: 'ZainCash Iraq',
    icon: '📱',
    badge: 'فوري ومعتمد',
    placeholder: 'أدخل رقم هاتف محفظة زين كاش (078xxxxxxxx)',
  },
  {
    id: 'fastpay',
    name: 'فاست بي (FastPay)',
    englishName: 'FastPay Wallet',
    icon: '📲',
    badge: 'دفع رقمي سريع',
    placeholder: 'أدخل رقم هاتف حساب FastPay (07xxxxxxxxx)',
  },
  {
    id: 'fib',
    name: 'مصرف العراق الأول (FIB)',
    englishName: 'First Iraqi Bank',
    icon: '🏛️',
    badge: 'تطبيق FIB المباشر',
    placeholder: 'أدخل رقم الحساب أو الآيبان في FIB',
  },
  {
    id: 'qicard',
    name: 'كي كارد (Qi Card)',
    englishName: 'Qi Card Mastercard',
    icon: '💳',
    badge: 'مصرف الرافدين / الرشيد',
    placeholder: 'أدخل رقم بطاقة كي كارد أو رقم الهاتف المسجل',
  },
  {
    id: 'visa_master',
    name: 'فيزا / ماستركارد (Visa/Mastercard)',
    englishName: 'Bank Cards',
    icon: '🌐',
    badge: 'البطاقات الدولية',
    placeholder: 'أدخل رقم البطاقة المصرفية المكون من 16 رقماً',
  },
];

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: UserData;
  onSubscribe: (plan: 'monthly' | 'yearly', gatewayName?: string, transactionRef?: string) => void;
  onOpenRecharge: () => void;
  onOpenArchitectureDocs?: () => void;
  onCancelSubscription?: () => void;
  onReactivateSubscription?: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  userData,
  onSubscribe,
  onOpenRecharge,
  onOpenArchitectureDocs,
  onCancelSubscription,
  onReactivateSubscription,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
  const [selectedGateway, setSelectedGateway] = useState<string>('zaincash');
  const [gatewayIdentifier, setGatewayIdentifier] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [paymentSuccessData, setPaymentSuccessData] = useState<{
    gatewayName: string;
    reference: string;
    plan: 'monthly' | 'yearly';
  } | null>(null);

  if (!isOpen) return null;

  const currentPlan = PLUS_SUBSCRIPTION_PLANS.find((p) => p.id === selectedPlan)!;
  const currentGateway = PAYMENT_GATEWAYS.find((g) => g.id === selectedGateway)!;
  const isCurrentlySubscribed = !!userData?.isAdFreeSubscriber;

  const handleStartGatewayPayment = () => {
    setIsProcessing(true);
    // Simulate secure hand-off and processing with payment gateway
    setTimeout(() => {
      const randomRef =
        currentGateway.id.toUpperCase().slice(0, 4) +
        '-' +
        Math.floor(100000 + Math.random() * 900000);
      setIsProcessing(false);
      setPaymentSuccessData({
        gatewayName: currentGateway.name,
        reference: randomRef,
        plan: selectedPlan,
      });

      // Complete subscription without deducting from app wallet balance
      onSubscribe(selectedPlan, currentGateway.name, randomRef);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[2800] bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-3 animate-in fade-in duration-200">
      <div className="bg-[#111827] border-2 border-amber-500/50 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden text-right flex flex-col max-h-[92vh]">
        {/* Header with Golden Crown & Plus Gradient */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 p-5 text-black relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-black/20 backdrop-blur border border-black/10 flex items-center justify-center shadow-inner">
              <Crown className="w-7 h-7 text-white fill-white drop-shadow" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-lg font-black tracking-tight text-white drop-shadow-sm">
                  اشتراك باقة بلس (Plus VIP)
                </h3>
                <span className="text-[10px] font-bold bg-black text-amber-300 px-2 py-0.5 rounded-full font-mono uppercase tracking-wider">
                  بوابات الدفع
                </span>
              </div>
              <p className="text-xs text-amber-950 font-semibold mt-0.5">
                إلغاء الإعلانات 100% • دفع حصري عبر بوابات الدفع دون لمس رصيد محفظتك
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setPaymentSuccessData(null);
              onClose();
            }}
            className="p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition cursor-pointer"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs flex-1">
          {/* Active status indicator if already subscribed */}
          {isCurrentlySubscribed && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/50 via-[#1e293b] to-yellow-950/40 border border-amber-500/40 space-y-3">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2.5">
                  <Crown className="w-5 h-5 text-amber-400 fill-amber-400 shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#94a3b8] text-[11px]">حالة الاشتراك:</span>
                      <strong className="text-amber-300 font-bold text-xs">
                        اشتراك بلس نشط 👑
                      </strong>
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                          userData.cancellationRequested
                            ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                            : 'bg-amber-400 text-black'
                        }`}
                      >
                        {userData.cancellationRequested ? 'تم طلب الإلغاء' : 'نشط ✓'}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-300 mt-0.5">
                      نوع الباقة الحالية:{' '}
                      <span className="text-white font-bold">
                        {userData.subscriptionPlan === 'yearly'
                          ? 'الباقة السنوية (VIP 365 يوماً)'
                          : 'الباقة الشهرية (30 يوماً)'}
                      </span>
                    </div>
                  </div>
                </div>

                {userData.subscriptionExpiry && (
                  <div className="text-left font-mono">
                    <span className="text-[10px] text-[#94a3b8] block">تاريخ الانتهاء:</span>
                    <span className="text-[11px] font-bold text-amber-300 bg-black/40 px-2 py-0.5 rounded border border-amber-500/30">
                      {userData.subscriptionExpiry}
                    </span>
                  </div>
                )}
              </div>

              {/* Cancellation or Reactivation option */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2 flex-wrap text-[11px]">
                <span className="text-slate-400 text-[10px]">
                  {userData.cancellationRequested
                    ? '⚠️ تم إيقاف التجديد التلقائي. المزايا مستمرة حتى نهاية المدة.'
                    : 'يمكنك إلغاء الاشتراك في أي وقت مع الاحتفاظ بالمزايا حتى نهاية المدة.'}
                </span>

                {!userData.cancellationRequested && onCancelSubscription && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onCancelSubscription();
                    }}
                    className="px-2.5 py-1 rounded-lg bg-red-950/50 hover:bg-red-900/70 border border-red-500/40 text-red-300 hover:text-white transition font-bold text-[11px] cursor-pointer"
                  >
                    إلغاء الاشتراك (Cancel)
                  </button>
                )}

                {userData.cancellationRequested && onReactivateSubscription && (
                  <button
                    type="button"
                    onClick={() => {
                      onReactivateSubscription();
                    }}
                    className="px-2.5 py-1 rounded-lg bg-emerald-950/50 hover:bg-emerald-900/70 border border-emerald-500/40 text-emerald-300 hover:text-white transition font-bold text-[11px] cursor-pointer"
                  >
                    استئناف التجديد
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Success receipt screen after payment */}
          {paymentSuccessData && (
            <div className="p-4 rounded-2xl bg-emerald-950/40 border-2 border-emerald-500/50 space-y-3 animate-in zoom-in-95">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>تم تأكيد الدفع وتفعيل باقة Plus بنجاح! 👑</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                تم استلام الدفعة مباشرة عبر <strong className="text-emerald-300">{paymentSuccessData.gatewayName}</strong> بنجاح.
                <strong className="text-white block mt-1">
                  لم يتم خصم أي دينار من رصيد محفظتك الداخلي (رصيدك الحالي محفوظ بالكامل).
                </strong>
              </p>
              <div className="p-2.5 rounded-xl bg-black/40 border border-emerald-500/30 flex items-center justify-between text-xs font-mono">
                <span className="text-[#94a3b8]">رقم إيصال المعاملة:</span>
                <span className="text-emerald-300 font-bold">{paymentSuccessData.reference}</span>
              </div>
            </div>
          )}

          {/* Pricing Plans Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[#94a3b8] text-[11px] px-1 font-bold">
              <span>اختر باقة الاشتراك:</span>
              <span className="text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded-full text-[10px]">
                دفع إلكتروني مباشر فقط
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {PLUS_SUBSCRIPTION_PLANS.map((plan) => {
                const isSelected = selectedPlan === plan.id;
                return (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`p-3.5 rounded-2xl border-2 text-right transition cursor-pointer relative flex flex-col justify-between gap-2 text-xs ${
                      isSelected
                        ? 'bg-gradient-to-b from-amber-950/40 to-[#1e293b] border-amber-400 shadow-lg shadow-amber-500/10'
                        : 'bg-[#1e293b]/70 border-[#334155] hover:border-slate-500'
                    }`}
                  >
                    {/* Top row with badge */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected
                              ? 'border-amber-400 bg-amber-400 text-black'
                              : 'border-slate-500 text-transparent'
                          }`}
                        >
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                        <span className="font-bold text-white text-xs">{plan.title}</span>
                      </div>

                      {plan.badge && (
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                            plan.id === 'yearly'
                              ? 'bg-amber-400 text-black shadow-sm font-semibold'
                              : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          }`}
                        >
                          {plan.badge}
                        </span>
                      )}
                    </div>

                    {/* Price display */}
                    <div className="flex items-baseline justify-between pt-1 border-t border-[#334155]/60">
                      <div>
                        <span className="text-lg font-black text-amber-400 font-mono">
                          {plan.price.toLocaleString()}
                        </span>
                        <span className="text-[11px] text-white mr-1 font-bold">د.ع</span>
                        <span className="text-[10px] text-[#94a3b8] mr-1">/ {plan.period}</span>
                      </div>

                      {plan.savings && (
                        <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-1.5 py-0.5 rounded-md">
                          وفر 38%
                        </span>
                      )}
                    </div>

                    <p className="text-[10px] text-slate-300 leading-relaxed line-clamp-2">
                      {plan.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Payment Gateways Unavailable Notice ("واجعل غير متوفر بوابه دفع الان لا يمكنه الاشتراك") */}
          <div className="p-4 rounded-2xl bg-amber-950/30 border-2 border-amber-500/50 space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-amber-500/30">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
                <span className="font-bold text-xs text-white">حالة بوابات الدفع الإلكترونية:</span>
              </div>
              <span className="text-[10px] bg-red-500/20 text-red-300 px-2.5 py-0.5 rounded-full font-bold border border-red-500/40">
                غير متوفرة حالياً 🔒
              </span>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-amber-500/30 space-y-2 text-xs leading-relaxed">
              <p className="text-amber-200 font-bold">
                ⚠️ خدمة الدفع الإلكتروني للاشتراك غير متوفرة حالياً:
              </p>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                نعتذر منكم، بوابات الدفع الإلكترونية (زين كاش ZainCash، فاست بي FastPay، مصرف العراق الأول FIB، وبطاقات كي كارد Qi Card) <strong className="text-white">قيد الربط والتحديث الفني حالياً ولا يمكن الاشتراك الذاتي في الوقت الراهن</strong>.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/40 text-[11px] text-indigo-200 flex items-start gap-2.5">
              <Crown className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong className="text-white block mb-0.5">تفعيل الاشتراك من حساب المطور والإدارة:</strong>
                يمكن لمطور المتجر تفعيل باقة بلس (Plus VIP) لحسابك مباشرة ومجاناً <strong className="text-amber-300">عن طريق رقم بطاقتك المكون من 10 أرقام</strong> من خلال لوحة التحكم الإدارية.
              </div>
            </div>

            {/* Grayed out / disabled gateway badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 opacity-60">
              <div className="p-2 rounded-xl bg-[#1e293b] border border-[#334155] text-center text-[10px] text-slate-400">
                <span>📱 زين كاش</span>
                <span className="block text-[8px] text-red-400 mt-0.5">معطلة مؤقتاً</span>
              </div>
              <div className="p-2 rounded-xl bg-[#1e293b] border border-[#334155] text-center text-[10px] text-slate-400">
                <span>📲 فاست بي</span>
                <span className="block text-[8px] text-red-400 mt-0.5">معطلة مؤقتاً</span>
              </div>
              <div className="p-2 rounded-xl bg-[#1e293b] border border-[#334155] text-center text-[10px] text-slate-400">
                <span>🏛️ FIB</span>
                <span className="block text-[8px] text-red-400 mt-0.5">معطلة مؤقتاً</span>
              </div>
              <div className="p-2 rounded-xl bg-[#1e293b] border border-[#334155] text-center text-[10px] text-slate-400">
                <span>💳 كي كارد</span>
                <span className="block text-[8px] text-red-400 mt-0.5">معطلة مؤقتاً</span>
              </div>
            </div>
          </div>

          {/* Plus Member Features */}
          <div className="p-3.5 rounded-2xl bg-[#0f172a] border border-[#334155] space-y-2.5">
            <h4 className="font-bold text-xs text-white flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>مزايا عضوية Plus VIP الرسمية:</span>
              </span>
              <span className="text-[10px] text-amber-400 font-mono">Plus Tier Entitlements</span>
            </h4>
            <div className="space-y-2 text-[11px]">
              {/* Feature 1: Ad-Free */}
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white flex items-center gap-1">
                    <span>تجربة خالية تماماً من الإعلانات (Ad-Free Experience)</span>
                    <span className="text-[9px] bg-emerald-950 text-emerald-300 px-1.5 py-0.2 rounded font-mono">100% Zero Ads</span>
                  </div>
                  <p className="text-slate-400 text-[10px] mt-0.5">
                    إلغاء وحجب جميع إعلانات Google AdSense والبوابات والنوافذ الترويجية بالكامل فور تفعيل الاشتراك.
                  </p>
                </div>
              </div>

              {/* Feature 2: Daily 50 IQD Rewards */}
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Coins className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white flex items-center gap-1">
                    <span>مكافآت نقدية يومية 50 د.ع كل 24 ساعة (Daily Rewards)</span>
                    <span className="text-[9px] bg-amber-950 text-amber-300 px-1.5 py-0.2 rounded font-mono">+50 IQD / Day</span>
                  </div>
                  <p className="text-slate-400 text-[10px] mt-0.5">
                    صرف تلقائي بقيمة 50 دينار عراقي في محفظتك كل 24 ساعة عند تسجيل الدخول كهدية خاصة لمشتركي بلس.
                  </p>
                </div>
              </div>

              {/* Feature 3: Unlimited Transactions */}
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                  <InfinityIcon className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white flex items-center gap-1">
                    <span>معاملات شراء يومية غير محدودة (Unlimited Transactions)</span>
                    <span className="text-[9px] bg-blue-950 text-blue-300 px-1.5 py-0.2 rounded font-mono">Unconstrained</span>
                  </div>
                  <p className="text-slate-400 text-[10px] mt-0.5">
                    عمليات شراء غير محدودة دون أي قيود على عدد البطاقات اليومية.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-[#0f172a] border-t border-[#334155] flex flex-col sm:flex-row gap-2.5">
          <button
            type="button"
            disabled={true}
            className="flex-1 py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 bg-[#1e293b] text-slate-400 border border-slate-700/80 cursor-not-allowed opacity-90 shadow-inner"
            title="بوابات الدفع الإلكترونية قيد الصيانة والربط حالياً ولا يمكن الاشتراك الذاتي الآن"
          >
            <Lock className="w-4 h-4 text-amber-400" />
            <span>بوابات الدفع غير متوفرة حالياً - لا يمكن الاشتراك الذاتي الآن 🔒</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setPaymentSuccessData(null);
              onClose();
            }}
            className="px-5 py-3 rounded-xl bg-[#334155] hover:bg-[#475569] text-white font-bold text-xs transition cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

