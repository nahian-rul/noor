import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Search, 
  ArrowLeft, 
  History, 
  Sparkles,
  SearchX,
  BookOpen
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PROPHETS, Prophet } from "../data/prophets";

const ProphetCard: React.FC<{ prophet: Prophet; delay: number }> = ({ prophet, delay }) => {
  const navigate = useNavigate();
  const baseColor = prophet.color.replace('bg-', '');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.03, y: -5 }}
      onClick={() => navigate(`/prophets/${prophet.slug}`)}
      className="glass-card p-8 flex flex-col items-center justify-center text-center cursor-pointer group border-white/5 hover:border-white/20 transition-all relative overflow-hidden h-[320px]"
    >
      {/* Decorative Glow based on Power */}
      <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full bg-${baseColor}/5 blur-[80px] group-hover:bg-${baseColor}/20 transition-all duration-700`} />
      
      {/* Visual Circle (Marked Section) */}
      <div className={`w-28 h-28 rounded-full ${prophet.color}/10 border border-${baseColor}/20 flex flex-col items-center justify-center mb-6 group-hover:scale-110 transition-all duration-700 shadow-2xl relative`}>
         {/* Symbol/Emoji (as requested) */}
         <span className="text-3xl mb-1 drop-shadow-lg group-hover:scale-125 transition-transform duration-700">
            {prophet.emoji}
         </span>
         {/* Arabic Name (Small) */}
         <span className={`text-xl font-serif italic ${baseColor === 'amber-400' || baseColor === 'yellow-400' ? 'text-amber-400' : `text-${baseColor}`} drop-shadow-sm`}>
            {prophet.arabicNameShort}
         </span>
         
         {/* Orbiting Sparkle (Animation based on Power) */}
         <motion.div 
           animate={{ rotate: 360 }}
           transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
           className="absolute inset-0 border border-white/5 rounded-full"
         />
      </div>
      
      <div className="space-y-3 relative z-10">
         <h3 className="text-xl font-serif italic text-white/90 group-hover:text-white transition-colors tracking-tight">
            Prophet {prophet.name}
         </h3>
         <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/10 group-hover:text-white/30 transition-colors">
            {prophet.arabicNameFull}
         </p>
      </div>

      {/* Power/Knowledge Highlight (Simplified for scale) */}
      <div className="mt-6 pt-4 border-t border-white/5 w-full">
         <h4 className="text-[10px] font-serif italic text-white/30 group-hover:text-white/60 transition-colors truncate">
            {prophet.miracle}
         </h4>
      </div>
      
      {/* Bottom Glow */}
      <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-${baseColor}/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
    </motion.div>
  );
};

export const ProphetListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const muhammad = PROPHETS.find(p => p.slug === "muhammad");
  const others = PROPHETS.filter(p => p.slug !== "muhammad");

  const filteredOthers = others.filter((p) => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.arabicNameFull.includes(searchQuery)
  );

  const isMuhammadMatch = muhammad && (
    muhammad.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    muhammad.arabicNameFull.includes(searchQuery)
  );

  return (
    <div className="min-h-screen pb-40 max-w-7xl mx-auto px-4 md:px-6 space-y-12">
      <div className="pt-8" /> {/* Reduced Spacer */}

      {/* Main Feature: Prophet Muhammad ﷺ */}
      {isMuhammadMatch && (
         <section className="flex flex-col items-center gap-6 py-6 transition-all">
            <div className="flex flex-col items-center gap-3 text-center">
               <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
               <p className="text-[9px] font-black uppercase tracking-[0.4em] text-amber-400">The Seal of the Prophets</p>
               <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
            </div>

            <div className="w-full max-w-sm relative group">
               {/* Majestic Glow */}
               <div className="absolute -inset-10 bg-amber-400/5 blur-[100px] opacity-40 group-hover:opacity-100 transition-opacity duration-1000" />
               <ProphetCard prophet={muhammad!} delay={0.1} />
            </div>
            
            <div className="w-full flex items-center gap-8 mt-4">
               <div className="flex-1 h-[1px] bg-white/5" />
               <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/5">Other Prophets</p>
               <div className="flex-1 h-[1px] bg-white/5" />
            </div>
         </section>
      )}

      {/* Grid section */}
      <main className="space-y-16">
         {filteredOthers.length > 0 || isMuhammadMatch ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-2">
               {filteredOthers.map((prophet, idx) => (
                  <ProphetCard key={prophet.id} prophet={prophet} delay={idx * 0.05} />
               ))}
            </div>
         ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-32 flex flex-col items-center justify-center text-center space-y-6"
            >
               <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <SearchX className="w-8 h-8 text-white/20" />
               </div>
               <div className="space-y-2">
                  <h3 className="text-2xl font-serif italic text-white/40">No Matches Found</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Try searching for a different prophet name</p>
               </div>
            </motion.div>
         )}
         
         <div className="pt-20 border-t border-white/5 flex flex-col items-center gap-6">
            <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-amber-400/40">
               <BookOpen className="w-6 h-6" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 max-w-xs text-center leading-loose">
               “We relate to you, [O Muhammad], the best of stories in what We have revealed to you of this Qur'an...” — Surah Yusuf (12:3)
            </p>
         </div>
      </main>
    </div>
  );
};
