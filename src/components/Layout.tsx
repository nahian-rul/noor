import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Navigation } from "./Navigation";
import { DynamicBackground } from "./DynamicBackground";
import { motion, AnimatePresence } from "motion/react";
import { useWaqt } from "../WaqtContext";
import { formatDistanceToNowStrict } from "date-fns";
import { Clock, X, Palette, Check, MapPin, Moon } from "lucide-react";
import { useTheme, THEMES, type ThemeId } from "../contexts/ThemeContext";
import { toHijri } from "../lib/hijri";

// ── Page title map ───────────────────────────────────────────────────
const PAGE_TITLES: Record<string, string> = {
  "/":             "Home",
  "/quotes":       "Quotes",
  "/quran":        "Quran",
  "/duas":         "Duas & Adhkar",
  "/tools":        "Islamic Tools",
  "/names":        "99 Names of Allah",
  "/prayer-times": "Prayer Times",
};

// ── Theme Picker ─────────────────────────────────────────────────────
const ThemePicker: React.FC = () => {
  const { themeId, setThemeId } = useTheme();
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

// ── Prayer Clock Widget (expand/collapse, not draggable) ─────────────
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

// ── Unified Top Bar ──────────────────────────────────────────────────
const TopBar: React.FC<{ title: string }> = ({ title }) => {
  const { location } = useWaqt();
  const hijri = toHijri();

  return (
    <div className="flex items-center justify-between gap-3 mb-8 pt-2 flex-wrap">
      {/* Left side: Page title + Location + Hijri */}
      <div className="flex items-center gap-3">
        <motion.p
          key={title}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-[10px] font-black uppercase tracking-[0.4em] text-white/25"
        >
          {title}
        </motion.p>
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full">
          <MapPin className="w-3 h-3 text-amber-400/50" />
          <span className="text-[8px] font-bold uppercase tracking-widest text-white/30">
            {location ? `${location.latitude.toFixed(2)}°, ${location.longitude.toFixed(2)}°` : "—"}
          </span>
        </div>
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full">
          <Moon className="w-3 h-3 text-emerald-400/50" />
          <span className="text-[8px] font-bold tracking-widest text-white/30">
            {hijri.day} {hijri.monthName} {hijri.year}
          </span>
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
