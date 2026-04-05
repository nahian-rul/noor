import React, { useState, useEffect } from "react";
import { useWaqt } from "../WaqtContext";
import quotesData from "../data/quotes";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronRight, Heart, Book, Calculator,
  Star, X, ChevronLeft, ArrowRight, Hand, Quote,
  CheckCircle2, Circle, Brain, Volume2, VolumeX, Play, Square, Music, Settings,
  GraduationCap, History
} from "lucide-react";
import { format, startOfToday } from "date-fns";
import { Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { useSalah, PrayerId } from "../contexts/SalahContext";
import { useAdhan } from "../contexts/AdhanContext";
import { AdhanSettingsModal } from "./AdhanSettingsModal";

const allQuotes = quotesData as any[];

// ── Waqt visual config ───────────────────────────────────────────────
const WAQT_CONFIG: Record<string, {
  emoji: string; sub: string;
  gradient: string; accent: string;
}> = {
  Fajr:    { emoji: "🌙", sub: "Dawn — Time of Renewal",           gradient: "from-[#1d1630] to-[#2B4162]", accent: "#d0886a" },
  Sunrise: { emoji: "🌅", sub: "Sunrise — Barakah of Morning",      gradient: "from-[#A66D58] to-[#8C523D]", accent: "#fde68a" },
  Dhuhr:   { emoji: "☀️",  sub: "Midday — Abundant Light",          gradient: "from-[#4A7C59] to-[#3E6649]", accent: "#bae6fd" },
  Asr:     { emoji: "🌤️", sub: "Afternoon — Reflect & Gratitude",  gradient: "from-[#2FB68E] to-[#1E7D61]", accent: "#FFD700" },
  Maghrib: { emoji: "🌇", sub: "Sunset — Gratitude for the Day",   gradient: "from-[#6E5A7A] to-[#4F3F57]", accent: "#ddd6fe" },
  Isha:    { emoji: "🌃", sub: "Night — Peace & Rest",             gradient: "from-[#2A3B4C] to-[#1D2938]", accent: "#93c5fd" },
  Night:   { emoji: "🌃", sub: "Night — Peace & Rest",             gradient: "from-[#2A3B4C] to-[#1D2938]", accent: "#93c5fd" },
};

const CARD_ANIMS: any[] = [
  { initial: { rotateY: -90, opacity: 0 },    animate: { rotateY: 0, opacity: 1 },    transition: { type: "spring", damping: 16 } },
  { initial: { scale: 0, rotate: -180 },       animate: { scale: 1, rotate: 0 },       transition: { type: "spring", stiffness: 200, damping: 18 } },
  { initial: { y: -80, opacity: 0 },           animate: { y: 0, opacity: 1 },          transition: { type: "spring", stiffness: 280, damping: 20 } },
  { initial: { x: -100, opacity: 0 },          animate: { x: 0, opacity: 1 },          transition: { type: "spring", stiffness: 240, damping: 22 } },
  { initial: { scale: 1.6, opacity: 0 },       animate: { scale: 1, opacity: 1 },      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
];

const PRAYER_NAMES = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;

const MOODS = [
  { key: "sad",       label: "Sad",       icon: "😔", color: "bg-blue-400/10 border-blue-400/20 text-blue-300",      desc: "Find comfort",     categoryId: 3 },
  { key: "lost",      label: "Lost",      icon: "🧭", color: "bg-purple-400/10 border-purple-400/20 text-purple-300", desc: "Seek guidance",    categoryId: 6 },
  { key: "motivated", label: "Motivated", icon: "🔥", color: "bg-orange-400/10 border-orange-400/20 text-orange-300", desc: "Stay driven",      categoryId: 1 },
  { key: "grateful",  label: "Grateful",  icon: "🤲", color: "bg-emerald-400/10 border-emerald-400/20 text-emerald-300", desc: "Count blessings", categoryId: 2 },
];

// ── Full Schedule Modal ──────────────────────────────────────────────
const ScheduleModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { prayerTimes, nextPrayer, waqt } = useWaqt();
  const formatTime = (d: Date | null | undefined) => d ? format(d as Date, "h:mm a") : "--:--";
  const prayers = prayerTimes
    ? [
        { name: "Fajr",    time: prayerTimes.fajr },
        { name: "Dhuhr",   time: prayerTimes.dhuhr },
        { name: "Asr",     time: prayerTimes.asr },
        { name: "Maghrib", time: prayerTimes.maghrib },
        { name: "Isha",    time: prayerTimes.isha },
      ]
    : PRAYER_NAMES.map(name => ({ name, time: null as Date | null }));

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className="absolute inset-0 bg-black/75 backdrop-blur-md" />
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-2xl glass-modal rounded-[2.5rem] p-8 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-serif italic text-white/90">Prayer Schedule</h2>
            <p className="text-[9px] font-bold uppercase tracking-widest text-white/30 mt-1">
              {format(new Date(), "EEEE, d MMMM yyyy")}
            </p>
          </div>
          <button onClick={onClose} className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
            <X className="w-4 h-4 text-white/40" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          {prayers.map((p, i) => {
            const cfg = WAQT_CONFIG[p.name] ?? WAQT_CONFIG.Fajr;
            const anim = CARD_ANIMS[i % CARD_ANIMS.length];
            const isNext = p.name === nextPrayer?.name;
            return (
              <motion.div key={p.name} {...anim}
                className={`relative flex flex-col items-center gap-3 p-5 rounded-3xl border overflow-hidden ${
                  isNext 
                    ? (waqt === "Asr" ? "border-[#FFD700]/40 bg-[#FFD700]/5 shadow-[0_0_20px_rgba(255,215,0,0.1)]" : "border-amber-400/40 bg-amber-400/5") 
                    : "border-white/10 bg-white/5"
                }`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${cfg.gradient} opacity-25 pointer-events-none`} />
                <span className="text-4xl relative z-10">{cfg.emoji}</span>
                <div className="relative z-10 text-center">
                  <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${
                    isNext ? (waqt === "Asr" ? "text-[#FFD700]" : "text-amber-400") : "text-white/60"
                  }`}>{p.name}</p>
                  <p className="text-sm font-mono font-bold text-white/90 mt-1">{formatTime(p.time)}</p>
                </div>
                {isNext && <div className={`relative z-10 w-1.5 h-1.5 rounded-full animate-pulse ${waqt === "Asr" ? "bg-[#FFD700]" : "bg-amber-400"}`} />}
                <p className="text-[8px] text-white/25 font-medium text-center relative z-10 hidden sm:block">{cfg.sub.split("—")[1]?.trim()}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

import { GoalsModal } from "./GoalsModal";

// ── Dynamic Waqt Card ────────────────────────────────────────────────
const WaqtCard: React.FC<{
  cfg: typeof WAQT_CONFIG.Fajr;
  waqt: string;
  nextPrayer: any;
  prayerTimes: any;
  forceForbidden?: boolean;
  setShowSchedule: (v: boolean) => void;
  setShowAdhanSettings: (v: boolean) => void;
}> = ({ cfg, waqt, nextPrayer, prayerTimes, forceForbidden, setShowSchedule, setShowAdhanSettings }) => {
  const [flip, setFlip] = useState(false);
  const [inFlipZone, setInFlipZone] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!nextPrayer?.time) return;
      const diff = nextPrayer.time.getTime() - Date.now();
      const minsLeft = diff / (1000 * 60);
      
      const inZone = minsLeft > 0 && minsLeft <= 5;
      setInFlipZone(inZone);
      
      if (inZone) {
        setFlip(f => !f);
      } else {
        setFlip(false);
      }
    }, 15000); // 15 seconds
    return () => clearInterval(timer);
  }, [nextPrayer]);

  const showNext = inFlipZone && flip;
  const { isPlaying, isMuted, setIsMuted, playManualAdhan, stopAdhan } = useAdhan();

  const getWaqtBounds = () => {
    if (!prayerTimes) return { start: null, end: null };
    const w = waqt.toLowerCase();
    const names = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"];
    const idx = names.indexOf(w);
    if (idx === -1) return { start: prayerTimes.isha, end: prayerTimes.fajr };
    
    const start = prayerTimes[w];
    const end = idx < names.length - 1 ? prayerTimes[names[idx + 1]] : prayerTimes.fajr;
    return { start, end };
  };

  const { start, end } = getWaqtBounds();
  const formatT = (d: Date | null) => d ? format(d, "h:mm a") : "--:--";

  const checkForbidden = () => {
    if (!prayerTimes) return { isForbidden: false, name: "" };
    const now = new Date();
    const nowMs = now.getTime();
    
    const sunriseMs = prayerTimes.sunrise.getTime();
    if (nowMs >= sunriseMs && nowMs <= sunriseMs + 15 * 60 * 1000) return { isForbidden: true, name: "Sunrise" };
    
    const dhuhrMs = prayerTimes.dhuhr.getTime();
    if (nowMs >= dhuhrMs - 10 * 60 * 1000 && nowMs <= dhuhrMs) return { isForbidden: true, name: "Zenith (Zawal)" };
    
    const maghribMs = prayerTimes.maghrib.getTime();
    if (nowMs >= maghribMs - 15 * 60 * 1000 && nowMs <= maghribMs) return { isForbidden: true, name: "Sunset" };
    
    return { isForbidden: false, name: "" };
  };

  const forbidden = forceForbidden ? { isForbidden: true, name: "Test Mode" } : checkForbidden();

  return (
    <div 
      onClick={() => setShowSchedule(true)}
      className={`relative overflow-hidden p-6 lg:p-8 bg-gradient-to-br cursor-pointer transition-all duration-1000 ${forbidden.isForbidden ? "from-rose-950 to-rose-900" : cfg.gradient} rounded-[2rem] border border-white/10 shadow-2xl group text-left w-full active:scale-[0.99] flex flex-col justify-between min-h-[220px]`}
    >
      <AnimatePresence mode="wait">
        <motion.div 
          key={showNext ? "next" : "current"}
          initial={{ rotateX: 90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={{ rotateX: -90, opacity: 0 }}
          transition={{ duration: 0.6, ease: "anticipate" }}
          className="flex-1 flex flex-col justify-between h-full"
        >
          <div className="absolute -right-6 -top-6 text-[8rem] opacity-[0.06] pointer-events-none select-none group-hover:scale-110 transition-all duration-700">
            {showNext ? (WAQT_CONFIG[nextPrayer.name]?.emoji || "✨") : cfg.emoji}
          </div>
          <div className="absolute inset-0 bg-black/40 rounded-[2rem] pointer-events-none" />
          
          <div className="absolute top-6 right-8 flex items-center gap-3 z-30">
             <div className="flex items-center gap-2.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full">
                <div className={`w-1.5 h-1.5 rounded-full ${
                  forbidden.isForbidden ? "bg-rose-500 animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.6)]" :
                  showNext ? "bg-amber-400 animate-pulse shadow-[0_0_10px_rgba(251,191,36,0.5)]" : "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]"
                }`} />
                <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${forbidden.isForbidden ? "text-rose-400" : "text-white/50"}`}>
                  {forbidden.isForbidden ? "FORBIDDEN" : (showNext ? "COMING" : "CURRENT")}
                </span>
             </div>
             
             <button 
                onClick={(e) => { e.stopPropagation(); setShowAdhanSettings(true); }}
                className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white/30 hover:text-white"
             >
                <Settings className="w-3.5 h-3.5" />
             </button>
          </div>

          <div className="relative">
            <p className="text-[8px] font-black uppercase tracking-[0.4em] text-white/40">
              {forbidden.isForbidden ? `Macroh @ ${forbidden.name}` : (showNext ? "Coming Up" : "Active Waqt")}
            </p>
            <h2 className="text-3xl lg:text-5xl font-black font-serif italic text-white mt-1 uppercase tracking-tight">
              {forbidden.isForbidden ? "Forbidden Time" : (showNext ? nextPrayer.name : waqt)}
            </h2>
          </div>

          <div className="relative flex items-end justify-between mt-4">
            <div className="space-y-4">
              <div className="flex flex-col">
                 <p className="text-3xl lg:text-5xl font-mono font-black" style={{ color: cfg.accent }}>
                   {showNext ? formatT(nextPrayer.time) : format(new Date(), "h:mm a")} 
                 </p>
                 {!showNext && start && end && (
                   <p className="text-[10px] font-bold text-white/30 tracking-widest mt-1 uppercase">
                     {formatT(start)} <span className="opacity-20 px-1">/</span> {formatT(end)}
                   </p>
                 )}
              </div>
              <div className="flex items-center gap-2">
                <div 
                  className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-[9px] font-black uppercase tracking-widest text-white transition-all w-fit group-hover:bg-[#FFD700] group-hover:text-black group-hover:border-transparent"
                >
                  Full Schedule <ChevronRight className="w-3.5 h-3.5" />
                </div>
                
                <button 
                  onClick={(e) => { e.stopPropagation(); isPlaying ? stopAdhan() : playManualAdhan(showNext ? nextPrayer.name : waqt); }}
                  className={`flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all ${isPlaying ? "text-amber-400 border-amber-400/30" : "text-white/60"}`}
                >
                  {isPlaying ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  <span className="text-[9px] font-black uppercase tracking-widest">{isPlaying ? "Stop" : "Adhan"}</span>
                </button>

                <button 
                  onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
                  className={`p-2.5 rounded-xl border transition-all ${isMuted ? "bg-rose-500/10 border-rose-500/20 text-rose-400" : "bg-white/5 border-white/10 text-white/40"}`}
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
            <p className={`text-[11px] font-medium italic mb-2 max-w-[120px] text-right leading-relaxed ${forbidden.isForbidden ? "text-rose-400/60" : "text-white/30"}`}>
              {forbidden.isForbidden ? "Avoid mandatory prayer during this short period." : (showNext ? (WAQT_CONFIG[nextPrayer.name]?.sub || "Blessings") : cfg.sub)}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// ── Home Page ─────────────────────────────────────────────────────────
export const Home: React.FC = () => {
  const { waqt, nextPrayer, prayerTimes } = useWaqt();
  const { showGoalsModal, setShowGoalsModal } = useUser();
  const { streak: prayerStreak, fullDaysCount, getSalahForDate, togglePrayer } = useSalah();
  const todaySalah = getSalahForDate(startOfToday());
  const cfg = WAQT_CONFIG[waqt] ?? WAQT_CONFIG.Night;

  const [forceForbidden, setForceForbidden] = useState(false);
  const [showAdhanSettings, setShowAdhanSettings] = useState(false);
  const [dailyQuote, setDailyQuote] = useState(allQuotes[0]);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [showSchedule, setShowSchedule] = useState(false);

  // 🕒 Mood Caching Logic (Auto-reset after 15 min)
  useEffect(() => {
    const checkMood = () => {
      const saved = localStorage.getItem("noor_current_mood");
      if (saved) {
        try {
          const { key, timestamp } = JSON.parse(saved);
          const elapsed = Date.now() - timestamp;
          if (elapsed < 15 * 60 * 1000) {
            setSelectedMood(key);
          } else {
            localStorage.removeItem("noor_current_mood");
            setSelectedMood(null);
          }
        } catch (e) {
          console.error("Mood cache error", e);
        }
      }
    };

    checkMood();
    const interval = setInterval(checkMood, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const refreshQuote = (moodKey: string | null) => {
    // Check cache first
    const cacheKey = `noor_quote_${waqt}_${moodKey || "none"}`;
    const saved = localStorage.getItem(cacheKey);
    if (saved) {
      const q = allQuotes.find(x => x.id.toString() === saved);
      if (q) { setDailyQuote(q); return; }
    }

    let pool = allQuotes;
    if (moodKey) {
      const mood = MOODS.find(m => m.key === moodKey);
      if (mood) pool = allQuotes.filter(q => q.category_id === mood.categoryId);
    }
    const idx = Math.floor(Math.random() * pool.length);
    const chosen = pool[idx] || allQuotes[0];
    setDailyQuote(chosen);
    localStorage.setItem(cacheKey, chosen.id.toString());
  };

  useEffect(() => {
    refreshQuote(selectedMood);
  }, [selectedMood, waqt]);

  const handleMoodSelect = (key: string) => {
    const nextMood = selectedMood === key ? null : key;
    setSelectedMood(nextMood);
    if (nextMood) {
      localStorage.setItem("noor_current_mood", JSON.stringify({ key: nextMood, timestamp: Date.now() }));
    } else {
      localStorage.removeItem("noor_current_mood");
    }
    refreshQuote(nextMood);
  };

  return (
    <div className="space-y-6 pb-10 relative">
      <button 
        onClick={() => setForceForbidden(!forceForbidden)}
        className="fixed bottom-32 right-8 z-[100] px-5 py-3 bg-rose-500 text-white rounded-full font-black text-[9px] uppercase tracking-widest shadow-2xl transition-all active:scale-95 border border-white/20 hover:bg-rose-400"
      >
        Test Forbidden UI
      </button>

      {/* 🚀 1. Hero: Daily Quote (Tailored by Emotion) */}
      <section className="relative text-center py-10 px-8 glass-card border-none bg-white/[0.03] overflow-hidden rounded-[2.5rem] shadow-lg">
        <div className="absolute -top-6 -left-6 text-[8rem] opacity-[0.04] pointer-events-none select-none">{cfg.emoji}</div>
        <AnimatePresence mode="wait">
          <motion.div 
            key={dailyQuote.id + (selectedMood || "")} 
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} 
            className="relative space-y-4"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="w-6 h-[1px] bg-white/10" />
              <span className="px-3 py-1 rounded-full bg-white/5 text-[8px] uppercase tracking-[0.4em] font-black text-white/20 border border-white/5">
                {selectedMood ? `Guidance for being ${selectedMood}` : "Spiritual Reflection"}
              </span>
              <span className="w-6 h-[1px] bg-white/10" />
            </div>
            <h2 className="text-xl md:text-3xl font-serif italic leading-[1.5] text-white/90 max-w-3xl mx-auto px-4">
              "{dailyQuote.quote}"
            </h2>
            <div className="pt-2">
               <p className={`text-[10px] font-bold uppercase tracking-[0.2em] shadow-sm ${waqt === "Asr" ? "text-[#FFD700]/70" : "text-amber-400/60"}`}>— {dailyQuote.reference}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* 🧠 3. Find Solace: Single line, button-style mood tracker */}
      <div className="flex flex-col sm:flex-row items-center gap-4 px-6 py-4 glass-card border-white/5 rounded-3xl bg-white/[0.02]">
         <div className="shrink-0 flex items-center gap-2 border-r border-white/10 pr-4">
            <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Find Solace</span>
         </div>
         <div className="flex-1 flex items-center gap-2 overflow-x-auto custom-scrollbar-hide pb-0.5">
            {MOODS.map((mood) => (
               <button 
                 key={mood.key} onClick={() => handleMoodSelect(mood.key)}
                 className={`flex items-center gap-2 px-4 py-2 rounded-2xl border transition-all truncate group shrink-0 active:scale-95 ${
                   selectedMood === mood.key 
                     ? "bg-white/10 border-white/20 text-white" 
                     : "bg-white/5 border-white/5 text-white/40 hover:bg-white/10 hover:border-white/10"
                 }`}
               >
                  <span className={`text-base transition-transform ${selectedMood === mood.key ? "scale-110" : "group-hover:scale-110"}`}>
                    {mood.icon}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest">{mood.label}</span>
               </button>
            ))}
         </div>
         {selectedMood && (
            <button 
               onClick={() => handleMoodSelect(selectedMood)}
               className="p-2 rounded-full hover:bg-white/10 text-white/20 hover:text-white/40 transition-all shrink-0"
            >
               <X className="w-3.5 h-3.5" />
            </button>
         )}
      </div>

      {/* 🕌 2. Synchronization Grid (High-Density & Dynamic) */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        
        {/* Left: Dynamic Waqt Card (Current -> Preparation Flip -> Next) */}
        <div className="relative">
          <WaqtCard cfg={cfg} waqt={waqt} nextPrayer={nextPrayer} prayerTimes={prayerTimes} forceForbidden={forceForbidden} setShowSchedule={setShowSchedule} setShowAdhanSettings={setShowAdhanSettings} />
          <AnimatePresence>
            {showAdhanSettings && (
              <AdhanSettingsModal onClose={() => setShowAdhanSettings(false)} />
            )}
          </AnimatePresence>
        </div>

        {/* Right: Salah Journey Tracker... */}
        <div className={`glass-card p-6 lg:p-8 rounded-[2rem] flex flex-col justify-between min-h-[220px] transition-all duration-700 group ${
          waqt === "Asr" 
            ? "bg-[#9A9A9A]/10 border-[#9A9A9A]/20 shadow-xl hover:bg-[#022902]/60 hover:backdrop-blur-xl hover:scale-[1.05] hover:border-[#2FB68E]/40 hover:shadow-2xl hover:shadow-[#022902]/40" 
            : "border-indigo-500/10 hover:border-indigo-500/20 hover:scale-[1.02]"
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-serif italic text-white/90">Salah Journey</h2>
              <p className={`text-[8px] font-black uppercase tracking-[0.3em] mt-0.5 ${waqt === "Asr" ? "text-white/40" : "text-white/20"}`}>
                Maintain Consistency
              </p>
            </div>
            <div className="text-right">
               <p className={`text-[9px] font-black uppercase tracking-widest ${waqt === "Asr" ? "text-[#FFD700]" : "text-indigo-400"}`}>
                 {prayerStreak} STREAK
               </p>
               <p className="text-[7px] text-white/20 font-bold uppercase italic tracking-tighter mt-0.5">{fullDaysCount} Successes</p>
            </div>
          </div>
          
          <div className="grid grid-cols-5 gap-2">
            {PRAYER_NAMES.map((name) => {
              const id = name.toLowerCase() as PrayerId;
              const isDone = todaySalah[id];
              
              const isFuture = () => {
                if (!prayerTimes) return false;
                const pTime = (prayerTimes as any)[id];
                if (!pTime) return false;
                return pTime.getTime() > Date.now();
              };
              const upcoming = isFuture();

              return (
                <button 
                  key={name} 
                  disabled={upcoming}
                  onClick={() => togglePrayer(startOfToday(), id)}
                  className={`p-3 rounded-[1.2rem] lg:rounded-[1.5rem] border flex flex-col items-center gap-2 transition-all active:scale-95 shadow-md ${
                    upcoming ? "opacity-30 grayscale cursor-not-allowed" : ""
                  } ${
                    isDone 
                      ? (waqt === "Asr" ? "bg-[#FFD700]/10 border-[#FFD700]/30" : "bg-indigo-400/5 border-indigo-400/30") 
                      : (waqt === "Asr" ? "bg-white/5 border-white/10 hover:border-white/20" : "bg-white/5 border-white/5 hover:border-white/10")
                  }`}
                >
                  <div className={`p-1.5 lg:p-2 rounded-xl transition-colors ${
                    isDone 
                      ? (waqt === "Asr" ? "bg-[#FFD700]/20 shadow-[0_0_15px_rgba(255,215,0,0.2)]" : "bg-indigo-400/20 shadow-[0_0_15px_rgba(129,140,248,0.2)]") 
                      : "bg-white/10"
                  }`}>
                     {isDone 
                       ? <CheckCircle2 className={`w-4 h-4 ${waqt === "Asr" ? "text-[#FFD700]" : "text-indigo-400"}`} /> 
                       : <Circle className="w-4 h-4 text-white/20" />
                     }
                  </div>
                  <span className={`text-[7px] font-black uppercase tracking-[0.05em] transition-colors ${
                    isDone 
                      ? (waqt === "Asr" ? "text-[#FFD700]" : "text-indigo-400") 
                      : (waqt === "Asr" ? "text-white/50" : "text-white/40")
                  }`}>
                     {name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 🗂️ 5. Card list of features (Quick Access) */}
      <section className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-4">
        {[
          { label: "Knowledge Academy", icon: GraduationCap, color: "bg-amber-400/10 border-amber-400/15", text: "text-amber-400", path: "/knowledge", featured: true },
          { label: "Holy Quran",    icon: Book,       color: "bg-emerald-400/10 border-emerald-400/15", text: "text-emerald-400", path: "/quran" },
          { label: "Dua Collection", icon: Heart,      color: "bg-rose-400/10 border-rose-400/15",      text: "text-rose-400",    path: "/duas"  },
          { label: "Tasbih Counter", icon: Hand,       color: "bg-indigo-400/10 border-indigo-400/15",  text: "text-indigo-400",  path: "/tasbih" },
          { label: "99 Names",      icon: Star,       color: "bg-amber-400/10 border-amber-400/15",    text: "text-amber-400",   path: "/names" },
          { label: "Daily Quotes",   icon: Quote,      color: "bg-sky-400/10 border-sky-400/15",        text: "text-sky-400",     path: "/quotes" },
          { label: "Zakat/Fitra Calculation", icon: Calculator, color: "bg-blue-400/10 border-blue-400/15", text: "text-blue-400", path: "/tools" },
          { label: "Wisdom Quiz",    icon: Brain,      color: "bg-rose-500/10 border-rose-500/15",      text: "text-rose-500",    path: "/quiz"  },
          { label: "Prophet Stories", icon: History,    color: "bg-rose-400/10 border-rose-400/15",      text: "text-rose-400",    path: "/prophets" },
        ].map((card) => (
          <Link key={card.label} to={card.path}
            className={`p-8 glass-button rounded-[2.5rem] group flex flex-col items-center text-center shadow-xl border-white/5 transition-all ${
              waqt === "Asr" ? "bg-[#9A9A9A]/5 hover:bg-[#9A9A9A]/10 border-[#9A9A9A]/10 shadow-[#9A9A9A]/10" : "hover:bg-white/[0.08]"
            }`}>
            <div className={`w-16 h-16 rounded-[1.5rem] ${waqt === "Asr" ? "bg-[#FFD700]/10 border-[#FFD700]/30 border-2" : (card.color + " border-2")} flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-[10deg] transition-all duration-700`}>
              <card.icon className={`w-8 h-8 ${waqt === "Asr" ? "text-[#FFD700]" : card.text}`} />
            </div>
            <p className={`text-[11px] font-black uppercase tracking-[0.2em] group-hover:text-white transition-colors ${
              waqt === "Asr" ? "text-white/40" : "text-white/60"
            }`}>
              {card.label}
            </p>
          </Link>
        ))}
      </section>

      {/* ── All Global Modals ── */}
      <AnimatePresence>
        {showSchedule && <ScheduleModal key="schedule" onClose={() => setShowSchedule(false)} />}
        {showGoalsModal && <GoalsModal key="goals" onClose={() => setShowGoalsModal(false)} />}
      </AnimatePresence>
    </div>
  );
};
