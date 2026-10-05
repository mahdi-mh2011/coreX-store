import React, { useState } from 'react';
import { ShieldCheck, Heart, Sparkles, CheckCircle2, XCircle, X, Sliders, BellRing } from 'lucide-react';

interface EthicalCharterModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategories: string[];
  onToggleCategory: (category: string) => void;
}

export const EthicalCharterModal: React.FC<EthicalCharterModalProps> = ({
  isOpen,
  onClose,
  selectedCategories,
  onToggleCategory,
}) => {
  const [activeTab, setActiveTab] = useState<'charter' | 'preferences'>('charter');

  if (!isOpen) return null;

  const categories = [
    { id: 'تعليم وتقنية', label: 'التعليم والبرمجة والتقنية', icon: '💻' },
    { id: 'عمل خيري وبيئة', label: 'العمل الخيري والتشجير ورعاية الأيتام', icon: '🌱' },
    { id: 'صحة وغذاء طبيعي', label: 'الصحة والمنتجات الغذائية الطبيعية', icon: '🍯' },
    { id: 'ثقافة وكتب', label: 'الثقافة والكتب المسموعة والتاريخ', icon: '📚' },
    { id: 'مشاريع وطنية', label: 'الصناعات الوطنية والحرف التراثية', icon: '🏺' },
  ];

  return (
    <div className="fixed inset-0 z-[1700] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#1e293b] p-6 rounded-2xl border border-emerald-500/40 w-full max-w-lg text-right shadow-2xl animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#334155]">
          <div className="flex items-center gap-2 font-bold text-base text-white">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-white text-base">ميثاق الإعلانات الأخلاقية واللطيفة 🌿</h2>
              <p className="text-[11px] text-emerald-400 font-normal">نظام إعلانات محترم ونظيف ومربح للمستخدم</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#94a3b8] hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Subtabs */}
        <div className="flex bg-[#0f172a] p-1 rounded-xl my-3 border border-[#334155] text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('charter')}
            className={`flex-1 py-1.5 rounded-lg transition flex items-center justify-center gap-1.5 ${
              activeTab === 'charter' ? 'bg-emerald-600 text-white shadow' : 'text-[#94a3b8]'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-pink-300" />
            <span>ميثاق النزاهة الأخلاقية</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preferences')}
            className={`flex-1 py-1.5 rounded-lg transition flex items-center justify-center gap-1.5 ${
              activeTab === 'preferences' ? 'bg-emerald-600 text-white shadow' : 'text-[#94a3b8]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-amber-300" />
            <span>تخصيص اهتماماتك</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
          {activeTab === 'charter' ? (
            <>
              {/* Guarantee Banner */}
              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-sm text-emerald-300">
                  <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>ضمان خلو الإعلانات من أي محتوى غير أخلاقي</span>
                </div>
                <p className="text-[11px] leading-relaxed opacity-95">
                  حرصاً على سلامتك وسلامة عائلتك وتوافقاً مع قيمنا الأصيلة، نلتزم في متجر coreX بعدم عرض أي إعلانات خادشة أو مشبوهة، بل نعتمد فقط على رعاة معتمدين يقدمون فائدة حقيقية للمجتمع.
                </p>
              </div>

              {/* What is strictly prohibited */}
              <div className="space-y-2">
                <span className="font-bold text-red-400 block text-xs flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5 text-red-400" />
                  <span>المحظورات الصارمة (محظورة بنسبة 100%):</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-lg bg-[#0f172a] border border-red-500/30 text-red-200 text-[11px] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                    <span>منع إعلانات القمار والرهانات واليانصيب</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#0f172a] border border-red-500/30 text-red-200 text-[11px] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                    <span>منع أي محتوى خادش للحياء أو التعارف غير اللائق</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#0f172a] border border-red-500/30 text-red-200 text-[11px] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                    <span>منع أوهام الثراء السريع والعملات الاحتيالية</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#0f172a] border border-red-500/30 text-red-200 text-[11px] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                    <span>منع النوافذ المنبثقة الإجبارية والأصوات الصاخبة</span>
                  </div>
                </div>
              </div>

              {/* What is allowed and welcomed */}
              <div className="space-y-2 pt-1">
                <span className="font-bold text-emerald-400 block text-xs flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>الإعلانات والرعايات المرحب بها (لطيفة وهادفة):</span>
                </span>
                <div className="space-y-1.5">
                  <div className="p-2 rounded-lg bg-[#0f172a] border border-emerald-500/20 text-slate-200 text-[11px] flex items-start gap-2">
                    <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                    <span><strong>مبادرات التعليم والتقنية:</strong> منصات البرمجة واللغات والذكاء الاصطناعي المجانية.</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#0f172a] border border-emerald-500/20 text-slate-200 text-[11px] flex items-start gap-2">
                    <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                    <span><strong>الأعمال الإنسانية والبيئية:</strong> حملات زراعة الأشجار، دعم أيتام العراق، والتعليم الخيري.</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#0f172a] border border-emerald-500/20 text-slate-200 text-[11px] flex items-start gap-2">
                    <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                    <span><strong>الصناعات الوطنية الأصيلة:</strong> المنتجات الغذائية الطبيعية، العسل، والحرف التراثية.</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#0f172a] border border-emerald-500/20 text-slate-200 text-[11px] flex items-start gap-2">
                    <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                    <span><strong>ربح حقيقي ومباشر:</strong> كل إعلان تشاهده يمنحك رصيداً حقيقياً بالدينار العراقي في محفظتك فورياً!</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <p className="text-[#94a3b8] text-[11px]">
                حدد المجالات اللطيفة التي تفضل رؤية إعلانات ورعايات عنها وكسب مكافآت بالدينار العراقي عند مشاهدتها:
              </p>
              <div className="space-y-2">
                {categories.map((cat) => {
                  const isChecked = selectedCategories.includes(cat.id);
                  return (
                    <div
                      key={cat.id}
                      onClick={() => onToggleCategory(cat.id)}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition select-none ${
                        isChecked
                          ? 'bg-emerald-950/30 border-emerald-500/40 text-white'
                          : 'bg-[#0f172a] border-[#334155] text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">{cat.icon}</span>
                        <span className="font-bold text-xs">{cat.label}</span>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                          isChecked
                            ? 'bg-emerald-500 border-emerald-400 text-black'
                            : 'border-[#475569] bg-transparent'
                        }`}
                      >
                        {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-3 bg-[#0f172a] rounded-xl border border-[#334155] flex items-center justify-between text-[11px] text-[#94a3b8]">
                <div className="flex items-center gap-2 text-slate-300">
                  <BellRing className="w-4 h-4 text-amber-400" />
                  <span>تنبيه بمكافأة الإعلانات اليومية</span>
                </div>
                <span className="text-emerald-400 font-bold">مفعل ✓</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#334155] flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow"
          >
            فهمت وموافق على ميثاق النزاهة 🌿
          </button>
        </div>
      </div>
    </div>
  );
};
