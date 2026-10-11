// ===== DATA =====
const EVENTS = {
    '2026-03-01': { type: 'exam',    title: 'Final Exams Begin' },
    '2026-03-07': { type: 'exam',    title: 'Midterm Examinations' },
    '2026-03-15': { type: 'meeting', title: 'Parent-Teacher Meeting' },
    '2026-03-20': { type: 'event',   title: 'Science Fair' },
    '2026-04-01': { type: 'holiday', title: 'Holy Week Break' },
    '2026-04-09': { type: 'holiday', title: 'Araw ng Kagitingan' },
    '2026-05-01': { type: 'holiday', title: 'Labor Day' },
    '2026-05-10': { type: 'event',   title: 'Graduation Ceremony' }
};

const SUBJECTS = [
    { name: 'Pre-Calculus',                  teacher: 'Mr. Reyes',     prelim: 90, midterm: 88, finals: 91, color: 'green' },
    { name: 'General Chemistry',             teacher: 'Mrs. Santos',   prelim: 85, midterm: 87, finals: 89, color: 'blue' },
    { name: 'General Physics',               teacher: 'Mr. Cruz',      prelim: 88, midterm: 90, finals: 92, color: 'amber' },
    { name: 'English for Academic Purposes', teacher: 'Ms. Garcia',    prelim: 92, midterm: 94, finals: 93, color: 'purple' },
    { name: 'Filipino',                      teacher: 'Mr. Dela Cruz', prelim: 87, midterm: 89, finals: 91, color: 'pink' },
    { name: 'Physical Education',            teacher: 'Coach Rivera',  prelim: 95, midterm: 96, finals: 97, color: 'green' },
    { name: 'Computer Science',              teacher: 'Ms. Torres',    prelim: 82, midterm: 84, finals: 86, color: 'teal' },
    { name: 'Statistics & Probability',      teacher: 'Mr. Lopez',     prelim: 79, midterm: 82, finals: 84, color: 'red' }
];

const SCHEDULE = [
    { time: '7:00 - 7:50 AM',      type: 'class',  mon:{s:'Pre-Calculus',c:'green'},  tue:{s:'Physics',c:'amber'},       wed:{s:'Pre-Calculus',c:'green'},  thu:{s:'Physics',c:'amber'},       fri:{s:'PE',c:'green'} },
    { time: '7:50 - 8:40 AM',      type: 'class',  mon:{s:'Chemistry',c:'blue'},       tue:{s:'Filipino',c:'pink'},       wed:{s:'Chemistry',c:'blue'},       thu:{s:'Filipino',c:'pink'},       fri:{s:'Computer Sci.',c:'teal'} },
    { time: '8:40 - 9:30 AM',      type: 'class',  mon:{s:'English',c:'purple'},       tue:{s:'Pre-Calculus',c:'green'},  wed:{s:'English',c:'purple'},       thu:{s:'Pre-Calculus',c:'green'},  fri:{s:'Statistics',c:'red'} },
    { time: '9:30 - 9:50 AM',      type: 'break',  mon:{s:'Break'},                    tue:{s:'Break'},                   wed:{s:'Break'},                    thu:{s:'Break'},                   fri:{s:'Break'} },
    { time: '9:50 - 10:40 AM',     type: 'class',  mon:{s:'Statistics',c:'red'},       tue:{s:'Chemistry',c:'blue'},      wed:{s:'Statistics',c:'red'},       thu:{s:'Chemistry',c:'blue'},      fri:{s:'English',c:'purple'} },
    { time: '10:40 - 11:30 AM',    type: 'class',  mon:{s:'Physics',c:'amber'},        tue:{s:'Computer Sci.',c:'teal'},  wed:{s:'Physics',c:'amber'},        thu:{s:'Computer Sci.',c:'teal'},  fri:{s:'Filipino',c:'pink'} },
    { time: '11:30 AM - 12:30 PM', type: 'break',  mon:{s:'Lunch Break'},              tue:{s:'Lunch Break'},             wed:{s:'Lunch Break'},              thu:{s:'Lunch Break'},             fri:{s:'Lunch Break'} },
    { time: '12:30 - 1:20 PM',     type: 'class',  mon:{s:'Filipino',c:'pink'},        tue:{s:'PE',c:'green'},            wed:{s:'Computer Sci.',c:'teal'},   thu:{s:'English',c:'purple'},      fri:{s:'Chemistry',c:'blue'} },
    { time: '1:20 - 2:10 PM',      type: 'class',  mon:{s:'Computer Sci.',c:'teal'},   tue:{s:'Statistics',c:'red'},      wed:{s:'PE',c:'green'},             thu:{s:'Statistics',c:'red'},      fri:{s:'Physics',c:'amber'} }
];

const ASSIGNMENTS = [
    {
        id: 1, subject: 'Pre-Calculus', color: 'green',
        title: 'Problem Set 5 — Trigonometry',
        description: 'Complete problems 1–20 on pages 112-114 of your textbook. Show all solutions step by step.',
        dueDate: '2026-03-08', points: 50, status: 'pending'
    },
    {
        id: 2, subject: 'General Chemistry', color: 'blue',
        title: 'Lab Report: Acid-Base Titration',
        description: 'Write a complete lab report for our Acid-Base Titration experiment conducted last week. Include abstract, methodology, data, and conclusions.',
        dueDate: '2026-03-06', points: 100, status: 'submitted',
        submittedAt: '2026-03-05', submittedFiles: ['lab_report.pdf'], submittedNotes: 'Submitted early!'
    },
    {
        id: 3, subject: 'English for Academic Purposes', color: 'purple',
        title: 'Research Paper Outline',
        description: 'Create a detailed outline for your 5-page research paper on a chosen social issue. Include thesis statement, main arguments, and at least 5 references.',
        dueDate: '2026-03-10', points: 80, status: 'pending'
    },
    {
        id: 4, subject: 'Statistics & Probability', color: 'red',
        title: 'Data Analysis Activity',
        description: 'Analyze the provided dataset using measures of central tendency. Submit your Excel file and a written interpretation.',
        dueDate: '2026-03-05', points: 40, status: 'graded', grade: 38,
        submittedAt: '2026-03-04', submittedFiles: ['data_analysis.xlsx']
    },
    {
        id: 5, subject: 'Physics', color: 'amber',
        title: "Newton's Laws Worksheet",
        description: 'Complete the worksheet on Newton\'s Three Laws of Motion. Include free-body diagrams where applicable.',
        dueDate: '2026-03-12', points: 60, status: 'pending'
    },
    {
        id: 6, subject: 'Computer Science', color: 'teal',
        title: 'Python Basics Quiz',
        description: 'Online quiz covering Python variables, loops, conditionals, and functions. The quiz will be available on the LMS.',
        dueDate: '2026-03-03', points: 30, status: 'graded', grade: 28,
        submittedAt: '2026-03-03', submittedFiles: []
    }
];

const ATTENDANCE_RECORDS = [
    { date:'2026-03-04', subject:'Pre-Calculus',   status:'present', teacher:'Mr. Reyes' },
    { date:'2026-03-04', subject:'Chemistry',      status:'present', teacher:'Mrs. Santos' },
    { date:'2026-03-03', subject:'Physics',        status:'late',    teacher:'Mr. Cruz' },
    { date:'2026-03-03', subject:'English',        status:'present', teacher:'Ms. Garcia' },
    { date:'2026-03-02', subject:'Filipino',       status:'present', teacher:'Mr. Dela Cruz' },
    { date:'2026-03-02', subject:'Statistics',     status:'absent',  teacher:'Mr. Lopez' },
    { date:'2026-02-28', subject:'Computer Sci.',  status:'present', teacher:'Ms. Torres' },
    { date:'2026-02-27', subject:'PE',             status:'present', teacher:'Coach Rivera' },
    { date:'2026-02-27', subject:'Pre-Calculus',   status:'absent',  teacher:'Mr. Reyes' },
    { date:'2026-02-26', subject:'Chemistry',      status:'present', teacher:'Mrs. Santos' }
];

// ===== STATE =====
let calYear = 2026, calMonth = 2;
let selectedFiles = [];
let currentSubmitId = null;

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    loadUser();
    setDynamicDate();
    renderDashboard();
    renderSchedule();
    renderGrades();
    renderAssignments();
    renderAttendance();
    renderCalendar();
    renderEventsList('eventsList');
    renderEventsList('dashEvents');
    loadAnnouncements();
});

// ===== USER =====
function loadUser() {
    let userData = null;
    try { userData = JSON.parse(localStorage.getItem('loggedInUser')); } catch(e) {}

    const fullName = userData
        ? (userData.first_name
            ? `${userData.first_name} ${userData.last_name || ''}`.trim()
            : (userData.name || 'Student'))
        : 'Student';

    const firstName = fullName.split(' ')[0];
    const initials  = fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    document.getElementById('headerAvatar').textContent     = initials;
    document.getElementById('headerName').textContent       = firstName;
    document.getElementById('sidebarAvatar').textContent    = initials;
    document.getElementById('sidebarName').textContent      = fullName;
    document.getElementById('bannerName').textContent       = `Welcome back, ${firstName}!`;
    document.getElementById('profileAvatarXL').textContent  = initials;
    document.getElementById('profileBannerName').textContent = fullName;

    const email = userData?.email || 'N/A';

    document.getElementById('personalInfo').innerHTML = `
        <div><div class="info-label">Full Name</div><div class="info-value">${fullName}</div></div>
        <div><div class="info-label">Email</div><div class="info-value">${email}</div></div>
        <div><div class="info-label">Student ID</div><div class="info-value">2024-0001</div></div>
        <div><div class="info-label">Contact</div><div class="info-value">+63 912 345 6789</div></div>
        <div><div class="info-label">Address</div><div class="info-value">Santa Maria, Bulacan</div></div>
        <div><div class="info-label">Guardian</div><div class="info-value">Maria Dela Cruz</div></div>
    `;

    document.getElementById('academicInfo').innerHTML = `
        <div><div class="info-label">Grade Level</div><div class="info-value">Grade 11</div></div>
        <div><div class="info-label">Strand</div><div class="info-value">STEM</div></div>
        <div><div class="info-label">Section</div><div class="info-value">Section A</div></div>
        <div><div class="info-label">School Year</div><div class="info-value">2026-2027</div></div>
        <div><div class="info-label">Semester</div><div class="info-value">2nd Semester</div></div>
        <div><div class="info-label">General Average</div><div class="info-value" style="color:var(--primary)">88.5</div></div>
    `;

    document.getElementById('profilePerformance').innerHTML = SUBJECTS.map(s => {
        const avg = ((s.prelim + s.midterm + s.finals) / 3).toFixed(1);
        return `
            <div class="progress-item">
                <div class="progress-label">
                    <span class="progress-name">${s.name}</span>
                    <span class="progress-val">${avg}</span>
                </div>
                <div class="progress-bar"><div class="progress-fill" style="width:${avg}%"></div></div>
            </div>`;
    }).join('');
}

// ===== DATE =====
function setDynamicDate() {
    const now  = new Date();
    const hour = now.getHours();
    const greet = hour < 12 ? 'Good Morning! ☀️' : hour < 17 ? 'Good Afternoon! 🌤️' : 'Good Evening! 🌙';
    document.getElementById('dashGreeting').textContent = greet;
    document.getElementById('todayDate').textContent = now.toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
}

// ===== NAVIGATION =====
function navigate(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const target = document.getElementById('page-' + page);
    if (target) target.classList.add('active');
    const navItem = document.querySelector(`[data-page="${page}"]`);
    if (navItem) navItem.classList.add('active');
    document.querySelector('.main').scrollTop = 0;
}

// ===== DASHBOARD =====
function renderDashboard() {
    const dayMap = {1:'mon',2:'tue',3:'wed',4:'thu',5:'fri'};
    const dayKey = dayMap[new Date().getDay()];
    const schedEl = document.getElementById('todaySchedule');

    if (dayKey) {
        const classes = SCHEDULE.filter(r => r.type === 'class');
        schedEl.innerHTML = classes.map(r => `
            <div style="display:flex;align-items:center;gap:0.75rem;padding:0.75rem 1.25rem;border-bottom:1px solid var(--border);">
                <span style="font-size:0.75rem;color:var(--text-light);min-width:95px;">${r.time.split(' - ')[0]}</span>
                <span class="subject-pill ${r[dayKey].c || 'green'}">${r[dayKey].s}</span>
            </div>
        `).join('');
    } else {
        schedEl.innerHTML = '<div class="empty-state"><p>No classes today 🎉</p></div>';
    }

    const pending = ASSIGNMENTS.filter(a => a.status === 'pending');
    document.getElementById('pendingCount').textContent = pending.length;
    document.getElementById('assignBadge').textContent  = pending.length;

    document.getElementById('dashAssignments').innerHTML = pending.length
        ? pending.map(a => {
            const days = Math.ceil((new Date(a.dueDate) - new Date()) / 86400000);
            const dueColor = days < 0 ? 'var(--danger)' : days <= 2 ? 'var(--accent)' : 'var(--text-light)';
            return `
                <div class="assignment-card" style="margin-bottom:0.625rem;">
                    <div class="assignment-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
                    <div class="assignment-info">
                        <div class="assignment-title">${a.title}</div>
                        <div class="assignment-meta">
                            <span>${a.subject}</span>
                            <span style="color:${dueColor}">Due: ${new Date(a.dueDate).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</span>
                        </div>
                    </div>
                    <span class="status-chip pending">Pending</span>
                </div>`;
        }).join('')
        : '<div class="empty-state"><p>All caught up! ✅</p></div>';
}

// ===== ANNOUNCEMENTS =====
function loadAnnouncements() {
    const stored = JSON.parse(
        localStorage.getItem('ffhnas_announcements') ||
        localStorage.getItem('schoolAnnouncements') || '[]'
    );
    const badge = document.getElementById('annBadge');
    if (badge) badge.textContent = stored.length;

    const renderAnn = (a) => {
        const isUrgent = a.priority === 'urgent' || a.category === 'urgent';
        const dateDisp = (a.date || a.created_at)
            ? new Date(a.date || a.created_at).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})
            : '';
        return `
            <div class="announcement-item ${isUrgent ? 'urgent' : ''}">
                <div class="ann-top">
                    <span class="ann-badge ${isUrgent ? 'urgent' : 'info'}">${isUrgent ? 'Urgent' : 'Info'}</span>
                </div>
                <div class="ann-title">${a.title || ''}</div>
                <div class="ann-content">${a.content || ''}</div>
                <div class="ann-meta">
                    <span>👤 ${a.postedBy || a.creator_name || 'Administrator'}</span>
                    <span>📅 ${dateDisp}</span>
                </div>
            </div>`;
    };

    const empty = '<div class="empty-state"><p>No announcements yet.</p></div>';
    const dash  = document.getElementById('dashAnnouncements');
    const full  = document.getElementById('fullAnnouncements');
    if (dash) dash.innerHTML = stored.length ? stored.slice(0,3).map(renderAnn).join('') : empty;
    if (full) full.innerHTML = stored.length ? stored.map(renderAnn).join('') : empty;
}

// ===== SCHEDULE =====
function renderSchedule() {
    const tbody = document.getElementById('scheduleBody');
    if (!tbody) return;

    tbody.innerHTML = SCHEDULE.map(row => {
        if (row.type === 'break') {
            return `
                <tr class="break-row">
                    <td style="font-weight:600;color:var(--text-light)">${row.time}</td>
                    <td colspan="5">${row.mon.s}</td>
                </tr>`;
        }
        return `
            <tr>
                <td style="font-weight:600;color:var(--dark);white-space:nowrap;">${row.time}</td>
                ${['mon','tue','wed','thu','fri'].map(d =>
                    `<td><span class="subject-pill ${row[d].c}">${row[d].s}</span></td>`
                ).join('')}
            </tr>`;
    }).join('');
}

// ===== GRADES =====
function renderGrades() {
    const table = document.getElementById('gradesTable');
    if (!table) return;

    const gClass = g => g >= 90 ? 'excellent' : g >= 85 ? 'good' : g >= 75 ? 'average' : 'low';
    const gColor = g => g >= 90 ? '#10b981' : g >= 85 ? '#3b82f6' : g >= 75 ? '#f59e0b' : '#ef4444';

    table.innerHTML = `
        <thead>
            <tr>
                <th>Subject</th><th>Teacher</th>
                <th>Prelim</th><th>Midterm</th><th>Finals</th>
                <th>Average</th><th>Performance</th>
            </tr>
        </thead>
        <tbody>
            ${SUBJECTS.map(s => {
                const avg = ((s.prelim + s.midterm + s.finals) / 3).toFixed(1);
                return `
                    <tr>
                        <td><strong style="color:var(--dark)">${s.name}</strong></td>
                        <td style="color:var(--text-light)">${s.teacher}</td>
                        <td><span class="grade-pill ${gClass(s.prelim)}">${s.prelim}</span></td>
                        <td><span class="grade-pill ${gClass(s.midterm)}">${s.midterm}</span></td>
                        <td><span class="grade-pill ${gClass(s.finals)}">${s.finals}</span></td>
                        <td><strong style="color:var(--dark)">${avg}</strong></td>
                        <td>
                            <div class="grade-bar-wrap">
                                <div class="grade-bar"><div class="grade-bar-fill" style="width:${avg}%;background:${gColor(avg)}"></div></div>
                                <span style="font-size:0.75rem;color:var(--text-light);min-width:28px">${avg}%</span>
                            </div>
                        </td>
                    </tr>`;
            }).join('')}
        </tbody>`;

    const bars = document.getElementById('performanceBars');
    if (bars) {
        bars.innerHTML = SUBJECTS.map(s => {
            const avg = ((s.prelim + s.midterm + s.finals) / 3).toFixed(1);
            return `
                <div class="progress-item">
                    <div class="progress-label">
                        <span class="progress-name">${s.name}</span>
                        <span class="progress-val">${avg}</span>
                    </div>
                    <div class="progress-bar"><div class="progress-fill" style="width:${avg}%"></div></div>
                </div>`;
        }).join('');
    }
}

// ===== ASSIGNMENTS =====
function renderAssignments() {
    const container = document.getElementById('assignmentsList');
    if (!container) return;

    const filter   = document.getElementById('assignFilter')?.value || 'all';
    const filtered = filter === 'all' ? ASSIGNMENTS : ASSIGNMENTS.filter(a => a.status === filter);

    if (!filtered.length) {
        container.innerHTML = '<div class="empty-state"><p>No assignments found.</p></div>';
        return;
    }

    container.innerHTML = filtered.map(a => {
        const due  = new Date(a.dueDate);
        const days = Math.ceil((due - new Date()) / 86400000);
        const dueColor = days < 0 ? 'var(--danger)' : days <= 2 ? 'var(--accent)' : 'var(--text-light)';
        const dueTxt   = days < 0 ? `Overdue (${Math.abs(days)}d ago)` : days === 0 ? 'Due Today!' : `Due in ${days}d`;

        let actionHtml = '';
        if (a.status === 'pending') {
            actionHtml = `<button class="btn-open-submit" onclick="openSubmitModal(${a.id})">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                Submit
            </button>`;
        } else if (a.status === 'submitted') {
            actionHtml = `<div class="submitted-info">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                Submitted ${a.submittedAt ? new Date(a.submittedAt).toLocaleDateString('en-US',{month:'short',day:'numeric'}) : ''}
            </div>
            ${a.submittedFiles && a.submittedFiles.length ? `<span style="font-size:0.75rem;color:var(--text-light)">${a.submittedFiles.length} file(s)</span>` : ''}`;
        } else if (a.status === 'graded') {
            actionHtml = `<div style="text-align:right;">
                <div style="font-size:1.1rem;font-weight:800;color:var(--primary)">${a.grade}/${a.points}</div>
                <div style="font-size:0.75rem;color:var(--text-light)">Grade</div>
            </div>`;
        }

        return `
            <div class="assignment-card">
                <div class="assignment-icon" style="background:rgba(var(--${a.color}-rgb,16,185,129),0.1)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/></svg>
                </div>
                <div class="assignment-info">
                    <div class="assignment-title">${a.title}</div>
                    <div class="assignment-meta">
                        <span class="subject-pill ${a.color}" style="font-size:0.72rem;padding:0.2rem 0.5rem;">${a.subject}</span>
                        <span style="color:${dueColor};font-weight:600;">📅 ${dueTxt}</span>
                        <span>📊 ${a.points} pts</span>
                    </div>
                    <div class="assignment-desc">${a.description}</div>
                </div>
                <div class="assignment-actions">
                    <span class="status-chip ${a.status}">${a.status.charAt(0).toUpperCase()+a.status.slice(1)}</span>
                    ${actionHtml}
                </div>
            </div>`;
    }).join('');
}

// ===== SUBMIT MODAL =====
function openSubmitModal(id) {
    const a = ASSIGNMENTS.find(x => x.id === id);
    if (!a) return;
    currentSubmitId = id;
    selectedFiles   = [];

    document.getElementById('modalTitle').textContent = 'Submit: ' + a.title;
    document.getElementById('submitAssignmentId').value = id;

    const due  = new Date(a.dueDate);
    const days = Math.ceil((due - new Date()) / 86400000);
    const dueColor = days < 0 ? '#ef4444' : days <= 2 ? '#f59e0b' : '#10b981';

    document.getElementById('modalAssignmentInfo').innerHTML = `
        <h4>${a.title}</h4>
        <p>${a.description}</p>
        <div class="meta">
            <span>📚 ${a.subject}</span>
            <span style="color:${dueColor};font-weight:600;">📅 Due: ${due.toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}</span>
            <span>📊 ${a.points} points</span>
        </div>`;

    // Pre-fill student name
    let userData = null;
    try { userData = JSON.parse(localStorage.getItem('loggedInUser')); } catch(e) {}
    const fullName = userData
        ? (userData.first_name ? `${userData.first_name} ${userData.last_name || ''}`.trim() : userData.name || '')
        : '';
    document.getElementById('submitStudentName').value = fullName;
    document.getElementById('submitNotes').value = '';
    document.getElementById('fileList').innerHTML = '';
    document.getElementById('fileInput').value   = '';

    document.getElementById('submitModal').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeSubmitModal(e) {
    if (e.target === document.getElementById('submitModal')) closeSubmitModalDirect();
}

function closeSubmitModalDirect() {
    document.getElementById('submitModal').classList.remove('open');
    document.body.style.overflow = '';
    selectedFiles   = [];
    currentSubmitId = null;
}

function handleSubmit(e) {
    e.preventDefault();
    const name  = document.getElementById('submitStudentName').value.trim();
    const notes = document.getElementById('submitNotes').value.trim();

    if (!name) { showToast('Error', 'Please enter your name.', 'error'); return; }

    const a = ASSIGNMENTS.find(x => x.id === currentSubmitId);
    if (!a) return;

    // Update assignment state
    a.status        = 'submitted';
    a.submittedAt   = new Date().toISOString().split('T')[0];
    a.submittedNotes = notes;
    a.submittedFiles = selectedFiles.map(f => f.name);

    closeSubmitModalDirect();
    renderAssignments();
    renderDashboard();

    showToast('Assignment Submitted! ✅', `"${a.title}" submitted with ${selectedFiles.length} file(s).`, 'success');
}

// ===== FILE HANDLING =====
function handleFileSelect(e) {
    addFiles(Array.from(e.target.files));
}

function handleDragOver(e) {
    e.preventDefault();
    document.getElementById('fileDropZone').classList.add('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    document.getElementById('fileDropZone').classList.remove('drag-over');
    addFiles(Array.from(e.dataTransfer.files));
}

function addFiles(files) {
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    files.forEach(file => {
        if (file.size > MAX_SIZE) {
            showToast('File Too Large', `${file.name} exceeds 10MB limit.`, 'error');
            return;
        }
        if (selectedFiles.find(f => f.name === file.name)) return; // No duplicates
        selectedFiles.push(file);
        renderFileList();
    });
}

function removeFile(index) {
    selectedFiles.splice(index, 1);
    renderFileList();
}

function getFileIconType(file) {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type === 'application/pdf') return 'pdf';
    if (file.type.includes('word') || file.type.includes('document')) return 'doc';
    return 'other';
}

function getFileIconSVG(type) {
    const icons = {
        image: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`,
        pdf:   `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`,
        doc:   `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/></svg>`,
        other: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>`
    };
    return icons[type] || icons.other;
}

function formatFileSize(bytes) {
    if (bytes < 1024)        return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function renderFileList() {
    const list = document.getElementById('fileList');
    if (!list) return;

    if (!selectedFiles.length) {
        list.innerHTML = '';
        return;
    }

    list.innerHTML = selectedFiles.map((file, i) => {
        const iconType = getFileIconType(file);
        const isImage  = iconType === 'image';

        let previewHtml = '';
        if (isImage) {
            const url = URL.createObjectURL(file);
            previewHtml = `<img src="${url}" class="file-item-preview" alt="preview" onload="URL.revokeObjectURL(this.src)">`;
        }

        return `
            <div class="file-item">
                ${isImage ? previewHtml : `<div class="file-item-icon ${iconType}">${getFileIconSVG(iconType)}</div>`}
                <div class="file-item-info">
                    <div class="file-item-name">${file.name}</div>
                    <div class="file-item-size">${formatFileSize(file.size)}</div>
                </div>
                <button class="file-remove-btn" onclick="removeFile(${i})" title="Remove">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
            </div>`;
    }).join('');
}

// ===== ATTENDANCE =====
function renderAttendance() {
    const table = document.getElementById('attendanceTable');
    if (!table) return;
    table.innerHTML = `
        <thead>
            <tr><th>Date</th><th>Subject</th><th>Teacher</th><th>Status</th></tr>
        </thead>
        <tbody>
            ${ATTENDANCE_RECORDS.map(r => `
                <tr>
                    <td style="color:var(--dark);font-weight:500">${new Date(r.date).toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'})}</td>
                    <td>${r.subject}</td>
                    <td style="color:var(--text-light)">${r.teacher}</td>
                    <td><span class="att-badge ${r.status}">${r.status.charAt(0).toUpperCase()+r.status.slice(1)}</span></td>
                </tr>`).join('')}
        </tbody>`;
}

// ===== CALENDAR =====
function renderCalendar() {
    const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    document.getElementById('calMonthLabel').textContent = `${MONTHS[calMonth]} ${calYear}`;

    const wdEl = document.getElementById('calWeekdays');
    if (wdEl) wdEl.innerHTML = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => `<div class="cal-day-name">${d}</div>`).join('');

    const daysEl = document.getElementById('calDays');
    if (!daysEl) return;

    const firstDay = new Date(calYear, calMonth, 1).getDay();
    const lastDate = new Date(calYear, calMonth + 1, 0).getDate();
    const prevLast = new Date(calYear, calMonth, 0).getDate();
    const today    = new Date();
    let html = '';

    for (let i = firstDay - 1; i >= 0; i--) html += `<div class="cal-day other">${prevLast - i}</div>`;

    for (let d = 1; d <= lastDate; d++) {
        const ds    = `${calYear}-${String(calMonth+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
        const ev    = EVENTS[ds];
        const isToday = today.getDate()===d && today.getMonth()===calMonth && today.getFullYear()===calYear;
        html += `<div class="cal-day ${isToday?'today':''} ${ev?'has-event':''}">
            ${d}${ev ? `<span class="event-dot ${ev.type}"></span>` : ''}
        </div>`;
    }

    const total = firstDay + lastDate;
    const rem   = total <= 35 ? 35 - total : 42 - total;
    for (let i = 1; i <= rem; i++) html += `<div class="cal-day other">${i}</div>`;

    daysEl.innerHTML = html;
}

function changeMonth(dir) {
    calMonth += dir;
    if (calMonth > 11) { calMonth = 0; calYear++; }
    if (calMonth < 0)  { calMonth = 11; calYear--; }
    renderCalendar();
}

function renderEventsList(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    const now = new Date();
    const upcoming = Object.entries(EVENTS)
        .map(([ds, ev]) => ({ date: new Date(ds), ...ev }))
        .filter(e => e.date >= now)
        .sort((a,b) => a.date - b.date)
        .slice(0, 5);

    el.innerHTML = upcoming.length
        ? upcoming.map(e => `
            <div class="event-item ${e.type}">
                <div class="event-date-box">
                    <div class="event-day-num">${e.date.getDate()}</div>
                    <div class="event-month-str">${e.date.toLocaleString('en-US',{month:'short'})}</div>
                </div>
                <div class="event-info">
                    <h4>${e.title}</h4>
                    <p>${e.date.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})}</p>
                </div>
                <span class="event-type-chip ${e.type}">${e.type.charAt(0).toUpperCase()+e.type.slice(1)}</span>
            </div>`).join('')
        : '<div class="empty-state"><p>No upcoming events</p></div>';
}

// ===== UTILITIES =====
function toggleNotifications() {
    const n = JSON.parse(localStorage.getItem('ffhnas_announcements') || localStorage.getItem('schoolAnnouncements') || '[]').length;
    showToast('Notifications', `You have ${n} announcement${n !== 1 ? 's' : ''}`, 'info');
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('loggedInUser');
        showToast('Logged Out', 'Redirecting...', 'success');
        setTimeout(() => window.location.href = 'index.html', 1000);
    }
}

function showToast(title, message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<div class="toast-title">${title}</div><div class="toast-msg">${message}</div>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.transition = '0.3s';
        toast.style.opacity    = '0';
        toast.style.transform  = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}