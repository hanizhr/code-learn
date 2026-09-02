/**
 * Master Header & Navbar Component
 */

import { AuthManager } from "../core/auth.js";
import { appState } from "../core/state.js";
import { notificationService } from "../services/notification.service.js";
import { renderNotificationCenter } from "./notificationCenter.js";
import { icons } from "../utils/icons.js";
import { toPersianDigits } from "../utils/formatters.js";
import { escapeHtml } from "../utils/dom.js";

export function renderNavbar(containerElement) {
  const user = AuthManager.getCurrentUser();
  const state = appState.getState();
  const currentHash = window.location.hash || "#/";

  const isHome = currentHash === "#/" || currentHash === "";
  const isCourses = currentHash.startsWith("#/courses");
  const isTeachers = currentHash.startsWith("#/teachers");
  const isAbout = currentHash.startsWith("#/about");
  const isFAQ = currentHash.startsWith("#/faq");
  const isContact = currentHash.startsWith("#/contact");
  const isDashboard = currentHash.startsWith("#/dashboard");

  let unreadBadge = state.unreadCount > 0 
    ? `<span style="position: absolute; top: -2px; left: -2px; width: 18px; height: 18px; background-color: var(--color-danger); color: #fff; border-radius: 9999px; font-size: 10px; font-weight: bold; display: flex; align-items: center; justify-content: center;">${toPersianDigits(state.unreadCount)}</span>`
    : "";

  const navHtml = `
    <header class="site-header" id="main-site-header">
      <div class="container">
        <div class="nav-inner">
          
          <!-- Logo & Brand -->
          <div class="flex items-center gap-4">
            <a href="#/" class="nav-brand">
              <div class="brand-logo-badge">
                ${icons.code("w-6 h-6")}
              </div>
              <span>کدلرن</span>
            </a>

            <!-- Demo Quick Switcher Badge -->
            <div class="demo-role-badge" title="برای تست سریع جریان‌های مختلف کاربر کلیک کنید">
              <span class="text-muted" style="font-size: 11px;">نقش جاری:</span>
              <select id="quick-role-switcher" style="border:none; background:transparent; font-size:11px; font-weight:bold; color:var(--color-primary); cursor:pointer;">
                <option value="student" ${user && user.role === "student" ? "selected" : ""}>دانشجو (علی رضایی)</option>
                <option value="teacher" ${user && user.role === "teacher" ? "selected" : ""}>مدرس (دکتر نیما کمالی)</option>
                <option value="guest" ${!user ? "selected" : ""}>مهمان (Guest)</option>
              </select>
            </div>
          </div>

          <!-- Desktop Navigation Links -->
          <nav class="nav-links">
            <a href="#/" class="nav-link ${isHome ? "active" : ""}">صفحه اصلی</a>
            <a href="#/courses" class="nav-link ${isCourses ? "active" : ""}">آموزش‌ها</a>
            <a href="#/teachers" class="nav-link ${isTeachers ? "active" : ""}">لیست مدرس‌ها</a>
            <a href="#/about" class="nav-link ${isAbout ? "active" : ""}">درباره ما</a>
            <a href="#/faq" class="nav-link ${isFAQ ? "active" : ""}">سوالات متداول</a>
            <a href="#/contact" class="nav-link ${isContact ? "active" : ""}">تماس با ما</a>
          </nav>

          <!-- Actions / Auth Area -->
          <div class="nav-actions">
            
            <!-- Notification Bell Icon -->
            <div style="position: relative;" id="notif-dropdown-wrapper">
              <button class="btn btn-ghost btn-sm" id="btn-toggle-notifs" aria-label="اعلان‌ها" style="position: relative; padding: 8px;">
                ${icons.bell("w-5 h-5")}
                ${unreadBadge}
              </button>
              <div id="notif-dropdown-content" class="card" style="display: none; position: absolute; left: 0; top: 120%; z-index: 60; box-shadow: var(--shadow-xl); padding: 0; border-radius: var(--radius-lg); overflow: hidden;">
                <!-- Dynamically loaded via notificationCenter -->
              </div>
            </div>

            ${user ? `
              <!-- User Profile Dropdown -->
              <div class="flex items-center gap-3">
                <a href="#/dashboard/${user.role}" class="btn btn-primary btn-sm flex items-center gap-2">
                  ${user.role === "teacher" ? icons.users("w-4 h-4") : icons.book("w-4 h-4")}
                  <span>${user.role === "teacher" ? "پنل مدرس" : "پنل دانشجو"}</span>
                </a>

                <button class="btn btn-outline btn-sm btn-logout-action" title="خروج از حساب">
                  ${icons.logout("w-4 h-4 text-danger")}
                </button>
              </div>
            ` : `
              <!-- Guest Links -->
              <div class="flex items-center gap-2">
                <a href="#/auth?mode=login" class="btn btn-outline btn-sm">ورود</a>
                <a href="#/auth?mode=register" class="btn btn-primary btn-sm">ثبت‌نام</a>
              </div>
            `}

            <!-- Mobile Hamburger Button -->
            <button class="mobile-nav-toggle" id="btn-toggle-mobile-menu" aria-label="منوی موبایل">
              ${icons.menu("w-5 h-5")}
            </button>
          </div>

        </div>
      </div>

      <!-- Mobile Navigation Drawer -->
      <div class="mobile-nav-drawer" id="mobile-nav-drawer">
        <a href="#/" class="nav-link">صفحه اصلی</a>
        <a href="#/courses" class="nav-link">آموزش‌ها</a>
        <a href="#/teachers" class="nav-link">لیست مدرس‌ها</a>
        <a href="#/about" class="nav-link">درباره ما</a>
        <a href="#/faq" class="nav-link">سوالات متداول</a>
        <a href="#/contact" class="nav-link">تماس با ما</a>
        ${user ? `
          <a href="#/dashboard/${user.role}" class="btn btn-primary btn-full mt-4">
            ورود به ${user.role === "teacher" ? "پنل مدرس" : "پنل دانشجو"}
          </a>
        ` : `
          <div class="flex flex-col gap-2 mt-4">
            <a href="#/auth?mode=login" class="btn btn-outline btn-full">ورود به حساب</a>
            <a href="#/auth?mode=register" class="btn btn-primary btn-full">ثبت‌نام در کدلرن</a>
          </div>
        `}
      </div>
    </header>
  `;

  containerElement.innerHTML = navHtml;
  attachNavbarEvents(containerElement);
}

function attachNavbarEvents(container) {
  // Mobile menu toggle
  const mobileToggle = container.querySelector("#btn-toggle-mobile-menu");
  const mobileDrawer = container.querySelector("#mobile-nav-drawer");
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener("click", () => {
      mobileDrawer.classList.toggle("open");
    });
    // Close drawer when link clicked
    mobileDrawer.querySelectorAll(".nav-link, .btn").forEach(link => {
      link.addEventListener("click", () => mobileDrawer.classList.remove("open"));
    });
  }

  // Quick Demo Role Switcher
  const roleSwitcher = container.querySelector("#quick-role-switcher");
  if (roleSwitcher) {
    roleSwitcher.addEventListener("change", async (e) => {
      const selected = e.target.value;
      if (selected === "guest") {
        AuthManager.logout();
        window.location.hash = "#/";
      } else {
        await AuthManager.switchDemoRole(selected);
        window.location.hash = selected === "teacher" ? "#/dashboard/teacher" : "#/dashboard/student";
      }
      renderNavbar(container);
    });
  }

  // Logout button
  const logoutBtn = container.querySelector(".btn-logout-action");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      AuthManager.logout();
      window.location.hash = "#/";
      renderNavbar(container);
    });
  }

  // Notification dropdown toggle
  const notifBtn = container.querySelector("#btn-toggle-notifs");
  const notifContent = container.querySelector("#notif-dropdown-content");
  if (notifBtn && notifContent) {
    notifBtn.addEventListener("click", async (e) => {
      e.stopPropagation();
      const isVisible = notifContent.style.display === "block";
      if (!isVisible) {
        const notifs = await notificationService.getNotifications();
        notifContent.innerHTML = renderNotificationCenter(notifs);
        notifContent.style.display = "block";

        const markAllBtn = notifContent.querySelector("#btn-mark-all-read");
        if (markAllBtn) {
          markAllBtn.addEventListener("click", async () => {
            await notificationService.markAllAsRead();
            renderNavbar(container);
          });
        }
      } else {
        notifContent.style.display = "none";
      }
    });

    document.addEventListener("click", (e) => {
      if (!notifContent.contains(e.target) && e.target !== notifBtn) {
        notifContent.style.display = "none";
      }
    });
  }
}
