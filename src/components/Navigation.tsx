import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Home, Quote, BookOpen, Heart, Settings, LayoutGrid, Hand, CheckCircle2 } from "lucide-react";
import { cn } from "../lib/utils";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: BookOpen, label: "Quran", path: "/quran" },
  { icon: CheckCircle2, label: "Salah", path: "/salah" },
  { icon: Hand, label: "Tasbih", path: "/tasbih" },
  { icon: Heart, label: "Duas", path: "/duas" },
  { icon: Quote, label: "Quotes", path: "/quotes" },
  { icon: LayoutGrid, label: "Tools", path: "/tools" },
];

export const Navigation: React.FC = () => {
  const location = useLocation();
  return (
    <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-4 sm:px-6 py-3 glass-navbar rounded-full flex items-center gap-1 sm:gap-6">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => {
            const isToolsActive = item.path === "/tools" && (location.pathname === "/tools" || location.pathname === "/learn-zakat" || location.pathname === "/knowledge");
            const active = isActive || isToolsActive;
            return cn(
              "p-3 rounded-full transition-all duration-300 flex flex-col items-center gap-1 group relative",
              active
                ? "bg-white/10 text-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                : "text-white/40 hover:text-white hover:bg-white/5"
            );
          }}
        >
          <item.icon className="w-5 h-5" />
          <span className="text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity absolute -top-10 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-white whitespace-nowrap pointer-events-none uppercase tracking-widest scale-90 group-hover:scale-100 origin-bottom">
            {item.label}
          </span>
        </NavLink>
      ))}
    </nav>
  );
};
