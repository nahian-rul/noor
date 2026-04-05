import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from "react";
import { format, startOfToday, addDays, subDays, isSameDay, parseISO } from "date-fns";

export type PrayerId = "fajr" | "dhuhr" | "asr" | "maghrib" | "isha";

export interface DaySalah {
  fajr: boolean;
  dhuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
}

export interface SalahBadge {
  id: string;
  type: "salah";
  title: string;
  target: number;
  metric: "count" | "streak";
  subtitle: string;
  unlocked: boolean;
  popupShown: boolean;
}

interface SalahContextType {
  salahData: Record<string, DaySalah>;
  togglePrayer: (date: Date, prayer: PrayerId) => void;
  getSalahForDate: (date: Date) => DaySalah;
  streak: number;
  fullDaysCount: number;
  salahBadges: SalahBadge[];
  markBadgePopupShown: (id: string) => void;
  completionRate: number;
  exportData: () => void;
  importData: (json: string) => boolean;
}

const STORAGE_KEY = "noor_salah_data";

const DEFAULT_DAY: DaySalah = {
  fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false
};

export const SALAH_MILESTONES: Omit<SalahBadge, 'unlocked' | 'popupShown'>[] = [
  { id: "salah-1",   title: "Salah Starter", target: 1, metric: "count", subtitle: "First full day of Salah", type: "salah" },
  { id: "salah-3",   title: "Consistent Worshipper", target: 3, metric: "count", subtitle: "3 full days of Salah", type: "salah" },
  { id: "salah-s7",  title: "Guardian of Salah", target: 7, metric: "streak", subtitle: "7 days consistency", type: "salah" },
  { id: "salah-s14", title: "Disciplined Believer", target: 14, metric: "streak", subtitle: "14 days consistency", type: "salah" },
  { id: "salah-s30", title: "Establisher of Prayer", target: 30, metric: "streak", subtitle: "30 days consistency", type: "salah" },
  { id: "salah-s60", title: "Growing in Discipline", target: 60, metric: "streak", subtitle: "2 months consistency", type: "salah" },
  { id: "salah-s90", title: "Strong in Salah", target: 90, metric: "streak", subtitle: "3 months consistency", type: "salah" },
  { id: "salah-s180", title: "Steadfast in Worship", target: 180, metric: "streak", subtitle: "6 months consistency", type: "salah" },
  { id: "salah-s365", title: "Guardian of Prayer", target: 365, metric: "streak", subtitle: "1 year consistency", type: "salah" },
];

const SalahContext = createContext<SalahContextType | undefined>(undefined);

export const SalahProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<any>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return {
           salahData: {},
           popupShownBadgeIds: [],
           ...JSON.parse(saved)
        };
      } catch (e) { console.error("Failed to parse salah data", e); }
    }
    return {
      salahData: {},
      popupShownBadgeIds: []
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const getSalahForDate = (date: Date): DaySalah => {
    const key = format(date, "yyyy-MM-dd");
    return data.salahData[key] || { ...DEFAULT_DAY };
  };

  const togglePrayer = (date: Date, prayer: PrayerId) => {
    const key = format(date, "yyyy-MM-dd");
    setData((prev: any) => {
      const currentDay = prev.salahData[key] || { ...DEFAULT_DAY };
      return { 
         ...prev, 
         salahData: { ...prev.salahData, [key]: { ...currentDay, [prayer]: !currentDay[prayer] } }
      };
    });
  };

  const isDayComplete = (key: string) => {
    const d = data.salahData[key];
    return d && d.fajr && d.dhuhr && d.asr && d.maghrib && d.isha;
  };

  const fullDaysCount = useMemo(() => {
    return Object.keys(data.salahData).filter(key => isDayComplete(key)).length;
  }, [data.salahData]);

  const streak = useMemo(() => {
    let count = 0;
    let checkDate = startOfToday();
    const isComplete = (date: Date) => isDayComplete(format(date, "yyyy-MM-dd"));
    if (!isComplete(checkDate)) checkDate = subDays(checkDate, 1);
    while (isComplete(checkDate)) {
      count++; checkDate = subDays(checkDate, 1);
      if (count > 2000) break;
    }
    return count;
  }, [data.salahData]);

  const salahBadges = useMemo(() => {
    return SALAH_MILESTONES.map(m => ({
      ...m,
      unlocked: m.metric === "count" ? fullDaysCount >= m.target : streak >= m.target,
      popupShown: data.popupShownBadgeIds?.includes(m.id) || false
    }));
  }, [fullDaysCount, streak, data.popupShownBadgeIds]);

  const markBadgePopupShown = (id: string) => {
    setData((prev: any) => ({
      ...prev,
      popupShownBadgeIds: prev.popupShownBadgeIds?.includes(id) ? prev.popupShownBadgeIds : [...(prev.popupShownBadgeIds || []), id]
    }));
  };

  const completionRate = useMemo(() => {
    let totalDone = 0;
    for (let i = 0; i < 7; i++) {
      const day = getSalahForDate(subDays(startOfToday(), i));
      if (day.fajr) totalDone++; if (day.dhuhr) totalDone++; if (day.asr) totalDone++; if (day.maghrib) totalDone++; if (day.isha) totalDone++;
    }
    return Math.round((totalDone / 35) * 100);
  }, [data.salahData]);

  const exportData = () => {
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `noor_salah_${new Date().toISOString().split('T')[0]}.json`; a.click();
  };

  const importData = (json: string) => {
    try {
      const d = JSON.parse(json);
      setData(d); return true;
    } catch (e) { return false; }
  };

  return (
    <SalahContext.Provider value={{ 
      ...data, togglePrayer, getSalahForDate, streak, fullDaysCount, 
      salahBadges, markBadgePopupShown,
      completionRate, exportData, importData 
    }}>
      {children}
    </SalahContext.Provider>
  );
};

export const useSalah = () => {
  const context = useContext(SalahContext);
  if (!context) throw new Error("useSalah must be used within a SalahProvider");
  return context;
};
