import { Quote, Dua, NameOfAllah } from "../types";

export const QUOTES: Quote[] = [
  {
    id: "1",
    text: "For indeed, with hardship [will be] ease.",
    author: "Quran 94:5",
    category: "Patience",
    emotion: "Sad",
    waqt: "Asr",
  },
  {
    id: "2",
    text: "Allah does not burden a soul beyond that it can bear.",
    author: "Quran 2:286",
    category: "Faith",
    emotion: "Lost",
    waqt: "Night",
  },
  {
    id: "3",
    text: "The best of you are those who are best to their families.",
    author: "Prophet Muhammad (PBUH)",
    category: "Love",
    emotion: "Grateful",
    waqt: "Dhuhr",
  },
  {
    id: "4",
    text: "And He found you lost and guided [you].",
    author: "Quran 93:7",
    category: "Faith",
    emotion: "Lost",
    waqt: "Fajr",
  },
];

export const DUAS: Dua[] = [
  {
    id: "m1",
    title: "Morning Adhkar",
    arabic: "اللّهُـمَّ بِكَ أَصْـبَحْنا وَبِكَ أَمْسَـينا وَبِكَ نَحْـيا وَبِكَ نَمُـوتُ وَإِلَـيْكَ النُّـشُور",
    translation: "O Allah, by You we enter the morning and by You we enter the evening, by You we live and by You we die, and to You is the Final Return.",
    category: "Morning",
  },
  {
    id: "e1",
    title: "Evening Adhkar",
    arabic: "اللّهُـمَّ بِكَ أَمْسَـينا وَبِكَ أَصْـبَحْنا وَبِكَ نَحْـيا وَبِكَ نَمُـوتُ وَإِلَـيْكَ المَصِـير",
    translation: "O Allah, by You we enter the evening and by You we enter the morning, by You we live and by You we die, and to You is the Final Return.",
    category: "Evening",
  },
];

export const NAMES_OF_ALLAH: NameOfAllah[] = [
  { number: 1, name: "الرحمن", transliteration: "Ar-Rahman", meaning: "The Most Gracious" },
  { number: 2, name: "الرحيم", transliteration: "Ar-Raheem", meaning: "The Most Merciful" },
  { number: 3, name: "الملك", transliteration: "Al-Malik", meaning: "The King" },
];
