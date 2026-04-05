import React from "react";
import { motion } from "motion/react";
import { 
  Sun, 
  Sunrise, 
  CloudSun, 
  Sunset, 
  Moon, 
  CheckCircle2, 
  Info,
  ArrowRight,
  ArrowLeft,
  Clock,
  LayoutGrid
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// ── Shared Card Component ───────────────────────────────────────────
const LearnCard: React.FC<{ 
  title: string; 
  icon: React.ReactNode; 
  total: string;
  badgeColor: string;
  children: React.ReactNode;
  delay?: number;
}> = ({ title, icon, total, badgeColor, children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ scale: 1.01 }}
    className="glass-card p-6 md:p-8 border-white/10 space-y-6 relative group"
    style={{ backdropFilter: "blur(12px)", backgroundColor: "rgba(255,255,255,0.1)" }}
  >
    <div className="flex items-center justify-between relative z-10">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <h3 className="text-xl font-serif italic text-white/90 tracking-tight">{title}</h3>
      </div>
      <div className={`px-4 py-1.5 rounded-full ${badgeColor} text-black text-[9px] font-black uppercase tracking-widest shadow-lg`}>
         {total} Total
      </div>
    </div>

    <div className="text-[14px] md:text-base text-white/60 leading-relaxed font-medium relative z-10">
      {children}
    </div>
    
    <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none select-none group-hover:opacity-[0.04] transition-opacity">
       {icon}
    </div>
  </motion.div>
);

export const LearnRakah: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-20 max-w-4xl mx-auto px-4 md:px-0 space-y-12">
      <header className="space-y-6 flex flex-col items-center text-center py-10">
         <motion.button 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           onClick={() => navigate(-1)}
           className="flex items-center gap-3 px-6 py-2.5 glass-button border-white/5 rounded-full text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all group pointer-events-auto"
         >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
         </motion.button>
         
         <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-serif italic tracking-tight text-white/95">Salah Rak‘ah Guide</h1>
            <p className="text-white/30 text-[10px] md:text-xs font-black uppercase tracking-[0.4em] leading-relaxed">
               Understanding the units of the five daily prayers.
            </p>
         </div>
      </header>

      <main className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* FAJR */}
          <LearnCard title="Fajr (Dawn)" icon={<Sunrise className="w-6 h-6 text-amber-300" />} total="4 Rak‘ah" badgeColor="bg-amber-300">
             <div className="space-y-2">
                <p>• 2 Rak‘ah Sunnah (Recommended)</p>
                <p>• 2 Rak‘ah Fard (Obligatory)</p>
                <p className="pt-2 text-[11px] italic text-white/30 leading-relaxed font-bold uppercase tracking-widest">
                   The Prophet ﷺ emphasized the Sunnah of Fajr strongly, showing its great reward.
                </p>
             </div>
          </LearnCard>

          {/* DHUHR */}
          <LearnCard title="Dhuhr (Midday)" icon={<Sun className="w-6 h-6 text-orange-400" />} total="10 Rak‘ah" badgeColor="bg-orange-400">
             <div className="space-y-2">
                <p>• 4 Rak‘ah Sunnah</p>
                <p>• 4 Rak‘ah Fard</p>
                <p>• 2 Rak‘ah Sunnah</p>
             </div>
          </LearnCard>

          {/* ASR */}
          <LearnCard title="Asr (Afternoon)" icon={<CloudSun className="w-6 h-6 text-indigo-300" />} total="4 - 8 Rak‘ah" badgeColor="bg-indigo-300">
             <div className="space-y-2">
                <p>• 4 Rak‘ah Fard</p>
                <p className="text-white/30 italic text-sm">(Optional: 4 Sunnah before Fard)</p>
             </div>
          </LearnCard>

          {/* MAGHRIB */}
          <LearnCard title="Maghrib (Sunset)" icon={<Sunset className="w-6 h-6 text-rose-400" />} total="5 Rak‘ah" badgeColor="bg-rose-400">
             <div className="space-y-2">
                <p>• 3 Rak‘ah Fard</p>
                <p>• 2 Rak‘ah Sunnah</p>
             </div>
          </LearnCard>
        </div>

        {/* ISHA IS WIDE */}
        <div className="w-full">
          <LearnCard title="Isha (Night)" icon={<Moon className="w-6 h-6 text-sky-400" />} total="13 Rak‘ah" badgeColor="bg-sky-400">
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                   <p>• 4 Rak‘ah Sunnah</p>
                   <p>• 4 Rak‘ah Fard</p>
                </div>
                <div className="space-y-2">
                   <p>• 2 Rak‘ah Sunnah</p>
                   <p className="text-amber-400 font-black tracking-widest text-[11px]">3 Rak‘ah Witr (Wajib)</p>
                </div>
             </div>
          </LearnCard>
        </div>

        {/* DEFINITION SECTION */}
        <motion.div
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           className="p-10 glass-card bg-emerald-400/5 border-emerald-400/10 rounded-[2.5rem] space-y-8"
        >
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-400/20 flex items-center justify-center border border-emerald-400/20">
                 <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                 <h2 className="text-2xl font-serif italic text-white/95">When is One Rak‘ah Completed?</h2>
                 <p className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-black">The Cycle of Salah</p>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                 <p className="text-sm text-white/60 leading-relaxed">
                    A Rak‘ah (unit of prayer) is completed after finishing this full cycle:
                 </p>
                 <ul className="space-y-3 font-bold text-[11px] uppercase tracking-widest text-white/90">
                    <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Standing (Qiyam)</li>
                    <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Recite Al-Fatihah + Surah</li>
                    <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Bowing (Ruku)</li>
                    <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Stand again (Qawmah)</li>
                    <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> First Prostration (Sujood)</li>
                    <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Sitting (Jalsa)</li>
                    <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Second Prostration (Sujood)</li>
                 </ul>
              </div>

              <div className="space-y-6">
                 <div className="p-6 bg-white/5 border border-white/5 rounded-3xl space-y-4">
                    <div className="flex items-center gap-3 text-white/90">
                       <Info className="w-5 h-5 text-indigo-400" />
                       <span className="text-sm font-black uppercase tracking-widest">Simple Understanding</span>
                    </div>
                    <div className="space-y-2 text-sm text-white/40 leading-relaxed font-medium">
                       <p>• 2 Rak‘ah = repeat the cycle twice</p>
                       <p>• 3 Rak‘ah = repeat 3 times</p>
                       <p>• 4 Rak‘ah = repeat 4 times</p>
                       <p className="pt-2 text-xs italic text-white/60">
                          In the final Rak‘ah, you sit longer and recite Tashahhud, then end with Tasleem.
                       </p>
                    </div>
                 </div>
                 
                 <div className="pt-4 border-t border-white/5">
                   <p className="text-[10px] text-white/20 italic font-black uppercase tracking-[0.2em] leading-relaxed">
                      “Indeed, prayer has been decreed upon the believers at specified times.” — Qur'an (4:103)
                   </p>
                 </div>
              </div>
           </div>
        </motion.div>
      </main>

      {/* BOTTOM CTA */}
      <footer className="flex justify-center pt-20 pb-10">
         <motion.button
           whileHover={{ scale: 1.05, y: -5 }}
           whileTap={{ scale: 0.95 }}
           onClick={() => navigate("/learn-salah")}
           className="px-10 py-5 bg-indigo-500 text-white text-xs md:text-sm font-black uppercase tracking-[0.3em] rounded-3xl shadow-[0_20px_50px_rgba(99,102,241,0.2)] flex items-center gap-4 group"
         >
            How to Pray (Guide) <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
         </motion.button>
      </footer>
    </div>
  );
};
