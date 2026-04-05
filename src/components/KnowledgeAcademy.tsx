import React from "react";
import { motion } from "motion/react";
import { BookOpen, Coins, ArrowRight, ArrowLeft, GraduationCap, Brain, ShieldCheck, Moon, Droplets, Clock, History } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Category {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  desc: string;
  path: string;
  color: string;
  locked?: boolean;
}

export const KnowledgeAcademy: React.FC = () => {
  const navigate = useNavigate();

  const categories: Category[] = [
    {
      id: "zakat",
      title: "Zakat & Wealth",
      subtitle: "The Third Pillar",
      icon: <Coins className="w-8 h-8 text-amber-400" />,
      desc: "Comprehensive guide on Nisab, assets, and purifying your wealth through Zakat.",
      path: "/learn-zakat",
      color: "amber"
    },
    {
      id: "fitra",
      title: "Zakat al-Fitr",
      subtitle: "The Eid Charity",
      icon: <Moon className="w-8 h-8 text-emerald-400" />,
      desc: "Essential rules on Fitra: who must pay, how much to give, and the best time for payment.",
      path: "/learn-fitra",
      color: "emerald"
    },
    {
      id: "wudu",
      title: "Wudu (Ablution)",
      subtitle: "The Key to Salah",
      icon: <Droplets className="w-8 h-8 text-sky-400" />,
      desc: "Learn how to perform Wudu properly, its rules, and the spiritual benefits of purification.",
      path: "/learn-wudu",
      color: "sky"
    },
    {
      id: "salah",
      title: "Salah Guide",
      subtitle: "The Second Pillar",
      icon: <ShieldCheck className="w-8 h-8 text-indigo-400" />,
      desc: "A step-by-step physical and spiritual guide to performing daily prayers correctly.",
      path: "/learn-salah",
      color: "indigo"
    },
    {
      id: "rakah",
      title: "Rak'ah Guide",
      subtitle: "Prayer Units",
      icon: <Clock className="w-8 h-8 text-amber-400" />,
      desc: "Detailed breakdown of Sunnah and Fard units for each of the five daily prayers.",
      path: "/learn-rakah",
      color: "amber"
    }
  ];

  return (
    <div className="min-h-screen pb-40 max-w-6xl mx-auto px-4 md:px-0 space-y-12">
      <header className="space-y-6 flex flex-col items-center text-center py-10">
         <motion.button 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           onClick={() => navigate("/")}
           className="flex items-center gap-3 px-6 py-2.5 glass-button border-white/5 rounded-full text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all group pointer-events-auto"
         >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
         </motion.button>
         
         <div className="space-y-3">
            <div className="flex items-center justify-center gap-3 text-amber-400 mb-2">
               <GraduationCap className="w-6 h-6" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em]">Academy of Wisdom</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-serif italic tracking-tight text-white/95">Knowledge Academy</h1>
            <p className="text-white/30 text-[10px] md:text-xs font-black uppercase tracking-[0.4em] leading-relaxed max-w-2xl mx-auto">
               Purify your heart and mind through structured learning of Islamic principles.
            </p>
         </div>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((cat, idx) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => !cat.locked && navigate(cat.path)}
            className={`p-10 glass-card border-white/5 flex flex-col justify-between group relative overflow-hidden transition-all duration-500 ${
              cat.locked ? "opacity-50 grayscale cursor-not-allowed" : "cursor-pointer hover:border-white/20 hover:scale-[1.02] hover:-translate-y-2"
            }`}
          >
            <div className="relative z-10 space-y-6">
               <div className={`w-16 h-16 rounded-[1.5rem] bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-[10deg] transition-all duration-700`}>
                  {cat.icon}
               </div>
               
               <div>
                  <p className={`text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-1`}>{cat.subtitle}</p>
                  <h3 className="text-2xl font-serif italic text-white/90">{cat.title}</h3>
               </div>
               
               <p className="text-sm text-white/30 leading-relaxed font-bold uppercase tracking-widest">{cat.desc}</p>
            </div>

            {!cat.locked && (
              <div className="mt-8 flex items-center gap-3 text-white/20 group-hover:text-white transition-all text-sm font-black uppercase tracking-widest relative z-10">
                 Explore Lessons <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </div>
            )}

            {cat.locked && (
              <div className="absolute top-6 right-6 px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[8px] font-black uppercase tracking-widest text-white/20">
                 In Development
              </div>
            )}

            <div className="absolute -right-6 -bottom-6 text-9xl opacity-[0.02] pointer-events-none select-none group-hover:opacity-[0.04] transition-opacity">
               {cat.icon}
            </div>
            
            {/* Hover Glow */}
            {!cat.locked && <div className={`absolute inset-0 bg-gradient-to-br from-white/0 to-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`} />}
          </motion.div>
        ))}
      </main>
    </div>
  );
};
