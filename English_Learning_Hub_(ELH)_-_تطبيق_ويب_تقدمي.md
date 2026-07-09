# English Learning Hub (ELH) - تطبيق ويب تقدمي

## 📁 بنية المشروع

```
ELH-PWA/
├── index.html              ← صفحة التسجيل (البداية)
├── placement-test.html     ← اختبار تحديد المستوى التكيفي
├── student_dashboard.html  ← لوحة تحكم الطالب
├── unit1.html             ← صفحة الوحدة (6 أجزاء)
├── manifest.json           ← ملفات PWA
└── service-worker.js       ← دعم أوفلاين
```

## 📋 التعليمات - Spck Editor

### 1. إنشاء مشروع جديد
- افتح Spck Editor
- أنشئ مشروع HTML جديد
- انسخ كل ملف إلى مجلد المشروع

### 2. إعداد Supabase
- أنشئ حساب في [supabase.com](https://supabase.com)
- أنشئ مشروع جديد
- انسخ URL و Anonymous Key
- في كل ملف HTML، استبدل:
  ```js
  const SUPABASE_URL = 'YOUR_SUPABASE_URL';
  const SUPABASE_KEY = 'YOUR_SUPABASE_ANON_KEY';
  ```

### 3. إنشاء جدول students في Supabase
```sql
CREATE TABLE students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  user_id TEXT UNIQUE NOT NULL,
  whatsapp TEXT NOT NULL,
  classroom TEXT NOT NULL,
  relationship TEXT NOT NULL,
  level INTEGER DEFAULT 1,
  test_scores JSONB DEFAULT '{}',
  test_completed BOOLEAN DEFAULT false,
  test_date TIMESTAMP,
  language TEXT DEFAULT 'ar',
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 4. إنشاء جدول student_progress (اختياري)
```sql
CREATE TABLE student_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  completed_units INTEGER DEFAULT 0,
  total_units INTEGER DEFAULT 6,
  stars INTEGER DEFAULT 0,
  badges INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  last_login TIMESTAMP DEFAULT NOW()
);
```

## 🎨 مبادئ التصميم

### الألوان (مبنية على دراسات علم نفس الألوان للأطفال)
| اللون | الرمز | الاستخدام | التأثير النفسي |
|-------|-------|-----------|----------------|
| وردي | `#ff7aa2` | أزرار رئيسية، إنجاز | دفء، تشجيع |
| أزرق سماوي | `#6cc7ff` | تركيز، ثقة | هدوء، ثقة |
| أخضر | `#7ed957` | نجاح، تقدم | نمو، تعزيز إيجابي |
| برتقالي | `#ffb347` | طاقة، إبداع | نشاط، مشاركة |
| بنفسجي | `#a78bfa` | جوائز، سحر | خيال، مكافأة |
| تركواز | `#59d6c7` | توازن | ثقة، انتعاش |

### Glass Morphism
- شفافية مع `backdrop-filter: blur(16px)`
- حدود بيضاء شفافة `border: 1px solid rgba(255,255,255,0.8)`
- ظلال ناعمة `box-shadow: 0 16px 40px rgba(35,55,90,0.10)`
- زوايا دائرية `border-radius: 28px`

## 🧪 اختبار تحديد المستوى التكيفي

### الخوارزمية (IRT-based CAT)
1. يبدأ بمستوى متوسط (2 من 5)
2. إجابة صحيحة → رفع الصعوبة
3. إجابة خاطئة → خفض الصعوبة
4. بعد 12 سؤال → تصنيف نهائي
5. يغطي: Vocabulary, Grammar, Phonics, Reading, Listening

### المستويات
| المستوى | الوصف | نسبة النجاح المطلوبة |
|---------|-------|---------------------|
| 1 | مبتدئ (Beginner) | 0-20% |
| 2 | مبتدئ+ (Elementary) | 21-40% |
| 3 | متوسط (Intermediate) | 41-60% |
| 4 | فوق المتوسط (Upper-Intermediate) | 61-80% |
| 5 | متقدم (Advanced) | 81-100% |

## 📱 PWA Features

### manifest.json
- الاسم: English Learning Hub
- الوضع: standalone (تطبيق كامل الشاشة)
- الألوان: وردي/أبيض ناعم
- اتجاه RTL للغة العربية

### service-worker.js
- Cache-First للأصول
- Network-First للبيانات
- دعم أوفلاين كامل
- إشعارات الدفع (جاهزة للتفعيل)
- مزامنة خلفية

## 🔊 ميزات تفاعلية

### Text-to-Speech
- Web Speech API مدمج
- سرعة أبطأ للأطفال (rate: 0.85)
- نبرة أرفع وأكثر ودية (pitch: 1.1)

### Speech Recognition
- التعرف على الصوت (Chrome/Safari)
- تدرب على النطق
- تعزيز ثقة الطالب

## 🌐 نظام اللغات (EN/AR)

كل ملف يدعم التحويل الفوري بين العربية والإنجليزية:
- اتجاه RTL/LTR
- ترجمة جميع النصوص
- ترجمة placeholders
- حفظ اللغة المختارة

## 📊 مسار المستخدم

```
index.html (تسجيل)
    ↓
placement-test.html (اختبار تكيفي)
    ↓
student_dashboard.html (لوحة التحكم)
    ↓
unit1.html (وحدات تعليمية)
    ├── Part 1: Hello (Listen & Repeat)
    ├── Part 2: How Are You (Dialogue)
    ├── Part 3: My Name Is (Self Intro)
    ├── Part 4: Let's Talk (Full Conversation)
    ├── Part 5: Goodbye (Farewell)
    └── Part 6: Review (Quiz + Stars)
```

## ⚡ ملاحظات تقنية

1. كل ملف مستقل (self-contained) - لا حاجة لبناء أو تجميع
2. لا حاجة لـ Node.js أو أي أدوات بناء
3. يعمل مباشرة في المتصفح
4. دعم localStorage كبديل لـ Supabase
5. Mobile-First responsive design
6. Cairo font للعربية والإنجليزية

## 🔧 Troubleshooting

### Supabase لا يعمل؟
- تأكد من صحة URL و Key
- تحقق من CORS settings في Supabase Dashboard
- التخزين المحلي يعمل كبديل

### PWA لا يعمل؟
- تأكد من تقديم الملفات عبر HTTPS
- manifest.json يجب أن يكون في نفس المجلد
- service-worker.js يجب تسجيله من صفحة index.html

### Speech API لا يعمل؟
- يتطلب Chrome أو Safari
- يجب السماح بالوصول للميكروفون
- يعمل عبر HTTPS فقط
