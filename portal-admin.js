const CONFIG = {
    API_URL: 'http://localhost/school/api',
    STORAGE_KEY: {
        ANNOUNCEMENTS: 'ffhnas_announcements',
        TEACHER_ANNOUNCEMENTS: 'ffhnas_teacher_announcements',
        MESSAGES: 'ffhnas_messages',
        USERS: 'ffhnas_users'
    }
};

let announcements = [];
let messages = [];
let enrollments = [];
let usersData = [];
let teacherAnnouncements = [];
let editingAnnouncementId = null;
let editingTeacherAnnouncementId = null;
let enrollmentFilter = 'all';
let messageFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadAllData();
    loadSettings();
    // close modals on overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', e => { if (e.target === overlay) closeAllModals(); });
    });
});

// ── AUTH ──
function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!currentUser || currentUser.role !== 'admin') {
        showToast('Access Denied', 'Admin access required', 'error');
        setTimeout(() => window.location.href = 'index.html', 1500);
        return;
    }
    document.getElementById('userName').textContent = currentUser.first_name || 'Admin';
    document.getElementById('userAvatar').textContent = (currentUser.first_name || 'A').charAt(0).toUpperCase();
}

// ── NAV ──
function switchSection(name) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(l => l.classList.remove('active'));
    const sec = document.getElementById(`section-${name}`);
    if (sec) { sec.classList.add('active'); document.querySelector('.main').scrollTop = 0; }
    const nav = document.querySelector(`[data-section="${name}"]`);
    if (nav) nav.classList.add('active');
}

// ── LOAD ALL ──
function loadAllData() {
    loadEnrollments();
    loadAnnouncements();
    loadTeacherAnnouncements();
    loadMessages();
    loadUsers();
}

// ── ENROLLMENTS ──
async function loadEnrollments() {
    try {
        const res = await fetch(`${CONFIG.API_URL}/enrollment.php?action=get_enrollments`);
        const data = await res.json();
        enrollments = data.success ? (data.data || data.enrollments || []) : [];
    } catch { enrollments = []; }
    renderEnrollments();
    renderRecentEnrollments();
    updateStats();
    updateNotificationBadge();
}

function filterEnrollments(status, btn) {
    enrollmentFilter = status;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    renderEnrollments();
}

function renderEnrollments() {
    const tbody = document.getElementById('enrollmentsTable');
    if (!tbody) return;
    const q = (document.getElementById('enrollmentSearch')?.value || '').toLowerCase();
    let list = enrollments;
    if (enrollmentFilter !== 'all') list = list.filter(e => e.status === enrollmentFilter);
    if (q) list = list.filter(e => `${e.first_name} ${e.last_name} ${e.email} ${e.strand}`.toLowerCase().includes(q));

    if (!list.length) {
        tbody.innerHTML = `<tr><td colspan="11" style="text-align:center;padding:2rem;color:var(--text-light)">No enrollments found</td></tr>`;
        return;
    }
    tbody.innerHTML = list.map(e => `
        <tr>
            <td><strong>${e.first_name} ${e.last_name}</strong><br><span style="font-size:0.78rem;color:var(--text-light)">${e.email}</span></td>
            <td>${e.date_of_birth || '—'}</td>
            <td>${e.gender || '—'}</td>
            <td>${e.phone || '—'}</td>
            <td>${e.strand}</td>
            <td>Grade ${e.grade_level}</td>
            <td>${e.last_school || '—'}</td>
            <td>${e.guardian_name || '—'}</td>
            <td>${new Date(e.date_applied).toLocaleDateString()}</td>
            <td><span class="badge badge-${e.status}">${e.status}</span></td>
            <td>
                <div style="display:flex;gap:0.375rem;">
                    ${e.status === 'pending' ? `
                        <button class="btn btn-success btn-sm" onclick="approveEnrollment(${e.id})">Approve</button>
                        <button class="btn btn-danger btn-sm" onclick="rejectEnrollment(${e.id})">Reject</button>
                    ` : `<span style="font-size:0.8rem;color:var(--text-light)">${e.status}</span>`}
                </div>
            </td>
        </tr>
    `).join('');
}

function renderRecentEnrollments() {
    const tbody = document.getElementById('recentEnrollmentsTable');
    if (!tbody) return;
    const recent = [...enrollments].sort((a,b) => new Date(b.date_applied) - new Date(a.date_applied)).slice(0, 5);
    if (!recent.length) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:1.5rem;color:var(--text-light)">No enrollments yet</td></tr>`;
        return;
    }
    tbody.innerHTML = recent.map(e => `
        <tr>
            <td><strong>${e.first_name} ${e.last_name}</strong></td>
            <td>${e.strand}</td>
            <td>Grade ${e.grade_level}</td>
            <td>${new Date(e.date_applied).toLocaleDateString()}</td>
            <td><span class="badge badge-${e.status}">${e.status}</span></td>
        </tr>
    `).join('');
}

async function approveEnrollment(id) {
    try {
        const res = await fetch(`${CONFIG.API_URL}/enrollment.php`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, status: 'approved' })
        });
        const result = await res.json();
        if (result.success) {
            const e = enrollments.find(en => en.id === id);
            showToast('Approved', `${e.first_name} ${e.last_name}'s enrollment approved`, 'success');
            loadEnrollments();
        }
    } catch { showToast('Error', 'Failed to approve enrollment', 'error'); }
}

function rejectEnrollment(id) {
    if (!confirm('Reject this enrollment?')) return;
    fetch(`${CONFIG.API_URL}/reject-enrollment.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
    })
    .then(r => r.json())
    .then(data => {
        if (data.success) { showToast('Rejected', 'Enrollment rejected', 'success'); loadEnrollments(); }
        else showToast('Error', data.message || 'Failed', 'error');
    })
    .catch(err => showToast('Error', err.message, 'error'));
}

// ── ANNOUNCEMENTS ──
function loadAnnouncements() {
    const stored = localStorage.getItem(CONFIG.STORAGE_KEY.ANNOUNCEMENTS);
    announcements = stored ? JSON.parse(stored) : [];
    renderAnnouncements();
    updateStats();
}

function renderAnnouncements() {
    const c = document.getElementById('announcementsList');
    if (!c) return;
    if (!announcements.length) {
        c.innerHTML = `<div class="empty"><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg><p>No announcements yet</p></div>`;
        return;
    }
    c.innerHTML = announcements.map(a => `
        <div class="ann-card">
            ${a.photo_path ? `<img src="${a.photo_path}" alt="${a.title}">` : ''}
            <div class="ann-card-top">
                <span class="badge badge-${a.category}">${a.category}</span>
                <div class="ann-actions">
                    <button class="icon-btn" onclick="editAnnouncement(${a.id})" title="Edit">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                    </button>
                    <button class="icon-btn danger" onclick="deleteAnnouncement(${a.id})" title="Delete">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </button>
                </div>
            </div>
            <h3>${a.title}</h3>
            <p>${a.content}</p>
            <div class="ann-card-footer">
                <span>${a.creator_name || 'Administrator'}</span>
                <span>${new Date(a.created_at).toLocaleDateString()}</span>
            </div>
        </div>
    `).join('');
}

function deleteAnnouncement(id) {
    const a = announcements.find(x => x.id === id);
    if (!a || !confirm(`Delete "${a.title}"?`)) return;
    announcements = announcements.filter(x => x.id !== id);
    localStorage.setItem(CONFIG.STORAGE_KEY.ANNOUNCEMENTS, JSON.stringify(announcements));
    showToast('Deleted', 'Announcement deleted', 'success');
    renderAnnouncements();
    updateStats();
}

function openAnnouncementModal() {
    editingAnnouncementId = null;
    document.getElementById('announcementModalTitle').textContent = 'New Announcement';
    document.getElementById('announcementTitle').value = '';
    document.getElementById('announcementContent').value = '';
    document.getElementById('announcementCategory').value = 'general';
    document.getElementById('announcementImage').value = '';
    openModal('announcementModal');
}

function editAnnouncement(id) {
    const a = announcements.find(x => x.id === id);
    if (!a) return;
    editingAnnouncementId = id;
    document.getElementById('announcementModalTitle').textContent = 'Edit Announcement';
    document.getElementById('announcementTitle').value = a.title;
    document.getElementById('announcementContent').value = a.content;
    document.getElementById('announcementCategory').value = a.category;
    openModal('announcementModal');
}

function closeAnnouncementModal() { closeModal('announcementModal'); editingAnnouncementId = null; }

async function saveAnnouncement() {
    const title = document.getElementById('announcementTitle').value.trim();
    const content = document.getElementById('announcementContent').value.trim();
    const category = document.getElementById('announcementCategory').value;
    const imageInput = document.getElementById('announcementImage');
    if (!title || !content) { showToast('Error', 'Please fill in all fields', 'error'); return; }
    const currentUser = JSON.parse(localStorage.getItem('loggedInUser'));
    let photoPath = '';
    if (imageInput.files && imageInput.files[0]) {
        photoPath = await new Promise(resolve => {
            const r = new FileReader();
            r.onload = e => resolve(e.target.result);
            r.readAsDataURL(imageInput.files[0]);
        });
    }
    if (editingAnnouncementId) {
        const idx = announcements.findIndex(a => a.id === editingAnnouncementId);
        if (idx !== -1) announcements[idx] = { ...announcements[idx], title, content, category, photo_path: photoPath || announcements[idx].photo_path };
    } else {
        announcements.unshift({ id: Date.now(), title, content, category, photo_path: photoPath, creator_name: `${currentUser.first_name} ${currentUser.last_name}`, created_by: currentUser.id, created_at: new Date().toISOString() });
    }
    localStorage.setItem(CONFIG.STORAGE_KEY.ANNOUNCEMENTS, JSON.stringify(announcements));
    showToast('Success', `Announcement ${editingAnnouncementId ? 'updated' : 'published'}`, 'success');
    closeAnnouncementModal();
    renderAnnouncements();
    updateStats();
}

// ── TEACHER ANNOUNCEMENTS ──
function loadTeacherAnnouncements() {
    const stored = localStorage.getItem(CONFIG.STORAGE_KEY.TEACHER_ANNOUNCEMENTS);
    teacherAnnouncements = stored ? JSON.parse(stored) : [];
    renderTeacherAnnouncements();
    updateStats();
}

function renderTeacherAnnouncements() {
    const c = document.getElementById('teacherAnnouncementsList');
    if (!c) return;
    if (!teacherAnnouncements.length) {
        c.innerHTML = `<div class="empty"><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg><p>No teacher notices yet</p></div>`;
        return;
    }
    c.innerHTML = teacherAnnouncements.map(a => `
        <div class="ann-card">
            <div class="ann-card-top">
                <span class="badge badge-${a.category}">${a.category}</span>
                <div class="ann-actions">
                    <button class="icon-btn" onclick="editTeacherAnnouncement(${a.id})" title="Edit">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                    </button>
                    <button class="icon-btn danger" onclick="deleteTeacherAnnouncement(${a.id})" title="Delete">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </button>
                </div>
            </div>
            <h3>${a.title}</h3>
            <p>${a.content}</p>
            <div class="ann-card-footer">
                <span>${a.creator_name || 'Administrator'}</span>
                <span>${new Date(a.created_at).toLocaleDateString()}</span>
            </div>
        </div>
    `).join('');
}

function openTeacherAnnouncementModal() {
    editingTeacherAnnouncementId = null;
    document.getElementById('teacherAnnouncementModalTitle').textContent = 'New Teacher Notice';
    document.getElementById('teacherAnnouncementTitle').value = '';
    document.getElementById('teacherAnnouncementContent').value = '';
    document.getElementById('teacherAnnouncementCategory').value = 'general';
    openModal('teacherAnnouncementModal');
}

function editTeacherAnnouncement(id) {
    const a = teacherAnnouncements.find(x => x.id === id);
    if (!a) return;
    editingTeacherAnnouncementId = id;
    document.getElementById('teacherAnnouncementModalTitle').textContent = 'Edit Teacher Notice';
    document.getElementById('teacherAnnouncementTitle').value = a.title;
    document.getElementById('teacherAnnouncementContent').value = a.content;
    document.getElementById('teacherAnnouncementCategory').value = a.category;
    openModal('teacherAnnouncementModal');
}

function closeTeacherAnnouncementModal() { closeModal('teacherAnnouncementModal'); editingTeacherAnnouncementId = null; }

function saveTeacherAnnouncement() {
    const title = document.getElementById('teacherAnnouncementTitle').value.trim();
    const content = document.getElementById('teacherAnnouncementContent').value.trim();
    const category = document.getElementById('teacherAnnouncementCategory').value;
    if (!title || !content) { showToast('Error', 'Please fill in all fields', 'error'); return; }
    const currentUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (editingTeacherAnnouncementId) {
        const idx = teacherAnnouncements.findIndex(a => a.id === editingTeacherAnnouncementId);
        if (idx !== -1) teacherAnnouncements[idx] = { ...teacherAnnouncements[idx], title, content, category };
    } else {
        teacherAnnouncements.unshift({ id: Date.now(), title, content, category, creator_name: `${currentUser.first_name} ${currentUser.last_name}`, created_by: currentUser.id, created_at: new Date().toISOString() });
    }
    localStorage.setItem(CONFIG.STORAGE_KEY.TEACHER_ANNOUNCEMENTS, JSON.stringify(teacherAnnouncements));
    showToast('Success', `Notice ${editingTeacherAnnouncementId ? 'updated' : 'published'}`, 'success');
    closeTeacherAnnouncementModal();
    renderTeacherAnnouncements();
    updateStats();
}

function deleteTeacherAnnouncement(id) {
    const a = teacherAnnouncements.find(x => x.id === id);
    if (!a || !confirm(`Delete "${a.title}"?`)) return;
    teacherAnnouncements = teacherAnnouncements.filter(x => x.id !== id);
    localStorage.setItem(CONFIG.STORAGE_KEY.TEACHER_ANNOUNCEMENTS, JSON.stringify(teacherAnnouncements));
    showToast('Deleted', 'Notice deleted', 'success');
    renderTeacherAnnouncements();
    updateStats();
}

// ── MESSAGES ──
async function loadMessages() {
    try {
        const res = await fetch(`${CONFIG.API_URL}/messages.php`);
        const data = await res.json();
        messages = data.success ? (data.messages || []) : [];
    } catch { messages = []; }
    renderMessages();
    updateStats();
    updateNotificationBadge();
}

function setMessageFilter(filter, btn) {
    messageFilter = filter;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    renderMessages();
}

function renderMessages() {
    const c = document.getElementById('messagesList');
    if (!c) return;
    let list = messages;
    if (messageFilter === 'unread') list = messages.filter(m => !m.is_read || m.is_read == 0);
    else if (messageFilter === 'read') list = messages.filter(m => m.is_read == 1 || m.is_read === true);

    if (!list.length) {
        c.innerHTML = `<div class="empty"><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg><p>No messages found</p></div>`;
        return;
    }

    c.innerHTML = list.map(m => {
        const isRead = m.is_read == 1 || m.is_read === true;
        const initials = m.sender_name ? m.sender_name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase() : '?';
        return `
        <div class="msg-item ${!isRead ? 'unread' : ''}" onclick="viewMessage(${m.id})">
            <div class="msg-avatar">${initials}</div>
            <div class="msg-body">
                <div class="msg-meta">
                    <span class="msg-sender">${m.sender_name}</span>
                    <span class="msg-time">${new Date(m.created_at).toLocaleDateString()}</span>
                </div>
                <div class="msg-preview">${m.message.substring(0,120)}${m.message.length > 120 ? '...' : ''}</div>
            </div>
            ${!isRead ? '<div class="msg-unread-dot"></div>' : ''}
            <div class="msg-actions" onclick="event.stopPropagation()">
                <button class="icon-btn" onclick="toggleMessageRead(${m.id})" title="${!isRead ? 'Mark read' : 'Mark unread'}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        ${!isRead ? '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>' : '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>'}
                    </svg>
                </button>
                <button class="icon-btn danger" onclick="deleteMessageQuick(${m.id})" title="Delete">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
            </div>
        </div>`;
    }).join('');
}

async function viewMessage(id) {
    const m = messages.find(x => x.id === id);
    if (!m) return;
    document.getElementById('messageDetails').innerHTML = `
        <div style="padding-bottom:1.25rem;margin-bottom:1.25rem;border-bottom:1px solid var(--border);">
            <p style="margin:0 0 0.4rem;font-size:0.9rem;"><strong>From:</strong> ${m.sender_name}</p>
            <p style="margin:0;font-size:0.875rem;color:var(--text-light);"><strong>Received:</strong> ${new Date(m.created_at).toLocaleString()}</p>
        </div>
        <div style="background:var(--light);border-radius:10px;padding:1.25rem;">
            <p style="line-height:1.8;white-space:pre-wrap;margin:0;font-size:0.9rem;">${m.message}</p>
        </div>
        <div style="margin-top:1.25rem;display:flex;gap:0.75rem;">
            <button class="btn btn-secondary" onclick="toggleMessageRead(${m.id}); closeMessageModal();">${(m.is_read == 0 || m.is_read === false) ? 'Mark as Read' : 'Mark as Unread'}</button>
            <button class="btn btn-danger" onclick="deleteMessage(${m.id})">Delete</button>
        </div>
    `;
    if (!m.is_read || m.is_read == 0) await toggleMessageRead(m.id, true);
    openModal('messageModal');
}

async function toggleMessageRead(id) {
    const m = messages.find(x => x.id == id);
    if (!m) return;
    const newStatus = m.is_read == 1 ? 0 : 1;
    try {
        const res = await fetch(`${CONFIG.API_URL}/messages.php`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: parseInt(id), is_read: newStatus })
        });
        const result = await res.json();
        if (result.success) { m.is_read = newStatus; renderMessages(); updateStats(); updateNotificationBadge(); }
    } catch { console.error('Toggle read error'); }
}

async function markAllAsRead() {
    const unread = messages.filter(m => !m.is_read || m.is_read == 0);
    if (!unread.length) { showToast('Info', 'No unread messages', 'info'); return; }
    if (!confirm(`Mark all ${unread.length} messages as read?`)) return;
    for (const m of unread) await toggleMessageRead(m.id);
    showToast('Success', `${unread.length} messages marked as read`, 'success');
}

async function deleteMessage(id) {
    try {
        const res = await fetch(`${CONFIG.API_URL}/messages.php`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        const result = await res.json();
        if (result.success) { showToast('Deleted', 'Message deleted', 'success'); closeMessageModal(); loadMessages(); }
        else showToast('Error', result.message || 'Failed to delete', 'error');
    } catch { showToast('Error', 'Failed to delete message', 'error'); }
}

async function deleteMessageQuick(id) {
    if (!confirm('Delete this message?')) return;
    await deleteMessage(id);
}

function closeMessageModal() { closeModal('messageModal'); }

// ── USERS ──
async function loadUsers() {
    try {
        const res = await fetch(`${CONFIG.API_URL}/users.php`);
        const data = await res.json();
        usersData = data.success ? (data.users || data.data?.users || data.data || []) : [];
    } catch { usersData = []; }
    renderUsers();
    updateStats();
}

function renderUsers() {
    const c = document.getElementById('usersList');
    if (!c) return;
    const q = (document.getElementById('userSearch')?.value || '').toLowerCase();
    let list = usersData;
    if (q) list = list.filter(u => `${u.first_name} ${u.last_name} ${u.email} ${u.role}`.toLowerCase().includes(q));

    if (!list.length) {
        c.innerHTML = `<div class="empty"><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg><p>No users found</p></div>`;
        return;
    }

    c.innerHTML = list.map(u => `
        <div class="user-item">
            <div class="user-ava ${u.role === 'admin' ? 'admin-ava' : u.role === 'teacher' ? 'teacher-ava' : ''}">
                ${u.first_name ? u.first_name.charAt(0).toUpperCase() : '?'}
            </div>
            <div class="user-info">
                <h4>${u.first_name} ${u.last_name}</h4>
                <p>${u.email}</p>
            </div>
            <span class="badge badge-${u.role}" style="margin-right:1rem">${u.role}</span>
            <div class="user-actions">
                <button class="icon-btn" onclick="editUser(${u.id})" title="Edit">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                ${u.role !== 'admin' ? `
                <button class="icon-btn danger" onclick="deleteUser(${u.id})" title="Delete">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>` : ''}
            </div>
        </div>
    `).join('');
}

function editUser(userId) {
    const u = usersData.find(x => x.id === userId);
    if (!u) return;
    document.getElementById('editUserId').value = u.id;
    document.getElementById('editFirstName').value = u.first_name;
    document.getElementById('editLastName').value = u.last_name;
    document.getElementById('editEmail').value = u.email;
    document.getElementById('editRole').value = u.role;
    openModal('editUserModal');
}

function closeEditUserModal() { closeModal('editUserModal'); }

async function saveEditUser() {
    const id = document.getElementById('editUserId').value;
    const first_name = document.getElementById('editFirstName').value.trim();
    const last_name = document.getElementById('editLastName').value.trim();
    const email = document.getElementById('editEmail').value.trim();
    const role = document.getElementById('editRole').value;
    if (!first_name || !last_name || !email || !role) { showToast('Error', 'All fields required', 'error'); return; }
    try {
        const res = await fetch(`${CONFIG.API_URL}/users.php`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, first_name, last_name, email, role })
        });
        const data = await res.json();
        if (data.success) { closeEditUserModal(); loadUsers(); showToast('Success', 'User updated', 'success'); }
        else showToast('Error', data.message || 'Failed', 'error');
    } catch { showToast('Error', 'Error updating user', 'error'); }
}

async function deleteUser(userId) {
    if (!confirm('Delete this user? This cannot be undone.')) return;
    try {
        const res = await fetch(`${CONFIG.API_URL}/users.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'delete', id: userId })
        });
        const data = await res.json();
        if (data.success) { loadUsers(); showToast('Success', 'User deleted', 'success'); }
        else showToast('Error', data.message || 'Failed', 'error');
    } catch { showToast('Error', 'Error deleting user', 'error'); }
}

// ── SETTINGS ──
function loadSettings() {
    const currentUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!currentUser) return;
    const f = document.getElementById('settingsFirstName');
    const l = document.getElementById('settingsLastName');
    const e = document.getElementById('settingsEmail');
    if (f) f.value = currentUser.first_name || '';
    if (l) l.value = currentUser.last_name || '';
    if (e) e.value = currentUser.email || '';
}

async function saveSettings(ev) {
    if (ev && ev.preventDefault) ev.preventDefault();
    const firstName = document.getElementById('settingsFirstName').value.trim();
    const lastName = document.getElementById('settingsLastName').value.trim();
    const email = document.getElementById('settingsEmail').value.trim();
    const currentPassword = document.getElementById('settingsCurrentPassword').value;
    const newPassword = document.getElementById('settingsNewPassword').value;
    const confirmPassword = document.getElementById('settingsConfirmPassword').value;
    if (!firstName || !lastName || !email) { showToast('Error', 'Please fill in all required fields', 'error'); return; }
    if (newPassword || confirmPassword) {
        if (!currentPassword) { showToast('Error', 'Current password required to change password', 'error'); return; }
        if (newPassword !== confirmPassword) { showToast('Error', 'New passwords do not match', 'error'); return; }
        if (newPassword.length < 6) { showToast('Error', 'Password must be at least 6 characters', 'error'); return; }
    }
    const currentUser = JSON.parse(localStorage.getItem('loggedInUser'));
    try {
        const res = await fetch(`${CONFIG.API_URL}/settings.php`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: currentUser.id, first_name: firstName, last_name: lastName, email, current_password: currentPassword || null, new_password: newPassword || null })
        });
        const result = await res.json();
        if (result.success) {
            currentUser.first_name = firstName;
            currentUser.last_name = lastName;
            currentUser.email = email;
            localStorage.setItem('loggedInUser', JSON.stringify(currentUser));
            document.getElementById('userName').textContent = firstName;
            document.getElementById('userAvatar').textContent = firstName.charAt(0).toUpperCase();
            showToast('Saved', 'Settings updated successfully', 'success');
            document.getElementById('settingsCurrentPassword').value = '';
            document.getElementById('settingsNewPassword').value = '';
            document.getElementById('settingsConfirmPassword').value = '';
        } else showToast('Error', result.message || 'Failed to save', 'error');
    } catch { showToast('Error', 'Failed to save settings', 'error'); }
}

// ── STATS ──
function updateStats() {
    const unread = messages.filter(m => !m.is_read || m.is_read == 0).length;
    const pending = enrollments.filter(e => e.status === 'pending').length;
    const approved = enrollments.filter(e => e.status === 'approved').length;

    document.getElementById('totalEnrollments').textContent = enrollments.length;
    document.getElementById('pendingEnrollments').textContent = pending;
    document.getElementById('totalMessages').textContent = unread;
    document.getElementById('totalUsers').textContent = usersData.length;

    const ac = document.getElementById('approvedCount');
    const pc = document.getElementById('pendingCount');
    const tc = document.getElementById('totalMsgCount');
    const ann = document.getElementById('annCount');
    const tann = document.getElementById('teacherAnnCount');
    if (ac) ac.textContent = approved;
    if (pc) pc.textContent = pending;
    if (tc) tc.textContent = messages.length;
    if (ann) ann.textContent = announcements.length;
    if (tann) tann.textContent = teacherAnnouncements.length;
}

function updateNotificationBadge() {
    const unread = messages.filter(m => !m.is_read || m.is_read == 0).length;
    const pending = enrollments.filter(e => e.status === 'pending').length;
    const total = unread + pending;

    const badge = document.getElementById('notificationBadge');
    const eb = document.getElementById('enrollmentBadge');
    const mb = document.getElementById('messageBadge');

    if (badge) { badge.textContent = total; badge.style.display = total > 0 ? 'flex' : 'none'; }
    if (eb) { eb.textContent = pending; eb.style.display = pending > 0 ? 'inline' : 'none'; }
    if (mb) { mb.textContent = unread; mb.style.display = unread > 0 ? 'inline' : 'none'; }
}

function toggleNotifications() {
    const unread = messages.filter(m => !m.is_read || m.is_read == 0).length;
    const pending = enrollments.filter(e => e.status === 'pending').length;
    showToast('Notifications', `${unread} unread messages · ${pending} pending enrollments`, 'info');
}

// ── MODAL HELPERS ──
function openModal(id) {
    const m = document.getElementById(id);
    if (!m) return;
    m.classList.remove('hidden');
    requestAnimationFrame(() => m.classList.add('active'));
}

function closeModal(id) {
    const m = document.getElementById(id);
    if (!m) return;
    m.classList.remove('active');
    setTimeout(() => m.classList.add('hidden'), 200);
}

function closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(m => {
        m.classList.remove('active');
        setTimeout(() => m.classList.add('hidden'), 200);
    });
}

// ── TOAST ──
function showToast(title, message, type = 'success') {
    const c = document.getElementById('toastContainer');
    const icons = {
        success: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
        error: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
        info: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`
    };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<div class="toast-icon">${icons[type]}</div><div class="toast-text"><strong>${title}</strong><p>${message}</p></div>`;
    c.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(400px)'; toast.style.transition = 'all 0.3s ease'; setTimeout(() => toast.remove(), 300); }, 3500);
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('loggedInUser');
        showToast('Goodbye', 'Logging out...', 'success');
        setTimeout(() => window.location.href = 'index.html', 1000);
    }
}