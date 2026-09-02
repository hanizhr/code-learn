/**
 * Home Page Component
 */

import { teacherService } from "../services/teacher.service.js";
import { courseService } from "../services/course.service.js";
import { renderTeacherCard } from "../components/teacherCard.js";
import { renderCourseCard } from "../components/courseCard.js";
import { launchBookingWizard } from "../components/bookingModal.js";
import { icons } from "../utils/icons.js";
import { toPersianDigits } from "../utils/formatters.js";

export async function renderHomePage(container) {
  // Fetch featured courses & teachers
  const [featuredCourses, featuredTeachers] = await Promise.all([
    courseService.getFeaturedCourses(),
    teacherService.getFeaturedTeachers()
  ]);

  const coursesHtml = featuredCourses.map(c => renderCourseCard(c)).join("");
  const teachersHtml = featuredTeachers.map(t => renderTeacherCard(t)).join("");

  const pageHtml = `
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="hero-content">
          <div class="hero-badge">
            ${icons.zap("w-4 h-4 text-primary")}
            <span>پلتفرم تخصصی آموزش آنلاین و منتورینگ برنامه‌نویسی</span>
          </div>

          <h1 class="hero-title">
            یادگیری عمیق برنامه‌نویسی با <span class="highlight">کلاس‌های آنلاین</span> و مدرس اختصاصی
          </h1>

          <p class="hero-subtitle">
            بدون اتلاف وقت در آموزش‌های ضبط شده قدیمی، مستقیم با مدرسان ارشد صنعت نرم‌افزار کد بزنید، پروژه‌های واقعی بسازید و مهارت‌های خود را ارتقا دهید.
          </p>

          <!-- Quick Search Bar -->
          <div class="hero-search-wrapper" style="max-width: 620px; margin: 0 auto 2rem auto;">
            <div class="hero-search-box flex items-center gap-2" style="background: var(--color-bg-surface); padding: 6px 12px; border-radius: 9999px; border: 2px solid var(--color-border); box-shadow: var(--shadow-lg);">
              <span class="text-muted">${icons.search("w-5 h-5")}</span>
              <input 
                type="text" 
                id="hero-quick-search-input" 
                placeholder="جستجوی آموزش یا زبان (پایتون، ری‌اکت، جنگو، هوش مصنوعی...)" 
                style="flex: 1; border: none; outline: none; background: transparent; font-size: 14px; padding: 8px 4px;"
              />
              <button class="btn btn-primary btn-sm" id="btn-hero-search" style="border-radius: 9999px; padding: 0.5rem 1.25rem;">
                جستجو
              </button>
            </div>
          </div>

          <!-- CTA Buttons -->
          <div class="hero-actions">
            <a href="#/courses" class="btn btn-primary btn-lg flex items-center gap-2">
              ${icons.book("w-5 h-5")}
              <span>شروع یادگیری و مشاهده دوره‌ها</span>
            </a>
            <a href="#/teachers" class="btn btn-outline btn-lg flex items-center gap-2">
              ${icons.users("w-5 h-5")}
              <span>مشاهده و انتخاب مدرس</span>
            </a>
            <a href="#/auth?mode=register&role=teacher" class="btn btn-ghost btn-lg flex items-center gap-2">
              ${icons.zap("w-5 h-5 text-primary")}
              <span>مدرس شوید</span>
            </a>
          </div>
        </div>

        <!-- Stats Bar -->
        <div class="stats-bar">
          <div class="stat-item">
            <div class="stat-number">+${toPersianDigits(150)}</div>
            <div class="stat-label">مدرس و منتور مجرب</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">+${toPersianDigits(5000)}</div>
            <div class="stat-label">کلاس برگزار شده آنلاین</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">${toPersianDigits(98)}٪</div>
            <div class="stat-label">رضایت دانشجویان</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">${toPersianDigits(24)} / ${toPersianDigits(7)}</div>
            <div class="stat-label">پشتیبانی و برگزاری</div>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="section bg-subtle">
      <div class="container">
        <div class="section-title-wrap">
          <span class="badge badge-primary" style="margin-bottom: 0.5rem;">روند ساده رزرو و یادگیری</span>
          <h2>کدلرن چگونه کار می‌کند؟</h2>
          <p>در چهار گام ساده، کلاس آنلاین اختصاصی خود را تنظیم و یادگیری را آغاز کنید</p>
        </div>

        <div class="grid grid-cols-4 gap-4 mt-6">
          <div class="card text-center" style="padding: 2rem 1.5rem;">
            <div class="step-circle" style="width: 48px; height: 48px; margin: 0 auto 1.25rem auto; font-size: 18px; font-weight: bold; background-color: var(--color-primary-light); color: var(--color-primary); border-radius: 9999px; display: flex; align-items: center; justify-content: center;">
              ۱
            </div>
            <h3 style="font-size: var(--font-size-base); font-weight: bold; margin-bottom: 0.5rem;">انتخاب آموزش و سطح</h3>
            <p class="text-muted" style="font-size: var(--font-size-sm); line-height: 1.6;">
              موضوع دلخواه خود را از میان ده‌ها زبان برنامه‌نویسی و فریم‌ورک انتخاب نمایید.
            </p>
          </div>

          <div class="card text-center" style="padding: 2rem 1.5rem;">
            <div class="step-circle" style="width: 48px; height: 48px; margin: 0 auto 1.25rem auto; font-size: 18px; font-weight: bold; background-color: var(--color-primary-light); color: var(--color-primary); border-radius: 9999px; display: flex; align-items: center; justify-content: center;">
              ۲
            </div>
            <h3 style="font-size: var(--font-size-base); font-weight: bold; margin-bottom: 0.5rem;">انتخاب مدرس متناسب</h3>
            <p class="text-muted" style="font-size: var(--font-size-sm); line-height: 1.6;">
              پروفایل، رزومه کاری، نظرات دانشجویان قبلی و نرخ تدریس مدرسین را بررسی کنید.
            </p>
          </div>

          <div class="card text-center" style="padding: 2rem 1.5rem;">
            <div class="step-circle" style="width: 48px; height: 48px; margin: 0 auto 1.25rem auto; font-size: 18px; font-weight: bold; background-color: var(--color-primary-light); color: var(--color-primary); border-radius: 9999px; display: flex; align-items: center; justify-content: center;">
              ۳
            </div>
            <h3 style="font-size: var(--font-size-base); font-weight: bold; margin-bottom: 0.5rem;">انتخاب ساعت و تقویم</h3>
            <p class="text-muted" style="font-size: var(--font-size-sm); line-height: 1.6;">
              در تقویم هوشمند، روز و ساعت خالی مورد نظرتان را رزرو و پرداخت کنید.
            </p>
          </div>

          <div class="card text-center" style="padding: 2rem 1.5rem;">
            <div class="step-circle" style="width: 48px; height: 48px; margin: 0 auto 1.25rem auto; font-size: 18px; font-weight: bold; background-color: var(--color-primary-light); color: var(--color-primary); border-radius: 9999px; display: flex; align-items: center; justify-content: center;">
              ۴
            </div>
            <h3 style="font-size: var(--font-size-base); font-weight: bold; margin-bottom: 0.5rem;">حضور در کلاس آنلاین</h3>
            <p class="text-muted" style="font-size: var(--font-size-sm); line-height: 1.6;">
              در موعد مقرر با یک کلیک وارد اتاق کلاس شده و تعاملی کدنویسی کنید.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Courses Section -->
    <section class="section">
      <div class="container">
        <div class="flex items-center justify-between mb-6">
          <div>
            <span class="badge badge-neutral" style="margin-bottom: 0.5rem;">مهارت‌های روز دنیا</span>
            <h2 style="font-size: var(--font-size-2xl); font-weight: bold;">دوره‌ها و سرفصل‌های آموزشی برتر</h2>
          </div>
          <a href="#/courses" class="btn btn-outline flex items-center gap-1">
            <span>مشاهده همه دوره‌ها</span>
            ${icons.arrowLeft("w-4 h-4")}
          </a>
        </div>

        <div class="grid grid-cols-3 gap-4">
          ${coursesHtml}
        </div>
      </div>
    </section>

    <!-- Top Teachers Section -->
    <section class="section bg-subtle">
      <div class="container">
        <div class="flex items-center justify-between mb-6">
          <div>
            <span class="badge badge-primary" style="margin-bottom: 0.5rem;">مدرسین برتر</span>
            <h2 style="font-size: var(--font-size-2xl); font-weight: bold;">برترین اساتید و منتورهای برنامه‌نویسی</h2>
          </div>
          <a href="#/teachers" class="btn btn-outline flex items-center gap-1">
            <span>لیست تمام مدرس‌ها</span>
            ${icons.arrowLeft("w-4 h-4")}
          </a>
        </div>

        <div class="grid grid-cols-4 gap-4">
          ${teachersHtml}
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="section">
      <div class="container">
        <div class="section-title-wrap">
          <span class="badge badge-neutral" style="margin-bottom: 0.5rem;">تجربه دانشجویان</span>
          <h2>نظرات دانشجویان کدلرن</h2>
          <p>دانشجویان ما چگونه مسیر شغلی خود را با منتورینگ اختصاصی تغییر دادند</p>
        </div>

        <div class="grid grid-cols-3 gap-4 mt-6">
          <div class="card" style="padding: 1.5rem;">
            <div class="flex items-center gap-1 mb-3" style="color: #F59E0B;">
              ${icons.star("w-4 h-4", "#F59E0B")}
              ${icons.star("w-4 h-4", "#F59E0B")}
              ${icons.star("w-4 h-4", "#F59E0B")}
              ${icons.star("w-4 h-4", "#F59E0B")}
              ${icons.star("w-4 h-4", "#F59E0B")}
            </div>
            <p class="text-secondary" style="font-size: var(--font-size-sm); line-height: 1.7; margin-bottom: 1.25rem;">
              «کلاس‌های اختصاصی پایتون با دکتر کمالی بهترین تجربه من در یادگیری برنامه‌نویسی بود. در ۱۰ جلسه پروژه جنگو را از صفر تا دیپلوی کامل کردیم.»
            </p>
            <div class="flex items-center gap-3">
              <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80" alt="دانشجو" style="width: 40px; height: 40px; border-radius: 9999px; object-fit: cover;">
              <div>
                <div class="font-bold" style="font-size: 13px;">سینا محمدی</div>
                <div class="text-muted" style="font-size: 11px;">دانشجوی جنگو و بک‌اند</div>
              </div>
            </div>
          </div>

          <div class="card" style="padding: 1.5rem;">
            <div class="flex items-center gap-1 mb-3" style="color: #F59E0B;">
              ${icons.star("w-4 h-4", "#F59E0B")}
              ${icons.star("w-4 h-4", "#F59E0B")}
              ${icons.star("w-4 h-4", "#F59E0B")}
              ${icons.star("w-4 h-4", "#F59E0B")}
              ${icons.star("w-4 h-4", "#F59E0B")}
            </div>
            <p class="text-secondary" style="font-size: var(--font-size-sm); line-height: 1.7; margin-bottom: 1.25rem;">
              «رفع باگ‌های مصاحبه کاری فرانت‌اند با مهندس طاهری بسیار ارزشمند بود. تقویم رزرو فوق‌العاده راحت و منعطف کار می‌کند.»
            </p>
            <div class="flex items-center gap-3">
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80" alt="دانشجو" style="width: 40px; height: 40px; border-radius: 9999px; object-fit: cover;">
              <div>
                <div class="font-bold" style="font-size: 13px;">مریم حسینی</div>
                <div class="text-muted" style="font-size: 11px;">توسعه‌دهنده React</div>
              </div>
            </div>
          </div>

          <div class="card" style="padding: 1.5rem;">
            <div class="flex items-center gap-1 mb-3" style="color: #F59E0B;">
              ${icons.star("w-4 h-4", "#F59E0B")}
              ${icons.star("w-4 h-4", "#F59E0B")}
              ${icons.star("w-4 h-4", "#F59E0B")}
              ${icons.star("w-4 h-4", "#F59E0B")}
              ${icons.star("w-4 h-4", "#F59E0B")}
            </div>
            <p class="text-secondary" style="font-size: var(--font-size-sm); line-height: 1.7; margin-bottom: 1.25rem;">
              «محیط کلاسی آنلاین و سرعت برگزاری در اسکای‌روم و گوگل میت عالی بود. بدون هیچ قطعی کد روی سیستم استاد به اشتراک گذاشته شد.»
            </p>
            <div class="flex items-center gap-3">
              <img src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=80" alt="دانشجو" style="width: 40px; height: 40px; border-radius: 9999px; object-fit: cover;">
              <div>
                <div class="font-bold" style="font-size: 13px;">پویا کاظمی</div>
                <div class="text-muted" style="font-size: 11px;">دانشجوی هوش مصنوعی</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Final Call to Action -->
    <section class="section" style="background: linear-gradient(135deg, var(--color-primary-dark), var(--color-primary)); color: #fff;">
      <div class="container text-center" style="padding: 3rem 1rem;">
        <h2 style="font-size: var(--font-size-3xl); font-weight: 800; margin-bottom: 1rem;">
          همین امروز یادگیری برنامه‌نویسی را با مدرس اختصاصی شروع کنید
        </h2>
        <p style="font-size: var(--font-size-lg); opacity: 0.9; max-width: 600px; margin: 0 auto 2rem auto;">
          بدون نیاز به تعهد طولانی مدت؛ هر زمان که نیاز داشتید یک ساعت با استاد آنلاین جلسه تنظیم کنید.
        </p>
        <div class="flex justify-center gap-3">
          <a href="#/teachers" class="btn btn-lg" style="background-color: #fff; color: var(--color-primary); font-weight: bold;">
            رزرو اولین جلسه آزمایشی
          </a>
          <a href="#/courses" class="btn btn-outline btn-lg" style="border-color: rgba(255,255,255,0.4); color: #fff;">
            مشاهده سرفصل‌ها
          </a>
        </div>
      </div>
    </section>
  `;

  container.innerHTML = pageHtml;

  // Search input handler
  const searchInput = container.querySelector("#hero-quick-search-input");
  const searchBtn = container.querySelector("#btn-hero-search");
  if (searchInput && searchBtn) {
    const doSearch = () => {
      const q = searchInput.value.trim();
      if (q) {
        window.location.hash = `#/teachers?q=${encodeURIComponent(q)}`;
      } else {
        window.location.hash = "#/teachers";
      }
    };
    searchBtn.addEventListener("click", doSearch);
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") doSearch();
    });
  }

  // Quick book click handlers on featured teacher cards
  container.querySelectorAll(".btn-quick-book").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const tId = btn.dataset.teacherId;
      launchBookingWizard({ teacherId: tId });
    });
  });
}
