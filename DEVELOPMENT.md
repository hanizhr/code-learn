# راهنمای توسعه و کدنویسی (Development Guide)

این راهنما استانداردها و نکات مهم برای توسعه و افزودن قابلیت‌های جدید به **پلتفرم کدلرن** را توضیح می‌دهد.

---

## ۱. استانداردهای کدنویسی (Code Conventions)

1. **فقط Vanilla JavaScript (ES6+):**
   * از سینتکس استاندارد ماژول‌های ES (`import` / `export`) استفاده کنید.
   * از استفاده از کتابخانه‌های خارجی برای مدیریت وضعیت یا رندرینگ پرهیز نمایید.

2. **قوانین عدم وابستگی مستقیم به DOM در لایه‌های زیرین:**
   * لایه‌های `Service` و `API` نباید هیچ‌گونه دستکاری مستقیم روی عناصر DOM داشته باشند.
   * خروجی توابع لایه `components/` باید ترجیحاً رشته تمپلیت HTML یا توابع رندرینگ ساختارمند باشد.

3. **امنیت در برابر XSS:**
   * تمامی ورودی‌های دریافتی از کاربر یا داده‌های ذخیره‌شده باید قبل از درج در تمپلیت HTML از طریق تابع `escapeHtml()` در `js/utils/dom.js` ایمن‌سازی شوند.

4. **فرمت‌بندی اعداد و تاریخ‌های فارسی:**
   * تمامی اعداد، قیمت‌ها و ساعت‌ها برای تجربه کاربری بومی باید با توابع `toPersianDigits()` و `formatCurrency()` در `js/utils/formatters.js` رندر شوند.

---

## ۲. نحوه افزودن یک صفحه جدید (Adding a New Page)

1. فایل جدید را در مسیر `js/pages/myNewPage.js` ایجاد کنید:
   ```javascript
   export async function renderMyNewPage(container, params, queryParams) {
     container.innerHTML = `
       <div class="page-container">
         <div class="container">
           <h2>عنوان صفحه</h2>
         </div>
       </div>
     `;
   }
   ```
2. مسیر مورد نظر را در جدول مسیریابی `js/app.js` رجیستر نمایید:
   ```javascript
   "/my-new-page": {
     title: "عنوان صفحه",
     handler: (root, params, query) => renderMyNewPage(root, params, query)
   }
   ```

---

## ۳. نحوه اتصال به بک‌اند واقعی (Connecting to Real Backend API)

1. سرور REST API خود را (Express, FastAPI, Django Rest Framework یا NestJS) راه‌اندازی کنید.
2. در فایل `js/core/config.js` آدرس پایه `API_BASE_URL` را تنظیم کنید.
3. در فایل `js/core/api.js` مقدار `this.isMock = false` قرار دهید تا تمام متدهای `get`، `post`، `put` و `delete` درخواست واقعی `fetch()` ارسال کنند.
