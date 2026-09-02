/**
 * Modal Dialog Component System
 */

import { icons } from "../utils/icons.js";

let activeModal = null;

/**
 * Opens a modal with custom title, body HTML, and optional footer actions
 * @param {Object} options
 * @param {string} options.title
 * @param {string} options.bodyHtml
 * @param {string} [options.footerHtml]
 * @param {string} [options.maxWidth] e.g. "640px", "800px"
 * @param {Function} [options.onRender] Callback after DOM insertion
 * @param {Function} [options.onClose] Callback on close
 */
export function openModal({ title, bodyHtml, footerHtml = "", maxWidth = "640px", onRender = null, onClose = null }) {
  closeModal();

  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop";
  backdrop.id = "app-active-modal";

  backdrop.innerHTML = `
    <div class="modal-dialog" style="max-width: ${maxWidth};" role="dialog" aria-modal="true">
      <div class="modal-header">
        <h3 class="modal-title">${title}</h3>
        <button class="modal-close-btn" id="modal-close-trigger" aria-label="بستن">
          ${icons.x("w-5 h-5")}
        </button>
      </div>
      <div class="modal-body" id="modal-body-content">
        ${bodyHtml}
      </div>
      ${footerHtml ? `<div class="modal-footer">${footerHtml}</div>` : ""}
    </div>
  `;

  document.body.appendChild(backdrop);
  document.body.style.overflow = "hidden";

  // Trigger smooth enter animation
  requestAnimationFrame(() => {
    backdrop.classList.add("open");
  });

  const closeBtn = backdrop.querySelector("#modal-close-trigger");
  closeBtn.addEventListener("click", () => closeModal(onClose));

  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) {
      closeModal(onClose);
    }
  });

  const escHandler = (e) => {
    if (e.key === "Escape") {
      closeModal(onClose);
      document.removeEventListener("keydown", escHandler);
    }
  };
  document.addEventListener("keydown", escHandler);

  activeModal = { backdrop, onClose, escHandler };

  if (onRender) {
    onRender(backdrop.querySelector(".modal-dialog"));
  }

  return backdrop;
}

export function closeModal(callback = null) {
  if (activeModal && activeModal.backdrop) {
    activeModal.backdrop.classList.remove("open");
    document.removeEventListener("keydown", activeModal.escHandler);
    document.body.style.overflow = "";

    setTimeout(() => {
      if (activeModal && activeModal.backdrop.parentNode) {
        activeModal.backdrop.parentNode.removeChild(activeModal.backdrop);
      }
      if (callback) callback();
      else if (activeModal && activeModal.onClose) activeModal.onClose();
      activeModal = null;
    }, 200);
  }
}
