import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useWaqt } from "../WaqtContext";
import { CITIES, CityData } from "../lib/cities";
import { X, Search, MapPin, Navigation, Globe, Check } from "lucide-react";

export const LocationModal: React.FC = () => {
  const { showLocationModal, setShowLocationModal, setLocation, location } = useWaqt();
  const [search, setSearch] = useState("");

  if (!showLocationModal) return null;

  const filteredCities = CITIES.filter(c => 
    c.city.toLowerCase().includes(search.toLowerCase()) || 
    c.country.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[1500] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={() => setShowLocationModal(false)}
        className="absolute inset-0 bg-black/70 backdrop-blur-3xl"
      />
      <motion.div
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0, y: 15 }}
        className="relative w-full max-w-lg glass-modal rounded-[3rem] p-10 overflow-hidden shadow-2xl border-white/5 flex flex-col max-h-[85vh]"
      >
        <div className="flex items-center justify-between mb-8 shrink-0">
          <div className="space-y-1">
            <h2 className="text-3xl font-serif italic text-white/90">Location Settings</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Sync Your Prayer Schedule</p>
          </div>
          <button 
             onClick={() => setShowLocationModal(false)}
             className="p-3 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all active:scale-90"
          >
            <X className="w-5 h-5 text-white/40" />
          </button>
        </div>

        {/* Current Location Hook */}
        <div className="mb-8 p-6 glass-card border-indigo-500/20 bg-indigo-500/5 space-y-4 shrink-0">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 flex items-center justify-center">
                    <Navigation className="w-5 h-5 text-indigo-400" />
                 </div>
                 <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-indigo-400">Current Method</p>
                    <p className="text-sm font-bold text-white uppercase tracking-tighter">
                       {location ? `${location.city} (${location.detectionMethod.toUpperCase()})` : "Not Detected"}
                    </p>
                 </div>
              </div>
              <button 
                onClick={() => {
                   if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition((pos) => {
                         setLocation({
                           latitude: pos.coords.latitude,
                           longitude: pos.coords.longitude,
                           city: "Detected Location",
                           country: "",
                           detectionMethod: "gps"
                         });
                      });
                   }
                }}
                className="px-6 py-2.5 bg-indigo-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl"
              >
                 Detect GPS
              </button>
           </div>
        </div>

        {/* Search */}
        <div className="relative mb-6 shrink-0">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
           <input 
             value={search} onChange={e => setSearch(e.target.value)}
             placeholder="Search your city..."
             className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-all font-bold tracking-tight"
           />
        </div>

        {/* Cities List */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
           {filteredCities.map((c, i) => (
             <button 
               key={i}
               onClick={() => setLocation({ 
                 latitude: c.lat, longitude: c.lng, city: c.city, country: c.country, 
                 detectionMethod: "manual" 
               })}
               className="w-full p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/[0.07] transition-all text-left flex items-center justify-between group"
             >
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                      <Globe className="w-4 h-4 text-white/30" />
                   </div>
                   <div>
                      <p className="text-sm font-bold text-white group-hover:text-white transition-colors">{c.city}</p>
                      <p className="text-[10px] font-medium text-white/20 uppercase tracking-widest">{c.country}</p>
                   </div>
                </div>
                <div className="w-8 h-8 rounded-lg border border-white/5 flex items-center justify-center group-hover:border-white/20">
                   <MapPin className="w-3 h-3 text-white/20 group-hover:text-white/40" />
                </div>
             </button>
           ))}
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 text-center shrink-0">
           <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.4em]">Maintaining Spiritual Accuracy Globally</p>
        </div>
      </motion.div>
    </div>
  );
};
