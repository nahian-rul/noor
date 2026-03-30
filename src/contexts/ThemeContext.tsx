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
  auto:     { id: "auto",     name: "Auto Waqt",    emoji: "🌙", bg: "#000308", accent: "#1e3a5f", star: "#93c5fd", gradientFrom: "#000308", gradientTo: "#0f172a", accentClass: "amber" },
  midnight: { id: "midnight", name: "Midnight",     emoji: "🌑", bg: "#050508", accent: "#2d1b69", star: "#a78bfa", gradientFrom: "#05050e", gradientTo: "#1e003d", accentClass: "violet" },
  forest:   { id: "forest",   name: "Forest",       emoji: "🌿", bg: "#020d05", accent: "#14532d", star: "#86efac", gradientFrom: "#020d05", gradientTo: "#052e16", accentClass: "emerald" },
  ocean:    { id: "ocean",    name: "Ocean",        emoji: "🌊", bg: "#020b18", accent: "#0c4a6e", star: "#7dd3fc", gradientFrom: "#020b18", gradientTo: "#0c1a3a", accentClass: "sky" },
  desert:   { id: "desert",   name: "Desert",       emoji: "🏜️", bg: "#120800", accent: "#78350f", star: "#fde68a", gradientFrom: "#120800", gradientTo: "#2d1500", accentClass: "amber" },
  royal:    { id: "royal",    name: "Royal",        emoji: "👑", bg: "#08020f", accent: "#4a1d96", star: "#e879f9", gradientFrom: "#08020f", gradientTo: "#1a003d", accentClass: "purple" },
  rose:     { id: "rose",     name: "Rose",         emoji: "🌹", bg: "#0f020a", accent: "#881337", star: "#fda4af", gradientFrom: "#0f020a", gradientTo: "#2a0014", accentClass: "rose" },
  slate:    { id: "slate",    name: "Slate",        emoji: "🪨", bg: "#080c10", accent: "#1e293b", star: "#cbd5e1", gradientFrom: "#080c10", gradientTo: "#0f172a", accentClass: "slate" },
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
