const mongoose = require('mongoose');

// تحديد هيكل الاقتباس (Content, Author, Tags) بناءً على ملفك
const quoteSchema = new mongoose.Schema({
  content: { 
    type: String, 
    required: true 
  },
  author: { 
    type: String, 
    required: true 
  },
  tags: { 
    type: String, 
    default: "عام" 
  }
});

// تصدير الموديل لاستخدامه في السيرفر
module.exports = mongoose.model('Quote', quoteSchema);