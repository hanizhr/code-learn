/**
 * Contact & Support Page Component
 */

import { showToast } from "../components/toast.js";
import { icons } from "../utils/icons.js";

export function renderContactPage(container) {
  const pageHtml = `
    <div class="page-container">
      <div class="container" style="max-width: 860px;">
        
        <div class="section-title-wrap text-center mb-8">
          <span class="badge badge-primary mb-2">ارتباط با ما</span>
          <h2>تماس با پشتیبانی و امور اساتید کدلرن</h2>
          <p>تیم پشتیبانی ما در ۷ روز هفته آماده پاسخگویی و راهنمایی شماست</p>
        </div>

        <div class="grid grid-cols-3 gap-6">
          <div class="card p-6" style="grid-column: span 2;">
            <h3 class="font-bold text-base mb-4">ارسال پیام یا درخواست پشتیبانی</h3>
            <form id="contact-form">
              <div class="form-group">
                <label class="form-label">نام شما:</label>
                <input type="text" class="form-input" required placeholder="مثال: علی رضایی">
              </div>
              <div class="form-group">
                <label class="form-label">ایمیل یا شماره همراه:</label>
                <input type="text" class="form-input" required placeholder="name@example.com">
              </div>
              <div class="form-group">
                <label class="form-label">موضوع پیام:</label>
                <input type="text" class="form-input" required placeholder="پشتیبانی کلاس، درخواست تدریس یا سوال">
              </div>
              <div class="form-group">
                <label class="form-label">متن پیام:</label>
                <textarea class="form-textarea" rows="4" required placeholder="توضیحات خود را بنویسید..."></textarea>
              </div>
              <button type="submit" class="btn btn-primary mt-2">ارسال پیام</button>
            </form>
          </div>

          <div>
            <div class="card p-6 mb-4">
              <h4 class="font-bold text-sm mb-3">اطلاعات تماس</h4>
              <p class="text-secondary text-xs mb-3">ایمیل پشتیبانی: support@codelearn.ir</p>
              <p class="text-secondary text-xs mb-3">شماره تماس: ۰۲۱-۸۸۸۸۸۸۸۸</p>
              <p class="text-secondary text-xs">ساعات پاسخگویی: ۸:۰۰ الی ۲۳:۰۰</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  `;

  container.innerHTML = pageHtml;

  const form = container.querySelector("#contact-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      showToast("پیام شما دریافت شد و به زودی با شما تماس خواهیم گرفت.", "success");
      form.reset();
    });
  }
}
