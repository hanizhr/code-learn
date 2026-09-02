/**
 * Courses Catalog Page Component
 */

import { courseService } from "../services/course.service.js";
import { renderCourseCard } from "../components/courseCard.js";
import { icons } from "../utils/icons.js";

export async function renderCoursesPage(container, params, queryParams) {
  const allCourses = await courseService.getCourses();
  const activeCategory = queryParams.get("category") || "all";
  const searchQuery = queryParams.get("q") || "";

  let filtered = allCourses;
  if (activeCategory !== "all") {
    filtered = filtered.filter(c => c.category === activeCategory);
  }
  if (searchQuery) {
    filtered = filtered.filter(c => 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }

  const coursesCardsHtml = filtered.length
    ? filtered.map(c => renderCourseCard(c)).join("")
    : `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div style="margin-bottom: 1rem;">${icons.book("w-12 h-12 text-muted mx-auto")}</div>
        <h3 class="font-bold">دوره‌ای مطابق با جستجوی شما یافت نشد</h3>
        <p class="text-muted">لطفاً واژه جستجو را تغییر دهید یا دسته‌بندی دیگری انتخاب کنید.</p>
      </div>
    `;

  const pageHtml = `
    <div class="page-container">
      <div class="container">
        
        <!-- Header -->
        <div class="section-title-wrap text-center mb-8">
          <span class="badge badge-primary" style="margin-bottom: 0.5rem;">نقشه راه و سرفصل‌های جامع</span>
          <h2>دوره‌ها و مباحث آموزشی برنامه‌نویسی</h2>
          <p>آموزش‌های تخصصی متناسب با نیاز بازار کار؛ با همراهی مدرسین اختصاصی</p>
        </div>

        <!-- Filter & Search Bar -->
        <div class="card mb-6" style="padding: 1.25rem;">
          <div class="flex flex-col md:flex-row gap-3 items-center justify-between">
            
            <!-- Category Chips -->
            <div class="flex flex-wrap gap-2">
              <a href="#/courses" class="badge ${activeCategory === "all" ? "badge-primary" : "badge-neutral"}" style="padding: 6px 14px; font-size: 13px;">همه موضوعات</a>
              <a href="#/courses?category=language" class="badge ${activeCategory === "language" ? "badge-primary" : "badge-neutral"}" style="padding: 6px 14px; font-size: 13px;">زبان‌های اصلی</a>
              <a href="#/courses?category=web" class="badge ${activeCategory === "web" ? "badge-primary" : "badge-neutral"}" style="padding: 6px 14px; font-size: 13px;">وب و فرانت‌اند</a>
              <a href="#/courses?category=backend" class="badge ${activeCategory === "backend" ? "badge-primary" : "badge-neutral"}" style="padding: 6px 14px; font-size: 13px;">بک‌اند و فریم‌ورک</a>
              <a href="#/courses?category=ai" class="badge ${activeCategory === "ai" ? "badge-primary" : "badge-neutral"}" style="padding: 6px 14px; font-size: 13px;">هوش مصنوعی و داده</a>
              <a href="#/courses?category=database" class="badge ${activeCategory === "database" ? "badge-primary" : "badge-neutral"}" style="padding: 6px 14px; font-size: 13px;">دیتابیس</a>
            </div>

            <!-- Search input -->
            <div class="flex items-center gap-2" style="width: 100%; max-width: 300px;">
              <input 
                type="text" 
                id="courses-search-input" 
                class="form-input" 
                placeholder="جستجو در دوره‌ها..." 
                value="${searchQuery}"
                style="height: 38px; font-size: 13px;"
              />
              <button class="btn btn-primary btn-sm" id="btn-search-courses">
                ${icons.search("w-4 h-4")}
              </button>
            </div>

          </div>
        </div>

        <!-- Courses Grid -->
        <div class="grid grid-cols-3 gap-4">
          ${coursesCardsHtml}
        </div>

      </div>
    </div>
  `;

  container.innerHTML = pageHtml;

  const searchInput = container.querySelector("#courses-search-input");
  const searchBtn = container.querySelector("#btn-search-courses");
  if (searchInput && searchBtn) {
    const applySearch = () => {
      const q = searchInput.value.trim();
      const catParam = activeCategory !== "all" ? `&category=${activeCategory}` : "";
      window.location.hash = `#/courses?q=${encodeURIComponent(q)}${catParam}`;
    };
    searchBtn.addEventListener("click", applySearch);
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") applySearch();
    });
  }
}
