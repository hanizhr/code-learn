/**
 * 404 Not Found Page Component
 */

import { icons } from "../utils/icons.js";

export function renderNotFoundPage(container) {
  container.innerHTML = `
    <div class="page-container" style="display: flex; align-items: center; justify-content: center; min-height: 70vh;">
      <div class="container text-center" style="max-width: 500px;">
        <div style="font-size: 5rem; font-weight: 900; color: var(--color-primary); line-height: 1; margin-bottom: 1rem;">۴۰۴</div>
        <h2 class="font-bold text-xl mb-2">صفحه مورد نظر پیدا نشد</h2>
        <p class="text-muted text-sm mb-6">آدرسی که وارد کرده‌اید وجود ندارد یا به مسیر دیگری منتقل شده است.</p>
        <a href="#/" class="btn btn-primary inline-flex items-center gap-2">
          ${icons.arrowRight("w-4 h-4")}
          <span>بازگشت به صفحه اصلی</span>
        </a>
      </div>
    </div>
  `;
}
