import React, { useState } from "react";
import quotesData from "../data/quotes";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Copy, Share2, Search, Quote as QuoteIcon } from "lucide-react";

const CATEGORY_MAP: Record<number, string> = {
  2: "Faith",
  3: "Patience",
  6: "Knowledge",
};

export const Quotes: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<number | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const allQuotes = quotesData as any[];
  
  const filteredQuotes = allQuotes.filter((q: any) => {
    const matchesCategory = activeCategory === "all" || q.category_id === activeCategory;
    const matchesSearch = q.quote.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         q.reference.toLowerCase().includes(searchQuery.toLowerCase());
    // Only show quotes from our active categories or all if it's the active categories
    const isActiveCategory = CATEGORY_MAP[q.category_id as number];
    return matchesCategory && matchesSearch && (activeCategory !== "all" || isActiveCategory);
  });

  const getCount = (id: number | "all") => {
    if (id === "all") {
       return allQuotes.filter(q => CATEGORY_MAP[q.category_id]).length;
    }
    return allQuotes.filter(q => q.category_id === id).length;
  };

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-serif italic tracking-tight">Wisdom & Quotes</h1>
          <p className="text-white/60 text-sm">Timeless words of inspiration and faith.</p>
        </div>

        <div className="relative group w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-amber-400 transition-colors" />
          <input
            type="text"
            placeholder="Search quotes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-white/20 transition-all font-medium"
          />
        </div>
      </header>

      {/* Categories */}
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
        <button
          onClick={() => setActiveCategory("all")}
          className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap border transition-all flex items-center gap-2 ${
            activeCategory === "all"
              ? "bg-white text-black border-white shadow-lg shadow-white/10"
              : "bg-white/5 text-white/40 border-white/10 hover:border-white/20"
          }`}
        >
          All Quotes <span className={`opacity-40 text-[9px] ${activeCategory === "all" ? "text-black/60" : ""}`}>{getCount("all")}</span>
        </button>
        {Object.entries(CATEGORY_MAP).map(([idStr, label]) => {
          const id = parseInt(idStr);
          const count = getCount(id);
          return (
            <button
              key={id}
              onClick={() => setActiveCategory(id)}
              className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap border transition-all flex items-center gap-2 ${
                activeCategory === id
                  ? "bg-white text-black border-white shadow-lg shadow-white/10"
                  : "bg-white/5 text-white/40 border-white/10 hover:border-white/20"
              }`}
            >
              {label} <span className={`opacity-40 text-[9px] ${activeCategory === id ? "text-black/60" : ""}`}>{count}</span>
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredQuotes.map((q: any, idx: number) => (
            <motion.div
              key={q.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: idx * 0.02 }}
              className="group relative p-10 bg-white/5 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 space-y-8 flex flex-col justify-between hover:bg-white/[0.08] transition-all overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-10 opacity-[0.03] rotate-12 group-hover:rotate-6 transition-transform duration-700">
                 <QuoteIcon className="w-32 h-32" />
              </div>

              <div className="space-y-6 relative">
                <span className="px-3 py-1.5 rounded-full bg-amber-400/10 text-amber-400 text-[10px] uppercase tracking-widest font-bold border border-amber-400/20">
                  {CATEGORY_MAP[q.category_id as number] || "General"}
                </span>
                
                <p className="text-2xl md:text-3xl font-serif italic leading-relaxed text-white/90">
                  "{q.quote}"
                </p>
                
                <div className="flex flex-col gap-1 pt-2">
                   <p className="text-sm font-bold text-white/40 uppercase tracking-widest">— {q.reference}</p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-white/5 relative">
                <div className="flex gap-4">
                   <button className="flex items-center gap-2 text-white/30 hover:text-white transition-colors">
                      <Copy className="w-4 h-4" />
                      <span className="text-[10px] uppercase font-bold tracking-widest">Copy</span>
                   </button>
                   <button className="flex items-center gap-2 text-white/30 hover:text-white transition-colors">
                      <Heart className="w-4 h-4" />
                      <span className="text-[10px] uppercase font-bold tracking-widest">Favorite</span>
                   </button>
                </div>
                
                <button className="p-3 rounded-full bg-white/5 hover:bg-white group/btn transition-all">
                   <Share2 className="w-4 h-4 text-white/40 group-hover/btn:text-black transition-colors" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
