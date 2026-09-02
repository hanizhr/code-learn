/**
 * Application Global Configuration
 */

export const CONFIG = {
  APP_NAME: "کدلرن",
  APP_SLOGAN: "پلتفرم آموزش آنلاین برنامه‌نویسی و رزرو کلاس با مدرسان برتر",
  VERSION: "1.0.0",
  API_BASE_URL: "/api",
  MOCK_DELAY_MS: 120, // Simulated network latency
  STORAGE_PREFIX: "codelearn_",
  DEFAULT_ROLE: "student",
  MEETING_PROVIDERS: {
    GOOGLE_MEET: {
      id: "google_meet",
      title: "Google Meet",
      icon: "video",
      baseUrl: "https://meet.google.com"
    },
    SKYROOM: {
      id: "skyroom",
      title: "اسکای‌روم (Skyroom)",
      icon: "video",
      baseUrl: "https://www.skyroom.online/ch/codelearn"
    }
  }
};
