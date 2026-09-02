/**
 * DOM Manipulation and Template Rendering Utilities
 */

/**
 * Escapes HTML characters to prevent XSS in user strings
 * @param {string} str 
 * @returns {string}
 */
export function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Creates a DOM element from an HTML template string
 * @param {string} htmlString 
 * @returns {HTMLElement}
 */
export function createElementFromHTML(htmlString) {
  const div = document.createElement("div");
  div.innerHTML = htmlString.trim();
  return div.firstElementChild;
}

/**
 * Attaches a delegated event listener to an element
 * @param {HTMLElement} parent 
 * @param {string} eventType 
 * @param {string} selector 
 * @param {Function} handler 
 */
export function delegateEvent(parent, eventType, selector, handler) {
  parent.addEventListener(eventType, (e) => {
    const target = e.target.closest(selector);
    if (target && parent.contains(target)) {
      handler(e, target);
    }
  });
}
