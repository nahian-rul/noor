import React from "react";
import { useWaqt } from "../WaqtContext";
import { motion } from "motion/react";
import { Clock, MapPin, Bell, BellOff } from "lucide-react";
import { format } from "date-fns";

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
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-4xl font-serif italic">Prayer Times</h1>
        <p className="text-white/60 text-sm">Stay connected with your daily prayers.</p>
      </header>

      <div className="space-y-4">
        {times.map((item, idx) => {
          const isActive = waqt === item.name;
          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`p-6 rounded-3xl border transition-all flex items-center justify-between ${
                isActive
                  ? "bg-white text-black border-white shadow-2xl scale-105"
                  : "bg-white/10 text-white border-white/10 backdrop-blur-xl"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isActive ? "bg-black/10" : "bg-white/5"}`}>
                  <Clock className={`w-5 h-5 ${isActive ? "text-black" : "text-white/40"}`} />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{item.name}</h3>
                  {isActive && <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Current Prayer</p>}
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-mono font-bold">{format(item.time, "hh:mm a")}</p>
                <button className={`mt-2 p-1 rounded-full ${isActive ? "text-black/40" : "text-white/20"}`}>
                  <Bell className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
