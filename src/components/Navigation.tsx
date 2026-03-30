import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Quote, BookOpen, Heart, Settings, LayoutGrid } from "lucide-react";
import { cn } from "../lib/utils";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Quote, label: "Quotes", path: "/quotes" },
  { icon: BookOpen, label: "Quran", path: "/quran" },
  { icon: Heart, label: "Duas", path: "/duas" },
  { icon: LayoutGrid, label: "Tools", path: "/tools" },
];

export const Navigation: React.FC = () => {
  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full shadow-2xl flex items-center gap-2 sm:gap-6">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            cn(
              "p-3 rounded-full transition-all duration-300 flex flex-col items-center gap-1 group",
              isActive
                ? "bg-white/20 text-white scale-110 shadow-lg"
                : "text-white/60 hover:text-white hover:bg-white/10"
            )
          }
        >
          <item.icon className="w-5 h-5" />
          <span className="text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-black/50 px-2 py-1 rounded text-white whitespace-nowrap pointer-events-none">
            {item.label}
          </span>
        </NavLink>
      ))}
    </nav>
  );
};
