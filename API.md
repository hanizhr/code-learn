# مستندات لایه ارتباط با سرور و API (API Documentation)

ارتباطات داده‌ای پروژه به صورت متمرکز از طریق کلاس `ApiClient` در فایل `js/core/api.js` مدیریت می‌شود. در این بخش ساختار Endpoints و قراردادهای ورودی/خروجی مستند شده است.

---

## ۱. احراز هویت (Authentication)

### `POST /auth/login`
ورود کاربر به سیستم.
* **ورودی:**
  ```json
  {
    "email": "ali@example.com",
    "password": "••••••••"
  }
  ```
* **خروجی:**
  ```json
  {
    "success": true,
    "token": "jwt_token_string",
    "user": { ... }
  }
  ```

### `POST /auth/register`
ثبت‌نام کاربر با نقش دانشجو یا مدرس.
* **ورودی:**
  ```json
  {
    "name": "نام کاربر",
    "email": "user@example.com",
    "phone": "09123456789",
    "role": "student | teacher",
    "password": "••••••••",
    "bio": "رزومه اولیه در صورت نقش مدرس"
  }
  ```

---

## ۲. اساتید و مدرسان (Teachers)

### `GET /teachers`
دریافت لیست مدرسان به همراه فیلترهای اختیاری.
* **پارامترهای Query:**
  * `subject`: شناسه یا عنوان موضوع آموزشی (مثلاً `course-python`)
  * `level`: سطح تدریس (`beginner`, `intermediate`, `advanced`)
  * `q`: واژه جستجو در نام و تخصص‌ها
* **خروجی:**
  ```json
  {
    "data": [
      {
        "id": "teacher-1",
        "name": "دکتر نیما کمالی",
        "title": "توسعه‌دهنده ارشد پایتون و جنگو",
        "rating": 4.9,
        "hourlyRate": 450000,
        "specialties": ["Python", "Django", "FastAPI"],
        ...
      }
    ],
    "total": 6
  }
  ```

### `GET /teachers/:id`
دریافت پروفایل کامل یک مدرس بر اساس شناسه.

### `GET /teachers/:id/availability`
دریافت برنامه هفتگی و روزهای تعطیل مدرس.

### `PUT /teachers/:id/availability`
به‌روزرسانی برنامه زمان‌بندی هفتگی یا بلاک کردن روزهای خاص توسط مدرس.

---

## ۳. دوره‌ها و موضوعات (Courses)

### `GET /courses`
دریافت لیست تمام موضوعات و زبان‌های برنامه‌نویسی فعال در پلتفرم.

### `GET /courses/:id`
دریافت سرفصل‌های تفکیک شده یک دوره به همراه ساعت‌های آموزشی هر سطح.

---

## ۴. رزرو کلاس‌ها (Bookings)

### `GET /bookings`
دریافت رزروها با فیلتر `studentId` یا `teacherId`.

### `POST /bookings`
ثبت رزرو قطعی یک جلسه.
* **ورودی:**
  ```json
  {
    "studentId": "user-student-1",
    "studentName": "علی رضایی",
    "teacherId": "teacher-1",
    "teacherName": "دکتر نیما کمالی",
    "courseId": "course-python",
    "courseTitle": "پایتون (Python)",
    "level": "intermediate",
    "date": "1403/06/15",
    "dayOfWeek": "شنبه",
    "timeSlot": "10:00 - 11:00",
    "price": 450000,
    "meetingProvider": "google_meet",
    "notes": "رفع اشکال پروژه‌های جنگو"
  }
  ```

### `DELETE /bookings/:id`
لغو یک جلسه رزرو شده توسط دانشجو یا مدرس.

---

## ۵. ارائه‌دهندگان جلسات آنلاین (Meeting Providers)

لایه جلسات از طریق `meetingService.createMeeting(providerCode, bookingPayload)` مدیریت می‌شود و به صورت خودکار لینک ورود اختصاصی جلسه را تولید می‌نماید:
* `google_meet` ➔ لینک `https://meet.google.com/cod-lrn-xxxx`
* `skyroom` ➔ لینک `https://www.skyroom.online/ch/codelearn/room-xxxx`
