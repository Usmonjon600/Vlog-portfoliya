let supabase = null;
let editingProjectId = null;

window.currentPin = '';

window.handleInput = function(val) {
    if (window.currentPin.length < 4) {
        window.currentPin += val;
        window.updateDots();
        
        // Visual feedback
        const btn = Array.from(document.querySelectorAll('.num-btn')).find(b => b.dataset.val === val);
        if(btn) {
            btn.style.background = '#374151';
            setTimeout(() => btn.style.background = '', 150);
        }

        if (window.currentPin.length === 4) {
            window.submitPin();
        }
    }
};

window.handleBackspace = function() {
    if (window.currentPin.length > 0) {
        window.currentPin = window.currentPin.slice(0, -1);
        window.updateDots();
        
        const backspaceBtn = document.getElementById('btn-backspace');
        if (backspaceBtn) {
            backspaceBtn.style.background = '#374151';
            setTimeout(() => backspaceBtn.style.background = '', 150);
        }
    }
};

window.updateDots = function() {
    const dots = document.querySelectorAll('.dot');
    if (dots.length > 0) {
        dots.forEach((dot, index) => {
            if (index < window.currentPin.length) {
                dot.classList.add('filled');
            } else {
                dot.classList.remove('filled');
                dot.classList.remove('error');
            }
        });
    }
};

(async () => {
    console.log("Admin.js loaded and executing!");

    // Mouse Clicks
    const numBtns = document.querySelectorAll('.num-btn[data-val]');
    if (numBtns.length > 0) {
        numBtns.forEach(btn => {
            btn.onclick = () => window.handleInput(btn.dataset.val);
        });
    }

    const backspaceBtn = document.getElementById('btn-backspace');
    if (backspaceBtn) {
        backspaceBtn.onclick = window.handleBackspace;
    }

    // Physical Keyboard
    document.addEventListener('keydown', (e) => {
        if (/^[0-9]$/.test(e.key)) {
            window.handleInput(e.key);
        } else if (e.key === 'Backspace') {
            window.handleBackspace();
        }
    });

    // Check Auth AFTER binding listeners
    const token = localStorage.getItem('adminToken');
    if (!token) {
        document.getElementById('login-screen').style.display = 'flex';
    } else {
        try {
            document.getElementById('login-screen').style.display = 'none';
            await initDashboard();
        } catch (err) {
            console.error("Dashboard init error:", err);
            localStorage.removeItem('adminToken');
            document.getElementById('login-screen').style.display = 'flex';
        }
    }

    window.submitPin = async function() {
        const password = window.currentPin;
        
        // Disable buttons
        document.querySelectorAll('.num-btn').forEach(b => b.style.pointerEvents = 'none');
        
        let loginSuccess = false;
        
        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });
            const data = await res.json();
            
            if (data.success) {
                loginSuccess = true;
                localStorage.setItem('adminToken', data.token);
                document.getElementById('login-screen').style.display = 'none';
            } else {
                showPinError();
            }
        } catch(e) {
            console.error("Login fetch error:", e);
            showPinError();
        } finally {
            document.querySelectorAll('.num-btn').forEach(b => b.style.pointerEvents = 'auto');
        }
        
        // Load dashboard outside the PIN try/catch so errors don't trigger showPinError
        if (loginSuccess) {
            try {
                await initDashboard();
            } catch (err) {
                console.error("Dashboard init error:", err);
            }
        }
    };

    function showPinError() {
        const card = document.querySelector('.login-card') || document.querySelector('.delta-dark-card');
        const errorMsg = document.getElementById('login-error');
        
        const dots = document.querySelectorAll('.dot');
        dots.forEach(dot => {
            dot.classList.add('error');
        });
        errorMsg.classList.add('show');
        if (card) card.classList.add('shake');
        
        if (card) setTimeout(() => card.classList.remove('shake'), 500);
        
        setTimeout(() => {
            window.currentPin = '';
            window.updateDots();
            errorMsg.classList.remove('show');
        }, 1500);
    }

    // Chiqish
    document.getElementById('logout-btn').addEventListener('click', function logout() {
        localStorage.removeItem('adminToken');
        window.location.reload();
    });

})();

// Barcha o'zgarishlarni o'zida saqlaydigan obyekt
let modifiedContent = {};
let dynamicTranslations = null; // Supabase-dan olingan eski ma'lumotlar

async function initDashboard() {
    document.getElementById('dashboard-screen').style.display = 'flex';
    
    // Iframe src ni sozlash
    const iframe = document.getElementById('live-preview');
    iframe.src = '/?admin=true'; // Admin rejimida ochiladi

    // Xabarlarni qabul qilish
    window.addEventListener('message', (event) => {
        if (event.data && event.data.source === 'live-editor') {
            const { action, data } = event.data;
            
            if (action === 'ready') {
                console.log("Iframe ichidagi Live Editor tayyor!");
            }
            
            if (action === 'updateTranslation') {
                const { lang, key, value } = data;
                if (!modifiedContent[lang]) modifiedContent[lang] = {};
                modifiedContent[lang][key] = value;
                console.log("O'zgarish saqlandi:", modifiedContent);
            }
            
            // Loyiha qo'shish/tahrirlash modalini ochish
            if (action === 'openProjectModal') {
                if (data.id) {
                    editProject(data.id);
                } else {
                    editingProjectId = null;
                    document.getElementById('project-modal-title').innerText = "Yangi Loyiha Qo'shish";
                    clearProjectForm();
                    document.getElementById('project-modal').style.display = 'flex';
                }
            }
            
            // Loyihani o'chirish
            if (action === 'deleteProject') {
                deleteProject(data.id);
            }
        }
    });

    // Saqlash tugmasi
    document.getElementById('save-live-btn').addEventListener('click', async () => {
        try {
            document.getElementById('save-live-btn').innerText = 'Saqlanmoqda...';
            
            // Eski ma'lumotlar bilan yangilarini birlashtiramiz
            const mergedContent = { ...(dynamicTranslations || {}) };
            
            for (const lang in modifiedContent) {
                if (!mergedContent[lang]) mergedContent[lang] = {};
                mergedContent[lang] = { ...mergedContent[lang], ...modifiedContent[lang] };
            }
            
            // Serverga yuborish
            const token = localStorage.getItem('adminToken');
            const res = await fetch('/api/save-content', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ config_data: mergedContent })
            });
            
            const resultData = await res.json();
            if (resultData.success) {
                alert("O'zgarishlar muvaffaqiyatli saqlandi! 🎉");
                // Iframe ni yangilash
                iframe.src = iframe.src;
                modifiedContent = {}; // O'zgarishlarni tozalash
            } else {
                alert("Xatolik: " + resultData.message);
            }
        } catch (e) {
            console.error(e);
            alert("Saqlashda xatolik yuz berdi.");
        } finally {
            document.getElementById('save-live-btn').innerText = '💾 Saqlash';
        }
    });
    
    // Project Modal saqlash tugmasi
    document.getElementById('save-project-btn').addEventListener('click', saveProject);

    // Boshlang'ich datalarni olish
    try {
        const res = await fetch('/api/config');
        const config = await res.json();
        // Supabase ni global qilish
        window.supabaseClient = window.supabase.createClient(config.supabaseUrl, config.supabaseKey);
        
        const { data, error } = await window.supabaseClient.from('site_content').select('*').eq('id', 1).single();
        if (data && data.config_data) {
            dynamicTranslations = data.config_data;
        }
    } catch(e) {
        console.error(e);
    }
}

function clearProjectForm() {
    document.getElementById('p_title_uz').value = '';
    document.getElementById('p_desc_uz').value = '';
    document.getElementById('p_title_en').value = '';
    document.getElementById('p_desc_en').value = '';
    document.getElementById('p_title_ru').value = '';
    document.getElementById('p_desc_ru').value = '';
    document.getElementById('p_tags').value = '';
    document.getElementById('p_demo').value = '';
}

async function editProject(id) {
    const { data, error } = await window.supabaseClient.from('projects').select('*').eq('id', id).single();
    if (data) {
        editingProjectId = id;
        document.getElementById('project-modal-title').innerText = "Loyihani Tahrirlash";
        
        document.getElementById('p_title_uz').value = data.title_uz;
        document.getElementById('p_desc_uz').value = data.desc_uz;
        document.getElementById('p_title_en').value = data.title_en;
        document.getElementById('p_desc_en').value = data.desc_en;
        document.getElementById('p_title_ru').value = data.title_ru;
        document.getElementById('p_desc_ru').value = data.desc_ru;
        document.getElementById('p_tags').value = data.tags;
        document.getElementById('p_demo').value = data.demo_url || '';
        
        document.getElementById('project-modal').style.display = 'flex';
    }
}

async function saveProject() {
    const btn = document.getElementById('save-project-btn');
    btn.innerText = "Kuting...";
    btn.disabled = true;

    const projectData = {
        title_uz: document.getElementById('p_title_uz').value,
        desc_uz: document.getElementById('p_desc_uz').value,
        title_en: document.getElementById('p_title_en').value,
        desc_en: document.getElementById('p_desc_en').value,
        title_ru: document.getElementById('p_title_ru').value,
        desc_ru: document.getElementById('p_desc_ru').value,
        tags: document.getElementById('p_tags').value,
        demo_url: document.getElementById('p_demo').value
    };

    if (editingProjectId) {
        // Update
        await window.supabaseClient.from('projects').update(projectData).eq('id', editingProjectId);
    } else {
        // Insert
        await window.supabaseClient.from('projects').insert([projectData]);
    }
    
    document.getElementById('project-modal').style.display = 'none';
    btn.innerText = "Saqlash";
    btn.disabled = false;
    
    // Iframe ni yangilash
    const iframe = document.getElementById('live-preview');
    iframe.src = iframe.src;
}

async function deleteProject(id) {
    if (confirm("Rostdan ham bu loyihani o'chirmoqchimisiz?")) {
        await window.supabaseClient.from('projects').delete().eq('id', id);
        // Iframe ni yangilash
        const iframe = document.getElementById('live-preview');
        iframe.src = iframe.src;
    }
}
