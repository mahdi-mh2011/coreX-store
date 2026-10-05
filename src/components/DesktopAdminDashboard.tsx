import React, { useState } from 'react';
import {
  ShieldCheck,
  Users,
  Megaphone,
  Plus,
  MessageSquare,
  Sparkles,
  Smartphone,
  LogOut,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  Search,
  Eye,
  Trash2,
  Check,
  CreditCard,
  Send,
  AlertTriangle,
  Monitor,
  Crown,
  Code2,
} from 'lucide-react';
import { StoredUserAccount, Product, SupportTicket, AppNotification, ADMIN_EMAIL } from '../App';
import { EthicalAd, AdSystemStats } from '../data/ethicalAds';
import { AdSenseSettings } from '../data/adsenseConfig';
import { AdminAdRevenueSubTab } from './AdminAdRevenueSubTab';

interface DesktopAdminDashboardProps {
  storedUsers: StoredUserAccount[];
  products: Product[];
  tickets: SupportTicket[];
  notifications: AppNotification[];
  ethicalAds: EthicalAd[];
  adStats: AdSystemStats;
  adsenseSettings: AdSenseSettings;
  onUpdateAdSenseSettings: (newSettings: AdSenseSettings) => void;
  onAddProduct: (name: string, price: number, img: string) => void;
  onDeleteProduct: (product: Product) => void;
  onSendBroadcast: (title: string, message: string, target: string) => void;
  onAdminTopUp: (user: StoredUserAccount, amount: number) => void;
  onAdminDeleteUser: (id: string, name: string) => void;
  onDeleteTicket: (id: number | string) => void;
  onAddAd: (newAd: EthicalAd) => void;
  onToggleAd: (id: string) => void;
  onDeleteAd: (id: string) => void;
  onWithdrawProfitsToAdminWallet: () => void;
  onSwitchToMobilePreview: () => void;
  onOpenPlusArchitecture?: () => void;
  onLogout: () => void;
}

export const DesktopAdminDashboard: React.FC<DesktopAdminDashboardProps> = ({
  storedUsers,
  products,
  tickets,
  notifications,
  ethicalAds,
  adStats,
  adsenseSettings,
  onUpdateAdSenseSettings,
  onAddProduct,
  onDeleteProduct,
  onSendBroadcast,
  onAdminTopUp,
  onAdminDeleteUser,
  onDeleteTicket,
  onAddAd,
  onToggleAd,
  onDeleteAd,
  onWithdrawProfitsToAdminWallet,
  onSwitchToMobilePreview,
  onOpenPlusArchitecture,
  onLogout,
}) => {
  const [adminSubTab, setAdminSubTab] = useState<'accounts' | 'broadcast' | 'products' | 'tickets' | 'ads'>('accounts');
  const [searchUserQuery, setSearchUserQuery] = useState('');
  const [adminTopUpUser, setAdminTopUpUser] = useState<StoredUserAccount | null>(null);
  const [adminTopUpAmount, setAdminTopUpAmount] = useState('');
  const [viewingUserAccount, setViewingUserAccount] = useState<StoredUserAccount | null>(null);

  // Add Product form inputs
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodImg, setProdImg] = useState('');

  // Broadcast form inputs
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [broadcastTarget, setBroadcastTarget] = useState('all');

  const filteredUsers = storedUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
      u.cardNumber.includes(searchUserQuery) ||
      u.email.toLowerCase().includes(searchUserQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Desktop Header Banner */}
      <div className="bg-[#1e293b] border-2 border-indigo-500 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
            <Monitor className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white">
                لوحة تحكم الإدارة (مخصصة للكمبيوتر والديسكتوب Desktop / PC) 🖥️
              </h2>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full font-mono border border-indigo-500/40">
                NOT FOR MOBILE
              </span>
            </div>
            <p className="text-xs text-[#94a3b8] mt-1">
              المدير المعتمد: <strong className="text-white">{ADMIN_EMAIL}</strong> • تحكم شامل بحسابات الزبائن، السلع، وأرباح الإعلانات
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {onOpenPlusArchitecture && (
            <button
              type="button"
              onClick={onOpenPlusArchitecture}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:brightness-110 text-black font-bold text-xs flex items-center gap-2 transition shadow-lg cursor-pointer shadow-amber-500/20"
              title="عرض هيكلية ومخططات وواجهات نظام اشتراك بلس"
            >
              <Code2 className="w-4 h-4 stroke-[2.5]" />
              <span>هندسة باقة Plus ومحاكي الـ API 👑</span>
            </button>
          )}

          <button
            type="button"
            onClick={onSwitchToMobilePreview}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-2 transition shadow-md cursor-pointer"
          >
            <Smartphone className="w-4 h-4" />
            <span>معاينة متجر الهاتف (الزبائن) 📱</span>
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="px-4 py-2.5 rounded-xl bg-red-950/50 hover:bg-red-900/70 border border-red-500/40 text-red-300 font-bold text-xs flex items-center gap-2 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs Bar (Desktop Widescreen) */}
      <div className="flex flex-wrap items-center gap-2 bg-[#0f172a] p-2 rounded-2xl border border-[#334155] text-xs font-bold shadow-lg">
        <button
          type="button"
          onClick={() => setAdminSubTab('accounts')}
          className={`flex-1 min-w-[160px] py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 ${
            adminSubTab === 'accounts' ? 'bg-[#4f46e5] text-white shadow-md' : 'text-[#94a3b8] hover:text-white'
          }`}
        >
          <Users className="w-4 h-4 text-emerald-400" />
          <span>حسابات الأشخاص والعمولات</span>
          <span className="bg-black/40 text-[10px] px-2 py-0.5 rounded-full font-mono">
            {storedUsers.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setAdminSubTab('broadcast')}
          className={`flex-1 min-w-[160px] py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 ${
            adminSubTab === 'broadcast' ? 'bg-[#4f46e5] text-white shadow-md' : 'text-[#94a3b8] hover:text-white'
          }`}
        >
          <Megaphone className="w-4 h-4 text-pink-400" />
          <span>إرسال رسائل للزبائن 📢</span>
        </button>

        <button
          type="button"
          onClick={() => setAdminSubTab('products')}
          className={`flex-1 min-w-[160px] py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 ${
            adminSubTab === 'products' ? 'bg-[#4f46e5] text-white shadow-md' : 'text-[#94a3b8] hover:text-white'
          }`}
        >
          <Plus className="w-4 h-4 text-[#00e5ff]" />
          <span>إضافة وإدارة سلع المتجر</span>
          <span className="bg-black/40 text-[10px] px-2 py-0.5 rounded-full font-mono">
            {products.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setAdminSubTab('tickets')}
          className={`flex-1 min-w-[160px] py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 ${
            adminSubTab === 'tickets' ? 'bg-[#4f46e5] text-white shadow-md' : 'text-[#94a3b8] hover:text-white'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-amber-400" />
          <span>تذاكر وبلاغات الصيانة</span>
          <span className="bg-black/40 text-[10px] px-2 py-0.5 rounded-full font-mono text-amber-300">
            {tickets.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setAdminSubTab('ads')}
          className={`flex-1 min-w-[180px] py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 ${
            adminSubTab === 'ads' ? 'bg-[#4f46e5] text-white shadow-md' : 'text-[#94a3b8] hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>أرباحي من الإعلانات الرعائية</span>
          <span className="bg-emerald-950/90 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full font-mono border border-emerald-500/40">
            {adStats.totalAdminAdProfitIQD.toLocaleString()} د.ع
          </span>
        </button>
      </div>

      {/* SUBTAB 1: STORED USER ACCOUNTS */}
      {adminSubTab === 'accounts' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            <div className="p-4 rounded-2xl bg-[#1e293b] border border-[#334155] shadow">
              <span className="text-xs text-[#94a3b8] flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-400" />
                <span>إجمالي الحسابات المسجلة</span>
              </span>
              <div className="text-2xl font-black text-white font-mono mt-1">
                {storedUsers.length} <span className="text-xs text-[#94a3b8] font-normal">حساب</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#1e293b] border border-amber-500/40 shadow bg-gradient-to-br from-amber-950/30 to-[#1e293b]">
              <span className="text-xs text-amber-300 font-bold flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>مشتركو بلس (Plus Subscription)</span>
              </span>
              <div className="text-2xl font-black text-amber-400 font-mono mt-1">
                {storedUsers.filter((u) => u.isAdFreeSubscriber).length}{' '}
                <span className="text-xs text-[#94a3b8] font-normal">مشترك</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#1e293b] border border-[#334155] shadow">
              <span className="text-xs text-[#94a3b8] flex items-center gap-1.5">
                <ArrowUpRight className="w-4 h-4 text-amber-400" />
                <span>شكد حولوا (الحوالات)</span>
              </span>
              <div className="text-xl font-black text-amber-400 font-mono mt-1">
                {storedUsers.reduce((sum, u) => sum + u.totalTransferred, 0).toLocaleString()} د.ع
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#1e293b] border border-[#334155] shadow">
              <span className="text-xs text-[#94a3b8] flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-[#00e5ff]" />
                <span>شكد سحبوا / اشتروا</span>
              </span>
              <div className="text-xl font-black text-[#00e5ff] font-mono mt-1">
                {storedUsers.reduce((sum, u) => sum + u.totalWithdrawnOrSpent, 0).toLocaleString()} د.ع
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#1e293b] border border-emerald-500/40 shadow">
              <span className="text-xs text-emerald-300 font-bold flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>عمولات المتجر المجمعة</span>
              </span>
              <div className="text-xl font-black text-emerald-400 font-mono mt-1">
                +{storedUsers.reduce((sum, u) => sum + u.totalCommission, 0).toLocaleString()} د.ع
              </div>
            </div>
          </div>

          {/* Search bar */}
          <div className="bg-[#1e293b] p-3 rounded-2xl border border-[#334155] flex items-center gap-3">
            <Search className="w-4 h-4 text-[#94a3b8]" />
            <input
              type="text"
              value={searchUserQuery}
              onChange={(e) => setSearchUserQuery(e.target.value)}
              placeholder="ابحث بالاسم، البريد الإلكتروني، أو رقم البطاقة (10 أرقام)..."
              className="bg-transparent border-none text-white text-xs outline-none flex-1"
            />
          </div>

          {/* Desktop Users Table */}
          <div className="overflow-x-auto rounded-2xl border border-[#334155] bg-[#1e293b] shadow-xl">
            <table className="w-full text-right text-xs">
              <thead className="bg-[#0f172a] text-[#94a3b8] border-b border-[#334155]">
                <tr>
                  <th className="p-3.5">صاحب الحساب</th>
                  <th className="p-3.5">رقم بطاقتهم (10 أرقام)</th>
                  <th className="p-3.5">الرصيد الحالي</th>
                  <th className="p-3.5">اشتراك بلس (Plus)</th>
                  <th className="p-3.5">شكد حولوا</th>
                  <th className="p-3.5">شكد سحبوا / اشتروا</th>
                  <th className="p-3.5">العمولات</th>
                  <th className="p-3.5">آخر نشاط</th>
                  <th className="p-3.5 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#334155]">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-[#253248] transition">
                    <td className="p-3.5">
                      <div className="font-bold text-white">{user.name}</div>
                      <div className="text-[11px] text-[#94a3b8] font-mono dir-ltr text-right">{user.email}</div>
                    </td>
                    <td className="p-3.5">
                      <span className="font-mono font-bold text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
                        {user.cardNumber}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono font-bold text-emerald-400">
                      {user.balance.toLocaleString()} د.ع
                    </td>
                    <td className="p-3.5">
                      {user.isAdFreeSubscriber ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold">
                          <Crown className="w-3 h-3 fill-amber-400" />
                          <span>بلس {user.subscriptionPlan === 'yearly' ? 'سنوي' : 'شهري'}</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                          حساب عادي
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 font-mono text-amber-400">
                      {user.totalTransferred.toLocaleString()} د.ع
                    </td>
                    <td className="p-3.5 font-mono text-[#00e5ff]">
                      {user.totalWithdrawnOrSpent.toLocaleString()} د.ع
                    </td>
                    <td className="p-3.5 font-mono font-bold text-emerald-400">
                      +{user.totalCommission.toLocaleString()} د.ع
                    </td>
                    <td className="p-3.5 text-[11px] text-[#94a3b8]">
                      {user.lastActive}
                    </td>
                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setViewingUserAccount(user)}
                          className="p-1.5 rounded-lg bg-[#0f172a] hover:bg-[#1a2538] text-indigo-300 border border-[#334155]"
                          title="عرض تفاصيل الحساب"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setAdminTopUpUser(user)}
                          className="p-1.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-400 border border-emerald-500/30"
                          title="شحن رصيد يدوي"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onAdminDeleteUser(user.id, user.name)}
                          className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-500/30"
                          title="حذف الحساب"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 2: BROADCAST MESSAGES */}
      {adminSubTab === 'broadcast' && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!broadcastMsg.trim()) return;
            onSendBroadcast(broadcastTitle, broadcastMsg, broadcastTarget);
            setBroadcastTitle('');
            setBroadcastMsg('');
          }}
          className="bg-[#1e293b] p-6 rounded-2xl border border-[#334155] space-y-4"
        >
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-pink-400" />
            <span>بث رسالة أو إشعار لكافة الزبائن</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[#94a3b8] mb-1">عنوان الإشعار:</label>
              <input
                type="text"
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                placeholder="مثال: تحديث أمني هام..."
                className="w-full p-2.5 rounded-xl border border-[#334155] bg-[#0f172a] text-white text-xs outline-none"
              />
            </div>

            <div>
              <label className="block text-[#94a3b8] mb-1">الجمهور المستهدف:</label>
              <select
                value={broadcastTarget}
                onChange={(e) => setBroadcastTarget(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#334155] bg-[#0f172a] text-white text-xs outline-none"
              >
                <option value="all">كافة الزبائن المسجلين (عام)</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-[#94a3b8] mb-1">نص الرسالة:</label>
              <textarea
                value={broadcastMsg}
                onChange={(e) => setBroadcastMsg(e.target.value)}
                rows={3}
                placeholder="اكتب رسالتك للزبائن هنا..."
                className="w-full p-2.5 rounded-xl border border-[#334155] bg-[#0f172a] text-white text-xs outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs shadow-md transition"
          >
            إرسال الإشعار لجميع الزبائن فوراً
          </button>
        </form>
      )}

      {/* SUBTAB 3: PRODUCTS MANAGEMENT */}
      {adminSubTab === 'products' && (
        <div className="space-y-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!prodName.trim() || !prodPrice) return;
              onAddProduct(prodName, parseInt(prodPrice, 10), prodImg);
              setProdName('');
              setProdPrice('');
              setProdImg('');
            }}
            className="bg-[#1e293b] p-5 rounded-2xl border border-[#334155] space-y-4"
          >
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#00e5ff]" />
              <span>إضافة سلعة / كرت رقمي جديد إلى المتجر</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-[#94a3b8] mb-1">اسم السلعة / الكرت:</label>
                <input
                  type="text"
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="مثال: بطاقة ألعاب، رصيد اتصال..."
                  className="w-full p-2.5 rounded-xl border border-[#334155] bg-[#0f172a] text-white text-xs outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[#94a3b8] mb-1">السعر بالدينار العراقي (د.ع):</label>
                <input
                  type="number"
                  min="500"
                  step="500"
                  value={prodPrice}
                  onChange={(e) => setProdPrice(e.target.value)}
                  placeholder="مثال: 15000"
                  className="w-full p-2.5 rounded-xl border border-[#334155] bg-[#0f172a] text-white text-xs outline-none font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-[#94a3b8] mb-1">رابط صورة الكرت:</label>
                <input
                  type="url"
                  value={prodImg}
                  onChange={(e) => setProdImg(e.target.value)}
                  placeholder="https://..."
                  className="w-full p-2.5 rounded-xl border border-[#334155] bg-[#0f172a] text-white text-xs outline-none dir-ltr text-left"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#4f46e5] hover:bg-[#4338ca] text-white font-bold text-xs shadow-md transition"
            >
              إضافة السلعة للمتجر
            </button>
          </form>

          {/* Current Products Desktop Grid */}
          <div className="bg-[#1e293b] p-5 rounded-2xl border border-[#334155] space-y-3">
            <h4 className="font-bold text-sm text-white">السلع الحالية المعروضة في المتجر ({products.length}):</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((prod) => (
                <div key={prod.id} className="p-3 bg-[#0f172a] rounded-xl border border-[#334155] flex flex-col justify-between space-y-2">
                  <div className="flex gap-2.5 items-center">
                    <img src={prod.img} alt={prod.name} className="w-12 h-12 rounded-lg object-cover border border-[#334155]" />
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-white truncate">{prod.name}</div>
                      <div className="font-mono text-emerald-400 font-bold text-xs">{prod.price.toLocaleString()} د.ع</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onDeleteProduct(prod)}
                    className="w-full py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 font-bold text-xs border border-red-500/30 transition flex items-center justify-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>حذف</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: SUPPORT TICKETS */}
      {adminSubTab === 'tickets' && (
        <div className="bg-[#1e293b] p-5 rounded-2xl border border-[#334155] space-y-3">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-amber-400" />
            <span>تذاكر وبلاغات الصيانة الواردة من الزبائن ({tickets.length})</span>
          </h3>

          {tickets.length === 0 ? (
            <div className="text-center py-12 text-[#94a3b8] text-xs">لا توجد بلاغات أو مشاكل معلقة حالياً.</div>
          ) : (
            <div className="space-y-3">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="p-4 rounded-xl bg-[#0f172a] border border-[#334155] flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-xs text-[#00e5ff] font-mono dir-ltr text-right">{ticket.email}</div>
                    <div className="text-sm font-bold text-white">{ticket.issue}</div>
                    <div className="text-[10px] text-[#94a3b8] font-mono">{ticket.date}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onDeleteTicket(ticket.id)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 font-bold text-xs border border-emerald-500/30 flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>تم الحل والحذف</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 5: ETHICAL ADS & AD REVENUE ("وانا اربح ليس الناس") */}
      {adminSubTab === 'ads' && (
        <AdminAdRevenueSubTab
          ads={ethicalAds}
          stats={adStats}
          adsenseSettings={adsenseSettings}
          onUpdateAdSenseSettings={onUpdateAdSenseSettings}
          onAddAd={onAddAd}
          onToggleAd={onToggleAd}
          onDeleteAd={onDeleteAd}
          onWithdrawProfitsToAdminWallet={onWithdrawProfitsToAdminWallet}
        />
      )}

      {/* Admin Manual Top-up Modal */}
      {adminTopUpUser && (
        <div className="fixed inset-0 z-[1900] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e293b] p-6 rounded-2xl border border-emerald-500/40 w-full max-w-sm text-right shadow-2xl space-y-4">
            <h4 className="font-bold text-sm text-white">شحن رصيد يدوي لـ ({adminTopUpUser.name})</h4>
            <div className="text-xs text-[#94a3b8]">
              رقم البطاقة: <strong className="text-amber-400 font-mono">{adminTopUpUser.cardNumber}</strong>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const amt = parseInt(adminTopUpAmount, 10);
                if (amt > 0) {
                  onAdminTopUp(adminTopUpUser, amt);
                  setAdminTopUpUser(null);
                  setAdminTopUpAmount('');
                }
              }}
              className="space-y-3"
            >
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

              <div className="flex gap-2">
                <button type="submit" className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl">
                  تأكيد الشحن
                </button>
                <button type="button" onClick={() => setAdminTopUpUser(null)} className="px-4 py-2 bg-[#334155] text-white text-xs rounded-xl">
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {viewingUserAccount && (
        <div className="fixed inset-0 z-[1900] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e293b] p-6 rounded-2xl border border-indigo-500/40 w-full max-w-md text-right shadow-2xl space-y-4 text-xs">
            <h4 className="font-bold text-base text-white">معلومات حساب: {viewingUserAccount.name}</h4>
            <div className="p-3 bg-[#0f172a] rounded-xl border border-[#334155] space-y-2">
              <div className="flex justify-between">
                <span className="text-[#94a3b8]">البريد:</span>
                <span className="font-mono text-white dir-ltr">{viewingUserAccount.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#94a3b8]">رقم بطاقتهم:</span>
                <span className="font-mono font-bold text-amber-400">{viewingUserAccount.cardNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#94a3b8]">الرصيد:</span>
                <span className="font-mono font-bold text-emerald-400">{viewingUserAccount.balance.toLocaleString()} د.ع</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#94a3b8]">شكد حولوا:</span>
                <span className="font-mono text-amber-400">{viewingUserAccount.totalTransferred.toLocaleString()} د.ع</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#94a3b8]">شكد سحبوا / اشتروا:</span>
                <span className="font-mono text-[#00e5ff]">{viewingUserAccount.totalWithdrawnOrSpent.toLocaleString()} د.ع</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-300 font-bold">العمولات المستقطعة للمتجر:</span>
                <span className="font-mono font-bold text-emerald-400">+{viewingUserAccount.totalCommission.toLocaleString()} د.ع</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-[#334155]">
                <span className="text-amber-300 font-bold flex items-center gap-1">
                  <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>اشتراك VIP بدون إعلانات:</span>
                </span>
                <span className="font-bold text-white">
                  {viewingUserAccount.isAdFreeSubscriber ? (
                    <span className="text-amber-400 font-mono">
                      مفعل ({viewingUserAccount.subscriptionPlan === 'yearly' ? 'سنوي 15,000 د.ع' : 'شهري 2,000 د.ع'})
                    </span>
                  ) : (
                    <span className="text-slate-400">غير مشترك</span>
                  )}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setViewingUserAccount(null)}
              className="w-full py-2.5 rounded-xl bg-[#334155] text-white text-xs font-bold"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
