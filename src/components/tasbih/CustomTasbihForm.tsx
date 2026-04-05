import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTasbih, QUICK_DHIKRS, type CustomTasbihStep } from "../../contexts/TasbihContext";
import { ChevronLeft, Plus, Trash2, Type, Hash, ListPlus, Wand2, Check, Search } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import duaData from "../../data/duas";

// Flatten the deep dua data for easy searching
const ALL_DUAS = (() => {
  const flattened: string[] = [];
  duaData.data.forEach(cat => {
    cat.category_details.forEach(item => {
      item.item_details.forEach(dua => {
        flattened.push(dua.dua_title);
      });
    });
  });
  return Array.from(new Set([...QUICK_DHIKRS, ...flattened]));
})();

export const CustomTasbihForm: React.FC = () => {
  const navigate = useNavigate();
  const { addCustomSet } = useTasbih();
  const [name, setName] = useState("");
  const [steps, setSteps] = useState<CustomTasbihStep[]>([
    { name: "", target: 33 }
  ]);
  const [showPicker, setShowPicker] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const filteredDuas = useMemo(() => {
    return ALL_DUAS.filter(d => d.toLowerCase().includes(search.toLowerCase())).slice(0, 20);
  }, [search]);

  const addStep = () => setSteps([...steps, { name: "", target: 33 }]);

  const removeStep = (index: number) => {
    if (steps.length > 1) setSteps(steps.filter((_, i) => i !== index));
  };

  const updateStep = (index: number, field: keyof CustomTasbihStep, value: any) => {
    const nextSteps = [...steps];
    nextSteps[index] = { ...nextSteps[index], [field]: value };
    setSteps(nextSteps);
  };

  const selectDhikr = (index: number, dhikr: string) => {
    updateStep(index, "name", dhikr);
    setShowPicker(null);
    setSearch("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const validSteps = steps.filter(s => s.name.trim() !== "");
    if (validSteps.length === 0) return;
    addCustomSet(name, validSteps);
    navigate("/tasbih/custom");
  };

  return (
    <div className="max-w-xl mx-auto space-y-8 pb-32">
      <header className="flex items-center gap-5">
        <button onClick={() => navigate(-1)} className="p-3 rounded-2xl glass-button border-white/5 group">
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        </button>
        <div className="space-y-0.5">
          <h1 className="text-3xl font-serif italic tracking-tight">Create Sequence</h1>
          <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.2em]">Design your custom dhikr journey</p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Set Title */}
        <div className="p-8 glass-card border-white/5 space-y-4">
           <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 pl-1">
              <Type className="w-3 h-3 text-amber-400" /> Sequence Title <span className="text-rose-400">*</span>
           </label>
           <input 
             type="text" required value={name} onChange={(e) => setName(e.target.value)}
             placeholder="e.g., Morning Adhkar"
             className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-amber-400/30 transition-all font-medium"
           />
        </div>

        {/* Steps List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
             <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 flex items-center gap-2">
                <ListPlus className="w-3.5 h-3.5" /> Dhikr Steps
             </h3>
             <span className="text-[9px] font-bold text-white/15 italic">{steps.length} Steps Added</span>
          </div>

          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {steps.map((step, idx) => (
                <motion.div 
                  key={idx} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                  className="p-6 glass-card border-white/5 space-y-6 relative group bg-white/[0.02]"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    {/* Dhikr Name & Picker */}
                    <div className="md:col-span-8 space-y-2 relative">
                      <div className="flex items-center justify-between">
                         <label className="text-[9px] font-black uppercase tracking-widest text-white/20 pl-1">Name</label>
                         <button 
                           type="button" onClick={() => { setShowPicker(showPicker === idx ? null : idx); setSearch(""); }}
                           className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-amber-400/50 hover:text-amber-400 transition-colors"
                         >
                            <Wand2 className="w-3 h-3" /> Select From List
                         </button>
                      </div>
                      
                      <input 
                        type="text" required value={step.name} onChange={(e) => updateStep(idx, "name", e.target.value)}
                        placeholder="Type dhikr name..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-sm focus:outline-none focus:border-amber-400/20 transition-all"
                      />

                      {/* Searchable Picker Dropdown */}
                      <AnimatePresence>
                        {showPicker === idx && (
                          <motion.div 
                            initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 2 }}
                            className="absolute top-full left-0 right-0 mt-3 z-[100] glass-modal border-white/10 rounded-2xl overflow-hidden shadow-2xl"
                          >
                            <div className="p-3 border-b border-white/5 bg-white/5">
                               <div className="relative">
                                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
                                  <input 
                                    autoFocus placeholder="Search supplications..."
                                    value={search} onChange={(e) => setSearch(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-9 pr-4 text-xs focus:outline-none focus:border-amber-400/20"
                                  />
                               </div>
                            </div>
                            <div className="max-h-60 overflow-y-auto p-2 custom-scrollbar">
                              {filteredDuas.map(d => (
                                <button
                                  key={d} type="button" onClick={() => selectDhikr(idx, d)}
                                  className="w-full p-3 text-left hover:bg-white/10 rounded-xl transition-all group flex items-center justify-between"
                                >
                                  <p className="text-[11px] text-white/50 group-hover:text-white font-medium truncate">{d}</p>
                                  <ChevronLeft className="w-3 h-3 rotate-180 opacity-0 group-hover:opacity-100 transition-all" />
                                </button>
                              ))}
                              {filteredDuas.length === 0 && (
                                <p className="p-8 text-center text-[10px] text-white/20 uppercase font-black tracking-widest">No matching duas</p>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Target Count */}
                    <div className="md:col-span-4 space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-white/20 pl-1">Target</label>
                      <div className="relative">
                        <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 text-white/20" />
                        <input 
                          type="number" required min="1" value={step.target}
                          onChange={(e) => updateStep(idx, "target", parseInt(e.target.value) || 1)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-10 pr-4 text-sm focus:outline-none focus:border-amber-400/20 transition-all font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {steps.length > 1 && (
                    <button 
                      type="button" onClick={() => removeStep(idx)}
                      className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 shadow-xl"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <button 
            type="button" onClick={addStep}
            className="w-full py-5 border-2 border-dashed border-white/5 rounded-3xl text-white/10 hover:border-amber-400/15 hover:text-amber-400/40 transition-all flex items-center justify-center gap-3 group"
          >
            <Plus className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Add Step</span>
          </button>
        </div>

        <div className="pt-6">
          <button 
            type="submit"
            className="w-full py-5 bg-emerald-500 text-black rounded-[2rem] font-black uppercase tracking-[0.4em] text-xs hover:bg-emerald-400 transition-all shadow-2xl shadow-emerald-500/20 flex items-center justify-center gap-3"
          >
             Finalize Sequence <Check className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
