import React from "react";
import { motion } from "motion/react";
import { 
  HelpCircle, 
  Droplets, 
  ListChecks, 
  XOctagon, 
  ShieldAlert, 
  Sparkles,
  ArrowRight,
  ArrowLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// ── Shared Card Component ───────────────────────────────────────────
const LearnCard: React.FC<{ 
  title: string; 
  icon: React.ReactNode; 
  tooltip?: string;
  hadith?: string;
  source?: string;
  children: React.ReactNode;
  delay?: number;
}> = ({ title, icon, tooltip, hadith, source, children, delay = 0 }) => (
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

    {hadith && (
      <div className="pt-6 border-t border-white/5 relative z-10">
        <p className="text-[11px] md:text-xs text-white/20 italic leading-relaxed font-bold uppercase tracking-widest">
           “{hadith}”
        </p>
        <span className="text-[9px] text-white/10 block mt-2 uppercase tracking-[0.2em]">— {source}</span>
      </div>
    )}
    
    <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none select-none group-hover:opacity-[0.04] transition-opacity">
       {icon}
    </div>
  </motion.div>
);

export const LearnWudu: React.FC = () => {
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
            <h1 className="text-4xl md:text-5xl font-serif italic tracking-tight text-white/95">What is Wudu?</h1>
            <p className="text-white/30 text-[10px] md:text-xs font-black uppercase tracking-[0.4em] leading-relaxed max-w-2xl mx-auto">
               The ritual of purification (ablution) for spiritual readiness.
            </p>
         </div>
      </header>

      <main className="space-y-8">
        {/* CARD 1: WHAT IS WUDU? */}
        <LearnCard 
          title="What is Wudu?" 
          icon={<Droplets className="w-6 h-6 text-sky-400" />}
          hadith="O you who believe! When you rise for prayer, wash your faces and your hands up to the elbows…"
          source="Qur'an (5:6)"
        >
          <p>
            Wudu (ablution) is a state of physical and spiritual purification required before performing Salah (prayer) 
            and certain acts of worship in Islam. It involves washing specific parts of the body in a prescribed 
            manner, preparing a believer to stand before Allah in cleanliness and humility. Wudu is not only about 
            physical cleanliness but also symbolizes inner purity and readiness for worship.
          </p>
        </LearnCard>

        {/* CARD 2: STEPS */}
        <LearnCard 
          title="How to Perform Wudu" 
          icon={<ListChecks className="w-6 h-6 text-emerald-400" />}
          tooltip="Niyyah: The silent intention in your heart to perform the act for the sake of Allah."
          hadith="The prayer of a person who does not perform Wudu properly is not accepted."
          source="Sahih Muslim"
        >
          <p>
            Begin with the intention (niyyah) in your heart and say “Bismillah.” First, wash both hands up to the 
            wrists three times. Then rinse the mouth and nose three times each. Wash the entire face three times, 
            followed by washing both arms up to the elbows three times, starting with the right. After that, wipe 
            over the head once (including ears). Finally, wash both feet up to the ankles three times, starting 
            with the right foot. Ensure water reaches all required areas properly.
          </p>
        </LearnCard>

        {/* CARD 3: NULLIFICATION */}
        <LearnCard 
          title="What Nullifies Wudu?" 
          icon={<XOctagon className="w-6 h-6 text-rose-400" />}
        >
          <p>
            Wudu is broken by certain actions, including using the toilet (urination or defecation), passing gas, 
            deep sleep, loss of consciousness, or anything that exits from the private parts. In such cases, 
            Wudu must be performed again before offering prayer. Maintaining awareness of purity is an 
            essential part of daily worship.
          </p>
        </LearnCard>

        {/* CARD 4: RULES */}
        <LearnCard 
          title="Essential Rules" 
          icon={<ShieldAlert className="w-6 h-6 text-amber-400" />}
          hadith="Do not waste water, even if you perform ablution on the banks of a flowing river."
          source="Sunan Ibn Majah"
        >
          <p>
            All required body parts must be washed thoroughly, ensuring no area remains dry, even between fingers and 
            toes. Wudu should be performed in the correct sequence without long interruptions between steps. Clean 
            and pure water must be used. It is recommended not to waste water, even when performing Wudu near a 
            flowing river, as moderation is part of Islamic teaching.
          </p>
        </LearnCard>

        {/* CARD 5: VIRTUES */}
        <LearnCard 
          title="Virtues & Rewards" 
          icon={<Sparkles className="w-6 h-6 text-indigo-400" />}
          hadith="My followers will be called on the Day of Resurrection with bright faces, hands, and feet due to the traces of Wudu."
          source="Sahih al-Bukhari"
        >
          <p>
            Wudu carries immense spiritual benefits. It cleanses sins and elevates a believer’s status. On the Day of 
            Judgment, those who performed Wudu regularly will be recognized by the brightness of their faces, 
            hands, and feet. It also brings calmness and prepares the heart for sincere prayer and connection with Allah.
          </p>
        </LearnCard>
      </main>

      {/* BOTTOM CTA */}
      <footer className="flex justify-center pt-20 pb-10">
         <motion.button
           whileHover={{ scale: 1.05, y: -5 }}
           whileTap={{ scale: 0.95 }}
           onClick={() => navigate("/salah")}
           className="px-10 py-5 bg-indigo-500 text-white text-xs md:text-sm font-black uppercase tracking-[0.3em] rounded-3xl shadow-[0_20px_50px_rgba(99,102,241,0.2)] flex items-center gap-4 group"
         >
            Track My Salah <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
         </motion.button>
      </footer>
    </div>
  );
};
