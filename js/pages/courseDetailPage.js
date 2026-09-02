/**
 * Course Details & Syllabus Page Component
 */

import { courseService } from "../services/course.service.js";
import { teacherService } from "../services/teacher.service.js";
import { renderTeacherCard } from "../components/teacherCard.js";
import { launchBookingWizard } from "../components/bookingModal.js";
import { icons } from "../utils/icons.js";
import { formatHours, toPersianDigits } from "../utils/formatters.js";
import { escapeHtml } from "../utils/dom.js";

export async function renderCourseDetailPage(container, params) {
  const courseId = params.id;
  const course = await courseService.getCourseById(courseId);

  if (!course) {
    container.innerHTML = `
      <div class="container" style="padding: 4rem 1rem;">
        <div class="empty-state">
          <h3>دوره مورد نظر یافت نشد</h3>
          <a href="#/courses" class="btn btn-primary mt-4">بازگشت به لیست دوره‌ها</a>
        </div>
      </div>
    `;
    return;
  }

  // Get teachers for this subject
  const teachers = await teacherService.getTeachers({ subject: course.id });
  const teachersHtml = teachers.length
    ? teachers.map(t => renderTeacherCard(t)).join("")
    : `<div class="text-muted" style="grid-column: 1 / -1; padding: 2rem 0; text-align: center;">مدرسی در حال حاضر برای این موضوع ثبت نشده است.</div>`;

  const levelsSyllabusHtml = (course.levels || []).map(lvl => {
    const topicsList = (lvl.topics || []).map(t => `
      <li class="flex items-center gap-2 mb-2" style="font-size: 13px;">
        <span class="text-success">${icons.check("w-4 h-4")}</span>
        <span>${escapeHtml(t)}</span>
      </li>
    `).join("");

    return `
      <div class="card" style="padding: 1.5rem; margin-bottom: 1rem; border-right: 4px solid var(--color-primary);">
        <div class="flex items-center justify-between mb-3">
          <h3 style="font-size: var(--font-size-base); font-weight: bold;">
            سطح ${escapeHtml(lvl.title)}
          </h3>
          <span class="badge badge-neutral">${formatHours(lvl.hours)} تدریس تخصصی</span>
        </div>
        <ul style="list-style: none; padding: 0; margin: 0;">
          ${topicsList}
        </ul>
      </div>
    `;
  }).join("");

  const pageHtml = `
    <div class="page-container">
      <div class="container">
        
        <!-- Breadcrumbs -->
        <div class="flex items-center gap-2 text-muted mb-4" style="font-size: 13px;">
          <a href="#/" class="footer-link">صفحه اصلی</a>
          <span>/</span>
          <a href="#/courses" class="footer-link">دوره‌ها</a>
          <span>/</span>
          <span class="text-main font-semibold">${escapeHtml(course.title)}</span>
        </div>

        <!-- Course Hero Overview -->
        <div class="card mb-8" style="padding: 2.5rem 2rem; background: linear-gradient(135deg, var(--color-bg-surface), var(--color-bg-subtle));">
          <div class="flex flex-col md:flex-row items-center gap-6">
            <div class="course-icon-badge" style="width: 80px; height: 80px; border-radius: var(--radius-xl); background-color: var(--color-primary-light);">
              ${icons[course.icon] ? icons[course.icon]("w-10 h-10 text-primary") : icons.code("w-10 h-10 text-primary")}
            </div>
            
            <div style="flex: 1;">
              <span class="badge badge-primary mb-2">سرفصل استاندارد بین‌المللی</span>
              <h1 style="font-size: var(--font-size-2xl); font-weight: 800; margin-bottom: 0.75rem;">
                ${escapeHtml(course.title)}
              </h1>
              <p class="text-secondary" style="font-size: var(--font-size-base); line-height: 1.7; max-width: 750px;">
                ${escapeHtml(course.description)}
              </p>
            </div>

            <div class="flex flex-col gap-2" style="min-width: 200px;">
              <button class="btn btn-primary btn-lg flex items-center justify-center gap-2 btn-book-this-course">
                ${icons.calendar("w-5 h-5")}
                <span>رزرو کلاس با مدرس</span>
              </button>
              <a href="#/teachers?subject=${encodeURIComponent(course.id)}" class="btn btn-outline btn-sm text-center">
                مشاهده اساتید این دوره
              </a>
            </div>
          </div>
        </div>

        <!-- Grid Layout: Syllabus & Teachers -->
        <div class="grid grid-cols-3 gap-6">
          
          <!-- Left 2 Cols: Syllabus -->
          <div style="grid-column: span 2;">
            <div class="flex items-center gap-2 mb-4">
              ${icons.book("w-5 h-5 text-primary")}
              <h2 style="font-size: var(--font-size-xl); font-weight: bold;">سرفصل‌های آموزشی و مباحث تفکیک شده</h2>
            </div>
            ${levelsSyllabusHtml}
          </div>

          <!-- Right 1 Col: Highlights -->
          <div>
            <div class="card mb-4" style="padding: 1.5rem;">
              <h3 style="font-size: var(--font-size-base); font-weight: bold; margin-bottom: 1rem;">ویژگی‌های یادگیری در کدلرن</h3>
              
              <div class="flex items-start gap-3 mb-4">
                <div style="color: var(--color-primary);">${icons.zap("w-5 h-5")}</div>
                <div>
                  <div class="font-bold" style="font-size: 13px;">آموزش تعاملی و تک‌به‌تک</div>
                  <div class="text-muted" style="font-size: 12px;">مستقیماً با منتور کد بزنید و باگ بگیرید.</div>
                </div>
              </div>

              <div class="flex items-start gap-3 mb-4">
                <div style="color: var(--color-success);">${icons.shield("w-5 h-5")}</div>
                <div>
                  <div class="font-bold" style="font-size: 13px;">تطابق کامل با سطح شما</div>
                  <div class="text-muted" style="font-size: 12px;">از تعیین سطح اولیه تا حل پروژه‌های واقعی.</div>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div style="color: var(--color-primary);">${icons.clock("w-5 h-5")}</div>
                <div>
                  <div class="font-bold" style="font-size: 13px;">انعطاف زمانی کامل</div>
                  <div class="text-muted" style="font-size: 12px;">امکان رزرو در روزهای زوج، فرد و آخر هفته‌ها.</div>
                </div>
              </div>
            </div>

            <!-- Tags -->
            <div class="card" style="padding: 1.25rem;">
              <h4 style="font-size: 13px; font-weight: bold; margin-bottom: 0.75rem;">تگ‌ها و کلیدواژه‌ها:</h4>
              <div class="flex flex-wrap gap-1">
                ${(course.tags || []).map(t => `<span class="badge badge-neutral">${escapeHtml(t)}</span>`).join("")}
              </div>
            </div>
          </div>

        </div>

        <!-- Teachers Section for this course -->
        <div class="mt-12">
          <div class="section-title-wrap text-center mb-6">
            <span class="badge badge-neutral">مدرسان فعال این حوزه</span>
            <h2>مدرسان متخصص ${escapeHtml(course.title)}</h2>
            <p>می‌توانید با هر یک از اساتید زیر کلاس آنلاین خصوصی رزرو کنید</p>
          </div>
          <div class="grid grid-cols-4 gap-4">
            ${teachersHtml}
          </div>
        </div>

      </div>
    </div>
  `;

  container.innerHTML = pageHtml;

  // Book button
  const bookBtn = container.querySelector(".btn-book-this-course");
  if (bookBtn) {
    bookBtn.addEventListener("click", () => {
      launchBookingWizard({ courseId: course.id });
    });
  }

  // Teacher cards buttons
  container.querySelectorAll(".btn-quick-book").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      launchBookingWizard({ teacherId: btn.dataset.teacherId, courseId: course.id });
    });
  });
}
