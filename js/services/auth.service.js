/**
 * Authentication Service
 * Communicates strictly through api client
 */

import { api } from "../core/api.js";
import { AuthManager } from "../core/auth.js";

export const authService = {
  async login(email, password) {
    const response = await api.post("/auth/login", { email, password });
    if (response.success && response.user) {
      AuthManager.login(response.user, response.token);
    }
    return response;
  },

  async register(formData) {
    const response = await api.post("/auth/register", formData);
    if (response.success && response.user) {
      AuthManager.login(response.user, response.token);
    }
    return response;
  },

  logout() {
    AuthManager.logout();
  },

  getCurrentUser() {
    return AuthManager.getCurrentUser();
  },

  async updateProfile(profileData) {
    const response = await api.put("/users/profile", profileData);
    if (response.success && response.data) {
      AuthManager.login(response.data, AuthManager.getCurrentUser()?.token || "mock_token");
    }
    return response;
  },

  async forgotPassword(email) {
    // Simulated forgot password
    await new Promise(r => setTimeout(r, 200));
    return { success: true, message: `لینک بازیابی کلمه عبور به ایمیل ${email} ارسال شد.` };
  }
};
