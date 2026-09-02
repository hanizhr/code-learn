/**
 * About Page Component
 */

import { icons } from "../utils/icons.js";

export function renderAboutPage(container) {
  const pageHtml = `
    <div class="page-container">
      <div class="container" style="max-width: 860px;">
        
        <div class="section-title-wrap text-center mb-8">
          <span class="badge badge-primary mb-2">درباره پلتفرم</span>
          <h2>کدلرن؛ تحولی در آموزش برنامه‌نویسی</h2>
          <p>پل ارتباطی میان علاقه‌مندان به برنامه‌نویسی و اساتید تراز اول صنعت نرم‌افزار</p>
        </div>

        <div class="card p-6 mb-6 leading-relaxed">
          <h3 class="font-bold text-lg mb-3">داستان شکل‌گیری کدلرن</h3>
          <p class="text-secondary mb-4" style="line-height: 1.8;">
            بسیاری از دانشجویان و علاقه‌مندان به برنامه‌نویسی پس از گذراندن صدها ساعت ویدیوهای آموزشی ضبط‌شده، هنگام ورود به پروژه‌های واقعی با چالش‌های فنی، عدم درک معماری و بن‌بست‌های باگ‌گیری روبرو می‌شوند. 
            کدلرن با هدف پر کردن این خلاء طراحی شده است تا امکان دسترسی تک‌به‌تک و مستقیم به اساتید و توسعه‌دهندگان ارشد را در قالب کلاس‌های آنلاین، منتورینگ و رفع اشکال کد فراهم آورد.
          </p>

          <h3 class="font-bold text-lg mb-3">ارزش‌های بنیادین ما</h3>
          <div class="grid grid-cols-2 gap-4 mt-3">
            <div class="card p-4 bg-subtle">
              <div class="font-bold text-primary mb-1 flex items-center gap-2">
                ${icons.shield("w-5 h-5")} کیفیت و ارزیابی اساتید
              </div>
              <div class="text-muted text-xs">تمام مدرسان قبل از فعال‌سازی، ارزیابی فنی و مهارتی می‌شوند.</div>
            </div>
            <div class="card p-4 bg-subtle">
              <div class="font-bold text-success mb-1 flex items-center gap-2">
                ${icons.zap("w-5 h-5")} تعامل زنده و اشتراک کد
              </div>
              <div class="text-muted text-xs">کلاس‌ها در محیط‌های تعاملی و بر اساس پروژه‌های زنده برگزار می‌گردد.</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  `;

  container.innerHTML = pageHtml;
}
