import React from "react";
import { motion } from "motion/react";
import { X, Target, Book, Heart, Star, CheckCircle2, Circle } from "lucide-react";
import { Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { useWaqt } from "../WaqtContext";

export const GoalsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { streak, completedSurahs, completedDuas, completedNames } = useUser();
  const { waqt } = useWaqt();
  const isAsr = waqt === "Asr";
  const goalSurah = completedSurahs.length > 0;
  const goalDua = completedDuas.length > 0;
  const goalName = completedNames.length > 0;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-2xl" />
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className={`relative w-full max-w-sm glass-modal rounded-[3rem] p-10 overflow-hidden shadow-2xl transition-colors ${isAsr ? "border-[#2FB68E]/20" : "border-white/5"}`}
      >
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12 scale-150 pointer-events-none">
          <Target className={`w-64 h-64 ${isAsr ? "text-[#2FB68E]" : "text-amber-400"}`} />
        </div>

        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <h3 className="text-3xl font-serif italic text-white/90">Today's Goals</h3>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Your Daily Path</p>
          </div>
          <button onClick={onClose} className={`p-2.5 rounded-full transition-all ${isAsr ? "bg-[#2FB68E]/10 hover:bg-[#2FB68E]/20" : "bg-white/5 hover:bg-white/10"}`}>
            <X className={`w-5 h-5 ${isAsr ? "text-[#FFD700]" : "text-white/40"}`} />
          </button>
        </div>

        <div className="space-y-4">
          {[
            { label: "Read 1 Surah", done: goalSurah, icon: Book, path: "/quran" },
            { label: "Learn 1 Dua", done: goalDua, icon: Heart, path: "/duas" },
            { label: "Reflect on 1 Name", done: goalName, icon: Star, path: "/names" },
          ].map((goal, i) => (
            <Link 
              key={i} to={goal.path} onClick={onClose}
              className={`flex items-center justify-between p-5 rounded-2xl border transition-all duration-500 active:scale-95 ${
                goal.done 
                  ? (isAsr ? "bg-[#2FB68E]/10 border-[#2FB68E]/30" : "bg-emerald-400/10 border-emerald-400/20") 
                  : `bg-white/5 border-white/5 ${isAsr ? "hover:bg-[#022902]/60 hover:backdrop-blur-xl hover:scale-[1.05] hover:border-[#2FB68E]/40 hover:shadow-2xl hover:shadow-[#022902]/40" : "hover:border-white/10 hover:scale-[1.02]"}`
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-xl ${goal.done ? (isAsr ? "bg-[#2FB68E]/20" : "bg-emerald-400/20") : "bg-white/5"}`}>
                  <goal.icon className={`w-5 h-5 ${goal.done ? (isAsr ? "text-[#FFD700]" : "text-emerald-400") : "text-white/30"}`} />
                </div>
                <span className={`text-[11px] font-bold uppercase tracking-[0.1em] ${goal.done ? (isAsr ? "text-[#FFD700]" : "text-emerald-400") : "text-white/60"}`}>
                  {goal.label}
                </span>
              </div>
              {goal.done 
                ? <CheckCircle2 className={`w-5 h-5 ${isAsr ? "text-[#FFD700]" : "text-emerald-400"}`} /> 
                : <Circle className="w-5 h-5 text-white/10" />}
            </Link>
          ))}
        </div>

        <div className={`mt-10 pt-6 border-t flex items-center justify-between ${isAsr ? "border-[#2FB68E]/10" : "border-white/5"}`}>
           <div className="text-left">
              <p className={`text-[9px] font-black uppercase tracking-widest ${isAsr ? "text-[#FFD700]" : "text-amber-400"}`}>{streak}-Day Streak</p>
              <p className="text-[8px] text-white/20 font-medium tracking-tight uppercase italic transition-all">Maintaining Consistency</p>
           </div>
           <Target className={`w-8 h-8 ${isAsr ? "text-[#2FB68E]/20" : "text-white/10"}`} />
        </div>
      </motion.div>
    </div>
  );
};
