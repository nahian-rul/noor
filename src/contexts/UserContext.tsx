import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from "react";

export type JourneyStage = "Seeker" | "Learner" | "Practitioner" | "Devoted";

export interface LearningBadge {
  id: string;
  type: "learning";
  title: string;
  subtitle: string;
  target: number;
  metric: "surahs" | "duas" | "points";
  unlocked: boolean;
  popupShown: boolean;
}

interface UserState {
  points: number;
  streak: number;
  lastActive: string; // ISO date string (YYYY-MM-DD)
  completedSurahs: string[];
  completedDuas: string[];
  completedNames: string[];
  unlockedBadgeIds: string[];
  popupShownBadgeIds: string[];
  quizHistory: QuizAttempt[];
}

export interface QuizAttempt {
  id: string;
  date: string;
  score: number;
  total: number;
  difficulty: string;
  pointsEarned: number;
}

interface UserContextType extends UserState {
  addPoints: (amount: number) => void;
  markSurahCompleted: (id: string) => void;
  markDuaLearned: (id: string) => void;
  markNameLearned: (id: string) => void;
  markBadgePopupShown: (id: string) => void;
  getJourneyStage: () => JourneyStage;
  learningBadges: LearningBadge[];
  toast: { message: string; sub: string } | null;
  setToast: (toast: { message: string; sub: string } | null) => void;
  clearToast: () => void;
  saveQuizResult: (attempt: Omit<QuizAttempt, 'id' | 'date'>) => void;
  exportJourney: () => void;
  importJourney: (json: string) => boolean;
  showGoalsModal: boolean;
  setShowGoalsModal: (val: boolean) => void;
}

const STORAGE_KEY = "noor_user_data";

export const LEARNING_MILESTONES: Omit<LearningBadge, 'unlocked' | 'popupShown'>[] = [
  { id: "seeker", title: "Seeker", subtitle: "First 5 Surahs completed", target: 5, metric: "surahs", type: "learning" },
  { id: "supplicant", title: "Supplicant", subtitle: "First 10 Duas learned", target: 10, metric: "duas", type: "learning" },
  { id: "devout", title: "Devout", subtitle: "Reached 1000 progress points", target: 1000, metric: "points", type: "learning" },
];

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<UserState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const d = JSON.parse(saved);
        return {
           points: 0, streak: 0, lastActive: "", 
           completedSurahs: [], completedDuas: [], completedNames: [],
           unlockedBadgeIds: [], popupShownBadgeIds: [],
           quizHistory: [],
           ...d
        };
      } catch (e) { console.error("Failed to parse user data", e); }
    }
    return {
      points: 0, streak: 0, lastActive: "",
      completedSurahs: [], completedDuas: [], completedNames: [],
      unlockedBadgeIds: [], popupShownBadgeIds: [],
      quizHistory: [],
    };
  });

  const [toast, setToast] = useState<{ message: string; sub: string } | null>(null);
  const [showGoalsModal, setShowGoalsModal] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const learningBadges = useMemo(() => {
    return LEARNING_MILESTONES.map(m => {
       let current = 0;
       if (m.metric === "surahs") current = state.completedSurahs.length;
       else if (m.metric === "duas") current = state.completedDuas.length;
       else if (m.metric === "points") current = state.points;
       
       const unlocked = current >= m.target;
       return { ...m, unlocked, popupShown: state.popupShownBadgeIds.includes(m.id) };
    });
  }, [state.completedSurahs.length, state.completedDuas.length, state.points, state.popupShownBadgeIds]);

  const addPoints = (amount: number) => {
    setState(prev => {
      const today = new Date().toISOString().split("T")[0];
      let newStreak = prev.streak;
      if (prev.lastActive !== today || prev.streak === 0) newStreak += 1;
      return { ...prev, points: prev.points + amount, streak: newStreak, lastActive: today };
    });
  };

  const markSurahCompleted = (id: string) => {
    if (state.completedSurahs.includes(id)) return;
    setState(prev => ({ ...prev, completedSurahs: [...prev.completedSurahs, id] }));
    addPoints(20);
    setToast({ message: "+20 Progress", sub: "MashaAllah" });
  };

  const markDuaLearned = (id: string) => {
    if (state.completedDuas.includes(id)) return;
    setState(prev => ({ ...prev, completedDuas: [...prev.completedDuas, id] }));
    addPoints(10);
    setToast({ message: "+10 Progress", sub: "MashaAllah" });
  };

  const markNameLearned = (id: string) => {
    if (state.completedNames.includes(id)) return;
    setState(prev => ({ ...prev, completedNames: [...prev.completedNames, id] }));
    addPoints(5);
    setToast({ message: "+5 Progress", sub: "MashaAllah" });
  };

  const markBadgePopupShown = (id: string) => {
    setState(prev => ({
       ...prev,
       popupShownBadgeIds: prev.popupShownBadgeIds.includes(id) ? prev.popupShownBadgeIds : [...prev.popupShownBadgeIds, id]
    }));
  };

  const getJourneyStage = (): JourneyStage => {
    const p = state.points;
    if (p < 100) return "Seeker";
    if (p < 500) return "Learner";
    if (p < 1500) return "Practitioner";
    return "Devoted";
  };

  const clearToast = () => setToast(null);
  const saveQuizResult = (attempt: Omit<QuizAttempt, 'id' | 'date'>) => {
    const newAttempt: QuizAttempt = {
      ...attempt,
      id: Math.random().toString(36).substring(2, 9),
      date: new Date().toISOString(),
    };
    setState(prev => ({
      ...prev,
      quizHistory: [newAttempt, ...prev.quizHistory].slice(0, 50), // Keep last 50
    }));
  };


  const exportJourney = () => {
    const backup = {
      version: "1.0",
      timestamp: new Date().toISOString(),
      data: {
        noor_user_data: JSON.parse(localStorage.getItem("noor_user_data") || "{}"),
        noor_salah_data: JSON.parse(localStorage.getItem("noor_salah_data") || "{}"),
        noor_tasbih_data: JSON.parse(localStorage.getItem("noor_tasbih_data") || "{}"),
        noor_adhan_settings: JSON.parse(localStorage.getItem("noor_adhan_settings") || "{}"),
        noor_location_data: JSON.parse(localStorage.getItem("noor_location_data") || "{}"),
      }
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `noor_journey_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const importJourney = (json: string): boolean => {
    try {
      const backup = JSON.parse(json);
      const data = backup.data || backup; // Handle both direct and wrapped formats
      
      if (data.noor_user_data) localStorage.setItem("noor_user_data", JSON.stringify(data.noor_user_data));
      if (data.noor_salah_data) localStorage.setItem("noor_salah_data", JSON.stringify(data.noor_salah_data));
      if (data.noor_tasbih_data) localStorage.setItem("noor_tasbih_data", JSON.stringify(data.noor_tasbih_data));
      if (data.noor_adhan_settings) localStorage.setItem("noor_adhan_settings", JSON.stringify(data.noor_adhan_settings));
      if (data.noor_location_data) localStorage.setItem("noor_location_data", JSON.stringify(data.noor_location_data));
      
      window.location.reload();
      return true;
    } catch (e) {
      console.error("Failed to import journey", e);
      return false;
    }
  };

  return (
    <UserContext.Provider value={{ 
      ...state, addPoints, markSurahCompleted, markDuaLearned, markNameLearned, markBadgePopupShown,
      getJourneyStage, learningBadges, toast, setToast, clearToast, saveQuizResult, 
      exportJourney, importJourney, showGoalsModal, setShowGoalsModal
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) throw new Error("useUser must be used within a UserProvider");
  return context;
};
