/**
 * Student Dashboard Page Component
 */

import { AuthManager } from "../core/auth.js";
import { bookingService } from "../services/booking.service.js";
import { authService } from "../services/auth.service.js";
import { renderSidebar } from "../components/sidebar.js";
import { showToast } from "../components/toast.js";
import { launchBookingWizard } from "../components/bookingModal.js";
import { formatCurrency, toPersianDigits } from "../utils/formatters.js";
import { icons } from "../utils/icons.js";
import { escapeHtml } from "../utils/dom.js";

export async function renderStudentDashboardPage(container, params, queryParams) {
  const user = AuthManager.getCurrentUser();
  if (!user) {
    window.location.hash = "#/auth";
    return;
  }

  const activeTab = queryParams.get("tab") || "overview";
  const myBookings = await bookingService.getBookings({ studentId: user.id });

  const upcomingBookings = myBookings.filter(b => b.status === "confirmed");
  const pastBookings = myBookings.filter(b => b.status === "completed" || b.status === "cancelled");

  function renderContent() {
    let mainContentHtml = "";

    if (activeTab === "overview") {
      const upcomingCardsHtml = upcomingBookings.length
        ? upcomingBookings.map(b => `
          <div class="card mb-3 p-4" style="border-right: 4px solid var(--color-primary);">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div class="flex items-center gap-3">
                <img src="${escapeHtml(b.teacherAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100')}" alt="${escapeHtml(b.teacherName)}" style="width: 52px; height: 52px; border-radius: var(--radius-md); object-fit: cover;">
                <div>
                  <h4 class="font-bold text-base mb-1">${escapeHtml(b.courseTitle)} (${escapeHtml(b.levelTitle || "متوسط")})</h4>
                  <div class="text-muted text-xs flex items-center gap-3">
                    <span>مدرس: <strong>${escapeHtml(b.teacherName)}</strong></span>
                    <span>•</span>
                    <span class="text-primary font-semibold">${b.meetingProvider === "skyroom" ? "اسکای‌روم" : "Google Meet"}</span>
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
                  <span>ورود به اتاق کلاس</span>
                </a>
              </div>
            </div>
          </div>
        `).join("")
        : `
          <div class="empty-state">
            <div style="margin-bottom: 0.75rem;">${icons.calendar("w-10 h-10 text-muted mx-auto")}</div>
            <h4 class="font-bold">در حال حاضر کلاس پیش‌رویی ندارید</h4>
            <p class="text-muted text-xs mb-4">برای رزرو جلسه جدید، از لیست مدرسین یک ساعت آزاد انتخاب نمایید.</p>
            <button class="btn btn-primary btn-sm btn-quick-new-booking">رزرو کلاس جدید</button>
          </div>
        `;

      mainContentHtml = `
        <div>
          <!-- Summary Metric Cards -->
          <div class="grid grid-cols-3 gap-4 mb-6">
            <div class="card p-4 flex items-center gap-3">
              <div style="width: 44px; height: 44px; border-radius: var(--radius-md); background-color: var(--color-primary-light); color: var(--color-primary); display: flex; align-items: center; justify-content: center;">
                ${icons.calendar("w-6 h-6")}
              </div>
              <div>
                <div class="text-muted text-xs">کلاس‌های پیش‌رو</div>
                <div class="font-bold text-xl">${toPersianDigits(upcomingBookings.length)} جلسه</div>
              </div>
            </div>

            <div class="card p-4 flex items-center gap-3">
              <div style="width: 44px; height: 44px; border-radius: var(--radius-md); background-color: var(--color-success-bg); color: var(--color-success); display: flex; align-items: center; justify-content: center;">
                ${icons.check("w-6 h-6")}
              </div>
              <div>
                <div class="text-muted text-xs">جلسات تکمیل شده</div>
                <div class="font-bold text-xl">${toPersianDigits(pastBookings.filter(b => b.status === "completed").length)} جلسه</div>
              </div>
            </div>

            <div class="card p-4 flex items-center gap-3">
              <div style="width: 44px; height: 44px; border-radius: var(--radius-md); background-color: var(--color-bg-subtle); color: var(--color-text-main); display: flex; align-items: center; justify-content: center;">
                ${icons.book("w-6 h-6")}
              </div>
              <div>
                <div class="text-muted text-xs">موضوعات یادگیری</div>
                <div class="font-bold text-xl">${toPersianDigits(new Set(myBookings.map(b => b.courseId)).size || 1)} مهارت</div>
              </div>
            </div>
          </div>

          <!-- Upcoming Classes Section -->
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-bold text-lg">کلاس‌های آینده و جلسات تایید شده</h3>
            <button class="btn btn-outline btn-sm btn-quick-new-booking flex items-center gap-1">
              ${icons.plus("w-4 h-4")}
              <span>رزرو کلاس با مدرس جدید</span>
            </button>
          </div>
          ${upcomingCardsHtml}
        </div>
      `;
    } else if (activeTab === "history") {
      const historyCardsHtml = myBookings.length
        ? myBookings.map(b => `
          <tr style="border-bottom: 1px solid var(--color-border);">
            <td style="padding: 12px 16px;">
              <div class="font-bold">${escapeHtml(b.courseTitle)}</div>
              <div class="text-muted text-xs">سطح: ${escapeHtml(b.levelTitle || "متوسط")}</div>
            </td>
            <td style="padding: 12px 16px;">${escapeHtml(b.teacherName)}</td>
            <td style="padding: 12px 16px;">${b.dayOfWeek} (${b.date}) - ساعت ${toPersianDigits(b.timeSlot)}</td>
            <td style="padding: 12px 16px;">
              <span class="badge ${b.status === "confirmed" ? "badge-success" : b.status === "completed" ? "badge-neutral" : "badge-danger"}">
                ${b.status === "confirmed" ? "برگزار می‌شود" : b.status === "completed" ? "به پایان رسیده" : "لغو شده"}
              </span>
            </td>
            <td style="padding: 12px 16px;">${formatCurrency(b.price)}</td>
            <td style="padding: 12px 16px; text-align: left;">
              ${b.status === "confirmed" ? `
                <button class="btn btn-ghost btn-sm text-danger btn-cancel-booking" data-booking-id="${b.id}" style="font-size: 11px;">
                  لغو رزرو
                </button>
              ` : `
                <a href="#/teachers" class="btn btn-ghost btn-sm" style="font-size: 11px;">رزرو مجدد</a>
              `}
            </td>
          </tr>
        `).join("")
        : `<tr><td colspan="6" class="text-center py-6 text-muted">سابقه رزرواسیونی ثبت نشده است.</td></tr>`;

      mainContentHtml = `
        <div>
          <h3 class="font-bold text-lg mb-4">تاریخچه و سوابق تمام رزروهای شما</h3>
          <div class="card p-0" style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; text-align: right; font-size: 13px;">
              <thead>
                <tr style="background-color: var(--color-bg-subtle); border-bottom: 1px solid var(--color-border); color: var(--color-text-muted);">
                  <th style="padding: 12px 16px;">موضوع کلاس</th>
                  <th style="padding: 12px 16px;">مدرس</th>
                  <th style="padding: 12px 16px;">تاریخ و ساعت</th>
                  <th style="padding: 12px 16px;">وضعیت</th>
                  <th style="padding: 12px 16px;">مبلغ پرداختی</th>
                  <th style="padding: 12px 16px; text-align: left;">عملیات</th>
                </tr>
              </thead>
              <tbody>
                ${historyCardsHtml}
              </tbody>
            </table>
          </div>
        </div>
      `;
    } else if (activeTab === "payments") {
      const paymentRowsHtml = myBookings.map(b => `
        <tr style="border-bottom: 1px solid var(--color-border);">
          <td style="padding: 12px 16px;"><code>TX-${b.id.slice(-6)}</code></td>
          <td style="padding: 12px 16px;">کلاس آنلاین ${escapeHtml(b.courseTitle)} با ${escapeHtml(b.teacherName)}</td>
          <td style="padding: 12px 16px;">${b.date}</td>
          <td style="padding: 12px 16px;"><span class="badge badge-success">پرداخت موفق</span></td>
          <td style="padding: 12px 16px; font-weight: bold;">${formatCurrency(b.price)}</td>
        </tr>
      `).join("");

      mainContentHtml = `
        <div>
          <h3 class="font-bold text-lg mb-4">تراکنش‌ها و رسیدهای پرداخت کلاس</h3>
          <div class="card p-0" style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; text-align: right; font-size: 13px;">
              <thead>
                <tr style="background-color: var(--color-bg-subtle); border-bottom: 1px solid var(--color-border); color: var(--color-text-muted);">
                  <th style="padding: 12px 16px;">کد پیگیری</th>
                  <th style="padding: 12px 16px;">شرح تراکنش</th>
                  <th style="padding: 12px 16px;">تاریخ</th>
                  <th style="padding: 12px 16px;">وضعیت</th>
                  <th style="padding: 12px 16px;">مبلغ</th>
                </tr>
              </thead>
              <tbody>
                ${paymentRowsHtml}
              </tbody>
            </table>
          </div>
        </div>
      `;
    } else if (activeTab === "profile") {
      mainContentHtml = `
        <div>
          <h3 class="font-bold text-lg mb-4">تنظیمات و اطلاعات کاربری</h3>
          <div class="card p-6" style="max-width: 600px;">
            <form id="student-profile-form">
              <div class="form-group">
                <label class="form-label">نام و نام خانوادگی:</label>
                <input type="text" id="prof-name" class="form-input" value="${escapeHtml(user.name)}" required>
              </div>
              <div class="form-group">
                <label class="form-label">ایمیل:</label>
                <input type="email" id="prof-email" class="form-input" value="${escapeHtml(user.email)}" required>
              </div>
              <div class="form-group">
                <label class="form-label">شماره تماس:</label>
                <input type="tel" id="prof-phone" class="form-input" value="${escapeHtml(user.phone || '')}" placeholder="۰۹۱۲۳۴۵۶۷۸۹">
              </div>
              <button type="submit" class="btn btn-primary mt-2">ذخیره تغییرات</button>
            </form>
          </div>
        </div>
      `;
    }

    const pageHtml = `
      <div class="dashboard-layout">
        ${renderSidebar({ role: "student", activeTab })}
        <main class="dashboard-content">
          ${mainContentHtml}
        </main>
      </div>
    `;

    container.innerHTML = pageHtml;
    attachDashboardEvents();
  }

  function attachDashboardEvents() {
    // Quick booking trigger
    container.querySelectorAll(".btn-quick-new-booking").forEach(btn => {
      btn.addEventListener("click", () => {
        launchBookingWizard();
      });
    });

    // Cancel booking
    container.querySelectorAll(".btn-cancel-booking").forEach(btn => {
      btn.addEventListener("click", async () => {
        const bId = btn.dataset.bookingId;
        if (confirm("آیا از لغو این کلاس اطمینان دارید؟ مبلغ به کیف پول شما بازگردانده می‌شود.")) {
          await bookingService.cancelBooking(bId);
          showToast("کلاس لغو شد.", "info");
          renderStudentDashboardPage(container, params, queryParams);
        }
      });
    });

    // Profile form submit
    const profForm = container.querySelector("#student-profile-form");
    if (profForm) {
      profForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = container.querySelector("#prof-name").value.trim();
        const email = container.querySelector("#prof-email").value.trim();
        const phone = container.querySelector("#prof-phone").value.trim();

        await authService.updateProfile({ name, email, phone });
        showToast("اطلاعات کاربری به‌روزرسانی شد.", "success");
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
