import React, { useState, useEffect, useMemo } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Navigation } from "./Navigation";
import { DynamicBackground } from "./DynamicBackground";
import { motion, AnimatePresence } from "motion/react";
import { useWaqt } from "../WaqtContext";
import { formatDistanceToNowStrict } from "date-fns";
import { Clock, X, Palette, Check, MapPin, Moon, ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme, THEMES, type ThemeId } from "../contexts/ThemeContext";
import { toHijri, HIJRI_MONTHS, HIJRI_MONTHS_AR, fromHijri } from "../lib/hijri";
import { format } from "date-fns";
import { useUser } from "../contexts/UserContext";
import { useTasbih } from "../contexts/TasbihContext";
import { useSalah } from "../contexts/SalahContext";
import { Award, Zap, RotateCcw, Star, MoonStar, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LocationModal } from "./LocationModal";
import { GoalsModal } from "./GoalsModal";

// ── Page title map ───────────────────────────────────────────────────
const PAGE_TITLES: Record<string, string> = {
  "/":             "",
  "/quotes":       "Quotes",
  "/quran":        "Quran",
  "/duas":         "Duas & Adhkar",
  "/tools":        "Islamic Tools",
  "/names":        "99 Names of Allah",
  "/prayer-times": "Prayer Times",
  "/journey":      "Your Journey",
  "/tasbih":            "Tasbih Counter",
  "/tasbih/custom":     "Your Own Dua",
  "/tasbih/predefined": "Predefined Dhikr",
  "/salah":             "Daily Salah Tracker",
  "/quiz":              "Islamic Wisdom Quiz",
};



// ── Hijri Calendar Modal ─────────────────────────────────────────────
const HijriCalendarModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { waqt } = useWaqt();
  const isAsr = waqt === "Asr";
  const todayHijri = useMemo(() => toHijri(), []);
  const [viewMonth, setViewMonth] = useState(todayHijri.month); 
  const [viewYear, setViewYear] = useState(todayHijri.year);

  const daysInMonth = (m: number, _y: number) => (m % 2 === 1) ? 30 : 29;
  const totalDays = daysInMonth(viewMonth, viewYear);
  const startDay = ((viewYear * 12 + viewMonth) * 3 + 2) % 7;

  const goNext = () => { if (viewMonth === 12) { setViewMonth(1); setViewYear(y => y + 1); } else setViewMonth(m => m + 1); };
  const goPrev = () => { if (viewMonth === 1) { setViewMonth(12); setViewYear(y => y - 1); } else setViewMonth(m => m - 1); };

  const isCurrentMonth = viewMonth === todayHijri.month && viewYear === todayHijri.year;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-md" />
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }}
        className="relative w-full max-w-md glass-modal rounded-[2.5rem] overflow-hidden shadow-2xl"
      >
        <div className={`${isAsr ? "bg-[#2FB68E]/10 border-[#2FB68E]/20" : "bg-emerald-500/10 border-emerald-500/20"} px-8 pt-8 pb-6 text-center border-b`}>
          <div className="flex items-center justify-between gap-4 mb-4">
            <button onClick={goPrev} className="p-2.5 rounded-full bg-black/20 hover:bg-black/40 border border-white/5 transition-all">
              <ChevronLeft className="w-4 h-4 text-white/60" />
            </button>
            <div className="text-center">
              <h3 className={`text-2xl font-serif font-bold tracking-wide ${isAsr ? "text-[#FFD700]" : "text-emerald-400"}`}>
                {HIJRI_MONTHS_AR[viewMonth - 1]}
              </h3>
              <p className={`text-[10px] font-black uppercase tracking-[0.4em] mt-1 ${isAsr ? "text-[#FFD700]/70" : "text-emerald-500/70"}`}>
                {HIJRI_MONTHS[viewMonth - 1]} {viewYear} AH
              </p>
            </div>
            <button onClick={goNext} className="p-2.5 rounded-full bg-black/20 hover:bg-black/40 border border-white/5 transition-all">
              <ChevronRight className="w-4 h-4 text-white/60" />
            </button>
          </div>
        </div>

        <div className="px-8 grid grid-cols-7 gap-1 mt-6 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
            <div key={d} className={`text-center text-[8px] font-black uppercase tracking-widest py-1 ${d === "Fri" ? (isAsr ? "text-[#FFD700]" : "text-emerald-400") : "text-white/20"}`}>
              {d}
            </div>
          ))}
        </div>

        <div className="px-8 pb-8 grid grid-cols-7 gap-1">
          {Array.from({ length: startDay }).map((_, i) => <div key={`e-${i}`} />)}
          {Array.from({ length: totalDays }).map((_, i) => {
            const day = i + 1;
            const isToday = isCurrentMonth && day === todayHijri.day;
            const dayOfWeek = (startDay + i) % 7;
            const isFriday = dayOfWeek === 5;
            const gDayStr = format(fromHijri(viewYear, viewMonth, day), "d");

            return (
              <div key={day} className={`relative aspect-square flex flex-col items-center justify-center rounded-2xl transition-all border ${
                  isToday
                    ? (isAsr ? "bg-[#FFD700] border-[#FFD700] text-black shadow-lg shadow-[#FFD700]/20" : "bg-emerald-400 border-emerald-400 text-black shadow-lg shadow-emerald-400/20")
                    : isFriday
                      ? (isAsr ? "text-[#FFD700] bg-[#FFD700]/5 border-[#FFD700]/20" : "text-emerald-400 bg-emerald-400/5 border-emerald-400/20")
                      : "text-white/60 bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/10"
                }`}>
                <span className="text-sm font-bold">{day}</span>
                <span className={`text-[7px] font-black opacity-30 absolute bottom-1.5 ${isToday ? "text-black opacity-40" : ""}`}>{gDayStr}</span>
                {isToday && <div className="absolute top-1 right-1 w-1 h-1 rounded-full bg-black/40" />}
              </div>
            );
          })}
        </div>

        <div className="px-8 pb-6 flex items-center justify-between">
          <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">
            Today: {todayHijri.day} {todayHijri.monthName} {todayHijri.year} AH
          </p>
          <button onClick={onClose} className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-white/50 transition-all">Close</button>
        </div>
      </motion.div>
    </div>
  );
};

// ── Theme Picker ─────────────────────────────────────────────────────
const ThemePicker: React.FC = () => {
  const { themeId, setThemeId, theme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border bg-white/5 border-white/10 text-white/80 hover:bg-white/10 text-[9px] font-black uppercase tracking-widest transition-all"
      >
        <Palette className="w-3 h-3" />
        <span className="hidden sm:inline">{THEMES[themeId].emoji} {THEMES[themeId].name}</span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-[100]" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 6 }}
              transition={{ duration: 0.18 }}
              className="absolute top-full mt-3 right-0 z-[110] w-72 glass-modal rounded-3xl overflow-hidden shadow-2xl p-2"
            >
              <p className="text-[8px] font-black uppercase tracking-[0.35em] text-white/20 px-4 py-3">Choose Theme</p>
              <div className="grid grid-cols-2 gap-2 px-2 pb-2">
                {Object.values(THEMES).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => { setThemeId(t.id as ThemeId); setOpen(false); }}
                    className={`relative flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all overflow-hidden ${
                      themeId === t.id
                        ? "border-white/30 bg-white/10"
                        : "border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/15"
                    }`}
                  >
                    <div
                      className="w-7 h-7 rounded-xl shrink-0 border border-white/10"
                      style={{
                        background: `linear-gradient(135deg, ${t.gradientFrom}, ${t.gradientTo})`,
                        boxShadow: `0 0 8px ${t.accent}44`,
                      }}
                    />
                    <p className="text-[9px] font-black uppercase tracking-wider text-white/80 truncate">{t.emoji} {t.name}</p>
                    {themeId === t.id && <Check className="w-3 h-3 text-white/60 absolute top-2.5 right-2.5" />}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Prayer Clock Widget ──────────────────────────────────────────────
const PrayerClock: React.FC = () => {
  const { nextPrayer, waqt } = useWaqt();
  const [expanded, setExpanded] = useState(false);
  const [countdown, setCountdown] = useState("");
  const isAsr = waqt === "Asr";

  useEffect(() => {
    if (!nextPrayer) return;
    const update = () => { try { setCountdown(formatDistanceToNowStrict(nextPrayer.time, { addSuffix: false })); } catch { setCountdown("--"); } };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [nextPrayer]);

  return (
    <button
      onClick={() => setExpanded(e => !e)}
      className={`flex items-center gap-2 px-3 py-1.5 border rounded-full transition-all ${
        isAsr ? "bg-[#FFD700]/10 border-[#FFD700]/20 hover:bg-[#FFD700]/15" : "bg-amber-400/10 border-amber-400/20 hover:bg-amber-400/15"
      }`}
    >
      <Clock className={`w-3.5 h-3.5 ${isAsr ? "text-[#FFD700]" : "text-amber-400"}`} />
      <AnimatePresence mode="wait">
        {expanded ? (
          <motion.div key="expanded" initial={{ width: 0, opacity: 0 }} animate={{ width: "auto", opacity: 1 }} exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
            <span className={`text-[9px] font-black uppercase tracking-widest ${isAsr ? "text-[#FFD700]" : "text-amber-400"}`}>{nextPrayer?.name ?? waqt}</span>
            <span className="text-[8px] text-white/30">•</span>
            <span className={`text-[10px] font-black font-mono ${isAsr ? "text-[#FFD700]" : "text-amber-400"}`}>{countdown}</span>
          </motion.div>
        ) : (
          <motion.span key="collapsed" initial={{ width: 0, opacity: 0 }} animate={{ width: "auto", opacity: 1 }} exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.2 }} className={`text-[9px] font-black uppercase tracking-widest overflow-hidden whitespace-nowrap ${isAsr ? "text-[#FFD700]" : "text-amber-400"}`}>{waqt}</motion.span>
        )}
      </AnimatePresence>
    </button>
  );
};

// ── Hijri Date Pill (clickable → opens calendar) ─────────────────────
const HijriPill: React.FC = () => {
  const [showCalendar, setShowCalendar] = useState(false);
  const hijri = useMemo(() => toHijri(), []);
  return (
    <>
      <button onClick={() => setShowCalendar(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all">
        <Moon className="w-3 h-3 text-white/70" /><span className="text-[8px] font-bold tracking-widest text-white/70 uppercase">{hijri.day} {hijri.monthName} {hijri.year}</span>
      </button>
      <AnimatePresence>{showCalendar && <HijriCalendarModal onClose={() => setShowCalendar(false)} />}</AnimatePresence>
    </>
  );
};

// ── Journey Stage Indicator ──────────────────────────────────────────
const JourneyIndicator: React.FC = () => {
  const { points, getJourneyStage } = useUser();
  const { tasbihBadges, totalTasbihCount } = useTasbih();
  const { salahBadges, streak: prayerStreak } = useSalah();
  const { waqt } = useWaqt();
  const isAsr = waqt === "Asr";
  const stage = getJourneyStage();
  
  const [displayMode, setDisplayMode] = useState<"points" | "tasbih" | "salah">("points");

  useEffect(() => {
    const modes = ["points", "tasbih", "salah"] as const;
    const interval = setInterval(() => {
      setDisplayMode(prev => {
        const idx = modes.indexOf(prev);
        return modes[(idx + 1) % modes.length];
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const latestTasbih = [...tasbihBadges].reverse().find(b => b.unlocked);
  const latestSalah = [...salahBadges].reverse().find(b => b.unlocked);

  return (
    <Link to="/journey" className="flex items-center gap-2.5 px-3.5 py-1.5 glass-button rounded-full hover:scale-105 active:scale-95 transition-all w-[140px] overflow-hidden relative group">
      <AnimatePresence mode="wait">
        {displayMode === "points" && (
          <motion.div key="points" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-2.5 w-full">
            <div className="flex -space-x-1"><Award className={`w-3 h-3 ${isAsr ? "text-[#FFD700]" : "text-amber-400"}`} /></div>
            <div className="flex flex-col items-start leading-none min-w-0">
              <span className={`text-[9px] font-black uppercase tracking-widest text-white/90 truncate w-full`}>{stage}</span>
              <span className="text-[7px] font-bold text-white/40 uppercase tracking-tighter">{points} Points</span>
            </div>
          </motion.div>
        )}
        {displayMode === "tasbih" && (
          <motion.div key="tasbih" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-2.5 w-full">
            <div className="flex -space-x-1"><RotateCcw className={`w-3 h-3 ${isAsr ? "text-[#FFD700]" : "text-sky-400"}`} /></div>
            <div className="flex flex-col items-start leading-none min-w-0">
              <span className={`text-[9px] font-black uppercase tracking-widest truncate w-full ${isAsr ? "text-[#FFD700]" : "text-sky-400"}`}>{latestTasbih ? latestTasbih.title : "Remembrance"}</span>
              <span className="text-[7px] font-bold text-white/40 uppercase tracking-tighter">{totalTasbihCount} Taps</span>
            </div>
          </motion.div>
        )}
        {displayMode === "salah" && (
          <motion.div key="salah" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-2.5 w-full">
            <div className="flex -space-x-1"><MoonStar className={`w-3 h-3 ${isAsr ? "text-[#FFD700]" : "text-indigo-400"}`} /></div>
            <div className="flex flex-col items-start leading-none min-w-0">
              <span className={`text-[9px] font-black uppercase tracking-widest truncate w-full ${isAsr ? "text-[#FFD700]" : "text-indigo-400"}`}>{latestSalah ? latestSalah.title : "Consistency"}</span>
              <span className="text-[7px] font-bold text-white/40 uppercase tracking-tighter">{prayerStreak} Day Streak</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Link>
  );
};

// ── XP Reward Toast ──────────────────────────────────────────────────
// Note: In a real app, this would be triggered via a global emitter or context queue.
// For this POC, we'll keep it simple.
const XPToast: React.FC<{ message: string; sub: string; onDismiss: () => void }> = ({ message, sub, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 50, opacity: 0 }}
      className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[1000] px-6 py-3 glass-card rounded-2xl flex items-center gap-4 border-amber-400/20"
    >
      <div className="w-8 h-8 rounded-full bg-amber-400/20 flex items-center justify-center">
        <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
      </div>
      <div>
        <p className="text-[11px] font-black uppercase tracking-widest text-white">{message}</p>
        <p className="text-[9px] font-medium text-white/40">{sub}</p>
      </div>
    </motion.div>
  );
};

// ── Unified Top Bar ──────────────────────────────────────────────────
const TopBar: React.FC<{ title: string }> = ({ title }) => {
  const { location, setShowLocationModal, waqt } = useWaqt();
  const { showGoalsModal, setShowGoalsModal } = useUser();
  const routerNav = useNavigate();
  const currentPath = useLocation().pathname;
  const isAsr = waqt === "Asr";

  const getLocationLabel = () => {
    if (!location) return "—";
    const { city, detectionMethod } = location;
    const labels: Record<string, string> = { 
      gps: "(Auto GPS)", 
      timezone: "(Auto)", 
      manual: "(Selected)" 
    };
    return `${city} ${labels[detectionMethod] || ""}`;
  };

  return (
    <div className="flex items-center justify-between gap-3 mb-8 pt-2 flex-wrap">
      {/* Left side: Goals + Back Button + Page title + Location */}
      <div className="flex items-center gap-3">
        <button 
          onClick={() => setShowGoalsModal(true)}
          className={`p-2.5 rounded-full border transition-all active:scale-90 group ${
            showGoalsModal 
              ? (isAsr ? "bg-[#FFD700] border-[#FFD700] text-black shadow-lg shadow-[#FFD700]/20" : "bg-amber-400 border-amber-400 text-black shadow-lg shadow-amber-400/20") 
              : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-white"
          }`}
          title="Today's Goals"
        >
          <Target className={`w-4 h-4 transition-transform group-hover:rotate-12`} />
        </button>

        {currentPath !== "/" && (
          <button 
            onClick={() => routerNav(-1)}
            className={`p-2.5 rounded-full border transition-all group pointer-events-auto ${
              isAsr ? "bg-[#9A9A9A]/10 border-[#9A9A9A]/20" : "bg-white/5 border-white/10"
            }`}
          >
            <ChevronLeft className={`w-4 h-4 group-hover:-translate-x-0.5 transition-all ${isAsr ? "text-white" : "text-white/60 group-hover:text-white"}`} />
          </button>
        )}
        {title && (
          <motion.p
            key={title}
            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            className={`text-[10px] font-black uppercase tracking-[0.4em] ${isAsr ? "text-white/80" : "text-white/60"}`}
          >
            {title}
          </motion.p>
        )}
        <button 
          onClick={() => setShowLocationModal(true)}
          className={`flex items-center gap-2 px-3.5 py-1.5 border rounded-full transition-all group ${
            isAsr ? "bg-[#9A9A9A]/10 border-[#9A9A9A]/20" : "bg-white/5 border-white/10 hover:bg-white/10"
          }`}
        >
          <MapPin className={`w-3.5 h-3.5 transition-colors ${isAsr ? "text-[#FFD700]" : "text-white/40 group-hover:text-white"}`} />
          <span className={`text-[9px] font-bold uppercase tracking-[0.2em] transition-colors ${isAsr ? "text-white" : "text-white/60 group-hover:text-white"}`}>
            {getLocationLabel()}
          </span>
        </button>
        <div className="hidden md:block">
          <HijriPill />
        </div>
      </div>

      {/* Right side: Journey + Theme + Prayer Clock */}
      <div className="flex items-center gap-2.5">
        <JourneyIndicator />
        <div className="w-[1px] h-4 bg-white/10 mx-1 hidden sm:block" />
        
        {currentPath.startsWith("/tasbih/") && !currentPath.includes("/custom/new") && (
           <button 
             onClick={() => window.dispatchEvent(new Event("tasbih-reset"))}
             className="p-2.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500/70 hover:bg-rose-500 hover:text-white transition-all shadow-lg active:scale-95"
             title="Reset Progress"
           >
             <RotateCcw className="w-3.5 h-3.5" />
           </button>
        )}

        <ThemePicker />
        <PrayerClock />
      </div>
    </div>
  );
};

// ── Unified Achievement Popup Component ──────────────────────────────
interface AchievementBadge {
  id: string;
  type: "learning" | "dhikr" | "salah";
  title: string;
  subtitle: string;
  unlocked: boolean;
  popupShown: boolean;
}

const AchievementPopup: React.FC<{ 
  badge: AchievementBadge; 
  onDismiss: () => void;
}> = ({ badge, onDismiss }) => {
  const { markBadgePopupShown: markUserBadge } = useUser();
  const { markBadgePopupShown: markTasbihBadge } = useTasbih();
  const { markBadgePopupShown: markSalahBadge } = useSalah();

  const config = {
    learning: { title: "MashaAllah", label: "Learning Milestone", icon: Award, color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20" },
    dhikr:    { title: "Blessed Remembrance", label: "Dhikr Milestone", icon: RotateCcw, color: "text-sky-400", bg: "bg-sky-400/10", border: "border-sky-400/20" },
    salah:    { title: "Steadfast in Prayer", label: "Salah Milestone", icon: MoonStar, color: "text-indigo-400", bg: "bg-indigo-400/10", border: "border-indigo-400/20" },
  }[badge.type];

  useEffect(() => {
    const timer = setTimeout(onDismiss, 3500);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const handleDismiss = () => {
    if (badge.type === "learning") markUserBadge(badge.id);
    else if (badge.type === "dhikr") markTasbihBadge(badge.id);
    else if (badge.type === "salah") markSalahBadge(badge.id);
    onDismiss();
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 pointer-events-none">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-xl pointer-events-auto"
        onClick={handleDismiss}
      />
      <motion.div
        initial={{ scale: 0.85, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        transition={{ type: "spring", damping: 25, stiffness: 400 }}
        className="relative w-full max-w-sm glass-modal rounded-[3rem] p-12 text-center space-y-7 overflow-hidden shadow-2xl pointer-events-auto cursor-pointer border-white/5"
        onClick={handleDismiss}
      >
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12 scale-150 pointer-events-none">
           <config.icon className={`w-64 h-64 ${config.color}`} />
        </div>

        <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl relative border ${config.bg} ${config.border}`}>
           <config.icon className={`w-12 h-12 ${config.color}`} />
           <motion.div 
             animate={{ scale: [1, 1.2, 1], opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 4 }}
             className="absolute -inset-3 border border-white/5 rounded-[2.5rem] pointer-events-none"
           />
        </div>

        <div className="space-y-3 relative z-10">
          <p className={`text-[9px] font-black uppercase tracking-[0.4em] ${config.color}/70`}>
             {config.label}
          </p>
          <h2 className="text-3xl font-serif italic text-white leading-tight">
             {config.title}
          </h2>
          <div className="space-y-1 mt-6">
             <p className="text-sm text-white font-bold tracking-wide">{badge.title}</p>
             <p className="text-[11px] text-white/30 font-medium italic">"{badge.subtitle}"</p>
          </div>
        </div>

        <div className="pt-4 border-t border-white/5">
           <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/10 italic">
              May Allah accept your efforts
           </p>
        </div>
      </motion.div>
    </div>
  );
};

// ── Layout ───────────────────────────────────────────────────────────
export const Layout: React.FC = () => {
  const location = useLocation();
  const title = useMemo(() => {
    if (location.pathname.startsWith("/tasbih/")) return "Dhikr Counter";
    return PAGE_TITLES[location.pathname] ?? "Noor";
  }, [location.pathname]);

  const { toast, clearToast, learningBadges, showGoalsModal, setShowGoalsModal } = useUser();
  const { tasbihBadges } = useTasbih();
  const { salahBadges } = useSalah();

  const [queue, setQueue] = useState<AchievementBadge[]>([]);
  const [currentAchievement, setCurrentAchievement] = useState<AchievementBadge | null>(null);

  // Queue Manager: Collect all pending unlocks
  useEffect(() => {
    const allBadges: AchievementBadge[] = [
      ...learningBadges,
      ...tasbihBadges,
      ...salahBadges
    ];

    const pending = allBadges.filter(b => b.unlocked && !b.popupShown);
    
    setQueue(prev => {
      // Add only if not already in queue
      const existingIds = new Set(prev.map(b => b.id));
      const nextOnes = pending.filter(b => !existingIds.has(b.id));
      if (nextOnes.length === 0) return prev;
      return [...prev, ...nextOnes];
    });
  }, [learningBadges, tasbihBadges, salahBadges]);

  // Display Manager: Show one by one
  useEffect(() => {
    if (!currentAchievement && queue.length > 0) {
      setCurrentAchievement(queue[0]);
      setQueue(prev => prev.slice(1));
    }
  }, [queue, currentAchievement]);

  useEffect(() => {
    document.title = location.pathname === "/"
      ? "Noor: Islamic Daily Companion" : `${title} — Noor`;
  }, [title, location.pathname]);

  return (
    <div className="min-h-screen text-white font-sans selection:bg-white/30">
      <DynamicBackground />

      <main className="container mx-auto px-4 pt-4 pb-32 max-w-7xl">
        <TopBar title={title} />
        <motion.div
           key={location.pathname} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.32 }}
        >
          <Outlet />
        </motion.div>
      </main>

      <AnimatePresence>
        {toast && (
          <XPToast key="xp-toast" message={toast.message} sub={toast.sub} onDismiss={clearToast} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {currentAchievement && (
          <AchievementPopup 
            key={currentAchievement.id} 
            badge={currentAchievement} 
            onDismiss={() => setCurrentAchievement(null)} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        <LocationModal />
      </AnimatePresence>

      <AnimatePresence>
        {showGoalsModal && <GoalsModal onClose={() => setShowGoalsModal(false)} />}
      </AnimatePresence>

      <Navigation />
    </div>
  );
};
