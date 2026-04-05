export interface Prophet {
  id: string;
  name: string;
  arabicNameShort: string; // The short Arabic name
  arabicNameFull: string;  // The full title
  slug: string;
  color: string;
  miracle: string; // e.g. "Staff", "Ark", "Wisdom"
  emoji: string;
}

export const PROPHETS: Prophet[] = [
  { id: "1", name: "Adam", arabicNameShort: "آدم", arabicNameFull: "آدم عليه السلام", slug: "adam", color: "bg-amber-400", miracle: "The Knowledge of Names", emoji: "🌱" },
  { id: "2", name: "Idris", arabicNameShort: "إدريس", arabicNameFull: "إدريس عليه السلام", slug: "idris", color: "bg-emerald-400", miracle: "The First of Wisdom & Writing", emoji: "🖋️" },
  { id: "3", name: "Nuh", arabicNameShort: "نوح", arabicNameFull: "نوح عليه السلام", slug: "nuh", color: "bg-blue-400", miracle: "The Great Ark of Salvation", emoji: "🚢" },
  { id: "4", name: "Hud", arabicNameShort: "هود", arabicNameFull: "هود عليه السلام", slug: "hud", color: "bg-sky-400", miracle: "Unyielding in the Strong Wind", emoji: "🌬️" },
  { id: "5", name: "Salih", arabicNameShort: "صالح", arabicNameFull: "صالح عليه السلام", slug: "salih", color: "bg-rose-400", miracle: "The Miraculous She-Camel", emoji: "🐫" },
  { id: "6", name: "Ibrahim", arabicNameShort: "إبراهيم", arabicNameFull: "إبراهيم عليه السلام", slug: "ibrahim", color: "bg-amber-500", miracle: "Abraham, The Friend of Allah", emoji: "🕋" },
  { id: "7", name: "Lut", arabicNameShort: "لوط", arabicNameFull: "لوط عليه السلام", slug: "lut", color: "bg-indigo-400", miracle: "Advocate of Purity", emoji: "🛡️" },
  { id: "8", name: "Ismail", arabicNameShort: "إسماعيل", arabicNameFull: "إسماعيل عليه السلام", slug: "ismail", color: "bg-orange-400", miracle: "Forefather of the Seal", emoji: "🏹" },
  { id: "9", name: "Ishaq", arabicNameShort: "إسحاق", arabicNameFull: "إسحاق عليه السلام", slug: "ishaq", color: "bg-teal-400", miracle: "Blessed Divine Tidings", emoji: "📜" },
  { id: "10", name: "Yaqub", arabicNameShort: "يعقوب", arabicNameFull: "يعقوب عليه السلام", slug: "yaqub", color: "bg-purple-400", miracle: "Israel, Strength of Patience", emoji: "👁️" },
  { id: "11", name: "Yusuf", arabicNameShort: "يوسف", arabicNameFull: "يوسف عليه السلام", slug: "yusuf", color: "bg-yellow-400", miracle: "Vision & Dream Interpretation", emoji: "👑" },
  { id: "12", name: "Shuayb", arabicNameShort: "شعيب", arabicNameFull: "شعيب عليه السلام", slug: "shuayb", color: "bg-emerald-500", miracle: "Prophet of Eternal Justice", emoji: "⚖️" },
  { id: "13", name: "Ayyub", arabicNameShort: "أيوب", arabicNameFull: "أيوب عليه السلام", slug: "ayyub", color: "bg-rose-500", miracle: "Paragon of Steadfastness", emoji: "🪵" },
  { id: "14", name: "Dhul-Kifl", arabicNameShort: "ذو الكفل", arabicNameFull: "ذو الكفل عليه السلام", slug: "dhul-kifl", color: "bg-slate-400", miracle: "Keeper of the Covenant", emoji: "🤝" },
  { id: "15", name: "Musa", arabicNameShort: "موسى", arabicNameFull: "موسى عليه السلام", slug: "musa", color: "bg-sky-500", miracle: "The Staff & Parting the Sea", emoji: "🪄" },
  { id: "16", name: "Harun", arabicNameShort: "هارون", arabicNameFull: "هارون عليه السلام", slug: "harun", color: "bg-indigo-500", miracle: "The Eloquence of Guidance", emoji: "🗣️" },
  { id: "17", name: "Dawud", arabicNameShort: "داود", arabicNameFull: "داود عليه السلام", slug: "dawud", color: "bg-blue-500", miracle: "Kingship & Celestial Psalms", emoji: "⚔️" },
  { id: "18", name: "Sulayman", arabicNameShort: "سليمان", arabicNameFull: "سليمان عليه السلام", slug: "sulayman", color: "bg-amber-600", miracle: "Dominion over Nature & Jinn", emoji: "💍" },
  { id: "19", name: "Ilyas", arabicNameShort: "إلياس", arabicNameFull: "إلياس عليه السلام", slug: "ilyas", color: "bg-green-400", miracle: "The Prophet of Pure Tawhid", emoji: "⛰️" },
  { id: "20", name: "Alyasa", arabicNameShort: "اليسع", arabicNameFull: "اليسع عليه السلام", slug: "alyasa", color: "bg-teal-500", miracle: "Double Portion of Spirit", emoji: "✨" },
  { id: "21", name: "Yunus", arabicNameShort: "يونس", arabicNameFull: "يونس عليه السلام", slug: "yunus", color: "bg-sky-600", miracle: "The Sign of the Deep Sea", emoji: "🐳" },
  { id: "22", name: "Zakariya", arabicNameShort: "زكريا", arabicNameFull: "زكريا عليه السلام", slug: "zakariya", color: "bg-orange-500", miracle: "Devoted Miraculous Parent", emoji: "🕯️" },
  { id: "23", name: "Yahya", arabicNameShort: "يحيى", arabicNameFull: "يحيى عليه السلام", slug: "yahya", color: "bg-rose-600", miracle: "Purity and Divine Tidings", emoji: "💧" },
  { id: "24", name: "Isa", arabicNameShort: "عيسى", arabicNameFull: "عيسى عليه السلام", slug: "isa", color: "bg-indigo-600", miracle: "Healing & Speaking in Cradle", emoji: "🍞" },
  { id: "25", name: "Muhammad", arabicNameShort: "محمد", arabicNameFull: "محمد ﷺ", slug: "muhammad", color: "bg-amber-400", miracle: "The Seal of All Prophets", emoji: "✨" },
];

export interface ProphetStorySection {
  emoji: string;
  title: string;
  story: string;
}

export interface ProphetStory {
  id: string;
  name: string;
  arabicName: string;
  slug: string;
  sections: ProphetStorySection[];
}
