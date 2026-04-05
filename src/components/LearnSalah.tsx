import React from "react";
import { motion } from "motion/react";
import { 
  HelpCircle, 
  Hand, 
  User, 
  Book, 
  ChevronsDown, 
  ArrowUp, 
  Scale, 
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  Quote,
  ShieldCheck
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// ── Shared Card Component ───────────────────────────────────────────
const LearnCard: React.FC<{ 
  title: string; 
  icon: React.ReactNode; 
  tooltip?: string;
  source?: string;
  children: React.ReactNode;
  delay?: number;
}> = ({ title, icon, tooltip, source, children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ scale: 1.01 }}
    className="glass-card p-6 md:p-10 border-white/10 space-y-6 relative group overflow-hidden"
    style={{ backdropFilter: "blur(12px)", backgroundColor: "rgba(255,255,255,0.1)" }}
  >
    <div className="flex items-center justify-between relative z-10">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <h3 className="text-2xl font-serif italic text-white/90 tracking-tight">{title}</h3>
      </div>
      {tooltip && (
        <div className="group/tip relative">
          <HelpCircle className="w-4 h-4 text-white/20 cursor-help hover:text-white/60 transition-colors" />
          <div className="absolute bottom-full right-0 mb-3 w-64 p-4 bg-black/95 text-[10px] text-white/70 rounded-2xl leading-relaxed opacity-0 group-hover/tip:opacity-100 transition-all pointer-events-none z-50 border border-white/10 shadow-2xl backdrop-blur-xl font-medium">
            {tooltip}
          </div>
        </div>
      )}
    </div>

    <div className="text-[14px] md:text-[18px] lg:text-[20px] text-white/60 leading-[1.6] font-medium relative z-10 whitespace-normal break-words">
      {children}
    </div>

    {source && (
       <div className="pt-6 border-t border-white/5 relative z-10">
          <span className="text-[9px] text-white/20 block uppercase tracking-[0.2em] italic">— {source}</span>
       </div>
    )}
    
    <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none select-none group-hover:opacity-[0.04] transition-opacity">
       {icon}
    </div>
  </motion.div>
);

export const LearnSalah: React.FC = () => {
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
            <h1 className="text-4xl md:text-5xl font-serif italic tracking-tight text-white/95">How to Pray</h1>
            <p className="text-white/30 text-[10px] md:text-xs font-black uppercase tracking-[0.4em] leading-relaxed max-w-2xl mx-auto">
               A structured guide to performing Salah with sincerity and focus.
            </p>
         </div>
      </header>

      <main className="space-y-8">
        {/* STEP 1: PREPARATION */}
        <LearnCard 
          title="1. Preparation Before Salah" 
          icon={<ShieldCheck className="w-6 h-6 text-emerald-400" />}
          tooltip="Qiblah: The direction of the Kaaba in Mecca, toward which all Muslims face during prayer."
        >
          <p>
            Before starting Salah, ensure you are in a state of purity by performing Wudu. Wear clean and modest 
            clothing that properly covers the body, and stand facing the Qiblah. Make your intention (niyyah) 
            in your heart for the specific prayer you are about to perform. There is no need to say the 
            intention aloud.
          </p>
        </LearnCard>

        {/* STEP 2: TAKBIR */}
        <LearnCard 
          title="2. Begin the Prayer (Takbir)" 
          icon={<Hand className="w-6 h-6 text-amber-400" />}
        >
          <p>
            Raise both hands up to your ears (or shoulders) and say:
            <br />
            <span className="text-white/90 font-serif italic">“Allahu Akbar” (Allah is the Greatest).</span>
            <br />
            This marks the beginning of Salah.
          </p>
        </LearnCard>

        {/* STEP 3: QIYAM */}
        <LearnCard 
          title="3. Standing (Qiyam)" 
          icon={<User className="w-6 h-6 text-indigo-400" />}
        >
          <p>
            While standing, place your right hand over your left on your chest and recite:
            <br />
            <br />
            • Surah Al-Fatihah
            <br />
            • Then another short Surah or verses from the Qur'an
            <br />
            <br />
            Maintain focus and humility throughout your standing.
          </p>
        </LearnCard>

        {/* STEP 4: RUKU */}
        <LearnCard 
          title="4. Bowing (Ruku)" 
          icon={<ChevronsDown className="w-6 h-6 text-sky-400" />}
        >
          <p>
            Say <span className="text-white/80 italic">“Allahu Akbar”</span> and bow down, placing your hands on your knees. Keep your back straight. 
            Recite:
            <br />
            <span className="text-white/90 font-serif italic text-base">“Subhana Rabbiyal Azeem”</span> (Glory be to my Lord, the Almighty) — 3 times.
          </p>
        </LearnCard>

        {/* STEP 5: QAWMAH */}
        <LearnCard 
          title="5. Standing Again (Qawmah)" 
          icon={<ArrowUp className="w-6 h-6 text-rose-400" />}
        >
          <p>
            Stand up straight and say:
            <br />
            <span className="text-white/90 font-serif italic text-base">“Sami’ Allahu liman hamidah”</span> (Allah hears those who praise Him)
            <br />
            Then say:
            <br />
            <span className="text-white/90 font-serif italic text-base">“Rabbana lakal hamd”</span> (Our Lord, all praise is for You)
          </p>
        </LearnCard>

        {/* STEP 6: SUJOOD */}
        <LearnCard 
          title="6. Prostration (Sujood)" 
          icon={<Scale className="w-6 h-6 text-emerald-400" />}
        >
          <p>
            Say <span className="text-white/80 italic">“Allahu Akbar”</span> and go into prostration. Place your forehead, nose, palms, knees, 
            and toes on the ground. Recite:
            <br />
            <span className="text-white/90 font-serif italic text-base">“Subhana Rabbiyal A’la”</span> (Glory be to my Lord, the Most High) — 3 times.
          </p>
        </LearnCard>

        {/* STEP 7: JALSA */}
        <LearnCard 
          title="7. Sitting (Jalsa)" 
          icon={<User className="w-6 h-6 text-amber-400" />}
        >
          <p>
            Sit briefly after the first prostration and say:
            <br />
            <span className="text-white/90 font-serif italic text-base">“Rabbighfir li”</span> (My Lord, forgive me)
          </p>
        </LearnCard>

        {/* STEP 8: SECOND SUJOOD */}
        <LearnCard 
          title="8. Second Sujood" 
          icon={<Scale className="w-6 h-6 text-emerald-400" />}
        >
          <p>
            Perform the second prostration the same way as before. This completes one Rak‘ah.
          </p>
        </LearnCard>

        {/* STEP 9: TASHAHHUD */}
        <LearnCard 
          title="9. Tashahhud (Final Sitting)" 
          icon={<Quote className="w-6 h-6 text-indigo-400" />}
          source="Sahih al-Bukhari"
        >
          <p>
            In the final Rak‘ah, sit and recite Tashahhud, sending peace and blessings upon the Prophet ﷺ.
            <br />
            <br />
            The Prophet ﷺ said:
            <br />
            <span className="text-white/90 font-bold uppercase tracking-wider text-[11px]">“Pray as you have seen me praying.”</span>
          </p>
        </LearnCard>

        {/* STEP 10: TASLEEM */}
        <LearnCard 
          title="10. Ending the Prayer (Tasleem)" 
          icon={<MessageSquare className="w-6 h-6 text-emerald-400" />}
        >
          <p>
            End the prayer by turning your head to the right and then to the left, saying:
            <br />
            <span className="text-white/90 font-serif italic text-base">“Assalamu Alaikum wa Rahmatullah”</span> (Peace and mercy of Allah be upon you)
          </p>
        </LearnCard>

        {/* FINAL NOTE */}
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           className="p-10 glass-card bg-indigo-500/10 border-indigo-500/20 rounded-[2.5rem] space-y-6 text-center"
        >
           <h3 className="text-2xl font-serif italic text-white/95">Final Note</h3>
           <p className="text-white/60 leading-relaxed max-w-2xl mx-auto font-medium">
              Salah should be performed with sincerity, focus, and humility. It is a daily connection with Allah that 
              brings peace, discipline, and spiritual strength.
           </p>
           <div className="pt-6 border-t border-white/5">
              <p className="text-[11px] text-indigo-400 font-black uppercase tracking-widest leading-relaxed">
                 “Indeed, prayer has been decreed upon the believers at specified times.”
              </p>
              <span className="text-[9px] text-white/20 block mt-2 tracking-[0.2em]">— Qur'an (4:103)</span>
           </div>
        </motion.div>
      </main>

      {/* BOTTOM CTA */}
      <footer className="flex justify-center pt-20 pb-10">
         <motion.button
           whileHover={{ scale: 1.05, y: -5 }}
           whileTap={{ scale: 0.95 }}
           onClick={() => navigate("/salah")}
           className="px-10 py-5 bg-white text-black text-xs md:text-sm font-black uppercase tracking-[0.3em] rounded-3xl shadow-[0_20px_50px_rgba(255,255,255,0.1)] flex items-center gap-4 group"
         >
            Open Salah Tracker <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
         </motion.button>
      </footer>
    </div>
  );
};
