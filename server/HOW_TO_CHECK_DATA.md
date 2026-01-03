# كيفية فحص البيانات في MongoDB

## الطريقة 1: MongoDB Compass (الأسهل) 🎯

### 1. تحميل MongoDB Compass:
- اذهب إلى: https://www.mongodb.com/try/download/compass
- حمّل وثبّت MongoDB Compass

### 2. الاتصال:
- افتح MongoDB Compass
- Connection String: `mongodb://localhost:27017`
- اضغط "Connect"

### 3. عرض البيانات:
- اختر قاعدة البيانات: `besafe`
- اختر Collection: `students` (للمستخدمين) أو `stories` (للقصص)
- ستشاهد جميع البيانات المحفوظة!

---

## الطريقة 2: MongoDB Shell (Terminal) 💻

### 1. افتح Terminal جديد:
```bash
mongosh
```

### 2. اختر قاعدة البيانات:
```bash
use besafe
```

### 3. عرض المستخدمين:
```bash
db.students.find()
```

### 4. عرض القصص:
```bash
db.stories.find()
```

### 5. عرض بشكل منسق:
```bash
db.students.find().pretty()
db.stories.find().pretty()
```

### 6. عدّ المستخدمين:
```bash
db.students.countDocuments()
```

---

## الطريقة 3: API Endpoints (من المتصفح) 🌐

### 1. عرض جميع المستخدمين:
افتح في المتصفح:
```
http://localhost:5000/api/students
```

### 2. عرض جميع القصص:
```
http://localhost:5000/api/stories
```

### 3. عرض مستخدم محدد:
```
http://localhost:5000/api/students/[USER_ID]
```

---

## مثال على البيانات المحفوظة:

### عند تسجيل مستخدم جديد:
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "full_name": "Mais",
  "username": "mais",
  "email": "mais@example.com",
  "phone": "0501234567",
  "grade_level": "high",
  "region": "Haifa",
  "school_name": "Al Salam",
  "points": 0,
  "streak": 0,
  "currentLevel": 1,
  "completedLevels": 0,
  "createdAt": "2025-01-22T10:30:00.000Z",
  "updatedAt": "2025-01-22T10:30:00.000Z"
}
```

### عند إنشاء قصة:
```json
{
  "_id": "507f191e810c19729de860ea",
  "story": "I received a friend request...",
  "incidentType": "Unwanted Contact",
  "displayName": "Sarah M.",
  "userId": "507f1f77bcf86cd799439011",
  "likes": 0,
  "createdAt": "2025-01-22T10:35:00.000Z",
  "updatedAt": "2025-01-22T10:35:00.000Z"
}
```

---

## نصائح:

✅ **MongoDB Compass** - الأسهل للمبتدئين (واجهة رسومية)
✅ **MongoDB Shell** - للمطورين (أسرع)
✅ **API Endpoints** - للاختبار السريع

---

## ملاحظة:
- البيانات تُحفظ تلقائياً عند:
  - ✅ تسجيل مستخدم جديد (Sign Up)
  - ✅ تسجيل دخول (Sign In) - يحدث الستريك
  - ✅ إضافة لايك على قصة
  - ✅ مشاركة قصة جديدة
  - ✅ تحديث النقاط

