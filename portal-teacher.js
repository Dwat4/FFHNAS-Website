// ===== DATA =====
const sectionStudents = {
    'gc1-11a': [
        { id:'2024-0001', name:'Juan Dela Cruz',  prelim:88, midterm:90, finals:92 },
        { id:'2024-0002', name:'Maria Santos',    prelim:92, midterm:94, finals:95 },
        { id:'2024-0003', name:'Pedro Reyes',     prelim:85, midterm:87, finals:89 },
        { id:'2024-0004', name:'Ana Garcia',      prelim:90, midterm:91, finals:93 },
        { id:'2024-0005', name:'Jose Morales',    prelim:78, midterm:80, finals:82 }
    ],
    'gc1-11b': [
        { id:'2024-0011', name:'Carlos Rivera',   prelim:86, midterm:88, finals:90 },
        { id:'2024-0012', name:'Sofia Torres',    prelim:94, midterm:95, finals:96 },
        { id:'2024-0013', name:'Miguel Santos',   prelim:82, midterm:84, finals:86 },
        { id:'2024-0014', name:'Isabella Cruz',   prelim:91, midterm:92, finals:94 }
    ],
    'oc-12b': [
        { id:'2024-0021', name:'Roberto Diaz',    prelim:89, midterm:91, finals:93 },
        { id:'2024-0022', name:'Carmen Lopez',    prelim:95, midterm:96, finals:97 },
        { id:'2024-0023', name:'Luis Fernandez',  prelim:83, midterm:85, finals:87 }
    ],
    'spen-12a': [
        { id:'2024-0031', name:'Diana Reyes',     prelim:84, midterm:86, finals:88 },
        { id:'2024-0032', name:'Marco Villanueva',prelim:79, midterm:82, finals:84 },
        { id:'2024-0033', name:'Stella Ocampo',   prelim:90, midterm:88, finals:91 },
        { id:'2024-0034', name:'Rafael Lim',      prelim:83, midterm:85, finals:86 },
        { id:'2024-0035', name:'Janelle Bautista',prelim:88, midterm:87, finals:89 },
        { id:'2024-0036', name:'Nico Castillo',   prelim:76, midterm:78, finals:80 }
    ]
};

const sectionNames = {
    'all':'All Sections', 'gc1-11a':'11-STEM A', 'gc1-11b':'11-STEM B',
    'oc-12b':'12-STEM B', 'spen-12a':'12-STEM A'
};

const academicEvents = {
    '2026-02-20': { type:'exam',    title:'Midterm Exams Week' },
    '2026-02-25': { type:'event',   title:'Foundation Day' },
    '2026-02-28': { type:'meeting', title:'Faculty Meeting' },
    '2026-03-01': { type:'exam',    title:'Final Exams Begin' },
    '2026-03-06': { type:'meeting', title:'Department Meeting' },
    '2026-03-15': { type:'meeting', title:'Parent-Teacher Conference' },
    '2026-03-20': { type:'event',   title:'Science Fair' },
    '2026-04-01': { type:'holiday', title:'Holy Week' },
    '2026-04-09': { type:'holiday', title:'Araw ng Kagitingan' },
    '2026-05-01': { type:'holiday', title:'Labor Day' },
    '2026-05-10': { type:'event',   title:'Graduation Ceremony' }
};

let currentGradeSection      = 'gc1-11a';
let currentAttendanceSection  = 'gc1-11a';
let assignments = JSON.parse(localStorage.getItem('schoolAssignments') || '[]');
let currentMonth = 2; // March
let currentYear  = 2026;

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    // Navigation
    document.querySelectorAll('.portal-nav-link').forEach(link => {
        link.addEventListener('click', () => switchSection(link.getAttribute('data-section')));
    });

    // Dynamic greeting
    const now  = new Date();
    const hour = now.getHours();
    const greet = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
    document.getElementById('dashGreeting').textContent = `${greet}, Mrs. Santos! ðŸ‘‹`;
    document.getElementById('dashDate').textContent = now.toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'}) + ' Â· SY 2026-2027, 2nd Semester';
    const dashDateShort = document.getElementById('dashDateShort');
    if (dashDateShort) dashDateShort.textContent = now.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});

    // Init data
    initAnnouncements();
    loadGradesForSection(currentGradeSection);
    loadAttendanceForSection(currentAttendanceSection);
    loadAssignments();
    updateAssignmentCount();
    loadAnnouncements();
    renderCalendar();
    renderUpcomingEvents();

    const dateInput = document.getElementById('assignmentDueDate');
    if (dateInput) dateInput.setAttribute('min', new Date().toISOString().split('T')[0]);
});

// ===== NAVIGATION =====
function switchSection(name) {
    document.querySelectorAll('.portal-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.portal-nav-link').forEach(l => l.classList.remove('active'));
    document.getElementById(`section-${name}`)?.classList.add('active');
    document.querySelector(`[data-section="${name}"]`)?.classList.add('active');
    document.querySelector('.portal-main').scrollTop = 0;
}

// ===== ANNOUNCEMENTS =====
function initAnnouncements() {
    if (!localStorage.getItem('ffhnas_announcements')) {
        const sample = [
            { id:1, title:'Welcome to the New Semester', content:'We are excited to welcome all teachers for the new academic semester. Please review your class schedules and prepare your materials.', priority:'normal', postedBy:'Admin', date:'2026-02-20' },
            { id:2, title:'Urgent: Faculty Meeting Tomorrow', content:'There will be a mandatory faculty meeting tomorrow at 3:00 PM in the conference room. Attendance is required for all teaching staff.', priority:'urgent', postedBy:'Principal', date:'2026-02-24' }
        ];
        localStorage.setItem('ffhnas_announcements', JSON.stringify(sample));
    }
}

function loadAnnouncements() {
    const announcements = JSON.parse(localStorage.getItem('ffhnas_announcements') || '[]');
    announcements.sort((a,b) => new Date(b.date) - new Date(a.date));

    const badge = document.getElementById('announcementsBadge');
    const count = document.getElementById('announcementCount');
    if (badge) badge.textContent = announcements.length;
    if (count) count.textContent = `${announcements.length} announcement${announcements.length !== 1 ? 's' : ''}`;

    const renderAnn = (ann, showDelete = false) => `
        <div class="announcement-item ${ann.priority === 'urgent' ? 'urgent' : ''}">
            <div class="announcement-header">
                <h4 class="announcement-title">${ann.title}</h4>
                <div style="display:flex;align-items:center;gap:0.5rem;">
                    <span class="announcement-badge ${ann.priority === 'urgent' ? 'urgent' : ''}">${ann.priority === 'urgent' ? 'URGENT' : 'INFO'}</span>
                    ${showDelete ? `<button class="ann-delete-btn" onclick="deleteAnnouncement(${ann.id})">Delete</button>` : ''}
                </div>
            </div>
            <p class="announcement-content">${ann.content}</p>
            <div class="announcement-footer">
                <span>ðŸ‘¤ ${ann.postedBy}</span>
                <span>ðŸ“… ${new Date(ann.date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</span>
            </div>
        </div>`;

    const empty = '<div class="empty-state"><p>No announcements yet.</p></div>';
    const fullList = document.getElementById('announcementsList');
    const dashList = document.getElementById('dashboardAnnouncements');
    if (fullList) fullList.innerHTML = announcements.length ? announcements.map(a => renderAnn(a, false)).join('') : empty;
    if (dashList) dashList.innerHTML = announcements.length ? announcements.slice(0,3).map(a => renderAnn(a, false)).join('') : empty;
}

function postAnnouncement() {
    const title    = document.getElementById('annTitle').value.trim();
    const content  = document.getElementById('annContent').value.trim();
    const priority = document.getElementById('annPriority').value;
    const postedBy = document.getElementById('annPostedBy').value.trim() || 'Mrs. Santos';

    if (!title || !content) { showToast('Error', 'Please fill in title and content.', 'error'); return; }

    const announcements = JSON.parse(localStorage.getItem('ffhnas_announcements') || '[]');
    announcements.push({ id: Date.now(), title, content, priority, postedBy, date: new Date().toISOString().split('T')[0] });
    localStorage.setItem('ffhnas_announcements', JSON.stringify(announcements));

    document.getElementById('annTitle').value   = '';
    document.getElementById('annContent').value = '';
    document.getElementById('annPriority').value = 'normal';

    loadAnnouncements();
    showToast('Posted!', `"${title}" announcement published.`, 'success');
}

function deleteAnnouncement(id) {
    if (!confirm('Delete this announcement?')) return;
    let announcements = JSON.parse(localStorage.getItem('ffhnas_announcements') || '[]');
    announcements = announcements.filter(a => a.id !== id);
    localStorage.setItem('ffhnas_announcements', JSON.stringify(announcements));
    loadAnnouncements();
    showToast('Deleted', 'Announcement removed.', 'success');
}

// ===== GRADES =====
const API = 'http://localhost/school/api/';

function changeGradeSection(sectionId) {
    currentGradeSection = sectionId;
    loadGradesForSection(sectionId);
}

function loadGradesForSection(sectionId) {
    const tbody = document.getElementById('gradesTableBody');
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:2rem;color:var(--text-light);">Loading...</td></tr>`;

    fetch(`http://localhost/school/api/get_grades.php?section=${sectionId}`)
        .then(r => r.json())
        .then(students => {
            if (!students.length) {
                tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:2rem;color:var(--text-light);">No students in this section</td></tr>`;
                return;
            }

            const gClass  = g => g >= 90 ? 'excellent' : g >= 85 ? 'good' : g >= 75 ? 'average' : 'low';
            const remarks = g => g >= 90 ? 'Excellent' : g >= 85 ? 'Very Good' : g >= 75 ? 'Passing' : 'Needs Improvement';

            tbody.innerHTML = students.map(s => {
                const final = (s.q1 * 0.3 + s.q2 * 0.3 + s.q3 * 0.4).toFixed(1);
                return `
                    <tr>
                        <td style="color:var(--text-light);font-size:0.82rem;">${s.student_id}</td>
                        <td><strong style="color:var(--dark)">${s.name}</strong></td>
                        <td><input type="number" class="grade-input" id="q1_${s.id}" value="${s.q1 || ''}" min="0" max="100" oninput="recalcFinal('${s.id}')"></td>
                        <td><input type="number" class="grade-input" id="q2_${s.id}" value="${s.q2 || ''}" min="0" max="100" oninput="recalcFinal('${s.id}')"></td>
                        <td><input type="number" class="grade-input" id="q3_${s.id}" value="${s.q3 || ''}" min="0" max="100" oninput="recalcFinal('${s.id}')"></td>
                        <td><strong id="final_${s.student_id}" style="font-size:1rem;color:var(--dark)">${final}</strong></td>
                        <td><span class="grade-badge ${gClass(parseFloat(final))}" id="remarks_${s.student_id}">${remarks(parseFloat(final))}</span></td>
                        <td><button class="btn-sm btn-save" onclick="saveGrade('${s.id}', '${s.name}', '${sectionId}')">Save</button></td>
                    </tr>`;
            }).join('');

            // Update stats
            const avgs    = students.map(s => s.q1*0.3 + s.q2*0.3 + s.q3*0.4);
            const avg     = (avgs.reduce((a,b) => a+b,0) / avgs.length).toFixed(1);
            const passing = avgs.filter(g => g >= 75).length;
            document.getElementById('sectionAvg').textContent          = avg;
            document.getElementById('sectionStudentCount').textContent  = students.length;
            document.getElementById('sectionPassRate').textContent      = Math.round((passing/students.length)*100) + '%';
        })
        .catch(() => {
            tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:2rem;color:var(--danger);">Failed to load grades. Check your PHP server.</td></tr>`;
        });
}

function recalcFinal(studentId) {
    const p = parseFloat(document.getElementById(`prelim_${studentId}`)?.value)  || 0;
    const m = parseFloat(document.getElementById(`midterm_${studentId}`)?.value) || 0;
    const f = parseFloat(document.getElementById(`finals_${studentId}`)?.value)  || 0;
    const final = (p*0.3 + m*0.3 + f*0.4).toFixed(1);
    const gClass  = g => g >= 90 ? 'excellent' : g >= 85 ? 'good' : g >= 75 ? 'average' : 'low';
    const remarks = g => g >= 90 ? 'Excellent' : g >= 85 ? 'Very Good' : g >= 75 ? 'Passing' : 'Needs Improvement';
    const finalEl   = document.getElementById(`final_${studentId}`);
    const remarksEl = document.getElementById(`remarks_${studentId}`);
    if (finalEl)   finalEl.textContent   = final;
    if (remarksEl) { remarksEl.textContent = remarks(parseFloat(final)); remarksEl.className = `grade-badge ${gClass(parseFloat(final))}`; }
}

function saveGrade(studentId, name, sectionId) {
    const q1 = document.getElementById(`q1_${studentId}`)?.value;
    const q2 = document.getElementById(`q2_${studentId}`)?.value;
    const q3 = document.getElementById(`q3_${studentId}`)?.value;
    const q4 = document.getElementById(`q4_${studentId}`)?.value;

    fetch(`${API}/save_grade.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: studentId, section: sectionId, q1, q2, q3, q4 })
    })
    .then(r => r.json())
    .then(res => {
        if (res.success) showToast('Saved!', `${name}'s grades saved successfully.`, 'success');
        else             showToast('Error', res.message || 'Failed to save grades.', 'error');
    })
    .catch(() => showToast('Error', 'Could not connect to server.', 'error'));
}

function exportGrades() {
    window.open(`${API}/export_grades.php?section=${currentGradeSection}`, '_blank');
}

function submitAllGrades() {
    if (!confirm('Submit all grades for this section?')) return;
    fetch(`${API}/submit_all_grades.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: currentGradeSection })
    })
    .then(r => r.json())
    .then(res => {
        if (res.success) showToast('Submitted!', 'All grades submitted successfully.', 'success');
        else             showToast('Error', res.message || 'Failed to submit.', 'error');
    })
    .catch(() => showToast('Error', 'Could not connect to server.', 'error'));
}


// ===== ATTENDANCE =====
function changeAttendanceSection(sectionId) {
    currentAttendanceSection = sectionId;
    loadAttendanceForSection(sectionId);
}

function loadAttendanceForSection(sectionId) {
    const container = document.getElementById('attendanceTrackingBody');
    container.innerHTML = `<div style="padding:2rem;text-align:center;color:var(--text-light);">Loading...</div>`;

    const today = new Date().toISOString().split('T')[0];

    fetch(`${API}/get_attendance.php?section=${sectionId}&date=${today}`)
        .then(r => r.json())
        .then(students => {
            container.innerHTML = students.map(s => `
                <div class="attendance-student">
                    <div class="student-info">
                        <span class="student-name">${s.name}</span>
                        <span class="student-id">${s.student_id}</span>
                    </div>
                    <div class="attendance-buttons">
                       onclick="markAttendance('${s.id}', '${s.name}', 'Present', this)"
onclick="markAttendance('${s.id}', '${s.name}', 'Absent',  this)"
onclick="markAttendance('${s.id}', '${s.name}', 'Late',    this)"
                    </div>
                </div>`).join('');
            updateAttendanceCounts();
        })
        .catch(() => {
            container.innerHTML = `<div style="padding:2rem;text-align:center;color:var(--danger);">Failed to load attendance. Check your PHP server.</div>`;
        });
}

function markAttendance(studentId, name, status, btn) {
    btn.closest('.attendance-buttons').querySelectorAll('.btn-attendance').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    updateAttendanceCounts();

    const today = new Date().toISOString().split('T')[0];
    fetch(`${API}/mark_attendance.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: studentId, section: currentAttendanceSection, date: today, status })
    })
    .then(r => r.json())
    .then(res => { if (!res.success) showToast('Error', `Failed to save ${name}'s attendance.`, 'error'); })
    .catch(() => showToast('Error', 'Could not connect to server.', 'error'));
}

function updateAttendanceCounts() {
    document.getElementById('attPresentCount').textContent = document.querySelectorAll('.btn-attendance.present.selected').length;
    document.getElementById('attAbsentCount').textContent  = document.querySelectorAll('.btn-attendance.absent.selected').length;
    document.getElementById('attLateCount').textContent    = document.querySelectorAll('.btn-attendance.late.selected').length;
}

function markAllPresent() {
    document.querySelectorAll('.attendance-buttons').forEach(group => {
        group.querySelectorAll('.btn-attendance').forEach(b => b.classList.remove('selected'));
        group.querySelector('.btn-attendance.present')?.classList.add('selected');
    });
    updateAttendanceCounts();

    const today = new Date().toISOString().split('T')[0];
    fetch(`${API}/mark_all_present.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: currentAttendanceSection, date: today })
    })
    .then(r => r.json())
    .then(res => {
        if (res.success) showToast('All Present', 'All students marked as present.', 'success');
        else             showToast('Error', res.message || 'Failed.', 'error');
    })
    .catch(() => showToast('Error', 'Could not connect to server.', 'error'));
}

function submitAttendance() {
    const total  = document.querySelectorAll('.attendance-student').length;
    const marked = document.querySelectorAll('.btn-attendance.selected').length;
    if (marked < total) { showToast('Warning', `${total - marked} student(s) not yet marked.`, 'error'); return; }
    showToast('Saved!', 'Attendance already saved in real-time as you marked each student.', 'success');
}

// ===== ASSIGNMENTS =====
function createAssignment() {
    const subject  = document.getElementById('assignmentSubject').value;
    const section  = document.getElementById('assignmentSection').value;
    const title    = document.getElementById('assignmentTitle').value.trim();
    const desc     = document.getElementById('assignmentDescription').value.trim();
    const dueDate  = document.getElementById('assignmentDueDate').value;
    const points   = parseInt(document.getElementById('assignmentPoints').value);
    const type     = document.getElementById('assignmentType').value;

    if (!title || !desc || !dueDate) { showToast('Error', 'Please fill in all required fields.', 'error'); return; }

    assignments.push({
        id: Date.now(), subject, section,
        sectionName: sectionNames[section] || section,
        title, description: desc, dueDate, points, type,
        createdAt: new Date().toISOString(),
        status: 'active', submissions: []
    });

    localStorage.setItem('schoolAssignments', JSON.stringify(assignments));

    document.getElementById('assignmentTitle').value       = '';
    document.getElementById('assignmentDescription').value = '';
    document.getElementById('assignmentDueDate').value     = '';
    document.getElementById('assignmentPoints').value      = '100';
    document.getElementById('assignmentSection').value     = 'all';
    document.getElementById('assignmentType').value        = 'homework';

    loadAssignments();
    updateAssignmentCount();
    showToast('Created!', `"${title}" posted to ${sectionNames[section]}.`, 'success');
}

function loadAssignments() {
    const container   = document.getElementById('assignmentsList');
    const filterValue = document.getElementById('assignFilterSection')?.value || 'all';
    const filtered    = filterValue === 'all' ? assignments : assignments.filter(a => a.section === filterValue || a.section === 'all');

    if (!filtered.length) {
        container.innerHTML = '<div class="empty-state"><p>No assignments found.</p></div>';
        return;
    }

    const typeColors = { homework:'blue', quiz:'amber', project:'purple', 'lab-report':'green', exam:'red' };

    container.innerHTML = [...filtered].sort((a,b) => new Date(a.dueDate) - new Date(b.dueDate)).map(a => {
        const due   = new Date(a.dueDate);
        const days  = Math.ceil((due - new Date()) / 86400000);
        let dueText = due.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
        let dueColor = 'var(--text-light)';
        if (days < 0) { dueText += ' Â· Overdue'; dueColor = 'var(--danger)'; }
        else if (days === 0) { dueText += ' Â· Today!'; dueColor = 'var(--accent)'; }
        else if (days <= 3) { dueText += ` Â· ${days}d left`; dueColor = 'var(--accent)'; }

        return `
            <div class="assignment-item">
                <div class="assignment-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                </div>
                <div class="assignment-details">
                    <h4>${a.title}</h4>
                    <div class="assignment-meta">
                        <span class="chip ${typeColors[a.type] || 'blue'}">${(a.type || 'homework').replace('-',' ')}</span>
                        <span>ðŸ“š ${a.subject}</span>
                        <span class="chip green">${a.sectionName}</span>
                        <span style="color:${dueColor};font-weight:600;">ðŸ“… ${dueText}</span>
                        <span>ðŸ‘¥ ${a.submissions.length} submitted</span>
                        <span>ðŸ“Š ${a.points} pts</span>
                    </div>
                    <p style="font-size:0.82rem;color:var(--text);margin-top:0.375rem;line-height:1.5;">${a.description}</p>
                </div>
                <div class="assignment-actions">
                    <button class="btn-assignment-action" onclick="viewAssignmentDetails(${a.id})">View</button>
                    <button class="btn-assignment-delete" onclick="deleteAssignment(${a.id})">Delete</button>
                </div>
            </div>`;
    }).join('');
}

function updateAssignmentCount() {
    const badge = document.getElementById('assignmentsBadge');
    const dash  = document.getElementById('dashAssignmentCount');
    if (badge) badge.textContent = assignments.length;
    if (dash)  dash.textContent  = assignments.length;
}

function viewAssignmentDetails(id) {
    const a = assignments.find(x => x.id === id);
    if (a) showToast('Assignment Details', `"${a.title}" Â· ${a.submissions.length} submission(s) Â· ${a.points} pts`, 'info');
}

function deleteAssignment(id) {
    if (!confirm('Delete this assignment?')) return;
    assignments = assignments.filter(a => a.id !== id);
    localStorage.setItem('schoolAssignments', JSON.stringify(assignments));
    loadAssignments();
    updateAssignmentCount();
    showToast('Deleted', 'Assignment removed.', 'success');
}

// ===== CALENDAR =====
function renderCalendar() {
    const container  = document.getElementById('calendar-container');
    const firstDay   = new Date(currentYear, currentMonth, 1);
    const lastDay    = new Date(currentYear, currentMonth + 1, 0);
    const prevLast   = new Date(currentYear, currentMonth, 0);
    const today      = new Date();

    let html = '<div class="calendar-weekdays">';
    ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach(d => html += `<div class="calendar-weekday">${d}</div>`);
    html += '</div><div class="calendar-days">';

    for (let x = firstDay.getDay(); x > 0; x--) html += `<div class="calendar-day other-month">${prevLast.getDate() - x + 1}</div>`;

    for (let i = 1; i <= lastDay.getDate(); i++) {
        const ds    = `${currentYear}-${String(currentMonth+1).padStart(2,'0')}-${String(i).padStart(2,'0')}`;
        const event = academicEvents[ds];
        const isToday = today.getDate()===i && today.getMonth()===currentMonth && today.getFullYear()===currentYear;
        html += `<div class="calendar-day ${isToday?'current':''} ${event?'has-event':''}">
            ${i}${event ? `<span class="event-dot ${event.type}"></span>` : ''}
        </div>`;
    }

    const remaining = 42 - (firstDay.getDay() + lastDay.getDate());
    for (let i = 1; i <= remaining; i++) html += `<div class="calendar-day other-month">${i}</div>`;
    html += '</div>';

    container.innerHTML = html;
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    document.getElementById('calendarMonth').textContent = `${months[currentMonth]} ${currentYear}`;
}

function changeMonth(dir) {
    currentMonth += dir;
    if (currentMonth > 11) { currentMonth = 0; currentYear++; }
    if (currentMonth < 0)  { currentMonth = 11; currentYear--; }
    renderCalendar();
}

function renderUpcomingEvents() {
    const list  = document.getElementById('events-list');
    const today = new Date();
    const upcoming = Object.entries(academicEvents)
        .map(([ds, ev]) => ({ date: new Date(ds), ...ev }))
        .filter(e => e.date >= today)
        .sort((a,b) => a.date - b.date)
        .slice(0, 6);

    list.innerHTML = upcoming.map(e => {
        const cls = e.type === 'holiday' ? 'holiday-event' : e.type === 'exam' ? 'exam-event' : e.type === 'meeting' ? 'meeting-event' : 'school-event';
        return `
            <div class="event-item ${cls}">
                <div class="event-date">
                    <span class="event-day">${e.date.getDate()}</span>
                    <span class="event-month">${e.date.toLocaleString('en-US',{month:'short'}).toUpperCase()}</span>
                </div>
                <div class="event-info">
                    <h4>${e.title}</h4>
                    <p>${e.date.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})}</p>
                </div>
                <span class="event-type ${e.type}">${e.type.charAt(0).toUpperCase()+e.type.slice(1)}</span>
            </div>`;
    }).join('');
}

// ===== UTILITIES =====
function toggleNotifications() {
    showToast('Notifications', '3 new notifications pending.', 'info');
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
    const colors    = { success:'#10b981', error:'#ef4444', info:'#3b82f6' };
    const toast     = document.createElement('div');
    toast.style.cssText = `background:white;padding:1rem 1.5rem;border-radius:0.625rem;box-shadow:0 4px 20px rgba(0,0,0,0.12);margin-bottom:0.75rem;border-left:4px solid ${colors[type]};animation:slideIn 0.3s ease;min-width:280px;max-width:380px;`;
    toast.innerHTML = `<strong style="display:block;margin-bottom:0.25rem;color:#1e293b;font-size:0.875rem;">${title}</strong><p style="margin:0;color:#64748b;font-size:0.82rem;">${message}</p>`;
    container.appendChild(toast);
    setTimeout(() => { toast.style.transition='0.3s'; toast.style.opacity='0'; toast.style.transform='translateX(100%)'; setTimeout(() => toast.remove(), 300); }, 4000);
}