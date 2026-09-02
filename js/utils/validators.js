/**
 * Input & Form Validation Utilities
 */

/**
 * Validates Iranian Mobile Phone Number (09...)
 * @param {string} phone 
 * @returns {boolean}
 */
export function isValidIranPhone(phone) {
  if (!phone) return false;
  const cleanPhone = phone.trim().replace(/[۰-۹]/g, d => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
  const regex = /^09[0-9]{9}$/;
  return regex.test(cleanPhone);
}

/**
 * Validates Email address
 * @param {string} email 
 * @returns {boolean}
 */
export function isValidEmail(email) {
  if (!email) return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
}

/**
 * Validates password strength (min 6 chars)
 * @param {string} password 
 * @returns {boolean}
 */
export function isValidPassword(password) {
  return typeof password === "string" && password.trim().length >= 6;
}

/**
 * Checks if a string is non-empty
 * @param {string} val 
 * @returns {boolean}
 */
export function isNonEmpty(val) {
  return typeof val === "string" && val.trim().length > 0;
}
