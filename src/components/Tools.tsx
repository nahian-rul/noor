import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Coins, Users, ArrowRight, Landmark, Building2, Briefcase,
  MinusCircle, PlusCircle, Globe, ChevronDown, CheckCircle2,
  AlertCircle, ShieldCheck, HelpCircle, ArrowLeft, RefreshCcw,
  Wheat, Moon, Star
} from "lucide-react";
import { CURRENCIES, detectCurrency, formatCurrency, saveCurrency, type Currency } from "../lib/currency";
import { Brain } from "lucide-react";
import { Quiz } from "./Quiz";

const NISAB_WEIGHTS = { GOLD: 87.48, SILVER: 612.36 };

const FOOD_TYPES = [
  { id: "rice",  label: "Rice",  icon: "🍚", defaultPrice: "60" },
  { id: "wheat", label: "Wheat", icon: "🌾", defaultPrice: "45" },
  { id: "dates", label: "Dates", icon: "🌴", defaultPrice: "200" },
];

// ─── Shared sub-components ───────────────────────────────────────────

const CurrencySwitcher: React.FC<{ currency: Currency; onSelect: (code: string) => void }> = ({ currency, onSelect }) => (
  <div className="relative group z-50">
    <div className="flex items-center gap-3 px-4 py-2 bg-white/10 border border-white/20 rounded-full hover:bg-white/15 transition-all cursor-pointer">
      <Globe className="w-3.5 h-3.5 text-white/40" />
      <span className="text-[10px] font-bold tracking-widest">{currency.code}</span>
      <ChevronDown className="w-3.5 h-3.5 text-white/20" />
    </div>
    <div className="absolute right-0 top-full mt-2 w-52 bg-[#0D0D11] border border-white/10 rounded-2xl hidden group-hover:block overflow-hidden shadow-2xl">
      {Object.values(CURRENCIES).map((c) => (
        <button
          key={c.code}
          onClick={() => onSelect(c.code)}
          className={`w-full text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-colors flex items-center justify-between ${
            currency.code === c.code ? "text-amber-400 bg-amber-400/5" : "text-white/60"
          }`}
        >
          <span>{c.name}</span>
          <span className="font-mono">{c.symbol}</span>
        </button>
      ))}
    </div>
  </div>
);

const CardWrapper: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
  <div className="p-8 bg-white/5 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 h-full flex flex-col group hover:bg-white/[0.07] transition-all">
    <div className="flex items-center gap-4 mb-8">
      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold font-serif italic text-white/90 tracking-tight">{title}</h3>
    </div>
    <div className="flex-1">{children}</div>
  </div>
);

const PriceInput: React.FC<{ label: string; hint: string; value: string; onChange: (v: string) => void; symbol: string }> = ({ label, hint, value, onChange, symbol }) => (
  <div className="space-y-2">
    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 pl-1">{label}</label>
    <div className="relative group">
      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-sm font-bold font-mono text-white/30 group-focus-within:text-amber-400 transition-colors">{symbol}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0.00"
        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-lg font-bold font-mono focus:outline-none focus:border-white/30 transition-all"
      />
    </div>
    <p className="text-[10px] text-white/20 italic pl-1">{hint}</p>
  </div>
);

const Field: React.FC<{ label: string; value: string; onChange: (v: string) => void; symbol: string; tooltip?: string }> = ({ label, value, onChange, symbol, tooltip }) => {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 pl-1">
        <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">{label}</label>
        {tooltip && (
          <div className="group/tip relative">
            <HelpCircle className="w-3 h-3 text-white/10 cursor-help" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 p-2 bg-black/90 text-[9px] text-white/60 rounded-xl leading-relaxed opacity-0 group-hover/tip:opacity-100 transition-all pointer-events-none z-50 border border-white/10 font-medium">
              {tooltip}
            </div>
          </div>
        )}
      </div>
      <div className={`relative group transition-all duration-300 ${isFocused ? "scale-[1.02]" : ""}`}>
        <span className={`absolute left-5 top-1/2 -translate-y-1/2 text-sm font-bold font-mono transition-colors ${isFocused ? "text-white" : "text-white/20"}`}>{symbol}</span>
        <input
          type="number"
          value={value}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0.00"
          className={`w-full bg-white/5 border rounded-2xl py-4 pl-12 pr-4 text-lg font-bold font-mono focus:outline-none transition-all ${isFocused ? "border-white/30 bg-white/10" : "border-white/10"}`}
        />
      </div>
    </div>
  );
};

// ─── Zakat Module ─────────────────────────────────────────────────────

const ZAKAT_STORAGE_KEY = "noor_zakat_data";

const ZakatModule: React.FC<{ currency: Currency }> = ({ currency }) => {
  const [step, setStep] = useState<0 | 1>(0);
  const [nisabType, setNisabType] = useState<"GOLD" | "SILVER">("GOLD");
  const [metalPrices, setMetalPrices] = useState({ gold: "8500", silver: "120" });
  const [assets, setAssets] = useState({ cash: "", savings: "", goldSilverValue: "", investments: "", businessAssets: "", rentalIncome: "", others: "" });
  const [liabilities, setLiabilities] = useState({ loans: "", installments: "", bills: "", creditCard: "", taxes: "", others: "" });

  // Persistence (Load)
  useEffect(() => {
    const saved = localStorage.getItem(ZAKAT_STORAGE_KEY);
    if (saved) {
      try {
        const d = JSON.parse(saved);
        if (d.nisabType) setNisabType(d.nisabType);
        if (d.metalPrices) setMetalPrices(d.metalPrices);
        if (d.assets) setAssets(d.assets);
        if (d.liabilities) setLiabilities(d.liabilities);
      } catch (e) { console.error("Failed to load zakat data", e); }
    }
  }, []);

  // Persistence (Save)
  useEffect(() => {
    localStorage.setItem(ZAKAT_STORAGE_KEY, JSON.stringify({ nisabType, metalPrices, assets, liabilities }));
  }, [nisabType, metalPrices, assets, liabilities]);

  const calc = useMemo(() => {
    const goldP = parseFloat(metalPrices.gold) || 0;
    const silverP = parseFloat(metalPrices.silver) || 0;
    const nisabThreshold = nisabType === "GOLD" ? goldP * NISAB_WEIGHTS.GOLD : silverP * NISAB_WEIGHTS.SILVER;
    const totalAssets = Object.values(assets).reduce((a, v) => a + (parseFloat(v) || 0), 0);
    const totalLiabilities = Object.values(liabilities).reduce((a, v) => a + (parseFloat(v) || 0), 0);
    const netWealth = Math.max(0, totalAssets - totalLiabilities);
    const isEligible = netWealth >= nisabThreshold && nisabThreshold > 0;
    return { nisabThreshold, totalAssets, totalLiabilities, netWealth, isEligible, zakatPayable: isEligible ? netWealth * 0.025 : 0 };
  }, [metalPrices, nisabType, assets, liabilities]);

  return (
    <AnimatePresence mode="wait">
      {step === 0 ? (
        <motion.div key="z0" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex justify-center py-8">
          <div className="w-full max-w-xl p-10 bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/10 shadow-2xl space-y-10">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-amber-400/20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-amber-400/20">
                <Coins className="w-8 h-8 text-amber-400" />
              </div>
              <h2 className="text-3xl font-serif italic text-white/90">Set Nisab Values</h2>
              <p className="text-sm text-white/40 max-w-xs mx-auto">Enter current market price to determine your Zakat threshold.</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <PriceInput label="Gold Price" hint={`per gram (${currency.symbol})`} value={metalPrices.gold} onChange={(v) => setMetalPrices(p => ({ ...p, gold: v }))} symbol={currency.symbol} />
              <PriceInput label="Silver Price" hint={`per gram (${currency.symbol})`} value={metalPrices.silver} onChange={(v) => setMetalPrices(p => ({ ...p, silver: v }))} symbol={currency.symbol} />
            </div>

            <div className="space-y-4">
              <p className="text-[10px] uppercase font-bold tracking-widest text-white/30 text-center">Benchmark Method</p>
              <div className="flex p-1 bg-black/20 rounded-2xl border border-white/5">
                <button onClick={() => setNisabType("GOLD")} className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${nisabType === "GOLD" ? "bg-amber-400 text-black" : "text-white/40 hover:text-white"}`}>Gold Standard</button>
                <button onClick={() => setNisabType("SILVER")} className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${nisabType === "SILVER" ? "bg-white text-black" : "text-white/40 hover:text-white"}`}>Silver Standard</button>
              </div>
              <p className="text-[9px] text-white/20 text-center italic">Nisab: {nisabType === "GOLD" ? "87.48g of Gold" : "612.36g of Silver"}</p>
            </div>

            <button onClick={() => setStep(1)} className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-amber-400 transition-all flex items-center justify-center gap-3 active:scale-95">
              Next Step <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div key="z1" initial={{ opacity: 0, scale: 1.02 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 whitespace-nowrap">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-white/40">Gold: {currency.symbol}{metalPrices.gold}/g</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 whitespace-nowrap">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-white/40">Silver: {currency.symbol}{metalPrices.silver}/g</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-amber-400/10 rounded-full border border-amber-400/20 whitespace-nowrap">
              <CheckCircle2 className="w-3 h-3 text-amber-400" />
              <span className="text-[9px] font-black uppercase tracking-widest text-amber-400">Threshold: {formatCurrency(calc.nisabThreshold, currency)}</span>
            </div>
            <button onClick={() => setStep(0)} className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 whitespace-nowrap hover:bg-white/10 transition-all">
              <ArrowLeft className="w-3 h-3 text-white/30" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-white/40">Edit</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative pb-40 lg:pb-0">
            {/* Assets */}
            <div className="lg:col-span-4">
              <CardWrapper title="Your Assets" icon={<PlusCircle className="w-5 h-5 text-emerald-400" />}>
                <div className="space-y-4">
                  <Field label="Cash & Bank Balance" value={assets.cash} onChange={(v) => setAssets(p => ({ ...p, cash: v }))} symbol={currency.symbol} tooltip="All physical cash and liquid savings." />
                  <Field label="Gold & Silver Value" value={assets.goldSilverValue} onChange={(v) => setAssets(p => ({ ...p, goldSilverValue: v }))} symbol={currency.symbol} tooltip="Current market value of metals you own." />
                  <Field label="Stock Investments" value={assets.investments} onChange={(v) => setAssets(p => ({ ...p, investments: v }))} symbol={currency.symbol} />
                  <Field label="Business Assets" value={assets.businessAssets} onChange={(v) => setAssets(p => ({ ...p, businessAssets: v }))} symbol={currency.symbol} />
                  <Field label="Rental Income" value={assets.rentalIncome} onChange={(v) => setAssets(p => ({ ...p, rentalIncome: v }))} symbol={currency.symbol} />
                  <Field label="Other Assets" value={assets.others} onChange={(v) => setAssets(p => ({ ...p, others: v }))} symbol={currency.symbol} />
                </div>
                <div className="mt-6 pt-5 border-t border-white/5 flex justify-between items-center text-emerald-400">
                  <span className="text-[10px] font-black uppercase tracking-widest">Total Assets</span>
                  <span className="text-xl font-mono font-bold">{formatCurrency(calc.totalAssets, currency)}</span>
                </div>
              </CardWrapper>
            </div>

            {/* Liabilities */}
            <div className="lg:col-span-4">
              <CardWrapper title="Debts & Expenses" icon={<MinusCircle className="w-5 h-5 text-rose-400" />}>
                <div className="space-y-4">
                  <Field label="Personal Loans" value={liabilities.loans} onChange={(v) => setLiabilities(p => ({ ...p, loans: v }))} symbol={currency.symbol} tooltip="Money owed to individuals or banks." />
                  <Field label="Business Installments" value={liabilities.installments} onChange={(v) => setLiabilities(p => ({ ...p, installments: v }))} symbol={currency.symbol} />
                  <Field label="Bills Due (Rent/Utilities)" value={liabilities.bills} onChange={(v) => setLiabilities(p => ({ ...p, bills: v }))} symbol={currency.symbol} />
                  <Field label="Credit Card Dues" value={liabilities.creditCard} onChange={(v) => setLiabilities(p => ({ ...p, creditCard: v }))} symbol={currency.symbol} />
                  <Field label="Taxes Payable" value={liabilities.taxes} onChange={(v) => setLiabilities(p => ({ ...p, taxes: v }))} symbol={currency.symbol} />
                  <Field label="Other Liabilities" value={liabilities.others} onChange={(v) => setLiabilities(p => ({ ...p, others: v }))} symbol={currency.symbol} />
                </div>
                <div className="mt-6 pt-5 border-t border-white/5 flex justify-between items-center text-rose-400">
                  <span className="text-[10px] font-black uppercase tracking-widest">Total Liabilities</span>
                  <span className="text-xl font-mono font-bold">{formatCurrency(calc.totalLiabilities, currency)}</span>
                </div>
                <div className="mt-4 p-3 bg-rose-400/5 rounded-2xl border border-rose-400/10 flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-rose-400/60 mt-0.5 shrink-0" />
                  <p className="text-[9px] text-white/40 leading-relaxed font-bold uppercase tracking-widest">Interest payments should not be included.</p>
                </div>
              </CardWrapper>
            </div>

            {/* Summary — sticky on desktop, fixed bottom sheet on mobile */}
            <div className="lg:col-span-4 fixed bottom-0 left-0 right-0 lg:sticky lg:top-8 z-50 lg:z-10 p-4 lg:p-0">
              <motion.div layout className="p-6 lg:p-8 bg-[#181821]/95 lg:bg-[#181821] backdrop-blur-2xl lg:backdrop-blur-none rounded-t-[2.5rem] lg:rounded-[2.5rem] border border-white/10 shadow-2xl space-y-6 lg:space-y-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-[0.02] pointer-events-none">
                  <Coins className="w-40 h-40" />
                </div>
                <h3 className="text-xl font-serif italic text-white/90 relative">Zakat Summary</h3>
                <div className="space-y-4 relative">
                  <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                    <span className="text-white/20">Total Assets</span>
                    <span className="text-emerald-400 font-mono">{formatCurrency(calc.totalAssets, currency)}</span>
                  </div>
                  <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                    <span className="text-white/20">Total Liabilities</span>
                    <span className="text-rose-400 font-mono">{formatCurrency(calc.totalLiabilities, currency)}</span>
                  </div>
                  <div className="flex justify-between items-end py-4 border-y border-white/5">
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30">Net Wealth</span>
                      <p className="text-[8px] text-white/20">(Assets − Debts)</p>
                    </div>
                    <span className="text-2xl font-mono font-black text-white/90">{formatCurrency(calc.netWealth, currency)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30">Nisab Status</span>
                    <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${calc.isEligible ? "bg-emerald-400/10 text-emerald-400 border-emerald-400/20" : "bg-rose-400/10 text-rose-400 border-rose-400/20"}`}>
                      {calc.isEligible ? "✅ Eligible" : "❌ Below Nisab"}
                    </div>
                  </div>
                </div>
                <div className={`p-6 rounded-3xl text-center space-y-2 transition-all duration-700 ${calc.isEligible ? "bg-amber-400 text-black shadow-xl shadow-amber-400/20" : "bg-white/5 text-white/30 border border-white/10"}`}>
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-60">Zakat Payable</p>
                  <motion.div key={calc.zakatPayable} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                    <span className="text-4xl font-black font-serif italic">{formatCurrency(calc.zakatPayable, currency)}</span>
                  </motion.div>
                  <p className="text-[8px] font-bold uppercase tracking-widest opacity-60">{calc.isEligible ? "Zakat is Obligatory (2.5%)" : "Zakat Not Applicable"}</p>
                </div>
                <button onClick={() => { setAssets({ cash: "", savings: "", goldSilverValue: "", investments: "", businessAssets: "", rentalIncome: "", others: "" }); setLiabilities({ loans: "", installments: "", bills: "", creditCard: "", taxes: "", others: "" }); }} className="w-full flex items-center justify-center gap-2 py-3 text-[9px] uppercase font-black tracking-widest text-white/20 hover:text-white transition-colors border border-white/5 rounded-2xl hover:bg-white/5">
                  <RefreshCcw className="w-3 h-3" /> Reset all values
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ─── Fitra Module ─────────────────────────────────────────────────────

const FITRA_STORAGE_KEY = "noor_fitra_data";

const FitraModule: React.FC<{ currency: Currency }> = ({ currency }) => {
  const [step, setStep] = useState<0 | 1>(0);
  const [foodType, setFoodType] = useState<string>("rice");
  const [pricePerKg, setPricePerKg] = useState<string>("60");
  const [quantity, setQuantity] = useState<2.5 | 3>(2.5);
  const [members, setMembers] = useState<string>("1");

  // Persistence (Load)
  useEffect(() => {
    const saved = localStorage.getItem(FITRA_STORAGE_KEY);
    if (saved) {
      try {
        const d = JSON.parse(saved);
        if (d.foodType) setFoodType(d.foodType);
        if (d.pricePerKg) setPricePerKg(d.pricePerKg);
        if (d.quantity) setQuantity(d.quantity);
        if (d.members) setMembers(d.members);
      } catch (e) { console.error("Failed to load fitra data", e); }
    }
  }, []);

  // Persistence (Save)
  useEffect(() => {
    localStorage.setItem(FITRA_STORAGE_KEY, JSON.stringify({ foodType, pricePerKg, quantity, members }));
  }, [foodType, pricePerKg, quantity, members]);

  const selectedFood = FOOD_TYPES.find(f => f.id === foodType) || FOOD_TYPES[0];

  const calc = useMemo(() => {
    const price = parseFloat(pricePerKg) || 0;
    const mem = Math.max(1, parseInt(members) || 1);
    const fitraPerPerson = price * quantity;
    const totalFitra = fitraPerPerson * mem;
    return { fitraPerPerson, totalFitra, mem };
  }, [pricePerKg, quantity, members]);

  const handleFoodSelect = (id: string) => {
    const food = FOOD_TYPES.find(f => f.id === id);
    setFoodType(id);
    if (food) setPricePerKg(food.defaultPrice);
  };

  return (
    <AnimatePresence mode="wait">
      {step === 0 ? (
        <motion.div key="f0" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex justify-center py-8">
          <div className="w-full max-w-xl p-10 bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/10 shadow-2xl space-y-10">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-emerald-400/20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-emerald-400/20">
                <Moon className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-3xl font-serif italic text-white/90">Set Fitra Value</h2>
              <p className="text-sm text-white/40 max-w-xs mx-auto">Zakat al-Fitr — 1 Sāʿ (~2.5–3kg) of staple food per person.</p>
            </div>

            {/* Food Type */}
            <div className="space-y-4">
              <p className="text-[10px] uppercase font-bold tracking-widest text-white/30 text-center">Select Staple Food</p>
              <div className="grid grid-cols-3 gap-4">
                {FOOD_TYPES.map((food) => (
                  <button
                    key={food.id}
                    onClick={() => handleFoodSelect(food.id)}
                    className={`py-5 rounded-2xl flex flex-col items-center gap-2 border transition-all ${
                      foodType === food.id
                        ? "bg-emerald-400/10 border-emerald-400/30 text-emerald-400"
                        : "bg-white/5 border-white/10 text-white/40 hover:border-white/20"
                    }`}
                  >
                    <span className="text-3xl">{food.icon}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest">{food.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Input */}
            <PriceInput
              label={`${selectedFood.label} Price per kg`}
              hint={`Suggested: ${currency.symbol}${selectedFood.defaultPrice}/kg`}
              value={pricePerKg}
              onChange={setPricePerKg}
              symbol={currency.symbol}
            />

            {/* Quantity */}
            <div className="space-y-3">
              <p className="text-[10px] uppercase font-bold tracking-widest text-white/30 pl-1">Quantity (per person)</p>
              <div className="flex p-1 bg-black/20 rounded-2xl border border-white/5">
                <button onClick={() => setQuantity(2.5)} className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${quantity === 2.5 ? "bg-emerald-400 text-black" : "text-white/40 hover:text-white"}`}>2.5 kg</button>
                <button onClick={() => setQuantity(3)} className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${quantity === 3 ? "bg-white text-black" : "text-white/40 hover:text-white"}`}>3 kg</button>
              </div>
              <p className="text-[9px] text-white/20 text-center italic">Higher is recommended if affordable</p>
            </div>

            <button onClick={() => setStep(1)} className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-emerald-400 transition-all flex items-center justify-center gap-3 active:scale-95">
              Next Step <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div key="f1" initial={{ opacity: 0, scale: 1.02 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
          {/* Chips */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 whitespace-nowrap">
              <span>{selectedFood.icon}</span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-white/40">{selectedFood.label} • {currency.symbol}{pricePerKg}/kg</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-400/10 rounded-full border border-emerald-400/20 whitespace-nowrap">
              <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">{quantity}kg per person</span>
            </div>
            <button onClick={() => setStep(0)} className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 whitespace-nowrap hover:bg-white/10 transition-all">
              <ArrowLeft className="w-3 h-3 text-white/30" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-white/40">Edit</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative pb-40 lg:pb-0">
            {/* Household Input */}
            <div className="lg:col-span-8">
              <CardWrapper title="Your Household" icon={<Users className="w-5 h-5 text-emerald-400" />}>
                <div className="space-y-8">
                  <p className="text-sm text-white/40 leading-relaxed">
                    Fitra must be paid by the head of household for every Muslim dependent. Enter total number of people in your household below.
                  </p>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 pl-1 block">Total Household Members</label>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setMembers(String(Math.max(1, parseInt(members) - 1)))}
                        className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center text-2xl font-bold text-white/60"
                      >−</button>
                      <input
                        type="number"
                        value={members}
                        onChange={(e) => setMembers(String(Math.max(1, parseInt(e.target.value) || 1)))}
                        className="flex-1 bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-4xl font-black font-mono text-center focus:outline-none focus:border-emerald-400/40 transition-all"
                      />
                      <button
                        onClick={() => setMembers(String(parseInt(members) + 1))}
                        className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center text-2xl font-bold text-white/60"
                      >+</button>
                    </div>
                  </div>

                  {/* Quick Presets */}
                  <div className="grid grid-cols-4 gap-3">
                    {[1, 2, 4, 6].map((n) => (
                      <button
                        key={n}
                        onClick={() => setMembers(String(n))}
                        className={`py-3 rounded-2xl text-sm font-black transition-all border ${
                          parseInt(members) === n
                            ? "bg-emerald-400 text-black border-emerald-400"
                            : "bg-white/5 text-white/40 border-white/10 hover:border-white/20"
                        }`}
                      >
                        {n} {n === 1 ? "person" : "people"}
                      </button>
                    ))}
                  </div>

                  <div className="p-4 bg-emerald-400/5 rounded-2xl border border-emerald-400/10 flex items-start gap-3">
                    <Moon className="w-4 h-4 text-emerald-400/60 mt-0.5 shrink-0" />
                    <p className="text-[9px] text-white/40 leading-relaxed font-bold uppercase tracking-wider">
                      Fitra must be paid before Eid prayer. It is also permissible to pay during Ramadan.
                    </p>
                  </div>
                </div>
              </CardWrapper>
            </div>

            {/* Fitra Summary — sticky */}
            <div className="lg:col-span-4 fixed bottom-0 left-0 right-0 lg:sticky lg:top-8 z-50 lg:z-10 p-4 lg:p-0">
              <motion.div layout className="p-6 lg:p-8 bg-[#181821]/95 lg:bg-[#181821] backdrop-blur-2xl lg:backdrop-blur-none rounded-t-[2.5rem] lg:rounded-[2.5rem] border border-white/10 shadow-2xl space-y-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-[0.02] pointer-events-none">
                  <Moon className="w-40 h-40" />
                </div>
                <h3 className="text-xl font-serif italic text-white/90 relative">Fitra Summary</h3>
                <div className="space-y-3 relative">
                  <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest">
                    <span className="text-white/30">Food Type</span>
                    <span className="text-white/60">{selectedFood.icon} {selectedFood.label}</span>
                  </div>
                  <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest">
                    <span className="text-white/30">Price per kg</span>
                    <span className="text-white/60 font-mono">{currency.symbol}{pricePerKg}</span>
                  </div>
                  <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest">
                    <span className="text-white/30">Quantity</span>
                    <span className="text-white/60">{quantity} kg</span>
                  </div>
                  <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest">
                    <span className="text-white/30">Members</span>
                    <span className="text-white/60">{calc.mem}</span>
                  </div>
                  <div className="pt-3 border-t border-white/5 flex justify-between">
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Per Person</span>
                    <span className="text-base font-mono font-black text-white/70">{formatCurrency(calc.fitraPerPerson, currency)}</span>
                  </div>
                </div>
                <div className="p-6 rounded-3xl text-center space-y-2 bg-emerald-400 text-black shadow-xl shadow-emerald-400/20">
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-60">Total Fitra</p>
                  <motion.div key={calc.totalFitra} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                    <span className="text-4xl font-black font-serif italic">{formatCurrency(calc.totalFitra, currency)}</span>
                  </motion.div>
                  <p className="text-[8px] font-bold uppercase tracking-widest opacity-60">Pay before Eid prayer</p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ─── Main Tools Page ───────────────────────────────────────────────────

export const Tools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"zakat" | "fitra" | "quiz">("zakat");
  const [currency, setCurrency] = useState<Currency>(detectCurrency());
  const [showToast, setShowToast] = useState(false);

  const handleCurrencyChange = (code: string) => {
    const selected = CURRENCIES[code];
    if (selected) {
      setCurrency(selected);
      saveCurrency(code);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  return (
    <div className="space-y-8 pb-24 max-w-7xl mx-auto px-2">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-white/5">
        <div className="space-y-1">
          <h1 className="text-4xl font-serif italic tracking-tight text-white/90">Islamic Tools</h1>
          <p className="text-white/40 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
            <ShieldCheck className="w-3 h-3 text-amber-400" /> Shariah-Compliant Calculators
          </p>
        </div>
        <CurrencySwitcher currency={currency} onSelect={handleCurrencyChange} />
      </header>

      {/* Tab Selector */}
      <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10 w-full max-w-sm">
        <button
          onClick={() => setActiveTab("zakat")}
          className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === "zakat" ? "bg-white text-black shadow-lg" : "text-white/40 hover:text-white"}`}
        >
          <Coins className="w-3.5 h-3.5" /> Zakat
        </button>
        <button
          onClick={() => setActiveTab("fitra")}
          className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === "fitra" ? "bg-emerald-400 text-black shadow-lg" : "text-white/40 hover:text-white"}`}
        >
          <Moon className="w-3.5 h-3.5" /> Fitra
        </button>
        <button
          onClick={() => setActiveTab("quiz")}
          className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === "quiz" ? "bg-rose-500 text-white shadow-lg" : "text-white/40 hover:text-white"}`}
        >
          <Brain className="w-3.5 h-3.5" /> Quiz
        </button>
      </div>

      {/* Module Render */}
      <AnimatePresence mode="wait">
        {activeTab === "zakat" ? (
          <motion.div key="zakat" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
            <ZakatModule currency={currency} />
          </motion.div>
        ) : activeTab === "fitra" ? (
          <motion.div key="fitra" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <FitraModule currency={currency} />
          </motion.div>
        ) : (
          <motion.div key="quiz" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
            <Quiz />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 px-6 py-3 bg-[#1A1A23] border border-white/20 rounded-2xl shadow-2xl z-[100] text-sm text-white/70 font-bold backdrop-blur-xl"
          >
            Currency switched to <span className="text-amber-400">{currency.code}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
