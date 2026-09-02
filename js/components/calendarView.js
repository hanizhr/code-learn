/**
 * Interactive RTL Persian Calendar Component
 */

import { getCurrentPersianWeek, PERSIAN_WEEKDAYS } from "../utils/dateUtils.js";
import { toPersianDigits } from "../utils/formatters.js";
import { icons } from "../utils/icons.js";
import { escapeHtml } from "../utils/dom.js";

/**
 * Renders weekly calendar grid HTML
 * @param {Object} options
 * @param {Object} options.weeklySchedule Map of dayKey -> slots
 * @param {Array<string>} [options.blockedDates]
 * @param {Array<Object>} [options.myBookings] Student's existing bookings
 * @param {number} [options.weekOffset=0]
 * @param {string} [options.selectedSlotId]
 * @param {boolean} [options.isTeacherEditMode=false]
 * @returns {string} HTML string
 */
export function renderCalendarWidget({
  weeklySchedule = {},
  blockedDates = [],
  myBookings = [],
  weekOffset = 0,
  selectedSlotId = null,
  isTeacherEditMode = false
}) {
  const currentWeek = getCurrentPersianWeek(weekOffset);

  const daysHtml = currentWeek.map(day => {
    const isDayBlocked = blockedDates.includes(day.fullShamsiDate);
    const daySlots = weeklySchedule[day.dayKey] || [];

    const slotsHtml = daySlots.map(slot => {
      let status = "available";
      let statusLabel = "آزاد";

      // Check if slot belongs to student's my-classes
      const isMyClass = myBookings.some(b => 
        b.dayOfWeek === day.dayName && 
        b.timeSlot === slot.time && 
        b.status === "confirmed"
      );

      if (isMyClass) {
        status = "my-class";
        statusLabel = "کلاس شما";
      } else if (isDayBlocked || slot.isBlocked) {
        status = "blocked";
        statusLabel = "تعطیل/بلاک";
      } else if (slot.isBooked) {
        status = "booked";
        statusLabel = "رزرو شده";
      }

      const isSelected = selectedSlotId === slot.id;
      const selectedClass = isSelected ? "selected" : "";

      return `
        <div 
          class="slot-item ${status} ${selectedClass}" 
          data-slot-id="${slot.id}"
          data-slot-time="${escapeHtml(slot.time)}"
          data-day-key="${day.dayKey}"
          data-day-name="${day.dayName}"
          data-full-date="${day.fullShamsiDate}"
          data-status="${status}"
          role="button"
          tabindex="0"
          title="${day.dayName} (${day.dateStr}) ساعت ${slot.time} - وضعیت: ${statusLabel}"
        >
          <div style="font-weight: 600;">${toPersianDigits(slot.time)}</div>
          <div style="font-size: 10px; opacity: 0.85; margin-top: 2px;">${statusLabel}</div>
        </div>
      `;
    }).join("");

    return `
      <div class="calendar-day-col ${day.isToday ? "today-col" : ""}">
        <div class="calendar-day-header">
          <div class="calendar-day-name">${day.dayName}</div>
          <div class="calendar-day-date">${day.dateStr}</div>
          ${isTeacherEditMode ? `
            <button class="btn btn-ghost btn-sm btn-toggle-day" data-full-date="${day.fullShamsiDate}" style="margin-top: 4px; font-size: 10px; padding: 2px 4px;">
              ${isDayBlocked ? "رفع تعطیلی" : "تعطیل کردن"}
            </button>
          ` : ""}
        </div>
        <div class="calendar-slots-list">
          ${slotsHtml.length ? slotsHtml : `<div class="text-center text-muted" style="font-size: 11px; padding: 1rem 0;">تایمی تعریف نشده</div>`}
          ${isTeacherEditMode ? `
            <button class="btn btn-outline btn-sm btn-add-slot" data-day-key="${day.dayKey}" style="margin-top: auto; font-size: 11px;">
              ${icons.plus("w-3 h-3")} افزودن ساعت
            </button>
          ` : ""}
        </div>
      </div>
    `;
  }).join("");

  return `
    <div class="calendar-widget">
      <div class="calendar-header">
        <div class="flex items-center gap-3">
          <h3 style="font-size: var(--font-size-base); font-weight: var(--font-weight-bold);">
            برنامه زمانی و تایم‌های آزاد
          </h3>
          <span class="badge badge-neutral">${weekOffset === 0 ? "هفته جاری" : `هفته ${toPersianDigits(Math.abs(weekOffset))} ${weekOffset > 0 ? "بعد" : "قبل"}`}</span>
        </div>

        <!-- Legend -->
        <div class="calendar-legend">
          <div class="legend-item"><span class="legend-dot available"></span>🟢 آزاد</div>
          <div class="legend-item"><span class="legend-dot booked"></span>🔴 رزرو شده</div>
          <div class="legend-item"><span class="legend-dot blocked"></span>⚪ غیرقابل دسترس</div>
          <div class="legend-item"><span class="legend-dot my-class"></span>🔵 کلاس‌های من</div>
        </div>

        <!-- Nav buttons -->
        <div class="flex items-center gap-1">
          <button class="btn btn-outline btn-sm btn-prev-week" title="هفته قبل">
            ${icons.arrowRight("w-4 h-4")}
          </button>
          <button class="btn btn-outline btn-sm btn-current-week">امروز</button>
          <button class="btn btn-outline btn-sm btn-next-week" title="هفته بعد">
            ${icons.arrowLeft("w-4 h-4")}
          </button>
        </div>
      </div>

      <div class="calendar-grid-week">
        ${daysHtml}
      </div>
    </div>
  `;
}
