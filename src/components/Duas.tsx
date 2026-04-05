import React, { useState, useEffect } from "react";
import data from "../data/duas";
import { motion, AnimatePresence } from "motion/react";
import {
  BookOpen, ChevronDown, ChevronUp, Check, CheckCircle2,
  Heart, Copy, Search, ChevronRight, ChevronLeft
} from "lucide-react";
import { useUser } from "../contexts/UserContext";
import { useWaqt } from "../WaqtContext";

const STORAGE_KEY = "noor_duas_session";

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
  const { markDuaLearned, completedDuas } = useUser();
  const { waqt } = useWaqt();
  const isAsr = waqt === "Asr";

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

  // Persistence (Load)
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const { catId, secId, idx } = JSON.parse(saved);
        const cat = allData.find(c => c.category_id === catId);
        if (cat) {
          setActiveCategory(cat);
          const sec = cat.category_details.find(s => s.item_id === secId);
          if (sec) {
            setActiveSection(sec);
            if (typeof idx === "number" && idx < sec.item_details.length) setDuaIndex(idx);
          }
        }
      } catch (e) { console.error("Failed to load duas session", e); }
    }
  }, []);

  // Persistence (Save)
  useEffect(() => {
    if (!isSearching) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        catId: activeCategory.category_id,
        secId: activeSection.item_id,
        idx: duaIndex
      }));
    }
  }, [activeCategory, activeSection, duaIndex]);

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
          <h1 className="text-4xl font-serif italic tracking-tight text-white">Duas & Adhkar</h1>
          <p className={`text-xs font-bold uppercase tracking-widest ${isAsr ? "text-white/60" : "text-white/40"}`}>Supplications for every moment</p>
        </div>
        <div className="relative group w-full md:w-80">
          <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
            isAsr ? "text-white/40 group-focus-within:text-[#FFD700]" : "text-white/20 group-focus-within:text-amber-400"
          }`} />
          <input
            type="text"
            placeholder="Search supplications..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className={`w-full bg-white/5 border rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none transition-all font-medium ${
              isAsr ? "border-white/10 focus:border-[#FFD700]/40" : "border-white/10 focus:border-amber-400/40"
            }`}
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
                setActiveCategory(cat);
                const s = cat.category_details.find(sec => sec.item_details.length > 0) || cat.category_details[0];
                handleSectionChange(cat, s);
              }}
              className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap border transition-all ${
                activeCategory.category_id === cat.category_id
                  ? (isAsr ? "bg-[#FFD700] text-black border-[#FFD700]" : "bg-white text-black border-white")
                  : "glass-button text-white/40 border-white/5 hover:border-white/20"
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
            <p className={`text-[9px] uppercase font-black tracking-[0.3em] pl-3 mb-3 ${isAsr ? "text-white/40" : "text-white/20"}`}>Dua Types</p>
            <div className="space-y-1">
              {/* Only show sections that have duas */}
              {activeCategory.category_details
                .filter(sec => sec.item_details.length > 0)
                .map(sec => (
                  <button
                    key={sec.item_id}
                    onClick={() => handleSectionChange(activeCategory, sec)}
                    className={`w-full text-left px-5 py-4 rounded-2xl transition-all text-xs font-bold flex items-center justify-between group border tracking-tight ${
                      activeSection.item_id === sec.item_id
                        ? (isAsr 
                            ? "bg-[#FFD700]/10 text-[#FFD700] border-[#FFD700]/20 shadow-[0_0_15px_rgba(255,215,0,0.1)]" 
                            : "bg-amber-400/10 text-amber-400 border-amber-400/20 shadow-[0_0_15px_rgba(251,191,36,0.1)]")
                        : "text-white/30 hover:bg-white/5 border-transparent hover:text-white/60 hover:border-white/10"
                    }`}
                  >
                    <span className="truncate pr-2">{sec.item_title}</span>
                    <span className={`text-[9px] opacity-50 shrink-0 px-2 py-0.5 rounded-full ${isAsr ? "bg-[#FFD700]/10 text-[#FFD700]" : "bg-white/5"}`}>
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
                  <span className={`text-[9px] font-black uppercase tracking-widest truncate max-w-[160px] ${isAsr ? "text-white/60" : "text-white/30"}`}>
                    {isSearching ? `"${searchQuery}"` : activeSection.item_title}
                  </span>
                  <span className={`text-[9px] font-mono shrink-0 ${isAsr ? "text-white/40" : "text-white/20"}`}>{currentIndex + 1}/{totalDuas}</span>
                </div>
                {/* Progress dots */}
                <div className="flex gap-1.5 overflow-hidden max-w-[120px] items-center">
                  {Array.from({ length: Math.min(totalDuas, 8) }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentIndex(i)}
                      className={`h-1 rounded-full transition-all ${
                        i === currentIndex 
                          ? (isAsr ? "bg-[#FFD700] w-5 shadow-[0_0_10px_rgba(255,215,0,0.3)]" : "bg-amber-400 w-5") 
                          : "bg-white/10 w-1.5 hover:bg-white/30"
                      }`}
                    />
                  ))}
                  {totalDuas > 8 && <span className={`text-[8px] ml-1 ${isAsr ? "text-white/40" : "text-white/20"}`}>+{totalDuas - 8}</span>}
                </div>
              </div>

              {/* ── TOP Prev/Next ── */}
              <div className="flex items-center gap-3">
                <button
                  onClick={goPrev}
                  disabled={currentIndex === 0}
                  className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-20 disabled:cursor-not-allowed ${
                    isAsr ? "bg-white/5 border-white/10 hover:border-[#2FB68E]/30 hover:text-white" : "bg-white/5 hover:bg-white/10 border-white/10"
                  }`}
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Prev
                </button>
                <button
                  onClick={goNext}
                  disabled={currentIndex === totalDuas - 1}
                  className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-20 disabled:cursor-not-allowed ${
                    isAsr 
                      ? "bg-[#2FB68E]/10 border-[#2FB68E]/20 text-[#2FB68E]/80 hover:text-[#2FB68E] hover:bg-[#2FB68E]/20 shadow-lg hover:shadow-[#2FB68E]/5" 
                      : "bg-amber-400/10 hover:bg-amber-400/20 border-amber-400/20 text-amber-400"
                  }`}
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
                className={`relative p-8 md:p-12 glass-card space-y-8 group transition-all duration-500 overflow-hidden ${
                  isAsr 
                    ? "bg-white/[0.04] border-white/10 hover:border-[#2FB68E]/40 hover:bg-[#022902]/60 hover:backdrop-blur-xl hover:scale-[1.03] hover:shadow-2xl hover:shadow-[#022902]/40" 
                    : "hover:bg-white/[0.07]"
                }`}
              >
                {/* Completion Status Overlay (Subtle) */}
                {completedDuas.includes(currentDua.dua_id.toString()) && (
                  <div className={`absolute top-6 right-20 flex items-center gap-1.5 px-3 py-1 border rounded-full text-[9px] font-black uppercase tracking-widest italic animate-fade-in ${
                    isAsr ? "bg-[#FFD700]/10 border-[#FFD700]/20 text-[#FFD700]" : "bg-emerald-400/10 border-emerald-400/20 text-emerald-400"
                  }`}>
                    Learned <CheckCircle2 className="w-3 h-3" />
                  </div>
                )}
                {/* Card Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
                      isAsr ? "bg-[#FFD700]/10 border-[#FFD700]/20" : "bg-amber-400/10 border-amber-400/20"
                    }`}>
                      <BookOpen className={`w-4 h-4 ${isAsr ? "text-[#FFD700]" : "text-amber-400"}`} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white/95 leading-snug">{currentDua.dua_title}</h2>
                      {isSearching && (
                        <p className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 ${isAsr ? "text-white/40" : "text-white/30"}`}>
                          {(currentDua as any).category} › {(currentDua as any).section}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={copyDua}
                    className={`p-2.5 rounded-xl border transition-all shrink-0 ${
                      isAsr ? "bg-[#FFD700]/5 border-[#FFD700]/20 hover:bg-[#FFD700]/10" : "bg-white/5 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    {copied
                      ? <Check className="w-4 h-4 text-emerald-400" />
                      : <Copy className={`w-4 h-4 ${isAsr ? "text-[#FFD700]/60" : "text-white/30"}`} />}
                  </button>
                </div>

                {/* Arabic Text */}
                <div className={`py-8 border-y ${isAsr ? "border-[#FFD700]/10" : "border-white/5"}`}>
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
                    accent={isAsr ? "gold" : "amber"}
                  >
                    <p className={`text-sm font-serif italic leading-relaxed text-white/90`}>{currentDua.dua_details.dua_transliteration}</p>
                  </ExpandableSection>

                  <ExpandableSection
                    title="Translation"
                    isOpen={expanded.translation}
                    onToggle={() => setExpanded(p => ({ ...p, translation: !p.translation }))}
                    accent="white"
                  >
                    <p className="text-base text-white/90 leading-relaxed">{currentDua.dua_details.dua_meaning}</p>
                  </ExpandableSection>

                  {currentDua.dua_details.dua_virtue && (
                    <ExpandableSection
                      title="Virtue & Reference"
                      isOpen={expanded.virtue}
                      onToggle={() => setExpanded(p => ({ ...p, virtue: !p.virtue }))}
                      accent={isAsr ? "gold_soft" : "emerald"}
                    >
                      <p className={`text-xs leading-relaxed italic ${isAsr ? "text-white/60" : "text-white/40"}`}>{currentDua.dua_details.dua_virtue}</p>
                    </ExpandableSection>
                  )}
                </div>

                {/* Bottom Nav */}
                <div className={`flex items-center justify-between pt-4 border-t ${isAsr ? "border-[#FFD700]/10" : "border-white/5"}`}>
                  <button
                    onClick={goPrev}
                    disabled={currentIndex === 0}
                    className={`flex items-center gap-3 px-6 py-4 glass-button rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-20 disabled:cursor-not-allowed group/btn border border-transparent hover:border-white/10`}
                  >
                    <ChevronLeft className="w-4 h-4 group-hover/btn:-translate-x-0.5 transition-transform" />
                    Previous
                  </button>
                  
                  {!completedDuas.includes(currentDua.dua_id.toString()) ? (
                    <button 
                      onClick={() => markDuaLearned(currentDua.dua_id.toString())}
                      className={`flex items-center gap-2.5 px-6 py-4 border rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all group/learn ${
                        isAsr 
                          ? "bg-[#FFD700]/10 border-[#FFD700]/20 text-[#FFD700] hover:bg-[#FFD700] hover:text-black" 
                          : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-black"
                      }`}
                    >
                      <span className="group-hover/learn:scale-110 transition-transform">Mark as Learned</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 text-rose-400 transition-colors cursor-pointer group/heart">
                      <Heart className="w-4 h-4" />
                      <span className="text-[9px] font-black tracking-widest opacity-0 group-hover/heart:opacity-100 transition-opacity">FAVORITE</span>
                    </div>
                  )}

                  <button
                    onClick={goNext}
                    disabled={currentIndex === totalDuas - 1}
                    className={`flex items-center gap-3 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-20 disabled:cursor-not-allowed group/btn shadow-xl ${
                      isAsr 
                        ? "bg-[#FFD700] text-black shadow-[#FFD700]/20 hover:brightness-110" 
                        : "bg-white text-black hover:bg-amber-400 shadow-white/5"
                    }`}
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
  accent: "amber" | "white" | "emerald" | "gold" | "gold_soft";
  children: React.ReactNode;
}> = ({ title, isOpen, onToggle, accent, children }) => {
  const styles = {
    amber: "text-amber-400 border-amber-400/20 bg-amber-400/5",
    white: "text-white/60 border-white/10 bg-white/5",
    emerald: "text-emerald-400 border-emerald-400/20 bg-emerald-400/5",
    gold: "text-[#FFD700] border-[#FFD700]/20 bg-[#FFD700]/5",
    gold_soft: "text-white/60 border-[#FFD700]/10 bg-[#FFD700]/5",
  };
  return (
    <div className={`rounded-2xl border overflow-hidden transition-colors ${styles[accent]}`}>
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
