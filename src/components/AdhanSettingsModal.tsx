import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Settings, Music, Bell, BellOff, Check, Play, Square, Volume2 } from "lucide-react";
import { useAdhan, AdhanSettings, ADHAN_MAPPING } from "../contexts/AdhanContext";

const ADHAN_OPTIONS = [
  { id: "default", label: "System Default" },
  { id: "azan1.mp3", label: "Adhan 1 (Fajr style)" },
  { id: "azan2.mp3", label: "Adhan 2" },
  { id: "azan3.mp3", label: "Adhan 3" },
  { id: "azan4.mp3", label: "Adhan 4" },
  { id: "azan7.mp3", label: "Adhan 7 (Isha style)" },
];

const PRAYERS = ["fajr", "dhuhr", "asr", "maghrib", "isha"];

export const AdhanSettingsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { settings, updateSettings, playAdhanFile, stopAdhan, isPlaying } = useAdhan();
  const [previewingId, setPreviewingId] = React.useState<string | null>(null);

  // Cleanup: Stop audio when modal closes
  React.useEffect(() => {
    return () => {
      stopAdhan();
    };
  }, []);

  // Update isPlaying state locally when global isPlaying ends
  React.useEffect(() => {
    if (!isPlaying) setPreviewingId(null);
  }, [isPlaying]);

  const toggleAutoPlay = () => {
    const nextState = !settings.autoPlay;
    const newPrayers = { ...settings.prayers };
    
    // If turning ON global, enable ALL prayers by default
    if (nextState) {
      Object.keys(newPrayers).forEach(k => {
        newPrayers[k] = { ...newPrayers[k], enabled: true };
      });
    }

    updateSettings({ ...settings, autoPlay: nextState, prayers: newPrayers });
  };

  const updatePrayer = (id: string, updates: Partial<AdhanSettings["prayers"][string]>) => {
    const updatedCfg = { ...settings.prayers[id], ...updates };
    
    // Auto-preview when audio changes
    if (updates.audio) {
       const url = updates.audio === "default" ? ADHAN_MAPPING[id] : updates.audio;
       setPreviewingId(id);
       playAdhanFile(url);
    }

    const newPrayers = {
      ...settings.prayers,
      [id]: updatedCfg
    };

    // "If user turned off azan for any waqt, the marked one (global auto-play) should be auto turned off"
    let newAutoPlay = settings.autoPlay;
    if (updates.enabled === false) {
      newAutoPlay = false;
    }
    
    // "if all turned on global auto-adhan should enable automatically"
    const allEnabled = Object.values(newPrayers).every(p => p.enabled);
    if (allEnabled) {
      newAutoPlay = true;
    }

    updateSettings({
      ...settings,
      autoPlay: newAutoPlay,
      prayers: newPrayers
    });
  };

  return (
    <div className="fixed inset-0 z-[400] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-xl" />
      
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="relative w-full max-w-xl bg-[#0D0D11] border-t sm:border border-white/10 rounded-t-[3rem] sm:rounded-[3rem] p-8 sm:p-10 shadow-2xl overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none select-none">
           <Settings className="w-64 h-64" />
        </div>

        <header className="flex items-center justify-between mb-10 relative z-10">
          <div>
            <h2 className="text-3xl font-serif italic text-white/90">Adhan Settings</h2>
            <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mt-2 italic">Configure your spiritual atmosphere</p>
          </div>
          <button onClick={onClose} className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
            <X className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" />
          </button>
        </header>

        <div className="space-y-10 relative z-10 max-h-[60vh] overflow-y-auto pr-2 scrollbar-hide">
          {/* Main Toggle */}
          <section className="p-6 bg-white/5 rounded-3xl border border-white/10 flex items-center justify-between group hover:border-emerald-500/30 transition-all">
            <div className="flex items-center gap-5">
              <div className={`p-4 rounded-2xl transition-all ${settings.autoPlay ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>
                {settings.autoPlay ? <Bell className="w-6 h-6" /> : <BellOff className="w-6 h-6" />}
              </div>
              <div>
                <h4 className="text-sm font-black uppercase tracking-widest text-white/90 font-serif italic">Global Auto-Adhan</h4>
                <p className="text-[9px] font-bold text-white/30 uppercase tracking-tighter mt-1">Automatically play Adhan at prayer times</p>
              </div>
            </div>
            <button 
              onClick={toggleAutoPlay}
              className={`w-14 h-8 rounded-full relative transition-all duration-500 ${settings.autoPlay ? "bg-emerald-500" : "bg-white/10"}`}
            >
              <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-lg transition-all duration-500 ${settings.autoPlay ? "left-7" : "left-1"}`} />
            </button>
          </section>

          {/* Individual Prayers List */}
          <section className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              {PRAYERS.map((p) => {
                const cfg = settings.prayers[p];
                return (
                  <div 
                    key={p} 
                    className={`p-5 rounded-[1.5rem] border transition-all flex items-center justify-between gap-4 ${
                      cfg.enabled ? "bg-white/[0.04] border-white/10" : "bg-black/20 border-white/5 opacity-50"
                    }`}
                  >
                    <div className="flex items-center gap-5">
                       <div className="flex items-center">
                          <button 
                            onClick={(e) => { e.stopPropagation(); updatePrayer(p, { enabled: !cfg.enabled }); }}
                            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                                cfg.enabled ? "bg-emerald-500/10 text-emerald-400 group-hover:scale-110" : "bg-white/5 text-white/20"
                            }`}
                          >
                             {cfg.enabled ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
                          </button>
                          
                          <button 
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              if (previewingId === p && isPlaying) {
                                stopAdhan();
                                setPreviewingId(null);
                              } else {
                                setPreviewingId(p);
                                playAdhanFile(cfg.audio === "default" ? ADHAN_MAPPING[p] : cfg.audio); 
                              }
                            }}
                            className={`ml-2 w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${
                               previewingId === p && isPlaying ? "bg-amber-500/10 border-amber-500/30 text-amber-500" : "bg-white/5 border-white/5 text-white/40 hover:text-white hover:bg-white/10"
                            }`}
                          >
                             {previewingId === p && isPlaying ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                          </button>
                       </div>
                       
                       <div>
                          <h5 className="text-sm font-serif italic text-white/90 capitalize">{p}</h5>
                          <p className={`text-[8px] font-black uppercase tracking-widest mt-0.5 ${cfg.enabled ? "text-emerald-500/60" : "text-white/10"}`}>
                             {cfg.enabled ? "Active" : "Muted"}
                          </p>
                       </div>
                    </div>

                    <div className="relative group/sel">
                       <select
                         value={cfg.audio}
                         onClick={(e) => e.stopPropagation()}
                         onChange={(e) => { e.stopPropagation(); updatePrayer(p, { audio: e.target.value }); }}
                         className="appearance-none bg-white/5 border border-white/10 rounded-xl px-5 py-3 pr-10 text-[9px] font-black uppercase tracking-widest text-white/80 focus:outline-none focus:border-[#FFD700]/40 transition-all cursor-pointer hover:bg-white/10"
                       >
                          {ADHAN_OPTIONS.map(opt => (
                            <option key={opt.id} value={opt.id} className="bg-[#0D0D11] text-white py-2">
                               {opt.label}
                            </option>
                          ))}
                       </select>
                       <Music className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 text-white/20 pointer-events-none" />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <button 
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="w-full mt-10 py-5 bg-white text-black rounded-[2rem] font-black uppercase tracking-[0.3em] hover:bg-[#FFD700] transition-all active:scale-[0.98] shadow-2xl relative z-10"
        >
          Save & Exit
        </button>
      </motion.div>
    </div>
  );
};
