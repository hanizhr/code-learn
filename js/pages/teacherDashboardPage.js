/**
 * Teacher Dashboard Page Component
 */

import { AuthManager } from "../core/auth.js";
import { teacherService } from "../services/teacher.service.js";
import { bookingService } from "../services/booking.service.js";
import { calendarService } from "../services/calendar.service.js";
import { courseService } from "../services/course.service.js";
import { renderSidebar } from "../components/sidebar.js";
import { renderCalendarWidget } from "../components/calendarView.js";
import { showToast } from "../components/toast.js";
import { formatCurrency, toPersianDigits } from "../utils/formatters.js";
import { icons } from "../utils/icons.js";
import { escapeHtml } from "../utils/dom.js";

export async function renderTeacherDashboardPage(container, params, queryParams) {
  const user = AuthManager.getCurrentUser();
  if (!user || user.role !== "teacher") {
    window.location.hash = "#/auth?role=teacher";
    return;
  }

  const activeTab = queryParams.get("tab") || "overview";
  const teacherId = user.teacherId || "teacher-1";

  const [teacher, bookings, avail, courses] = await Promise.all([
    teacherService.getTeacherById(teacherId),
    bookingService.getBookings({ teacherId }),
    calendarService.getTeacherAvailability(teacherId),
    courseService.getCourses()
  ]);

  let weekOffset = 0;
  const confirmedBookings = bookings.filter(b => b.status === "confirmed");
  const totalEarned = bookings
    .filter(b => b.status === "completed" || b.status === "confirmed")
    .reduce((sum, b) => sum + (b.price || 0), 0);

  function renderContent() {
    let mainContentHtml = "";

    if (activeTab === "overview") {
      const todayClassesHtml = confirmedBookings.length
        ? confirmedBookings.map(b => `
          <div class="card mb-3 p-4" style="border-right: 4px solid var(--color-success);">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div class="flex items-center gap-3">
                <div style="width: 48px; height: 48px; border-radius: var(--radius-md); background-color: var(--color-primary-light); color: var(--color-primary); display: flex; align-items: center; justify-content: center;">
                  ${icons.user("w-6 h-6")}
                </div>
                <div>
                  <h4 class="font-bold text-base mb-1">${escapeHtml(b.studentName || "دانشجو")} - ${escapeHtml(b.courseTitle)}</h4>
                  <div class="text-muted text-xs flex items-center gap-3">
                    <span>سطح: <strong>${escapeHtml(b.levelTitle || "متوسط")}</strong></span>
                    <span>•</span>
                    <span>پلتفرم: <strong class="text-primary">${b.meetingProvider === "skyroom" ? "اسکای‌روم" : "Google Meet"}</strong></span>
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-4">
                <div class="text-right">
                  <div class="font-bold text-primary text-sm">${b.dayOfWeek} (${b.date})</div>
                  <div class="text-muted text-xs">ساعت: ${toPersianDigits(b.timeSlot)}</div>
                </div>
                <a href="#/classes/${b.id}" class="btn btn-primary btn-sm flex items-center gap-1">
                  ${icons.video("w-4 h-4")}
                  <span>ورود به کلاس</span>
                </a>
              </div>
            </div>
          </div>
        `).join("")
        : `<div class="empty-state"><p class="text-muted">کلاسی برای امروز ثبت نشده است.</p></div>`;

      mainContentHtml = `
        <div>
          <!-- Teacher Stats Grid -->
          <div class="grid grid-cols-4 gap-4 mb-6">
            <div class="card p-4">
              <div class="text-muted text-xs mb-1">کلاس‌های پیش‌رو</div>
              <div class="font-bold text-2xl text-primary">${toPersianDigits(confirmedBookings.length)} جلسه</div>
            </div>

            <div class="card p-4">
              <div class="text-muted text-xs mb-1">جلسات برگزار شده</div>
              <div class="font-bold text-2xl">${toPersianDigits(teacher?.completedClasses || 0)} جلسه</div>
            </div>

            <div class="card p-4">
              <div class="text-muted text-xs mb-1">امتیاز میانگین</div>
              <div class="font-bold text-2xl text-warning flex items-center gap-1">
                ${icons.star("w-5 h-5", "#F59E0B")}
                <span>${toPersianDigits(teacher?.rating || 5.0)}</span>
              </div>
            </div>

            <div class="card p-4">
              <div class="text-muted text-xs mb-1">درآمد کل</div>
              <div class="font-bold text-2xl text-success">${formatCurrency(totalEarned)}</div>
            </div>
          </div>

          <!-- Confirmed Sessions -->
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-bold text-lg">کلاس‌های رزرو شده و جلسات آنلاین</h3>
            <a href="#/dashboard/teacher?tab=calendar" class="btn btn-outline btn-sm">
              مدیریت تقویم و ساعات آزاد
            </a>
          </div>
          ${todayClassesHtml}
        </div>
      `;
    } else if (activeTab === "calendar") {
      mainContentHtml = `
        <div>
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="font-bold text-lg">مدیریت زمان‌های آزاد هفتگی و تقویم تدریس</h3>
              <p class="text-muted text-xs">می‌توانید تایم‌های جدید اضافه کنید یا روزهای خاص را تعطیل نمایید.</p>
            </div>
          </div>

          <div class="card p-4">
            <div id="teacher-calendar-management-mount">
              ${renderCalendarWidget({
                weeklySchedule: avail.weeklySchedule,
                blockedDates: avail.blockedDates,
                weekOffset,
                isTeacherEditMode: true
              })}
            </div>
          </div>
        </div>
      `;
    } else if (activeTab === "subjects") {
      const currentSubjects = teacher?.teachingSubjects || [];
      const subjectsRowsHtml = currentSubjects.map(s => `
        <tr style="border-bottom: 1px solid var(--color-border);">
          <td style="padding: 12px 16px;" class="font-bold">${escapeHtml(s.subjectTitle)}</td>
          <td style="padding: 12px 16px;">
            ${(s.levels || []).map(l => `<span class="badge badge-primary mr-1">${l === "beginner" ? "مقدماتی" : l === "intermediate" ? "متوسط" : "پیشرفته"}</span>`).join("")}
          </td>
          <td style="padding: 12px 16px; font-weight: bold; color: var(--color-primary);">${formatCurrency(teacher.hourlyRate)}</td>
        </tr>
      `).join("");

      mainContentHtml = `
        <div>
          <h3 class="font-bold text-lg mb-4">موضوعات تدریس و تنظیم نرخ هر جلسه</h3>
          
          <div class="card p-6 mb-6" style="max-width: 600px;">
            <h4 class="font-bold mb-3 text-base">به‌روزرسانی نرخ تدریس</h4>
            <form id="teacher-rate-form">
              <div class="form-group">
                <label class="form-label">نرخ هر جلسه (۱ ساعت تدریس اختصاصی به تومان):</label>
                <input type="number" id="input-hourly-rate" class="form-input" value="${teacher?.hourlyRate || 400000}" step="50000" min="100000" required>
              </div>
              <button type="submit" class="btn btn-primary">ذخیره نرخ تدریس</button>
            </form>
          </div>

          <div class="card p-0" style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; text-align: right; font-size: 13px;">
              <thead>
                <tr style="background-color: var(--color-bg-subtle); border-bottom: 1px solid var(--color-border); color: var(--color-text-muted);">
                  <th style="padding: 12px 16px;">موضوع / دوره</th>
                  <th style="padding: 12px 16px;">سطوح مورد تایید</th>
                  <th style="padding: 12px 16px;">نرخ هر ساعت</th>
                </tr>
              </thead>
              <tbody>
                ${subjectsRowsHtml}
              </tbody>
            </table>
          </div>
        </div>
      `;
    } else if (activeTab === "classes") {
      const classesHtml = bookings.map(b => `
        <tr style="border-bottom: 1px solid var(--color-border);">
          <td style="padding: 12px 16px;">
            <div class="font-bold">${escapeHtml(b.studentName || "دانشجو")}</div>
            <div class="text-muted text-xs">کلاس: ${escapeHtml(b.courseTitle)}</div>
          </td>
          <td style="padding: 12px 16px;">${b.dayOfWeek} (${b.date}) - ${toPersianDigits(b.timeSlot)}</td>
          <td style="padding: 12px 16px;">
            <span class="badge ${b.status === "confirmed" ? "badge-success" : "badge-neutral"}">
              ${b.status === "confirmed" ? "در انتظار برگزاری" : "تکمیل شده"}
            </span>
          </td>
          <td style="padding: 12px 16px;">
            <a href="${b.meetingUrl}" target="_blank" class="text-primary font-bold flex items-center gap-1">
              لینک میتینگ ${icons.externalLink("w-3 h-3")}
            </a>
          </td>
          <td style="padding: 12px 16px; text-align: left;">
            <a href="#/classes/${b.id}" class="btn btn-primary btn-sm">ورود به کلاس</a>
          </td>
        </tr>
      `).join("");

      mainContentHtml = `
        <div>
          <h3 class="font-bold text-lg mb-4">تمام جلسات و رزروهای دانشجویان</h3>
          <div class="card p-0" style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; text-align: right; font-size: 13px;">
              <thead>
                <tr style="background-color: var(--color-bg-subtle); border-bottom: 1px solid var(--color-border); color: var(--color-text-muted);">
                  <th style="padding: 12px 16px;">دانشجو و دوره</th>
                  <th style="padding: 12px 16px;">زمان کلاس</th>
                  <th style="padding: 12px 16px;">وضعیت</th>
                  <th style="padding: 12px 16px;">جلسه آنلاین</th>
                  <th style="padding: 12px 16px; text-align: left;">عملیات</th>
                </tr>
              </thead>
              <tbody>
                ${classesHtml}
              </tbody>
            </table>
          </div>
        </div>
      `;
    } else if (activeTab === "finance") {
      mainContentHtml = `
        <div>
          <h3 class="font-bold text-lg mb-4">درآمد و درخواست تسویه حساب</h3>
          <div class="grid grid-cols-2 gap-4 mb-6" style="max-width: 650px;">
            <div class="card p-4">
              <div class="text-muted text-xs mb-1">موجودی آماده تسویه:</div>
              <div class="font-bold text-2xl text-primary">${formatCurrency(totalEarned)}</div>
            </div>
            <div class="card p-4 flex flex-col justify-center">
              <button class="btn btn-primary btn-full" id="btn-request-payout">
                درخواست تسویه به حساب بانکی
              </button>
            </div>
          </div>
        </div>
      `;
    } else if (activeTab === "profile") {
      mainContentHtml = `
        <div>
          <h3 class="font-bold text-lg mb-4">تنظیمات پروفایل و پلتفرم پیش‌فرض کلاس</h3>
          <div class="card p-6" style="max-width: 600px;">
            <form id="teacher-profile-form">
              <div class="form-group">
                <label class="form-label">نام و نام خانوادگی:</label>
                <input type="text" id="tprof-name" class="form-input" value="${escapeHtml(teacher?.name || user.name)}" required>
              </div>
              <div class="form-group">
                <label class="form-label">عنوان شغلی / تخصص:</label>
                <input type="text" id="tprof-title" class="form-input" value="${escapeHtml(teacher?.title || '')}" required>
              </div>
              <div class="form-group">
                <label class="form-label">درباره شما و سوابق:</label>
                <textarea id="tprof-bio" class="form-textarea" rows="4">${escapeHtml(teacher?.bio || '')}</textarea>
              </div>
              <div class="form-group">
                <label class="form-label">پلتفرم پیشنهادی برگزاری کلاس:</label>
                <select id="tprof-provider" class="form-select">
                  <option value="google_meet" ${teacher?.preferredProvider === "google_meet" ? "selected" : ""}>Google Meet</option>
                  <option value="skyroom" ${teacher?.preferredProvider === "skyroom" ? "selected" : ""}>اسکای‌روم (Skyroom)</option>
                </select>
              </div>
              <button type="submit" class="btn btn-primary mt-2">ذخیره تغییرات پروفایل</button>
            </form>
          </div>
        </div>
      `;
    }

    const pageHtml = `
      <div class="dashboard-layout">
        ${renderSidebar({ role: "teacher", activeTab })}
        <main class="dashboard-content">
          ${mainContentHtml}
        </main>
      </div>
    `;

    container.innerHTML = pageHtml;
    attachTeacherEvents();
  }

  function attachTeacherEvents() {
    // Teacher Calendar Management
    const calMount = container.querySelector("#teacher-calendar-management-mount");
    if (calMount) {
      // Add slot handler
      calMount.querySelectorAll(".btn-add-slot").forEach(btn => {
        btn.addEventListener("click", async () => {
          const dayKey = btn.dataset.dayKey;
          const time = prompt("ساعت برگزاری کلاس را وارد کنید (مثال: 17:00 - 18:00):", "17:00 - 18:00");
          if (time && time.trim()) {
            await calendarService.addSlot(teacherId, dayKey, time.trim());
            showToast("تایم جدید به تقویم اضافه شد.", "success");
            renderTeacherDashboardPage(container, params, queryParams);
          }
        });
      });

      // Toggle Day Block
      calMount.querySelectorAll(".btn-toggle-day").forEach(btn => {
        btn.addEventListener("click", async () => {
          const fullDate = btn.dataset.fullDate;
          await calendarService.toggleDayBlock(teacherId, fullDate);
          showToast("وضعیت روز تغییر کرد.", "info");
          renderTeacherDashboardPage(container, params, queryParams);
        });
      });
    }

    // Rate update form
    const rateForm = container.querySelector("#teacher-rate-form");
    if (rateForm) {
      rateForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const rate = Number(container.querySelector("#input-hourly-rate").value);
        if (rate > 0) {
          teacher.hourlyRate = rate;
          const { storage } = await import("../core/storage.js");
          let teachers = storage.get("teachers", []);
          const idx = teachers.findIndex(t => t.id === teacher.id);
          if (idx !== -1) {
            teachers[idx].hourlyRate = rate;
            storage.set("teachers", teachers);
          }
          showToast("نرخ تدریس با موفقیت ذخیره شد.", "success");
        }
      });
    }

    // Payout request
    const payoutBtn = container.querySelector("#btn-request-payout");
    if (payoutBtn) {
      payoutBtn.addEventListener("click", () => {
        payoutBtn.disabled = true;
        payoutBtn.innerText = "درخواست ثبت شد ✓";
        showToast("درخواست تسویه حساب به امور مالی ارسال شد و ظرف ۲۴ ساعت واریز می‌گردد.", "success", 4000);
      });
    }

    // Logout from sidebar
    const logoutBtn = container.querySelector(".btn-sidebar-logout");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        AuthManager.logout();
        window.location.hash = "#/";
      });
    }
  }

  renderContent();
}
