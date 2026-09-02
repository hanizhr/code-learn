/**
 * Teachers Catalog & Search/Filter Page Component
 */

import { teacherService } from "../services/teacher.service.js";
import { courseService } from "../services/course.service.js";
import { renderTeacherCard } from "../components/teacherCard.js";
import { launchBookingWizard } from "../components/bookingModal.js";
import { icons } from "../utils/icons.js";
import { escapeHtml } from "../utils/dom.js";

export async function renderTeachersPage(container, params, queryParams) {
  const [allTeachers, courses] = await Promise.all([
    teacherService.getTeachers(),
    courseService.getCourses()
  ]);

  let selectedSubject = queryParams.get("subject") || "";
  let selectedLevel = queryParams.get("level") || "";
  let searchQuery = queryParams.get("q") || "";
  let sortBy = queryParams.get("sort") || "rating"; // rating, classes, price_asc, price_desc, newest

  // Apply filters
  let filtered = [...allTeachers];

  if (selectedSubject) {
    filtered = filtered.filter(t => 
      t.specialties.some(s => s.toLowerCase().includes(selectedSubject.toLowerCase())) ||
      (t.teachingSubjects && t.teachingSubjects.some(sub => sub.subjectId === selectedSubject || sub.subjectTitle.includes(selectedSubject)))
    );
  }

  if (selectedLevel) {
    filtered = filtered.filter(t => 
      t.teachingSubjects && t.teachingSubjects.some(sub => sub.levels.includes(selectedLevel))
    );
  }

  if (searchQuery) {
    const q = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(t => 
      t.name.toLowerCase().includes(q) ||
      t.title.toLowerCase().includes(q) ||
      t.specialties.some(s => s.toLowerCase().includes(q))
    );
  }

  // Sort
  if (sortBy === "rating") {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === "classes") {
    filtered.sort((a, b) => b.completedClasses - a.completedClasses);
  } else if (sortBy === "price_asc") {
    filtered.sort((a, b) => a.hourlyRate - b.hourlyRate);
  } else if (sortBy === "price_desc") {
    filtered.sort((a, b) => b.hourlyRate - a.hourlyRate);
  }

  const teacherCardsHtml = filtered.length
    ? filtered.map(t => renderTeacherCard(t)).join("")
    : `
      <div class="empty-state" style="grid-column: 1 / -1; padding: 3rem 1rem;">
        <div style="margin-bottom: 1rem;">${icons.users("w-12 h-12 text-muted mx-auto")}</div>
        <h3 class="font-bold">مدرسی با این مشخصات یافت نشد</h3>
        <p class="text-muted">لطفاً فیلترها را حذف کرده یا کلیدواژه دیگری جستجو کنید.</p>
        <button class="btn btn-primary btn-sm mt-3" id="btn-reset-filters">حذف فیلترها</button>
      </div>
    `;

  const pageHtml = `
    <div class="page-container">
      <div class="container">
        
        <!-- Header -->
        <div class="section-title-wrap text-center mb-8">
          <span class="badge badge-primary" style="margin-bottom: 0.5rem;">اساتید و منتورهای ارشد</span>
          <h2>لیست و انتخاب مدرسان برنامه‌نویسی</h2>
          <p>رزومه، امتیاز، تجربه کاری و تقویم مدرسین را بررسی و کلاس خود را رزرو کنید</p>
        </div>

        <!-- Filter & Search Toolbar -->
        <div class="card mb-6" style="padding: 1.25rem;">
          <div class="grid grid-cols-4 gap-3">
            
            <!-- Search input -->
            <div>
              <label class="form-label" style="font-size: 11px;">جستجوی نام یا مهارت:</label>
              <div class="flex items-center gap-1">
                <input 
                  type="text" 
                  id="filter-search-input" 
                  class="form-input" 
                  placeholder="نام مدرس یا تخصص..." 
                  value="${escapeHtml(searchQuery)}"
                  style="height: 38px; font-size: 13px;"
                />
              </div>
            </div>

            <!-- Subject Select -->
            <div>
              <label class="form-label" style="font-size: 11px;">موضوع تدریس:</label>
              <select id="filter-subject-select" class="form-select" style="height: 38px; font-size: 13px;">
                <option value="">همه موضوعات</option>
                ${courses.map(c => `
                  <option value="${c.id}" ${selectedSubject === c.id ? "selected" : ""}>${escapeHtml(c.title)}</option>
                `).join("")}
              </select>
            </div>

            <!-- Level Select -->
            <div>
              <label class="form-label" style="font-size: 11px;">سطح تدریس:</label>
              <select id="filter-level-select" class="form-select" style="height: 38px; font-size: 13px;">
                <option value="">همه سطوح</option>
                <option value="beginner" ${selectedLevel === "beginner" ? "selected" : ""}>مقدماتی</option>
                <option value="intermediate" ${selectedLevel === "intermediate" ? "selected" : ""}>متوسط</option>
                <option value="advanced" ${selectedLevel === "advanced" ? "selected" : ""}>پیشرفته</option>
              </select>
            </div>

            <!-- Sort Select -->
            <div>
              <label class="form-label" style="font-size: 11px;">مرتب‌سازی بر اساس:</label>
              <select id="filter-sort-select" class="form-select" style="height: 38px; font-size: 13px;">
                <option value="rating" ${sortBy === "rating" ? "selected" : ""}>بالاترین امتیاز</option>
                <option value="classes" ${sortBy === "classes" ? "selected" : ""}>بیشترین کلاس برگزار شده</option>
                <option value="price_asc" ${sortBy === "price_asc" ? "selected" : ""}>ارزان‌ترین نرخ تدریس</option>
                <option value="price_desc" ${sortBy === "price_desc" ? "selected" : ""}>بالاترین نرخ تدریس</option>
              </select>
            </div>

          </div>
        </div>

        <!-- Teachers Grid -->
        <div class="grid grid-cols-4 gap-4" id="teachers-catalog-grid">
          ${teacherCardsHtml}
        </div>

      </div>
    </div>
  `;

  container.innerHTML = pageHtml;

  // Filter change handlers
  const updateUrl = () => {
    const q = container.querySelector("#filter-search-input").value.trim();
    const subject = container.querySelector("#filter-subject-select").value;
    const level = container.querySelector("#filter-level-select").value;
    const sort = container.querySelector("#filter-sort-select").value;

    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (subject) params.set("subject", subject);
    if (level) params.set("level", level);
    if (sort) params.set("sort", sort);

    window.location.hash = `#/teachers?${params.toString()}`;
  };

  container.querySelector("#filter-search-input").addEventListener("keypress", (e) => {
    if (e.key === "Enter") updateUrl();
  });
  container.querySelector("#filter-subject-select").addEventListener("change", updateUrl);
  container.querySelector("#filter-level-select").addEventListener("change", updateUrl);
  container.querySelector("#filter-sort-select").addEventListener("change", updateUrl);

  const resetBtn = container.querySelector("#btn-reset-filters");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      window.location.hash = "#/teachers";
    });
  }

  // Quick book action
  container.querySelectorAll(".btn-quick-book").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      launchBookingWizard({ teacherId: btn.dataset.teacherId });
    });
  });
}
