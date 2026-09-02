/**
 * Toast Notification Component
 */

import { icons } from "../utils/icons.js";

let toastContainer = null;

function getToastContainer() {
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.className = "toast-container";
    toastContainer.id = "app-toast-container";
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
}

/**
 * Shows a modern floating Persian Toast message
 * @param {string} message 
 * @param {'success'|'danger'|'warning'|'info'} type 
 * @param {number} duration 
 */
export function showToast(message, type = "success", duration = 3500) {
  const container = getToastContainer();
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;

  let iconHtml = icons.check("w-5 h-5 text-success");
  if (type === "danger") iconHtml = icons.x("w-5 h-5 text-danger");
  if (type === "warning") iconHtml = icons.info("w-5 h-5 text-warning");
  if (type === "info") iconHtml = icons.info("w-5 h-5 text-primary");

  toast.innerHTML = `
    <div style="flex-shrink:0;">${iconHtml}</div>
    <div style="flex:1; font-weight:500; line-height:1.4;">${message}</div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    toast.style.transition = "all 200ms ease";
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 200);
  }, duration);
}
