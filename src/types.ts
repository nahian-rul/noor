export type Waqt = "Fajr" | "Sunrise" | "Dhuhr" | "Asr" | "Maghrib" | "Isha" | "Night";

export interface Quote {
  id: string;
  text: string;
  author: string;
  category: "Patience" | "Faith" | "Love" | "Success";
  emotion: "Sad" | "Lost" | "Motivated" | "Grateful";
  waqt?: Waqt;
}

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  verses: Verse[];
}

export interface Verse {
  number: number;
  text: string;
  translation: string;
}

export interface Dua {
  id: string;
  title: string;
  arabic: string;
  translation: string;
  category: "Morning" | "Evening" | "Daily";
}

export interface NameOfAllah {
  number: number;
  name: string;
  transliteration: string;
  meaning: string;
}
