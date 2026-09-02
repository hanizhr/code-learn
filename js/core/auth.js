/**
 * Authentication Helper and Session Manager
 */

import { storage } from "./storage.js";
import { appState } from "./state.js";

export class AuthManager {
  static getCurrentUser() {
    return storage.get("current_user", null);
  }

  static isAuthenticated() {
    return !!storage.get("auth_token", null) && !!this.getCurrentUser();
  }

  static isStudent() {
    const user = this.getCurrentUser();
    return user && user.role === "student";
  }

  static isTeacher() {
    const user = this.getCurrentUser();
    return user && user.role === "teacher";
  }

  static isAdmin() {
    const user = this.getCurrentUser();
    return user && user.role === "admin";
  }

  static login(user, token) {
    storage.set("current_user", user);
    storage.set("auth_token", token);
    appState.setState({ user });
    appState.emit("auth:login", user);
  }

  static logout() {
    storage.remove("current_user");
    storage.remove("auth_token");
    appState.setState({ user: null });
    appState.emit("auth:logout");
  }

  /**
   * Helper to switch demo accounts instantly for smooth evaluation
   */
  static async switchDemoRole(role = "student") {
    let users = storage.get("users", []);
    if (!users.length) {
      const res = await fetch("/mock/users.json");
      users = await res.json();
      storage.set("users", users);
    }

    const targetUser = users.find(u => u.role === role);
    if (targetUser) {
      this.login(targetUser, "demo_jwt_token_" + role);
      return targetUser;
    }
    return null;
  }
}
