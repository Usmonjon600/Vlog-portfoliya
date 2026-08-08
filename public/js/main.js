// O'zgaruvchilar
let rawConfigData = null;
let currentTotalPrice = 0;
let currentTotalDays = 0;
let selectedServices = [];
let currentLang = localStorage.getItem('lang') || 'uz';
let typingInterval = null;
let typingTimeout = null;

// Tahrirlangan yoki bazadan olingan dinamik tarjimalar
let dynamicTranslations = null;

// Static Translations (Fallback)
const staticTranslations = {
    uz: {
        heroGreeting: "Salom, men",
        heroDescription: "Toza arxitektura va ajoyib foydalanuvchi tajribasiga ega zamonaviy veb-ilovalar, sun'iy intellektga asoslangan yechimlar va korporativ dasturlarni yarataman.",
        heroBtnProjects: "Loyihalarni ko'rish",
        heroBtnContact: "Men bilan bog'laning",
        heroRoles: ["Full Stack Dasturchi", "AI Muhandisi", "Dasturiy Muhandis", "Muammolarni Hal Qiluvchi", "Texnologiya Ishqibozi"],
        
        navHome: "Bosh sahifa",
        navAbout: "Men haqimda",
        navProjects: "Natijalar",
        navServices: "Xizmatlar",
        navContact: "Aloqa",
        navCalcBtn: "Narx hisoblash",
        navDiscussBtn: "Muhokama qilish",
        aboutTitle: "Men haqimda",
        aboutText: "<p>Men korporativ darajadagi tizimlar, kengaytiriladigan veb-ilovalar va real biznes muammolarini hal qiluvchi AI-integratsiyalangan yechimlarni yaratishga ishtiyoqmand dasturiy muhandisman.</p><p>Zenity Developer Team a'zosi sifatida men to'liq stek mahsulotlarni loyihalash va ishlab chiqaman — butun biznes operatsiyalarini boshqaradigan ERP tizimlaridan zamonaviy SaaS platformalargacha. Mening asosiy e'tiborim doimo toza arxitektura, ishlash samaradorligi va ajoyib foydalanuvchi tajribasiga qaratilgan.</p><p>Men shunday dasturiy ta'minotga ishonamanki, u ko'rinmas bo'lishi kerak — ichida kuchli, foydalanish oson. Men yozgan har bir kod qatori talablarga javob berishdan ko'ra, haqiqiy qiymat berishga qaratilgan.</p>",
        servicesTitle: "Mening xizmatlarim",
        projectsTitle: "Natijalar",
        project1Title: "Zapravka va Yonilg'i Boshqaruv Tizimi",
        project1Desc: "10 dan ortiq zapravkalar tajribasi asosida yaratilgan universal platforma. Yonilg'i va gaz hajmi minimumlarini kuzatish, tariflar va tarqatish uskunalarini (dispenser) boshqarish, xavfli darajada avtomatik ogohlantirishlar berish imkoniyati.",
        project2Title: "Avtomatlashtirilgan Do'kon CRM Tizimi",
        project2Desc: "Admin va kassirlar uchun alohida interfeysga ega CRM. Tovar qoldiqlarini avtomatik nazorat qilish, nasiya va qarzlar built, kunlik tushum/xarajat tahlili hamda Telegram bot orqali tezkor hisobotlar.",
        btnDemo: "Batafsil",
        calcTitle: "Loyiha narxini hisoblash",
        calcTotalText: "Jami taxminiy narx:",
        calcDaysText: "Taxminiy muddat:",
        calcOrderBtn: "Ushbu loyihani buyurtma qilish",
        modalOrderTitle: "Buyurtma berish",
        modalOrderDesc: "Ma'lumotlaringizni qoldiring, biz siz bilan tez orada bog'lanamiz.",
        modalNameLabel: "Ismingiz *",
        modalContactLabel: "Telefon yoki Telegram username *",
        modalPriceLabel: "Kutilayotgan narx:",
        modalServicesLabel: "Xizmatlar:",
        modalSubmitBtn: "Jo'natish",
        modalSuccessTitle: "Rahmat! 🎉",
        modalSuccessDesc: "Sizning so'rovingiz qabul qilindi. Tez orada siz bilan bog'lanamiz.",
        modalCloseBtn: "Yopish",
        detailsPriceLabel: "Narxi:",
        detailsCalcBtn: "Hisoblashga o'tish",
        currency: "so'm",
        days: "kun",
        contactTitle: "Aloqa",
        contactEmailLabel: "Email",
        contactTelegramLabel: "Telegram",
        contactPhoneLabel: "Telefon",
        contactLocationLabel: "Manzil",
        contactNameLabel: "Ismingiz",
        contactNamePlaceholder: "Ismingiz",
        contactEmailFormLabel: "Email",
        contactEmailPlaceholder: "Email manzilingiz",
        contactSubjectLabel: "Mavzu",
        contactSubjectPlaceholder: "Xabar mavzusi",
        contactMessageLabel: "Xabaringiz",
        contactMessagePlaceholder: "Xabaringizni yozing...",
        contactSubmitBtn: "Xabarni yuborish",
        contactSuccessMsg: "Xabar muvaffaqiyatli yuborildi! 🎉",
        navLogoText: "Loyiha",
        heroName: "Sodiqov Usmonjon",
        contactEmailVal: "usmonjonsadikov9@gmail.com",
        contactTelegramVal: "@Usmonjon_2013",
        contactPhoneVal: "+998 97 937 01 23"
    },
    en: {
        heroGreeting: "Hello, I'm",
        heroDescription: "Building modern web applications, AI-powered solutions, and enterprise software with clean architecture and exceptional user experiences.",
        heroBtnProjects: "View Projects",
        heroBtnContact: "Contact Me",
        heroRoles: ["Full Stack Developer", "AI Engineer", "Software Engineer", "Problem Solver", "Tech Enthusiast"],

        navHome: "Home",
        navAbout: "About Me",
        navProjects: "Projects",
        navServices: "Services",
        navContact: "Contact",
        navCalcBtn: "Calculate Price",
        navDiscussBtn: "Discuss Project",
        aboutTitle: "About Me",
        aboutText: "<p>I am a software engineer passionate about building enterprise-grade systems, scalable web applications, and AI-integrated solutions that solve real business problems.</p><p>As a member of the Zenity Developer Team, I design and develop full-stack products — from ERP systems managing entire business operations to modern SaaS platforms. My main focus is always on clean architecture, performance efficiency, and excellent user experience.</p><p>I believe in software that should be invisible — powerful on the inside, easy to use on the outside. Every line of code I write is aimed at delivering true value rather than just meeting requirements.</p>",
        servicesTitle: "My Services",
        projectsTitle: "Projects",
        project1Title: "Gas Station Fuel Management System",
        project1Desc: "A universal platform built on the experience of over 10 gas stations. Features minimum fuel and gas volume tracking, tariff and dispenser management, and automatic critical level alerts.",
        project2Title: "Automated Store CRM System",
        project2Desc: "CRM with separate interfaces for admins and cashiers. Automatic inventory control, credit/debt accounting, daily income/expense analysis, and instant reporting via Telegram bot.",
        btnDemo: "Details",
        calcTitle: "Calculate Project Price",
        calcTotalText: "Total estimated price:",
        calcDaysText: "Estimated duration:",
        calcOrderBtn: "Order this project",
        modalOrderTitle: "Place an Order",
        modalOrderDesc: "Leave your details and we will contact you shortly.",
        modalNameLabel: "Your Name *",
        modalContactLabel: "Phone or Telegram username *",
        modalPriceLabel: "Expected Price:",
        modalServicesLabel: "Services:",
        modalSubmitBtn: "Submit",
        modalSuccessTitle: "Thank you! 🎉",
        modalSuccessDesc: "Your request has been received. We will contact you shortly.",
        modalCloseBtn: "Close",
        detailsPriceLabel: "Price:",
        detailsCalcBtn: "Go to Calculator",
        currency: "UZS",
        days: "days",
        contactTitle: "Contact",
        contactEmailLabel: "Email",
        contactTelegramLabel: "Telegram",
        contactPhoneLabel: "Phone",
        contactLocationLabel: "Location",
        contactNameLabel: "Your Name",
        contactNamePlaceholder: "Your Name",
        contactEmailFormLabel: "Your Email",
        contactEmailPlaceholder: "Your Email",
        contactSubjectLabel: "Subject",
        contactSubjectPlaceholder: "Message Subject",
        contactMessageLabel: "Your Message",
        contactMessagePlaceholder: "Write your message here...",
        contactSubmitBtn: "Send Message",
        contactSuccessMsg: "Message sent successfully! 🎉",
        navLogoText: "Project",
        heroName: "Sodiqov Usmonjon",
        contactEmailVal: "usmonjonsadikov9@gmail.com",
        contactTelegramVal: "@Usmonjon_2013",
        contactPhoneVal: "+998 97 937 01 23"
    },
    ru: {
        heroGreeting: "Привет, я",
        heroDescription: "Создаю современные веб-приложения, решения на базе ИИ и корпоративное ПО с чистой архитектурой и исключительным пользовательским опытом.",
        heroBtnProjects: "Смотреть проекты",
        heroBtnContact: "Связаться со мной",
        heroBtnCV: "Скачать резюме",
        heroRoles: ["Full Stack Разработчик", "AI Инженер", "Инженер-программист", "Специалист по решениям", "Техно-энтузиаст"],

        navHome: "Главная",
        navAbout: "Обо мне",
        navProjects: "Проекты",
        navServices: "Услуги",
        navContact: "Контакты",
        navCalcBtn: "Рассчитать",
        navDiscussBtn: "Обсудить проект",
        aboutTitle: "Обо мне",
        aboutText: "<p>Я инженер-программист, страстно желающий создавать системы корпоративного уровня, масштабируемые веб-приложения и решения с интеграцией ИИ, которые решают реальные бизнес-задачи.</p><p>В качестве члена команды Zenity Developer Team я проектирую и разрабатываю продукты полного стека — от ERP-систем, управляющих всеми бизнес-операциями, до современных SaaS-платформ. Мое основное внимание всегда сосредоточено на чистой архитектуре, эффективности работы и отличном пользовательском опыте.</p><p>Я верю в то, что программное обеспечение должно быть невидимым — мощным внутри, простым в использовании снаружи. Каждая написанная мной строка кода направлена на обеспечение истинной ценности, а не просто на выполнение требований.</p>",
        servicesTitle: "Мои услуги",
        projectsTitle: "Мои проекты",
        project1Title: "Система управления топливом на АЗС",
        project1Desc: "Универсальная платформа на базе опыта более 10 АЗС. Отслеживание минимумов объемов топлива и газа, управление тарифами и колонками, автоматические оповещения при критических уровнях.",
        project2Title: "Автоматизированная CRM-система для магазина",
        project2Desc: "CRM с отдельными интерфейсами для админов и кассиров. Автоматический контроль остатков, учет долгов и кредитов, анализ доходов/расходов за день и мгновенная отчетность через Telegram-бота.",
        btnDemo: "Подробнее",
        calcTitle: "Рассчитать стоимость",
        calcTotalText: "Примерная стоимость:",
        calcDaysText: "Примерный срок:",
        calcOrderBtn: "Заказать этот проект",
        modalOrderTitle: "Сделать заказ",
        modalOrderDesc: "Оставьте свои данные, и мы свяжемся с вами в ближайшее время.",
        modalNameLabel: "Ваше имя *",
        modalContactLabel: "Телефон или Telegram username *",
        modalPriceLabel: "Ожидаемая цена:",
        modalServicesLabel: "Услуги:",
        modalSubmitBtn: "Отправить",
        modalSuccessTitle: "Спасибо! 🎉",
        modalSuccessDesc: "Ваш запрос принят. Мы свяжемся с вами в ближайшее время.",
        modalCloseBtn: "Закрыть",
        detailsPriceLabel: "Цена:",
        detailsCalcBtn: "Перейти к расчету",
        currency: "сум",
        days: "дней",
        contactTitle: "Контакты",
        contactEmailLabel: "Email",
        contactTelegramLabel: "Telegram",
        contactPhoneLabel: "Телефон",
        contactLocationLabel: "Локация",
        contactNameLabel: "Ваше Имя",
        contactNamePlaceholder: "Введите ваше имя",
        contactEmailFormLabel: "Ваш Email",
        contactEmailPlaceholder: "Введите ваш email",
        contactSubjectLabel: "Тема",
        contactSubjectPlaceholder: "Тема сообщения",
        contactMessageLabel: "Ваше сообщение",
        contactMessagePlaceholder: "Напишите ваше сообщение...",
        contactSubmitBtn: "Отправить сообщение",
        contactSuccessMsg: "Сообщение успешно отправлено! 🎉",
        navLogoText: "Проект",
        heroName: "Содиков Усмонжон",
        contactEmailVal: "usmonjonsadikov9@gmail.com",
        contactTelegramVal: "@Usmonjon_2013",
        contactPhoneVal: "+998 97 937 01 23"
    }
};

// DOM elementlar
const calcForm = document.getElementById('calc-form');
const totalPriceEl = document.getElementById('total-price');
const totalDaysEl = document.getElementById('total-days');
const orderModal = document.getElementById('order-modal');
const detailsModal = document.getElementById('details-modal');
const orderForm = document.getElementById('order-form');

let lenis; // Smooth scroll instance

// Keshdan darhol yuklash (Miltillashni oldini olish uchun sinxron ravishda ishlaydi)
try {
    const cached = localStorage.getItem('site_content_cache');
    if (cached) {
        dynamicTranslations = JSON.parse(cached);
        // DOM to'liq yuklanmasdan oldin faqatgina preloader matnini yangilaymiz
        const loaderText = document.querySelector('.loader-logo');
        if (loaderText) {
            const staticTexts = staticTranslations[currentLang] || {};
            const dynTexts = dynamicTranslations[currentLang] || {};
            const texts = { ...staticTexts, ...dynTexts };
            if (texts['navLogoText']) {
                loaderText.innerHTML = texts['navLogoText'];
            }
        }
    }
} catch(e) {}

// Loyihani ishga tushirish
async function initApp() {
    try {
        initLenis();
        initCustomCursor();
        
        // Keshlangan ma'lumotlarni darhol yuklab, ekranga chiqarish (Miltillashni yo'qotish uchun)
        const cached = localStorage.getItem('site_content_cache');
        if (cached) {
            try {
                dynamicTranslations = JSON.parse(cached);
                updateLanguage(currentLang);
            } catch(e) {}
        }

        // Load configs
        const response = await fetch('data/config.json');
        rawConfigData = await response.json();
        
        // Supabase-dan sayt ma'lumotlarini yuklash
        try {
            const res = await fetch('/api/config');
            const config = await res.json();
            const supabase = window.supabase.createClient(config.supabaseUrl, config.supabaseKey);
            
            const { data, error } = await supabase.from('site_content').select('*').eq('id', 1).single();
            if (data && data.config_data) {
                dynamicTranslations = data.config_data;
                localStorage.setItem('site_content_cache', JSON.stringify(dynamicTranslations));
                console.log("Supabase'dan ma'lumotlar yuklandi:", dynamicTranslations);
            }
        } catch(e) {
            console.error("Supabase site_content yuklashda xato:", e);
        }
        
        updateLanguage(currentLang);
        removeLoader();
        
        // Agar admin rejimida bo'lsak admin-editor.js ni ulash
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('admin') === 'true') {
            const script = document.createElement('script');
            script.src = 'js/admin-editor-v2.js';
            document.body.appendChild(script);
            
            // Xabarlarni qabul qilish (masalan updateTranslation)
            window.addEventListener('message', (event) => {
                // Biz faqat yuborilgan translation o'zgarishlarini eshitib qo'yishimiz mumkin
                // O'zgarishlar admin.js (ota oyna) da saqlanadi
            });
        }

    } catch (error) {
        console.error("Config ma'lumotlarini yuklashda xatolik:", error);
    }
}

function updateLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    
    const staticTexts = staticTranslations[lang] || {};
    const dynTexts = (dynamicTranslations && dynamicTranslations[lang]) ? dynamicTranslations[lang] : {};
    
    // Eski versiya bilan moslik (agar bazada alohida P1, P2, P3 bo'lsa)
    if (!dynTexts.aboutText && (dynTexts.aboutP1 || dynTexts.aboutP2 || dynTexts.aboutP3)) {
        dynTexts.aboutText = `<p>${dynTexts.aboutP1 || staticTexts.aboutP1 || ''}</p><p>${dynTexts.aboutP2 || staticTexts.aboutP2 || ''}</p><p>${dynTexts.aboutP3 || staticTexts.aboutP3 || ''}</p>`;
    }

    // Ikkalasini birlashtiramiz (dinamik ustun turadi)
    const texts = { ...staticTexts, ...dynTexts };
    
    if (Object.keys(texts).length > 0) {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (texts[key]) {
                // Agar input bo'lsa placeholder, bo'lmasa HTML (br taglari ishlashi uchun)
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = texts[key];
                } else {
                    el.innerHTML = texts[key];
                    
                    // Agar havola (A) bo'lsa va bu kontaktlar bo'lsa, ularning href-larini ham yangilaymiz
                    if (el.tagName === 'A') {
                        if (key === 'contactEmailVal') {
                            el.href = `mailto:${texts[key].trim()}`;
                        } else if (key === 'contactTelegramVal') {
                            let val = texts[key].trim();
                            if(val.startsWith('@')) val = val.substring(1);
                            el.href = `https://t.me/${val}`;
                        } else if (key === 'contactPhoneVal') {
                            let val = texts[key].replace(/[^0-9+]/g, '');
                            el.href = `tel:${val}`;
                        }
                    }
                }
            }
        });
    }

    // Supabase dan kelgan dinamik elementlar uchun (projects)
    document.querySelectorAll('.dynamic-text').forEach(el => {
        const text = el.getAttribute(`data-${lang}`);
        if (text) el.innerText = text;
    });

    document.querySelectorAll('.lang-btn').forEach(btn => {
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    const configData = rawConfigData[lang];
    if (configData) {
        renderPortfolio(configData.portfolio);
        renderCalculator(configData.calculator);
    }
    
    calculateTotal();
    initTypingEffect(texts.heroRoles);
    
    if(window.animationsInitialized) {
        attachInteractionEffects();
        ScrollTrigger.refresh();
    }
}

// Typing Effect
function initTypingEffect(roles) {
    const textEl = document.getElementById('typing-text');
    if (!textEl) return;
    
    if (typingInterval) clearInterval(typingInterval);
    if (typingTimeout) clearTimeout(typingTimeout);

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function type() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            textEl.innerText = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            textEl.innerText = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let typeSpeed = isDeleting ? 40 : 100;
        
        if (!isDeleting && charIndex === currentRole.length) {
            typeSpeed = 2000; // Pause at the end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 500; // Pause before typing next
        }
        
        typingTimeout = setTimeout(type, typeSpeed);
    }
    
    textEl.innerText = "";
    type();
}


function renderPortfolio(portfolioData) {
    const grid = document.getElementById('portfolio-grid');
    grid.innerHTML = '';
    
    portfolioData.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card glass-container tilt-card';
        
        const featuresHtml = item.features.map(f => `<li>${f}</li>`).join('');
        
        card.innerHTML = `
            <div class="tilt-card-content">
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <ul class="card-features">
                    ${featuresHtml}
                </ul>
                <div class="card-price">${staticTranslations[currentLang].detailsPriceLabel} ${item.priceEstimate}</div>
                <div class="card-actions">
                    <button class="btn btn-secondary magnetic-btn" onclick="openDetailsModal('${item.id}')">${item.btnLabel || 'Batafsil'}</button>
                    <button class="btn btn-primary magnetic-btn" onclick="scrollToCalc()">${staticTranslations[currentLang].navCalcBtn}</button>
                </div>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

function renderCalculator(calcData) {
    calcForm.innerHTML = '';
    
    calcData.services.forEach(service => {
        const option = document.createElement('label');
        option.className = 'calc-option magnetic-element';
        
        const isChecked = selectedServices.some(sId => sId === service.id);
        
        option.innerHTML = `
            <input type="checkbox" name="service" value="${service.id}" 
                   data-price="${service.price}" data-days="${service.days}" ${isChecked ? 'checked' : ''}>
            <span>${service.label}</span>
        `;
        
        calcForm.appendChild(option);
    });
    
    calcForm.addEventListener('change', calculateTotal);
}

// Kalkulyator mantig'i
function calculateTotal() {
    if (!rawConfigData) return;
    
    currentTotalPrice = 0;
    currentTotalDays = 0;
    selectedServices = []; 
    let selectedLabels = [];
    
    const checkboxes = calcForm.querySelectorAll('input[type="checkbox"]:checked');
    const calcData = rawConfigData[currentLang].calculator;
    
    checkboxes.forEach(cb => {
        currentTotalPrice += parseInt(cb.dataset.price);
        currentTotalDays += parseInt(cb.dataset.days);
        selectedServices.push(cb.value);
        
        const serviceData = calcData.services.find(s => s.id === cb.value);
        if (serviceData) {
            selectedLabels.push(serviceData.label);
        }
    });
    
    const currencyStr = staticTranslations[currentLang].currency;
    const daysStr = staticTranslations[currentLang].days;
    
    totalPriceEl.innerText = formatNumber(currentTotalPrice) + " " + currencyStr;
    totalDaysEl.innerText = currentTotalDays + " " + daysStr;
    
    document.getElementById('modal-price-display').innerText = formatNumber(currentTotalPrice) + " " + currencyStr;
    document.getElementById('modal-services-display').innerText = selectedLabels.length > 0 ? selectedLabels.join(', ') : "-";
}

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

// Navigatsiya
function scrollToCalc() {
    if(lenis) {
        lenis.scrollTo('#calculator', { offset: -80 });
    } else {
        document.getElementById('calculator').scrollIntoView({ behavior: 'smooth' });
    }
}
function scrollToPortfolio() {
    if(lenis) lenis.scrollTo('#portfolio', { offset: -80 });
}
function scrollToContact() {
    if(lenis) lenis.scrollTo('#contact', { offset: -80 });
}


// Modallar bilan ishlash
function openOrderModal(fromCalculator = false) {
    const modalCalcInfo = document.getElementById('modal-calc-info');
    
    if (fromCalculator && currentTotalPrice > 0) {
        modalCalcInfo.style.display = 'block';
    } else {
        modalCalcInfo.style.display = 'none';
        if(!fromCalculator) {
            calcForm.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
            calculateTotal();
        }
    }
    
    orderModal.classList.add('active');
    document.getElementById('success-message').style.display = 'none';
    orderForm.style.display = 'block';
}

function closeOrderModal() {
    orderModal.classList.remove('active');
    orderForm.reset();
}

function openDetailsModal(id) {
    const item = rawConfigData[currentLang].portfolio.find(p => p.id === id);
    if (!item) return;
    
    document.getElementById('details-title').innerText = item.title;
    document.getElementById('details-desc').innerText = item.description;
    
    const featuresHtml = item.features.map(f => `<li>${f}</li>`).join('');
    document.getElementById('details-features').innerHTML = featuresHtml;
    
    document.getElementById('details-price').innerText = item.priceEstimate;
    
    detailsModal.classList.add('active');
}

function closeDetailsModal() {
    detailsModal.classList.remove('active');
}

// Formani jo'natish
orderForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submit-btn');
    const originalBtnText = submitBtn.innerText;
    
    const name = document.getElementById('userName').value.trim();
    const contact = document.getElementById('userContact').value.trim();
    
    if (!name || !contact) return;
    
    submitBtn.innerText = "...";
    submitBtn.disabled = true;
    
    const currencyStr = staticTranslations[currentLang].currency;
    let selectedLabels = [];
    selectedServices.forEach(sId => {
        const serviceData = rawConfigData[currentLang].calculator.services.find(s => s.id === sId);
        if (serviceData) selectedLabels.push(serviceData.label);
    });

    try {
        const response = await fetch('/api/order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name,
                contact,
                price: currentTotalPrice > 0 ? formatNumber(currentTotalPrice) + " " + currencyStr : "Kelishuv asosida",
                services: selectedLabels
            })
        });
        
        await response.json();
        
        orderForm.style.display = 'none';
        document.getElementById('success-message').style.display = 'block';
        
    } catch (error) {
        console.error("So'rov yuborishda xatolik:", error);
        orderForm.style.display = 'none';
        document.getElementById('success-message').style.display = 'block';
    } finally {
        submitBtn.innerText = originalBtnText;
        submitBtn.disabled = false;
    }
});

// Kontakt formani jo'natish
document.getElementById('contact-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = document.getElementById('contact-submit-btn');
    const originalBtnText = submitBtn.innerText;
    
    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const subject = document.getElementById('contactSubject').value.trim();
    const message = document.getElementById('contactMessage').value.trim();
    
    submitBtn.innerText = "...";
    submitBtn.disabled = true;

    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, subject, message })
        });
        
        await response.json();
        
        document.getElementById('contact-form').reset();
        const successMsg = document.getElementById('contact-success-msg');
        successMsg.style.display = 'block';
        setTimeout(() => {
            successMsg.style.display = 'none';
        }, 4000);
        
    } catch (error) {
        console.error("Xabar yuborishda xatolik:", error);
    } finally {
        submitBtn.innerText = staticTranslations[currentLang].contactSubmitBtn || originalBtnText;
        submitBtn.disabled = false;
    }
});

window.addEventListener('click', (e) => {
    if (e.target === orderModal) closeOrderModal();
    if (e.target === detailsModal) closeDetailsModal();
});

function toggleMobileMenu() {
    document.getElementById('nav-menu').classList.toggle('active');
    document.getElementById('hamburger').classList.toggle('active');
}

function closeMobileMenu() {
    document.getElementById('nav-menu').classList.remove('active');
    document.getElementById('hamburger').classList.remove('active');
}

// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

if(themeToggle) {
    themeToggle.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        let newTheme = theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    if(themeToggle) {
        themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
}

document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const selectedLang = this.getAttribute('data-lang');
        updateLanguage(selectedLang);
    });
});


/* ==============================================================
   ADVANCED ANIMATIONS (GSAP & Lenis) 
============================================================== */

function initLenis() {
    if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
        });

        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
            lenis.on('scroll', ScrollTrigger.update);
            gsap.ticker.add((time) => {
                lenis.raf(time * 1000);
            });
            gsap.ticker.lagSmoothing(0, 0);
        } else {
            function raf(time) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);
        }
    }
}

// Initialize Custom Cursor
function initCustomCursor() {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    if (cursorDot && cursorOutline && window.matchMedia("(pointer: fine)").matches) {
        gsap.set(cursorDot, { xPercent: -50, yPercent: -50 });
        gsap.set(cursorOutline, { xPercent: -50, yPercent: -50 });

        const setDotX = gsap.quickSetter(cursorDot, "x", "px");
        const setDotY = gsap.quickSetter(cursorDot, "y", "px");
        const setOutlineX = gsap.quickSetter(cursorOutline, "x", "px");
        const setOutlineY = gsap.quickSetter(cursorOutline, "y", "px");
        
        let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        let outline = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            
            setDotX(mouse.x);
            setDotY(mouse.y);
        });
        
        gsap.ticker.add(() => {
            const dt = 1.0 - Math.pow(1.0 - 0.15, gsap.ticker.deltaRatio());
            outline.x += (mouse.x - outline.x) * dt;
            outline.y += (mouse.y - outline.y) * dt;
            
            setOutlineX(outline.x);
            setOutlineY(outline.y);
        });
        
        attachCursorHoverEffects();
    }
}

function attachCursorHoverEffects() {
    const interactiveElements = document.querySelectorAll('a, button, input, .card, .calc-option, .social-btn');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
}

function removeLoader() {
    const loader = document.getElementById('loader');
    if (loader && typeof gsap !== 'undefined') {
        gsap.to(loader, {
            opacity: 0,
            duration: 0.8,
            delay: 1.5,
            ease: "power2.inOut",
            onComplete: () => {
                loader.style.display = 'none';
                initGSAPAnimations();
            }
        });
    } else if (loader) {
        loader.style.display = 'none';
        initGSAPAnimations();
    } else {
        initGSAPAnimations();
    }
}

function attachInteractionEffects() {
    if (typeof gsap === 'undefined' || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    
    // Magnetic Buttons
    const magneticElements = document.querySelectorAll('.btn, .social-btn, .lang-btn, .theme-toggle, .nav-link');
    magneticElements.forEach((btn) => {
        const isMagnetic = btn.getAttribute('data-magnetic');
        if(isMagnetic) return;
        btn.setAttribute('data-magnetic', 'true');
        
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
            const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
            
            gsap.to(btn, { x: x, y: y, duration: 0.4, ease: "power2.out" });
        });
        
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.3)" });
        });
    });
    
    // 3D Tilt Cards
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(card => {
        const isTilt = card.getAttribute('data-tilt');
        if(isTilt) return;
        card.setAttribute('data-tilt', 'true');
        
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;
            
            gsap.to(card, {
                rotateX: rotateX,
                rotateY: rotateY,
                transformPerspective: 1000,
                ease: "power2.out",
                duration: 0.4
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, { rotateX: 0, rotateY: 0, ease: "power3.out", duration: 0.6 });
        });
    });

    attachCursorHoverEffects();
}

async function initGSAPAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    
    window.animationsInitialized = true;
    
    let lastScrollY = window.scrollY;
    const navbar = document.querySelector('.navbar');
    
    lenis.on('scroll', (e) => {
        if (e.scrollY > 50) {
            navbar.style.background = 'var(--glass-panel)';
            navbar.style.backdropFilter = 'blur(15px)';
        } else {
            navbar.style.background = 'transparent';
            navbar.style.backdropFilter = 'none';
        }
        
        if (e.scrollY > lastScrollY && e.scrollY > 150) {
            gsap.to(navbar, { yPercent: -100, duration: 0.3, ease: "power2.out" });
        } else {
            gsap.to(navbar, { yPercent: 0, duration: 0.3, ease: "power2.out" });
        }
        lastScrollY = e.scrollY;
    });

    // Staggered reveal for Hero left elements
    gsap.from(".animate-fade-up", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out"
    });

    // Reveal for Avatar
    gsap.from(".hero-avatar", {
        scale: 0.8,
        opacity: 0,
        duration: 1,
        ease: "elastic.out(1, 0.5)",
        delay: 0.4
    });

    // Reveal floating icons with pop
    gsap.from(".floating-icon", {
        scale: 0,
        opacity: 0,
        duration: 0.6,
        stagger: 0.2,
        ease: "back.out(1.7)",
        delay: 0.8
    });

    // Parallax background orbs & floating icons
    document.addEventListener("mousemove", (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        
        gsap.to(".orb-1", { x: x * 2, y: y * 2, duration: 1, ease: "power2.out" });
        gsap.to(".orb-2", { x: -x * 2, y: -y * 2, duration: 1, ease: "power2.out" });
        
        gsap.to(".icon-1", { x: -x * 1.5, y: -y * 1.5, duration: 1.5, ease: "power2.out" });
        gsap.to(".icon-2", { x: -x * 0.8, y: y * 1.2, duration: 1.5, ease: "power2.out" });
        gsap.to(".icon-3", { x: x * 1.2, y: -y * 0.8, duration: 1.5, ease: "power2.out" });
    });

    // Floating animation for icons (up and down)
    gsap.to(".icon-1", { y: "+=15", duration: 2, yoyo: true, repeat: -1, ease: "sine.inOut" });
    gsap.to(".icon-2", { y: "-=10", duration: 2.5, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 0.5 });
    gsap.to(".icon-3", { y: "+=12", duration: 2.2, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 1 });

    gsap.fromTo(".about-content p", 
        { y: 40, opacity: 0 },
        { scrollTrigger: { trigger: ".about-content", start: "top 80%" }, y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power3.out" }
    );
    
    gsap.fromTo(".portfolio .card", 
        { y: 60, opacity: 0, scale: 0.95 },
        { scrollTrigger: { trigger: ".portfolio", start: "top 75%" }, y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.15, ease: "power3.out" }
    );

    gsap.fromTo(".calc-option", 
        { y: 30, opacity: 0 },
        { scrollTrigger: { trigger: ".calc-grid", start: "top 80%" }, y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" }
    );
    
    gsap.fromTo(".contact-card", 
        { x: -50, opacity: 0 },
        { scrollTrigger: { trigger: ".contact-section", start: "top 80%" }, x: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" }
    );

    gsap.fromTo(".contact-form-container", 
        { x: 50, opacity: 0 },
        { scrollTrigger: { trigger: ".contact-section", start: "top 80%" }, x: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
    );
    
    attachInteractionEffects();
    
    // DB dan loyihalarni yuklash
    await loadProjectsFromDB();
}

async function loadProjectsFromDB() {
    try {
        const res = await fetch('/api/config');
        const config = await res.json();
        const supabase = window.supabase.createClient(config.supabaseUrl, config.supabaseKey);
        
        const { data, error } = await supabase.from('projects').select('*').order('id', { ascending: false });
        if (error) throw error;

        const grid = document.getElementById('projects-grid');
        if (!grid) return;
        
        grid.innerHTML = '';

        data.forEach(p => {
            const tagsHtml = p.tags.split(',').map(tag => `<span class="badge">${tag.trim()}</span>`).join('');
            
            const card = document.createElement('div');
            card.className = 'card glass-container project-card tilt-card';
            card.dataset.id = p.id;
            
            card.innerHTML = `
                <div class="tilt-card-content" style="display: flex; flex-direction: column; height: 100%;">
                    <h3 class="project-title dynamic-text" data-uz="${p.title_uz}" data-en="${p.title_en}" data-ru="${p.title_ru}">
                        ${p[`title_${currentLang}`] || p.title_uz}
                    </h3>
                    <p class="project-desc dynamic-text" data-uz="${p.desc_uz}" data-en="${p.desc_en}" data-ru="${p.desc_ru}">
                        ${p[`desc_${currentLang}`] || p.desc_uz}
                    </p>
                    <div class="project-tags">
                        ${tagsHtml}
                    </div>
                    <div class="card-actions" style="margin-top: auto;">
                        ${p.demo_url ? `<a href="${p.demo_url}" target="_blank" class="btn btn-outline magnetic-btn" data-i18n="btnDemo" style="width: 100%; text-align: center; display: block;">${staticTranslations[currentLang].btnDemo}</a>` : `<button class="btn btn-outline magnetic-btn" data-i18n="btnDemo" style="width: 100%;">${staticTranslations[currentLang].btnDemo}</button>`}
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });
        
        if (window.gsap && window.ScrollTrigger) {
            gsap.fromTo(".project-card", 
                { y: 60, opacity: 0, scale: 0.95 },
                { scrollTrigger: { trigger: ".projects-section", start: "top 75%" }, y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.15, ease: "power3.out" }
            );
        }

    } catch (e) {
        console.error("Loyihalarni yuklashda xatolik:", e);
    }
}

document.addEventListener('DOMContentLoaded', initApp);
