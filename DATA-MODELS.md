# مدل‌های داده و شِماها (Data Models & Schemas)

این سند تعاریف ساختار داده‌های موجود در سیستم را تشریح می‌کند.

---

## ۱. مدل کاربر (User)

```typescript
interface User {
  id: string;             // e.g. "user-student-1"
  name: string;           // "علی رضایی"
  email: string;          // "ali@example.com"
  phone: string;          // "09123456789"
  role: "student" | "teacher" | "admin";
  avatar: string;         // URL
  bio?: string;
  teacherId?: string;     // در صورت مدرس بودن
  walletBalance: number;  // موجودی کیف پول به تومان
  registeredAt: string;   // "1403/06/15"
}
```

---

## ۲. مدل مدرس (Teacher)

```typescript
interface Teacher {
  id: string;             // "teacher-1"
  userId: string;
  name: string;           // "دکتر نیما کمالی"
  avatar: string;
  title: string;          // "توسعه‌دهنده ارشد پایتون و جنگو"
  specialties: string[];  // ["Python", "Django", "FastAPI"]
  rating: number;         // 4.9
  reviewCount: number;    // 38
  completedClasses: number; // 124
  hourlyRate: number;     // 450000 (تومان)
  bio: string;
  education: string;      // "دکترای هوش مصنوعی دانشگاه تهران"
  experienceYears: number;// 8
  preferredProvider: "google_meet" | "skyroom";
  teachingSubjects: TeachingSubject[];
  reviews: TeacherReview[];
}

interface TeachingSubject {
  subjectId: string;      // "course-python"
  subjectTitle: string;   // "پایتون (Python)"
  levels: ("beginner" | "intermediate" | "advanced")[];
}

interface TeacherReview {
  id: string;
  studentName: string;
  studentAvatar: string;
  rating: number;
  date: string;
  comment: string;
}
```

---

## ۳. مدل موضوع و سرفصل آموزشی (Course)

```typescript
interface Course {
  id: string;             // "course-python"
  title: string;          // "برنامه‌نویسی پایتون (Python)"
  slug: string;           // "python"
  category: "language" | "web" | "backend" | "ai" | "database";
  icon: string;           // "code" | "server" | "cpu" ...
  description: string;
  teachersCount: number;
  tags: string[];
  levels: CourseLevel[];
}

interface CourseLevel {
  level: "beginner" | "intermediate" | "advanced";
  title: string;          // "مقدماتی"
  hours: number;          // 20
  topics: string[];       // ["مفاهیم پایه شی‌گرایی", "کنترل جریان و توابع"]
}
```

---

## ۴. مدل تقویم و زمان‌بندی مدرس (TeacherAvailability)

```typescript
interface TeacherAvailability {
  teacherId: string;
  weeklySchedule: {
    [dayKey in "saturday" | "sunday" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday"]?: TimeSlot[];
  };
  blockedDates: string[]; // ["1403/06/20", "1403/06/21"]
}

interface TimeSlot {
  id: string;             // "slot-sat-1"
  time: string;           // "10:00 - 11:00"
  isBooked: boolean;
  isBlocked: boolean;
}
```

---

## ۵. مدل رزرو کلاس (Booking)

```typescript
interface Booking {
  id: string;             // "book-101"
  studentId: string;
  studentName: string;
  teacherId: string;
  teacherName: string;
  teacherAvatar: string;
  courseId: string;
  courseTitle: string;
  level: "beginner" | "intermediate" | "advanced";
  levelTitle: string;
  date: string;           // "1403/06/15"
  dayOfWeek: string;      // "شنبه"
  timeSlot: string;       // "10:00 - 11:00"
  status: "confirmed" | "completed" | "cancelled";
  price: number;          // 450000
  paidAt: string;
  meetingProvider: "google_meet" | "skyroom";
  meetingUrl: string;
  notes?: string;
}
```
