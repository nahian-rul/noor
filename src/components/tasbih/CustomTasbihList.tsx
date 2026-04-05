import React from "react";
import { Link } from "react-router-dom";
import { useTasbih } from "../../contexts/TasbihContext";
import { Plus, Hand, Trash2, ChevronRight, Download, Upload, ListTree } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const CustomTasbihList: React.FC = () => {
  const { customSets, deleteCustomSet, exportData, importData } = useTasbih();

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const ok = importData(ev.target?.result as string);
      if (ok) alert("Data imported successfully!");
      else alert("Import failed. Invalid format.");
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-10 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-serif italic tracking-tight">Your Personal Dhikr</h1>
          <p className="text-white/40 text-xs font-bold uppercase tracking-widest leading-relaxed">
            Custom counter sequences stored on this device.
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={exportData} className="p-3 glass-button rounded-xl text-white/40 hover:text-white transition-colors">
            <Download className="w-4 h-4" />
          </button>
          <label className="p-3 glass-button rounded-xl text-white/40 hover:text-white transition-colors cursor-pointer focus-within:ring-2 ring-amber-400/20">
            <Upload className="w-4 h-4" />
            <input type="file" hidden accept=".json" onChange={handleImport} />
          </label>
          <Link 
            to="/tasbih/custom/new"
            className="flex items-center gap-2 px-6 py-4 bg-amber-400 text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-300 transition-all font-sans"
          >
            New Sequence <Plus className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {customSets.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-16 glass-card border-white/5 text-center space-y-6"
        >
          <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto opacity-40">
             <Hand className="w-10 h-10 text-white/50" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-serif italic text-white/90">No Sequences available</h2>
            <p className="text-[11px] text-white/30 font-medium tracking-tight">Create your personal tasbih set to get started.</p>
          </div>
          <Link 
            to="/tasbih/custom/new"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white transition-all"
          >
            Create New <Plus className="w-4 h-4" />
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {customSets.map((set) => {
              const currentStep = set.steps[set.currentStepIndex];
              const totalTargets = set.steps.reduce((acc, s) => acc + s.target, 0);
              
              return (
                <motion.div 
                  key={set.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group p-8 glass-card border-white/5 space-y-8 relative overflow-hidden flex flex-col justify-between"
                >
                  <div className="space-y-6">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <h3 className="text-xl font-bold text-white/90 leading-tight group-hover:text-amber-400 transition-colors truncate max-w-[180px]">{set.name}</h3>
                        <p className="text-[9px] text-white/20 font-black uppercase tracking-[0.2em] flex items-center gap-2">
                           <ListTree className="w-3 h-3" /> {set.steps.length} Steps in sequence
                        </p>
                      </div>
                      <button 
                        onClick={() => deleteCustomSet(set.id)}
                        className="p-2.5 rounded-xl bg-white/0 hover:bg-rose-400/10 hover:text-rose-400 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-3">
                       <p className="text-[9px] font-black uppercase tracking-widest text-white/20 italic">Currently Reciting</p>
                       <p className="text-sm font-serif italic text-white/80 truncate">{currentStep?.name || "Ready"}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black uppercase tracking-widest text-white/20">Overall Progress</span>
                      <span className="text-xl font-black font-mono text-amber-400/80">
                         {set.currentCount} <span className="text-[10px] text-white/10">/ {currentStep?.target || 0}</span>
                      </span>
                    </div>
                    <Link 
                      to={`/tasbih/custom/${set.id}`}
                      className="p-4 rounded-2xl bg-white/5 hover:bg-amber-400 text-white hover:text-black transition-all flex items-center justify-center shadow-lg hover:shadow-amber-400/20"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
