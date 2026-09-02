/**
 * Notification Center Dropdown / Component
 */

import { notificationService } from "../services/notification.service.js";
import { icons } from "../utils/icons.js";
import { escapeHtml } from "../utils/dom.js";

/**
 * Renders Notification Dropdown HTML
 * @param {Array<Object>} notifications 
 * @returns {string}
 */
export function renderNotificationCenter(notifications = []) {
  if (!notifications.length) {
    return `
      <div style="padding: 2rem 1rem; text-align: center; color: var(--color-text-muted);">
        <div style="margin-bottom: 0.5rem;">${icons.bell("w-8 h-8 text-muted mx-auto")}</div>
        <p style="font-size: 13px;">اعلان جدیدی وجود ندارد.</p>
      </div>
    `;
  }

  const itemsHtml = notifications.map(n => {
    let icon = icons.bell("w-4 h-4 text-primary");
    if (n.type === "booking_confirmed") icon = icons.check("w-4 h-4 text-success");
    if (n.type === "cancelled") icon = icons.x("w-4 h-4 text-danger");

    return `
      <div class="notif-item ${n.isRead ? "" : "unread"}" style="padding: 0.75rem 1rem; border-bottom: 1px solid var(--color-border); display: flex; gap: 0.75rem; align-items: flex-start; background-color: ${n.isRead ? "transparent" : "var(--color-primary-light)"};">
        <div style="margin-top: 2px;">${icon}</div>
        <div style="flex: 1;">
          <div style="font-weight: 600; font-size: 13px; color: var(--color-text-main); margin-bottom: 2px;">${escapeHtml(n.title)}</div>
          <div style="font-size: 12px; color: var(--color-text-secondary); line-height: 1.4;">${escapeHtml(n.message)}</div>
          <div style="font-size: 10px; color: var(--color-text-muted); margin-top: 4px;">${escapeHtml(n.createdAt)}</div>
        </div>
      </div>
    `;
  }).join("");

  return `
    <div class="notification-panel" style="width: 340px; max-height: 420px; display: flex; flex-direction: column;">
      <div style="padding: 0.75rem 1rem; border-bottom: 1px solid var(--color-border); display: flex; align-items: center; justify-content: space-between;">
        <span style="font-weight: bold; font-size: 14px;">اعلان‌ها و پیام‌ها</span>
        <button id="btn-mark-all-read" class="btn btn-ghost btn-sm" style="font-size: 11px; padding: 2px 6px;">
          خوانده شدن همه
        </button>
      </div>
      <div style="overflow-y: auto; flex: 1;">
        ${itemsHtml}
      </div>
    </div>
  `;
}
