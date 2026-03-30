// Hijri (Islamic) calendar conversion
// Based on the Umm al-Qura approximation algorithm

export const HIJRI_MONTHS = [
  "Muharram", "Safar", "Rabi' al-Awwal", "Rabi' al-Thani",
  "Jumada al-Ula", "Jumada al-Thani", "Rajab", "Sha'ban",
  "Ramadan", "Shawwal", "Dhul Qi'dah", "Dhul Hijjah"
];

export const HIJRI_MONTHS_AR = [
  "محرم", "صفر", "ربيع الأول", "ربيع الثاني",
  "جمادى الأولى", "جمادى الثانية", "رجب", "شعبان",
  "رمضان", "شوال", "ذو القعدة", "ذو الحجة"
];

export interface HijriDate {
  day: number;
  month: number;      // 1-indexed
  year: number;
  monthName: string;
  monthNameAr: string;
  formatted: string;   // e.g. "5 Ramadan 1447"
}

/**
 * Convert Gregorian date to approximate Hijri date.
 * Uses the Kuwaiti algorithm (civil calendar approximation).
 */
export function toHijri(date: Date = new Date()): HijriDate {
  const d = date.getDate();
  const m = date.getMonth();  // 0-indexed
  const y = date.getFullYear();

  let jd = Math.floor((11 * y + 3) / 30)
    + 354 * y
    + 30 * m
    - Math.floor((m - 1) / 2)
    + d
    + 1948440
    - 385;

  // Adjust for Gregorian calendar
  if (y > 1582 || (y === 1582 && m > 9) || (y === 1582 && m === 9 && d > 14)) {
    jd = jd - Math.floor(y / 100) + Math.floor(y / 400) + 2;
  }

  // Convert Julian Day to Hijri
  const l = jd - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  const l2 = l - 10631 * n + 354;
  const j = Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719)
    + Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
  const l3 = l2 - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50)
    - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
  const hm = Math.floor((24 * l3) / 709);
  const hd = l3 - Math.floor((709 * hm) / 24);
  const hy = 30 * n + j - 30;

  const monthIdx = hm - 1; // 0-indexed for array

  return {
    day: hd,
    month: hm,
    year: hy,
    monthName: HIJRI_MONTHS[monthIdx] ?? HIJRI_MONTHS[0],
    monthNameAr: HIJRI_MONTHS_AR[monthIdx] ?? HIJRI_MONTHS_AR[0],
    formatted: `${hd} ${HIJRI_MONTHS[monthIdx] ?? ""} ${hy} AH`,
  };
}

/**
 * Check if current Hijri month is Ramadan (month 9)
 */
export function isRamadan(date?: Date): boolean {
  return toHijri(date).month === 9;
}
/**
 * Get Gregorian date from Hijri components.
 * (Simple iterative approach for precision matching the toHijri algorithm)
 */
export function fromHijri(hy: number, hm: number, hd: number): Date {
  const date = new Date(hy + 580, hm - 1, hd); // Rough start
  // Adjust forward/backward until toHijri(date) matches
  let current = new Date(date);
  for (let i = 0; i < 400; i++) { // Max 400 days correction
    const h = toHijri(current);
    if (h.year === hy && h.month === hm && h.day === hd) return current;
    if (h.year < hy || (h.year === hy && h.month < hm) || (h.year === hy && h.month === hm && h.day < hd)) {
      current.setDate(current.getDate() + 1);
    } else {
      current.setDate(current.getDate() - 1);
    }
  }
  return current;
}
