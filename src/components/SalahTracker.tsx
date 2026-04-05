import React, { useState, useMemo } from "react";
import { useSalah, PrayerId } from "../contexts/SalahContext";
import { toHijri, HIJRI_MONTHS } from "../lib/hijri";
import { 
  format, 
  addDays, 
  subDays, 
  isSameDay, 
  startOfToday, 
  eachDayOfInterval, 
  isToday,
  isAfter
} from "date-fns";
import { motion, AnimatePresence } from "motion/react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Sunrise, 
  Sun, 
  CloudSun, 
  Sunset, 
  MoonStar, 
  CheckCircle2, 
  Circle, 
  Flame,
  Award,
  Cloud,
  Moon,
  Star
} from "lucide-react";

import { useWaqt } from "../WaqtContext";

// ── Waqt Illustrative Animations ──────────────────────────────────────

const WaqtIllustration: React.FC<{ id: PrayerId; active: boolean }> = ({ id, active }) => {
  const { waqt } = useWaqt();
  const isAsrNow = waqt === "Asr";

  switch (id) {
    case "fajr":
      return (
        <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
          <motion.div animate={{ x: [-20, 20] }} transition={{ repeat: Infinity, duration: 10, ease: "linear" }} className="absolute -left-4 top-4 text-white/40"><Cloud className="w-8 h-8" /></motion.div>
          {!active && <div className="absolute right-4 top-4 text-white/20"><Moon className="w-5 h-5" /></div>}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-sky-500/20 to-transparent" />
        </div>
      );
    case "dhuhr":
      return (
        <div className="absolute inset-0 overflow-hidden opacity-40 pointer-events-none">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 30, ease: "linear" }} className="absolute -right-6 -top-6 text-amber-300/30 scale-150"><Sun className="w-20 h-20" /></motion.div>
          <motion.div animate={{ x: [40, -40] }} transition={{ repeat: Infinity, duration: 15, ease: "linear" }} className="absolute -right-8 top-12 text-sky-200/20"><Cloud className="w-12 h-12" /></motion.div>
          <div className="absolute inset-0 bg-gradient-to-br from-sky-400/20 via-transparent to-transparent" />
        </div>
      );
    case "asr":
      return (
        <div className="absolute inset-0 overflow-hidden opacity-40 pointer-events-none">
          <div className={`absolute right-4 top-4 ${isAsrNow ? "text-[#FFD700]/30" : "text-orange-400/20"}`}><CloudSun className={`w-12 h-12`} /></div>
          <motion.div animate={{ x: [-10, 10] }} transition={{ repeat: Infinity, duration: 8 }} className={`absolute left-4 top-10 ${isAsrNow ? "text-[#FFD700]/10" : "text-orange-200/10"}`}><Cloud className="w-10 h-10" /></motion.div>
          <div className={`absolute inset-0 bg-gradient-to-b ${isAsrNow ? "from-[#2FB68E]/30" : "from-orange-500/20"} to-transparent`} />
        </div>
      );
    case "maghrib":
      return (
        <div className="absolute inset-0 overflow-hidden opacity-50 pointer-events-none">
          <motion.div animate={{ y: [2, -2] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute -bottom-6 left-1/2 -translateX-1/2 text-rose-500/30 scale-[2.5]"><Sunset className="w-24 h-24" /></motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-rose-600/40 via-transparent to-transparent" />
        </div>
      );
    case "isha":
      return (
        <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 2 + Math.random() * 2, delay: Math.random() * 2 }}
              className="absolute text-white/40" style={{ top: `${15 + Math.random() * 60}%`, left: `${10 + Math.random() * 80}%` }}>
              <Star className="w-1 h-1 fill-current" />
            </motion.div>
          ))}
          <motion.div initial={{ x: -100, y: -20, opacity: 0 }} animate={{ x: 200, y: 100, opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 3, repeatDelay: 7 }}
            className="absolute top-0 left-0 h-[1px] w-12 bg-white/40 rotate-45" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-indigo-950/60 to-transparent" />
        </div>
      );
    default: return null;
  }
};

// ── Main Context-Based Meta ──────────────────────────────────────────

interface PrayerMeta {
  id: PrayerId;
  name: string;
  nameAr: string;
  icon: any;
  color: string;
  gradient: string; // The full background gradient when active
  accent: string;   // Secondary accent color
}

const PRAYERS: PrayerMeta[] = [
  { 
    id: "fajr", name: "Fajr", nameAr: "الفجر", icon: Sunrise, color: "text-sky-300", 
    gradient: "from-sky-900/60 via-sky-800/40 to-sky-950/80", accent: "sky-400" 
  },
  { 
    id: "dhuhr", name: "Dhuhr", nameAr: "الظهر", icon: Sun, color: "text-sky-100", 
    gradient: "from-sky-500/40 via-sky-400/20 to-sky-600/40", accent: "sky-200" 
  },
  { 
    id: "asr", name: "Asr", nameAr: "العصر", icon: CloudSun, color: "text-[#FFD700]", 
    gradient: "from-[#2FB68E]/60 via-[#2FB68E]/40 to-[#2FB68E]/80", accent: "[#FFD700]" 
  },
  { 
    id: "maghrib", name: "Maghrib", nameAr: "المغرب", icon: Sunset, color: "text-rose-300", 
    gradient: "from-rose-700/60 via-orange-600/40 to-rose-900/80", accent: "rose-500" 
  },
  { 
    id: "isha", name: "Isha", nameAr: "العشاء", icon: MoonStar, color: "text-indigo-300", 
    gradient: "from-indigo-950/80 via-indigo-900/60 to-slate-950/90", accent: "indigo-400" 
  },
];

export const SalahTracker: React.FC = () => {
  const { waqt, prayerTimes } = useWaqt();
  const { togglePrayer, getSalahForDate, streak, completionRate } = useSalah();
  const [selectedDate, setSelectedDate] = useState(startOfToday());

  const hijri = useMemo(() => toHijri(selectedDate), [selectedDate]);
  const currentDaySalah = useMemo(() => getSalahForDate(selectedDate), [selectedDate, togglePrayer]);
  const completedCount = Object.values(currentDaySalah).filter(v => v).length;
  const progressPercent = (completedCount / 5) * 100;

  const stripDays = useMemo(() => {
    return eachDayOfInterval({ start: subDays(selectedDate, 2), end: addDays(selectedDate, 2) });
  }, [selectedDate]);

  return (
    <div className="space-y-12 pb-40 max-w-7xl mx-auto px-4 md:px-0">
      {/* Header */}
      <header className="space-y-10">
        {/* ... (lines 136-170 unchanged) ... */}
        <div className="flex items-center justify-between gap-4">
          <button onClick={() => setSelectedDate(subDays(selectedDate, 1))} className={`p-3.5 glass-button rounded-xl border-white/5 active:scale-90 transition-all ${waqt === "Asr" ? "hover:border-[#FFD700]/20" : ""}`}>
            <ChevronLeft className="w-5 h-5 text-white/40" />
          </button>
          <div className="text-center space-y-2 flex-1">
             <div className={`inline-flex items-center gap-2.5 px-3.5 py-1.5 glass-card bg-white/5 border-white/10 rounded-full mb-1 ${waqt === "Asr" ? "border-[#FFD700]/10" : ""}`}>
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${waqt === "Asr" ? "text-white/60" : "text-white/40"}`}>{hijri.day} {HIJRI_MONTHS[hijri.month - 1]} {hijri.year} AH</span>
             </div>
             <div>
               <h1 className="text-3xl font-serif italic tracking-tight text-white/95">{isToday(selectedDate) ? "Today" : format(selectedDate, "EEEE")}</h1>
               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">{format(selectedDate, "MMMM do, yyyy")}</p>
             </div>
          </div>
          <button onClick={() => setSelectedDate(addDays(selectedDate, 1))} className={`p-3.5 glass-button rounded-xl border-white/5 active:scale-90 transition-all ${waqt === "Asr" ? "hover:border-[#FFD700]/20" : ""}`}>
            <ChevronRight className="w-5 h-5 text-white/40" />
          </button>
        </div>

        <div className="flex justify-center items-center gap-2 md:gap-4 lg:gap-6">
          {stripDays.map((day, idx) => {
            const isSelected = isSameDay(day, selectedDate);
            const hj = toHijri(day);
            return (
              <button key={idx} onClick={() => setSelectedDate(day)}
                className={`flex-shrink-0 w-12 h-16 md:w-16 md:h-20 rounded-[1.5rem] flex flex-col items-center justify-center gap-1 transition-all duration-500 border-2 ${
                  isSelected 
                    ? (waqt === "Asr" ? "bg-[#FFD700] text-black border-[#FFD700] shadow-xl shadow-[#FFD700]/20" : "bg-white text-black border-white shadow-xl shadow-white/20") 
                    : isToday(day) ? "bg-white/10 border-white/20 text-white" : "bg-white/5 border-transparent text-white/20 hover:bg-white/10"
                }`}>
                <span className="text-[7px] font-black uppercase tracking-widest">{format(day, "EEE")}</span>
                <span className="text-base md:text-xl font-bold">{hj.day}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Prayer Toggles - Full Card Color Gradients */}
      <section className="grid grid-cols-5 gap-2 md:gap-6 w-full">
        {PRAYERS.map((prayer) => {
          const isDone = currentDaySalah[prayer.id];
          const Icon = prayer.icon;

          const isFuture = () => {
            if (isAfter(selectedDate, startOfToday())) return true;
            if (!isSameDay(selectedDate, startOfToday())) return false;
            
            // Today: check if prayer time has started yet
            if (!prayerTimes) return false;
            const pTime = (prayerTimes as any)[prayer.id];
            if (!pTime) return false;
            return pTime.getTime() > Date.now();
          };

          const upcoming = isFuture();

          return (
            <button 
              key={prayer.id} 
              disabled={upcoming}
              onClick={() => togglePrayer(selectedDate, prayer.id)}
              className={`p-3 md:p-8 glass-card border-white/5 flex flex-col items-center gap-4 md:gap-8 group transition-all duration-500 relative overflow-hidden h-[190px] md:h-[380px] ${
                upcoming ? "opacity-40 grayscale-[0.8] cursor-not-allowed" : ""
              } ${
                isDone 
                  ? `bg-gradient-to-b ${prayer.gradient} border-white/20 shadow-2xl` 
                  : `bg-white/[0.03] ${waqt === "Asr" ? "hover:bg-[#022902]/60 hover:backdrop-blur-xl hover:scale-[1.05] hover:border-[#2FB68E]/40 hover:shadow-2xl hover:shadow-[#022902]/40" : "hover:bg-white/[0.08]"}`
              }`}>
              
              <WaqtIllustration id={prayer.id} active={isDone} />

              <div className={`p-2.5 md:p-6 rounded-[1rem] md:rounded-[2.5rem] transition-all duration-1000 transform relative z-10 ${
                isDone 
                  ? (waqt === "Asr" && prayer.id === "asr" ? "bg-[#FFD700] text-black" : "bg-white text-black") + " rotate-[360deg] shadow-2xl scale-110" 
                  : `bg-white/5 ${prayer.color} group-hover:scale-105 group-hover:bg-white/10`
              }`}>
                <Icon className={`w-4 h-4 md:w-8 md:h-8 ${isDone ? 'text-current' : 'text-current opacity-80'}`} />
              </div>

              <div className="text-center space-y-1.5 md:space-y-4 relative z-10">
                <h3 className={`text-[12px] md:text-2xl font-serif italic transition-all duration-700 ${isDone ? "text-white scale-105 font-bold" : "text-white/80"}`}>{prayer.name}</h3>
                <p className={`hidden md:block text-[9px] font-black uppercase tracking-[0.3em] transition-opacity ${isDone ? "opacity-60" : "opacity-20"}`}>{prayer.nameAr}</p>
              </div>

              <div className={`w-6 h-6 md:w-14 md:h-14 rounded-full flex items-center justify-center border transition-all duration-1000 relative z-10 ${
                isDone 
                  ? (waqt === "Asr" && prayer.id === "asr" ? "bg-[#FFD700] border-[#FFD700] text-black" : "bg-white border-white text-black") + " shadow-inner" 
                  : "border-white/10 text-white/5 group-hover:border-white/30"
              }`}>
                {isDone ? <CheckCircle2 className="w-3 h-3 md:w-7 md:h-7" /> : <Circle className="w-3 h-3 md:w-7 md:h-7" />}
              </div>
            </button>
          );
        })}
      </section>

      {/* Progress & Streaks */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
         <div className="p-10 glass-card border-white/5 space-y-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.06] transition-all duration-700 pointer-events-none scale-150 rotate-12"><Flame className="w-48 h-48" /></div>
            <div className="flex items-center gap-4">
               <div className={`p-3 rounded-2xl border ${waqt === "Asr" ? "bg-[#FFD700]/10 border-[#FFD700]/20" : "bg-rose-500/10 border-rose-500/20"}`}>
                 <Flame className={`w-5 h-5 ${waqt === "Asr" ? "text-[#FFD700]" : "text-rose-500"}`} />
               </div>
               <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Consecutive Tracking</span>
            </div>
            <div className="space-y-2"><h2 className="text-6xl md:text-7xl font-mono font-black text-white/95">{streak}</h2>
            <p className="text-[12px] font-medium text-white/40 leading-relaxed italic max-w-xs">{streak > 0 ? `Successfully tracked all 5 Salah for ${streak} days in a row.` : "Track all prayers today to build your streak!"}</p></div>
         </div>
         <div className="p-10 glass-card border-white/5 flex flex-col justify-between group overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.06] transition-all duration-700 pointer-events-none scale-125 -rotate-12"><Award className="w-48 h-48" /></div>
            <div className="space-y-8 relative z-10 w-full mb-8">
               <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl border ${waqt === "Asr" ? "bg-[#FFD700]/10 border-[#FFD700]/20" : "bg-emerald-500/10 border-emerald-500/20"}`}>
                    <Award className={`w-5 h-5 ${waqt === "Asr" ? "text-[#FFD700]" : "text-emerald-500"}`} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Weekly Fidelity</span>
               </div>
               <div className="space-y-1"><h2 className="text-6xl font-mono font-black text-white/95">{completionRate}%</h2>
               <p className={`text-[11px] uppercase tracking-widest ${waqt === "Asr" ? "text-[#FFD700]/70" : "text-emerald-400/50"}`}>Efficiency Last 7 Days</p></div>
            </div>
            <div className="w-full h-16 flex items-end gap-2 relative z-10">{[40, 70, 45, 90, 65, 80, 100].map((v, i) => (<div key={i} className={`flex-1 rounded-t-sm ${waqt === "Asr" ? "bg-[#FFD700]/20" : "bg-white/5"}`} style={{ height: `${v}%` }} />))}</div>
         </div>
      </section>

      {/* Floating Circular Progress */}
      <div className="fixed bottom-32 right-8 z-[100] md:bottom-12 md:right-12 pointer-events-none">
         <div className="relative group pointer-events-auto">
            <svg className="w-24 h-24 -rotate-90 filter drop-shadow-2xl">
               <circle cx="48" cy="48" r="42" className="fill-none stroke-white/5 stroke-[8px]" />
               <motion.circle cx="48" cy="48" r="42" className="fill-none stroke-white/80 stroke-[8px] rounded-full" strokeDasharray="263.8"
                 animate={{ strokeDashoffset: 263.8 - (263.8 * progressPercent) / 100 }} transition={{ duration: 1.5, type: "spring" }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center"><span className="text-2xl font-black text-white/90 leading-none">{completedCount}</span><span className="text-[8px] font-black uppercase tracking-widest text-white/30">of 5</span></div>
         </div>
      </div>
    </div>
  );
};
