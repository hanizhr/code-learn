/**
 * Reusable Teacher Card Component
 */

import { formatCurrency, formatRating, toPersianDigits } from "../utils/formatters.js";
import { icons } from "../utils/icons.js";
import { escapeHtml } from "../utils/dom.js";

/**
 * Renders teacher card HTML
 * @param {Object} teacher 
 * @returns {string} HTML string
 */
export function renderTeacherCard(teacher) {
  const specialtiesHtml = (teacher.specialties || [])
    .map(s => `<span class="badge badge-neutral">${escapeHtml(s)}</span>`)
    .join("");

  return `
    <div class="teacher-card" data-teacher-id="${teacher.id}">
      <div class="teacher-card-top">
        <img 
          src="${escapeHtml(teacher.avatar)}" 
          alt="${escapeHtml(teacher.name)}" 
          class="teacher-avatar"
          loading="lazy"
        />
        <div class="teacher-info-header">
          <h3>${escapeHtml(teacher.name)}</h3>
          <p class="teacher-title-tag">${escapeHtml(teacher.title)}</p>
        </div>
      </div>

      <div class="teacher-specialties">
        ${specialtiesHtml}
      </div>

      <div class="teacher-stats-bar">
        <div class="flex items-center gap-1">
          <span style="color: #F59E0B;">${icons.star("w-4 h-4", "#F59E0B")}</span>
          <span class="font-bold">${formatRating(teacher.rating)}</span>
          <span class="text-muted">(${toPersianDigits(teacher.reviewCount || 0)} نظر)</span>
        </div>
        <div class="text-muted">
          <span class="font-semibold text-primary">${toPersianDigits(teacher.completedClasses || 0)}</span> کلاس برگزار شده
        </div>
      </div>

      <div class="teacher-price-line">
        <span class="text-muted" style="font-size: var(--font-size-xs);">نرخ هر جلسه (۱ ساعت):</span>
        <span class="teacher-rate-amount">${formatCurrency(teacher.hourlyRate)}</span>
      </div>

      <div class="teacher-card-actions">
        <a href="#/teachers/${teacher.id}" class="btn btn-outline btn-sm">
          مشاهده پروفایل
        </a>
        <button class="btn btn-primary btn-sm btn-quick-book" data-teacher-id="${teacher.id}">
          رزرو کلاس
        </button>
      </div>
    </div>
  `;
}
