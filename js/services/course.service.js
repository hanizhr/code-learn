/**
 * Courses & Subjects Service
 */

import { api } from "../core/api.js";

export const courseService = {
  async getCourses() {
    const res = await api.get("/courses");
    return res.data || [];
  },

  async getCourseById(idOrSlug) {
    const res = await api.get(`/courses/${idOrSlug}`);
    return res.data;
  },

  async getFeaturedCourses() {
    const courses = await this.getCourses();
    return courses.slice(0, 6);
  }
};
