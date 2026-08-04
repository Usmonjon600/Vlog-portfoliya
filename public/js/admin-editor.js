// admin-editor.js - Faqat iframe ichida (?admin=true) ishlaydi

(function() {
    console.log("Admin Editor rejimi faollashdi!");

    // Ota oyna (admin.html) ga xabar yuborish
    function sendToParent(action, data) {
        window.parent.postMessage({ source: 'live-editor', action, data }, '*');
    }

    // CSS qo'shish (Tahrirlash rejimiga mos)
    const style = document.createElement('style');
    style.innerHTML = `
        .editable-content {
            position: relative;
            cursor: pointer;
            outline: 2px dashed transparent;
            transition: outline 0.2s;
            border-radius: 4px;
            padding: 2px 4px;
        }
        .editable-content:hover {
            outline: 2px dashed #0ea5e9;
            background: rgba(14, 165, 233, 0.1);
        }
        .editable-content:focus {
            outline: 2px solid #0ea5e9;
            background: rgba(14, 165, 233, 0.2);
            cursor: text;
        }
        .edit-badge {
            position: absolute;
            top: -10px;
            right: -10px;
            background: #0ea5e9;
            color: #fff;
            font-size: 10px;
            padding: 2px 5px;
            border-radius: 10px;
            opacity: 0;
            transition: opacity 0.2s;
            pointer-events: none;
            z-index: 100;
        }
        .editable-content:hover .edit-badge {
            opacity: 1;
        }
        
        /* Loyihalar uchun Maxsus Hover */
        .project-card {
            position: relative;
            outline: 2px dashed transparent;
        }
        .project-card:hover {
            outline: 2px dashed #a855f7;
        }
        .project-edit-btn, .project-delete-btn {
            position: absolute;
            top: 10px;
            background: #a855f7;
            color: #fff;
            border: none;
            padding: 5px 10px;
            border-radius: 5px;
            cursor: pointer;
            z-index: 10;
            font-size: 12px;
            opacity: 0;
            transition: opacity 0.2s;
        }
        .project-edit-btn { right: 10px; }
        .project-delete-btn { right: 80px; background: #ef4444; }
        .project-card:hover .project-edit-btn,
        .project-card:hover .project-delete-btn {
            opacity: 1;
        }

        .add-new-project-card {
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px dashed #0ea5e9;
            background: rgba(14, 165, 233, 0.05);
            min-height: 200px;
            cursor: pointer;
            transition: all 0.3s;
        }
        .add-new-project-card:hover {
            background: rgba(14, 165, 233, 0.15);
            transform: translateY(-5px);
        }
        .add-new-project-card i {
            font-size: 3rem;
            color: #0ea5e9;
        }
    `;
    document.head.appendChild(style);

    // Kutilayotgan o'zgarishlar (Ota oynaga yuboriladi)
    let modifiedTranslations = {};

    function initTextEditors() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            if (el.classList.contains('editable-content')) return;

            el.classList.add('editable-content');
            el.setAttribute('contenteditable', 'true');
            
            // Edit badge
            const badge = document.createElement('span');
            badge.className = 'edit-badge';
            badge.innerText = '✏️';
            // Disable contenteditable on badge itself
            badge.setAttribute('contenteditable', 'false');
            el.appendChild(badge);

            const key = el.getAttribute('data-i18n');

            el.addEventListener('blur', () => {
                // Remove badge temporarily to get innerText
                const badgeEl = el.querySelector('.edit-badge');
                if(badgeEl) el.removeChild(badgeEl);
                
                let newText = el.innerHTML.trim(); // HTML as string, so <br> tags are preserved if needed
                
                // Re-append badge
                if(badgeEl) el.appendChild(badgeEl);

                const currentLang = localStorage.getItem('lang') || 'uz';
                
                // Update local storage object
                if (!modifiedTranslations[currentLang]) {
                    modifiedTranslations[currentLang] = {};
                }
                modifiedTranslations[currentLang][key] = newText;
                
                // Ota oynaga xabar berish
                sendToParent('updateTranslation', { lang: currentLang, key: key, value: newText });
            });
            
            // Xavfsizlik uchun Enter bosilganda yangi qator ochmaslik (ixtiyoriy)
            el.addEventListener('keydown', (e) => {
                // if (e.key === 'Enter') { e.preventDefault(); }
            });
        });
    }

    // Loyihalarga edit/delete tugmalarini qo'shish
    function initProjectEditors() {
        // Natijalar bo'limi 
        const projectsGrid = document.querySelector('#projects .projects-grid');
        if (!projectsGrid) return;
        
        // Agar add-new card bo'lmasa, qo'shish
        if (!document.querySelector('.add-new-project-card')) {
            const addCard = document.createElement('div');
            addCard.className = 'glass-card project-card add-new-project-card tilt-card';
            addCard.innerHTML = `<div class="tilt-card-content" style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%;">
                <div style="font-size:3rem; color:#0ea5e9; font-weight:bold;">+</div>
                <h3 style="margin-top:15px; color:#fff;">Yangi Loyiha</h3>
            </div>`;
            addCard.onclick = () => {
                sendToParent('openProjectModal', { id: null });
            };
            projectsGrid.appendChild(addCard);
        }

        // Barcha mavjud loyiha kartochkalariga edit tugmasi
        document.querySelectorAll('.project-card:not(.add-new-project-card)').forEach(card => {
            if (card.querySelector('.project-edit-btn')) return;

            const projectId = card.dataset.id;
            
            const editBtn = document.createElement('button');
            editBtn.className = 'project-edit-btn';
            editBtn.innerText = '✏️ Edit';
            editBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                sendToParent('openProjectModal', { id: projectId });
            };
            
            const delBtn = document.createElement('button');
            delBtn.className = 'project-delete-btn';
            delBtn.innerText = '🗑️';
            delBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                sendToParent('deleteProject', { id: projectId });
            };

            card.appendChild(editBtn);
            card.appendChild(delBtn);
        });
    }

    // Xizmatlarga edit/delete tugmalarini qo'shish
    function initServiceEditors() {
        const portfolioGrid = document.querySelector('#portfolio .grid');
        if (!portfolioGrid) return;
        
        // Agar add-new card bo'lmasa, qo'shish
        if (!document.querySelector('.add-new-service-card')) {
            const addCard = document.createElement('div');
            addCard.className = 'card glass-container add-new-service-card tilt-card';
            addCard.innerHTML = `<div class="tilt-card-content" style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; min-height:300px; cursor:pointer;">
                <div style="font-size:3rem; color:#0ea5e9; font-weight:bold;">+</div>
                <h3 style="margin-top:15px; color:#fff;">Yangi Xizmat</h3>
            </div>`;
            addCard.onclick = () => {
                sendToParent('openServiceModal', { id: null });
            };
            portfolioGrid.appendChild(addCard);
        }

        // Barcha mavjud xizmat kartochkalariga edit tugmasi
        document.querySelectorAll('#portfolio .card:not(.add-new-service-card)').forEach((card, index) => {
            if (card.querySelector('.project-edit-btn')) return;

            // Xizmatlar 'id' orqali olinadi, ammo DOM-da u saqlanmayapti.
            // main.js da onclick="openDetailsModal('id')" bor, o'shandan ID ni sug'urib olamiz.
            const btn = card.querySelector('button[onclick^="openDetailsModal"]');
            if (!btn) return;
            const match = btn.getAttribute('onclick').match(/'([^']+)'/);
            const serviceId = match ? match[1] : null;
            if (!serviceId) return;
            
            card.style.position = 'relative';
            
            const editBtn = document.createElement('button');
            editBtn.className = 'project-edit-btn';
            editBtn.innerText = '✏️ Edit';
            editBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                sendToParent('openServiceModal', { id: serviceId });
            };
            
            const delBtn = document.createElement('button');
            delBtn.className = 'project-delete-btn';
            delBtn.innerText = '🗑️';
            delBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                sendToParent('deleteService', { id: serviceId });
            };

            card.appendChild(editBtn);
            card.appendChild(delBtn);
        });
    }

    // Sahifa render bo'lgandan keyin barchasini initsializatsiya qilish
    // MutationObserver orqali DOM o'zgarganda (masalan, loyihalar yuklanganda) yangilash
    const observer = new MutationObserver(() => {
        initTextEditors();
        initProjectEditors();
        initServiceEditors();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Initial run
    setTimeout(() => {
        initTextEditors();
        initProjectEditors();
        sendToParent('ready', {});
    }, 1000);

})();
