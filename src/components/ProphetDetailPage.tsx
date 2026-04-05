import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft, 
  Bookmark, 
  Volume2, 
  Share2, 
  BookOpen, 
  ChevronDown,
  Quote,
  Sparkles,
  History
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { PROPHETS, ProphetStorySection } from "../data/prophets";
import { PROPHET_STORIES } from "../data/prophetStories";

const StoryCard: React.FC<{ section: ProphetStorySection, index: number, color: string }> = ({ section, index, color }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: isEven ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-16 py-12 ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
    >
      {/* Calligraphy / Illustration Circle */}
      <div className="w-full lg:w-1/3 flex justify-center">
         <motion.div 
           whileHover={{ scale: 1.05, rotate: isEven ? 5 : -5 }}
           className={`w-48 h-48 md:w-64 md:h-64 rounded-[3rem] ${color}/10 border border-white/10 flex items-center justify-center relative group overflow-hidden shadow-2xl glass-card`}
         >
            <div className={`absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-40 group-hover:opacity-100 transition-opacity`} />
            <div className="absolute inset-0 flex items-center justify-center">
               <span className="text-8xl md:text-9xl font-serif italic opacity-[0.02] select-none uppercase">Story</span>
            </div>
            <span className="text-7xl md:text-8xl lg:text-9xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-700 relative z-10 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
               {section.emoji}
            </span>
         </motion.div>
      </div>

      {/* Text Content */}
      <div className="w-full lg:w-2/3 space-y-6">
         <div className="space-y-4">
            <h3 className="text-3xl md:text-4xl font-serif italic text-white/90 tracking-tight">
               {section.emoji} {section.title}
            </h3>
            <div className="w-16 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
         </div>

         <div className="relative group">
            <p className={`text-[15px] md:text-[18px] lg:text-[20px] text-white/60 leading-[1.8] font-medium transition-all duration-500 ${!isExpanded ? 'line-clamp-[6]' : ''}`}>
               {section.story}
            </p>
         </div>

         <button 
           onClick={() => setIsExpanded(!isExpanded)}
           className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-white transition-all group/btn"
         >
            {isExpanded ? 'Read Less' : 'Read Full Section'}
            <ChevronDown className={`w-4 h-4 transition-transform duration-500 ${isExpanded ? 'rotate-180' : ''} group-hover/btn:translate-y-0.5`} />
         </button>
      </div>
    </motion.div>
  );
};

export const ProphetDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  const prophet = PROPHETS.find(p => p.slug === slug);
  const story = PROPHET_STORIES[slug || ""];

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setReadingProgress(scrolled);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!prophet) return <div>Prophet not found</div>;

  return (
    <div className="min-h-screen">
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-white/5 z-[60]">
         <div 
           className={`h-full ${prophet.color} transition-all duration-300 shadow-[0_0_10px_rgba(255,255,255,0.2)]`} 
           style={{ width: `${readingProgress}%` }}
         />
      </div>

      {/* Sticky Header */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-7xl z-50 px-6 py-4 glass-navbar rounded-[2rem] border border-white/10 flex items-center justify-between shadow-2xl backdrop-blur-3xl">
         <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate("/prophets")}
              className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-all group"
            >
               <ArrowLeft className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" />
            </button>
            <div className="hidden md:block">
               <h2 className="text-xl font-serif italic text-white/90">Prophet {prophet.name}</h2>
               <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">{prophet.arabicNameFull}</p>
            </div>
         </div>

         <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`p-3 rounded-full transition-all group ${isBookmarked ? 'bg-amber-400 text-black' : 'bg-white/5 text-white/40 hover:text-white hover:bg-white/10'}`}
            >
               <Bookmark className="w-5 h-5" />
            </button>
            <button className="p-3 bg-white/5 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-all border border-white/5">
               <Volume2 className="w-5 h-5" />
            </button>
            <button className="p-3 bg-white/5 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-all border border-white/5">
               <Share2 className="w-5 h-5" />
            </button>
         </div>
      </header>

      {/* Hero Section */}
      <section className="pt-40 md:pt-60 pb-20 px-6 text-center space-y-10">
         <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 1 }}
           className="space-y-6"
         >
            <div className="flex items-center justify-center gap-3 text-amber-400 mb-2">
                <Sparkles className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Life Story & Legacy</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-serif italic tracking-tight text-white/95">{prophet.name}</h1>
            <p className="text-3xl md:text-4xl text-white/10 font-bold uppercase tracking-[0.1em]">{prophet.arabicNameFull}</p>
         </motion.div>
         
         <div className="max-w-2xl mx-auto flex flex-col items-center gap-4">
            <div className="w-[1px] h-20 bg-gradient-to-b from-white/20 to-transparent" />
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">Begin the Journey</p>
         </div>
      </section>

      {/* Story Sections */}
      <main className="max-w-6xl mx-auto px-6 space-y-12">
        {story ? (
           story.sections.map((section, idx) => (
             <StoryCard key={idx} section={section} index={idx} color={prophet.color} />
           ))
        ) : (
           <div className="py-40 flex flex-col items-center justify-center text-center space-y-8 glass-card rounded-[3rem] border-white/5 bg-white/[0.02]">
              <div className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center">
                 <History className="w-8 h-8 text-white/10" />
              </div>
              <div className="space-y-4">
                 <h2 className="text-3xl font-serif italic text-white/20">Story in preparation...</h2>
                 <p className="text-[11px] font-black uppercase tracking-widest text-white/10 max-w-sm leading-loose">
                    We are currently structuring the divine legacy of Prophet {prophet.name}. <br />Check back daily for new content.
                 </p>
              </div>
              <button 
                onClick={() => navigate("/prophets")}
                className="px-10 py-4 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all"
              >
                 Return to List
              </button>
           </div>
        )}

        {/* Closing Quote */}
        {story && (
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="py-40 text-center space-y-8 border-t border-white/5 flex flex-col items-center"
          >
             <Quote className={`w-12 h-12 opacity-20 ${prophet.color.replace('bg-', 'text-')}`} />
             <p className="max-w-4xl mx-auto text-xl md:text-3xl font-serif italic text-white/70 leading-relaxed px-4">
                The life of Prophet {prophet.name} is a guiding light for every soul seeking truth, patience, and absolute devotion to the Creator.
             </p>
             <div className="pt-10 flex flex-col items-center gap-12">
                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="px-8 py-3 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all"
                >
                   Back to Top
                </button>

                {/* Next Prophet Button (Circular Navigation) */}
                <div className="w-full max-w-lg mt-10">
                   <button 
                     onClick={() => {
                        const currentIndex = PROPHETS.findIndex(p => p.slug === slug);
                        const nextProphet = PROPHETS[(currentIndex + 1) % PROPHETS.length];
                        navigate(`/prophets/${nextProphet.slug}`);
                        window.scrollTo(0, 0);
                     }}
                     className="w-full p-8 glass-card rounded-[2.5rem] border-white/10 group flex items-center justify-between hover:border-white/20 transition-all shadow-2xl relative overflow-hidden"
                   >
                     {/* Hover Background Glow */}
                     <div className={`absolute inset-0 bg-gradient-to-r from-transparent to-${prophet.color.replace('bg-', '')}/10 opacity-0 group-hover:opacity-100 transition-opacity`} />
                     
                     <div className="relative z-10 flex items-center gap-6">
                        <div className={`w-16 h-16 rounded-2xl ${prophet.color}/20 flex items-center justify-center text-3xl group-hover:rotate-12 transition-all duration-700`}>
                           {PROPHETS[(PROPHETS.findIndex(p => p.slug === slug) + 1) % PROPHETS.length].emoji}
                        </div>
                        <div className="text-left">
                           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-1">Continute Journey</p>
                           <h3 className="text-2xl font-serif italic text-white/90">
                              Read About Prophet {PROPHETS[(PROPHETS.findIndex(p => p.slug === slug) + 1) % PROPHETS.length].name}
                           </h3>
                        </div>
                     </div>
                     <ArrowLeft className="w-6 h-6 text-white/40 rotate-180 group-hover:translate-x-2 transition-transform" />
                   </button>
                </div>
             </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};
