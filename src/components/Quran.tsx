import React, { useState } from "react";
import quranData from "../data/quran";
import { motion, AnimatePresence } from "motion/react";
import { Book, Search, ChevronLeft, Bookmark, Share2, Play, ArrowRight } from "lucide-react";

export const Quran: React.FC = () => {
  const [selectedSurah, setSelectedSurah] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

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
            className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="flex flex-col">
             <div className="flex items-center gap-3">
                <span className="text-3xl font-serif italic text-white/90">{selectedSurah.title}</span>
                <span className="text-2xl font-serif text-amber-400/60" dir="rtl">{selectedSurah.title_arb}</span>
             </div>
             <p className="text-sm text-white/40 font-bold uppercase tracking-widest">{selectedSurah.sub_title} • {selectedSurah.surah_type} • {selectedSurah.verse} Verses</p>
          </div>
        </header>

        <div className="space-y-12">
          {selectedSurah.surah_details.map((ayat: any, idx: number) => (
            <motion.div
              key={ayat.ayat_id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-10 bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/10 space-y-10 group hover:bg-white/[0.07] transition-all relative"
            >
              <div className="absolute top-10 left-10 flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-white/30">
                {ayat.ayat_id}
              </div>

              <div className="flex flex-col gap-10">
                <p className="text-4xl md:text-6xl font-serif leading-[2.2] text-white text-right" dir="rtl">
                  {ayat.ayat_arb}
                </p>
                
                <div className="space-y-6 max-w-3xl">
                   <p className="text-sm text-amber-400/60 font-serif italic leading-relaxed tracking-wide">
                      {ayat.ayat_transliteration}
                   </p>
                   <p className="text-lg text-white/80 leading-relaxed font-light">
                      {ayat.ayat_meaning}
                   </p>
                </div>
              </div>

              <div className="flex items-center gap-6 pt-8 border-t border-white/5">
                 <button className="flex items-center gap-2 text-white/20 hover:text-white transition-colors">
                    <Play className="w-4 h-4" />
                    <span className="text-[10px] uppercase font-bold tracking-widest">Listen</span>
                 </button>
                 <button className="flex items-center gap-2 text-white/20 hover:text-white transition-colors">
                    <Bookmark className="w-4 h-4" />
                    <span className="text-[10px] uppercase font-bold tracking-widest">Bookmark</span>
                 </button>
                 <button className="ml-auto p-3 rounded-full bg-white/5 hover:bg-white-10 transition-all opacity-0 group-hover:opacity-100">
                    <Share2 className="w-4 h-4 text-white/40" />
                 </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <h1 className="text-5xl font-serif italic tracking-tight">The Holy Quran</h1>
          <p className="text-white/40 text-sm font-medium">Selected 18 Surahs for daily recitation and spiritual nourishment.</p>
        </div>

        <div className="relative group w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-amber-400 transition-colors" />
          <input
            type="text"
            placeholder="Search surahs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-white/20 transition-all font-medium"
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
            className="group p-8 bg-white/5 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 cursor-pointer hover:bg-white/[0.08] hover:scale-[1.02] active:scale-98 transition-all relative overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 opacity-[0.03] group-hover:scale-110 group-hover:opacity-[0.05] transition-all duration-700">
               <Book className="w-48 h-48" />
            </div>

            <div className="flex items-center gap-6 mb-8">
               <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl font-serif italic text-white/30 group-hover:text-amber-400 group-hover:border-amber-400/20 transition-all">
                  {surah.id}
               </div>
               <div className="flex flex-col">
                  <h3 className="text-2xl font-bold text-white/90">{surah.title}</h3>
                  <p className="text-xs text-white/30 font-bold uppercase tracking-[0.2em]">{surah.sub_title}</p>
               </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-white/5">
               <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-white/20">Verses</span>
                  <span className="text-sm text-white/60 font-mono">{surah.verse}</span>
               </div>
               <div className="flex flex-col items-end">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-white/20">Type</span>
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter ${
                    surah.surah_type === "Makki" ? "bg-amber-400/10 text-amber-400" : "bg-sky-400/10 text-sky-400"
                  }`}>
                    {surah.surah_type}
                  </span>
               </div>
            </div>

            <div className="mt-8 flex justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all">
               <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40">
                  Read Surah <ArrowRight className="w-4 h-4" />
               </div>
            </div>
            
            <div className="absolute top-8 right-8 text-3xl font-serif text-white/5 group-hover:text-white/10 transition-colors" dir="rtl">
               {surah.title_arb}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
