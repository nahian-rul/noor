import React, { useState } from "react";
import data from "../data/duas";
import { motion, AnimatePresence } from "motion/react";
import {
  Heart, Copy, Search, ChevronRight, ChevronLeft,
  BookOpen, ChevronDown, ChevronUp, Check
} from "lucide-react";

type DuaItem = {
  dua_id: number;
  dua_title: string;
  dua_details: {
    dua_arb: string;
    dua_transliteration: string;
    dua_meaning: string;
    dua_virtue?: string;
  };
  status: boolean;
};

type Section = {
  item_id: number;
  item_title: string;
  item_details: DuaItem[];
};

type Category = {
  category_id: number;
  category_name: string;
  category_details: Section[];
};

export const Duas: React.FC = () => {
  const rawData = (data as any).data as Category[];

  // Filter out categories with no dua content
  const allData = rawData.filter(cat =>
    cat.category_details.some(sec => sec.item_details.length > 0)
  );

  const [activeCategory, setActiveCategory] = useState<Category>(allData[0]);
  const [activeSection, setActiveSection] = useState<Section>(
    allData[0].category_details.find(s => s.item_details.length > 0) || allData[0].category_details[0]
  );
  const [duaIndex, setDuaIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<(DuaItem & { category: string; section: string })[]>([]);
  const [searchDuaIndex, setSearchDuaIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState({ transliteration: true, translation: true, virtue: false });

  const isSearching = searchQuery.trim().length > 0;

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    setSearchDuaIndex(0);
    if (!q.trim()) { setSearchResults([]); return; }
    const results: (DuaItem & { category: string; section: string })[] = [];
    allData.forEach(cat =>
      cat.category_details.forEach(sec =>
        sec.item_details.forEach(dua => {
          if (
            dua.dua_title.toLowerCase().includes(q.toLowerCase()) ||
            dua.dua_details.dua_meaning.toLowerCase().includes(q.toLowerCase())
          ) {
            results.push({ ...dua, category: cat.category_name, section: sec.item_title });
          }
        })
      )
    );
    setSearchResults(results);
  };

  const currentDuas: DuaItem[] = isSearching ? searchResults : activeSection.item_details;
  const currentIndex = isSearching ? searchDuaIndex : duaIndex;
  const setCurrentIndex = isSearching ? setSearchDuaIndex : setDuaIndex;
  const currentDua = currentDuas[currentIndex];
  const totalDuas = currentDuas.length;

  const handleSectionChange = (cat: Category, section: Section) => {
    setActiveCategory(cat);
    setActiveSection(section);
    setDuaIndex(0);
    setExpanded({ transliteration: true, translation: true, virtue: false });
  };

  const copyDua = () => {
    if (!currentDua) return;
    const text = `${currentDua.dua_details.dua_arb}\n\n${currentDua.dua_details.dua_transliteration}\n\n${currentDua.dua_details.dua_meaning}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const goNext = () => setCurrentIndex(Math.min(totalDuas - 1, currentIndex + 1));
  const goPrev = () => setCurrentIndex(Math.max(0, currentIndex - 1));

  return (
    <div className="space-y-8 pb-24">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-serif italic tracking-tight">Duas & Adhkar</h1>
          <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Supplications for every moment</p>
        </div>
        <div className="relative group w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-amber-400 transition-colors" />
          <input
            type="text"
            placeholder="Search supplications..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-amber-400/40 transition-all font-medium"
          />
        </div>
      </header>

      {/* Category Tabs — only show categories that have content */}
      {!isSearching && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {allData.map(cat => (
            <button
              key={cat.category_id}
              onClick={() => {
                const firstSec = cat.category_details.find(s => s.item_details.length > 0) || cat.category_details[0];
                handleSectionChange(cat, firstSec);
              }}
              className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap border transition-all ${
                activeCategory.category_id === cat.category_id
                  ? "bg-white text-black border-white"
                  : "bg-white/5 text-white/40 border-white/10 hover:border-white/20"
              }`}
            >
              {cat.category_name}
            </button>
          ))}
        </div>
      )}

      <div className={`grid gap-8 ${isSearching ? "" : "grid-cols-1 lg:grid-cols-4"}`}>
        {/* Left Sidebar: Dua Sections */}
        {!isSearching && (
          <aside className="lg:col-span-1">
            <p className="text-[9px] uppercase font-black tracking-[0.3em] text-white/20 pl-3 mb-3">Dua Types</p>
            <div className="space-y-1">
              {/* Only show sections that have duas */}
              {activeCategory.category_details
                .filter(sec => sec.item_details.length > 0)
                .map(sec => (
                  <button
                    key={sec.item_id}
                    onClick={() => handleSectionChange(activeCategory, sec)}
                    className={`w-full text-left px-4 py-3 rounded-2xl transition-all text-xs font-bold flex items-center justify-between group ${
                      activeSection.item_id === sec.item_id
                        ? "bg-amber-400/10 text-amber-400 border border-amber-400/20"
                        : "text-white/30 hover:bg-white/5 border border-transparent hover:text-white/60"
                    }`}
                  >
                    <span className="truncate pr-2">{sec.item_title}</span>
                    <span className="text-[9px] opacity-50 shrink-0 bg-white/5 px-1.5 py-0.5 rounded-full">
                      {sec.item_details.length}
                    </span>
                  </button>
                ))}
            </div>
          </aside>
        )}

        {/* Main Dua Card area */}
        <div className={`${isSearching ? "w-full" : "lg:col-span-3"} space-y-4`}>
          {totalDuas > 0 && (
            <>
              {/* ── TOP Navigation Bar ── */}
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/30 truncate max-w-[160px]">
                    {isSearching ? `"${searchQuery}"` : activeSection.item_title}
                  </span>
                  <span className="text-[9px] text-white/20 font-mono shrink-0">{currentIndex + 1}/{totalDuas}</span>
                </div>
                {/* Progress dots */}
                <div className="flex gap-1.5 overflow-hidden max-w-[120px] items-center">
                  {Array.from({ length: Math.min(totalDuas, 8) }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentIndex(i)}
                      className={`h-1 rounded-full transition-all ${
                        i === currentIndex ? "bg-amber-400 w-5" : "bg-white/10 w-1.5 hover:bg-white/30"
                      }`}
                    />
                  ))}
                  {totalDuas > 8 && <span className="text-[8px] text-white/20 ml-1">+{totalDuas - 8}</span>}
                </div>
              </div>

              {/* ── TOP Prev/Next ── */}
              <div className="flex items-center gap-3">
                <button
                  onClick={goPrev}
                  disabled={currentIndex === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Prev
                </button>
                <button
                  onClick={goNext}
                  disabled={currentIndex === totalDuas - 1}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-amber-400 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                >
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          )}

          {/* Dua Card */}
          <AnimatePresence mode="wait">
            {currentDua ? (
              <motion.div
                key={`${currentDua.dua_id}-${currentIndex}`}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="relative p-8 md:p-12 bg-white/5 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 space-y-8 group hover:bg-white/[0.07] transition-all"
              >
                {/* Card Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center shrink-0">
                      <BookOpen className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white/90 leading-snug">{currentDua.dua_title}</h2>
                      {isSearching && (
                        <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mt-0.5">
                          {(currentDua as any).category} › {(currentDua as any).section}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={copyDua}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all shrink-0"
                  >
                    {copied
                      ? <Check className="w-4 h-4 text-emerald-400" />
                      : <Copy className="w-4 h-4 text-white/30" />}
                  </button>
                </div>

                {/* Arabic Text */}
                <div className="py-8 border-y border-white/5">
                  <p className="text-3xl md:text-5xl font-serif leading-[2] text-white text-right" dir="rtl">
                    {currentDua.dua_details.dua_arb}
                  </p>
                </div>

                {/* Expandable sections */}
                <div className="space-y-3">
                  <ExpandableSection
                    title="Transliteration"
                    isOpen={expanded.transliteration}
                    onToggle={() => setExpanded(p => ({ ...p, transliteration: !p.transliteration }))}
                    accent="amber"
                  >
                    <p className="text-sm text-amber-400/70 font-serif italic leading-relaxed">{currentDua.dua_details.dua_transliteration}</p>
                  </ExpandableSection>

                  <ExpandableSection
                    title="Translation"
                    isOpen={expanded.translation}
                    onToggle={() => setExpanded(p => ({ ...p, translation: !p.translation }))}
                    accent="white"
                  >
                    <p className="text-base text-white/70 leading-relaxed">{currentDua.dua_details.dua_meaning}</p>
                  </ExpandableSection>

                  {currentDua.dua_details.dua_virtue && (
                    <ExpandableSection
                      title="Virtue & Reference"
                      isOpen={expanded.virtue}
                      onToggle={() => setExpanded(p => ({ ...p, virtue: !p.virtue }))}
                      accent="emerald"
                    >
                      <p className="text-xs text-white/40 leading-relaxed italic">{currentDua.dua_details.dua_virtue}</p>
                    </ExpandableSection>
                  )}
                </div>

                {/* Bottom Nav */}
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <button
                    onClick={goPrev}
                    disabled={currentIndex === 0}
                    className="flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-20 disabled:cursor-not-allowed group/btn"
                  >
                    <ChevronLeft className="w-4 h-4 group-hover/btn:-translate-x-0.5 transition-transform" />
                    Previous
                  </button>
                  <Heart className="w-4 h-4 text-white/10 hover:text-rose-400 transition-colors cursor-pointer" />
                  <button
                    onClick={goNext}
                    disabled={currentIndex === totalDuas - 1}
                    className="flex items-center gap-3 px-6 py-3 bg-white text-black hover:bg-amber-400 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-20 disabled:cursor-not-allowed group/btn"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-20 text-white/20">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p className="text-sm font-bold uppercase tracking-widest">No results found</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

/* Expandable Section */
const ExpandableSection: React.FC<{
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  accent: "amber" | "white" | "emerald";
  children: React.ReactNode;
}> = ({ title, isOpen, onToggle, accent, children }) => {
  const styles = {
    amber: "text-amber-400 border-amber-400/20 bg-amber-400/5",
    white: "text-white/60 border-white/10 bg-white/5",
    emerald: "text-emerald-400 border-emerald-400/20 bg-emerald-400/5",
  };
  return (
    <div className={`rounded-2xl border overflow-hidden ${styles[accent]}`}>
      <button onClick={onToggle} className="w-full flex items-center justify-between px-5 py-3 hover:brightness-110 transition-all">
        <span className="text-[9px] font-black uppercase tracking-[0.25em]">{title}</span>
        {isOpen ? <ChevronUp className="w-3.5 h-3.5 opacity-60" /> : <ChevronDown className="w-3.5 h-3.5 opacity-60" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
