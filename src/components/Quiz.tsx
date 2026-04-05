import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Brain, CheckCircle2, XCircle, ArrowRight, RefreshCcw, 
  Trophy, Star, HelpCircle, LayoutGrid, ListTree, Puzzle,
  ChevronRight, ArrowLeft, History, Calendar, Award, Timer,
  Check, ChevronDown, MoveRight
} from "lucide-react";
import { useWaqt } from "../WaqtContext";
import { useUser } from "../contexts/UserContext";
import quranData from "../data/quran";
import duaData from "../data/duas";

// ─── Types ───────────────────────────────────────────────────────────

type QuizType = "mcq" | "puzzle" | "matching";
type Difficulty = "beginner" | "intermediate" | "advanced";

interface QuizQuestion {
  type: QuizType;
  question?: string;
  instruction?: string;
  options?: string[];
  correct_answer?: string | string[];
  explanation: string;
  words?: string[]; // for puzzle
  correct_sequence?: string[]; // for puzzle
  pairs?: { left: string; right: string }[]; // for matching
  module: string;
}

// ─── Quiz Engine (Simulated AI) ──────────────────────────────────────

const PRAYER_INFO = [
  { name: "Fajr", rakats: 2, time: "Dawn" },
  { name: "Dhuhr", rakats: 4, time: "Noon" },
  { name: "Asr", rakats: 4, time: "Afternoon" },
  { name: "Maghrib", rakats: 3, time: "Sunset" },
  { name: "Isha", rakats: 4, time: "Night" },
];

const generateQuiz = (difficulty: Difficulty, limit: number = 5): QuizQuestion[] => {
  const quiz: QuizQuestion[] = [];
  const modules = ["quran", "duas", "salah"];
  
  for (let i = 0; i < limit; i++) {
    const mod = modules[Math.floor(Math.random() * modules.length)];
    const type: QuizType = i < 2 ? "mcq" : i < 4 ? "puzzle" : "matching";

    if (mod === "salah") {
      if (type === "mcq") {
        const p = PRAYER_INFO[Math.floor(Math.random() * PRAYER_INFO.length)];
        quiz.push({
          type: "mcq",
          question: `How many obligatory Rakats are in ${p.name} prayer?`,
          options: Array.from(new Set(["2", "3", "4", "5", p.rakats.toString()])).slice(0, 4),
          correct_answer: p.rakats.toString(),
          explanation: `${p.name} consists of ${p.rakats} obligatory Rakats performed at ${p.time}.`,
          module: "Salah"
        });
      } else if (type === "puzzle") {
         quiz.push({
           type: "puzzle",
           instruction: "Rearrange the prayer names in order (Day-Cycle)",
           words: ["Asr", "Fajr", "Isha", "Maghrib", "Dhuhr"].sort(() => Math.random() - 0.5),
           correct_sequence: ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"],
           explanation: "The order of daily prayers is Fajr, Dhuhr, Asr, Maghrib, and Isha.",
           module: "Salah"
         });
      } else {
        quiz.push({
          type: "matching",
          pairs: PRAYER_INFO.slice(0, 3).map(p => ({ left: p.name, right: `${p.rakats} Rakats` })),
          explanation: "Each prayer has a specific number of obligatory Rakats.",
          module: "Salah"
        });
      }
    } else if (mod === "quran") {
      const surahs = (quranData as any).data;
      const s = surahs[Math.floor(Math.random() * surahs.length)];
      if (type === "mcq") {
        const altTitles = ["The Criterion", "The Cow", "The Victory", "The Opening", "The Table"];
        const options = Array.from(new Set([s.sub_title, ...altTitles])).filter(x => x !== s.title).slice(0, 4).sort(() => Math.random() - 0.5);
        quiz.push({
          type: "mcq",
          question: `What is the meaning of the Surah title "${s.title}"?`,
          options,
          correct_answer: s.sub_title,
          explanation: `Surah ${s.title} translates to "${s.sub_title}".`,
          module: "Quran"
        });
      } else if (type === "puzzle") {
        const ayat = s.surah_details[0];
        const words = ayat.ayat_transliteration.split(" ").slice(0, 5);
        quiz.push({
          type: "puzzle",
          instruction: `Rearrange the opening words of Surah ${s.title}`,
          words: [...words].sort(() => Math.random() - 0.5),
          correct_sequence: words,
          explanation: `The Ayah begins: "${ayat.ayat_transliteration}"`,
          module: "Quran"
        });
      } else {
        quiz.push({
          type: "matching",
          pairs: surahs.slice(0, 3).map((sr: any) => ({ left: sr.title, right: sr.surah_type })),
          explanation: "Surahs are classified as either Makki or Madani.",
          module: "Quran"
        });
      }
    } else {
      // Duas mod
      const Categories = Object.keys((duaData as any).data);
      const cat = Categories[Math.floor(Math.random() * Categories.length)];
      const duas = (duaData as any).data[cat];
      const d = duas[Math.floor(Math.random() * duas.length)];
      
      if (type === "mcq") {
        const altCats = ["Travel", "Eating", "Sleeping", "Morn & Eve", "Praise"];
        const options = Array.from(new Set([cat, ...altCats])).slice(0, 4).sort(() => Math.random() - 0.5);
        quiz.push({
          type: "mcq",
          question: `Which category does this Dua belong to: "${d.dua_title}"?`,
          options,
          correct_answer: cat,
          explanation: `The Dua "${d.dua_title}" is part of the "${cat}" category.`,
          module: "Duas"
        });
      } else if (type === "puzzle") {
        const words = d.dua_details.dua_transliteration.split(" ").slice(0, 4);
        quiz.push({
          type: "puzzle",
          instruction: "Rearrange the words to form the Dua",
          words: [...words].sort(() => Math.random() - 0.5),
          correct_sequence: words,
          explanation: `Correct sequence: ${d.dua_details.dua_transliteration.split(" ").slice(0, 4).join(" ")}`,
          module: "Duas"
        });
      } else {
        quiz.push({
          type: "matching",
          pairs: duas.slice(0, 2).map((du: any) => ({ left: du.dua_title, right: du.dua_details.repetition + "x" })),
          explanation: "Some Sunnah duas have specific repetition counts.",
          module: "Duas"
        });
      }
    }
  }
  
  return quiz;
};

// ─── Sub-components ──────────────────────────────────────────────────

const MCQ: React.FC<{ 
  q: QuizQuestion; 
  onAnswer: (correct: boolean, choice: any) => void;
  selected?: string;
  isConfirmed: boolean;
}> = ({ q, onAnswer, selected, isConfirmed }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-serif italic text-white/90 leading-relaxed text-center px-4" style={{ fontSize: '20px' }}>{q.question}</h3>
      <div className="grid grid-cols-1 gap-3">
        {q.options?.map((opt, i) => {
          const isCorrect = opt === q.correct_answer;
          const isSelected = opt === selected;
          return (
            <button
              key={i}
              disabled={isConfirmed}
              onClick={() => onAnswer(isCorrect, opt)}
              className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                isConfirmed
                  ? isCorrect 
                    ? "bg-emerald-400/20 border-emerald-400/40 text-emerald-400"
                    : isSelected 
                      ? "bg-rose-400/20 border-rose-400/40 text-rose-400"
                      : "bg-white/5 border-white/5 text-white/20"
                  : isSelected
                    ? "bg-white/10 border-white/30 text-white scale-[1.02]"
                    : "bg-white/5 border-white/5 text-white/60 hover:bg-white/8 hover:scale-[1.01]"
              }`}
            >
              <div className="flex items-center justify-between relative z-10">
                 <span className="text-sm font-bold tracking-wide">{opt}</span>
                 {isConfirmed && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                 {isConfirmed && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-400" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const WordPuzzle: React.FC<{
  q: QuizQuestion;
  onAnswer: (correct: boolean, choice: any) => void;
  isConfirmed: boolean;
}> = ({ q, onAnswer, isConfirmed }) => {
  const [currentWords, setCurrentWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>(q.words || []);

  const handleSelect = (w: string) => {
    if (isConfirmed) return;
    setAvailableWords(p => p.filter(x => x !== w));
    setCurrentWords(p => [...p, w]);
  };

  const handleRemove = (w: string) => {
    if (isConfirmed) return;
    setCurrentWords(p => p.filter(x => x !== w));
    setAvailableWords(p => [...p, w]);
  };

  const check = () => {
    const isCorrect = JSON.stringify(currentWords) === JSON.stringify(q.correct_sequence);
    onAnswer(isCorrect, currentWords.join(" "));
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <p className="text-[10px] uppercase font-black tracking-widest text-[#FFD700]/60">{q.instruction}</p>
        <p className="text-xs text-white/40 italic">Tap words to arrange them</p>
      </div>

      <div className={`p-8 min-h-[160px] rounded-[2.5rem] border-2 border-dashed flex flex-wrap gap-3 items-center justify-center transition-colors ${
        isConfirmed 
          ? (JSON.stringify(currentWords) === JSON.stringify(q.correct_sequence) ? "bg-emerald-400/5 border-emerald-400/20" : "bg-rose-400/5 border-rose-400/20")
          : "bg-white/[0.02] border-white/10"
      }`}>
        {currentWords.length === 0 && !isConfirmed && <span className="text-[10px] font-bold uppercase tracking-widest text-white/10">Start picking words...</span>}
        {currentWords.map((w, i) => (
          <button 
            key={i} onClick={() => handleRemove(w)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xl ${
              isConfirmed 
                ? (q.correct_sequence![i] === w ? "bg-emerald-400 text-black" : "bg-rose-400 text-black")
                : "bg-white text-black hover:scale-105"
            }`}
          >
            {w}
          </button>
        ))}
      </div>

      {!isConfirmed && (
        <div className="flex flex-wrap gap-2 justify-center">
            {availableWords.map((w, i) => (
              <button key={i} onClick={() => handleSelect(w)} className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white/10 border border-white/10 hover:bg-white/20 transition-all active:scale-95">
                {w}
              </button>
            ))}
        </div>
      )}

      {!isConfirmed && currentWords.length === q.correct_sequence?.length && (
         <motion.button 
           initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
           onClick={check}
           className="w-full py-4 bg-[#FFD700] text-black rounded-2xl font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#FFD700]/20"
         >
           Confirm Answer
         </motion.button>
      )}
    </div>
  );
};

const Matching: React.FC<{
  q: QuizQuestion;
  onAnswer: (correct: boolean, choice: any) => void;
  isConfirmed: boolean;
}> = ({ q, onAnswer, isConfirmed }) => {
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [activeLeft, setActiveLeft] = useState<string | null>(null);

  const handleMatch = (right: string) => {
    if (!activeLeft || isConfirmed) return;
    setSelections(p => ({ ...p, [activeLeft]: right }));
    setActiveLeft(null);
  };

  const check = () => {
    const isCorrect = q.pairs?.every(p => selections[p.left] === p.right);
    onAnswer(!!isCorrect, "Completed Matching");
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <p className="text-[10px] uppercase font-black tracking-widest text-[#FFD700]/60">Match the correct pairs</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Left Side */}
        <div className="space-y-2">
          {q.pairs?.map((p, i) => (
            <button 
              key={i} 
              onClick={() => !isConfirmed && setActiveLeft(p.left)}
              className={`w-full p-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                isConfirmed 
                  ? "bg-white/5 border-white/5 text-white/40"
                  : activeLeft === p.left ? "bg-white/60 border-white text-black" : "bg-white/10 border-white/10 text-white"
              }`}
            >
              {p.left}
              {selections[p.left] && <span className="block mt-1 text-[8px] opacity-40">Matched</span>}
            </button>
          ))}
        </div>
        {/* Right Side */}
        <div className="space-y-2">
           {q.pairs?.map((p, i) => (
             <button 
               key={i} 
               disabled={isConfirmed}
               onClick={() => handleMatch(p.right)}
               className={`w-full p-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                 isConfirmed 
                  ? "bg-white/5 border-white/5 text-white/40"
                  : Object.values(selections).includes(p.right) ? "bg-emerald-400/20 border-emerald-400/40 text-emerald-400" : "bg-white/10 border-white/10 text-white"
               }`}
             >
               {p.right}
             </button>
           ))}
        </div>
      </div>

      {!isConfirmed && Object.keys(selections).length === q.pairs?.length && (
         <motion.button 
           initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
           onClick={check}
           className="w-full py-4 bg-[#FFD700] text-black rounded-2xl font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#FFD700]/20"
         >
           Confirm Matching
         </motion.button>
      )}
    </div>
  );
};

interface UserAnswerRecord {
  q: QuizQuestion;
  choice: any;
  isCorrect: boolean;
}

// ─── Main Component ──────────────────────────────────────────────────

const QUIZ_SESSION_KEY = "noor_quiz_session";

export const Quiz: React.FC = () => {
  const { waqt } = useWaqt();
  const { addPoints, setToast, saveQuizResult, quizHistory } = useUser();
  const isAsr = waqt === "Asr";

  const [gameState, setGameState] = useState<"landing" | "playing" | "summary" | "history" | "review">("landing");
  const [difficulty, setDifficulty] = useState<Difficulty>("beginner");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [userAnswers, setUserAnswers] = useState<UserAnswerRecord[]>([]);

  // Persistence (Load)
  useEffect(() => {
    const saved = localStorage.getItem(QUIZ_SESSION_KEY);
    if (saved) {
      try {
        const d = JSON.parse(saved);
        setGameState(d.gameState || "landing");
        if (d.difficulty) setDifficulty(d.difficulty);
        if (d.questions) setQuestions(d.questions);
        if (typeof d.currentIndex === "number") setCurrentIndex(d.currentIndex);
        if (typeof d.score === "number") setScore(d.score);
        if (typeof d.timeLeft === "number") setTimeLeft(d.timeLeft);
        if (d.userAnswers) setUserAnswers(d.userAnswers);
      } catch (e) { console.error("Failed to load quiz session", e); }
    }
  }, []);

  // Persistence (Save)
  useEffect(() => {
    if (gameState === "landing") {
      localStorage.removeItem(QUIZ_SESSION_KEY);
      return;
    }
    localStorage.setItem(QUIZ_SESSION_KEY, JSON.stringify({ 
      gameState, difficulty, questions, currentIndex, score, timeLeft, userAnswers 
    }));
  }, [gameState, difficulty, questions, currentIndex, score, timeLeft, userAnswers]);

  // ⏱️ Timer Logic
  React.useEffect(() => {
    if (gameState !== "playing") return;
    if (timeLeft <= 0) {
      handleAnswer(false, "Timeout");
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, gameState]);

  const startQuiz = () => {
    const q = generateQuiz(difficulty);
    setQuestions(q);
    setCurrentIndex(0);
    setScore(0);
    setTimeLeft(15);
    setUserAnswers([]);
    setGameState("playing");
  };

  const handleAnswer = (correct: boolean, choice: any) => {
    const record: UserAnswerRecord = { q: questions[currentIndex], choice, isCorrect: correct };
    setUserAnswers(prev => [...prev, record]);
    
    const nextScore = correct ? score + 1 : score;
    if (correct) setScore(nextScore);

    // Immediate progression
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1);
      setTimeLeft(15);
    } else {
      finishQuiz(nextScore);
    }
  };

  const finishQuiz = (finalScore: number) => {
    setGameState("summary");
    const rewardPoints = finalScore * 50;
    addPoints(rewardPoints);
    saveQuizResult({
      score: finalScore,
      total: questions.length,
      difficulty,
      pointsEarned: rewardPoints
    });
    setToast({ message: `+${rewardPoints} Progress`, sub: `Completed ${difficulty} Quiz` });
  };

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-3xl mx-auto pb-40">
      <AnimatePresence mode="wait">
        {gameState === "landing" && (
          <motion.div key="landing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="space-y-12">
             <div className="text-center space-y-4">
                <div className={`w-20 h-20 rounded-[2rem] mx-auto flex items-center justify-center shadow-2xl relative ${isAsr ? "bg-[#2FB68E]/10 border border-[#2FB68E]/20" : "bg-white/5 border border-white/10"}`}>
                   <Brain className={`w-10 h-10 ${isAsr ? "text-[#FFD700]" : "text-white"}`} />
                   <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }} transition={{ repeat: Infinity, duration: 3 }} className="absolute -inset-4 border border-white/10 rounded-[2.5rem] pointer-events-none" />
                </div>
                <h1 className="text-5xl font-serif italic text-white/90">Islamic Wisdom Quiz</h1>
                <p className="text-sm text-white/40 max-w-sm mx-auto font-medium tracking-wide">Test your knowledge of the Quran, Duas, and Salah routines with AI-generated challenges.</p>
             </div>

             <div className="space-y-6">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 text-center">Select Difficulty</p>
                <div className="grid grid-cols-3 gap-3">
                   {(['beginner', 'intermediate', 'advanced'] as Difficulty[]).map(d => (
                     <button 
                       key={d} onClick={() => setDifficulty(d)}
                       className={`p-6 rounded-[2rem] border transition-all relative overflow-hidden group ${
                         difficulty === d 
                           ? (isAsr ? "bg-[#FFD700] border-[#FFD700] text-black shadow-lg shadow-[#FFD700]/20" : "bg-white border-white text-black shadow-xl") 
                           : "bg-white/5 border-white/5 text-white/40 hover:bg-white/10"
                       }`}
                     >
                       <span className="text-[10px] font-black uppercase tracking-widest relative z-10">{d}</span>
                       <Star className={`absolute -right-4 -bottom-4 w-16 h-16 transition-transform group-hover:scale-110 opacity-5 ${difficulty === d ? "opacity-10" : ""}`} />
                     </button>
                   ))}
                </div>
             </div>


             <div className="flex gap-4">
                <button onClick={startQuiz} className={`flex-[2] py-6 rounded-[2.5rem] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 transition-all hover:scale-[1.02] active:scale-95 shadow-2xl ${
                  isAsr ? "bg-[#2FB68E] text-black shadow-[#2FB68E]/20" : "bg-emerald-500 text-black shadow-emerald-500/20"
                }`}>
                  Begin Experience <ChevronRight className="w-5 h-5" />
                </button>
                <button onClick={() => setGameState("history")} className="flex-1 py-6 rounded-[2.5rem] bg-white/5 border border-white/10 text-white/60 flex items-center justify-center gap-3 hover:bg-white/10 hover:text-white transition-all">
                   <History className="w-5 h-5" />
                </button>
             </div>
          </motion.div>
        )}

        {gameState === "history" && (
          <motion.div key="history" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-8">
             <header className="flex items-center justify-between">
                <button onClick={() => setGameState("landing")} className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white/60 hover:text-white transition-all">
                   <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="text-right">
                   <h2 className="text-2xl font-serif italic text-white/90">Quiz History</h2>
                   <p className="text-[10px] uppercase font-black tracking-widest text-white/20">Your past sessions</p>
                </div>
             </header>

             <div className="space-y-4">
                {quizHistory.length === 0 ? (
                  <div className="p-20 text-center space-y-4 bg-white/[0.02] rounded-[3rem] border border-dashed border-white/10">
                     <Brain className="w-12 h-12 text-white/10 mx-auto" />
                     <p className="text-xs text-white/20 font-medium italic">No history yet. Start your first quiz!</p>
                  </div>
                ) : (
                  quizHistory.map((item) => (
                    <div key={item.id} className="p-6 glass-card rounded-3xl border-white/5 group hover:bg-white/[0.05] transition-all flex items-center justify-between">
                       <div className="flex items-center gap-5">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                            item.difficulty === 'advanced' ? "bg-rose-400/10 text-rose-400" : 
                            item.difficulty === 'intermediate' ? "bg-[#FFD700]/10 text-[#FFD700]" : "bg-emerald-400/10 text-emerald-400"
                          }`}>
                            <Award className="w-6 h-6" />
                          </div>
                          <div>
                             <p className="text-sm font-bold text-white/90 capitalize">{item.difficulty} Session</p>
                             <div className="flex items-center gap-2 mt-1">
                                <Calendar className="w-3 h-3 text-white/20" />
                                <span className="text-[10px] font-medium text-white/30">{new Date(item.date).toLocaleDateString()}</span>
                             </div>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-xl font-mono font-black text-white">{item.score}<span className="text-white/20">/{item.total}</span></p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">+{item.pointsEarned} XP</p>
                       </div>
                    </div>
                  ))
                )}
             </div>
          </motion.div>
        )}

        {gameState === "playing" && currentQ && (
          <motion.div key="playing" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
            <header className="flex items-center justify-between px-2">
               <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Progress</span>
                  <span className="text-xl font-mono font-black">{currentIndex + 1} <span className="text-white/20">/ {questions.length}</span></span>
               </div>
               <div className={`flex items-center gap-3 px-5 py-2 rounded-2xl border ${timeLeft < 5 ? "bg-rose-500/10 border-rose-500/20 text-rose-500" : "bg-white/5 border-white/10 text-white/60"}`}>
                  <Timer className={`w-4 h-4 ${timeLeft < 5 ? "animate-pulse" : ""}`} />
                  <span className="text-sm font-mono font-black">{timeLeft}s</span>
               </div>
               <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#FFD700]/60">{currentQ.module}</span>
                  <span className="text-xs font-bold text-white/60">{difficulty} level</span>
               </div>
            </header>

            <div className={`w-full h-1.5 rounded-full overflow-hidden ${isAsr ? "bg-[#2FB68E]/5" : "bg-white/5"}`}>
               <motion.div 
                 initial={{ width: 0 }} 
                 animate={{ width: `${questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0}%` }}
                 transition={{ type: "spring", stiffness: 50 }}
                 className={`h-full transition-all ${isAsr ? "bg-[#FFD700]" : "bg-emerald-400"}`} 
               />
            </div>

            <div className={`p-8 md:p-12 glass-card rounded-[3rem] border-white/5 relative overflow-hidden transition-all shadow-2xl`}>
              {currentQ.type === "mcq" && (
                <MCQ q={currentQ} onAnswer={handleAnswer} isConfirmed={false} />
              )}
              {currentQ.type === "puzzle" && (
                <WordPuzzle q={currentQ} onAnswer={handleAnswer} isConfirmed={false} />
              )}
              {currentQ.type === "matching" && (
                <Matching q={currentQ} onAnswer={handleAnswer} isConfirmed={false} />
              )}
            </div>
          </motion.div>
        )}

        {gameState === "summary" && (
          <motion.div key="summary" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-12 py-10">
             <div className="space-y-6">
                <div className="w-32 h-32 bg-amber-400/20 rounded-[3rem] flex items-center justify-center mx-auto mb-10 border border-amber-400/30 relative">
                   <Trophy className="w-16 h-16 text-amber-400" />
                   <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 20, ease: "linear" }} className="absolute -inset-4 border border-dashed border-amber-400/20 rounded-[3.5rem] pointer-events-none" />
                </div>
                <h2 className="text-5xl font-serif italic text-white/95">SubhanAllah!</h2>
                <p className="text-white/40 font-medium italic">You've completed the {difficulty} path.</p>
             </div>

             <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
                <div className="p-8 glass-card border-white/5 rounded-3xl space-y-2">
                   <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Score</p>
                   <p className="text-4xl font-mono font-black text-white">{score} / {questions.length}</p>
                </div>
                <div className="p-8 glass-card border-amber-400/10 rounded-3xl space-y-2">
                   <p className="text-[10px] font-black uppercase tracking-widest text-amber-400/60">Points Earned</p>
                   <p className="text-4xl font-mono font-black text-amber-400">+{score * 50}</p>
                </div>
             </div>

             <div className="p-10 glass-card bg-[#FFD700]/5 border-[#FFD700]/10 rounded-[3rem] space-y-4">
                <HelpCircle className="w-8 h-8 text-[#FFD700]/40 mx-auto" />
                <p className="text-xs text-white/60 leading-relaxed font-medium">Keep practicing daily to strengthen your connection and earn more points for your journey.</p>
             </div>

              <div className="flex flex-col gap-4">
                <button onClick={() => setGameState("review")} className={`w-full py-6 rounded-[2.5rem] font-black uppercase tracking-[0.3em] transition-all hover:scale-105 active:scale-95 shadow-xl ${isAsr ? "bg-[#FFD700] text-black" : "bg-white/10 text-white border border-white/10"}`}>
                   Detailed Review
                </button>
                <div className="flex gap-4">
                  <button onClick={startQuiz} className={`flex-1 py-4 rounded-2xl font-black uppercase tracking-widest bg-emerald-500 text-black`}>
                     Try Again
                  </button>
                  <button onClick={() => setGameState("landing")} className={`flex-1 py-4 rounded-2xl font-black uppercase tracking-widest bg-white/5 text-white/40`}>
                     Home
                  </button>
                </div>
              </div>
          </motion.div>
        )}

        {gameState === "review" && (
          <motion.div key="review" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
             <header className="flex items-center justify-between">
                <button onClick={() => setGameState("summary")} className="p-4 rounded-2xl bg-white/5 border border-white/10">
                   <ArrowLeft className="w-5 h-5" />
                </button>
                <h3 className="text-2xl font-serif italic">Personal Review</h3>
             </header>

             <div className="space-y-6">
                {userAnswers.map((item, i) => (
                  <div key={i} className={`p-8 glass-card rounded-[2.5rem] border ${item.isCorrect ? "border-emerald-400/20" : "border-rose-400/20"} space-y-6`}>
                     <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                           <span className="text-[9px] font-black uppercase tracking-widest text-white/20">Question {i+1}</span>
                           <h4 className="text-base font-serif italic text-white/90">{item.q.question || item.q.instruction}</h4>
                        </div>
                        {item.isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> : <XCircle className="w-5 h-5 text-rose-400 shrink-0" />}
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-white/5 rounded-2xl space-y-1">
                           <p className="text-[8px] font-black uppercase tracking-widest text-white/30">Your Answer</p>
                           <p className={`text-xs font-bold ${item.isCorrect ? "text-emerald-400" : "text-rose-400"}`}>
                             {item.choice === "Timeout" ? "Time Expired" : item.choice}
                           </p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-2xl space-y-1">
                           <p className="text-[8px] font-black uppercase tracking-widest text-white/30">Correct Answer</p>
                           <p className="text-xs font-bold text-emerald-400">{Array.isArray(item.q.correct_answer) ? item.q.correct_answer.join(", ") : item.q.correct_answer || "Complete Sequence"}</p>
                        </div>
                     </div>

                     <div className="p-5 bg-[#FFD700]/5 border border-[#FFD700]/10 rounded-2xl">
                        <p className="text-[8px] font-black uppercase tracking-widest text-[#FFD700]/60 mb-2">Deep Wisdom</p>
                        <p className="text-xs text-white/60 leading-relaxed italic">{item.q.explanation}</p>
                     </div>
                  </div>
                ))}
             </div>

             <button onClick={() => setGameState("landing")} className="w-full py-6 bg-white text-black rounded-[2.5rem] font-black uppercase tracking-[0.3em]">
                Back to Dashboard
             </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
