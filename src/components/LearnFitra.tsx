import React from "react";
import { motion } from "motion/react";
import { 
  HelpCircle, 
  Moon, 
  Users, 
  Wheat, 
  Clock, 
  Heart,
  ArrowRight,
  ShieldCheck,
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
    whileHover={{ scale: 1.02 }}
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

export const LearnFitra: React.FC = () => {
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
            <h1 className="text-4xl md:text-5xl font-serif italic tracking-tight text-white/95">What is Zakat al-Fitr?</h1>
            <p className="text-white/30 text-[10px] md:text-xs font-black uppercase tracking-[0.4em] leading-relaxed max-w-2xl mx-auto">
               Purification for the fasting and joy for the needy as Ramadan concludes.
            </p>
         </div>
      </header>

      <main className="space-y-8">
        {/* CARD 1: WHAT IS FITRA? */}
        <LearnCard 
          title="What is Zakat al-Fitr?" 
          icon={<Moon className="w-6 h-6 text-emerald-400" />}
          hadith="The Messenger of Allah obligated Zakat al-Fitr as a purification for the fasting person…"
          source="Sunan Abu Dawud"
        >
          <p>
            Zakat al-Fitr, also known as Fitra, is a mandatory charity given at the end of Ramadan before the Eid prayer. 
            It is required from every Muslim who has enough food for the day and night of Eid. Unlike regular Zakat, 
            it is not based on wealth but on the responsibility to support the less fortunate. Fitra serves as a 
            purification for the fasting person, removing any shortcomings during Ramadan, and ensures that the 
            poor can also celebrate Eid with dignity and joy.
          </p>
        </LearnCard>

        {/* CARD 2: WHO MUST PAY? */}
        <LearnCard 
          title="Who Must Pay?" 
          icon={<Users className="w-6 h-6 text-indigo-400" />}
          hadith="Zakat al-Fitr is obligatory on every Muslim, male or female…"
          source="Sahih al-Bukhari"
        >
          <p>
            Fitra is obligatory on every Muslim, including men, women, and children, as long as they have more food than 
            their basic needs for Eid day. The head of the household is responsible for paying on behalf of all dependents, 
            including children and even newborns. This ensures that every member of the Muslim community participates 
            in this act of charity.
          </p>
        </LearnCard>

        {/* CARD 3: AMOUNT */}
        <LearnCard 
          title="How Much to Give?" 
          icon={<Wheat className="w-6 h-6 text-amber-400" />}
          hadith="Give a Sa’ of dates or a Sa’ of barley…"
          source="Sahih al-Bukhari"
        >
          <p>
            The amount of Fitra is one Sa’ of staple food, which is approximately 2.5 to 3 kilograms. This can include 
            common food items such as rice, wheat, dates, or barley. In modern practice, many people give the monetary 
            equivalent based on local food prices, making it easier to distribute to those in need. The goal is to 
            ensure that the poor have enough to eat on Eid.
          </p>
        </LearnCard>

        {/* CARD 4: WHEN TO PAY? */}
        <LearnCard 
          title="When Should You Pay?" 
          icon={<Clock className="w-6 h-6 text-sky-400" />}
          hadith="Whoever gives it before the prayer, it is accepted as Zakat…"
          source="Sunan Ibn Majah"
        >
          <p>
            Fitra must be paid before the Eid prayer. It is الأفضل (best) to give it one or two days before Eid so that it 
            reaches the needy in time. If it is delayed until after the Eid prayer, it will no longer be considered 
            Zakat al-Fitr but rather general charity, and the reward is reduced.
          </p>
        </LearnCard>

        {/* CARD 5: WHO RECEIVES? */}
        <LearnCard 
          title="Who Should Receive It?" 
          icon={<Heart className="w-6 h-6 text-rose-400" />}
        >
          <p>
            Fitra is given to the poor and needy so they can celebrate Eid without hardship. Its purpose is to 
            eliminate hunger on the day of Eid and spread happiness across the community. It strengthens 
            unity and ensures that no one is left behind during this joyful occasion.
          </p>
        </LearnCard>
      </main>

      {/* BOTTOM CTA */}
      <footer className="flex justify-center pt-20 pb-10">
         <motion.button
           whileHover={{ scale: 1.05, y: -5 }}
           whileTap={{ scale: 0.95 }}
           onClick={() => navigate("/tools")}
           className="px-10 py-5 bg-emerald-400 text-black text-xs md:text-sm font-black uppercase tracking-[0.3em] rounded-3xl shadow-[0_20px_50px_rgba(52,211,153,0.2)] flex items-center gap-4 group"
         >
            Calculate My Fitra <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
         </motion.button>
      </footer>
    </div>
  );
};
