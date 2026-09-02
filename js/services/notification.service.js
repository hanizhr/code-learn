/**
 * Notification Center Service
 */

import { api } from "../core/api.js";
import { appState } from "../core/state.js";

export const notificationService = {
  async getNotifications() {
    const res = await api.get("/notifications");
    const list = res.data || [];
    const unread = list.filter(n => !n.isRead).length;
    appState.setState({ notifications: list, unreadCount: unread });
    return list;
  },

  async markAllAsRead() {
    await api.post("/notifications/read-all");
    await this.getNotifications();
  },

  async sendNotification(notifData) {
    const list = await this.getNotifications();
    const newNotif = {
      id: "notif-" + Date.now(),
      type: notifData.type || "system",
      title: notifData.title,
      message: notifData.message,
      createdAt: "هم اکنون",
      isRead: false
    };
    list.unshift(newNotif);
    const { storage } = await import("../core/storage.js");
    storage.set("notifications", list);
    await this.getNotifications();
  }
};
