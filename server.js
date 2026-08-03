const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Ma'lumotlar bazasi konfiguratsiyasi frontend uchun
app.get('/api/config', (req, res) => {
    res.json({
        supabaseUrl: process.env.SUPABASE_URL,
        supabaseKey: process.env.SUPABASE_KEY
    });
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});


// Login endpoint
app.post('/api/login', (req, res) => {
    const { password } = req.body;
    // Parolni tekshirish (Vercel env yoki 0123)
    if (password === process.env.ADMIN_PASSWORD || password === '0123') {
        res.json({ success: true, token: 'admin-token-12345' });
    } else {
        res.json({ success: false });
    }
});

// Telegram ga yuborish funksiyasi
async function sendToTelegram(message) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId || token === 'YOUR_BOT_TOKEN_HERE') {
        console.warn("⚠️ Telegram Bot kalitlari o'rnatilmagan! Xabar yuborilmadi.");
        return false;
    }

    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'HTML' // Yoki 'Markdown'
            }),
        });

        if (!response.ok) {
            console.error("Telegram API xatosi:", await response.text());
            return false;
        }

        return true;
    } catch (error) {
        console.error("Telegramga yuborishda xatolik:", error);
        return false;
    }
}

// Buyurtma qabul qilish endpointi
app.post('/api/order', async (req, res) => {
    try {
        const { name, contact, price, services } = req.body;

        if (!name || !contact) {
            return res.status(400).json({ success: false, message: "Ism va aloqa ma'lumotlari kiritilishi shart." });
        }

        const servicesList = services && services.length > 0 ? services.join(', ') : "Hech narsa tanlanmagan";
        
        const message = `
🆕 <b>Yangi buyurtma!</b>

👤 <b>Ism:</b> ${name}
📞 <b>Aloqa:</b> ${contact}
💰 <b>Taxminiy narx:</b> ${price || 'Hisoblanmagan'}
🛠 <b>Tanlangan xizmatlar:</b> ${servicesList}
`;

        const isSent = await sendToTelegram(message);
        
        // Hatto Telegramga yuborish muvaffaqiyatsiz bo'lsa ham foydalanuvchiga muvaffaqiyatli xabar qaytaramiz (sizning talabingiz)
        if (!isSent) {
            console.log("Diqqat: Xabar foydalanuvchidan qabul qilindi, lekin Telegramga yetib bormadi.");
        }

        res.json({ success: true, message: "Rahmat! Tez orada siz bilan bog'lanamiz." });
        
    } catch (error) {
        console.error("Buyurtma qabul qilishda xatolik:", error);
        res.status(500).json({ success: false, message: "Tizim xatosi yuz berdi. Iltimos keyinroq urunib ko'ring." });
    }
});

// Kontakt formasi orqali xabar qabul qilish endpointi
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ success: false, message: "Ism, email va xabar kiritilishi shart." });
        }

        const telegramMessage = `
📩 <b>Yangi Xabar (Aloqa bo'limi)</b>

👤 <b>Ism:</b> ${name}
📧 <b>Email:</b> ${email}
📌 <b>Mavzu:</b> ${subject || 'Kiritilmagan'}
📝 <b>Xabar:</b>
${message}
`;

        const isSent = await sendToTelegram(telegramMessage);
        
        if (!isSent) {
            console.log("Diqqat: Xabar foydalanuvchidan qabul qilindi, lekin Telegramga yetib bormadi.");
        }

        res.json({ success: true, message: "Xabar muvaffaqiyatli yuborildi." });
        
    } catch (error) {
        console.error("Xabar qabul qilishda xatolik:", error);
        res.status(500).json({ success: false, message: "Tizim xatosi yuz berdi. Iltimos keyinroq urunib ko'ring." });
    }
});

// Agar ko'p sahifali (SPA) bo'lsa, wildcard o'rniga barcha route-lar uchun `/*` ishlatish mumkin.
// Lekin hozir static fayllar (index.html) express.static orqali o'zi xizmat qilinadi.
// Shuning uchun bu catch-all qismi shart emas, yoki '/(.*)' deb yozish mumkin.
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Vercel serverless functions uchun faqat production emas muhitda ishga tushirish
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 Server http://localhost:${PORT} manzilida ishga tushdi.`);
    });
}

// Vercel uchun app eksporti
module.exports = app;
