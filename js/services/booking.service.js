/**
 * Booking & Class Reservation Service
 */

import { api } from "../core/api.js";
import { meetingService } from "./meeting.service.js";

export const bookingService = {
  async getBookings(filters = {}) {
    const res = await api.get("/bookings", filters);
    return res.data || [];
  },

  async getBookingById(id) {
    const res = await api.get(`/bookings/${id}`);
    return res.data;
  },

  async createBooking(bookingPayload) {
    // 1. Generate Meeting Session through MeetingService Provider
    const meetingInfo = await meetingService.createMeeting(
      bookingPayload.meetingProvider || "google_meet",
      bookingPayload
    );

    const fullBookingData = {
      ...bookingPayload,
      meetingUrl: meetingInfo.meetingUrl,
      meetingProvider: meetingInfo.provider
    };

    // 2. Submit to central API
    const response = await api.post("/bookings", fullBookingData);
    return response;
  },

  async cancelBooking(bookingId) {
    const response = await api.delete(`/bookings/${bookingId}`);
    return response;
  },

  async processMockPayment(amount, cardDetails = {}) {
    // Simulated payment gateway processing
    await new Promise(r => setTimeout(r, 600));
    return {
      success: true,
      transactionId: "TX-" + Math.floor(10000000 + Math.random() * 90000000),
      paidAt: new Date().toLocaleTimeString("fa-IR"),
      amount
    };
  }
};
