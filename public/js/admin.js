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

    // Logout
    document.getElementById('logout-btn').addEventListener('click', function logout() {
        localStorage.removeItem('adminToken');
        window.location.reload();
    });

    // Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if(e.target.id === 'logout-btn') return;
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
            
            e.target.classList.add('active');
            document.getElementById(e.target.dataset.target).style.display = 'block';
        });
    });

    // Project Modal
    document.getElementById('add-project-btn').addEventListener('click', () => {
        editingProjectId = null;
        document.getElementById('project-modal-title').innerText = "Loyiha Qo'shish";
        clearProjectForm();
        document.getElementById('project-modal').style.display = 'flex';
    });

    document.getElementById('save-project-btn').addEventListener('click', saveProject);
})();

async function initDashboard() {
    document.getElementById('dashboard-screen').style.display = 'block';
    
    // Fetch Supabase Config
    const res = await fetch('/api/config');
    const config = await res.json();
    
    // Init Supabase
    supabase = window.supabase.createClient(config.supabaseUrl, config.supabaseKey);
    
    // Load Data
    await loadProjects();
}

async function loadProjects() {
    const { data, error } = await supabase.from('projects').select('*').order('id', { ascending: false });
    if (error) {
        console.error("Xatolik:", error);
        return;
    }
    
    const tbody = document.getElementById('projects-tbody');
    tbody.innerHTML = '';
    
    data.forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${p.id}</td>
            <td>${p.title_uz}</td>
            <td>${p.tags}</td>
            <td>
                <button class="action-btn edit" onclick="editProject(${p.id})">Tahrirlash</button>
                <button class="action-btn delete" onclick="deleteProject(${p.id})">O'chirish</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function clearProjectForm() {
    document.getElementById('p_title_uz').value = '';
    document.getElementById('p_desc_uz').value = '';
    document.getElementById('p_title_en').value = '';
    document.getElementById('p_desc_en').value = '';
    document.getElementById('p_title_ru').value = '';
    document.getElementById('p_desc_ru').value = '';
    document.getElementById('p_tags').value = '';
}

async function saveProject() {
    const projectData = {
        title_uz: document.getElementById('p_title_uz').value,
        desc_uz: document.getElementById('p_desc_uz').value,
        title_en: document.getElementById('p_title_en').value,
        desc_en: document.getElementById('p_desc_en').value,
        title_ru: document.getElementById('p_title_ru').value,
        desc_ru: document.getElementById('p_desc_ru').value,
        tags: document.getElementById('p_tags').value
    };

    if (editingProjectId) {
        // Update
        await supabase.from('projects').update(projectData).eq('id', editingProjectId);
    } else {
        // Insert
        await supabase.from('projects').insert([projectData]);
    }
    
    document.getElementById('project-modal').style.display = 'none';
    await loadProjects();
}

async function editProject(id) {
    const { data, error } = await supabase.from('projects').select('*').eq('id', id).single();
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
        
        document.getElementById('project-modal').style.display = 'flex';
    }
}

async function deleteProject(id) {
    if (confirm("Rostdan ham bu loyihani o'chirmoqchimisiz?")) {
        await supabase.from('projects').delete().eq('id', id);
        await loadProjects();
    }
}
