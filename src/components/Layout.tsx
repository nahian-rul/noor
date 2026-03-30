import React, { useState, useEffect, useMemo } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Navigation } from "./Navigation";
import { DynamicBackground } from "./DynamicBackground";
import { motion, AnimatePresence } from "motion/react";
import { useWaqt } from "../WaqtContext";
import { formatDistanceToNowStrict } from "date-fns";
import { Clock, X, Palette, Check, MapPin, Moon, ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme, THEMES, type ThemeId } from "../contexts/ThemeContext";
import { toHijri } from "../lib/hijri";

// ── Page title map ───────────────────────────────────────────────────
const PAGE_TITLES: Record<string, string> = {
  "/":             "",
  "/quotes":       "Quotes",
  "/quran":        "Quran",
  "/duas":         "Duas & Adhkar",
  "/tools":        "Islamic Tools",
  "/names":        "99 Names of Allah",
  "/prayer-times": "Prayer Times",
};

const HIJRI_MONTHS = [
  "Muharram", "Safar", "Rabi' al-Awwal", "Rabi' al-Thani",
  "Jumada al-Ula", "Jumada al-Thani", "Rajab", "Sha'ban",
  "Ramadan", "Shawwal", "Dhul Qi'dah", "Dhul Hijjah"
];

// ── Hijri Calendar Modal ─────────────────────────────────────────────
const HijriCalendarModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const todayHijri = useMemo(() => toHijri(), []);
  const [viewMonth, setViewMonth] = useState(todayHijri.month); // 1-indexed
  const [viewYear, setViewYear] = useState(todayHijri.year);

  // Approximate days in Hijri month (alternating 30/29, month 12 can be 30 in leap years)
  const daysInMonth = (m: number, _y: number) => (m % 2 === 1) ? 30 : 29;
  const totalDays = daysInMonth(viewMonth, viewYear);

  // Approximate start day of week (use a simple hash for visual variety)
  const startDay = ((viewYear * 12 + viewMonth) * 3 + 2) % 7;

  const goNext = () => {
    if (viewMonth === 12) { setViewMonth(1); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };
  const goPrev = () => {
    if (viewMonth === 1) { setViewMonth(12); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };

  const isCurrentMonth = viewMonth === todayHijri.month && viewYear === todayHijri.year;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-md" />
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        transition={{ type: "spring", damping: 24, stiffness: 300 }}
        className="relative w-full max-w-md bg-[#0c0c16] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="px-8 pt-8 pb-4 flex items-center justify-between">
          <button onClick={goPrev} className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
            <ChevronLeft className="w-4 h-4 text-white/50" />
          </button>
          <div className="text-center">
            <h3 className="text-lg font-serif italic text-white/90">{HIJRI_MONTHS[viewMonth - 1]}</h3>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400/60">{viewYear} AH</p>
          </div>
          <button onClick={goNext} className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
            <ChevronRight className="w-4 h-4 text-white/50" />
          </button>
        </div>

        {/* Day headers */}
        <div className="px-8 grid grid-cols-7 gap-1 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
            <div key={d} className={`text-center text-[8px] font-black uppercase tracking-widest py-1 ${d === "Fri" ? "text-emerald-400/60" : "text-white/20"}`}>
              {d}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="px-8 pb-8 grid grid-cols-7 gap-1">
          {/* Empty cells for start offset */}
          {Array.from({ length: startDay }).map((_, i) => (
            <div key={`e-${i}`} />
          ))}
          {/* Day cells */}
          {Array.from({ length: totalDays }).map((_, i) => {
            const day = i + 1;
            const isToday = isCurrentMonth && day === todayHijri.day;
            const dayOfWeek = (startDay + i) % 7;
            const isFriday = dayOfWeek === 5;
            return (
              <div
                key={day}
                className={`relative aspect-square flex items-center justify-center rounded-xl text-sm font-bold transition-all ${
                  isToday
                    ? "bg-emerald-400 text-black font-black shadow-lg shadow-emerald-400/30"
                    : isFriday
                      ? "text-emerald-400/70 bg-emerald-400/5"
                      : "text-white/50 hover:bg-white/5"
                }`}
              >
                {day}
                {isToday && (
                  <div className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-emerald-400" />
                )}
              </div>
            );
          })}
        </div>

        {/* Today marker */}
        <div className="px-8 pb-6 flex items-center justify-between">
          <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">
            Today: {todayHijri.day} {todayHijri.monthName} {todayHijri.year} AH
          </p>
          <button onClick={onClose} className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-white/50 transition-all">
            Close
          </button>
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
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest transition-all ${
          themeId !== "auto"
            ? "bg-white/15 border-white/20 text-white"
            : "bg-white/5 border-white/10 text-white/50 hover:text-white hover:bg-white/10"
        }`}
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
              className="absolute top-full mt-3 right-0 z-[110] w-72 bg-[#0a0a12]/95 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl p-2"
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

  useEffect(() => {
    if (!nextPrayer) return;
    const update = () => {
      try { setCountdown(formatDistanceToNowStrict(nextPrayer.time, { addSuffix: false })); }
      catch { setCountdown("--"); }
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [nextPrayer]);

  return (
    <button
      onClick={() => setExpanded(e => !e)}
      className="flex items-center gap-2 px-3 py-1.5 bg-amber-400/10 border border-amber-400/20 rounded-full transition-all hover:bg-amber-400/15"
    >
      <Clock className="w-3.5 h-3.5 text-amber-400" />
      <AnimatePresence mode="wait">
        {expanded ? (
          <motion.div
            key="expanded"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2 overflow-hidden whitespace-nowrap"
          >
            <span className="text-[9px] font-black uppercase tracking-widest text-amber-400">{nextPrayer?.name ?? waqt}</span>
            <span className="text-[8px] text-white/30">•</span>
            <span className="text-[10px] font-black text-amber-400 font-mono">{countdown}</span>
          </motion.div>
        ) : (
          <motion.span
            key="collapsed"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="text-[9px] font-black uppercase tracking-widest text-amber-400 overflow-hidden whitespace-nowrap"
          >
            {waqt}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
};

// ── Hijri Date Pill (clickable → opens calendar) ─────────────────────
const HijriPill: React.FC = () => {
  const [showCalendar, setShowCalendar] = useState(false);
  const hijri = useMemo(() => toHijri(), []);
  const { theme } = useTheme();

  return (
    <>
      <button
        onClick={() => setShowCalendar(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all"
      >
        <Moon className="w-3 h-3" style={{ color: theme.star }} />
        <span className="text-[8px] font-bold tracking-widest" style={{ color: theme.star, opacity: 0.7 }}>
          {hijri.day} {hijri.monthName} {hijri.year} AH
        </span>
      </button>
      <AnimatePresence>
        {showCalendar && <HijriCalendarModal onClose={() => setShowCalendar(false)} />}
      </AnimatePresence>
    </>
  );
};

// ── Unified Top Bar ──────────────────────────────────────────────────
const TopBar: React.FC<{ title: string }> = ({ title }) => {
  const { location } = useWaqt();
  const { theme } = useTheme();

  return (
    <div className="flex items-center justify-between gap-3 mb-8 pt-2 flex-wrap">
      {/* Left side: Page title (hidden on Home) + Location + Hijri */}
      <div className="flex items-center gap-3">
        {title && (
          <motion.p
            key={title}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-[10px] font-black uppercase tracking-[0.4em]"
            style={{ color: theme.star, opacity: 0.35 }}
          >
            {title}
          </motion.p>
        )}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full">
          <MapPin className="w-3 h-3" style={{ color: theme.star, opacity: 0.5 }} />
          <span className="text-[8px] font-bold uppercase tracking-widest text-white/30">
            {location ? `${location.latitude.toFixed(2)}°, ${location.longitude.toFixed(2)}°` : "—"}
          </span>
        </div>
        <div className="hidden md:block">
          <HijriPill />
        </div>
      </div>

      {/* Right side: Theme + Prayer Clock */}
      <div className="flex items-center gap-2.5">
        <ThemePicker />
        <PrayerClock />
      </div>
    </div>
  );
};

// ── Layout ───────────────────────────────────────────────────────────
export const Layout: React.FC = () => {
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] ?? "Noor";

  useEffect(() => {
    document.title = location.pathname === "/"
      ? "Noor: Islamic Daily Companion"
      : `${title} — Noor`;
  }, [title, location.pathname]);

  return (
    <div className="min-h-screen text-white font-sans selection:bg-white/30">
      <DynamicBackground />

      <main className="container mx-auto px-4 pt-4 pb-32 max-w-7xl">
        <TopBar title={title} />
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32 }}
        >
          <Outlet />
        </motion.div>
      </main>

      <Navigation />
    </div>
  );
};
