/**
 * CodeLearn Persian Formatters
 */

/**
 * Converts English digits (0-9) to Persian digits (۰-۹)
 * @param {string|number} input 
 * @returns {string}
 */
export function toPersianDigits(input) {
  if (input === null || input === undefined) return "";
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return String(input).replace(/[0-9]/g, (w) => farsiDigits[+w]);
}

/**
 * Formats price in Tomans with 3-digit commas and Persian numbers
 * @param {number} amountInTomans 
 * @returns {string} e.g. "۴۵۰,۰۰۰ تومان"
 */
export function formatCurrency(amountInTomans) {
  if (typeof amountInTomans !== "number") {
    amountInTomans = Number(amountInTomans) || 0;
  }
  const formatted = new Intl.NumberFormat("en-US").format(amountInTomans);
  return `${toPersianDigits(formatted)} تومان`;
}

/**
 * Formats rating to 1 decimal place with Persian digits
 * @param {number} rating 
 * @returns {string} e.g. "۴.۹"
 */
export function formatRating(rating) {
  if (!rating) return "۵.۰";
  return toPersianDigits(Number(rating).toFixed(1));
}

/**
 * Formats hours/minutes duration
 * @param {number} hours 
 * @returns {string} e.g. "۴۵ ساعت"
 */
export function formatHours(hours) {
  return `${toPersianDigits(hours)} ساعت`;
}
