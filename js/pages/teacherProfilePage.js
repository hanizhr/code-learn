/**
 * Teacher Profile & Direct Booking Calendar Page Component
 */

import { teacherService } from "../services/teacher.service.js";
import { calendarService } from "../services/calendar.service.js";
import { renderCalendarWidget } from "../components/calendarView.js";
import { launchBookingWizard } from "../components/bookingModal.js";
import { formatCurrency, formatRating, toPersianDigits } from "../utils/formatters.js";
import { icons } from "../utils/icons.js";
import { escapeHtml } from "../utils/dom.js";

export async function renderTeacherProfilePage(container, params) {
  const teacherId = params.id;
  const teacher = await teacherService.getTeacherById(teacherId);

  if (!teacher) {
    container.innerHTML = `
      <div class="container" style="padding: 4rem 1rem;">
        <div class="empty-state">
          <h3>مدرس مورد نظر یافت نشد</h3>
          <a href="#/teachers" class="btn btn-primary mt-4">بازگشت به لیست مدرس‌ها</a>
        </div>
      </div>
    `;
    return;
  }

  let weekOffset = 0;
  const avail = await calendarService.getTeacherAvailability(teacher.id);

  const specialtiesBadges = (teacher.specialties || [])
    .map(s => `<span class="badge badge-neutral">${escapeHtml(s)}</span>`)
    .join("");

  const teachingSubjectsHtml = (teacher.teachingSubjects || []).map(sub => {
    const levelsHtml = (sub.levels || []).map(l => {
      const title = l === "beginner" ? "مقدماتی" : l === "intermediate" ? "متوسط" : "پیشرفته";
      return `<span class="badge badge-primary">${title}</span>`;
    }).join("");

    return `
      <div class="flex items-center justify-between p-3 card" style="margin-bottom: 0.5rem; background-color: var(--color-bg-subtle);">
        <div class="font-semibold">${escapeHtml(sub.subjectTitle)}</div>
        <div class="flex gap-1">${levelsHtml}</div>
      </div>
    `;
  }).join("");

  const reviewsHtml = (teacher.reviews || []).map(r => `
    <div class="card" style="padding: 1rem; margin-bottom: 0.75rem;">
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center gap-2">
          <img src="${escapeHtml(r.studentAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80')}" alt="${escapeHtml(r.studentName)}" style="width: 32px; height: 32px; border-radius: 9999px; object-fit: cover;">
          <span class="font-bold" style="font-size: 13px;">${escapeHtml(r.studentName)}</span>
        </div>
        <div class="flex items-center gap-1" style="color: #F59E0B; font-size: 12px;">
          ${icons.star("w-3 h-3", "#F59E0B")}
          <span class="font-bold">${toPersianDigits(r.rating)}</span>
        </div>
      </div>
      <p class="text-secondary" style="font-size: 13px; line-height: 1.6;">${escapeHtml(r.comment)}</p>
      <div class="text-muted" style="font-size: 10px; margin-top: 4px;">${escapeHtml(r.date)}</div>
    </div>
  `).join("");

  const pageHtml = `
    <div class="page-container">
      <div class="container">
        
        <!-- Breadcrumbs -->
        <div class="flex items-center gap-2 text-muted mb-4" style="font-size: 13px;">
          <a href="#/" class="footer-link">صفحه اصلی</a>
          <span>/</span>
          <a href="#/teachers" class="footer-link">مدرسان</a>
          <span>/</span>
          <span class="text-main font-semibold">${escapeHtml(teacher.name)}</span>
        </div>

        <!-- Profile Header Card -->
        <div class="card mb-8" style="padding: 2rem;">
          <div class="flex flex-col md:flex-row gap-6 items-start">
            
            <img 
              src="${escapeHtml(teacher.avatar)}" 
              alt="${escapeHtml(teacher.name)}" 
              style="width: 130px; height: 130px; border-radius: var(--radius-xl); object-fit: cover; border: 3px solid var(--color-primary-light);"
            />

            <div style="flex: 1;">
              <div class="flex items-center gap-3 mb-1">
                <h1 style="font-size: var(--font-size-2xl); font-weight: 800;">${escapeHtml(teacher.name)}</h1>
                <span class="badge badge-primary">مدرس رسمی</span>
              </div>
              <p class="text-secondary font-medium mb-3">${escapeHtml(teacher.title)}</p>

              <div class="flex flex-wrap gap-2 mb-4">
                ${specialtiesBadges}
              </div>

              <div class="flex flex-wrap items-center gap-6 text-sm text-secondary pt-3" style="border-top: 1px solid var(--color-border);">
                <div class="flex items-center gap-1">
                  <span style="color: #F59E0B;">${icons.star("w-4 h-4", "#F59E0B")}</span>
                  <span class="font-bold text-main">${formatRating(teacher.rating)}</span>
                  <span class="text-muted">(${toPersianDigits(teacher.reviewCount || 0)} نظر)</span>
                </div>
                <div class="flex items-center gap-1">
                  ${icons.book("w-4 h-4 text-primary")}
                  <span><strong>${toPersianDigits(teacher.completedClasses || 0)}</strong> جلسه برگزار شده</span>
                </div>
                <div class="flex items-center gap-1">
                  ${icons.clock("w-4 h-4 text-primary")}
                  <span><strong>${toPersianDigits(teacher.experienceYears || 5)}</strong> سال تجربه کاری</span>
                </div>
              </div>
            </div>

            <!-- Booking Box -->
            <div class="card" style="min-width: 240px; background-color: var(--color-bg-subtle); padding: 1.5rem; text-align: center;">
              <div class="text-muted mb-1" style="font-size: 12px;">نرخ هر ساعت کلاس آنلاین:</div>
              <div class="font-bold text-primary mb-4" style="font-size: var(--font-size-2xl);">${formatCurrency(teacher.hourlyRate)}</div>
              <button class="btn btn-primary btn-full flex items-center justify-center gap-2 btn-open-booking-wizard">
                ${icons.calendar("w-4 h-4")}
                <span>رزرو کلاس با این مدرس</span>
              </button>
            </div>

          </div>
        </div>

        <!-- Grid: Bio & Interactive Calendar -->
        <div class="grid grid-cols-3 gap-6">
          
          <!-- Left 2 Cols: Calendar & Schedule -->
          <div style="grid-column: span 2;">
            <div class="card mb-6" style="padding: 1.5rem;">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-2">
                  ${icons.calendar("w-5 h-5 text-primary")}
                  <h2 style="font-size: var(--font-size-lg); font-weight: bold;">تقویم و ساعات تدریس آزاد مدرس</h2>
                </div>
                <div class="text-muted" style="font-size: 12px;">برای رزرو، روی ساعت‌های سبز کلیک کنید</div>
              </div>

              <!-- Calendar Widget Mount -->
              <div id="teacher-profile-calendar-mount">
                ${renderCalendarWidget({
                  weeklySchedule: avail.weeklySchedule,
                  blockedDates: avail.blockedDates,
                  weekOffset
                })}
              </div>
            </div>

            <!-- Reviews -->
            <div class="card" style="padding: 1.5rem;">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-2">
                  ${icons.star("w-5 h-5 text-warning")}
                  <h3 style="font-size: var(--font-size-base); font-weight: bold;">نظرات و تجربیات دانشجویان (${toPersianDigits(teacher.reviews ? teacher.reviews.length : 0)})</h3>
                </div>
              </div>
              <div id="teacher-reviews-container">
                ${reviewsHtml.length ? reviewsHtml : `<p class="text-muted text-center py-4">هنوز نظری ثبت نشده است.</p>`}
              </div>
            </div>
          </div>

          <!-- Right 1 Col: Bio, Education, Subjects -->
          <div>
            <!-- Bio -->
            <div class="card mb-4" style="padding: 1.5rem;">
              <h3 style="font-size: var(--font-size-base); font-weight: bold; margin-bottom: 0.75rem;">درباره مدرس و سوابق</h3>
              <p class="text-secondary" style="font-size: 13px; line-height: 1.7; margin-bottom: 1rem;">
                ${escapeHtml(teacher.bio)}
              </p>

              <div class="pt-3" style="border-top: 1px solid var(--color-border); font-size: 12px;">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-muted">مدرک تحصیلی:</span>
                  <span class="font-bold">${escapeHtml(teacher.education || "کارشناسی ارشد نرم‌افزار")}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-muted">پلتفرم پیشنهادی:</span>
                  <span class="font-bold">${teacher.preferredProvider === "skyroom" ? "اسکای‌روم" : "Google Meet"}</span>
                </div>
              </div>
            </div>

            <!-- Teaching Subjects -->
            <div class="card" style="padding: 1.5rem;">
              <h3 style="font-size: var(--font-size-base); font-weight: bold; margin-bottom: 0.75rem;">موضوعات و سطوح قابل تدریس</h3>
              ${teachingSubjectsHtml}
            </div>
          </div>

        </div>

      </div>
    </div>
  `;

  container.innerHTML = pageHtml;

  // Launch booking modal
  container.querySelector(".btn-open-booking-wizard").addEventListener("click", () => {
    launchBookingWizard({ teacherId: teacher.id });
  });

  // Calendar slot interactions & navigation
  function attachCalendarNav() {
    const mount = container.querySelector("#teacher-profile-calendar-mount");
    if (!mount) return;

    // Slot click
    mount.querySelectorAll(".slot-item.available").forEach(slotEl => {
      slotEl.addEventListener("click", () => {
        launchBookingWizard({
          teacherId: teacher.id
        });
      });
    });

    const prevBtn = mount.querySelector(".btn-prev-week");
    const nextBtn = mount.querySelector(".btn-next-week");
    const todayBtn = mount.querySelector(".btn-current-week");

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        weekOffset--;
        mount.innerHTML = renderCalendarWidget({
          weeklySchedule: avail.weeklySchedule,
          blockedDates: avail.blockedDates,
          weekOffset
        });
        attachCalendarNav();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        weekOffset++;
        mount.innerHTML = renderCalendarWidget({
          weeklySchedule: avail.weeklySchedule,
          blockedDates: avail.blockedDates,
          weekOffset
        });
        attachCalendarNav();
      });
    }

    if (todayBtn) {
      todayBtn.addEventListener("click", () => {
        weekOffset = 0;
        mount.innerHTML = renderCalendarWidget({
          weeklySchedule: avail.weeklySchedule,
          blockedDates: avail.blockedDates,
          weekOffset
        });
        attachCalendarNav();
      });
    }
  }

  attachCalendarNav();
}
