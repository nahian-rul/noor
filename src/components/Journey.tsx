import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useUser } from "../contexts/UserContext";
import { useTasbih } from "../contexts/TasbihContext";
import { useSalah } from "../contexts/SalahContext";
import { 
  Award, Zap, Book, Heart, Star, Calendar, Download, Upload, 
  RotateCcw, Sparkles, LayoutGrid, CheckCircle2, MoonStar, Brain, History
} from "lucide-react";

type BadgeCategory = "gamification" | "tasbih" | "salah";

export const Journey: React.FC = () => {
  const { points, streak: studyStreak, completedSurahs, completedDuas, completedNames, getJourneyStage, quizHistory = [] } = useUser();
  const { tasbihBadges, totalTasbihCount } = useTasbih();
  const { salahBadges, streak: prayerStreak, fullDaysCount } = useSalah();
  
  const stage = getJourneyStage();
  const [badgeMode, setBadgeMode] = useState<BadgeCategory>("gamification");

  // Switch milestones every 5 seconds (rotating through 3 categories)
  useEffect(() => {
    const modes: BadgeCategory[] = ["gamification", "tasbih", "salah"];
    const interval = setInterval(() => {
      setBadgeMode(prev => {
        const idx = modes.indexOf(prev);
        return modes[(idx + 1) % modes.length];
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Stats for the hero section
  const statItems = [
    { label: "Total Points", value: points, icon: Zap, color: "text-amber-400", bg: "bg-amber-400/10" },
    { label: "Study Streak", value: `${studyStreak} Days`, icon: Calendar, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "Salah Streak", value: `${prayerStreak} Days`, icon: MoonStar, color: "text-indigo-400", bg: "bg-indigo-400/10" },
    { label: "Dhikr Count", value: totalTasbihCount, icon: RotateCcw, color: "text-sky-400", bg: "bg-sky-400/10" },
    { label: "Duas Read", value: completedDuas.length, icon: Heart, color: "text-pink-400", bg: "bg-pink-400/10" },
    { label: "Surahs Read", value: completedSurahs.length, icon: Book, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  ];

  // Category Configuration
  const categoryMeta: Record<BadgeCategory, { label: string; sub: string; dot: string }> = {
    gamification: { label: "Learning Milestones", sub: "Knowledge & Wisdom", dot: "bg-amber-400" },
    tasbih: { label: "Dhikr Milestones", sub: "Spiritual Remembrance", dot: "bg-sky-400" },
    salah: { label: "Salah Milestones", sub: "Prayer & Consistency", dot: "bg-indigo-400" },
  };

  return (
    <div className="space-y-12 pb-32 max-w-5xl mx-auto px-4">
      <header className="space-y-2">
        <h1 className="text-5xl font-serif italic tracking-tight bg-gradient-to-br from-white to-white/40 bg-clip-text text-transparent">Your Journey</h1>
        <p className="text-white/30 text-[11px] font-black uppercase tracking-[0.3em] leading-relaxed max-w-2xl">
          "The most beloved actions to Allah are those which are continuous, even if they are small."
        </p>
      </header>

      {/* Hero Stats */}
      <section className="glass-card p-8 md:p-12 relative overflow-hidden border-white/5">
        <div className="absolute right-0 top-0 p-10 opacity-[0.02] pointer-events-none select-none rotate-12 scale-150">
           <Award className="w-64 h-64" />
        </div>
        
        <div className="relative flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="flex flex-col items-center text-center space-y-6 shrink-0">
            <div className="w-40 h-40 rounded-full glass-card flex items-center justify-center border-amber-400/20 shadow-[0_0_50px_rgba(251,191,36,0.1)] relative group">
               <div className="p-8 bg-amber-400/10 rounded-full group-hover:bg-amber-400/20 transition-all duration-700">
                  <Award className="w-20 h-20 text-amber-400" />
               </div>
               <div className="absolute inset-0 rounded-full border-2 border-dashed border-amber-400/10 animate-spin-slow" />
            </div>
            <div className="space-y-1">
               <h2 className="text-3xl font-serif italic text-white/95">{stage}</h2>
               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Spiritual Level</p>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 w-full">
            {statItems.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="p-6 glass-card border-white/5 space-y-4 hover:border-white/10 transition-all group"
              >
                <div className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                   <item.icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <div>
                   <p className="text-3xl font-mono font-black text-white/95 tracking-tighter">{item.value}</p>
                   <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">{item.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 🔄 Alternating Badges Section */}
      <section className="space-y-8 glass-card p-10 border-white/5 relative overflow-hidden min-h-[450px]">
        <div className="flex items-center justify-between relative z-10 px-2">
           <div className="space-y-2">
              <h3 className="text-sm font-black uppercase tracking-[0.4em] text-white/20">Milestone Progression</h3>
              <div className="flex items-center gap-3">
                 <h4 className="text-2xl font-serif italic text-white/90">{categoryMeta[badgeMode].label}</h4>
                 <div className="h-1 w-1 rounded-full bg-white/20" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-white/30 italic">{categoryMeta[badgeMode].sub}</span>
              </div>
           </div>
           <div className="flex gap-2.5">
              {(["gamification", "tasbih", "salah"] as const).map(m => (
                <div key={m} className={`h-1.5 w-1.5 rounded-full transition-all duration-700 ${badgeMode === m ? `${categoryMeta[m].dot} scale-150` : "bg-white/10"}`} />
              ))}
           </div>
        </div>

        {/* Dynamic Streak Message for Salah */}
        <AnimatePresence mode="wait">
          {badgeMode === "salah" && prayerStreak > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="mt-4 px-6 py-3 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl inline-flex items-center gap-3"
            >
               <Sparkles className="w-4 h-4 text-indigo-400" />
               <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400/80 italic">
                 You are on a {prayerStreak}-day الصلاة journey — MashaAllah
               </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative mt-8">
          <AnimatePresence mode="wait">
            <motion.div 
              key={badgeMode} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
            >
              {/* GAMIFICATION */}
              {badgeMode === "gamification" && [
                { title: "Seeker", val: completedSurahs.length, tar: 5, ic: Book, co: "text-emerald-400" },
                { title: "Supplicant", val: completedDuas.length, tar: 10, ic: Heart, co: "text-pink-400" },
                { title: "Devout", val: points, tar: 1000, ic: Zap, co: "text-amber-400" },
              ].map(badge => (
                <div key={badge.title} className={`p-8 rounded-[2rem] border transition-all duration-1000 flex flex-col items-center justify-center text-center gap-4 ${badge.val >= badge.tar ? "bg-white/[0.03] border-white/10" : "bg-transparent border-white/5 opacity-30 grayscale"}`}>
                  <badge.ic className={`w-8 h-8 ${badge.val >= badge.tar ? badge.co : "text-white/20"}`} />
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/80">{badge.title}</p>
                </div>
              ))}

              {/* TASBIH */}
              {badgeMode === "tasbih" && tasbihBadges.map(badge => (
                <div key={badge.id} className={`p-8 rounded-[2rem] border transition-all duration-1000 flex flex-col items-center justify-center text-center gap-4 ${badge.unlocked ? "bg-sky-500/5 border-sky-500/10 shadow-lg" : "bg-transparent border-white/5 opacity-30 grayscale"}`}>
                  <RotateCcw className={`w-8 h-8 ${badge.unlocked ? "text-sky-400" : "text-white/20"}`} />
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/80">{badge.title}</p>
                </div>
              ))}

              {/* SALAH (EXTENDED) */}
              {badgeMode === "salah" && salahBadges.map(badge => (
                <div key={badge.id} className={`p-8 rounded-[2rem] border transition-all duration-1000 flex flex-col items-center justify-center text-center gap-4 group ${badge.unlocked ? "bg-indigo-500/5 border-indigo-500/10 shadow-lg" : "bg-transparent border-white/5 opacity-20 grayscale"}`}>
                  <MoonStar className={`w-8 h-8 ${badge.unlocked ? "text-indigo-400" : "text-white/20"} transition-transform duration-700 group-hover:rotate-[360deg]`} />
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/80">{badge.title}</p>
                    {badge.subtitle && (
                      <p className="text-[8px] font-bold text-white/20 uppercase tracking-tighter">{badge.subtitle}</p>
                    )}
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
      {/* 📊 3. Quiz History Section */}
      <section className="space-y-8 glass-card p-10 border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none select-none -translate-y-8"><Brain className="w-64 h-64" /></div>
        
        <div className="flex items-center justify-between relative z-10 px-2">
           <div className="space-y-2">
              <h3 className="text-sm font-black uppercase tracking-[0.4em] text-white/20">Wisdom Assessment</h3>
              <h4 className="text-2xl font-serif italic text-white/90">Quiz Repository</h4>
           </div>
           <div className="flex items-center gap-3 px-6 py-3 bg-white/5 rounded-2xl border border-white/10">
              <History className="w-4 h-4 text-white/40" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/60">{quizHistory.length} Sessions</span>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
           {quizHistory.length === 0 ? (
             <div className="md:col-span-2 p-16 text-center space-y-4 bg-white/[0.01] rounded-[2.5rem] border border-dashed border-white/10">
                <Brain className="w-12 h-12 text-white/10 mx-auto" />
                <p className="text-xs text-white/20 font-medium italic uppercase tracking-widest">No quiz assessments completed yet.</p>
             </div>
           ) : (
             quizHistory.slice(0, 6).map((item) => (
                <div key={item.id} className="p-6 glass-card border-white/5 hover:border-white/10 group transition-all flex items-center justify-between">
                   <div className="flex items-center gap-5">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        item.difficulty === 'advanced' ? "bg-rose-400/10 text-rose-400" : 
                        item.difficulty === 'intermediate' ? "bg-amber-400/10 text-amber-400" : "bg-emerald-400/10 text-emerald-400"
                      }`}>
                         <Award className="w-6 h-6" />
                      </div>
                      <div>
                         <p className="text-[11px] font-black uppercase tracking-widest text-white/80">{item.difficulty} Session</p>
                         <p className="text-[10px] text-white/20 mt-0.5">{new Date(item.date).toLocaleDateString()} • {item.score}/{item.total} Score</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-sm font-mono font-black text-white">+{item.pointsEarned} XP</p>
                   </div>
                </div>
             ))
           )}
        </div>
      </section>

      {/* Persistence Export/Import */}
      <section className="glass-card p-12 border-white/5 space-y-10 bg-white/[0.01] relative overflow-hidden">
         <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none select-none -rotate-12 translate-x-12 -translate-y-12"><LayoutGrid className="w-64 h-64" /></div>
         <div className="space-y-4 relative z-10">
            <h3 className="text-3xl font-serif italic text-white/90">Consistency Vault</h3>
            <p className="text-[11px] text-white/20 max-w-2xl leading-relaxed font-bold uppercase tracking-[0.2em] italic">
               "Small consistent عبادات are beloved. May Allah keep you steadfast on your الصلاة journey."
            </p>
         </div>
         <div className="flex flex-wrap gap-6 relative z-10">
            <button className="flex items-center gap-4 px-10 py-5 glass-button rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all group scale-100 hover:scale-105 active:scale-95 shadow-xl">
               <Download className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
               Download Journey
            </button>
            <button className="flex items-center gap-4 px-10 py-5 glass-button rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border-emerald-500/20 text-emerald-400 hover:bg-emerald-400 hover:text-black transition-all group scale-100 hover:scale-105 active:scale-95 shadow-xl">
               <Upload className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
               Restore Journey
            </button>
         </div>
      </section>
    </div>
  );
};
