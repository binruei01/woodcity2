/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  ClipboardCheck, 
  FileSearch, 
  Award, 
  HelpCircle, 
  ChevronRight, 
  History, 
  ShieldCheck, 
  Lightbulb,
  Download,
  AlertCircle
} from 'lucide-react';
import { analyzeWoodenHouse, IdentificationResult, AnalysisOutput } from './logic';

// --- Constants ---

const VALUE_STATUS_OPTIONS = [
  "國定古蹟",
  "市定古蹟",
  "已申請嘉義市木都3.0改造計畫之老屋",
  "政府明令暫保留木屋",
  "嘉義市政府文化局再造歷史現場計畫規劃修繕中",
  "以上皆非"
];

const STYLE_OPTIONS = ["閩南式建築", "日式建築", "歐式建築"];

const MATERIAL_OPTIONS = [
  "木造",
  "磚造",
  "木＋磚混合",
  "竹編夾泥牆",
  "磚造+水泥",
  "以上皆非"
];

const USAGE_OPTIONS = ["使用中", "整修中", "荒廢中", "政府勘察中"];

const COMPLETENESS_INFOS: Record<number, string> = {
  5: "5分: 房屋整體結構正常，屋頂目視完整無毀損，窗戶牆壁地板亦可正常開關及使用",
  4: "4分: 房屋整體結構正常，屋頂目視大致完整無嚴重毀損，窗戶牆壁地板雖有斑駁疏漏但可正常使用",
  3: "3分: 房屋整體結構大致正常，屋頂目視尚稱完整，窗戶牆壁地板尚可使用",
  2: "2分: 房屋結構有傾斜毀損的狀況或屋頂目視有明顯毀損難以修復，窗戶牆壁地板無法使用",
  1: "1分: 整體房屋結構嚴重毀壞已不堪使用，接近會產生危險性"
};

export default function App() {
  const [formData, setFormData] = useState<IdentificationResult>({
    valueStatus: VALUE_STATUS_OPTIONS[5],
    architecturalStyle: STYLE_OPTIONS[1],
    materials: MATERIAL_OPTIONS[0],
    year: "1940",
    usageStatus: USAGE_OPTIONS[0],
    completeness: 5
  });

  const [result, setResult] = useState<AnalysisOutput | null>(null);
  const [showJson, setShowJson] = useState(false);

  const handleAnalyze = () => {
    const analysis = analyzeWoodenHouse(formData);
    setResult(analysis);
  };

  const [isSaving, setIsSaving] = useState(false);

  const saveToSheets = async () => {
    if (!result) return;
    setIsSaving(true);
    
    const gasUrl = import.meta.env.VITE_GAS_WEB_APP_URL;

    if (!gasUrl || gasUrl.includes("您的_GAS")) {
      alert("請先設定 GAS Web App URL 才能存檔！");
      setIsSaving(false);
      return;
    }

    try {
      // 由於 GAS 的重新導向機制，使用 no-cors 模式
      await fetch(gasUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(result),
      });

      alert("資料已嘗試送出！請確認您的 Google 試算表。\n(由於跨網域限制，系統無法取得詳細結果，但資料通常已排入送出佇列)");
    } catch (err) {
      alert("存入失敗: " + err);
    } finally {
      setIsSaving(false);
    }
  };

  const copyJson = () => {
    if (result) {
      navigator.clipboard.writeText(JSON.stringify(result, null, 2));
      alert("JSON 已複製到剪貼簿");
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F7F2] text-[#2C2C2C] font-sans flex flex-col">
      {/* Header Section */}
      <header className="w-full h-24 bg-[#5A5A40] text-white px-8 flex items-center justify-between shadow-md border-b-4 border-[#D4AF37]">
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 bg-[#D4AF37] rounded-sm flex items-center justify-center border-2 border-white/20">
            <span className="text-3xl font-serif font-bold">木</span>
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold tracking-tight">木屋文化資產判別與保存建議專家</h1>
            <p className="text-[10px] opacity-70 uppercase tracking-[0.2em] font-medium font-sans">Wooden Heritage Expert Assessment System</p>
          </div>
        </div>
        <div className="hidden md:block text-right">
          <span className="text-[10px] bg-white/10 px-4 py-1.5 rounded-full border border-white/10 uppercase tracking-widest font-bold">
            Project Code: CY-2024-HERITAGE
          </span>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-12 gap-8 p-8 max-w-[1400px] mx-auto w-full">
        {/* Left Panel: Input Section (col-span-4) */}
        <section className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-[#E5E2D9] p-8 flex flex-col h-full overflow-hidden relative">
            <h2 className="text-[#5A5A40] font-serif text-xl font-bold border-b border-[#5A5A40]/10 pb-4 mb-8 flex items-center gap-3">
              <ClipboardCheck className="w-6 h-6" />
              建物現況調查表
            </h2>
            
            <div className="space-y-6 flex-1">
              <div>
                <label className="text-[10px] text-[#A09D90] uppercase font-bold tracking-wider block mb-2">價值地位身份</label>
                <select 
                  className="w-full bg-[#FDFCF9] border border-[#E5E2D9] rounded-lg px-4 py-3 text-sm font-semibold focus:outline-none focus:border-[#5A5A40] transition-colors appearance-none cursor-pointer"
                  value={formData.valueStatus}
                  onChange={(e) => setFormData({...formData, valueStatus: e.target.value})}
                >
                  {VALUE_STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-[#A09D90] uppercase font-bold tracking-wider block mb-2">建築特色風格</label>
                  <select 
                    className="w-full bg-[#FDFCF9] border border-[#E5E2D9] rounded-lg px-4 py-3 text-sm font-semibold focus:outline-none focus:border-[#5A5A40]"
                    value={formData.architecturalStyle}
                    onChange={(e) => setFormData({...formData, architecturalStyle: e.target.value})}
                  >
                    {STYLE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-[#A09D90] uppercase font-bold tracking-wider block mb-2">建築主要材料</label>
                  <select 
                    className="w-full bg-[#FDFCF9] border border-[#E5E2D9] rounded-lg px-4 py-3 text-sm font-semibold focus:outline-none focus:border-[#5A5A40]"
                    value={formData.materials}
                    onChange={(e) => setFormData({...formData, materials: e.target.value})}
                  >
                    {MATERIAL_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-[#A09D90] uppercase font-bold tracking-wider block mb-2">推定建築年份</label>
                  <input 
                    type="number"
                    className="w-full bg-[#FDFCF9] border border-[#E5E2D9] rounded-lg px-4 py-3 text-sm font-semibold focus:outline-none focus:border-[#5A5A40]"
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#A09D90] uppercase font-bold tracking-wider block mb-2">目前管理狀態</label>
                  <select 
                    className="w-full bg-[#FDFCF9] border border-[#E5E2D9] rounded-lg px-4 py-3 text-sm font-semibold focus:outline-none focus:border-[#5A5A40]"
                    value={formData.usageStatus}
                    onChange={(e) => setFormData({...formData, usageStatus: e.target.value})}
                  >
                    {USAGE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-[#A09D90] uppercase font-bold tracking-wider block mb-3">建物結構完整度</label>
                <div className="flex items-center gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((score) => (
                    <button
                      key={score}
                      onClick={() => setFormData({...formData, completeness: score})}
                      className={`h-10 flex-1 rounded-md border text-sm font-bold transition-all ${
                        formData.completeness === score 
                        ? 'bg-[#5A5A40] text-white border-[#5A5A40] shadow-md scale-105' 
                        : 'bg-white text-[#5A5A40] border-[#E5E2D9] hover:bg-[#F9F7F2]'
                      }`}
                    >
                      {score}
                    </button>
                  ))}
                </div>
                <div className="bg-[#5A5A40]/5 p-4 rounded-lg border border-[#5A5A40]/10 text-[11px] leading-relaxed text-[#5A5A40]/80 italic">
                  調查指引：{COMPLETENESS_INFOS[formData.completeness]}
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-dashed border-[#E5E2D9]">
              <button 
                onClick={handleAnalyze}
                className="w-full py-4 bg-[#5A5A40] text-white rounded-xl font-bold text-sm hover:bg-[#4A4A35] transition-all shadow-md group flex items-center justify-center gap-3"
              >
                <FileSearch className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                執行專家鑑定系統
              </button>
            </div>
          </div>
        </section>

        {/* Right Panel: Results Section (col-span-8) */}
        <section className="col-span-12 lg:col-span-8 space-y-8">
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-12 bg-white rounded-xl border-2 border-dashed border-[#E5E2D9]"
              >
                <div className="w-24 h-24 bg-[#F9F7F2] rounded-full flex items-center justify-center mb-8 border border-[#E5E2D9]">
                  <HelpCircle className="w-12 h-12 text-[#A09D90]" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-[#5A5A40] mb-4">專家鑑定報告尚未生成</h3>
                <p className="text-[#A09D90] font-sans max-w-sm mx-auto leading-relaxed italic">
                  請確認左側建物現況調查資料是否填寫完整，隨後啟動鑑定程序。
                </p>
              </motion.div>
            ) : (
              <motion.div 
                key="result"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                {/* Preservation Value Result Card */}
                <div className="bg-white rounded-xl shadow-sm border-l-[12px] border-[#D4AF37] p-10 relative overflow-hidden group">
                  {/* Decorative Background Text */}
                  <div className="absolute top-[-40px] right-[-40px] text-[180px] font-serif font-black text-[#F9F7F2] pointer-events-none select-none opacity-80 transition-transform group-hover:scale-110">
                    評
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <h3 className="text-2xl font-serif font-bold text-[#5A5A40] mb-2 tracking-tight">保存價值專家評估結果</h3>
                        <p className="text-xs text-[#A09D90] font-bold uppercase tracking-widest">Heritage Value Expert Consensus</p>
                      </div>
                      <div className={`px-6 py-2 rounded-full text-sm font-black shadow-inner border ${
                        result.保存價值評估.是否建議保存 === '是' 
                        ? 'bg-[#D4AF37] text-white border-[#C5A030]' 
                        : 'bg-[#A09D90] text-white border-transparent'
                      }`}>
                        建議保存：{result.保存價值評估.是否建議保存}
                      </div>
                    </div>

                    <div className="bg-[#FDFCF9] p-6 border border-[#F0EDDF] rounded-xl">
                      <div className="flex items-center gap-2 mb-4">
                        <Award className="w-5 h-5 text-[#D4AF37]" />
                        <span className="text-[10px] text-[#A09D90] font-black uppercase tracking-[0.2em]">核心鑑定原因與證據</span>
                      </div>
                      <div className="text-base font-serif leading-[1.8] text-[#3E3E3E] space-y-4">
                        {result.保存價值評估.原因.split('。').filter(s => s).map((reason, idx) => (
                          <div key={idx} className="flex gap-4">
                            <span className="text-[#D4AF37] font-bold">0{idx + 1}</span>
                            <p>{reason}。</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Suggestions Grid */}
                <div className="bg-white rounded-xl shadow-sm border border-[#E5E2D9] p-10">
                  <h3 className="text-2xl font-serif font-bold text-[#5A5A40] mb-10 flex items-center gap-4">
                    <Lightbulb className="w-8 h-8 text-[#D4AF37]" />
                    補助方案與活化行動建議
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="border border-[#E5E2D9] rounded-2xl p-6 hover:bg-[#F9F7F2] transition-all hover:border-[#D4AF37] group relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Award className="w-20 h-20" />
                      </div>
                      <div className="text-[#A09D90] font-black text-[10px] mb-2 uppercase tracking-widest">策略建議 A</div>
                      <div className="text-xl font-serif font-bold text-[#3E3E3E] mb-4 underline decoration-[#D4AF37] decoration-2 underline-offset-8">
                        {result.補助建議.建議方案}
                      </div>
                      <p className="text-sm text-[#7A7A7A] leading-relaxed font-sans">
                        {result.補助建議.說明}
                      </p>
                    </div>

                    {/* Meta Data Box */}
                    <div className="bg-[#5A5A40] text-white rounded-2xl p-8 shadow-lg flex flex-col justify-between">
                      <div>
                        <div className="text-white/40 font-black text-[10px] mb-6 uppercase tracking-widest">鑑定對象摘要</div>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                          {Object.entries(result.判別結果).slice(0, 4).map(([key, value]) => (
                            <div key={key}>
                              <p className="text-white/40 text-[9px] uppercase font-bold tracking-wider mb-1">{key}</p>
                              <p className="font-serif text-sm font-bold border-b border-white/10 pb-1">{value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="mt-8 flex justify-between items-end border-t border-white/10 pt-4">
                        <div className="text-[10px] italic text-white/50">數據更新：2024 文資標準</div>
                        <ShieldCheck className="w-6 h-6 text-[#D4AF37]" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Final Actions / Export */}
                <div className="flex flex-wrap items-center justify-between gap-4 py-4">
                  <div className="flex gap-6 items-center">
                    <button 
                      onClick={saveToSheets}
                      className="flex items-center gap-2 bg-[#D4AF37] text-white px-6 py-2.5 rounded-lg font-bold text-xs shadow-md hover:bg-[#C5A030] transition-all hover:scale-105"
                    >
                      <Download className="w-4 h-4" />
                      將紀錄存入 Google 試算表
                    </button>
                    <button 
                      onClick={() => setShowJson(!showJson)}
                      className="text-[10px] font-black uppercase tracking-widest text-[#A09D90] hover:text-[#5A5A40] underline underline-offset-4"
                    >
                      {showJson ? 'HIDE SYSTEM DATA' : 'VIEW EXPERT JSON DATA'}
                    </button>
                  </div>
                  {showJson && (
                    <button 
                      onClick={copyJson}
                      className="text-[10px] font-black text-[#5A5A40] flex items-center gap-2 hover:bg-white rounded px-2 transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      COPY JSON
                    </button>
                  )}
                </div>

                {showJson && (
                  <motion.pre 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="bg-[#1A1A1A] text-[#D4AF37] p-8 rounded-xl font-mono text-[11px] overflow-x-auto shadow-2xl border border-white/5"
                  >
                    {JSON.stringify(result, null, 2)}
                  </motion.pre>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      <footer className="h-16 bg-white border-t border-[#E5E2D9] px-8 flex items-center justify-between text-[10px] text-[#A09D90] font-bold tracking-[0.2em] relative z-20">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse"></div>
          <span>WOODEN HERITAGE SYSTEM V1.2.HERITAGE</span>
        </div>
        <div className="flex gap-10 uppercase">
          <span>嘉義木都 3.0 政策導向鑑定模式</span>
          <span className="hidden md:inline">文資鑑定標準 2024 年度規範</span>
        </div>
      </footer>

      {/* Background Accent Lines */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#5A5A40_1px,transparent_1px),linear-gradient(0deg,#5A5A40_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>
    </div>
  );
}

