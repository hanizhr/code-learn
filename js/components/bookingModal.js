/**
 * Multi-Step Booking Flow Modal Component
 */

import { openModal, closeModal } from "./modal.js";
import { showToast } from "./toast.js";
import { teacherService } from "../services/teacher.service.js";
import { courseService } from "../services/course.service.js";
import { calendarService } from "../services/calendar.service.js";
import { bookingService } from "../services/booking.service.js";
import { AuthManager } from "../core/auth.js";
import { formatCurrency, toPersianDigits } from "../utils/formatters.js";
import { getCurrentPersianWeek } from "../utils/dateUtils.js";
import { icons } from "../utils/icons.js";
import { escapeHtml } from "../utils/dom.js";

/**
 * Launches the full Class Reservation Wizard Modal
 * @param {Object} initialParams
 * @param {string} [initialParams.teacherId]
 * @param {string} [initialParams.courseId]
 * @param {string} [initialParams.level]
 */
export async function launchBookingWizard({ teacherId = null, courseId = null, level = null } = {}) {
  // Check auth
  if (!AuthManager.isAuthenticated()) {
    showToast("برای رزرو کلاس، لطفاً ابتدا وارد حساب کاربری خود شوید.", "warning");
    window.location.hash = "#/auth?redirect=teachers";
    return;
  }

  const currentUser = AuthManager.getCurrentUser();

  // Load prerequisites
  const [courses, teachers] = await Promise.all([
    courseService.getCourses(),
    teacherService.getTeachers()
  ]);

  let selectedCourseId = courseId || (courses[0] ? courses[0].id : "course-python");
  let selectedLevel = level || "intermediate";
  let selectedTeacherId = teacherId || (teachers[0] ? teachers[0].id : "teacher-1");
  let selectedSlot = null; // { dayKey, dayName, dateStr, fullShamsiDate, slotId, time }
  let studentNotes = "";
  let selectedProvider = "google_meet";
  let currentStep = 1;

  function getSelectedCourse() {
    return courses.find(c => c.id === selectedCourseId) || courses[0];
  }

  function getSelectedTeacher() {
    return teachers.find(t => t.id === selectedTeacherId) || teachers[0];
  }

  function renderWizard() {
    const course = getSelectedCourse();
    const teacher = getSelectedTeacher();

    openModal({
      title: "رزرو کلاس آنلاین اختصاصی با مدرس",
      maxWidth: "760px",
      bodyHtml: `
        <div id="booking-wizard-container">
          <!-- Step Wizard Header -->
          <div class="step-wizard">
            <div class="step-item ${currentStep === 1 ? "active" : currentStep > 1 ? "completed" : ""}">
              <div class="step-circle">${currentStep > 1 ? icons.check("w-4 h-4") : "۱"}</div>
              <span class="step-title">موضوع و سطح</span>
            </div>
            <div class="step-item ${currentStep === 2 ? "active" : currentStep > 2 ? "completed" : ""}">
              <div class="step-circle">${currentStep > 2 ? icons.check("w-4 h-4") : "۲"}</div>
              <span class="step-title">انتخاب مدرس</span>
            </div>
            <div class="step-item ${currentStep === 3 ? "active" : currentStep > 3 ? "completed" : ""}">
              <div class="step-circle">${currentStep > 3 ? icons.check("w-4 h-4") : "۳"}</div>
              <span class="step-title">زمان کلاس</span>
            </div>
            <div class="step-item ${currentStep === 4 ? "active" : currentStep > 4 ? "completed" : ""}">
              <div class="step-circle">${currentStep > 4 ? icons.check("w-4 h-4") : "۴"}</div>
              <span class="step-title">تأیید و پرداخت</span>
            </div>
          </div>

          <!-- Step 1: Course & Level -->
          <div id="wizard-step-1" class="wizard-step-pane ${currentStep === 1 ? "" : "style-hidden"}" style="${currentStep === 1 ? "" : "display:none;"}">
            <h4 style="font-size: var(--font-size-base); font-weight: bold; margin-bottom: 1rem;">موضوع و سطح مورد نظر خود را انتخاب کنید:</h4>
            
            <div class="form-group">
              <label class="form-label">موضوع آموزشی:</label>
              <select id="wizard-course-select" class="form-select">
                ${courses.map(c => `<option value="${c.id}" ${c.id === selectedCourseId ? "selected" : ""}>${escapeHtml(c.title)}</option>`).join("")}
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">سطح مهارت:</label>
              <div class="grid grid-cols-3 gap-2" style="margin-top: 0.5rem;">
                <label class="card" style="padding: 0.75rem; cursor: pointer; border: 2px solid ${selectedLevel === "beginner" ? "var(--color-primary)" : "var(--color-border)"};">
                  <input type="radio" name="wizard-level" value="beginner" ${selectedLevel === "beginner" ? "checked" : ""} style="display:none;">
                  <div class="font-bold">مقدماتی</div>
                  <div class="text-muted" style="font-size: 11px;">شروع از صفر و پایه‌ها</div>
                </label>
                <label class="card" style="padding: 0.75rem; cursor: pointer; border: 2px solid ${selectedLevel === "intermediate" ? "var(--color-primary)" : "var(--color-border)"};">
                  <input type="radio" name="wizard-level" value="intermediate" ${selectedLevel === "intermediate" ? "checked" : ""} style="display:none;">
                  <div class="font-bold">متوسط</div>
                  <div class="text-muted" style="font-size: 11px;">پروژه‌محور و مفاهیم اصلی</div>
                </label>
                <label class="card" style="padding: 0.75rem; cursor: pointer; border: 2px solid ${selectedLevel === "advanced" ? "var(--color-primary)" : "var(--color-border)"};">
                  <input type="radio" name="wizard-level" value="advanced" ${selectedLevel === "advanced" ? "checked" : ""} style="display:none;">
                  <div class="font-bold">پیشرفته</div>
                  <div class="text-muted" style="font-size: 11px;">معماری و پرفورمنس</div>
                </label>
              </div>
            </div>
          </div>

          <!-- Step 2: Teacher Selection -->
          <div id="wizard-step-2" class="wizard-step-pane" style="${currentStep === 2 ? "" : "display:none;"}">
            <h4 style="font-size: var(--font-size-base); font-weight: bold; margin-bottom: 1rem;">مدرس مورد نظر خود را انتخاب کنید:</h4>
            
            <div class="grid grid-cols-2 gap-3" style="max-height: 360px; overflow-y: auto;">
              ${teachers.map(t => {
                const isSelected = t.id === selectedTeacherId;
                return `
                  <div class="card card-interactive wizard-teacher-option" data-teacher-id="${t.id}" style="padding: 1rem; cursor: pointer; border: 2px solid ${isSelected ? "var(--color-primary)" : "var(--color-border)"};">
                    <div class="flex items-center gap-3">
                      <img src="${escapeHtml(t.avatar)}" alt="${escapeHtml(t.name)}" style="width: 50px; height: 50px; border-radius: 9999px; object-fit: cover;">
                      <div>
                        <div class="font-bold" style="font-size: 14px;">${escapeHtml(t.name)}</div>
                        <div class="text-muted" style="font-size: 11px;">${escapeHtml(t.title)}</div>
                        <div class="flex items-center gap-1 mt-1" style="font-size: 12px; color: #F59E0B;">
                          ${icons.star("w-3 h-3", "#F59E0B")}
                          <span class="font-bold">${toPersianDigits(t.rating)}</span>
                          <span class="text-muted">(${toPersianDigits(t.completedClasses)} کلاس)</span>
                        </div>
                      </div>
                    </div>
                    <div class="flex justify-between items-center mt-3 pt-2" style="border-top: 1px solid var(--color-border); font-size: 12px;">
                      <span class="text-muted">ساعتی:</span>
                      <span class="font-bold text-primary">${formatCurrency(t.hourlyRate)}</span>
                    </div>
                  </div>
                `;
              }).join("")}
            </div>
          </div>

          <!-- Step 3: Date & Slot Selection -->
          <div id="wizard-step-3" class="wizard-step-pane" style="${currentStep === 3 ? "" : "display:none;"}">
            <h4 style="font-size: var(--font-size-base); font-weight: bold; margin-bottom: 0.5rem;">روز و ساعت کلاس را از تقویم مدرس انتخاب کنید:</h4>
            <div id="wizard-calendar-mount">
              <div class="loading-container"><span class="spinner"></span> دریافت ساعات آزاد مدرس...</div>
            </div>
          </div>

          <!-- Step 4: Review & Payment -->
          <div id="wizard-step-4" class="wizard-step-pane" style="${currentStep === 4 ? "" : "display:none;"}">
            <h4 style="font-size: var(--font-size-base); font-weight: bold; margin-bottom: 1rem;">پیش‌فاکتور و تایید نهایی رزرو:</h4>
            
            <div class="card" style="background-color: var(--color-bg-subtle); margin-bottom: 1rem;">
              <div class="flex items-center justify-between mb-2">
                <span class="text-muted">عنوان کلاس:</span>
                <span class="font-bold">${escapeHtml(course.title)} (${selectedLevel === "beginner" ? "مقدماتی" : selectedLevel === "intermediate" ? "متوسط" : "پیشرفته"})</span>
              </div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-muted">مدرس انتخابی:</span>
                <span class="font-bold">${escapeHtml(teacher.name)}</span>
              </div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-muted">تاریخ و ساعت جلسه:</span>
                <span class="font-bold text-primary">${selectedSlot ? `${selectedSlot.dayName} (${selectedSlot.dateStr}) - ساعت ${toPersianDigits(selectedSlot.time)}` : "انتخاب نشده"}</span>
              </div>
              <div class="flex items-center justify-between pt-2" style="border-top: 1px solid var(--color-border);">
                <span class="font-bold">مبلغ قابل پرداخت:</span>
                <span class="font-bold text-primary" style="font-size: var(--font-size-lg);">${formatCurrency(teacher.hourlyRate)}</span>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">پلتفرم پیشنهادی جلسه آنلاین:</label>
              <select id="wizard-meeting-provider" class="form-select">
                <option value="google_meet" ${selectedProvider === "google_meet" ? "selected" : ""}>گوگل میت (Google Meet - رسمی و بدون نیاز به نصب)</option>
                <option value="skyroom" ${selectedProvider === "skyroom" ? "selected" : ""}>اسکای‌روم (Skyroom - سرورهای پرسرعت داخل کشور)</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">توضیحات یا مباحثی که مایلید در این جلسه بررسی شود (اختیاری):</label>
              <textarea id="wizard-notes" class="form-textarea" placeholder="مثال: رفع اشکال مباحث Decorator و اتصال جنگو به دیتابیس...">${escapeHtml(studentNotes)}</textarea>
            </div>

            <div class="alert alert-info">
              ${icons.info("w-4 h-4")}
              <div>این پرداخت به صورت آزمایشی (Mock Gateway) شبیه‌سازی می‌شود و مستقیماً لینک جلسه ایجاد می‌گردد.</div>
            </div>
          </div>
        </div>
      `,
      footerHtml: `
        <button class="btn btn-ghost" id="wizard-btn-prev" ${currentStep === 1 ? "style='display:none;'" : ""}>
          قبلی
        </button>
        <button class="btn btn-primary" id="wizard-btn-next">
          ${currentStep === 4 ? "پرداخت و ثبت نهایی رزرو" : "مرحله بعد"}
        </button>
      `,
      onRender: (dialog) => {
        attachWizardEvents(dialog);
      }
    });
  }

  async function loadTeacherCalendar(dialog) {
    const mount = dialog.querySelector("#wizard-calendar-mount");
    if (!mount) return;

    try {
      const avail = await calendarService.getTeacherAvailability(selectedTeacherId);
      const currentWeek = getCurrentPersianWeek(0);

      const daysHtml = currentWeek.map(day => {
        const slots = (avail.weeklySchedule && avail.weeklySchedule[day.dayKey]) || [];
        const isDayBlocked = (avail.blockedDates || []).includes(day.fullShamsiDate);

        const slotsHtml = slots.map(s => {
          const isBlocked = isDayBlocked || s.isBlocked;
          const isBooked = s.isBooked;
          let status = "available";
          let label = "آزاد";

          if (isBlocked) { status = "blocked"; label = "بلاک"; }
          else if (isBooked) { status = "booked"; label = "رزرو"; }

          const isSelected = selectedSlot && selectedSlot.slotId === s.id && selectedSlot.fullShamsiDate === day.fullShamsiDate;

          return `
            <div 
              class="slot-item ${status} ${isSelected ? "selected" : ""}"
              data-slot-id="${s.id}"
              data-slot-time="${escapeHtml(s.time)}"
              data-day-key="${day.dayKey}"
              data-day-name="${day.dayName}"
              data-date-str="${day.dateStr}"
              data-full-date="${day.fullShamsiDate}"
              data-status="${status}"
              style="padding: 6px 4px; font-size: 11px;"
            >
              ${toPersianDigits(s.time)}
            </div>
          `;
        }).join("");

        return `
          <div class="calendar-day-col" style="min-height: 200px;">
            <div class="calendar-day-header" style="padding: 6px 2px;">
              <div style="font-weight: bold; font-size: 12px;">${day.dayName}</div>
              <div style="font-size: 10px; color: var(--color-text-muted);">${day.dateStr}</div>
            </div>
            <div class="calendar-slots-list">
              ${slotsHtml.length ? slotsHtml : `<div style="font-size: 10px; color: var(--color-text-muted); text-align: center; padding: 10px 0;">تایمی نیست</div>`}
            </div>
          </div>
        `;
      }).join("");

      mount.innerHTML = `
        <div class="calendar-widget" style="border-radius: var(--radius-lg);">
          <div class="calendar-grid-week">
            ${daysHtml}
          </div>
        </div>
      `;

      // Attach slot click handlers
      mount.querySelectorAll(".slot-item.available").forEach(el => {
        el.addEventListener("click", () => {
          mount.querySelectorAll(".slot-item").forEach(s => s.classList.remove("selected"));
          el.classList.add("selected");
          selectedSlot = {
            slotId: el.dataset.slotId,
            time: el.dataset.slotTime,
            dayKey: el.dataset.dayKey,
            dayName: el.dataset.dayName,
            dateStr: el.dataset.dateStr,
            fullShamsiDate: el.dataset.fullDate
          };
        });
      });

    } catch (err) {
      mount.innerHTML = `<div class="error-state"><p>خطا در دریافت تقویم مدرس</p></div>`;
    }
  }

  function attachWizardEvents(dialog) {
    // Step 1 selectors
    const courseSelect = dialog.querySelector("#wizard-course-select");
    if (courseSelect) {
      courseSelect.addEventListener("change", (e) => {
        selectedCourseId = e.target.value;
      });
    }

    dialog.querySelectorAll("input[name='wizard-level']").forEach(radio => {
      radio.addEventListener("change", (e) => {
        selectedLevel = e.target.value;
        dialog.querySelectorAll("input[name='wizard-level']").forEach(r => {
          r.closest(".card").style.borderColor = r.checked ? "var(--color-primary)" : "var(--color-border)";
        });
      });
    });

    // Step 2 Teacher Cards
    dialog.querySelectorAll(".wizard-teacher-option").forEach(card => {
      card.addEventListener("click", () => {
        selectedTeacherId = card.dataset.teacherId;
        selectedSlot = null; // reset slot if teacher changed
        dialog.querySelectorAll(".wizard-teacher-option").forEach(c => c.style.borderColor = "var(--color-border)");
        card.style.borderColor = "var(--color-primary)";
      });
    });

    // Step 4 Provider & Notes
    const providerSelect = dialog.querySelector("#wizard-meeting-provider");
    if (providerSelect) {
      providerSelect.addEventListener("change", (e) => {
        selectedProvider = e.target.value;
      });
    }

    const notesArea = dialog.querySelector("#wizard-notes");
    if (notesArea) {
      notesArea.addEventListener("input", (e) => {
        studentNotes = e.target.value;
      });
    }

    // Prev Button
    const prevBtn = dialog.querySelector("#wizard-btn-prev");
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        if (currentStep > 1) {
          currentStep--;
          renderWizard();
        }
      });
    }

    // Next Button
    const nextBtn = dialog.querySelector("#wizard-btn-next");
    if (nextBtn) {
      nextBtn.addEventListener("click", async () => {
        if (currentStep === 1) {
          currentStep = 2;
          renderWizard();
        } else if (currentStep === 2) {
          currentStep = 3;
          renderWizard();
          setTimeout(() => {
            const activeDialog = document.querySelector("#app-active-modal .modal-dialog");
            if (activeDialog) loadTeacherCalendar(activeDialog);
          }, 50);
        } else if (currentStep === 3) {
          if (!selectedSlot) {
            showToast("لطفاً یک تایم اسلات سبز رنگ (آزاد) انتخاب کنید.", "warning");
            return;
          }
          currentStep = 4;
          renderWizard();
        } else if (currentStep === 4) {
          // Final Submit & Payment
          nextBtn.disabled = true;
          nextBtn.innerHTML = `<span class="spinner" style="width:16px;height:16px;"></span> در حال پردازش تراکنش و ثبت کلاس...`;

          try {
            const course = getSelectedCourse();
            const teacher = getSelectedTeacher();

            // 1. Process mock payment
            await bookingService.processMockPayment(teacher.hourlyRate);

            // 2. Submit booking to API
            const bookingResult = await bookingService.createBooking({
              studentId: currentUser.id,
              studentName: currentUser.name,
              teacherId: teacher.id,
              teacherName: teacher.name,
              teacherAvatar: teacher.avatar,
              courseId: course.id,
              courseTitle: course.title,
              level: selectedLevel,
              levelTitle: selectedLevel === "beginner" ? "مقدماتی" : selectedLevel === "intermediate" ? "متوسط" : "پیشرفته",
              date: selectedSlot.fullShamsiDate,
              dayOfWeek: selectedSlot.dayName,
              timeSlot: selectedSlot.time,
              price: teacher.hourlyRate,
              meetingProvider: selectedProvider,
              notes: studentNotes
            });

            closeModal();
            showToast("کلاس با موفقیت رزرو شد! لینک ورود در پنل کاربری شما قرار گرفت.", "success", 4000);

            // Open Success Dialog
            openModal({
              title: "🎉 رزرو کلاس قطعی شد",
              bodyHtml: `
                <div class="text-center" style="padding: 1rem 0;">
                  <div style="width: 64px; height: 64px; background-color: var(--color-success-bg); color: var(--color-success); border-radius: 9999px; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem auto;">
                    ${icons.check("w-8 h-8")}
                  </div>
                  <h3 style="font-size: var(--font-size-xl); font-weight: bold; margin-bottom: 0.5rem;">کلاس شما آماده است</h3>
                  <p class="text-muted" style="margin-bottom: 1.5rem;">
                    جلسه آنلاین <strong>${escapeHtml(course.title)}</strong> با <strong>${escapeHtml(teacher.name)}</strong> در تاریخ <strong>${selectedSlot.dayName} (${selectedSlot.dateStr}) ساعت ${toPersianDigits(selectedSlot.time)}</strong> ثبت شد.
                  </p>
                  
                  <div class="card" style="background-color: var(--color-bg-subtle); text-align: right; margin-bottom: 1.5rem;">
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-muted">پلتفرم:</span>
                      <span class="font-bold">${selectedProvider === "google_meet" ? "Google Meet" : "Skyroom"}</span>
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-muted">لینک مستقیم جلسه:</span>
                      <a href="${bookingResult.data.meetingUrl}" target="_blank" class="text-primary font-bold flex items-center gap-1" style="direction: ltr;">
                        ${bookingResult.data.meetingUrl} ${icons.externalLink("w-3 h-3")}
                      </a>
                    </div>
                  </div>

                  <div class="flex gap-2 justify-center">
                    <a href="#/classes/${bookingResult.data.id}" class="btn btn-primary" onclick="window.closeCurrentModal()">
                      ورود به اتاق کلاس مجازی
                    </a>
                    <a href="#/dashboard/student" class="btn btn-outline" onclick="window.closeCurrentModal()">
                      مشاهده در پنل کاربری
                    </a>
                  </div>
                </div>
              `
            });

            window.closeCurrentModal = () => closeModal();

          } catch (err) {
            nextBtn.disabled = false;
            nextBtn.innerHTML = "پرداخت و ثبت نهایی رزرو";
            showToast(err.message || "خطا در ثبت رزرو کلاس", "danger");
          }
        }
      });
    }
  }

  renderWizard();
}
