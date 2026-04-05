// assets/js/admin.js

document.addEventListener('DOMContentLoaded', () => {

    const AUTH_KEY = 'cyber_admin_session';

    // Helper: basic sanitization for display
    function escapeHTML(str) {
        if (!str) return '';
        return String(str).replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag]));
    }

    // --- LOGIN PAGE LOGIC ---
    const loginForm = document.getElementById('admin-login-form');
    if (loginForm) {
        // CSRF Token (demo generation for login page)
        const csrfToken = btoa(Math.random().toString()).substr(10, 10);
        document.getElementById('csrf-token').value = csrfToken;

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const user = document.getElementById('username').value;
            const pass = document.getElementById('password').value;
            const errDiv = document.getElementById('login-error');

            // Hard lockout check removed

            // Accept any username and password
            if (user && pass) {
                // Success
                localStorage.removeItem('admin_attempts');
                localStorage.removeItem('admin_lockout');
                
                // Set session info
                const sessionData = {
                    token: btoa(user + Date.now()),
                    expires: Date.now() + ADMIN_CONFIG.SESSION_TIMEOUT_MS
                };
                sessionStorage.setItem(AUTH_KEY, JSON.stringify(sessionData));
                
                window.location.href = 'dashboard.html';
            } else {
                handleFailedLogin(errDiv);
            }
        });

        function handleFailedLogin(errDiv) {
            errDiv.textContent = 'Invalid credentials.'; // Generic error
        }
    }

    // --- DASHBOARD LOGIC ---
    if (document.querySelector('.dashboard-layout')) {
        // Enforce Auth (Removed)
        // Active Timer (Removed)
        setInterval(() => {
            const timeEl = document.getElementById('time-left');
            if (timeEl) timeEl.textContent = 'Unlimited';
        }, 1000);

        // Sidebar Toggle Mobile
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
        document.querySelector('.logout-btn').addEventListener('click', () => {
            sessionStorage.removeItem(AUTH_KEY);
            window.location.replace('secure-entry.html');
        });

        // Demo Data Loading
        // In a real app, this fetches from DB, edits, and saves via API.
        // For this frontend-only demo, we load existing JSON for display.
        fetch('../assets/data/achievements.json')
            .then(res => res.json())
            .then(data => {
                const list = document.getElementById('admin-achievements-list');
                data.achievements.forEach(item => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${escapeHTML(item.title)}</td>
                        <td>${escapeHTML(item.year)}</td>
                        <td>${escapeHTML(item.category)}</td>
                        <td>
                            <button class="action-btn btn-edit">✏️</button>
                            <button class="action-btn btn-del">🗑️</button>
                        </td>
                    `;
                    list.appendChild(tr);
                });
            }).catch(()=>console.log("No achievements to load for admin preview"));

        // Modals Demo
        const modal = document.getElementById('admin-modal');
        const modalCancel = document.getElementById('modal-cancel');
        const btnAddAch = document.getElementById('btn-add-ach');

        if(btnAddAch) {
            btnAddAch.addEventListener('click', () => {
                document.getElementById('modal-title').textContent = "Add Achievement";
                document.getElementById('modal-form').innerHTML = `
                    <div class="form-group"><label>Title</label><input type="text" id="m-title" required></div>
                    <div class="form-group"><label>Year</label><input type="text" id="m-year" required></div>
                    <div class="form-group"><label>Category</label><input type="text" id="m-cat" required></div>
                `;
                modal.classList.add('active');
            });
        }

        if(modalCancel) {
            modalCancel.addEventListener('click', () => {
                modal.classList.remove('active');
            });
        }

        // Delegated events for edit/delete buttons
        document.body.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-del')) {
                if(confirm('Are you sure you want to delete this record?')) {
                    e.target.closest('tr').remove();
                }
            } else if (e.target.classList.contains('btn-edit')) {
                document.getElementById('modal-title').textContent = "Edit Record";
                document.getElementById('modal-form').innerHTML = `
                    <div class="form-group"><label>Title</label><input type="text" value="Example Record" id="m-title" required></div>
                    <div class="form-group"><label>Details</label><input type="text" value="Demo data..." id="m-cat" required></div>
                `;
                modal.classList.add('active');
            }
        });
        
        // Save Mock
        document.getElementById('modal-save').addEventListener('click', () => {
            modal.classList.remove('active');
            alert('Data saved! (JSON modification requires server/backend in production)');
        });
        
        document.getElementById('btn-export-data').addEventListener('click', () => {
            alert('Export triggered. Check network tab for file download simulation.');
        });
    }

});
