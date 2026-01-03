# MongoDB Setup Guide

## الخطوات لإعداد MongoDB:

### 1. تثبيت MongoDB محلياً (اختياري):
- تحميل MongoDB من: https://www.mongodb.com/try/download/community
- أو استخدام MongoDB Atlas (السحابة) - مجاني

### 2. إعداد MongoDB Atlas (موصى به):
1. اذهب إلى: https://www.mongodb.com/cloud/atlas
2. أنشئ حساب مجاني
3. أنشئ cluster جديد
4. احصل على connection string

### 3. إعداد ملف `.env`:
أنشئ ملف `.env` في مجلد `server/` وأضف:

```env
# Server Configuration
PORT=5000
CLIENT_URL=http://localhost:3000

# MongoDB Configuration
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/besafe

# For MongoDB Atlas (Cloud):
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/besafe?retryWrites=true&w=majority

# JWT Secret Key (Change this in production!)
JWT_SECRET=your-secret-key-change-in-production
```

### 4. تشغيل السيرفر:
```bash
cd server
npm run dev
```

سيتم الاتصال بـ MongoDB تلقائياً عند بدء تشغيل السيرفر.

## التحقق من أن البيانات محفوظة:

### 1. استخدام MongoDB Compass:
- تحميل من: https://www.mongodb.com/try/download/compass
- الاتصال بـ MongoDB
- عرض البيانات في collections: `students` و `stories`

### 2. استخدام MongoDB Shell:
```bash
mongosh
use besafe
db.students.find()
db.stories.find()
```

### 3. استخدام API:
- GET `/api/students` - عرض جميع المستخدمين
- GET `/api/stories` - عرض جميع القصص

## الميزات:
✅ جميع البيانات محفوظة في MongoDB
✅ التحديثات تحدث تلقائياً
✅ البيانات مستمرة (persistent) حتى بعد إعادة تشغيل السيرفر
✅ دعم MongoDB Atlas (السحابة) و MongoDB محلي

