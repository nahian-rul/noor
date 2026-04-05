import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTasbih, PREDEFINED_SETS } from "../../contexts/TasbihContext";
import { motion, AnimatePresence } from "motion/react";
import { Award, CheckCircle2, Star, Zap, LayoutGrid } from "lucide-react";
import { useWaqt } from "../../WaqtContext";

export const TasbihCounter: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { waqt } = useWaqt();
  const isAsr = waqt === "Asr";
  const { 
    customSets, 
    predefinedProgress, 
    updateCustomProgress, 
    updatePredefinedProgress, 
    resetPredefinedProgress,
    incrementTotalCount 
  } = useTasbih();

  // Mode identification
  const isPredefined = PREDEFINED_SETS.some(s => s.id === id);
  const currentCustom = !isPredefined ? customSets.find(s => s.id === id) : null;
  const currentPredefined = isPredefined ? PREDEFINED_SETS.find(s => s.id === id) : null;

  // Local state
  const [count, setCount] = useState<number>(0);
  const [duaIndex, setDuaIndex] = useState<number>(0);
  const [cycles, setCycles] = useState<number>(0);
  const [showComplete, setShowComplete] = useState(false);

  // Sync with context on load
  useEffect(() => {
    if (isPredefined && id) {
      const progress = predefinedProgress[id];
      if (progress) {
        setCount(progress.currentCount);
        setDuaIndex(progress.duaIndex);
        setCycles(progress.totalCycles);
      }
    } else if (currentCustom && id) {
      setCount(currentCustom.currentCount);
      setDuaIndex(currentCustom.currentStepIndex);
      setCycles(currentCustom.totalCycles);
    }
  }, [id, isPredefined, currentCustom, predefinedProgress]);

  // Debounced Sync with context
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isPredefined && id) {
        updatePredefinedProgress(id, { currentCount: count, duaIndex, totalCycles: cycles });
      } else if (currentCustom && id) {
        updateCustomProgress(id, { 
          currentCount: count, 
          currentStepIndex: duaIndex, 
          totalCycles: cycles 
        });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [count, duaIndex, cycles, id, isPredefined, currentCustom, updatePredefinedProgress, updateCustomProgress]);

  const currentDua = useMemo(() => {
    if (isPredefined && currentPredefined) return currentPredefined.duas[duaIndex];
    if (currentCustom) return currentCustom.steps[duaIndex];
    return null;
  }, [isPredefined, currentPredefined, currentCustom, duaIndex]);

  const handleTap = useCallback(() => {
    if (!currentDua) return;
    const maxSteps = isPredefined ? currentPredefined!.duas.length : (currentCustom?.steps.length || 0);

    incrementTotalCount(1);
    
    if (count + 1 >= currentDua.target) {
      if (duaIndex + 1 < maxSteps) {
        setDuaIndex(duaIndex + 1);
        setCount(0);
      } else {
        setShowComplete(true);
        setCycles(cycles + 1);
        setDuaIndex(0);
        setCount(0);
      }
    } else {
      setCount(count + 1);
    }
  }, [count, duaIndex, cycles, currentDua, isPredefined, currentPredefined, currentCustom]);

  // Global Reset Listener
  useEffect(() => {
    const handleGlobalReset = () => {
      if (confirm("Reset current progress?")) {
        setCount(0);
        setDuaIndex(0);
        if (isPredefined && id) resetPredefinedProgress(id);
      }
    };
    window.addEventListener("tasbih-reset", handleGlobalReset);
    return () => window.removeEventListener("tasbih-reset", handleGlobalReset);
  }, [id, isPredefined, resetPredefinedProgress]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        handleTap();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleTap]);

  if (!currentDua) return <div className="text-center p-20">Loading...</div>;

  // Progression Logic (Auto-sum inspired)
  const stepsData = isPredefined ? currentPredefined?.duas : currentCustom?.steps;
  const totalStepsTarget = stepsData?.reduce((acc, s) => acc + s.target, 0) || 1;
  const currentTotalProgress = (stepsData?.slice(0, duaIndex).reduce((acc, s) => acc + s.target, 0) || 0) + count;
  const overallProgressPercent = (currentTotalProgress / totalStepsTarget) * 100;

  const stepProgressPercent = (count / currentDua.target) * 100;
  const totalStepsCount = stepsData?.length || 0;

  return (
    <div className="flex flex-col min-h-[65vh] relative gap-4">
      {/* Set-wide Progress Bar */}
      <div className="w-full max-w-4xl mx-auto px-1 group">
         <div className="flex items-center justify-between mb-2 opacity-60 group-hover:opacity-100 transition-opacity">
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white flex items-center gap-1.5">
               <LayoutGrid className={`w-2.5 h-2.5 ${isAsr ? "text-[#FFD700]" : "text-amber-400"}`} /> Progression
            </span>
            <span className="text-[8px] font-mono font-bold text-white tracking-widest">
               {currentTotalProgress} / {totalStepsTarget} Taps
            </span>
         </div>
         <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
            <motion.div 
               animate={{ width: `${overallProgressPercent}%` }}
               className={`h-full ${isAsr ? "bg-[#FFD700]/30 shadow-[0_0_10px_rgba(255,215,0,0.2)]" : "bg-amber-400/20"}`}
            />
         </div>
      </div>

      <div className="flex-1 flex items-center justify-center py-4 pointer-events-none">
        <button 
          onClick={handleTap}
          className={`w-full max-w-4xl min-h-[400px] h-auto glass-card border-white/10 pointer-events-auto flex flex-col items-center justify-center p-8 md:p-12 transition-all active:scale-[0.98] outline-none relative overflow-hidden group/btn shadow-2xl ${
            isAsr ? "hover:border-[#FFD700]/20" : ""
          }`}
        >
          <div className="text-center space-y-8 md:space-y-12 w-full max-w-md md:max-w-xl pointer-events-none">
            <div className="space-y-4">
              <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-white/40">
                Step {duaIndex + 1} of {totalStepsCount}
              </p>
              
              {/* PRIMARY DUA NAMEStyling updated per request */}
              <h2 className="text-[20px] font-medium leading-[1.6] whitespace-normal break-words overflow-wrap-anywhere text-white px-4 select-none" style={{ fontFamily: "'Amiri', 'Scheherazade New', 'Noto Naskh Arabic', serif" }}>
                 {currentDua.name}
              </h2>
              
              {isPredefined && (currentDua as any).transliteration && (
                 <p className={`text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] leading-relaxed line-clamp-1 px-8 select-none ${
                   isAsr ? "text-[#FFD700]/60" : "text-amber-400/40"
                 }`}>
                    {(currentDua as any).transliteration}
                 </p>
              )}
            </div>

            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={count}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", damping: 15, stiffness: 250 }}
                  className="text-[8rem] md:text-[11rem] font-mono font-black text-white select-none leading-none tracking-tighter"
                >
                  {count}
                </motion.div>
              </AnimatePresence>
              
              {cycles > 0 && (
                <div className={`absolute -top-6 -right-2 md:-top-10 md:-right-4 flex items-center gap-1.5 px-3 py-1 border rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest shadow-xl ${
                  isAsr ? "bg-[#FFD700]/10 border-[#FFD700]/20 text-[#FFD700] shadow-[#FFD700]/10" : "bg-amber-400/10 border-amber-400/20 text-amber-400 shadow-amber-400/10"
                }`}>
                   Cycle {cycles} <Star className={`w-2.5 h-2.5 md:w-3 h-3 ${isAsr ? "fill-[#FFD700]" : "fill-amber-400"}`} />
                </div>
              )}
            </div>

            {/* Current Step Progress Bar */}
            <div className="space-y-3 px-6 md:px-10">
              <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden border border-white/5">
                 <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${stepProgressPercent}%` }}
                   className={`h-full transition-all ${
                     isAsr 
                       ? "bg-[#FFD700] shadow-[0_0_15px_rgba(255,215,0,0.4)]" 
                       : "bg-gradient-to-r from-amber-400 to-amber-200 shadow-[0_0_15px_rgba(251,191,36,0.3)]"
                   }`}
                 />
              </div>
              <p className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-white/30 select-none">
                 Target: {currentDua.target} Taps
              </p>
            </div>
          </div>

          <motion.div 
            animate={{ opacity: [0, 0.04, 0] }}
            transition={{ duration: 0.25 }}
            key={count + "pulse"}
            className={`absolute inset-0 pointer-events-none ${isAsr ? "bg-[#FFD700]" : "bg-amber-400"}`}
          />
        </button>
      </div>

      <AnimatePresence>
        {showComplete && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 pointer-events-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowComplete(false)}
              className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
            />
            <motion.div 
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 10, opacity: 0 }}
              className="relative w-full max-w-sm glass-modal rounded-[3rem] p-10 text-center space-y-8 shadow-2xl overflow-hidden"
            >
               <div className="absolute top-0 right-0 p-10 opacity-[0.03] rotate-12 pointer-events-none select-none">
                  <Award className="w-48 h-48" />
               </div>
               
               <div className="w-20 h-20 rounded-3xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(52,211,153,0.1)]">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400" />
               </div>
               
               <div className="space-y-3">
                 <h2 className="text-3xl font-serif italic text-white/90">Tasbih Completed</h2>
                 <p className="text-[11px] text-white/40 uppercase font-black tracking-widest">Alhamdulillah — Journey Continues</p>
                 <p className="text-sm text-white/60 font-medium leading-relaxed mt-4">
                   May Allah accept your dhikr and reward your consistency.
                 </p>
               </div>

               <button 
                onClick={() => setShowComplete(false)}
                className="w-full py-5 bg-emerald-500 text-black rounded-2xl font-black uppercase tracking-[0.3em] text-xs hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2"
               >
                 Keep Going <Zap className="w-4 h-4" />
               </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
