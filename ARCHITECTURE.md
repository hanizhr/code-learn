# معماری سیستم (System Architecture)

این سند معماری و ساختار فنی **پلتفرم آموزش آنلاین کدلرن** را توضیح می‌دهد.

---

## ۱. اصول طراحی معماری (Design Principles)

1. **تفکیک کامل دغدغه‌ها (Separation of Concerns):**
   صفحات (Pages) هیچ‌گونه وابستگی مستقیمی به `localStorage`، جزئیات درخواست‌های شبکه یا داده‌های ساختگی ندارند.
   
   ```
   [ Page Component ]
          │
          ▼
   [ Service Layer (auth, teacher, booking, calendar, meeting) ]
          │
          ▼
   [ API Client (js/core/api.js) ]
          │
          ├─► [ Mock Database / localStorage ] (مرحله فعلی)
          └─► [ REST API Backend (Express/FastAPI/Django) ] (آینده)
   ```

2. **Frontend-Backend Independence:**
   برای تعویض Mock API با یک سرور واقعی، تنها کافی است متغیر `isMock = false` در فایل `js/core/api.js` تنظیم شود.

3. **Provider-Based Third-Party Services:**
   اتصال به سرویس‌های جلسات آنلاین (Google Meet و Skyroom) از طریق الگوی Provider پیاده‌سازی شده تا افزودن سرویس‌های جدید نظیر Zoom و Jitsi به سادگی و بدون تغییر لایه UI صورت پذیرد.

---

## ۲. ساختار دایرکتوری‌ها

```
├── index.html                   # سند اصلی ورودی با پشتیبانی از RTL و فونت وزیرمتن
├── metadata.json                # متادیتای سیستم
│
├── css/                         # سیستم طراحی ماژولار با CSS خالص
│   ├── variables.css            # متغیرهای CSS (رنگ‌ها، تایپوگرافی، فاصله‌ها، سایه‌ها)
│   ├── reset.css                # ریست و عادی‌سازی مرورگر و جهت RTL
│   ├── layout.css               # چیدمان‌های کلان (هدر، فوتر، گریدها، داشبورد)
│   ├── components.css           # کامپوننت‌های بصری (دکمه‌ها، کارت‌ها، مدال، فرم‌ها)
│   ├── utilities.css            # کلاس‌های کمکی و انیمیشن‌ها
│   ├── responsive.css           # مدیاکوئری‌ها و واکنش‌گرایی برای تبلت و موبایل
│   └── main.css                 # نقطه ورود و تجمیع استایل‌ها
│
├── js/                          # معماری ماژولار جاوااسکریپت (ES6 Modules)
│   ├── app.js                   # بوت‌استرپ و راه‌انداز اصلی برنامه
│   ├── core/                    # ماژول‌های پایه و هسته سیستم
│   │   ├── config.js            # تنظیمات و ثابت‌های سراسری
│   │   ├── storage.js           # مدیریت ذخیره‌سازی محلی و Seed داده‌ها
│   │   ├── api.js               # لایه متمرکز درخواست‌های شبکه و Mock Dispatcher
│   │   ├── state.js             # مدیریت حالت واکنشی سراسری و EventBus
│   │   ├── auth.js              # مدیریت نشست و کنترل دسترسی بر اساس نقش
│   │   └── router.js            # مسیریاب کلاینت بر پایه هش با پشتیبانی از Guard
│   │
│   ├── services/                # لایه سرویس‌ها و منطق کسب‌وکار
│   │   ├── auth.service.js      # سرویس ورود، ثبت‌نام و مدیریت پروفایل
│   │   ├── course.service.js    # سرویس سرفصل‌ها و دوره‌های آموزشی
│   │   ├── teacher.service.js   # سرویس کاتالوگ مدرسین، فیلترها و نظرات
│   │   ├── calendar.service.js  # سرویس مدیریت زمان‌های آزاد و تقویم مدرس
│   │   ├── booking.service.js   # سرویس فرآیند رزرو و پرداخت کلاس
│   │   ├── meeting.service.js   # سرویس ارائه‌دهنده بستر جلسات آنلاین
│   │   └── notification.service.js # سرویس اعلان‌ها و پیام‌های سیستم
│   │
│   ├── components/              # کامپوننت‌های قابل استفاده مجدد
│   │   ├── navbar.js            # هدر واکنش‌گرا با سوئیچر نقش و اعلان‌ها
│   │   ├── footer.js            # فوتر مدرن فارسی
│   │   ├── sidebar.js           # سایدبار داشبورد برای دانشجو و مدرس
│   │   ├── modal.js             # سیستم مدال و پنجره‌های شناور
│   │   ├── toast.js             # اعلان‌های موقت Toast
│   │   ├── teacherCard.js       # کارت نمایش اطلاعات و رزرو مدرس
│   │   ├── courseCard.js        # کارت معرفی موضوع آموزشی
│   │   ├── calendarView.js      # تقویم هفتگی تعاملی با رنگ‌بندی استاندارد
│   │   ├── bookingModal.js      # ویزارد رزرو چندمرحله‌ای کلاس
│   │   └── notificationCenter.js# پنل اعلان‌ها
│   │
│   ├── pages/                   # کنترلرهای صفحات اصلی سیستم
│   │   ├── homePage.js          # صفحه نخست و معرفی پلتفرم
│   │   ├── coursesPage.js       # کاتالوگ دوره‌ها و فیلترها
│   │   ├── courseDetailPage.js  # صفحه سرفصل و جزئیات دوره
│   │   ├── teachersPage.js      # لیست و فیلترهای پیشرفته اساتید
│   │   ├── teacherProfilePage.js# پروفایل مدرس و تقویم اختصاصی
│   │   ├── authPage.js          # صفحه ورود، ثبت‌نام و بازیابی رمز
│   │   ├── studentDashboardPage.js # داشبورد دانشجو
│   │   ├── teacherDashboardPage.js # داشبورد مدرس
│   │   ├── liveClassPage.js     # اتاق کلاس مجازی آنلاین
│   │   ├── aboutPage.js         # درباره ما
│   │   ├── contactPage.js       # تماس با پشتیبانی
│   │   ├── faqPage.js           # سوالات متداول
│   │   └── notFoundPage.js      # صفحه ۴۰۴
│   │
│   └── utils/                   # توابع کمکی
│       ├── formatters.js        # فرمت اعداد، مبالغ به تومان و کاراکترهای فارسی
│       ├── dateUtils.js         # محاسبات تقویم شمسی و روزهای هفته
│       ├── validators.js        # اعتبارسنجی ایمیل، تلفن و رمز عبور
│       ├── dom.js               # توابع امنیتی XSS و دستکاری DOM
│       └── icons.js             # آیکون‌های برداری SVG
│
└── mock/                        # ساختار داده‌های ساختگی شبیه به پاسخ‌های JSON سرور
    ├── users.json
    ├── teachers.json
    ├── courses.json
    ├── availability.json
    └── bookings.json
```

---

## ۳. مسیریابی و کنترل دسترسی (Routing & Guards)

* **Hash-based Routing:** برای جلوگیری از نیاز به پیکربندی سرور جهت Fallbackهای SPA، از مسیریابی هش (`#/teachers`, `#/dashboard/student`) استفاده شده است.
* **Route Guards:**
  * در صورت عدم لاگین کاربر هنگام مراجعه به صفحات نیازمند احراز هویت (`requiresAuth: true`)، به صورت خودکار به صفحه `#/auth?redirect=...` هدایت می‌شود.
  * دسترسی به `#/dashboard/teacher` صرفاً برای کاربران با نقش `teacher` مجاز است.
