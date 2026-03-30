import React, { createContext, useContext, useState, useEffect } from "react";
import { type LangCode, LANGUAGES } from "../lib/i18n";

interface LangContextType {
  lang: LangCode;
  setLang: (l: LangCode) => void;
  dir: "ltr" | "rtl";
}

const LangContext = createContext<LangContextType>({ lang: "en", setLang: () => {}, dir: "ltr" });

export const LangProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<LangCode>(() => {
    const saved = localStorage.getItem("noor_lang");
    return (saved as LangCode) || "en";
  });

  const setLang = (l: LangCode) => {
    setLangState(l);
    localStorage.setItem("noor_lang", l);
    document.documentElement.dir = LANGUAGES[l].dir;
    document.documentElement.lang = l;
  };

  useEffect(() => {
    document.documentElement.dir = LANGUAGES[lang].dir;
    document.documentElement.lang = lang;
  }, []);

  return (
    <LangContext.Provider value={{ lang, setLang, dir: LANGUAGES[lang].dir }}>
      {children}
    </LangContext.Provider>
  );
};

export const useLang = () => useContext(LangContext);
