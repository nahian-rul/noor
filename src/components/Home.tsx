import React, { useState, useEffect } from "react";
import { useWaqt } from "../WaqtContext";
import quotesData from "../data/quotes";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronRight, Heart, Book, Calculator,
  Star, X, ChevronLeft
} from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { toHijri, isRamadan } from "../lib/hijri";

const allQuotes = quotesData as any[];

// ── Waqt visual config ───────────────────────────────────────────────
const WAQT_CONFIG: Record<string, {
  emoji: string; sub: string;
  gradient: string; accent: string;
}> = {
  Fajr:    { emoji: "🌙", sub: "Dawn — Time of Renewal",           gradient: "from-[#0a0f2e] to-[#1a2a6c]", accent: "#a5b4fc" },
  Sunrise: { emoji: "🌅", sub: "Sunrise — Barakah of Morning",      gradient: "from-[#7c3a00] to-[#c47c00]", accent: "#fde68a" },
  Dhuhr:   { emoji: "☀️",  sub: "Midday — Abundant Light",          gradient: "from-[#023e6e] to-[#0369a1]", accent: "#bae6fd" },
  Asr:     { emoji: "🌤️", sub: "Afternoon — Reflect & Gratitude",  gradient: "from-[#7c2d00] to-[#b45309]", accent: "#fed7aa" },
  Maghrib: { emoji: "🌇", sub: "Sunset — Gratitude for the Day",   gradient: "from-[#3b0764] to-[#7c3aed]", accent: "#ddd6fe" },
  Isha:    { emoji: "🌃", sub: "Night — Peace & Rest",             gradient: "from-[#020b18] to-[#0f172a]", accent: "#93c5fd" },
  Night:   { emoji: "🌃", sub: "Night — Peace & Rest",             gradient: "from-[#020b18] to-[#0f172a]", accent: "#93c5fd" },
};

// Random animation variants per prayer card
const CARD_ANIMS = [
  { initial: { rotateY: -90, opacity: 0 },    animate: { rotateY: 0, opacity: 1 },    transition: { type: "spring", damping: 16 } },
  { initial: { scale: 0, rotate: -180 },       animate: { scale: 1, rotate: 0 },       transition: { type: "spring", stiffness: 200, damping: 18 } },
  { initial: { y: -80, opacity: 0 },           animate: { y: 0, opacity: 1 },          transition: { type: "spring", stiffness: 280, damping: 20 } },
  { initial: { x: -100, opacity: 0 },          animate: { x: 0, opacity: 1 },          transition: { type: "spring", stiffness: 240, damping: 22 } },
  { initial: { scale: 1.6, opacity: 0 },       animate: { scale: 1, opacity: 1 },      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
];

const PRAYER_NAMES = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;

// ── Moods ─────────────────────────────────────────────────────────────
const MOODS = [
  { key: "sad",       label: "Sad",       icon: "😔", color: "bg-blue-400/10 border-blue-400/20 text-blue-300",      desc: "Find comfort",     categoryId: 3 },
  { key: "lost",      label: "Lost",      icon: "🧭", color: "bg-purple-400/10 border-purple-400/20 text-purple-300", desc: "Seek guidance",    categoryId: 2 },
  { key: "motivated", label: "Motivated", icon: "🔥", color: "bg-orange-400/10 border-orange-400/20 text-orange-300", desc: "Stay driven",      categoryId: 1 },
  { key: "grateful",  label: "Grateful",  icon: "🤲", color: "bg-emerald-400/10 border-emerald-400/20 text-emerald-300", desc: "Count blessings", categoryId: 2 },
];

// ── Mood Quotes Modal ────────────────────────────────────────────────
const MoodModal: React.FC<{
  mood: typeof MOODS[0];
  onClose: () => void;
}> = ({ mood, onClose }) => {
  const quotes = allQuotes.filter(q => q.category_id === mood.categoryId);
  const [idx, setIdx] = useState(0);
  const quote = quotes[idx] || allQuotes[0];

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-md" />
      <motion.div
        initial={{ scale: 0.88, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 12 }}
        transition={{ type: "spring", damping: 22, stiffness: 260 }}
        className="relative w-full max-w-lg bg-[#0e0e18] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
      >
        <div className="px-8 pt-8 pb-5 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{mood.icon}</span>
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30">Feeling {mood.label}</p>
              <p className="text-[11px] text-white/20 font-medium">{mood.desc}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-all">
            <X className="w-4 h-4 text-white/40" />
          </button>
        </div>

        <div className="p-8 min-h-[200px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div key={idx} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="space-y-4">
              <p className="text-2xl md:text-3xl font-serif italic leading-relaxed text-white/90">"{quote.quote}"</p>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400/60">— {quote.reference}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="px-8 pb-8 flex items-center justify-between gap-4">
          <button onClick={() => setIdx(i => Math.max(0, i - 1))} disabled={idx === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/40 hover:bg-white/10 disabled:opacity-20 transition-all">
            <ChevronLeft className="w-3.5 h-3.5" /> Prev
          </button>
          <span className="text-[9px] font-bold text-white/20">{idx + 1} / {quotes.length}</span>
          <button onClick={() => setIdx(i => Math.min(quotes.length - 1, i + 1))} disabled={idx === quotes.length - 1}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-amber-400 disabled:opacity-30 transition-all">
            Next <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// ── Full Schedule Modal ──────────────────────────────────────────────
const ScheduleModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { prayerTimes, nextPrayer } = useWaqt();

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
        transition={{ type: "spring", damping: 24, stiffness: 280 }}
        className="relative w-full max-w-2xl bg-[#0c0c16] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl"
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

        {/* 5 prayer cards — no click action, pure display */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          {prayers.map((p, i) => {
            const cfg = WAQT_CONFIG[p.name] ?? WAQT_CONFIG.Fajr;
            const anim = CARD_ANIMS[i % CARD_ANIMS.length];
            const isNext = p.name === nextPrayer?.name;
            return (
              <motion.div
                key={p.name}
                {...anim}
                className={`relative flex flex-col items-center gap-3 p-5 rounded-3xl border overflow-hidden ${
                  isNext
                    ? "border-amber-400/40 bg-amber-400/5"
                    : "border-white/10 bg-white/5"
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${cfg.gradient} opacity-25 pointer-events-none`} />
                <span className="text-4xl relative z-10">{cfg.emoji}</span>
                <div className="relative z-10 text-center">
                  <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${isNext ? "text-amber-400" : "text-white/60"}`}>
                    {p.name}
                  </p>
                  <p className="text-sm font-mono font-bold text-white/90 mt-1">
                    {formatTime(p.time)}
                  </p>
                </div>
                {isNext && (
                  <div className="relative z-10 w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                )}
                <p className="text-[8px] text-white/25 font-medium text-center relative z-10 leading-tight hidden sm:block">
                  {cfg.sub.split("—")[1]?.trim()}
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

// ── Home Page ─────────────────────────────────────────────────────────
export const Home: React.FC = () => {
  const { waqt, nextPrayer, prayerTimes, location: userLocation } = useWaqt();
  const cfg = WAQT_CONFIG[waqt] ?? WAQT_CONFIG.Night;

  const [dailyQuote, setDailyQuote] = useState(allQuotes[0]);
  const [activeMood, setActiveMood] = useState<typeof MOODS[0] | null>(null);
  const [showSchedule, setShowSchedule] = useState(false);

  useEffect(() => {
    const idx = Math.floor(Math.random() * allQuotes.length);
    setDailyQuote(allQuotes[idx]);
  }, [waqt]);

  const formatTime = (d: Date | null | undefined) =>
    d ? format(d as Date, "h:mm a") : "--:--";

  return (
    <div className="space-y-8 pb-10">

      {/* ── Daily Quote ── */}
      <section className="relative text-center py-14 px-8 bg-white/[0.03] backdrop-blur-3xl rounded-[3rem] border border-white/5 overflow-hidden">
        <div className="absolute -top-10 -left-10 text-[10rem] opacity-[0.06] pointer-events-none select-none">{cfg.emoji}</div>
        <AnimatePresence mode="wait">
          <motion.div key={dailyQuote.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="relative space-y-5">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="w-8 h-[1px] bg-white/10" />
              <span className="px-4 py-1 rounded-full bg-white/5 text-[9px] uppercase tracking-[0.3em] font-black text-white/30 border border-white/10">
                Daily Reflection
              </span>
              <span className="w-8 h-[1px] bg-white/10" />
            </div>
            <h2 className="text-2xl md:text-4xl font-serif italic leading-[1.5] text-white/90 max-w-3xl mx-auto">
              "{dailyQuote.quote}"
            </h2>
            <p className="text-sm font-bold text-amber-400/60 uppercase tracking-[0.2em]">— {dailyQuote.reference}</p>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ── Prayer Card + Mood row ── */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Upcoming Waqt Card — clicking opens schedule, no dua modal */}
        <div className={`relative overflow-hidden p-8 bg-gradient-to-br ${cfg.gradient} rounded-[2.5rem] border border-white/10 shadow-xl group`}>
          <div className="absolute -right-8 -top-8 text-[9rem] opacity-[0.08] pointer-events-none select-none group-hover:scale-110 transition-all duration-700">
            {cfg.emoji}
          </div>
          <div className="absolute inset-0 bg-black/30 rounded-[2.5rem] pointer-events-none" />

          <div className="relative flex items-stretch justify-between gap-4 h-full">
            {/* Left column: Name + Schedule button */}
            <div className="flex flex-col justify-between">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">Upcoming Prayer</p>
                <h2 className="text-4xl font-black font-serif italic text-white mt-1">
                  {nextPrayer?.name ?? waqt}
                </h2>
              </div>
              <button
                onClick={() => setShowSchedule(true)}
                className="self-start flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white transition-all mt-4"
              >
                Full Schedule <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Right column: Time + Sub */}
            <div className="flex flex-col items-end justify-start">
              <div className="text-right">
                <p className="text-2xl font-mono font-black" style={{ color: cfg.accent }}>
                  {formatTime(nextPrayer?.time)}
                </p>
                <p className="text-xs text-white/40 mt-1 font-medium">{cfg.sub}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mood Selector */}
        <div className="p-8 bg-white/5 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 space-y-5">
          <div className="flex items-center justify-between">
            <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">Your Mood</p>
            <span className="text-[9px] font-bold text-amber-400/40 uppercase tracking-widest">Tap to explore</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {MOODS.map((mood) => (
              <button
                key={mood.key}
                onClick={() => setActiveMood(mood)}
                className={`flex items-center gap-3 p-4 rounded-3xl border transition-all group/m hover:scale-[1.03] active:scale-95 text-left ${mood.color}`}
              >
                <span className="text-2xl group-hover/m:scale-110 transition-transform">{mood.icon}</span>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest">{mood.label}</p>
                  <p className="text-[8px] opacity-50 font-medium mt-0.5">{mood.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quick Access ── */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {[
          { label: "Holy Quran",    icon: Book,       color: "bg-emerald-400/10 border-emerald-400/15", text: "text-emerald-400", path: "/quran" },
          { label: "Supplications", icon: Heart,      color: "bg-rose-400/10 border-rose-400/15",      text: "text-rose-400",    path: "/duas"  },
          { label: "Zakat & Fitra", icon: Calculator, color: "bg-blue-400/10 border-blue-400/15",      text: "text-blue-400",    path: "/tools" },
          { label: "99 Names",      icon: Star,       color: "bg-amber-400/10 border-amber-400/15",    text: "text-amber-400",   path: "/names" },
        ].map((card) => (
          <Link
            key={card.label}
            to={card.path}
            className="p-6 bg-white/5 backdrop-blur-3xl rounded-[2rem] border border-white/5 hover:bg-white/[0.08] hover:border-white/10 transition-all group flex flex-col items-center text-center"
          >
            <div className={`w-14 h-14 rounded-2xl ${card.color} border flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
              <card.icon className={`w-7 h-7 ${card.text}`} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-white/50 group-hover:text-white transition-colors leading-snug">
              {card.label}
            </p>
          </Link>
        ))}
      </section>

      {/* ── Modals ── */}
      <AnimatePresence>
        {activeMood && (
          <MoodModal key="mood" mood={activeMood} onClose={() => setActiveMood(null)} />
        )}
        {showSchedule && (
          <ScheduleModal key="schedule" onClose={() => setShowSchedule(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};
