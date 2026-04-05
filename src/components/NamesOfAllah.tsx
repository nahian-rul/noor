import React, { useState, useEffect } from "react";
import namesData from "../data/names";
import { motion, AnimatePresence } from "motion/react";
import { Search, Heart, Share2, X, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { useUser } from "../contexts/UserContext";

const names = namesData as any[];
const STORAGE_KEY = "noor_names_session";

export const NamesOfAllah: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const { markNameLearned, completedNames } = useUser();

  // Persistence (Load)
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const d = JSON.parse(saved);
        if (d.search) setSearchQuery(d.search);
        if (typeof d.selected === "number") setSelectedIdx(d.selected);
      } catch (e) { console.error("Failed to load names session", e); }
    }
  }, []);

  // Persistence (Save)
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      search: searchQuery,
      selected: selectedIdx
    }));
  }, [searchQuery, selectedIdx]);

  const filteredNames = names.filter((n: any) => {
    const search = searchQuery.toLowerCase();
    if (!search) return true;
    const translit = (n.Transliteration || n.transliteration || "").toLowerCase();
    const meaning = (n.Meaning || n.meaning || "").toLowerCase();
    return translit.includes(search) || meaning.includes(search) || String(n.ID || n.id) === search;
  });

  const openModal = (idx: number) => setSelectedIdx(idx);
  const closeModal = () => setSelectedIdx(null);

  const selectedName = selectedIdx !== null ? filteredNames[selectedIdx] : null;
  const canNext = selectedIdx !== null && selectedIdx < filteredNames.length - 1;
  const canPrev = selectedIdx !== null && selectedIdx > 0;

  return (
    <div className="space-y-10 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-serif italic tracking-tight">99 Names of Allah</h1>
          <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Asma'ul Husna — The Most Beautiful Names</p>
        </div>
        <div className="relative group w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-amber-400 transition-colors" />
          <input
            type="text"
            placeholder="Search by name or meaning..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-amber-400/40 transition-all font-medium"
          />
        </div>
      </header>

      {/* Responsive Grid: 1 → 2 → 3 → 4 cols */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredNames.map((n: any, idx: number) => (
          <motion.div
            key={n.ID || n.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (idx % 20) * 0.025, duration: 0.28 }}
            onClick={() => openModal(idx)}
            className="group p-6 glass-card cursor-pointer hover:bg-white/[0.09] hover:border-amber-400/20 hover:scale-[1.02] active:scale-[0.98] transition-all relative overflow-hidden"
          >
            {completedNames.includes((n.ID || n.id).toString()) && (
              <div className="absolute top-4 right-4 text-emerald-400">
                 <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            )}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[9px] font-black text-white/30 group-hover:text-amber-400 group-hover:border-amber-400/20 transition-all">
                {n.ID || n.id}
              </div>
              <div className="space-y-1.5">
                <h2 className="text-4xl font-serif text-white/90 group-hover:text-white transition-colors" dir="rtl">
                  {n.Arabic || n.arabic}
                </h2>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400/60">
                  {n.Transliteration || n.transliteration}
                </p>
                <p className="text-xs text-white/40 group-hover:text-white/60 transition-colors leading-snug">
                  {n.Meaning || n.meaning}
                </p>
              </div>
            </div>
            <div className="absolute -bottom-3 -right-1 text-7xl font-black text-white/[0.02] group-hover:text-white/[0.04] transition-all pointer-events-none italic font-serif select-none">
              {n.ID || n.id}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detail Modal with mid-border Next/Prev */}
      <AnimatePresence>
        {selectedName && selectedIdx !== null && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal card */}
            <div className="relative flex flex-col items-center">
              {/* ─── MID-BORDER: Prev / Next ─── */}
              {/* These sit on the left & right edges of the card at vertical center */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10">
                <button
                  onClick={(e) => { e.stopPropagation(); if (canPrev) setSelectedIdx(selectedIdx - 1); }}
                  disabled={!canPrev}
                  className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all disabled:opacity-20 disabled:cursor-not-allowed shadow-xl"
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>
              </div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10">
                <button
                  onClick={(e) => { e.stopPropagation(); if (canNext) setSelectedIdx(selectedIdx + 1); }}
                  disabled={!canNext}
                  className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all disabled:opacity-20 disabled:cursor-not-allowed shadow-xl"
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedIdx}
                  initial={{ scale: 0.92, opacity: 0, y: 16 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.96, opacity: 0, y: -8 }}
                  transition={{ duration: 0.22 }}
                  className="relative w-[90vw] max-w-lg glass-modal rounded-[3rem] p-12 overflow-hidden shadow-2xl"
                >
                  <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none select-none">
                    <div className="text-[10rem] font-serif italic leading-none">{selectedName.ID || selectedName.id}</div>
                  </div>

                  <div className="relative space-y-8">
                    {/* Header row */}
                    <div className="flex justify-between items-start">
                      <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-white/40">
                        {selectedIdx + 1} of {filteredNames.length}
                      </div>
                      <button onClick={closeModal} className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                        <X className="w-4 h-4 text-white/40" />
                      </button>
                    </div>

                    {/* Name display */}
                    <div className="text-center space-y-5">
                      <h2 className="text-8xl font-serif text-white" dir="rtl">
                        {selectedName.Arabic || selectedName.arabic}
                      </h2>
                      <div className="space-y-2">
                        <p className="text-lg font-black uppercase tracking-[0.3em] text-amber-400">
                          {selectedName.Transliteration || selectedName.transliteration}
                        </p>
                        <p className="text-xl text-white/60 font-serif italic">
                          {selectedName.Meaning || selectedName.meaning}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                      {!completedNames.includes((selectedName.ID || selectedName.id).toString()) ? (
                         <button 
                           onClick={() => markNameLearned((selectedName.ID || selectedName.id).toString())}
                           className="flex-1 py-4 bg-emerald-500 text-black rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-emerald-400 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20"
                         >
                           Mark as Learned <CheckCircle2 className="w-4 h-4" />
                         </button>
                      ) : (
                         <div className="flex-1 py-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2 italic">
                            Learned <CheckCircle2 className="w-4 h-4" />
                         </div>
                      )}
                      <div className="flex gap-4">
                        <button className="flex-1 sm:flex-none px-6 py-4 glass-button rounded-2xl text-white/40 hover:text-white transition-all flex items-center justify-center gap-2">
                          <Share2 className="w-4 h-4" />
                        </button>
                        <button className="p-4 glass-button rounded-2xl hover:bg-rose-400/10 transition-all group/heart">
                          <Heart className="w-5 h-5 text-white/40 group-hover/heart:text-rose-400 transition-colors" />
                        </button>
                      </div>
                    </div>

                    {/* Mobile Prev/Next inside modal bottom for small screens */}
                    <div className="flex items-center justify-between pt-2 sm:hidden">
                      <button
                        onClick={() => canPrev && setSelectedIdx(selectedIdx - 1)}
                        disabled={!canPrev}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:bg-white/10 transition-all disabled:opacity-20"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" /> Prev
                      </button>
                      <button
                        onClick={() => canNext && setSelectedIdx(selectedIdx + 1)}
                        disabled={!canNext}
                        className="flex items-center gap-2 px-5 py-2.5 bg-amber-400/10 border border-amber-400/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-amber-400 hover:bg-amber-400/20 transition-all disabled:opacity-20"
                      >
                        Next <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
