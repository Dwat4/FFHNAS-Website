const API_URL = 'http://localhost/ffhnas/api'; // Change for production

// Login
async function login(email, password) {
    const response = await fetch(`${API_URL}/auth.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email, password })
    });
    const data = await response.json();
    
    if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        // Redirect based on role
        if (data.user.role === 'admin') window.location.href = 'admin.html';
        else if (data.user.role === 'teacher') window.location.href = 'teacher.html';
        else window.location.href = 'student.html';
    } else {
        alert(data.message);
    }
}

// Get announcements
async function getAnnouncements() {
    const response = await fetch(`${API_URL}/announcements.php`);
    const data = await response.json();
    return data.data;
}

// Create announcement
async function createAnnouncement(title, content, category) {
    const response = await fetch(`${API_URL}/announcements.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create', title, content, category })
    });
    return await response.json();
}

// Get grades
async function getGrades(studentId) {
    const response = await fetch(`${API_URL}/grades.php?student_id=${studentId}`);
    const data = await response.json();
    return data.data;
}

// Get messages
async function getMessages() {
    const response = await fetch(`${API_URL}/messages.php`);
    const data = await response.json();
    return data.data;
}

// Send message
async function sendMessage(recipientId, subject, message) {
    const response = await fetch(`${API_URL}/messages.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipient_id: recipientId, subject, message })
    });
    return await response.json();
}

// Get attendance
async function getAttendance(studentId) {
    const response = await fetch(`${API_URL}/attendance.php?student_id=${studentId}`);
    const data = await response.json();
    return data.data;
}