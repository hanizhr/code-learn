/**
 * Centralized API Client Layer
 * Handles all HTTP/REST abstractions and simulated Mock API interactions.
 * In a production backend setup, only this file is updated with real fetch() calls.
 */

import { CONFIG } from "./config.js";
import { storage } from "./storage.js";

class ApiClient {
  constructor(baseUrl = CONFIG.API_BASE_URL) {
    this.baseUrl = baseUrl;
    this.isMock = true; // Switch to false when real backend REST API is plugged in
  }

  /**
   * Helper to delay mock responses
   */
  async _delay(ms = CONFIG.MOCK_DELAY_MS) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Builds headers including Authorization token if available
   */
  _getHeaders() {
    const token = storage.get("auth_token", null);
    const headers = {
      "Content-Type": "application/json",
      "Accept": "application/json"
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  }

  /**
   * Central GET request handler
   */
  async get(endpoint, params = {}) {
    if (!this.isMock) {
      const url = new URL(this.baseUrl + endpoint, window.location.origin);
      Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
      const response = await fetch(url.toString(), {
        method: "GET",
        headers: this._getHeaders()
      });
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      return await response.json();
    }

    await this._delay();
    return this._handleMockGet(endpoint, params);
  }

  /**
   * Central POST request handler
   */
  async post(endpoint, data = {}) {
    if (!this.isMock) {
      const response = await fetch(this.baseUrl + endpoint, {
        method: "POST",
        headers: this._getHeaders(),
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      return await response.json();
    }

    await this._delay();
    return this._handleMockPost(endpoint, data);
  }

  /**
   * Central PUT request handler
   */
  async put(endpoint, data = {}) {
    if (!this.isMock) {
      const response = await fetch(this.baseUrl + endpoint, {
        method: "PUT",
        headers: this._getHeaders(),
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      return await response.json();
    }

    await this._delay();
    return this._handleMockPut(endpoint, data);
  }

  /**
   * Central DELETE request handler
   */
  async delete(endpoint) {
    if (!this.isMock) {
      const response = await fetch(this.baseUrl + endpoint, {
        method: "DELETE",
        headers: this._getHeaders()
      });
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      return await response.json();
    }

    await this._delay();
    return this._handleMockDelete(endpoint);
  }

  /* --------------------------------------------------------------------------
     Mock Router & Database Dispatcher
     -------------------------------------------------------------------------- */

  async _handleMockGet(endpoint, params) {
    // Teachers
    if (endpoint === "/teachers") {
      let teachers = storage.get("teachers", []);
      if (!teachers.length) {
        const res = await fetch("/mock/teachers.json");
        teachers = await res.json();
        storage.set("teachers", teachers);
      }

      // Filter by subject
      if (params.subject) {
        teachers = teachers.filter(t => 
          t.specialties.some(s => s.toLowerCase().includes(params.subject.toLowerCase())) ||
          (t.teachingSubjects && t.teachingSubjects.some(sub => sub.subjectId === params.subject || sub.subjectTitle.includes(params.subject)))
        );
      }

      // Filter by level
      if (params.level) {
        teachers = teachers.filter(t => 
          t.teachingSubjects && t.teachingSubjects.some(sub => sub.levels.includes(params.level))
        );
      }

      // Filter by search query
      if (params.q) {
        const query = params.q.toLowerCase().trim();
        teachers = teachers.filter(t => 
          t.name.toLowerCase().includes(query) ||
          t.title.toLowerCase().includes(query) ||
          t.specialties.some(s => s.toLowerCase().includes(query))
        );
      }

      return { data: teachers, total: teachers.length };
    }

    if (endpoint.startsWith("/teachers/")) {
      const parts = endpoint.split("/");
      const teacherId = parts[2];
      const subResource = parts[3]; // e.g. /teachers/:id/availability

      let teachers = storage.get("teachers", []);
      if (!teachers.length) {
        const res = await fetch("/mock/teachers.json");
        teachers = await res.json();
        storage.set("teachers", teachers);
      }

      const teacher = teachers.find(t => t.id === teacherId);
      if (!teacher) throw new Error("مدرس مورد نظر یافت نشد");

      if (subResource === "availability") {
        let availMap = storage.get("availability", null);
        if (!availMap) {
          const res = await fetch("/mock/availability.json");
          availMap = await res.json();
          storage.set("availability", availMap);
        }
        return { data: availMap[teacherId] || { weeklySchedule: {}, blockedDates: [] } };
      }

      return { data: teacher };
    }

    // Courses
    if (endpoint === "/courses") {
      let courses = storage.get("courses", []);
      if (!courses.length) {
        const res = await fetch("/mock/courses.json");
        courses = await res.json();
        storage.set("courses", courses);
      }
      return { data: courses, total: courses.length };
    }

    if (endpoint.startsWith("/courses/")) {
      const courseId = endpoint.split("/")[2];
      let courses = storage.get("courses", []);
      if (!courses.length) {
        const res = await fetch("/mock/courses.json");
        courses = await res.json();
        storage.set("courses", courses);
      }
      const course = courses.find(c => c.id === courseId || c.slug === courseId);
      if (!course) throw new Error("دوره یا موضوع مورد نظر یافت نشد");
      return { data: course };
    }

    // Bookings
    if (endpoint === "/bookings") {
      let bookings = storage.get("bookings", []);
      if (!bookings.length) {
        const res = await fetch("/mock/bookings.json");
        bookings = await res.json();
        storage.set("bookings", bookings);
      }

      if (params.studentId) {
        bookings = bookings.filter(b => b.studentId === params.studentId);
      }
      if (params.teacherId) {
        bookings = bookings.filter(b => b.teacherId === params.teacherId);
      }
      if (params.status) {
        bookings = bookings.filter(b => b.status === params.status);
      }

      return { data: bookings, total: bookings.length };
    }

    if (endpoint.startsWith("/bookings/")) {
      const bookingId = endpoint.split("/")[2];
      let bookings = storage.get("bookings", []);
      const booking = bookings.find(b => b.id === bookingId);
      if (!booking) throw new Error("رزرو مورد نظر پیدا نشد");
      return { data: booking };
    }

    // Notifications
    if (endpoint === "/notifications") {
      const notifs = storage.get("notifications", [
        {
          id: "notif-1",
          type: "booking_confirmed",
          title: "کلاس با موفقیت رزرو شد",
          message: "کلاس پایتون متوسط شما با دکتر نیما کمالی برای پنجشنبه ساعت ۱۰:۰۰ تایید شد.",
          createdAt: "۱۰ دقیقه پیش",
          isRead: false
        },
        {
          id: "notif-2",
          type: "system",
          title: "خوش‌آمدید به کدلرن",
          message: "پروفایل کاربری شما با موفقیت تکمیل شد. از بخش انتخاب مدرس کلاس خود را شروع کنید.",
          createdAt: "۱ روز پیش",
          isRead: true
        }
      ]);
      return { data: notifs };
    }

    // Users
    if (endpoint === "/users/me") {
      const currentUser = storage.get("current_user", null);
      if (!currentUser) throw new Error("کاربر لاگین نکرده است");
      return { data: currentUser };
    }

    throw new Error(`Endpoint "${endpoint}" not found in Mock API`);
  }

  async _handleMockPost(endpoint, data) {
    if (endpoint === "/auth/login") {
      let users = storage.get("users", []);
      if (!users.length) {
        const res = await fetch("/mock/users.json");
        users = await res.json();
        storage.set("users", users);
      }

      const found = users.find(u => u.email === data.email);
      if (!found) {
        throw new Error("ایمیل یا کلمه عبور وارد شده نادرست است");
      }

      const mockToken = "mock_jwt_token_" + Date.now();
      storage.set("auth_token", mockToken);
      storage.set("current_user", found);
      return { success: true, user: found, token: mockToken };
    }

    if (endpoint === "/auth/register") {
      let users = storage.get("users", []);
      if (!users.length) {
        const res = await fetch("/mock/users.json");
        users = await res.json();
      }

      const existing = users.find(u => u.email === data.email);
      if (existing) {
        throw new Error("این ایمیل قبلاً در سیستم ثبت‌نام کرده است");
      }

      const newUser = {
        id: "user-" + (data.role || "student") + "-" + Date.now(),
        name: data.name,
        email: data.email,
        phone: data.phone || "",
        role: data.role || "student",
        avatar: data.role === "teacher" 
          ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
          : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
        bio: data.bio || "",
        registeredAt: "1403/06/15",
        walletBalance: 0
      };

      if (data.role === "teacher") {
        newUser.teacherId = "teacher-" + Date.now();
        // create teacher record
        let teachers = storage.get("teachers", []);
        if (!teachers.length) {
          const res = await fetch("/mock/teachers.json");
          teachers = await res.json();
        }
        teachers.push({
          id: newUser.teacherId,
          userId: newUser.id,
          name: newUser.name,
          avatar: newUser.avatar,
          title: "مدرس برنامه‌نویسی",
          specialties: ["Python", "Web Development"],
          rating: 5.0,
          reviewCount: 0,
          completedClasses: 0,
          hourlyRate: 400000,
          bio: newUser.bio || "مدرس جدید پلتفرم کدلرن",
          education: "کارشناسی کامپیوتر",
          experienceYears: 2,
          preferredProvider: "google_meet",
          teachingSubjects: [
            { subjectId: "course-python", subjectTitle: "پایتون (Python)", levels: ["beginner", "intermediate"] }
          ],
          reviews: []
        });
        storage.set("teachers", teachers);
      }

      users.push(newUser);
      storage.set("users", users);

      const mockToken = "mock_jwt_token_" + Date.now();
      storage.set("auth_token", mockToken);
      storage.set("current_user", newUser);

      return { success: true, user: newUser, token: mockToken };
    }

    if (endpoint === "/bookings") {
      let bookings = storage.get("bookings", []);
      if (!bookings.length) {
        const res = await fetch("/mock/bookings.json");
        bookings = await res.json();
      }

      // Check double booking guard
      const isAlreadyBooked = bookings.some(b => 
        b.teacherId === data.teacherId &&
        b.date === data.date &&
        b.timeSlot === data.timeSlot &&
        b.status === "confirmed"
      );

      if (isAlreadyBooked) {
        throw new Error("این تایم اسلات قبلاً توسط دانشجو دیگری رزرو شده است. لطفاً زمان دیگری انتخاب کنید.");
      }

      const newBooking = {
        id: "book-" + Date.now(),
        studentId: data.studentId,
        studentName: data.studentName || "دانشجو",
        teacherId: data.teacherId,
        teacherName: data.teacherName,
        teacherAvatar: data.teacherAvatar,
        courseId: data.courseId,
        courseTitle: data.courseTitle,
        level: data.level,
        levelTitle: data.levelTitle || "متوسط",
        date: data.date,
        dayOfWeek: data.dayOfWeek || "شنبه",
        timeSlot: data.timeSlot,
        status: "confirmed",
        price: data.price,
        paidAt: "هم اکنون",
        meetingProvider: data.meetingProvider || "google_meet",
        meetingUrl: data.meetingUrl || (data.meetingProvider === "skyroom" 
          ? `https://www.skyroom.online/ch/codelearn/room-${Date.now().toString().slice(-4)}`
          : `https://meet.google.com/cod-lrn-${Date.now().toString().slice(-4)}`),
        notes: data.notes || ""
      };

      bookings.unshift(newBooking);
      storage.set("bookings", bookings);

      // Add Notification
      let notifs = storage.get("notifications", []);
      notifs.unshift({
        id: "notif-" + Date.now(),
        type: "booking_confirmed",
        title: "رزرو موفق کلاس",
        message: `کلاس ${newBooking.courseTitle} با ${newBooking.teacherName} برای تاریخ ${newBooking.date} ساعت ${newBooking.timeSlot} رزرو و تایید شد.`,
        createdAt: "هم اکنون",
        isRead: false
      });
      storage.set("notifications", notifs);

      return { success: true, data: newBooking };
    }

    if (endpoint === "/notifications/read-all") {
      let notifs = storage.get("notifications", []);
      notifs = notifs.map(n => ({ ...n, isRead: true }));
      storage.set("notifications", notifs);
      return { success: true };
    }

    throw new Error(`POST Endpoint "${endpoint}" not handled`);
  }

  async _handleMockPut(endpoint, data) {
    if (endpoint.startsWith("/teachers/") && endpoint.endsWith("/availability")) {
      const parts = endpoint.split("/");
      const teacherId = parts[2];
      let availMap = storage.get("availability", {});
      availMap[teacherId] = data;
      storage.set("availability", availMap);
      return { success: true, data };
    }

    if (endpoint.startsWith("/teachers/") && endpoint.endsWith("/subjects")) {
      const parts = endpoint.split("/");
      const teacherId = parts[2];
      let teachers = storage.get("teachers", []);
      const index = teachers.findIndex(t => t.id === teacherId);
      if (index !== -1) {
        teachers[index].teachingSubjects = data.teachingSubjects;
        storage.set("teachers", teachers);
        return { success: true, data: teachers[index] };
      }
      throw new Error("مدرس یافت نشد");
    }

    if (endpoint.startsWith("/users/profile")) {
      const currentUser = storage.get("current_user", null);
      if (!currentUser) throw new Error("کاربر یافت نشد");
      const updatedUser = { ...currentUser, ...data };
      storage.set("current_user", updatedUser);
      return { success: true, data: updatedUser };
    }

    throw new Error(`PUT Endpoint "${endpoint}" not handled`);
  }

  async _handleMockDelete(endpoint) {
    if (endpoint.startsWith("/bookings/")) {
      const bookingId = endpoint.split("/")[2];
      let bookings = storage.get("bookings", []);
      bookings = bookings.map(b => b.id === bookingId ? { ...b, status: "cancelled" } : b);
      storage.set("bookings", bookings);
      return { success: true };
    }
    throw new Error(`DELETE Endpoint "${endpoint}" not handled`);
  }
}

export const api = new ApiClient();
