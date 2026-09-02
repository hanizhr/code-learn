/**
 * Provider-Based Meeting & Online Classroom Session Service
 * Extensible provider architecture (Google Meet, Skyroom, Zoom, Jitsi, Teams)
 */

class BaseMeetingProvider {
  constructor(name, code) {
    this.name = name;
    this.code = code;
  }

  async generateMeetingUrl(bookingDetails) {
    throw new Error("generateMeetingUrl must be implemented by provider");
  }
}

class GoogleMeetProvider extends BaseMeetingProvider {
  constructor() {
    super("Google Meet", "google_meet");
  }

  async generateMeetingUrl(bookingDetails) {
    const slug = `cod-lrn-${Math.random().toString(36).substring(2, 6)}`;
    return {
      provider: this.code,
      providerName: this.name,
      meetingUrl: `https://meet.google.com/${slug}`,
      passcode: null,
      instructions: "برای ورود با اکانت گوگل وارد شوید."
    };
  }
}

class SkyroomProvider extends BaseMeetingProvider {
  constructor() {
    super("اسکای‌روم (Skyroom)", "skyroom");
  }

  async generateMeetingUrl(bookingDetails) {
    const roomId = Math.floor(1000 + Math.random() * 9000);
    return {
      provider: this.code,
      providerName: this.name,
      meetingUrl: `https://www.skyroom.online/ch/codelearn/room-${roomId}`,
      passcode: "1234",
      instructions: "نیازی به نصب نرم‌افزار نیست؛ مستقیماً در مرورگر باز می‌شود."
    };
  }
}

class MeetingService {
  constructor() {
    this.providers = new Map();
    this.registerProvider(new GoogleMeetProvider());
    this.registerProvider(new SkyroomProvider());
    this.defaultProvider = "google_meet";
  }

  registerProvider(providerInstance) {
    this.providers.set(providerInstance.code, providerInstance);
  }

  getAvailableProviders() {
    return Array.from(this.providers.values()).map(p => ({
      code: p.code,
      name: p.name
    }));
  }

  async createMeeting(providerCode = this.defaultProvider, bookingDetails = {}) {
    const provider = this.providers.get(providerCode) || this.providers.get(this.defaultProvider);
    if (!provider) {
      throw new Error(`سرویس برگزاری کلاس با شناسه "${providerCode}" یافت نشد.`);
    }
    return await provider.generateMeetingUrl(bookingDetails);
  }
}

export const meetingService = new MeetingService();
