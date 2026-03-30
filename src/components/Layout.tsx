import React, { useRef, useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Navigation } from "./Navigation";
import { DynamicBackground } from "./DynamicBackground";
import { motion, AnimatePresence } from "motion/react";
import { useWaqt } from "../WaqtContext";
import { formatDistanceToNowStrict } from "date-fns";
import { Clock, X, Palette, Check } from "lucide-react";
import { useTheme, THEMES, type ThemeId } from "../contexts/ThemeContext";

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

// ── Theme Picker Panel ───────────────────────────────────────────────
const ThemePicker: React.FC = () => {
  const { themeId, setThemeId } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-2 px-3 py-2 rounded-full border text-[9px] font-black uppercase tracking-widest transition-all ${
          themeId !== "auto"
            ? "bg-white/15 border-white/20 text-white"
            : "bg-white/5 border-white/10 text-white/50 hover:text-white hover:bg-white/10"
        }`}
        title="Choose Theme"
      >
        <Palette className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{THEMES[themeId].emoji} {THEMES[themeId].name}</span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
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
                {(Object.values(THEMES)).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => { setThemeId(t.id as ThemeId); setOpen(false); }}
                    className={`relative flex items-center gap-3 p-4 rounded-2xl border text-left transition-all overflow-hidden group ${
                      themeId === t.id
                        ? "border-white/30 bg-white/10"
                        : "border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/15"
                    }`}
                  >
                    {/* Color preview dot from theme */}
                    <div
                      className="w-8 h-8 rounded-xl shrink-0 border border-white/10"
                      style={{
                        background: `linear-gradient(135deg, ${t.gradientFrom}, ${t.gradientTo})`,
                        boxShadow: `0 0 10px ${t.accent}44`,
                      }}
                    />
                    <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-wider text-white/80 truncate">{t.emoji} {t.name}</p>
                    </div>
                    {themeId === t.id && (
                      <Check className="w-3.5 h-3.5 text-white/60 absolute top-3 right-3" />
                    )}
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

// ── Draggable Prayer Widget ──────────────────────────────────────────
type Corner = "tl" | "tr" | "bl" | "br";
const snapPositions: Record<Corner, string> = {
  tl: "top-4 left-4",
  tr: "top-4 right-4",
  bl: "bottom-24 left-4",
  br: "bottom-24 right-4",
};

const DraggablePrayerWidget: React.FC = () => {
  const { nextPrayer } = useWaqt();
  const [corner, setCorner]       = useState<Corner>("tr");
  const [minimized, setMinimized] = useState(false);
  const [countdown, setCountdown] = useState("");
  const isDragging = useRef(false);
  const pointerStart = useRef({ x: 0, y: 0 });
  const widgetRef = useRef<HTMLDivElement>(null);

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

  // Pointer-based drag (works on touch too)
  const onPointerDown = (e: React.PointerEvent) => {
    isDragging.current = false;
    pointerStart.current = { x: e.clientX, y: e.clientY };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const dx = Math.abs(e.clientX - pointerStart.current.x);
    const dy = Math.abs(e.clientY - pointerStart.current.y);
    if (dx > 4 || dy > 4) isDragging.current = true;
    if (!isDragging.current) return;

    const W = window.innerWidth, H = window.innerHeight;
    const x = e.clientX, y = e.clientY;
    const corners: { key: Corner; cx: number; cy: number }[] = [
      { key: "tl", cx: 80,     cy: 40 },
      { key: "tr", cx: W - 80, cy: 40 },
      { key: "bl", cx: 80,     cy: H - 100 },
      { key: "br", cx: W - 80, cy: H - 100 },
    ];
    let nearest: Corner = "tr";
    let minDist = Infinity;
    corners.forEach(({ key, cx, cy }) => {
      const d = Math.hypot(cx - x, cy - y);
      if (d < minDist) { minDist = d; nearest = key; }
    });
    setCorner(nearest);
  };
  const onPointerUp = () => { isDragging.current = false; };

  return (
    <div
      ref={widgetRef}
      className={`fixed z-[200] ${snapPositions[corner]} select-none touch-none`}
      style={{ cursor: isDragging.current ? "grabbing" : "grab" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      <AnimatePresence mode="wait">
        {minimized ? (
          <motion.button
            key="mini"
            initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
            onClick={() => { if (!isDragging.current) setMinimized(false); }}
            className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-2xl border border-white/20 flex items-center justify-center shadow-xl"
          >
            <Clock className="w-4 h-4 text-amber-400" />
          </motion.button>
        ) : (
          <motion.div
            key="full"
            initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}
            className="flex items-center gap-2.5 px-4 py-2.5 bg-black/55 backdrop-blur-2xl border border-white/15 rounded-full shadow-xl"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
            <div className="flex flex-col leading-none">
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/40">{nextPrayer?.name ?? "—"}</span>
              <span className="text-[11px] font-black text-amber-400 font-mono">{countdown}</span>
            </div>
            <button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => setMinimized(true)}
              className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/25 transition-all ml-1"
            >
              <X className="w-2.5 h-2.5 text-white/50" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Top Bar ──────────────────────────────────────────────────────────
const TopBar: React.FC<{ title: string }> = ({ title }) => (
  <div className="flex items-center justify-between mb-8 pt-2">
    <motion.p
      key={title}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20"
    >
      {title}
    </motion.p>
    <ThemePicker />
  </div>
);

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
      <DraggablePrayerWidget />

      <main className="container mx-auto px-4 pt-6 pb-32 max-w-7xl">
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
