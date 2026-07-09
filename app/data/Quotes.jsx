"use client";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";

export default function QuotesPage() {
  const [allQuotes, setAllQuotes] = useState([]);
  const [quote, setQuote] = useState(null);

  // حالة التحكم في ظهور واختفاء النافذة المنبثقة (Modal)
  const [isModalOpen, setIsModalOpen] = useState(false);

  // حالات الـ State الخاصة بحقول الإدخال
  const [newContent, setNewContent] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newTags, setNewTags] = useState("");

  // دالة جلب الاقتباسات
  async function fetchQuotes() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/quotes`);
      const data = await res.json();
      if (data && data.length > 0) {
        setAllQuotes(data);
        if (!quote) setQuote(data[0]);
      }
    } catch (error) {
      console.error("خطأ في جلب الاقتباسات:", error);
   
    }   
  }

  useEffect(() => {
    fetchQuotes();
  }, []);

  // دالة اختيار اقتباس عشوائي
  function getNewQuote() {
    if (allQuotes.length === 0) return;
    const random = allQuotes[Math.floor(Math.random() * allQuotes.length)];
    setQuote(random);
  }

  // دالة نسخ الاقتباس
  function clipboard() {
    if (!quote) return;
    navigator.clipboard.writeText(`${quote.content} — ${quote.author}`);
    Swal.fire({
      icon: "success",
      title: "تم نسخ الاقتباس",
      showConfirmButton: false,
      timer: 1500,
    });
  }

  // دالة إرسال الاقتباس الجديد
  async function handleAddQuote(e) {
    e.preventDefault();

    if (!newContent || !newAuthor) {
      Swal.fire({ icon: "error", title: "فضلاً املأ خانة الاقتباس والكاتب" });
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/quotes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newContent,
          author: newAuthor,
          tags: newTags || "عام",
        }),
      });

      if (res.ok) {
        const addedQuote = await res.json();
        
        setAllQuotes([...allQuotes, addedQuote]);
        setQuote(addedQuote); 

        // تفريغ الحقول وإغلاق المودال
        setNewContent("");
        setNewAuthor("");
        setNewTags("");
        setIsModalOpen(false); 

        Swal.fire({
          icon: "success",
          title: "تمت إضافة الحكمة بنجاح! 🎉",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    } catch (error) {
      console.error("حدث خطأ أثناء الإضافة:", error);
      Swal.fire({ icon: "error", title: "فشل الاتصال بالسيرفر" });
    }
  }

  if (!quote) {
    return <div className="p-6 text-center text-xl">⏳ جاري تحميل الاقتباسات من السحاب...</div>;
  }

  return (
    <div className="p-6 text-center max-w-xl mx-auto min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-2xl mb-10 font-bold">🌟 اقتباسات يومية 🌟</h1>
      
      {/* كرت عرض الاقتباس */}
      <div className="bg-white/60 p-8 rounded-2xl shadow-xl border border-white/40 backdrop-blur-md w-full">
        <p className="text-stone-500 mb-3 text-sm font-medium"># {quote.tags}</p>
        <p className="text-xl font-medium text-stone-800 leading-relaxed">“{quote.content}”</p>
        <p className="mt-4 text-stone-600 font-semibold">— {quote.author}</p>
        
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={getNewQuote}
            className="px-5 py-2 bg-indigo-500 text-white rounded-xl shadow hover:bg-indigo-600 transition font-medium"
          >
            اقتباس جديد 🎲
          </button>
          <button
            onClick={clipboard}
            className="px-5 py-2 bg-green-600 text-white rounded-xl shadow hover:bg-green-700 transition font-medium"
          >
            نسخ 📋
          </button>
        </div>
      </div>

      {/* زر فتح نافذة الإضافة الجانبية/المنبثقة */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="mt-8 px-6 py-2.5 bg-stone-800 text-white rounded-xl shadow hover:bg-stone-900 transition font-medium text-sm flex items-center gap-2"
      >
        <span>إضافة اقتباس جديد</span> ➕
      </button>

      {/* 🔹 النافذة المنبثقة (Modal) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-2xl border border-stone-100 text-right animate-in fade-in zoom-in duration-200">
            
            <div className="flex justify-between items-center mb-6 border-b pb-3">
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-stone-400 hover:text-stone-600 font-bold text-lg"
              >
                ✕
              </button>
              <h2 className="text-lg font-bold text-stone-800">➕ إضافة اقتباس جديد للمخزن</h2>
            </div>

            <form onSubmit={handleAddQuote} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-1">نص الاقتباس:</label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full p-2.5 border border-stone-300 rounded-xl text-right focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  rows="3"
                  placeholder="اكتب الحكمة أو الاقتباس هنا..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-600 mb-1">اسم القائل (الكاتب):</label>
                <input
                  type="text"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  className="w-full p-2.5 border border-stone-300 rounded-xl text-right focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  placeholder="مثال: ابن القيم"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-600 mb-1">التصنيف (التاغ):</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full p-2.5 border border-stone-300 rounded-xl text-right focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  placeholder="مثال: مواعظ، تفاؤل"
                />
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 text-white font-bold rounded-xl shadow hover:bg-emerald-700 transition"
                >
                  حفظ سحابياً 🚀
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-stone-100 text-stone-600 font-medium rounded-xl hover:bg-stone-200 transition"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}