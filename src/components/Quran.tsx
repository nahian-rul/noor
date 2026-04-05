import React, { useState, useEffect } from "react";
import quranData from "../data/quran";
import { motion, AnimatePresence } from "motion/react";
import { Book, Search, ChevronLeft, Bookmark, Share2, Play, ArrowRight, CheckCircle2 } from "lucide-react";
import { useUser } from "../contexts/UserContext";
import { useWaqt } from "../WaqtContext";

const STORAGE_KEY = "noor_selected_surah_id";

export const Quran: React.FC = () => {
  const [selectedSurah, setSelectedSurah] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { markSurahCompleted, completedSurahs } = useUser();
  const { waqt } = useWaqt();
  const isAsr = waqt === "Asr";

  // Persistence (Load)
  useEffect(() => {
    const savedId = localStorage.getItem(STORAGE_KEY);
    if (savedId) {
      const surah = (quranData as any).data.find((s: any) => s.id.toString() === savedId);
      if (surah) setSelectedSurah(surah);
    }
  }, []);

  // Persistence (Save)
  useEffect(() => {
    if (selectedSurah) {
      localStorage.setItem(STORAGE_KEY, selectedSurah.id.toString());
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [selectedSurah]);

  const filteredSurahs = (quranData as any).data.filter((s: any) => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.sub_title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedSurah) {
    return (
      <div className="space-y-8 pb-40">
        <header className="flex items-center gap-6">
          <button 
            onClick={() => setSelectedSurah(null)}
            className={`p-3 rounded-2xl border transition-all group ${
              isAsr ? "bg-white/5 border-white/10 hover:bg-[#FFD700]/5 hover:border-[#FFD700]/20" : "bg-white/5 hover:bg-white/10 border border-white/10"
            }`}
          >
            <ChevronLeft className={`w-5 h-5 group-hover:-translate-x-1 transition-transform ${isAsr ? "text-[#FFD700]" : ""}`} />
          </button>
          <div className="flex flex-col">
             <div className="flex items-center gap-3">
                <span className="text-3xl font-serif italic text-white/95">{selectedSurah.title}</span>
                <span className={`text-2xl font-serif ${isAsr ? "text-[#FFD700]" : "text-amber-400/60"}`} dir="rtl">{selectedSurah.title_arb}</span>
                {completedSurahs.includes(selectedSurah.id.toString()) && (
                  <CheckCircle2 className={`w-5 h-5 ${isAsr ? "text-[#FFD700]" : "text-emerald-400"}`} />
                )}
             </div>
             <p className={`text-sm font-bold uppercase tracking-widest ${isAsr ? "text-white/60" : "text-white/40"}`}>{selectedSurah.sub_title} • {selectedSurah.surah_type} • {selectedSurah.verse} Verses</p>
          </div>
        </header>

        <div className="space-y-12">
          {selectedSurah.surah_details.map((ayat: any, idx: number) => (
            <motion.div
              key={ayat.ayat_id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`p-10 glass-card space-y-10 group transition-all relative overflow-hidden ${
                isAsr ? "hover:bg-white/[0.04] border-white/10 hover:border-[#FFD700]/20" : "hover:bg-white/[0.07]"
              }`}
            >
              <div className={`absolute top-10 left-10 flex items-center justify-center w-10 h-10 rounded-full border text-[10px] font-bold ${
                isAsr ? "bg-[#FFD700]/5 border-[#FFD700]/20 text-[#FFD700]/60" : "bg-white/5 border-white/10 text-white/30"
              }`}>
                {ayat.ayat_id}
              </div>

              <div className="flex flex-col gap-10">
                <p className="text-4xl md:text-6xl font-serif leading-[2.2] text-white text-right" dir="rtl">
                  {ayat.ayat_arb}
                </p>
                
                <div className="space-y-6 max-w-3xl">
                   <p className={`text-sm font-serif italic leading-relaxed tracking-wide text-white/90`}>
                      {ayat.ayat_transliteration}
                   </p>
                   <p className="text-lg text-white/95 leading-relaxed font-light">
                      {ayat.ayat_meaning}
                   </p>
                </div>
              </div>

              <div className={`flex items-center gap-6 pt-8 border-t ${isAsr ? "border-[#FFD700]/10" : "border-white/5"}`}>
                 <button className={`flex items-center gap-2 transition-colors ${isAsr ? "text-[#FFD700]/60 hover:text-[#FFD700]" : "text-white/20 hover:text-white"}`}>
                    <Play className="w-4 h-4" />
                    <span className="text-[10px] uppercase font-bold tracking-widest">Listen</span>
                 </button>
                 <button className={`flex items-center gap-2 transition-colors ${isAsr ? "text-[#FFD700]/60 hover:text-[#FFD700]" : "text-white/20 hover:text-white"}`}>
                    <Bookmark className="w-4 h-4" />
                    <span className="text-[10px] uppercase font-bold tracking-widest">Bookmark</span>
                 </button>
                 <button className={`ml-auto p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 ${isAsr ? "bg-[#FFD700]/10 hover:bg-[#FFD700]/20" : "bg-white/5 hover:bg-white-10"}`}>
                    <Share2 className={`w-4 h-4 ${isAsr ? "text-[#FFD700]" : "text-white/40"}`} />
                 </button>
              </div>
            </motion.div>
          ))}

          {/* Completion Button */}
          <div className="flex justify-center pt-10">
            {!completedSurahs.includes(selectedSurah.id.toString()) ? (
              <button 
                onClick={() => markSurahCompleted(selectedSurah.id.toString())}
                className={`flex items-center gap-3 px-10 py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-sm hover:scale-105 active:scale-95 transition-all shadow-xl ${
                  isAsr ? "bg-[#FFD700] text-black shadow-[#FFD700]/20" : "bg-emerald-500 text-black shadow-emerald-500/20 hover:bg-emerald-400"
                }`}
              >
                Complete Surah <CheckCircle2 className="w-5 h-5" />
              </button>
            ) : (
              <div className={`flex items-center gap-3 px-10 py-5 border rounded-[2rem] font-black uppercase tracking-[0.2em] text-sm italic ${
                isAsr ? "bg-[#FFD700]/10 border-[#FFD700]/20 text-[#FFD700]" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              }`}>
                Surah Completed <CheckCircle2 className="w-5 h-5" />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <h1 className="text-5xl font-serif italic tracking-tight text-white">The Holy Quran</h1>
          <p className="text-white/60 text-sm font-medium">Selected 18 Surahs for daily recitation and spiritual nourishment.</p>
        </div>

        <div className="relative group w-full md:w-96">
          <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isAsr ? "text-white/40 group-focus-within:text-[#FFD700]" : "text-white/20 group-focus-within:text-amber-400"}`} />
          <input
            type="text"
            placeholder="Search surahs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full bg-white/5 border rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none transition-all font-medium ${
              isAsr ? "border-white/10 focus:border-[#FFD700]/40" : "border-white/10 focus:border-white/20"
            }`}
          />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredSurahs.map((surah: any, idx: number) => (
          <motion.div
            key={surah.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => setSelectedSurah(surah)}
            className={`group p-8 glass-card cursor-pointer transition-all duration-500 relative overflow-hidden ${
              isAsr 
                ? "hover:bg-[#022902]/60 hover:backdrop-blur-xl hover:scale-[1.05] border-white/10 hover:border-[#2FB68E]/40 shadow-lg hover:shadow-2xl hover:shadow-[#022902]/40" 
                : "hover:bg-white/[0.08] hover:scale-[1.02]"
            }`}
          >
            <div className="absolute -top-10 -right-10 opacity-[0.03] group-hover:scale-110 group-hover:opacity-[0.05] transition-all duration-700">
               <Book className={`w-48 h-48 ${isAsr ? "text-[#FFD700]" : ""}`} />
            </div>

            <div className="flex items-center gap-6 mb-8">
               <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-serif italic transition-all border ${
                 isAsr 
                   ? "bg-[#FFD700]/5 border-[#FFD700]/20 text-[#FFD700]/40 group-hover:text-[#FFD700] group-hover:border-[#FFD700]/40" 
                   : "bg-white/5 border-white/10 text-white/30 group-hover:text-amber-400 group-hover:border-amber-400/20"
               }`}>
                  {surah.id}
               </div>
               <div className="flex flex-col">
                  <h3 className="text-2xl font-bold text-white group-hover:text-white transition-colors">{surah.title}</h3>
                  <p className={`text-xs font-bold uppercase tracking-[0.2em] transition-colors ${isAsr ? "text-white/60" : "text-white/30"}`}>{surah.sub_title}</p>
               </div>
            </div>

            <div className={`flex items-center justify-between pt-6 border-t ${isAsr ? "border-[#FFD700]/10" : "border-white/5"}`}>
               <div className="flex flex-col">
                  <span className={`text-[10px] uppercase tracking-widest font-bold ${isAsr ? "text-white/40" : "text-white/20"}`}>Verses</span>
                  <span className={`text-sm font-mono ${isAsr ? "text-white/80" : "text-white/60"}`}>{surah.verse}</span>
               </div>
               <div className="flex flex-col items-end">
                  <span className={`text-[10px] uppercase tracking-widest font-bold ${isAsr ? "text-white/40" : "text-white/20"}`}>Type</span>
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter transition-colors ${
                    surah.surah_type === "Makki" 
                      ? (isAsr ? "bg-[#FFD700]/10 text-[#FFD700]" : "bg-amber-400/10 text-amber-400") 
                      : (isAsr ? "bg-[#FFD700]/10 text-[#FFD700]" : "bg-sky-400/10 text-sky-400")
                  }`}>
                    {surah.surah_type}
                  </span>
               </div>
            </div>

            <div className="mt-8 flex justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all">
               <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors ${
                 isAsr ? "text-[#FFD700]/80 group-hover:text-[#FFD700]" : "text-white/40 hover:text-white"
               }`}>
                  Read Surah <ArrowRight className="w-4 h-4" />
               </div>
            </div>
            
            <div className={`absolute top-8 right-8 text-3xl font-serif transition-colors ${
              isAsr ? "text-white/10 group-hover:text-[#FFD700]/40" : "text-white/5 group-hover:text-white/10"
            }`} dir="rtl">
               {surah.title_arb}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
