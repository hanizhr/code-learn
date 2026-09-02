/**
 * Reusable Course Card Component
 */

import { toPersianDigits } from "../utils/formatters.js";
import { icons } from "../utils/icons.js";
import { escapeHtml } from "../utils/dom.js";

/**
 * Renders Course Card HTML
 * @param {Object} course 
 * @returns {string}
 */
export function renderCourseCard(course) {
  const iconSvg = icons[course.icon] ? icons[course.icon]("w-6 h-6 text-primary") : icons.code("w-6 h-6 text-primary");

  const levelBadges = (course.levels || []).map(lvl => {
    return `<span class="badge badge-primary">${escapeHtml(lvl.title)}</span>`;
  }).join("");

  return `
    <div class="course-card" data-course-id="${course.id}">
      <div class="course-icon-badge" style="background-color: var(--color-primary-light);">
        ${iconSvg}
      </div>

      <h3 class="course-card-title">${escapeHtml(course.title)}</h3>
      
      <p class="course-card-desc">
        ${escapeHtml(course.description)}
      </p>

      <div class="course-level-chips">
        ${levelBadges}
      </div>

      <div class="course-meta-footer">
        <div class="flex items-center gap-1">
          ${icons.users("w-4 h-4 text-muted")}
          <span>${toPersianDigits(course.teachersCount || 2)} مدرس متخصص</span>
        </div>
        <a href="#/courses/${course.id}" class="btn btn-outline btn-sm">
          مشاهده دوره
        </a>
      </div>
    </div>
  `;
}
