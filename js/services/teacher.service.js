/**
 * Teacher Management & Catalog Service
 */

import { api } from "../core/api.js";

export const teacherService = {
  async getTeachers(filters = {}) {
    const res = await api.get("/teachers", filters);
    return res.data || [];
  },

  async getTeacherById(id) {
    const res = await api.get(`/teachers/${id}`);
    return res.data;
  },

  async getFeaturedTeachers() {
    const teachers = await this.getTeachers();
    return teachers.sort((a, b) => b.rating - a.rating).slice(0, 4);
  },

  async updateTeacherSubjects(teacherId, teachingSubjects) {
    const res = await api.put(`/teachers/${teacherId}/subjects`, { teachingSubjects });
    return res.data;
  },

  async addReview(teacherId, reviewData) {
    // In mock API, we can append a review to the teacher's profile
    const teacher = await this.getTeacherById(teacherId);
    if (!teacher.reviews) teacher.reviews = [];
    teacher.reviews.unshift({
      id: "rev-" + Date.now(),
      studentName: reviewData.studentName || "دانشجو",
      studentAvatar: reviewData.studentAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
      rating: reviewData.rating || 5,
      date: "امروز",
      comment: reviewData.comment
    });
    // Recalculate average rating
    const totalRating = teacher.reviews.reduce((acc, r) => acc + r.rating, 0);
    teacher.rating = Number((totalRating / teacher.reviews.length).toFixed(2));
    teacher.reviewCount = teacher.reviews.length;
    
    // Save to storage
    const teachers = await this.getTeachers();
    const idx = teachers.findIndex(t => t.id === teacherId);
    if (idx !== -1) {
      teachers[idx] = teacher;
      const { storage } = await import("../core/storage.js");
      storage.set("teachers", teachers);
    }
    return teacher;
  }
};
