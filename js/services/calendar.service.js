/**
 * Teacher Availability & Calendar Schedule Service
 */

import { api } from "../core/api.js";

export const calendarService = {
  async getTeacherAvailability(teacherId) {
    const res = await api.get(`/teachers/${teacherId}/availability`);
    return res.data || { weeklySchedule: {}, blockedDates: [] };
  },

  async saveTeacherAvailability(teacherId, scheduleData) {
    const res = await api.put(`/teachers/${teacherId}/availability`, scheduleData);
    return res.data;
  },

  async toggleSlotBlock(teacherId, dayKey, slotId) {
    const data = await this.getTeacherAvailability(teacherId);
    if (data.weeklySchedule && data.weeklySchedule[dayKey]) {
      const slot = data.weeklySchedule[dayKey].find(s => s.id === slotId);
      if (slot) {
        slot.isBlocked = !slot.isBlocked;
        await this.saveTeacherAvailability(teacherId, data);
      }
    }
    return data;
  },

  async addSlot(teacherId, dayKey, timeString) {
    const data = await this.getTeacherAvailability(teacherId);
    if (!data.weeklySchedule[dayKey]) {
      data.weeklySchedule[dayKey] = [];
    }
    const newSlot = {
      id: `slot-${dayKey}-${Date.now().toString().slice(-4)}`,
      time: timeString,
      isBooked: false,
      isBlocked: false
    };
    data.weeklySchedule[dayKey].push(newSlot);
    await this.saveTeacherAvailability(teacherId, data);
    return data;
  },

  async removeSlot(teacherId, dayKey, slotId) {
    const data = await this.getTeacherAvailability(teacherId);
    if (data.weeklySchedule[dayKey]) {
      data.weeklySchedule[dayKey] = data.weeklySchedule[dayKey].filter(s => s.id !== slotId);
      await this.saveTeacherAvailability(teacherId, data);
    }
    return data;
  },

  async toggleDayBlock(teacherId, dateShamsi) {
    const data = await this.getTeacherAvailability(teacherId);
    if (!data.blockedDates) data.blockedDates = [];
    if (data.blockedDates.includes(dateShamsi)) {
      data.blockedDates = data.blockedDates.filter(d => d !== dateShamsi);
    } else {
      data.blockedDates.push(dateShamsi);
    }
    await this.saveTeacherAvailability(teacherId, data);
    return data;
  }
};
