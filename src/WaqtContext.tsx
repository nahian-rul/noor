import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Coordinates, CalculationMethod, PrayerTimes, SunnahTimes } from "adhan";
import { format, addMinutes, isAfter, isBefore } from "date-fns";
import { Waqt } from "./types";

interface WaqtContextType {
  waqt: Waqt;
  prayerTimes: PrayerTimes | null;
  nextPrayer: { name: string; time: Date } | null;
  location: { latitude: number; longitude: number } | null;
  setLocation: (loc: { latitude: number; longitude: number }) => void;
}

const WaqtContext = createContext<WaqtContextType | undefined>(undefined);

export const WaqtProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [waqt, setWaqt] = useState<Waqt>("Dhuhr");
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: Date } | null>(null);

  useEffect(() => {
    // Default location (Mecca)
    if (!location) {
      setLocation({ latitude: 21.4225, longitude: 39.8262 });
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  useEffect(() => {
    if (location) {
      const coords = new Coordinates(location.latitude, location.longitude);
      const params = CalculationMethod.MuslimWorldLeague();
      const date = new Date();
      const pTimes = new PrayerTimes(coords, date, params);
      setPrayerTimes(pTimes);

      const currentWaqt = pTimes.currentPrayer();
      const nextWaqt = pTimes.nextPrayer();

      // Map adhan prayer names to our Waqt type
      const prayerNames: Record<string, Waqt> = {
        fajr: "Fajr",
        sunrise: "Sunrise",
        dhuhr: "Dhuhr",
        asr: "Asr",
        maghrib: "Maghrib",
        isha: "Isha",
        none: "Night",
      };

      setWaqt(prayerNames[currentWaqt] || "Night");

      if (nextWaqt !== "none") {
        setNextPrayer({
          name: nextWaqt.charAt(0).toUpperCase() + nextWaqt.slice(1),
          time: pTimes.timeForPrayer(nextWaqt)!,
        });
      } else {
        // If next is none, it means next is Fajr of tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tTimes = new PrayerTimes(coords, tomorrow, params);
        setNextPrayer({
          name: "Fajr",
          time: tTimes.fajr,
        });
      }
    }
  }, [location]);

  // Update waqt every minute
  useEffect(() => {
    const interval = setInterval(() => {
      if (location) {
        const coords = new Coordinates(location.latitude, location.longitude);
        const params = CalculationMethod.MuslimWorldLeague();
        const date = new Date();
        const pTimes = new PrayerTimes(coords, date, params);
        setPrayerTimes(pTimes);
        const currentWaqt = pTimes.currentPrayer();
        const prayerNames: Record<string, Waqt> = {
          fajr: "Fajr",
          sunrise: "Sunrise",
          dhuhr: "Dhuhr",
          asr: "Asr",
          maghrib: "Maghrib",
          isha: "Isha",
          none: "Night",
        };
        setWaqt(prayerNames[currentWaqt] || "Night");
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [location]);

  return (
    <WaqtContext.Provider value={{ waqt, prayerTimes, nextPrayer, location, setLocation }}>
      {children}
    </WaqtContext.Provider>
  );
};

export const useWaqt = () => {
  const context = useContext(WaqtContext);
  if (context === undefined) {
    throw new Error("useWaqt must be used within a WaqtProvider");
  }
  return context;
};
