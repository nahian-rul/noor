import React from "react";
import { useWaqt } from "../WaqtContext";
import { motion } from "motion/react";
import { 
  Sunrise, 
  Sun, 
  CloudSun, 
  Sunset, 
  MoonStar, 
  Clock, 
  Bell, 
  Sparkles 
} from "lucide-react";
import { format } from "date-fns";

const WAQT_THEMES: Record<string, { icon: any; color: string; gradient: string }> = {
  Fajr: { 
    icon: Sunrise, 
    color: "text-sky-400", 
    gradient: "from-sky-900/60 via-sky-800/40 to-sky-950/80" 
  },
  Sunrise: { 
    icon: Sun, 
    color: "text-amber-400", 
    gradient: "from-amber-600/40 via-amber-500/30 to-amber-800/40" 
  },
  Dhuhr: { 
    icon: Sun, 
    color: "text-sky-200", 
    gradient: "from-sky-500/40 via-sky-400/20 to-sky-600/40" 
  },
  Asr: { 
    icon: CloudSun, 
    color: "text-orange-400", 
    gradient: "from-orange-600/40 via-orange-500/30 to-orange-800/40" 
  },
  Maghrib: { 
    icon: Sunset, 
    color: "text-rose-400", 
    gradient: "from-rose-700/60 via-orange-600/40 to-rose-900/80" 
  },
  Isha: { 
    icon: MoonStar, 
    color: "text-indigo-400", 
    gradient: "from-indigo-950/80 via-indigo-900/60 to-slate-950/90" 
  },
};

export const PrayerTimes: React.FC = () => {
  const { prayerTimes, waqt } = useWaqt();

  if (!prayerTimes) return null;

  const times = [
    { name: "Fajr", time: prayerTimes.fajr },
    { name: "Sunrise", time: prayerTimes.sunrise },
    { name: "Dhuhr", time: prayerTimes.dhuhr },
    { name: "Asr", time: prayerTimes.asr },
    { name: "Maghrib", time: prayerTimes.maghrib },
    { name: "Isha", time: prayerTimes.isha },
  ];

  return (
    <div className="space-y-12 pb-32">
      <header className="space-y-3">
        <h1 className="text-5xl font-serif italic tracking-tight bg-gradient-to-br from-white to-white/40 bg-clip-text text-transparent">Prayer Schedule</h1>
        <p className="text-white/30 text-[11px] font-black uppercase tracking-[0.3em] leading-relaxed max-w-2xl">
          Align your day with the divine rhythm of prayer.
        </p>
      </header>

      <div className="space-y-6">
        {times.map((item, idx) => {
          const isActive = waqt === item.name;
          const theme = WAQT_THEMES[item.name] || { icon: Clock, color: "text-white/40", gradient: "from-white/5 to-white/5" };
          const Icon = theme.icon;

          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ x: 4 }}
              className={`p-10 rounded-[2.5rem] border transition-all duration-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative overflow-hidden group ${
                isActive
                  ? `bg-gradient-to-r ${theme.gradient} border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.3)] scale-[1.02] z-10`
                  : "bg-white/[0.03] text-white border-white/5 backdrop-blur-3xl hover:bg-white/[0.08]"
              }`}
            >
              {/* Background Glow */}
              {isActive && (
                 <motion.div 
                   animate={{ opacity: [0.1, 0.2, 0.1] }} 
                   transition={{ repeat: Infinity, duration: 4 }}
                   className="absolute inset-0 bg-white/5 blur-3xl pointer-events-none"
                 />
              )}

              <div className="flex items-center gap-8 relative z-10 w-full md:w-auto">
                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center transition-all duration-1000 ${
                  isActive ? "bg-white text-black shadow-2xl rotate-[360deg] scale-110" : `bg-white/5 ${theme.color} group-hover:bg-white/10`
                }`}>
                  <Icon className={`w-8 h-8 md:w-10 md:h-10 ${isActive ? "text-current" : "text-current opacity-60"}`} />
                </div>
                <div className="space-y-1.5 flex-1">
                  <h3 className={`text-3xl md:text-4xl font-serif italic transition-all duration-500 ${isActive ? "text-white font-bold" : "text-white/90"}`}>
                    {item.name}
                  </h3>
                  {isActive && (
                    <motion.p 
                      animate={{ opacity: [0.4, 1, 0.4] }} 
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 flex items-center gap-2"
                    >
                      <Sparkles className="w-3 h-3 fill-current" /> Currently In-Session
                    </motion.p>
                  )}
                  {!isActive && (
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/15">Mandatory Prayer</p>
                  )}
                </div>
              </div>

              <div className="text-left md:text-right relative z-10 w-full md:w-auto border-t md:border-t-0 border-white/5 pt-6 md:pt-0">
                <p className={`text-4xl md:text-6xl font-mono font-black tracking-tighter transition-all duration-700 ${isActive ? "text-white drop-shadow-2xl" : "text-white/40"}`}>
                  {format(item.time, "hh:mm")}
                  <span className="text-xl md:text-2xl opacity-40 ml-2">{format(item.time, "a")}</span>
                </p>
                <div className="flex items-center md:justify-end gap-6 mt-4">
                   <button className={`p-3 rounded-2xl transition-all ${isActive ? "bg-white/10 text-white" : "text-white/20 hover:bg-white/5 hover:text-white/40"}`}>
                      <Bell className="w-5 h-5" />
                   </button>
                   <div className={`h-1 w-12 rounded-full overflow-hidden ${isActive ? "bg-white/20" : "bg-white/5"}`}>
                      <motion.div 
                        initial={{ x: -100 }} 
                        animate={{ x: 100 }} 
                        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                        className="h-full w-1/3 bg-white" 
                      />
                   </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
