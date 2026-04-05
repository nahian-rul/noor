import React from "react";
import { Link } from "react-router-dom";
import { PREDEFINED_SETS, useTasbih } from "../../contexts/TasbihContext";
import { ListTree, ChevronRight, Check, Zap, Hash, Compass, Award } from "lucide-react";
import { motion } from "motion/react";

export const PredefinedTasbihList: React.FC = () => {
  const { predefinedProgress } = useTasbih();

  return (
    <div className="space-y-12 pb-32">
      <header className="space-y-2">
        <h1 className="text-5xl font-serif italic tracking-tight bg-gradient-to-br from-white to-white/40 bg-clip-text text-transparent">Spiritual Packs</h1>
        <p className="text-white/30 text-[11px] font-black uppercase tracking-[0.3em] leading-relaxed max-w-2xl">
          Curated dhikr sequences for protection, peace, and spiritual growth.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {PREDEFINED_SETS.map((set, idx) => {
          const progress = predefinedProgress[set.id];
          const hasStarted = progress && (progress.currentCount > 0 || progress.totalCycles > 0);
          const isComplete = progress && (progress.totalCycles > 0);
          
          const totalTaps = set.duas.reduce((acc, d) => acc + d.target, 0);

          return (
            <Link key={set.id} to={`/tasbih/predefined/${set.id}`} className="group h-full">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -4 }}
                className="h-full p-8 glass-card border-white/5 flex flex-col justify-between relative overflow-hidden group-hover:border-amber-400/20 transition-all duration-500 shadow-xl"
              >
                {/* Background Decoration */}
                <div className="absolute -right-4 -top-4 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-all duration-700 pointer-events-none scale-150 rotate-12">
                   <Compass className="w-48 h-48" />
                </div>
                
                <div className="space-y-8 relative z-10">
                  {/* Tag & Status Header */}
                  <div className="flex items-center justify-between gap-4">
                    {set.tag && (
                      <div className="px-3.5 py-1.5 bg-amber-400/5 border border-amber-400/10 rounded-full text-amber-400/60 text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                         <Zap className="w-2.5 h-2.5 fill-amber-400/40" /> {set.tag}
                      </div>
                    )}
                    {isComplete ? (
                      <div className="px-3 py-1 bg-emerald-400/10 border border-emerald-400/20 rounded-full text-emerald-400 text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-[0_0_15px_rgba(52,211,153,0.1)]">
                         Mastered <Check className="w-2.5 h-2.5" />
                      </div>
                    ) : hasStarted && (
                      <div className="px-3 py-1 bg-sky-400/10 border border-sky-400/20 rounded-full text-sky-400 text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5">
                         Active <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-1 h-1 bg-sky-400 rounded-full" />
                      </div>
                    )}
                  </div>

                  {/* Pack Title & Purpose */}
                  <div className="space-y-3">
                    <h2 className="text-2xl font-serif italic text-white/95 group-hover:text-amber-400 transition-all duration-300 leading-tight">
                       {set.name}
                    </h2>
                    {set.purpose && (
                      <p className="text-[10px] text-white/40 font-black uppercase tracking-widest leading-relaxed">
                         {set.purpose}
                      </p>
                    )}
                    <p className="text-[11px] text-white/20 font-medium tracking-tight leading-relaxed line-clamp-2 italic">
                       {set.description}
                    </p>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 py-6 border-y border-white/5">
                     <div className="space-y-1">
                        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/10 flex items-center gap-1">
                           <ListTree className="w-2 h-2 text-amber-400/40" /> Steps
                        </span>
                        <span className="text-sm font-mono font-bold text-white/40">{set.duas.length}</span>
                     </div>
                     <div className="space-y-1">
                        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/10 flex items-center gap-1">
                           <Hash className="w-2 h-2 text-rose-400/40" /> Total Taps
                        </span>
                        <span className="text-sm font-mono font-bold text-white/40">{totalTaps}</span>
                     </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="flex items-center justify-between pt-8 mt-auto">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400/50 flex items-center gap-1">
                       <Award className="w-2.5 h-2.5" /> Reward
                    </span>
                    <span className="text-xs text-white/40 font-bold uppercase tracking-[0.15em]">
                       +50 XP <span className="text-[8px] text-white/10 italic font-black font-sans">(POC)</span>
                    </span>
                  </div>
                  <div className="p-3 bg-white/5 group-hover:bg-amber-400/20 group-hover:text-amber-400 rounded-2xl transition-all duration-300 border border-transparent group-hover:border-amber-400/20">
                     <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
