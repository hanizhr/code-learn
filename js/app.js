/**
 * CodeLearn (کدلرن) - Master Application Bootstrap
 * Pure Vanilla JavaScript Architecture
 */

import { Router } from "./core/router.js";
import { appState } from "./core/state.js";
import { AuthManager } from "./core/auth.js";
import { storage } from "./core/storage.js";
import { notificationService } from "./services/notification.service.js";

import { renderNavbar } from "./components/navbar.js";
import { renderFooter } from "./components/footer.js";

// Pages
import { renderHomePage } from "./pages/homePage.js";
import { renderCoursesPage } from "./pages/coursesPage.js";
import { renderCourseDetailPage } from "./pages/courseDetailPage.js";
import { renderTeachersPage } from "./pages/teachersPage.js";
import { renderTeacherProfilePage } from "./pages/teacherProfilePage.js";
import { renderAuthPage } from "./pages/authPage.js";
import { renderStudentDashboardPage } from "./pages/studentDashboardPage.js";
import { renderTeacherDashboardPage } from "./pages/teacherDashboardPage.js";
import { renderLiveClassPage } from "./pages/liveClassPage.js";
import { renderAboutPage } from "./pages/aboutPage.js";
import { renderContactPage } from "./pages/contactPage.js";
import { renderFAQPage } from "./pages/faqPage.js";
import { renderNotFoundPage } from "./pages/notFoundPage.js";

class App {
  constructor() {
    this.router = null;
    this.navContainer = document.getElementById("app-navbar-root");
    this.mainContainer = document.getElementById("main-app-container");
    this.footerContainer = document.getElementById("app-footer-root");
  }

  async init() {
    // 1. Initial seed check for demo
    await this._seedInitialData();

    // 2. Set default demo user if not logged in (Ali Rezaei - Student)
    if (!AuthManager.isAuthenticated()) {
      await AuthManager.switchDemoRole("student");
    }

    // 3. Setup notifications in global state
    await notificationService.getNotifications();

    // 4. Render Layout Shell (Navbar & Footer)
    this._renderLayout();

    // 5. Setup Route Table
    this._setupRoutes();

    // 6. Listen to global state events
    this._attachGlobalListeners();

    // 7. Initialize Router
    this.router.init();
  }

  async _seedInitialData() {
    try {
      if (!storage.get("teachers", null)) {
        const res = await fetch("/mock/teachers.json");
        storage.set("teachers", await res.json());
      }
      if (!storage.get("courses", null)) {
        const res = await fetch("/mock/courses.json");
        storage.set("courses", await res.json());
      }
      if (!storage.get("users", null)) {
        const res = await fetch("/mock/users.json");
        storage.set("users", await res.json());
      }
      if (!storage.get("availability", null)) {
        const res = await fetch("/mock/availability.json");
        storage.set("availability", await res.json());
      }
      if (!storage.get("bookings", null)) {
        const res = await fetch("/mock/bookings.json");
        storage.set("bookings", await res.json());
      }
    } catch (e) {
      console.warn("Mock data auto-seed note:", e);
    }
  }

  _renderLayout() {
    if (this.navContainer) {
      renderNavbar(this.navContainer);
    }
    if (this.footerContainer) {
      renderFooter(this.footerContainer);
    }
  }

  _setupRoutes() {
    const routes = {
      "/": {
        title: "پلتفرم آموزش آنلاین و رزرو کلاس برنامه‌نویسی",
        handler: (root, params, query) => renderHomePage(root, params, query)
      },
      "/courses": {
        title: "دوره‌ها و موضوعات آموزشی",
        handler: (root, params, query) => renderCoursesPage(root, params, query)
      },
      "/courses/:id": {
        title: "سرفصل و اطلاعات دوره",
        handler: (root, params, query) => renderCourseDetailPage(root, params, query)
      },
      "/teachers": {
        title: "لیست و انتخاب مدرس",
        handler: (root, params, query) => renderTeachersPage(root, params, query)
      },
      "/teachers/:id": {
        title: "پروفایل مدرس و تقویم رزرو",
        handler: (root, params, query) => renderTeacherProfilePage(root, params, query)
      },
      "/auth": {
        title: "ورود و ثبت‌نام",
        handler: (root, params, query) => renderAuthPage(root, params, query)
      },
      "/dashboard/student": {
        title: "پنل کاربری دانشجو",
        requiresAuth: true,
        handler: (root, params, query) => renderStudentDashboardPage(root, params, query)
      },
      "/dashboard/teacher": {
        title: "پنل اختصاصی مدرس",
        requiresAuth: true,
        role: "teacher",
        handler: (root, params, query) => renderTeacherDashboardPage(root, params, query)
      },
      "/classes/:bookingId": {
        title: "اتاق کلاس مجازی",
        requiresAuth: true,
        handler: (root, params, query) => renderLiveClassPage(root, params, query)
      },
      "/about": {
        title: "درباره ما",
        handler: (root) => renderAboutPage(root)
      },
      "/contact": {
        title: "تماس با ما",
        handler: (root) => renderContactPage(root)
      },
      "/faq": {
        title: "سوالات متداول",
        handler: (root) => renderFAQPage(root)
      },
      "/404": {
        title: "صفحه پیدا نشد",
        handler: (root) => renderNotFoundPage(root)
      }
    };

    this.router = new Router(routes, "main-app-container");
  }

  _attachGlobalListeners() {
    appState.on("auth:login", () => {
      this._renderLayout();
    });

    appState.on("auth:logout", () => {
      this._renderLayout();
    });

    appState.on("route:changed", () => {
      this._renderLayout();
    });
  }
}

// Auto bootstrap on DOM load
document.addEventListener("DOMContentLoaded", () => {
  const app = new App();
  app.init();
});
