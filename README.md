# Zamonaviy Dasturiy Yechimlar Veb-sayti

Ushbu loyiha - zamonaviy, futuristik "Dark Mode" va "Glassmorphism" uslubida yaratilgan, Node.js (Express) orqali ishlovchi interaktiv veb-sayt. Sayt orqali foydalanuvchilar loyiha narxini hisoblab, to'g'ridan-to'g'ri Telegram botingizga buyurtma yuborishlari mumkin.

## 🛠 Texnologiyalar
* **Frontend:** HTML, CSS (Glassmorphism, Neon effekti), JavaScript (Vanilla)
* **Backend:** Node.js, Express.js
* **Ma'lumotlar ombori:** `public/data/config.json` (Barcha matnlar, xizmatlar va narxlarni shu yerdan o'zgartirishingiz mumkin)

---

## 🚀 Qanday qilib ishga tushirish kerak?

Ushbu loyihani o'z kompyuteringizda ishga tushirish uchun quyidagi bosqichlarni bajaring:

### 1-qadam: Telegram Bot yaratish va Chat ID olish
Sizga buyurtmalar kelib tushishi uchun o'z Telegram botingizni yaratishingiz kerak.

**Bot yaratish:**
1. Telegramga kiring va qidiruv orqali `@BotFather` ni toping.
2. Unga `/start` deb yozing, so'ng `/newbot` buyrug'ini yuboring.
3. Botingizga nom bering (masalan, `Mening Loyihalarim`).
4. Botingizga username bering (masalan, `loyiham_bot` - oxiri `bot` bilan tugashi shart).
5. BotFather sizga **TOKEN** (uzun harf va raqamlardan iborat qator) beradi. Uni nusxalab oling.

**Chat ID ni olish:**
1. Qidiruvdan `@userinfobot` yoki `@getmyid_bot` ni topib, unga `/start` yuboring.
2. Bot sizga ID raqamingizni (masalan `123456789`) yuboradi. Uni nusxalab oling.

### 2-qadam: .env faylini to'ldirish
1. Loyiha papkasida joylashgan `.env` faylini oching.
2. Boya nusxalab olgan Token va Chat ID ni tegishli joylarga yozing:
```env
PORT=3000
TELEGRAM_BOT_TOKEN=Sizning_BotFatherdan_Olgan_Tokeningiz
TELEGRAM_CHAT_ID=Sizning_Id_Raqamingiz
```

### 3-qadam: Loyihani ishga tushirish
Agar sizda Node.js o'rnatilmagan bo'lsa, uni [nodejs.org](https://nodejs.org) saytidan yuklab olib o'rnating.

Loyiha papkasini terminal (buyruqlar satri yoki VS Code terminali) da oching va quyidagi buyruqni kiriting:

```bash
npm start
```
*(Yoki agar `package.json` da start buyrug'i bo'lmasa: `node server.js` deb yozing)*

### 4-qadam: Brauzerda ko'rish
Brauzeringizni oching va manzil qatoriga quyidagini yozing:
👉 **http://localhost:3000**

Sayt ishga tushganini ko'rasiz!

---

## 🎨 Saytni qanday tahrirlash mumkin?
Saytdagi narxlar, xizmat nomlari va asosiy matnlarni o'zgartirish uchun kodni bilishingiz shart emas. Shunchaki:
1. `public/data/config.json` faylini oching.
2. U yerdagi matnlarni va raqamlarni (masalan narxlarni) o'zingizga moslab o'zgartiring.
3. Faylni saqlang (Ctrl + S) va brauzerda sahifani yangilang (F5). Barcha o'zgarishlar avtomatik paydo bo'ladi.

## 🔗 Qo'shimcha ulanishlar
- Ijtimoiy tarmoqlar havolalarini (Telegram, Instagram) `public/index.html` faylining eng pastki qismidagi `<!-- TODO: Telegram va Instagram profil havolasini shu yerga qo'shish -->` izohi yoniga joylashingiz mumkin.
- Telefon raqami ham o'sha yerda, hozircha u yashirin (`<!-- TODO: Telefon raqamini shu yerda faollashtirish -->`). Uni ko'rsatish uchun HTML kommentariyasidan chiqaring.
