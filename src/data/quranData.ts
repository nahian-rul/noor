import { Surah } from "../types";

export const SURAHS: Surah[] = [
  {
    number: 1,
    name: "الفاتحة",
    englishName: "Al-Fatihah",
    verses: [
      { number: 1, text: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful." },
      { number: 2, text: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", translation: "[All] praise is [due] to Allah, Lord of the worlds -" },
    ],
  },
  {
    number: 112,
    name: "الإخلاص",
    englishName: "Al-Ikhlas",
    verses: [
      { number: 1, text: "قُلْ هُوَ اللَّهُ أَحَدٌ", translation: "Say, \"He is Allah, [who is] One," },
      { number: 2, text: "اللَّهُ الصَّمَدُ", translation: "Allah, the Eternal Refuge." },
    ],
  },
];
