import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback, useRef } from "react";
import { useWaqt } from "../WaqtContext";
import { format } from "date-fns";

export interface AdhanSettings {
  autoPlay: boolean;
  prayers: Record<string, {
    enabled: boolean;
    audio: string; // "default" | "azan1.mp3" | etc.
  }>;
}

interface AdhanContextType {
  lastPlayed: string | null;
  isPlaying: boolean;
  isMuted: boolean;
  setIsMuted: (val: boolean) => void;
  stopAdhan: () => void;
  playManualAdhan: (waqt: string) => void;
  playAdhanFile: (file: string) => void;
  settings: AdhanSettings;
  updateSettings: (s: AdhanSettings) => void;
}

const AdhanContext = createContext<AdhanContextType | undefined>(undefined);

export const ADHAN_MAPPING: Record<string, string> = {
  fajr: "/Adhan/azan1.mp3",
  dhuhr: "/Adhan/azan2.mp3",
  asr: "/Adhan/azan4.mp3",
  maghrib: "/Adhan/azan3.mp3",
  isha: "/Adhan/azan7.mp3",
};

const STORAGE_KEY = "noor_adhan_history";
const SETTINGS_KEY = "noor_adhan_settings";

const DEFAULT_SETTINGS: AdhanSettings = {
  autoPlay: true,
  prayers: {
    fajr: { enabled: true, audio: "default" },
    dhuhr: { enabled: true, audio: "default" },
    asr: { enabled: true, audio: "default" },
    maghrib: { enabled: true, audio: "default" },
    isha: { enabled: true, audio: "default" },
  }
};

export const AdhanProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { prayerTimes } = useWaqt();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Track played adhan for today to prevent duplicates
  // Format: "YYYY-MM-DD:prayerName"
  const [playedHistory, setPlayedHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [settings, setSettings] = useState<AdhanSettings>(() => {
    const saved = localStorage.getItem(SETTINGS_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(playedHistory));
  }, [playedHistory]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const stopAdhan = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
      setIsPlaying(false);
    }
  }, []);

  useEffect(() => {
    if (!prayerTimes || !settings.autoPlay) return;

    const interval = setInterval(() => {
      const now = new Date();
      const today = format(now, "yyyy-MM-dd");
      
      const prayers = ["fajr", "dhuhr", "asr", "maghrib", "isha"] as const;
      
      for (const p of prayers) {
        const pCfg = settings.prayers[p];
        if (!pCfg?.enabled) continue;

        const pTime = (prayerTimes as any)[p];
        if (!pTime) continue;

        // 1 minute after prayer time
        const triggerTime = new Date(pTime.getTime() + 60 * 1000);
        const diffInSeconds = (now.getTime() - triggerTime.getTime()) / 1000;

        const historyKey = `${today}:${p}`;
        
        // If within 30 seconds of the trigger time and NOT played yet
        if (diffInSeconds >= 0 && diffInSeconds < 30 && !playedHistory.includes(historyKey)) {
          playAdhan(p, historyKey);
          break; // Only play one at a time
        }
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [prayerTimes, playedHistory, settings]);

  const playAdhan = (prayer: string, key: string) => {
    const pCfg = settings.prayers[prayer];
    const url = pCfg?.audio === "default" ? ADHAN_MAPPING[prayer] : `/Adhan/${pCfg?.audio}`;
    if (!url) return;

    // Stop current if any
    stopAdhan();

    const audio = new Audio(url);
    audio.muted = isMuted;
    audioRef.current = audio;
    setIsPlaying(true);
    
    audio.play().catch(err => {
      console.warn("Autoplay blocked or audio failed", err);
      setIsPlaying(true); // Still show playing state if user can resume
    });

    audio.onended = () => {
      setIsPlaying(false);
      audioRef.current = null;
    };

    setPlayedHistory(prev => [...prev, key].slice(-10)); // Keep last 10 entries
  };

  const playManualAdhan = useCallback((waqt: string) => {
    const p = waqt.toLowerCase();
    const pCfg = settings.prayers[p];
    const url = pCfg?.audio === "default" ? ADHAN_MAPPING[p] : `/Adhan/${pCfg?.audio}`;
    if (!url) return;

    stopAdhan();

    const audio = new Audio(url);
    audio.muted = isMuted;
    audioRef.current = audio;
    setIsPlaying(true);
    
    audio.play().catch(err => {
      console.warn("Manual play blocked", err);
      setIsPlaying(false);
    });

    audio.onended = () => {
      setIsPlaying(false);
      audioRef.current = null;
    };
  }, [settings.prayers, isMuted, stopAdhan]);

  const playAdhanFile = useCallback((file: string) => {
    const url = file.startsWith("/") ? file : `/Adhan/${file}`;
    
    stopAdhan();

    const audio = new Audio(url);
    audio.muted = isMuted;
    audioRef.current = audio;
    setIsPlaying(true);
    
    audio.play().catch(err => {
      console.warn("File play blocked", err);
      setIsPlaying(false);
    });

    audio.onended = () => {
      setIsPlaying(false);
      audioRef.current = null;
    };
  }, [isMuted, stopAdhan]);

  return (
    <AdhanContext.Provider value={{ 
      lastPlayed: null, isPlaying, isMuted, setIsMuted, stopAdhan, playManualAdhan,
      playAdhanFile, settings, updateSettings: setSettings
    }}>
      {children}
    </AdhanContext.Provider>
  );
};

export const useAdhan = () => {
  const context = useContext(AdhanContext);
  if (context === undefined) throw new Error("useAdhan must be used within an AdhanProvider");
  return context;
};
