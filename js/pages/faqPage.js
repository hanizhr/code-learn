/**
 * FAQ Page Component
 */

import { icons } from "../utils/icons.js";

export function renderFAQPage(container) {
  const faqs = [
    {
      q: "کلاس‌های آنلاین چگونه و در چه بستری برگزار می‌شوند؟",
      a: "کلاس‌ها به انتخاب مدرس و دانشجو در بسترهای استاندارد Google Meet یا Skyroom (بدون نیاز به نصب نرم‌افزار جانبی و مستقیماً داخل مرورگر) به همراه تصویر، صدا و امکان اشتراک‌گذاری کد برگزار می‌شوند."
    },
    {
      q: "آیا قبل از رزرو امکان تغییر سطح یا گفتگو با مدرس وجود دارد؟",
      a: "بله، در فرآیند رزرو می‌توانید موضوع، سطح مدنظر (مقدماتی تا پیشرفته) و یادداشت‌های اختصاصی خود را ثبت کنید تا استاد سرفصل را متناسب با نیاز شما آماده نماید."
    },
    {
      q: "در صورت عدم امکان حضور، آیا امکان لغو یا جابجایی کلاس هست؟",
      a: "بله، تا ۱۲ ساعت قبل از شروع جلسه امکان لغو بدون جریمه وجود دارد و مبلغ کلاس به صورت کامل به کیف پول شما برگشت داده می‌شود."
    },
    {
      q: "چگونه می‌توانم به عنوان مدرس در کدلرن شروع به کار کنم؟",
      a: "کافی است از بخش ثبت‌نام گزینه «مدرس / منتور» را انتخاب کرده و رزومه اولیه خود را ثبت کنید. کارشناسان ما پس از بررسی سوابق، اکانت تدریس شما را تایید می‌کنند."
    }
  ];

  const faqsHtml = faqs.map((f, i) => `
    <div class="card p-4 mb-3 faq-item" style="cursor: pointer;">
      <div class="flex items-center justify-between font-bold text-base mb-2">
        <span>${f.q}</span>
        <span class="text-primary faq-icon">${icons.plus("w-4 h-4")}</span>
      </div>
      <p class="text-secondary text-sm leading-relaxed faq-answer" style="display: none; border-top: 1px solid var(--color-border); padding-top: 0.75rem; margin-top: 0.5rem;">
        ${f.a}
      </p>
    </div>
  `).join("");

  const pageHtml = `
    <div class="page-container">
      <div class="container" style="max-width: 800px;">
        
        <div class="section-title-wrap text-center mb-8">
          <span class="badge badge-primary mb-2">راهنما و پاسخ‌ها</span>
          <h2>سوالات متداول دانشجویان و مدرسان</h2>
          <p>پاسخ به رایج‌ترین پرسش‌ها پیرامون نحوه رزرو، کلاس‌ها و پرداخت</p>
        </div>

        <div>
          ${faqsHtml}
        </div>

      </div>
    </div>
  `;

  container.innerHTML = pageHtml;

  container.querySelectorAll(".faq-item").forEach(item => {
    item.addEventListener("click", () => {
      const ans = item.querySelector(".faq-answer");
      const isHidden = ans.style.display === "none";
      ans.style.display = isHidden ? "block" : "none";
    });
  });
}
