/**
 * Authentication Page Component (Login, Register with Student/Teacher roles, Reset Password)
 */

import { authService } from "../services/auth.service.js";
import { showToast } from "../components/toast.js";
import { isValidEmail, isValidPassword } from "../utils/validators.js";
import { icons } from "../utils/icons.js";

export async function renderAuthPage(container, params, queryParams) {
  let mode = queryParams.get("mode") || "login"; // "login", "register", "forgot"
  let role = queryParams.get("role") || "student"; // "student", "teacher"
  const redirectPath = queryParams.get("redirect") || "";

  function renderForm() {
    const pageHtml = `
      <div class="page-container" style="display: flex; align-items: center; justify-content: center; min-height: 80vh;">
        <div class="container" style="max-width: 480px;">
          
          <div class="card" style="padding: 2.5rem 2rem; box-shadow: var(--shadow-xl); border-radius: var(--radius-xl);">
            
            <!-- Brand & Icon -->
            <div class="text-center mb-6">
              <div class="brand-logo-badge mx-auto mb-3" style="width: 52px; height: 52px;">
                ${icons.code("w-7 h-7")}
              </div>
              <h2 style="font-size: var(--font-size-xl); font-weight: 800; margin-bottom: 0.25rem;">
                ${mode === "login" ? "ورود به حساب کاربری کدلرن" : mode === "register" ? "ثبت‌نام و عضویت در کدلرن" : "بازیابی کلمه عبور"}
              </h2>
              <p class="text-muted" style="font-size: 13px;">
                ${mode === "login" ? "برای دسترسی به کلاس‌ها و رزرو جلسات وارد شوید" : mode === "register" ? "در کمتر از یک دقیقه حساب کاربری خود را بسازید" : "ایمیل خود را جهت دریافت لینک بازیابی وارد کنید"}
              </p>
            </div>

            <!-- Login Form -->
            ${mode === "login" ? `
              <form id="auth-login-form">
                <div class="form-group">
                  <label class="form-label">ایمیل یا نام کاربری:</label>
                  <input type="email" id="login-email" class="form-input" placeholder="name@example.com" value="ali@example.com" required>
                </div>

                <div class="form-group">
                  <div class="flex items-center justify-between">
                    <label class="form-label">کلمه عبور:</label>
                    <a href="#/auth?mode=forgot" class="text-primary font-medium" style="font-size: 11px;">فراموشی رمز؟</a>
                  </div>
                  <input type="password" id="login-password" class="form-input" placeholder="••••••••" value="123456" required>
                </div>

                <button type="submit" class="btn btn-primary btn-full btn-lg mt-4" id="btn-submit-login">
                  ورود به حساب
                </button>

                <!-- Quick demo accounts helper -->
                <div class="card mt-4 p-3" style="background-color: var(--color-bg-subtle); border-style: dashed;">
                  <div class="text-muted font-semibold mb-2 text-center" style="font-size: 11px;">اکانت‌های آزمایشی سریع:</div>
                  <div class="flex gap-2">
                    <button type="button" class="btn btn-outline btn-sm btn-full btn-fill-demo" data-email="ali@example.com">
                      دانشجو (علی)
                    </button>
                    <button type="button" class="btn btn-outline btn-sm btn-full btn-fill-demo" data-email="nima@example.com">
                      مدرس (دکتر نیما)
                    </button>
                  </div>
                </div>

                <div class="text-center mt-6 text-sm text-muted">
                  حساب کاربری ندارید؟ 
                  <a href="#/auth?mode=register" class="text-primary font-bold">ثبت‌نام رایگان</a>
                </div>
              </form>
            ` : ""}

            <!-- Register Form -->
            ${mode === "register" ? `
              <form id="auth-register-form">
                
                <!-- Role Selector -->
                <div class="form-group">
                  <label class="form-label">نوع حساب کاربری:</label>
                  <div class="grid grid-cols-2 gap-2 mt-1">
                    <label class="card text-center" style="padding: 0.75rem; cursor: pointer; border: 2px solid ${role === "student" ? "var(--color-primary)" : "var(--color-border)"};">
                      <input type="radio" name="auth-role" value="student" ${role === "student" ? "checked" : ""} style="display:none;">
                      <div class="font-bold text-sm">دانشجو / زبان‌آموز</div>
                      <div class="text-muted" style="font-size: 10px;">می‌خواهم برنامه‌نویسی یاد بگیرم</div>
                    </label>
                    <label class="card text-center" style="padding: 0.75rem; cursor: pointer; border: 2px solid ${role === "teacher" ? "var(--color-primary)" : "var(--color-border)"};">
                      <input type="radio" name="auth-role" value="teacher" ${role === "teacher" ? "checked" : ""} style="display:none;">
                      <div class="font-bold text-sm">مدرس / منتور</div>
                      <div class="text-muted" style="font-size: 10px;">می‌خواهم کلاس برگزار کنم</div>
                    </label>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">نام و نام خانوادگی:</label>
                  <input type="text" id="reg-name" class="form-input" placeholder="مثال: رضا احمدی" required>
                </div>

                <div class="form-group">
                  <label class="form-label">ایمیل:</label>
                  <input type="email" id="reg-email" class="form-input" placeholder="name@example.com" required>
                </div>

                <div class="form-group">
                  <label class="form-label">شماره موبایل:</label>
                  <input type="tel" id="reg-phone" class="form-input" placeholder="۰۹۱۲۳۴۵۶۷۸۹" style="direction: ltr; text-align: right;">
                </div>

                ${role === "teacher" ? `
                  <div class="form-group">
                    <label class="form-label">عنوان تخصص و سابقه تدریس:</label>
                    <input type="text" id="reg-bio" class="form-input" placeholder="مثال: توسعه‌دهنده ارشد پایتون با ۵ سال سابقه" required>
                  </div>
                ` : ""}

                <div class="form-group">
                  <label class="form-label">کلمه عبور (حداقل ۶ کاراکتر):</label>
                  <input type="password" id="reg-password" class="form-input" placeholder="••••••••" required>
                </div>

                <button type="submit" class="btn btn-primary btn-full btn-lg mt-4" id="btn-submit-register">
                  ثبت‌نام و ورود
                </button>

                <div class="text-center mt-6 text-sm text-muted">
                  قبلاً ثبت‌نام کرده‌اید؟ 
                  <a href="#/auth?mode=login" class="text-primary font-bold">ورود به حساب</a>
                </div>
              </form>
            ` : ""}

            <!-- Forgot Password Form -->
            ${mode === "forgot" ? `
              <form id="auth-forgot-form">
                <div class="form-group">
                  <label class="form-label">ایمیل ثبت‌شده در حساب:</label>
                  <input type="email" id="forgot-email" class="form-input" placeholder="name@example.com" required>
                </div>

                <button type="submit" class="btn btn-primary btn-full btn-lg mt-4">
                  ارسال لینک بازیابی
                </button>

                <div class="text-center mt-6 text-sm">
                  <a href="#/auth?mode=login" class="text-primary font-bold">بازگشت به صفحه ورود</a>
                </div>
              </form>
            ` : ""}

          </div>

        </div>
      </div>
    `;

    container.innerHTML = pageHtml;
    attachFormEvents();
  }

  function attachFormEvents() {
    // Fill demo accounts
    container.querySelectorAll(".btn-fill-demo").forEach(btn => {
      btn.addEventListener("click", () => {
        const email = btn.dataset.email;
        const emailInput = container.querySelector("#login-email");
        if (emailInput) emailInput.value = email;
      });
    });

    // Role radio buttons in register
    container.querySelectorAll("input[name='auth-role']").forEach(radio => {
      radio.addEventListener("change", (e) => {
        role = e.target.value;
        renderForm();
      });
    });

    // Handle Login Submit
    const loginForm = container.querySelector("#auth-login-form");
    if (loginForm) {
      loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = container.querySelector("#login-email").value.trim();
        const password = container.querySelector("#login-password").value.trim();

        if (!isValidEmail(email)) {
          showToast("لطفاً یک ایمیل معتبر وارد کنید.", "warning");
          return;
        }

        const submitBtn = container.querySelector("#btn-submit-login");
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span class="spinner" style="width:16px;height:16px;"></span> در حال ورود...`;

        try {
          const res = await authService.login(email, password);
          showToast(`خوش‌آمدید ${res.user.name}`, "success");
          
          if (redirectPath) {
            window.location.hash = `#${decodeURIComponent(redirectPath)}`;
          } else {
            window.location.hash = res.user.role === "teacher" ? "#/dashboard/teacher" : "#/dashboard/student";
          }
        } catch (err) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = "ورود به حساب";
          showToast(err.message || "خطا در ورود به حساب", "danger");
        }
      });
    }

    // Handle Register Submit
    const regForm = container.querySelector("#auth-register-form");
    if (regForm) {
      regForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = container.querySelector("#reg-name").value.trim();
        const email = container.querySelector("#reg-email").value.trim();
        const phone = container.querySelector("#reg-phone")?.value.trim() || "";
        const bio = container.querySelector("#reg-bio")?.value.trim() || "";
        const password = container.querySelector("#reg-password").value.trim();

        if (!isValidEmail(email)) {
          showToast("لطفاً یک ایمیل معتبر وارد نمایید.", "warning");
          return;
        }
        if (!isValidPassword(password)) {
          showToast("کلمه عبور باید حداقل ۶ کاراکتر باشد.", "warning");
          return;
        }

        const submitBtn = container.querySelector("#btn-submit-register");
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span class="spinner" style="width:16px;height:16px;"></span> در حال ایجاد حساب...`;

        try {
          const res = await authService.register({
            name,
            email,
            phone,
            bio,
            role,
            password
          });
          showToast("حساب کاربری با موفقیت ساخته شد!", "success");
          window.location.hash = res.user.role === "teacher" ? "#/dashboard/teacher" : "#/dashboard/student";
        } catch (err) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = "ثبت‌نام و ورود";
          showToast(err.message || "خطا در ایجاد حساب کاربری", "danger");
        }
      });
    }

    // Handle Forgot Submit
    const forgotForm = container.querySelector("#auth-forgot-form");
    if (forgotForm) {
      forgotForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = container.querySelector("#forgot-email").value.trim();
        const res = await authService.forgotPassword(email);
        showToast(res.message, "success", 5000);
        setTimeout(() => {
          mode = "login";
          renderForm();
        }, 1500);
      });
    }
  }

  renderForm();
}
