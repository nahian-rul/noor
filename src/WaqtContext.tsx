import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from "react";
import { Coordinates, CalculationMethod, PrayerTimes, Madhab } from "adhan";
import { format, subDays } from "date-fns";
import { Waqt } from "./types";
import { CITIES, CityData, findNearestCityByTimezone } from "./lib/cities";

export type DetectionMethod = "gps" | "timezone" | "manual";

interface UserLocation {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
  detectionMethod: DetectionMethod;
}

interface WaqtContextType {
  waqt: Waqt;
  prayerTimes: PrayerTimes | null;
  nextPrayer: { name: string; time: Date } | null;
  location: UserLocation | null;
  setLocation: (loc: UserLocation) => void;
  isAutoUpdate: boolean;
  setAutoUpdate: (val: boolean) => void;
  showLocationModal: boolean;
  setShowLocationModal: (val: boolean) => void;
}

const WaqtContext = createContext<WaqtContextType | undefined>(undefined);
const STORAGE_KEY = "noor_location_data";

export const WaqtProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [location, setLocationState] = useState<UserLocation | null>(null);
  const [isAutoUpdate, setAutoUpdate] = useState(true);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [waqt, setWaqt] = useState<Waqt>("Night");
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: Date } | null>(null);
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);

  // Persistence (Load)
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { setLocationState(JSON.parse(saved)); } catch (e) { console.error("Failed to load location", e); }
    } else {
      triggerAutoDetection();
    }

    const savedAuto = localStorage.getItem("noor_location_auto_update");
    if (savedAuto !== null) setAutoUpdate(savedAuto === "true");
  }, []);

  // Persistence (Save)
  useEffect(() => {
    if (location) localStorage.setItem(STORAGE_KEY, JSON.stringify(location));
  }, [location]);

  useEffect(() => {
    localStorage.setItem("noor_location_auto_update", isAutoUpdate.toString());
  }, [isAutoUpdate]);

  const triggerAutoDetection = () => {
    // 🥇 1. GPS
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocationState({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            city: "Detected Location",
            country: "",
            detectionMethod: "gps"
          });
        },
        (err) => {
          console.warn("GPS failed, trying timezone", err);
          // 🥈 2. Timezone
          const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
          const matchedCity = findNearestCityByTimezone(tz);
          if (matchedCity) {
            setLocationState({
              latitude: matchedCity.lat,
              longitude: matchedCity.lng,
              city: matchedCity.city,
              country: matchedCity.country,
              detectionMethod: "timezone"
            });
          } else {
            // 🥉 3. Fail -> Modal
            setShowLocationModal(true);
          }
        },
        { timeout: 10000 }
      );
    } else {
      setShowLocationModal(true);
    }
  };

  const updateWaqt = (loc: UserLocation) => {
    const coords = new Coordinates(loc.latitude, loc.longitude);
    const params = CalculationMethod.MuslimWorldLeague();
    params.madhab = Madhab.Shafi; // Default
    
    const now = new Date();
    const pTimes = new PrayerTimes(coords, now, params);
    setPrayerTimes(pTimes);

    const names: Record<string, Waqt> = {
      fajr: "Fajr", sunrise: "Sunrise", dhuhr: "Dhuhr", asr: "Asr", 
      maghrib: "Maghrib", isha: "Isha", none: "Night"
    };

    const currentWaqt = pTimes.currentPrayer();
    setWaqt(names[currentWaqt] || "Night");

    const nextWaqt = pTimes.nextPrayer();
    if (nextWaqt !== "none") {
      setNextPrayer({
        name: nextWaqt.charAt(0).toUpperCase() + nextWaqt.slice(1),
        time: pTimes.timeForPrayer(nextWaqt)!
      });
    } else {
      const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
      const tTimes = new PrayerTimes(coords, tomorrow, params);
      setNextPrayer({ name: "Fajr", time: tTimes.fajr });
    }
  };

  useEffect(() => {
    if (location) {
      updateWaqt(location);
      const interval = setInterval(() => updateWaqt(location), 30000); // 30s checks
      return () => clearInterval(interval);
    }
  }, [location]);

  const setLocation = (loc: UserLocation) => {
    setLocationState(loc);
    setShowLocationModal(false);
  };

  return (
    <WaqtContext.Provider value={{ 
      waqt, prayerTimes, nextPrayer, location, setLocation, 
      isAutoUpdate, setAutoUpdate, showLocationModal, setShowLocationModal 
    }}>
      {children}
    </WaqtContext.Provider>
  );
};

export const useWaqt = () => {
  const context = useContext(WaqtContext);
  if (!context) throw new Error("useWaqt must be used within a WaqtProvider");
  return context;
};
