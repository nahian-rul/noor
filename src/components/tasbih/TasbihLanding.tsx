import React from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Hand, ListTree, ChevronRight } from "lucide-react";
import { useWaqt } from "../../WaqtContext";

export const TasbihLanding: React.FC = () => {
  const { waqt } = useWaqt();
  const isAsr = waqt === "Asr";

  return (
    <div className="space-y-10 pb-20">
      <header className="space-y-2">
        <h1 className="text-4xl font-serif italic tracking-tight">Tasbih Counter</h1>
        <p className="text-white/60 text-xs font-bold uppercase tracking-widest leading-relaxed max-w-sm">
          A spiritual tool for focused dhikr. Choose a guided set or create your own custom sequence.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Custom Tasbih Card */}
        <Link to="/tasbih/custom" className="group h-full">
          <motion.div 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }}
            className={`h-full p-10 glass-card border-white/5 space-y-12 relative overflow-hidden transition-all duration-500 group ${
               isAsr 
                 ? "hover:bg-[#022902]/60 hover:backdrop-blur-xl hover:scale-[1.05] hover:border-[#2FB68E]/40 hover:shadow-2xl hover:shadow-[#022902]/40" 
                 : "hover:border-amber-400/20 hover:scale-[1.02]"
            }`}
          >
            <div className="absolute right-0 top-0 p-10 opacity-[0.03] group-hover:opacity-[0.06] transition-all duration-700 pointer-events-none">
               <Hand className={`w-48 h-48 ${isAsr ? "text-white" : ""}`} />
            </div>
            
            <div className="space-y-4 relative">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${
                isAsr ? "bg-[#FFD700]/10 border-[#FFD700]/20" : "bg-amber-400/10 border-amber-400/20"
              }`}>
                 <Hand className={`w-7 h-7 ${isAsr ? "text-[#FFD700]" : "text-amber-400"}`} />
              </div>
              <div>
                <h2 className="text-2xl font-serif italic text-white/95">Personal Dhikr</h2>
                <p className="text-[11px] text-white/60 font-medium tracking-tight">Create your own tasbih sets with custom targets.</p>
              </div>
            </div>

            <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors ${
              isAsr ? "text-[#FFD700]/80 group-hover:text-[#FFD700]" : "text-amber-400/60 group-hover:text-amber-400"
            }`}>
              Continue <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>
        </Link>

        {/* Predefined Tasbih Card */}
        <Link to="/tasbih/predefined" className="group h-full">
          <motion.div 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }}
            className={`h-full p-10 glass-card border-white/5 space-y-12 relative overflow-hidden transition-all duration-500 group ${
               isAsr 
                 ? "hover:bg-[#022902]/60 hover:backdrop-blur-xl hover:scale-[1.05] hover:border-[#2FB68E]/40 hover:shadow-2xl hover:shadow-[#022902]/40" 
                 : "hover:border-emerald-400/20 hover:scale-[1.02]"
            }`}
          >
            <div className="absolute right-0 top-0 p-10 opacity-[0.03] group-hover:opacity-[0.06] transition-all duration-700 pointer-events-none">
               <ListTree className={`w-48 h-48 ${isAsr ? "text-white" : ""}`} />
            </div>
            
            <div className="space-y-4 relative">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${
                isAsr ? "bg-[#FFD700]/10 border-[#FFD700]/20" : "bg-emerald-400/10 border-emerald-400/20"
              }`}>
                 <ListTree className={`w-7 h-7 ${isAsr ? "text-[#FFD700]" : "text-emerald-400"}`} />
              </div>
              <div>
                <h2 className="text-2xl font-serif italic text-white/95">Predefined Sets</h2>
                <p className="text-[11px] text-white/60 font-medium tracking-tight">Focus on Sunnah dhikr like Tasbih Fatimah & more.</p>
              </div>
            </div>

            <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors ${
              isAsr ? "text-[#FFD700]/80 group-hover:text-[#FFD700]" : "text-emerald-400/60 group-hover:text-emerald-400"
            }`}>
              Continue <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>
        </Link>
      </div>
    </div>
  );
};
