import React from "react";
import { motion } from "motion/react";
import { 
  HelpCircle, 
  Coins, 
  PlusCircle, 
  MinusCircle, 
  Calculator, 
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
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
    className="glass-card p-6 md:p-10 border-white/5 space-y-6 relative group overflow-hidden"
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

    <div className="text-[14px] md:text-[18px] lg:text-[20px] text-white/60 leading-[1.8] font-medium relative z-10 whitespace-normal break-words">
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

export const LearnZakat: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-40 max-w-4xl mx-auto px-4 md:px-0 space-y-12">
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
            <h1 className="text-4xl md:text-5xl font-serif italic tracking-tight text-white/95">Learn About Zakat</h1>
            <p className="text-white/30 text-[10px] md:text-xs font-black uppercase tracking-[0.4em] leading-relaxed max-w-2xl mx-auto">
               "Establish prayer and pay Zakat, and whatever good you send forth for yourselves, you will find it with Allah."
            </p>
         </div>
      </header>

      <main className="space-y-8">
        {/* CARD 1: NISAB */}
        <LearnCard 
          title="What is Nisab?" 
          icon={<ShieldCheck className="w-6 h-6 text-amber-400" />}
          tooltip="Nisab is the minimum wealth required before Zakat becomes obligatory."
          hadith="No Zakat is due on property until a year passes over it."
          source="Sunan Ibn Majah"
        >
          <p>
            Nisab is the minimum amount of wealth a person must possess for a full lunar year before Zakat becomes mandatory. 
            There are two benchmarks: the value of <span className="text-amber-400">88.7 grams of gold</span> or <span className="text-slate-400">612.36 grams of silver</span>. 
            If your net wealth is equal to or more than this threshold, you are obligated to pay <span className="text-emerald-400 font-bold">2.5%</span> of your total wealth. 
            Standardly, if you have any silver ornaments or cash savings, the silver standard is used to benefit the poor by setting a lower threshold.
          </p>
        </LearnCard>

        {/* CARD 2: ASSETS */}
        <LearnCard 
          title="Zakatable Assets" 
          icon={<PlusCircle className="w-6 h-6 text-emerald-400" />}
          hadith="Whoever is made wealthy by Allah and does not pay the Zakat..."
          source="Sahih al-Bukhari"
        >
          <div className="space-y-4">
            <p>
              Zakat is due on various forms of wealth. This includes cash you have in hand or in bank accounts, precious metals like 
              gold and silver, and liquid business assets. 
            </p>
            <div className="p-5 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-start gap-4">
               <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-1" />
               <p className="text-[13px] md:text-base text-rose-300 font-bold uppercase tracking-tight">
                  IMPORTANT: Interest earnings from bank savings are forbidden (Haram) and must NEVER be included in your Zakat calculation.
               </p>
            </div>
            <ul className="list-disc list-inside space-y-2 opacity-80 decoration-emerald-400">
               <li>Personal cash and savings (exclude interest)</li>
               <li>Gold, Silver, and valuable jewelry</li>
               <li>Stocks, Bonds, Bonds, and Cryptocurrency</li>
               <li>Business stock and inventory</li>
               <li>Crops (10% Zakat for rain-fed, 5% for irrigated)</li>
            </ul>
          </div>
        </LearnCard>

        {/* CARD 3: LIABILITIES */}
        <LearnCard 
          title="Liabilities (Deductions)" 
          icon={<MinusCircle className="w-6 h-6 text-rose-400" />}
          hadith="The best charity is that given when one is self-sufficient..."
          source="Sahih al-Bukhari"
        >
          <p>
            You can deduct your current, immediate liabilities from your total assets. This includes personal debts, unpaid utility bills, 
            rent, and salaries due to workers. However, <span className="text-rose-400 font-bold">only current liabilities</span> qualify; 
            future payments or long-term mortgage principal sums should not be deducted. Interest on loans is also excluded from 
            liability deductions.
          </p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
             {[
               "Household bills (Rent, Utilities)",
               "Borrowed money (Current)",
               "Business property liabilities",
               "Due Insurance payments",
               "Social obligations (Mahr, etc.)"
             ].map(item => (
               <div key={item} className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-xl border border-white/5">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                  <span className="text-xs font-bold text-white/50">{item}</span>
               </div>
             ))}
          </div>
        </LearnCard>

        {/* CARD 4: FINAL CALCULATION */}
        <LearnCard 
          title="How to Calculate Zakat" 
          icon={<Calculator className="w-6 h-6 text-indigo-400" />}
          hadith="Take from their wealth a charity by which you purify them..."
          source="Qur’an 9:103"
        >
          <p>
            Calculating Zakat is a simple four-step process. Once you understand these steps, you can ensure your wealth is purified 
            exactly as required by Islam:
          </p>
          <div className="mt-8 space-y-6">
             {[
               { s: 1, t: "Sum Assets", d: "Add up everything you own (Cash, Metal, Business inventory)." },
               { s: 2, t: "Subtract Debts", d: "Deduct only current liabilities that are due right now." },
               { s: 3, t: "Check Nisab", d: "If your net amount is above the threshold (88.7g Gold/612.36g Silver)." },
               { s: 4, t: "Calculate 2.5%", d: "Pay 2.5% of the net amount as your Zakat obligation." }
             ].map(step => (
                <div key={step.s} className="flex gap-6 items-start">
                   <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0 border border-indigo-500/20 text-indigo-400 font-mono font-black">
                      {step.s}
                   </div>
                   <div className="space-y-1">
                      <p className="text-xs font-black uppercase tracking-widest text-white/90">{step.t}</p>
                      <p className="text-[11px] md:text-sm text-white/40 leading-relaxed font-bold uppercase tracking-widest">{step.d}</p>
                   </div>
                </div>
             ))}
          </div>
        </LearnCard>
      </main>

      <footer className="flex justify-center pt-20 pb-10">
         <motion.button
           whileHover={{ scale: 1.05, y: -5 }}
           whileTap={{ scale: 0.95 }}
           onClick={() => navigate("/tools")}
           className="px-10 py-5 bg-amber-400 text-black text-xs md:text-sm font-black uppercase tracking-[0.3em] rounded-3xl shadow-[0_20px_50px_rgba(251,191,36,0.2)] flex items-center gap-4 group"
         >
            Calculate My Zakat <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
         </motion.button>
      </footer>
    </div>
  );
};
