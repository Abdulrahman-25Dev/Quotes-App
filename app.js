const express = require('express'); // 1. استدعاء إكسبريس
const app = express();             // 2. تعريف الـ app (هذا السطر الذي ينقصك!)
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path'); // أضف هذا السطر في أعلى الملف إذا لم يكن موجوداً
dotenv.config(); // تحميل متغيرات البيئة من ملف .env

// الاتصال بقاعدة البيانات
mongoose.connect(process.env.MONGODB_URI);

app.use(cors());                   // تفعيل الـ cors
app.use(express.json()); // لقراءة بيانات الـ JSON القادمة في الـ Body

const PORT = process.env.PORT || 3001; // تحديد المنفذ من متغيرات البيئة أو استخدام 3001 كافتراضي
app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
});
const Quote = require('./models/Quote'); // استيراد الموديل الذي أنشأناه للتو

// 🔹 1. مسار جلب كل الاقتباسات من MongoDB
app.get('/api/quotes', async (req, res) => {
  try {
    const quotes = await Quote.find(); // جلب كل الاقتباسات من السحاب
    res.status(200).json(quotes); // إرسالها كـ JSON للفرونت-إند
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔹 2. مسار إضافة اقتباس جديد (اختياري لو أردت إضافة اقتباسات مستقبلاً من Postman)
app.post('/api/quotes', async (req, res) => {
  const { content, author, tags } = req.body;
  try {
    const newQuote = new Quote({ content, author, tags });
    await newQuote.save(); // حفظ الاقتباس الجديد في قاعدة البيانات
    res.status(201).json(newQuote);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});