import React, { createContext, useContext, useState } from "react";

export type ThemeId = "auto" | "midnight" | "forest" | "ocean" | "desert" | "royal" | "rose" | "slate";

export interface Theme {
  id: ThemeId;
  name: string;
  emoji: string;
  bg: string;          // canvas bg hex
  accent: string;      // ring/line color hex
  star: string;        // particle color hex
  gradientFrom: string;
  gradientTo: string;
  accentClass: string; // tailwind color for UI highlights
}

export const THEMES: Record<ThemeId, Theme> = {
  auto:     { id: "auto",     name: "Auto Waqt",    emoji: "🌙", bg: "#1f2937", accent: "#4b5563", star: "#93c5fd", gradientFrom: "#141e30", gradientTo: "#243b55", accentClass: "amber" },
  midnight: { id: "midnight", name: "Twilight",     emoji: "🌌", bg: "#2F3B52", accent: "#4c5c7d", star: "#cbd5e1", gradientFrom: "#2F3B52", gradientTo: "#1a2538", accentClass: "sky" },
  forest:   { id: "forest",   name: "Pine",         emoji: "🌿", bg: "#2D4238", accent: "#426b52", star: "#86efac", gradientFrom: "#2D4238", gradientTo: "#1F2E26", accentClass: "emerald" },
  ocean:    { id: "ocean",    name: "Teal",         emoji: "🌊", bg: "#1B3B48", accent: "#296675", star: "#67e8f9", gradientFrom: "#1f4037", gradientTo: "#1B3B48", accentClass: "teal" },
  desert:   { id: "desert",   name: "Terracotta",   emoji: "🐪", bg: "#5C443C", accent: "#8B6A5E", star: "#fde68a", gradientFrom: "#5C443C", gradientTo: "#45322C", accentClass: "orange" },
  royal:    { id: "royal",    name: "Lavender",     emoji: "🪻", bg: "#3C324A", accent: "#635677", star: "#e879f9", gradientFrom: "#3C324A", gradientTo: "#2A2234", accentClass: "purple" },
  rose:     { id: "rose",     name: "Muted Rose",   emoji: "🌸", bg: "#5E3842", accent: "#8A5A66", star: "#fda4af", gradientFrom: "#5E3842", gradientTo: "#42252D", accentClass: "rose" },
  slate:    { id: "slate",    name: "Cloud",        emoji: "☁️", bg: "#475569", accent: "#64748b", star: "#e2e8f0", gradientFrom: "#475569", gradientTo: "#334155", accentClass: "slate" },
};

interface ThemeContextType {
  theme: Theme;
  themeId: ThemeId;
  setThemeId: (id: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: THEMES.auto,
  themeId: "auto",
  setThemeId: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeId, setThemeIdState] = useState<ThemeId>(() => {
    return (localStorage.getItem("noor_theme") as ThemeId) || "auto";
  });

  const setThemeId = (id: ThemeId) => {
    setThemeIdState(id);
    localStorage.setItem("noor_theme", id);
  };

  return (
    <ThemeContext.Provider value={{ theme: THEMES[themeId], themeId, setThemeId }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
