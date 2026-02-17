# مستندات پروژه CU Management

## توضیحات پروژه

سیستم مدیریت مواد مصرفی شرکت زرسم - یک اپلیکیشن React/TypeScript برای ثبت و مدیریت مصرف مواد بر اساس شماره برنامه تولید. اتصال به SharePoint برای خواندن و نوشتن داده‌ها.

---

## توضیحات دولوپ

## 1 از پروژه BUILD گرفته شود

## 2 فایلهایی که در فولدر DIST ساخته میشود کپی گرفته شود

## 3 فایلهای ساخته شده در CUManagement_Vite جایگزاری شود

## 4 آدرس صفحه https://portal.zarsim.com/SitePages/CUManagement.aspx

---

## لیست‌های GET (خواندن داده)

| نام لیست (Config Key)          | توضیحات                   | ماژول |
| ------------------------------ | ------------------------- | ----- |
| **DEVICES_LIST**               | 04-مشخصات دستگاه          |
| **PERSONNEL**                  | 00-لیست پرسنل             |
| **SUB_PRODUCTION_PLAN**        | Subproductionplan         |
| **PRINT_TAJMI**                | پرینت تجمیع               |
| **STOP_LIST**                  | 04-لیست توقفات            |
| **PRODUCT_MATERIAL_PER_STAGE** | لیست مواد اولیه طرح تولید |
| **REELS_LIST**                 | Reels_Management          |
| **PRODUCTS_LIST**              | 04-محصولات                |
| **WASTE_LIST**                 | waste                     |
| **CU_MANAGEMENT_REELS**        | CU_Management_Reels       |

---

## لیست‌های POST , PUT , PATCH (نوشتن و ویرایش داده)

| نام لیست (Config Key)   | عملیات              | توضیحات | ماژول |
| ----------------------- | ------------------- | ------- | ----- |
| **CU_MANAGEMENT**       | CU_Management       |
| **CU_MANAGEMENT_ROW**   | CU_Management_Row   |
| **CU_MANAGEMENT_REELS** | CU_Management_Reels |

---

## لیست‌های DELETE (پاک کردن داده)

| نام لیست (Config Key)   | عملیات              | توضیحات | ماژول |
| ----------------------- | ------------------- | ------- | ----- |
| **CU_MANAGEMENT_REELS** | CU_Management_Reels |

---

## تکنولوژی‌های پروژه

### فریمورک و زبان

- **React** 19.1.1
- **TypeScript** 5.9
- **Vite** (با rolldown-vite) – بیلد و توسعه

### مدیریت State و فرم

- **TanStack React Query** – کش و واکشی داده
- **React Hook Form** – مدیریت فرم
- **Zod** – اعتبارسنجی اسکیمای فرم

### UI و استایل

- **Tailwind CSS** – استایل‌دهی
- **MUI (Material UI)** – کامپوننت‌های UI
- **Radix UI** – Checkbox, Dialog, Label, Popover, Select, Slot, Tabs
- **Emotion** – استایل‌دهی با RTL
- **Styled Components**
- **Lucide React** – آیکون‌ها

### کتابخانه‌های کمکی

- **react-toastify** – نوتیفیکیشن
- **Sonner** – Toast
- **class-variance-authority** – کلاس‌های شرطی
- **clsx** / **tailwind-merge** – ترکیب کلاس‌ها
- **cmdk** – کامند پالت
- **react-date-object** / **react-multi-date-picker** – تاریخ شمسی

### RTL و قالب فارسی

- **stylis-plugin-rtl** – پشتیبانی RTL
