let supabase = null;
let editingProjectId = null;

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Check Auth
    const token = localStorage.getItem('adminToken');
    if (!token) {
        document.getElementById('login-screen').style.display = 'flex';
    } else {
        await initDashboard();
    }

    // Login logic - PIN
    const pinBoxes = document.querySelectorAll('.pin-box');
    
    pinBoxes.forEach((box, index) => {
        box.addEventListener('input', (e) => {
            const val = e.target.value;
            // Faqat raqamlar
            if (!/^[0-9]*$/.test(val)) {
                e.target.value = val.replace(/[^0-9]/g, '');
                return;
            }
            if (val.length === 1) {
                e.target.classList.remove('error');
                if (index < pinBoxes.length - 1) {
                    pinBoxes[index + 1].focus();
                } else {
                    submitPin();
                }
            }
        });
        
        box.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
                pinBoxes[index - 1].focus();
                pinBoxes[index - 1].value = '';
            }
        });
    });

    async function submitPin() {
        let password = '';
        pinBoxes.forEach(box => password += box.value);
        if(password.length !== 5) return;
        
        pinBoxes.forEach(box => box.disabled = true);
        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });
            const data = await res.json();
            
            if (data.success) {
                localStorage.setItem('adminToken', data.token);
                document.getElementById('login-screen').style.display = 'none';
                await initDashboard();
            } else {
                showPinError();
            }
        } catch(e) {
            showPinError();
        } finally {
            pinBoxes.forEach(box => box.disabled = false);
        }
    }

    function showPinError() {
        const card = document.querySelector('.login-card');
        const errorMsg = document.getElementById('login-error');
        
        pinBoxes.forEach(box => {
            box.classList.add('error');
            box.value = '';
        });
        errorMsg.classList.add('show');
        card.classList.add('shake');
        
        setTimeout(() => card.classList.remove('shake'), 500);
        setTimeout(() => pinBoxes[0].focus(), 100);
        setTimeout(() => {
            errorMsg.classList.remove('show');
            pinBoxes.forEach(box => box.classList.remove('error'));
        }, 3000);
    }

    // Logout
    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('adminToken');
        location.reload();
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
});

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
