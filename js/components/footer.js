/**
 * Master Site Footer Component
 */

import { icons } from "../utils/icons.js";

export function renderFooter(containerElement) {
  const footerHtml = `
    <footer class="site-footer" id="main-site-footer">
      <div class="container">
        <div class="footer-grid">
          
          <!-- Column 1: Brand & Bio -->
          <div>
            <div class="footer-brand">
              <div class="brand-logo-badge" style="background-color: var(--color-primary-light);">
                ${icons.code("w-6 h-6 text-primary")}
              </div>
              <span>کدلرن (CodeLearn)</span>
            </div>
            <p class="footer-desc">
              پلتفرم تخصصی آموزش آنلاین و جلسات منتورینگ برنامه‌نویسی با مجرب‌ترین اساتید و توسعه‌دهندگان ارشد صنعت نرم‌افزار ایران.
            </p>
            <div class="flex items-center gap-3 mt-4 text-muted">
              <span class="badge badge-neutral flex items-center gap-1">
                ${icons.shield("w-3 h-3 text-success")} تضمین کیفیت آموزش
              </span>
              <span class="badge badge-neutral flex items-center gap-1">
                ${icons.zap("w-3 h-3 text-primary")} کلاس‌های تعاملی
              </span>
            </div>
          </div>

          <!-- Column 2: Fast Links -->
          <div>
            <h4 class="footer-col-title">دسترسی سریع</h4>
            <ul class="footer-links">
              <li><a href="#/courses" class="footer-link">دوره‌ها و موضوعات برنامه‌نویسی</a></li>
              <li><a href="#/teachers" class="footer-link">جستجو و انتخاب مدرس</a></li>
              <li><a href="#/about" class="footer-link">درباره پلتفرم کدلرن</a></li>
              <li><a href="#/faq" class="footer-link">سوالات متداول دانشجویان</a></li>
              <li><a href="#/contact" class="footer-link">تماس با پشتیبانی</a></li>
            </ul>
          </div>

          <!-- Column 3: Topics -->
          <div>
            <h4 class="footer-col-title">حوزه‌های تخصصی</h4>
            <ul class="footer-links">
              <li><a href="#/courses/course-python" class="footer-link">پایتون و علم داده (Python)</a></li>
              <li><a href="#/courses/course-web" class="footer-link">توسعه فرانت‌اند و ری‌اکت</a></li>
              <li><a href="#/courses/course-django" class="footer-link">جنگو و توسعه بک‌اند</a></li>
              <li><a href="#/courses/course-ai" class="footer-link">هوش مصنوعی و یادگیری ماشین</a></li>
              <li><a href="#/courses/course-database" class="footer-link">طراحی و بهینه‌سازی دیتابیس</a></li>
            </ul>
          </div>

          <!-- Column 4: Newsletter & Trust -->
          <div>
            <h4 class="footer-col-title">عضویت در خبرنامه آموزشی</h4>
            <p class="text-muted" style="font-size: var(--font-size-xs); margin-bottom: 0.75rem;">
              آخرین وبینارها، تخفیف‌های ویژه جلسات منتورینگ و مقالات فنی را دریافت کنید:
            </p>
            <form id="footer-newsletter-form" class="flex gap-2">
              <input type="email" placeholder="ایمیل شما..." class="form-input" required style="font-size: 13px; height: 38px;">
              <button type="submit" class="btn btn-primary btn-sm" style="white-space: nowrap;">عضویت</button>
            </form>
          </div>

        </div>

        <div class="footer-bottom">
          <div>
            تمامی حقوق مادی و معنوی این وبسایت متعلق به پلتفرم <strong>کدلرن</strong> است. طراحی شده با اصول استاندارد و مهندسی نرم‌افزار.
          </div>
          <div class="flex items-center gap-4 text-muted">
            <a href="#/about" class="footer-link">قوانین و مقررات</a>
            <span>•</span>
            <a href="#/contact" class="footer-link">حریم خصوصی</a>
          </div>
        </div>
      </div>
    </footer>
  `;

  containerElement.innerHTML = footerHtml;

  const newsletterForm = containerElement.querySelector("#footer-newsletter-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      import("./toast.js").then(({ showToast }) => {
        showToast("ایمیل شما با موفقیت در خبرنامه ثبت شد.", "success");
        newsletterForm.reset();
      });
    });
  }
}
