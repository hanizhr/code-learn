/**
 * Live Classroom Virtual Room Page Component
 */

import { bookingService } from "../services/booking.service.js";
import { AuthManager } from "../core/auth.js";
import { icons } from "../utils/icons.js";
import { toPersianDigits } from "../utils/formatters.js";
import { escapeHtml } from "../utils/dom.js";

export async function renderLiveClassPage(container, params) {
  const bookingId = params.bookingId;
  const booking = await bookingService.getBookingById(bookingId);
  const user = AuthManager.getCurrentUser();

  if (!booking) {
    container.innerHTML = `
      <div class="container" style="padding: 4rem 1rem;">
        <div class="empty-state">
          <h3>کلاس مورد نظر یافت نشد</h3>
          <a href="#/dashboard/student" class="btn btn-primary mt-4">بازگشت به پنل</a>
        </div>
      </div>
    `;
    return;
  }

  const isTeacher = user && user.role === "teacher";
  const partnerName = isTeacher ? (booking.studentName || "دانشجو") : booking.teacherName;
  const partnerRole = isTeacher ? "دانشجو" : "مدرس دوره";

  const pageHtml = `
    <div class="page-container">
      <div class="container">
        
        <!-- Live Class Top Banner -->
        <div class="card mb-4 p-4" style="background: linear-gradient(135deg, var(--color-bg-surface), var(--color-bg-subtle));">
          <div class="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="live-dot" style="width: 10px; height: 10px; background-color: var(--color-danger); border-radius: 9999px; display: inline-block; animation: pulse 1.5s infinite;"></span>
                <span class="font-bold text-danger text-xs">اتاق جلسه آنلاین فعال</span>
                <span class="badge badge-primary">${escapeHtml(booking.courseTitle)} (${escapeHtml(booking.levelTitle || "متوسط")})</span>
              </div>
              <h1 class="font-bold text-xl">${escapeHtml(booking.courseTitle)} با ${escapeHtml(partnerName)}</h1>
              <div class="text-muted text-xs mt-1">
                زمان جلسه: <strong>${booking.dayOfWeek} (${booking.date}) - ساعت ${toPersianDigits(booking.timeSlot)}</strong>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <a href="${booking.meetingUrl}" target="_blank" class="btn btn-primary btn-lg flex items-center gap-2">
                ${icons.video("w-5 h-5")}
                <span>ورود مستقیم به جلسه (${booking.meetingProvider === "skyroom" ? "اسکای‌روم" : "گوگل میت"})</span>
                ${icons.externalLink("w-4 h-4")}
              </a>
              <a href="${isTeacher ? "#/dashboard/teacher" : "#/dashboard/student"}" class="btn btn-outline">
                بازگشت به پنل
              </a>
            </div>
          </div>
        </div>

        <!-- Live Classroom Grid -->
        <div class="live-classroom-container">
          
          <!-- Stage & Video/Screen Simulation Area -->
          <div class="classroom-stage">
            <div class="video-stage">
              
              <!-- Video Background Stage / Screen Sharing -->
              <div style="text-align: center; color: #fff; z-index: 2;">
                <div style="margin-bottom: 1rem; opacity: 0.8;">
                  ${icons.terminal("w-16 h-16 mx-auto")}
                </div>
                <h3 style="font-size: var(--font-size-xl); font-weight: bold; margin-bottom: 0.5rem;">
                  فضای تعاملی و اشتراک‌گذاری صفحه نمایش
                </h3>
                <p style="font-size: 13px; opacity: 0.75; max-width: 450px; margin: 0 auto 1.5rem auto;">
                  جلسه از طریق بستر اختصاصی <strong>${booking.meetingProvider === "skyroom" ? "Skyroom" : "Google Meet"}</strong> در حال برگزاری است.
                </p>
                <a href="${booking.meetingUrl}" target="_blank" class="btn btn-primary btn-sm flex items-center gap-2 mx-auto" style="display: inline-flex;">
                  ${icons.video("w-4 h-4")}
                  <span>باز کردن تصویر و صدای زنده در تب جدید</span>
                </a>
              </div>

              <!-- Self Video Feed PiP -->
              <div class="video-feed-self">
                <img src="${user ? user.avatar : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120'}" alt="تصویر شما" style="width: 100%; height: 100%; object-fit: cover;">
                <div style="position: absolute; bottom: 4px; right: 6px; font-size: 10px; color: #fff; background: rgba(0,0,0,0.6); padding: 1px 6px; border-radius: 4px;">شما</div>
              </div>

              <!-- Remote Partner Video Feed PiP -->
              <div style="position: absolute; top: 16px; left: 16px; width: 140px; height: 95px; border-radius: var(--radius-md); overflow: hidden; border: 2px solid rgba(255,255,255,0.2); background: #1f2937;">
                <img src="${booking.teacherAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'}" alt="${partnerName}" style="width: 100%; height: 100%; object-fit: cover;">
                <div style="position: absolute; bottom: 4px; right: 6px; font-size: 10px; color: #fff; background: rgba(0,0,0,0.6); padding: 1px 6px; border-radius: 4px;">${escapeHtml(partnerName)}</div>
              </div>

              <!-- Classroom Bottom Floating Controls -->
              <div class="video-controls">
                <button class="video-btn active" id="btn-toggle-mic" title="میکروفون">
                  ${icons.mic("w-5 h-5")}
                </button>
                <button class="video-btn active" id="btn-toggle-cam" title="دوربین">
                  ${icons.video("w-5 h-5")}
                </button>
                <button class="video-btn" id="btn-share-screen" title="اشتراک‌گذاری کد / تصویر">
                  ${icons.monitor ? icons.monitor("w-5 h-5") : icons.terminal("w-5 h-5")}
                </button>
                <a href="${booking.meetingUrl}" target="_blank" class="video-btn" title="ورود به نرم‌افزار میتینگ">
                  ${icons.externalLink("w-5 h-5")}
                </a>
              </div>
            </div>

            <!-- Notes & Code Editor Scratchpad -->
            <div class="card p-4 mt-4">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  ${icons.code("w-4 h-4 text-primary")}
                  <span class="font-bold text-sm">تخته مشترک و یادداشت‌های کد کلاس</span>
                </div>
                <button class="btn btn-ghost btn-sm" id="btn-copy-code" style="font-size: 11px;">کپی کد</button>
              </div>
              <textarea 
                id="live-class-code-pad"
                class="form-textarea" 
                rows="6" 
                style="font-family: monospace; font-size: 13px; direction: ltr; background-color: var(--color-bg-subtle);"
                placeholder="# یادداشت‌ها، لینک مخزن گیت‌هاب و اسنیپت‌های کدی که در جلسه بررسی می‌شود...&#10;def solution(data):&#10;    # کد پایتون مورد بحث در کلاس&#10;    return [x * 2 for x in data]"
              ># مباحث جلسه: ${booking.courseTitle}&#10;# یادداشت دانشجو: ${booking.notes || "بررسی ساختار کلاس‌ها و معماری پروژه"}</textarea>
            </div>
          </div>

          <!-- Classroom Sidebar Chat & Info -->
          <div class="classroom-sidebar">
            <div class="card p-0 flex flex-col" style="height: 100%;">
              
              <!-- Tabs Header -->
              <div style="padding: 0.75rem 1rem; border-bottom: 1px solid var(--color-border); display: flex; align-items: center; justify-content: space-between;">
                <span class="font-bold text-sm">چت و تبادل پیام کلاس</span>
                <span class="badge badge-success text-xs">آنلاین</span>
              </div>

              <!-- Chat Messages Body -->
              <div id="classroom-chat-messages" style="flex: 1; padding: 1rem; overflow-y: auto; display: flex; flex-direction: column; gap: 0.75rem;">
                <div class="flex flex-col items-start">
                  <div style="background-color: var(--color-bg-subtle); padding: 8px 12px; border-radius: var(--radius-md); font-size: 12px; max-width: 85%;">
                    <div class="font-bold text-primary text-xs mb-1">${escapeHtml(partnerName)} (${partnerRole}):</div>
                    سلام! جلسه آغاز شد. لطفاً در صورت نیاز به میکروفون و اشتراک صفحه روی دکمه ورود به میتینگ کلیک فرمایید.
                  </div>
                  <span class="text-muted text-xs mt-1">۱۰:۰۱</span>
                </div>

                <div class="flex flex-col items-end">
                  <div style="background-color: var(--color-primary); color: #fff; padding: 8px 12px; border-radius: var(--radius-md); font-size: 12px; max-width: 85%;">
                    سلام وقت بخیر استاد، کدهای مربوط به تمرین را در تخته کد پایین قرار دادم.
                  </div>
                  <span class="text-muted text-xs mt-1">۱۰:۰۲</span>
                </div>
              </div>

              <!-- Chat Input Footer -->
              <form id="classroom-chat-form" style="padding: 0.75rem; border-top: 1px solid var(--color-border); display: flex; gap: 0.5rem;">
                <input type="text" id="classroom-chat-input" class="form-input" placeholder="پیام شما..." style="font-size: 12px; height: 36px;" required>
                <button type="submit" class="btn btn-primary btn-sm" style="padding: 0 12px;">
                  ارسال
                </button>
              </form>

            </div>
          </div>

        </div>

      </div>
    </div>
  `;

  container.innerHTML = pageHtml;

  // Toggle mic/cam simulated buttons
  const micBtn = container.querySelector("#btn-toggle-mic");
  if (micBtn) {
    let micOn = true;
    micBtn.addEventListener("click", () => {
      micOn = !micOn;
      micBtn.classList.toggle("active", micOn);
      micBtn.innerHTML = micOn ? icons.mic("w-5 h-5") : icons.micOff("w-5 h-5");
    });
  }

  const camBtn = container.querySelector("#btn-toggle-cam");
  if (camBtn) {
    let camOn = true;
    camBtn.addEventListener("click", () => {
      camOn = !camOn;
      camBtn.classList.toggle("active", camOn);
      camBtn.innerHTML = camOn ? icons.video("w-5 h-5") : icons.videoOff("w-5 h-5");
    });
  }

  // Interactive Live Chat
  const chatForm = container.querySelector("#classroom-chat-form");
  const chatInput = container.querySelector("#classroom-chat-input");
  const chatBox = container.querySelector("#classroom-chat-messages");

  if (chatForm && chatInput && chatBox) {
    chatForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const text = chatInput.value.trim();
      if (!text) return;

      const timeStr = new Date().toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" });
      const msgDiv = document.createElement("div");
      msgDiv.className = "flex flex-col items-end";
      msgDiv.innerHTML = `
        <div style="background-color: var(--color-primary); color: #fff; padding: 8px 12px; border-radius: var(--radius-md); font-size: 12px; max-width: 85%;">
          ${escapeHtml(text)}
        </div>
        <span class="text-muted text-xs mt-1">${timeStr}</span>
      `;
      chatBox.appendChild(msgDiv);
      chatInput.value = "";
      chatBox.scrollTop = chatBox.scrollHeight;
    });
  }
}
