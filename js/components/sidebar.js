/**
 * Dashboard Sidebar Component
 */

import { AuthManager } from "../core/auth.js";
import { icons } from "../utils/icons.js";
import { escapeHtml } from "../utils/dom.js";

/**
 * Renders the dashboard sidebar
 * @param {Object} options
 * @param {'student'|'teacher'} options.role
 * @param {string} options.activeTab e.g. "overview", "classes", "calendar", "subjects", "finance", "profile"
 * @returns {string} HTML string
 */
export function renderSidebar({ role = "student", activeTab = "overview" } = {}) {
  const user = AuthManager.getCurrentUser() || { name: "کاربر", email: "", avatar: "" };

  const studentItems = [
    { key: "overview", label: "داشبورد و کلاس‌های پیش‌رو", icon: icons.layers("w-5 h-5") },
    { key: "history", label: "تاریخچه جلسات و کلاس‌ها", icon: icons.clock("w-5 h-5") },
    { key: "teachers", label: "رزرو کلاس و مدرسین", icon: icons.users("w-5 h-5"), href: "#/teachers" },
    { key: "payments", label: "تراکنش‌ها و رسیدها", icon: icons.creditCard("w-5 h-5") },
    { key: "profile", label: "تنظیمات حساب کاربری", icon: icons.settings("w-5 h-5") }
  ];

  const teacherItems = [
    { key: "overview", label: "نمای کلی و کلاس‌های امروز", icon: icons.layers("w-5 h-5") },
    { key: "calendar", label: "مدیریت زمان‌های آزاد تقویم", icon: icons.calendar("w-5 h-5") },
    { key: "classes", label: "لیست رزروها و جلسات", icon: icons.book("w-5 h-5") },
    { key: "subjects", label: "موضوعات و نرخ تدریس", icon: icons.code("w-5 h-5") },
    { key: "finance", label: "درآمد و تسویه حساب", icon: icons.creditCard("w-5 h-5") },
    { key: "profile", label: "پروفایل و تنظیمات میتینگ", icon: icons.settings("w-5 h-5") }
  ];

  const items = role === "teacher" ? teacherItems : studentItems;

  const linksHtml = items.map(item => {
    const isActive = activeTab === item.key;
    const linkHref = item.href || `#/dashboard/${role}?tab=${item.key}`;

    return `
      <a href="${linkHref}" class="sidebar-item ${isActive ? "active" : ""}" data-tab-key="${item.key}">
        ${item.icon}
        <span>${escapeHtml(item.label)}</span>
      </a>
    `;
  }).join("");

  return `
    <aside class="dashboard-sidebar">
      <div class="sidebar-user-card">
        <img 
          src="${escapeHtml(user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100')}" 
          alt="${escapeHtml(user.name)}" 
          class="sidebar-avatar"
        />
        <div class="sidebar-user-info">
          <h4>${escapeHtml(user.name)}</h4>
          <p>${role === "teacher" ? "مدرس رسمی پلتفرم" : "دانشجو"}</p>
        </div>
      </div>

      <nav class="sidebar-nav">
        ${linksHtml}
      </nav>

      <div class="sidebar-footer">
        <button class="btn btn-outline btn-sm btn-full flex items-center justify-center gap-2 btn-sidebar-logout">
          ${icons.logout("w-4 h-4 text-danger")}
          <span>خروج از حساب</span>
        </button>
      </div>
    </aside>
  `;
}
