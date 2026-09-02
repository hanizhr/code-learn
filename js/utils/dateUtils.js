/**
 * Persian Calendar & Date Utilities
 */

import { toPersianDigits } from "./formatters.js";

export const PERSIAN_WEEKDAYS = [
  { key: "saturday", name: "شنبه" },
  { key: "sunday", name: "یکشنبه" },
  { key: "monday", name: "دوشنبه" },
  { key: "tuesday", name: "سه‌شنبه" },
  { key: "wednesday", name: "چهارشنبه" },
  { key: "thursday", name: "پنجشنبه" },
  { key: "friday", name: "جمعه" }
];

export const PERSIAN_MONTHS = [
  "فروردین", "اردیبهشت", "خرداد",
  "تیر", "مرداد", "شهریور",
  "مهر", "آبان", "آذر",
  "دی", "بهمن", "اسفند"
];

/**
 * Returns a mockup Persian week schedule dates starting from Saturday
 * @param {number} weekOffset 
 * @returns {Array<{dayKey: string, dayName: string, dateStr: string, isToday: boolean}>}
 */
export function getCurrentPersianWeek(weekOffset = 0) {
  const baseDay = 15 + (weekOffset * 7);
  
  return PERSIAN_WEEKDAYS.map((day, idx) => {
    const dayNumber = ((baseDay + idx - 1) % 30) + 1;
    const monthName = "شهریور";
    return {
      dayKey: day.key,
      dayName: day.name,
      dateStr: `${toPersianDigits(dayNumber)} ${monthName}`,
      fullShamsiDate: `1403/06/${String(dayNumber).padStart(2, "0")}`,
      isToday: weekOffset === 0 && idx === 0
    };
  });
}

/**
 * Maps standard day string to Persian day name
 * @param {string} dayKey 
 * @returns {string}
 */
export function getPersianDayName(dayKey) {
  const found = PERSIAN_WEEKDAYS.find(d => d.key === dayKey);
  return found ? found.name : dayKey;
}
