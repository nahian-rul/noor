import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from "react";

export interface CustomTasbihStep {
  name: string;
  target: number;
}

export interface CustomTasbih {
  id: string;
  name: string;
  steps: CustomTasbihStep[];
  currentStepIndex: number;
  currentCount: number;
  totalCycles: number;
}

export interface PredefinedDua {
  name: string;
  transliteration?: string;
  meaning?: string;
  target: number;
}

export interface PredefinedSet {
  id: string;
  name: string;
  description: string;
  purpose?: string;
  tag?: string; // BES Tag
  duas: PredefinedDua[];
}

export interface PredefinedProgress {
  setId: string;
  duaIndex: number;
  currentCount: number;
  totalCycles: number;
}

export interface DhikrBadge {
  id: string;
  type: "dhikr";
  title: string;
  subtitle: string;
  target: number;
  unlocked: boolean;
  popupShown: boolean;
}

interface TasbihContextType {
  customSets: CustomTasbih[];
  predefinedProgress: Record<string, PredefinedProgress>;
  totalTasbihCount: number;
  dailyTasbihCount: number;
  tasbihBadges: DhikrBadge[];
  addCustomSet: (name: string, steps: CustomTasbihStep[]) => string;
  updateCustomProgress: (id: string, progress: Partial<Omit<CustomTasbih, 'id' | 'name' | 'steps'>>) => void;
  deleteCustomSet: (id: string) => void;
  updatePredefinedProgress: (setId: string, progress: Partial<PredefinedProgress>) => void;
  resetPredefinedProgress: (setId: string) => void;
  incrementTotalCount: (amount?: number) => void;
  markBadgePopupShown: (id: string) => void;
  exportData: () => void;
  importData: (json: string) => boolean;
}

export const DHIKR_MILESTONES: Omit<DhikrBadge, 'unlocked' | 'popupShown'>[] = [
  { id: "tasbih-100",  title: "Beginner in Dhikr", target: 100, subtitle: "First 100 Tasbih completed", type: "dhikr" },
  { id: "tasbih-500",  title: "Consistent in Dhikr", target: 500, subtitle: "500 Tasbih completed", type: "dhikr" },
  { id: "tasbih-1000", title: "Zikrullah Kathira", target: 1000, subtitle: "1000 Tasbih completed", type: "dhikr" },
  { id: "tasbih-5000", title: "Heart Engaged", target: 5000, subtitle: "5000 Tasbih completed", type: "dhikr" },
];

export const QUICK_DHIKRS = [
  "Subhanallah", "Alhamdulillah", "Allahu Akbar", "Astaghfirullah", "La ilaha illallah",
  "Subhanallahi wa bihamdihi", "La hawla wala quwwata illa billah", "Hasbunallahu wa ni'mal wakil", "Subhanallahi al-adhim"
];

export const PREDEFINED_SETS: PredefinedSet[] = [
  {
    id: "daily-essential",
    name: "🌙 Daily Essential Dhikr",
    purpose: "Basic daily remembrance (for all users)",
    description: "Standard morning/evening and post-prayer dhikr.",
    tag: "After every Salah / Before sleeping",
    duas: [
      { name: "SubhanAllah", transliteration: "Subḥān-Allāh", target: 33 },
      { name: "Alhamdulillah", transliteration: "Al-ḥamdu lillāh", target: 33 },
      { name: "Allahu Akbar", transliteration: "Allāhu Akbar", target: 34 },
    ]
  },
  {
    id: "morning-protection",
    name: "🌅 Morning Protection Set",
    purpose: "Protection & blessings for the day",
    description: "Crucial adhkar for spiritual protection after Fajr.",
    tag: "After Fajr / Early morning",
    duas: [
      { name: "Surah Al-Ikhlas", target: 3 },
      { name: "Surah Al-Falaq", target: 3 },
      { name: "Surah An-Nas", target: 3 },
      { name: "Bismillahillazi La Yadurru...", transliteration: "Bi-smillāh-illadhī lā yaḍurru...", target: 3 },
    ]
  },
  {
    id: "evening-protection",
    name: "🌙 Evening Protection Set",
    purpose: "Protection for the night",
    description: "Seek Allah's refuge before the night descends.",
    tag: "After Maghrib / Before sleep",
    duas: [
      { name: "Ayatul Kursi", target: 1 },
      { name: "Surah Al-Ikhlas", target: 3 },
      { name: "Surah Al-Falaq", target: 3 },
      { name: "Surah An-Nas", target: 3 },
      { name: "Allahumma Bika Amsayna...", target: 1 },
    ]
  },
  {
    id: "forgiveness-set",
    name: "🤲 Forgiveness (Istighfar) Set",
    purpose: "Seeking forgiveness & purification",
    description: "Purify your heart and seek Allah's mercy.",
    tag: "Anytime (Salah / Before sleep)",
    duas: [
      { name: "Astaghfirullah", transliteration: "Astaghfir-ullāh", target: 100 },
      { name: "Sayyidul Istighfar", target: 1 },
    ]
  },
  {
    id: "rizq-gratitude",
    name: "💖 Gratitude & Rizq Set",
    purpose: "Increase blessings & sustenance",
    description: "Increase heart's contentment and invite barakah.",
    tag: "Morning / After Fajr",
    duas: [
      { name: "Alhamdulillah", target: 100 },
      { name: "Allahumma Barik Lana...", target: 3 },
      { name: "Ya Razzaq", target: 100 },
    ]
  },
  {
    id: "jannah-protection",
    name: "🕌 Jannah & Protection",
    purpose: "Ultimate success in Akhirah",
    description: "Focus on ultimate success and protection from fire.",
    tag: "After Fajr & Maghrib",
    duas: [
      { name: "Allahumma Ajirni Minan Naar", target: 7 },
      { name: "Allahumma Inni As'alukal Jannah", target: 7 },
    ]
  },
  {
    id: "stress-relief",
    name: "🧠 Stress Relief & Peace",
    purpose: "Anxiety, stress, hardship",
    description: "Calming remembrance for difficult times.",
    tag: "During stress / Night time",
    duas: [
      { name: "La ilaha illa anta, subhanaka inni kuntu minaẓ-ẓalimin", target: 40 },
      { name: "HasbiyaAllahu la ilaha illa Huwa", target: 7 },
    ]
  },
  {
    id: "quick-sunnah",
    name: "⚡ Quick Sunnah Dhikr",
    purpose: "Lightweight, fast completion",
    description: "Efficient remembrance for busy users.",
    tag: "Anytime (great for busy users)",
    duas: [
      { name: "SubhanAllahi wa bihamdihi", target: 100 },
      { name: "La ilaha illallah", target: 50 },
    ]
  }
];

const STORAGE_KEY = "noor_tasbih_data";

const TasbihContext = createContext<TasbihContextType | undefined>(undefined);

export const TasbihProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<any>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const today = new Date().toISOString().split('T')[0];
    const defaultState = {
      customSets: [],
      predefinedProgress: {},
      totalTasbihCount: 0,
      dailyTasbihCount: 0,
      lastUpdated: today,
      popupShownBadgeIds: []
    };

    if (saved) {
      try {
        const d = JSON.parse(saved);
        return {
           ...defaultState,
           ...d,
           dailyTasbihCount: d.lastUpdated !== today ? 0 : (d.dailyTasbihCount || 0),
           lastUpdated: today
        };
      } catch (e) {
        console.error("Failed to load tasbih data", e);
      }
    }
    return defaultState;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const tasbihBadges = useMemo(() => {
    return DHIKR_MILESTONES.map(m => {
       const unlocked = data.totalTasbihCount >= m.target;
       return { ...m, unlocked, popupShown: data.popupShownBadgeIds?.includes(m.id) || false };
    });
  }, [data.totalTasbihCount, data.popupShownBadgeIds]);

  const addCustomSet = (name: string, steps: CustomTasbihStep[]) => {
    const id = Date.now().toString();
    setData((prev: any) => ({
       ...prev,
       customSets: [...prev.customSets, { id, name, steps, currentStepIndex: 0, currentCount: 0, totalCycles: 0 }]
    }));
    return id;
  };

  const updateCustomProgress = (id: string, progress: Partial<CustomTasbih>) => {
    setData((prev: any) => ({
       ...prev,
       customSets: prev.customSets.map((s: any) => s.id === id ? { ...s, ...progress } : s)
    }));
  };

  const deleteCustomSet = (id: string) => {
    setData((prev: any) => ({
       ...prev,
       customSets: prev.customSets.filter((s: any) => s.id !== id)
    }));
  };

  const updatePredefinedProgress = (setId: string, progress: Partial<PredefinedProgress>) => {
    setData((prev: any) => ({
       ...prev,
       predefinedProgress: {
          ...prev.predefinedProgress,
          [setId]: { setId, duaIndex: 0, currentCount: 0, totalCycles: 0, ...prev.predefinedProgress[setId], ...progress }
       }
    }));
  };

  const resetPredefinedProgress = (setId: string) => {
    setData((prev: any) => {
       const next = { ...prev };
       delete next.predefinedProgress[setId];
       return next;
    });
  };

  const incrementTotalCount = (amount: number = 1) => {
    setData((prev: any) => ({
       ...prev,
       totalTasbihCount: prev.totalTasbihCount + amount,
       dailyTasbihCount: prev.dailyTasbihCount + amount
    }));
  };

  const markBadgePopupShown = (id: string) => {
    setData((prev: any) => ({
      ...prev,
      popupShownBadgeIds: prev.popupShownBadgeIds?.includes(id) ? prev.popupShownBadgeIds : [...(prev.popupShownBadgeIds || []), id]
    }));
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `noor_tasbih_${data.lastUpdated}.json`; a.click();
  };

  const importData = (json: string) => {
    try {
      const d = JSON.parse(json);
      setData(d); return true;
    } catch (e) { return false; }
  };

  return (
    <TasbihContext.Provider value={{ 
      ...data, tasbihBadges,
      addCustomSet, updateCustomProgress, deleteCustomSet,
      updatePredefinedProgress, resetPredefinedProgress, incrementTotalCount,
      markBadgePopupShown, exportData, importData
    }}>
      {children}
    </TasbihContext.Provider>
  );
};

export const useTasbih = () => {
  const context = useContext(TasbihContext);
  if (!context) throw new Error("useTasbih must be used within a TasbihProvider");
  return context;
};
