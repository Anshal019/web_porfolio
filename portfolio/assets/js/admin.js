// assets/js/admin.js

document.addEventListener('DOMContentLoaded', async () => {

    const AUTH_KEY = 'cyber_admin_session';

    // 1. Helper: basic sanitization for display
    function escapeHTML(str) {
        if (!str) return '';
        return String(str).replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
            }[tag]));
    }

    // 2. Init DB Locally (Fetch from JSON if empty)
    async function initDB() {
        if (!localStorage.getItem('db_achievements')) {
            try {
                const res = await fetch('../assets/data/achievements.json');
                if (res.ok) {
                    const data = await res.json();
                    localStorage.setItem('db_achievements', JSON.stringify(data.achievements || []));
                    localStorage.setItem('db_research', JSON.stringify(data.research || []));
                    localStorage.setItem('db_projects', JSON.stringify(data.projects || []));
                }
            } catch(e) { console.error(e) }
        }
        if (!localStorage.getItem('db_services')) {
            try {
                const res = await fetch('../assets/data/services.json');
                if (res.ok) {
                    const data = await res.json();
                    localStorage.setItem('db_services', JSON.stringify(data.services || []));
                    localStorage.setItem('db_portfolio', JSON.stringify(data.portfolio || []));
                    localStorage.setItem('db_certifications', JSON.stringify(data.certifications || []));
                }
            } catch(e) { console.error(e) }
        }
    }

    // --- DASHBOARD LOGIC ---
    if (document.querySelector('.dashboard-layout')) {
        await initDB();

        // Sidebar Toggle
        const sidebar = document.getElementById('sidebar');
        const sidebarToggle = document.getElementById('sidebar-toggle');
        if(sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                sidebar.classList.toggle('open');
            });
        }

        // Tabs
        const tabs = document.querySelectorAll('.nav-tab[data-target]');
        const views = document.querySelectorAll('.admin-view');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                views.forEach(v => v.classList.remove('active'));
                
                tab.classList.add('active');
                document.getElementById(`view-${tab.dataset.target}`).classList.add('active');
                if(window.innerWidth <= 768) sidebar.classList.remove('open');
            });
        });

        // Logout
        document.querySelector('.logout-btn')?.addEventListener('click', () => {
            sessionStorage.removeItem(AUTH_KEY);
            window.location.replace('secure-entry.html');
        });

        // Modals Demo
        const modal = document.getElementById('admin-modal');
        const modalCancel = document.getElementById('modal-cancel');
        const modalForm = document.getElementById('modal-form');
        
        let currentEditingTable = null;
        let currentEditingId = null;

        if(modalCancel) {
            modalCancel.addEventListener('click', () => {
                modal.classList.remove('active');
            });
        }

        // Add Handlers
        document.querySelectorAll('.btn-add-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                openModal(e.target.dataset.table, null);
            });
        });

        // Delegated events for edit/delete buttons
        document.body.addEventListener('click', (e) => {
            if (e.target.closest('.btn-del')) {
                const btn = e.target.closest('.btn-del');
                if(confirm('Are you sure you want to completely remove this record?')) {
                    deleteItem(btn.dataset.table, btn.dataset.id);
                    btn.closest('tr').remove();
                }
            } else if (e.target.closest('.btn-edit')) {
                const btn = e.target.closest('.btn-edit');
                openModal(btn.dataset.table, btn.dataset.id);
            }
        });

        // Save Form
        document.getElementById('modal-save').addEventListener('click', () => {
            const formData = new FormData(modalForm);
            const dataObj = Object.fromEntries(formData.entries());
            
            // Format arrays
            if (dataObj.stack) {
                dataObj.stack = dataObj.stack.split(',').map(s => s.trim()).filter(Boolean);
            }

            saveItem(currentEditingTable, currentEditingId, dataObj);
            modal.classList.remove('active');
            refreshTables();
            alert('Data updated securely in the DB! Check public pages to see changes.');
        });
        
        document.getElementById('btn-export-data')?.addEventListener('click', () => {
            const exportData = {
                achievements: JSON.parse(localStorage.getItem('db_achievements')||'[]'),
                projects: JSON.parse(localStorage.getItem('db_projects')||'[]'),
                services: JSON.parse(localStorage.getItem('db_services')||'[]')
            };
            const blob = new Blob([JSON.stringify(exportData, null, 2)], {type: "application/json"});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = "db_backup.json";
            a.click();
        });

        // --- Core DB UI Functions ---
        function refreshTables() {
            renderTable('db_achievements', 'admin-achievements-list', ['title', 'year', 'category']);
            renderTable('db_projects', 'admin-projects-list', ['name', 'status']);
            renderTable('db_services', 'admin-services-list', ['title', 'priceRange']);
        }
        
        // Initial render
        refreshTables();

        function renderTable(tableKey, tbodyId, cols) {
            const list = document.getElementById(tbodyId);
            if(!list) return;
            list.innerHTML = '';
            
            const data = JSON.parse(localStorage.getItem(tableKey) || '[]');
            data.forEach(item => {
                const tr = document.createElement('tr');
                let html = cols.map(col => `<td>${escapeHTML(String(item[col] || ''))}</td>`).join('');
                html += `
                    <td>
                        <button class="action-btn btn-edit" data-table="${tableKey}" data-id="${item.id}">✏️</button>
                        <button class="action-btn btn-del" data-table="${tableKey}" data-id="${item.id}">🗑️</button>
                    </td>
                `;
                tr.innerHTML = html;
                list.appendChild(tr);
            });
        }

        function openModal(table, id) {
            currentEditingTable = table;
            currentEditingId = id;
            
            const data = JSON.parse(localStorage.getItem(table) || '[]');
            const item = id ? data.find(i => String(i.id) === String(id)) : {};
            
            document.getElementById('modal-title').textContent = id ? "Modify Record" : "Create New Record";
            
            let formHTML = '';
            if (table === 'db_achievements') {
                formHTML = `
                    <div class="form-group"><label>Title</label><input type="text" name="title" value="${escapeHTML(item.title||'')}" required></div>
                    <div class="form-group"><label>Year</label><input type="text" name="year" value="${escapeHTML(item.year||'')}" required></div>
                    <div class="form-group"><label>Category</label><input type="text" name="category" value="${escapeHTML(item.category||'')}" required></div>
                    <div class="form-group"><label>Description</label><textarea name="description" required>${escapeHTML(item.description||'')}</textarea></div>
                    <div class="form-group"><label>Link</label><input type="text" name="link" value="${escapeHTML(item.link || '#')}"></div>
                `;
            } else if (table === 'db_projects') {
                formHTML = `
                    <div class="form-group"><label>Project Name</label><input type="text" name="name" value="${escapeHTML(item.name||'')}" required></div>
                    <div class="form-group"><label>Status</label><input type="text" name="status" value="${escapeHTML(item.status || 'Active')}" required></div>
                    <div class="form-group"><label>Tech Stack (comma separated)</label><input type="text" name="stack" value="${escapeHTML((item.stack||[]).join(', '))}" required></div>
                    <div class="form-group"><label>Description</label><textarea name="description" required>${escapeHTML(item.description||'')}</textarea></div>
                    <div class="form-group"><label>GitHub URL</label><input type="text" name="github" value="${escapeHTML(item.github || '#')}"></div>
                    <div class="form-group"><label>Live Demo URL</label><input type="text" name="demo" value="${escapeHTML(item.demo || '#')}"></div>
                `;
            } else if (table === 'db_services') {
                formHTML = `
                    <div class="form-group"><label>Title</label><input type="text" name="title" value="${escapeHTML(item.title||'')}" required></div>
                    <div class="form-group"><label>Price Range</label><input type="text" name="priceRange" value="${escapeHTML(item.priceRange||'')}" required></div>
                    <div class="form-group"><label>SVG Icon (Raw HTML) or Emoji</label><input type="text" name="icon" value="${escapeHTML(item.icon||'🔥')}" required></div>
                    <div class="form-group"><label>Short Description</label><textarea name="shortDesc" required>${escapeHTML(item.shortDesc||'')}</textarea></div>
                    <div class="form-group"><label>Detailed Description</label><textarea name="detailDesc" required>${escapeHTML(item.detailDesc||'')}</textarea></div>
                `;
            }
            
            modalForm.innerHTML = formHTML;
            modal.classList.add('active');
        }

        function saveItem(table, id, newData) {
            let data = JSON.parse(localStorage.getItem(table) || '[]');
            if (id) {
                const idx = data.findIndex(i => String(i.id) === String(id));
                if (idx > -1) {
                    data[idx] = { ...data[idx], ...newData };
                }
            } else {
                newData.id = Date.now().toString(); // unique ID
                data.push(newData);
            }
            localStorage.setItem(table, JSON.stringify(data));
        }

        function deleteItem(table, id) {
            let data = JSON.parse(localStorage.getItem(table) || '[]');
            data = data.filter(i => String(i.id) !== String(id));
            localStorage.setItem(table, JSON.stringify(data));
        }
    }

    // Login Form logic included at bottom to preserve original functionality
    const loginForm = document.getElementById('admin-login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const user = document.getElementById('username').value;
            const pass = document.getElementById('password').value;
            if (user && pass) {
                sessionStorage.setItem(AUTH_KEY, btoa(user + Date.now()));
                window.location.href = 'dashboard.html';
            }
        });
    }

});
