// ========================================
// CONFIGURATION
// ========================================
const CONFIG = {
    API_URL: 'http://localhost/school/api',
    ADMIN_SECRET_KEY: 'FFHNAS_ADMIN_2026'
};

// ========================================
// UTILITY FUNCTIONS
// ========================================
const Utils = {
    showToast(title, message, type = 'success') {
        const toastContainer = document.getElementById('toastContainer');
        const iconMap = {
            success: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
            error: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" x2="9" y1="9" y2="15"/><line x1="9" x2="15" y1="9" y2="15"/></svg>',
            info: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12.01" y1="8" y2="8"/></svg>'
        };
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-icon ${type}">${iconMap[type]}</div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" onclick="this.parentElement.remove()">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/>
                </svg>
            </button>
        `;
        toastContainer.appendChild(toast);
        setTimeout(() => {
            toast.style.animation = 'toastSlideIn 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }, 5000);
    },

    lockScroll() { document.body.style.overflow = 'hidden'; },
    unlockScroll() { document.body.style.overflow = ''; },

    openModal(modalId) {
        document.getElementById(modalId)?.classList.add('active');
        this.lockScroll();
    },

    closeModal(modalId) {
        document.getElementById(modalId)?.classList.remove('active');
        this.unlockScroll();
    }
};

// ========================================
// USER SESSION MANAGEMENT
// ========================================
const UserSession = {
    init() {
        this.checkLoginStatus();
    },

    checkLoginStatus() {
        const userData = localStorage.getItem('loggedInUser');
        if (userData) {
            try {
                const user = JSON.parse(userData);
                this.updateNavigationForLoggedInUser(user);
            } catch (error) {
                localStorage.removeItem('loggedInUser');
            }
        }
    },

    updateNavigationForLoggedInUser(user) {
        const roleName = user.role.charAt(0).toUpperCase() + user.role.slice(1);

        const updateButtons = (buttons) => {
            if (buttons.length < 2) return;
            buttons[0].textContent = `${roleName} Portal`;
            buttons[0].style.cssText = 'padding:0.5rem 1.25rem;border-radius:0.5rem;font-weight:500;color:var(--text);transition:all 0.2s ease;';
            buttons[0].onclick = (e) => { e.preventDefault(); this.navigateToPortal(user.role); };
            buttons[1].textContent = 'Logout';
            buttons[1].style.cssText = 'padding:0.5rem 1.25rem;border-radius:0.5rem;font-weight:500;color:white;transition:all 0.2s ease;background:linear-gradient(135deg,#ef4444 0%,#dc2626 100%);';
            buttons[1].onclick = (e) => { e.preventDefault(); this.logout(); };
        };

        updateButtons(document.querySelectorAll('.navbar button'));
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu) updateButtons(mobileMenu.querySelectorAll('button'));
    },

    navigateToPortal(role) {
        const portalMap = { student: 'student-portal.html', teacher: 'teacher-portal.html', admin: 'admin-portal.html' };
        window.location.href = portalMap[role] || 'portal.html';
    },

    logout() {
        localStorage.removeItem('loggedInUser');
        Utils.showToast('Logged Out', 'You have been successfully logged out.', 'success');
        setTimeout(() => window.location.reload(), 1000);
    }
};

// ========================================
// PAGE INITIALIZATION
// ========================================
const PageLoader = {
    init() {
        this.setupHeroBackground();
        window.addEventListener('load', () => {
            const loadingScreen = document.getElementById('loadingScreen');
            setTimeout(() => {
                loadingScreen?.classList.add('hidden');
                ScrollAnimations.initReveal();
                this.animateCounters();
            }, 1500);
        });
    },

    setupHeroBackground() {
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.backgroundImage = "linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.6)),url('http://localhost/school/assets-image/background.jpg')";
            hero.style.backgroundSize = 'cover';
            hero.style.backgroundPosition = 'center';
            hero.style.backgroundAttachment = 'fixed';
        }
    },

    animateCounters() {
        document.querySelectorAll('.stat-value[data-target]').forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const increment = target / (2000 / 16);
            const label = counter.nextElementSibling?.textContent || '';
            const isPercentage = label.includes('Graduating');
            const needsPlus = label.includes('Students') || label.includes('Teachers');
            let current = 0;
            const update = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current) + (isPercentage ? '%' : needsPlus ? '+' : '');
                    requestAnimationFrame(update);
                } else {
                    counter.textContent = target + (isPercentage ? '%' : needsPlus ? '+' : '');
                }
            };
            update();
        });
    }
};

// ========================================
// SCROLL ANIMATIONS & EFFECTS
// ========================================
const ScrollAnimations = {
    init() {
        this.setupScrollProgress();
        this.setupHeaderScroll();
        this.setupBackToTop();
        this.setupActiveNavLinks();
    },

    setupScrollProgress() {
        const scrollProgress = document.getElementById('scrollProgress');
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            if (scrollProgress) scrollProgress.style.transform = `scaleX(${scrollTop / scrollHeight})`;
        });
    },

    setupHeaderScroll() {
        window.addEventListener('scroll', () => {
            document.getElementById('header')?.classList.toggle('scrolled', window.pageYOffset > 50);
        });
    },

    setupBackToTop() {
        window.addEventListener('scroll', () => {
            document.getElementById('backToTop')?.classList.toggle('visible', window.pageYOffset > 500);
        });
        document.getElementById('backToTop')?.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    },

    initReveal() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('active'); });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        document.querySelectorAll('.section, .announcement-card, .facility-card, .service-card').forEach(el => {
            el.classList.add('reveal');
            observer.observe(el);
        });
    },

    setupActiveNavLinks() {
        const navLinks = document.querySelectorAll('.nav-link, .mobile-link');
        const sections = document.querySelectorAll('section[id]');
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                if (window.pageYOffset >= section.offsetTop - 100) current = section.getAttribute('id');
            });
            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
            });
        });
    }
};

// ========================================
// NAVIGATION
// ========================================
const Navigation = {
    init() {
        this.setupMobileMenu();
        this.setupSmoothScroll();
    },

    setupMobileMenu() {
        const mobileMenu = document.getElementById('mobileMenu');
        document.getElementById('hamburger')?.addEventListener('click', () => {
            mobileMenu?.classList.add('active');
            Utils.lockScroll();
        });
        document.getElementById('mobileClose')?.addEventListener('click', () => {
            mobileMenu?.classList.remove('active');
            Utils.unlockScroll();
        });
        document.querySelectorAll('.mobile-link').forEach(link => {
            link.addEventListener('click', () => { mobileMenu?.classList.remove('active'); Utils.unlockScroll(); });
        });
    },

    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href !== '#' && href.length > 1) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
                }
            });
        });
    }
};

// ========================================
// AUTHENTICATION SYSTEM
// ========================================
const Auth = {
    init() {
        this.setupLoginModal();
        this.setupAuthTabs();
        this.setupRoleSelector();
        this.setupAdminKeyToggle();
        this.setupLoginForm();
        this.setupRegisterForm();
    },

    setupLoginModal() {
        window.openLoginModal = () => Utils.openModal('loginModal');
        window.closeLoginModal = () => Utils.closeModal('loginModal');
    },

    setupAuthTabs() {
        document.querySelectorAll('[data-auth-tab]').forEach(tab => {
            tab.addEventListener('click', function() {
                const targetTab = this.getAttribute('data-auth-tab');
                document.querySelectorAll('[data-auth-tab]').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
                (targetTab === 'login' ? document.getElementById('loginForm') : document.getElementById('registerForm'))?.classList.add('active');
            });
        });
    },

    setupRoleSelector() {
        const loginTabs = document.querySelectorAll('.login-tab[data-type]');
        const loginSubmitBtn = document.getElementById('loginSubmitBtn');
        loginTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                loginTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                const typeName = this.getAttribute('data-type');
                if (loginSubmitBtn) {
                    loginSubmitBtn.innerHTML = `Sign In as ${typeName.charAt(0).toUpperCase() + typeName.slice(1)} <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`;
                }
            });
        });
    },

    setupAdminKeyToggle() {
    document.getElementById('regRole')?.addEventListener('change', function() {
        const adminKeyGroup = document.getElementById('adminKeyGroup');
        const adminKeyInput = document.getElementById('regAdminKey');
        const lrnGroup = document.getElementById('regLrnGroup');
        const lrnInput = document.getElementById('regLrn');
        const teacherFields = document.getElementById('teacherFieldsGroup');

        if (this.value === 'admin') {
            if (adminKeyGroup) adminKeyGroup.style.display = 'block';
            if (adminKeyInput) { adminKeyInput.required = true; }
            if (lrnGroup) lrnGroup.style.display = 'none';
            if (lrnInput) lrnInput.required = false;
            if (teacherFields) teacherFields.style.display = 'none';
        } else if (this.value === 'student') {
            if (adminKeyGroup) adminKeyGroup.style.display = 'none';
            if (adminKeyInput) { adminKeyInput.required = false; adminKeyInput.value = ''; }
            if (lrnGroup) lrnGroup.style.display = 'block';
            if (lrnInput) lrnInput.required = true;
            if (teacherFields) teacherFields.style.display = 'none';
            const addrGroup = document.getElementById('regAddressGroup');
    const guardGroup = document.getElementById('regGuardianGroup');
    if (addrGroup) addrGroup.style.display = 'block';
    if (guardGroup) guardGroup.style.display = 'block';
        } else if (this.value === 'teacher') {
            if (adminKeyGroup) adminKeyGroup.style.display = 'none';
            if (adminKeyInput) { adminKeyInput.required = false; adminKeyInput.value = ''; }
            if (lrnGroup) lrnGroup.style.display = 'none';
            if (lrnInput) lrnInput.required = false;
            if (teacherFields) teacherFields.style.display = 'block';
        } else {
            if (adminKeyGroup) adminKeyGroup.style.display = 'none';
            if (adminKeyInput) { adminKeyInput.required = false; adminKeyInput.value = ''; }
            if (lrnGroup) lrnGroup.style.display = 'none';
            if (lrnInput) lrnInput.required = false;
            if (teacherFields) teacherFields.style.display = 'none';
            const addrGroup = document.getElementById('regAddressGroup');
    const guardGroup = document.getElementById('regGuardianGroup');
    if (addrGroup) addrGroup.style.display = 'none';
    if (guardGroup) guardGroup.style.display = 'none';
        }
    });
},

    async setupLoginForm() {
    document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const role = document.querySelector('.login-tab[data-type].active')?.getAttribute('data-type') || 'student';

        if (!email || !password) { Utils.showToast('Error', 'Please fill in all fields', 'error'); return; }

        // Block student login if registration is still pending approval
        if (role === 'student') {
            const pending = JSON.parse(localStorage.getItem('ffhnas_pending_registrations') || '[]');
            if (pending.find(p => p.email === email)) {
                Utils.showToast('Pending Approval', 'Your account is pending admin approval. Please wait before logging in.', 'info');
                return;
            }
        }

        try {
            const response = await fetch(`${CONFIG.API_URL}/auth.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'login', email, password, role })
            });
            const data = await response.json();
            if (data.success) {
    const existing = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
    const merged = {
        ...data.user,
        employee_id: data.user.employee_id || existing.employee_id || '',
        contact:     data.user.contact     || existing.contact     || '',
        department:  data.user.department  || existing.department  || ''
    };
    localStorage.setItem('loggedInUser', JSON.stringify(merged));
                Utils.showToast('Welcome!', `Logged in as ${data.user.first_name}`, 'success');
                Utils.closeModal('loginModal');
                setTimeout(() => UserSession.init(), 500);
            } else {
                Utils.showToast('Login Failed', data.message, 'error');
            }
        } catch (error) {
            Utils.showToast('Connection Error', 'Cannot connect to server. Check XAMPP MySQL status.', 'error');
        }
    });
},

async setupRegisterForm() {
    document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const firstName = document.getElementById('regFirstName').value.trim();
        const lastName = document.getElementById('regLastName').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const password = document.getElementById('regPassword').value;
        const role = document.getElementById('regRole').value;
        const adminKey = document.getElementById('regAdminKey').value;
        const employeeId = document.getElementById('regEmployeeId')?.value.trim() || '';
        const contact = document.getElementById('regContact')?.value.trim() || '';
        const department = document.getElementById('regDepartment')?.value.trim() || '';

        if (!role) { Utils.showToast('Error', 'Please select a role', 'error'); return; }
        if (!firstName || !lastName || !email || !password) { Utils.showToast('Error', 'Please fill in all fields', 'error'); return; }

        try {
            if (role === 'student') {
                const pending = JSON.parse(localStorage.getItem('ffhnas_pending_registrations') || '[]');
                
                if (pending.find(p => p.email === email)) {
                    Utils.showToast('Already Submitted', 'A registration request with this email already exists.', 'error');
                    return;
                }

                pending.push({
    id: Date.now(),
    firstName,
    lastName,
    email,
    password,
    role,
    lrn: document.getElementById('regLrn').value,
    address: document.getElementById('regAddress')?.value.trim() || '',
    guardianName: document.getElementById('regGuardianName')?.value.trim() || '',
    guardianContact: document.getElementById('regGuardianContact')?.value.trim() || '',
    submitted_at: new Date().toISOString(),
    status: 'pending'
});

                localStorage.setItem('ffhnas_pending_registrations', JSON.stringify(pending));
                Utils.showToast('Request Submitted!', 'Your registration is pending admin approval.', 'success');
                document.querySelector('[data-auth-tab="login"]')?.click();
                document.getElementById('regAddress').value = '';
document.getElementById('regGuardianName').value = '';
document.getElementById('regGuardianContact').value = '';
document.getElementById('regAddressGroup').style.display = 'none';
document.getElementById('regGuardianGroup').style.display = 'none';
                document.getElementById('registerForm').reset();
                document.getElementById('regLrnGroup').style.display = 'none';
            } else {
                const response = await fetch(`${CONFIG.API_URL}/auth.php`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'register',
                        firstName, lastName, email, password, role,
                        adminKey: role === 'admin' ? adminKey : '',
                        employee_id: employeeId,
                        contact,
                        department
                    })
                });

                const data = await response.json();

                if (data.success) {
    // Store extra registration fields so profile can read them
    if (data.user) {
        data.user.employee_id = employeeId;
        data.user.contact     = contact;
        data.user.department  = department;
        localStorage.setItem('loggedInUser', JSON.stringify(data.user));
    }
    Utils.showToast('Registration Successful!', 'Please login with your credentials.', 'success');
    document.querySelector('[data-auth-tab="login"]')?.click();
    document.getElementById('registerForm').reset();
    document.getElementById('adminKeyGroup').style.display = 'none';
    const tf = document.getElementById('teacherFieldsGroup');
    if (tf) tf.style.display = 'none';
    document.getElementById('loginEmail').value = email;
                } else {
                    Utils.showToast('Registration Failed', data.message, 'error');
                }
            }
        } catch (error) {
            console.error('Registration error:', error);
            Utils.showToast('Connection Error', 'Cannot connect to server. Check XAMPP MySQL status.', 'error');
        }
    });
}
};

// ========================================
// ANNOUNCEMENTS MODULE
// ========================================
const Announcements = {
    data: [],

    init() {
        this.loadFromLocalStorage();
        this.render();
        setInterval(() => { this.loadFromLocalStorage(); this.render(); }, 30000);
    },

    loadFromLocalStorage() {
        const stored = localStorage.getItem('ffhnas_announcements');
        if (!stored) { this.data = []; return; }
        try {
            this.data = JSON.parse(stored).map(item => ({
                id: item.id,
                title: item.title,
                excerpt: item.content.substring(0, 150) + '...',
                category: item.category.charAt(0).toUpperCase() + item.category.slice(1),
                badge: item.category === 'urgent' ? 'urgent' : item.category === 'academic' ? 'success' : 'info',
                date: new Date(item.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
                image: item.photo_path
                    ? (item.photo_path.startsWith('data:') ? item.photo_path : `http://localhost/school/${item.photo_path}`)
                    : this.getDefaultImage(item.category),
                content: item.content,
                creator: item.creator_name || 'Administrator'
            }));
        } catch { this.data = []; }
    },

    getDefaultImage(category) {
        const images = {
            urgent: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=80',
            academic: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
            event: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80',
            general: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80'
        };
        return images[category] || images.general;
    },

    render() {
        const grid = document.getElementById('announcementsGrid');
        if (!grid) return;
        if (!this.data.length) {
            grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:4rem 2rem;color:var(--text-light);"><svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin:0 auto 1rem;opacity:0.3;"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg><h3 style="font-size:1.25rem;margin-bottom:0.5rem;color:var(--dark);">No Announcements Yet</h3><p>Check back later for updates.</p></div>`;
            return;
        }
        grid.innerHTML = this.data.slice(0, 3).map(item => `
            <div class="announcement-card" onclick="Announcements.openDetail(${item.id})">
                <div class="announcement-image" style="background-image:url('${item.image}')"></div>
                <div class="announcement-content">
                    <div class="announcement-meta">
                        <span class="announcement-badge ${item.badge}">${item.category}</span>
                        <span>${item.date}</span>
                    </div>
                    <h3 class="announcement-title">${item.title}</h3>
                    <p class="announcement-excerpt">${item.excerpt}</p>
                    <div class="announcement-footer">
                        <span style="font-size:0.85rem;color:var(--text-light);">By ${item.creator}</span>
                        <span class="read-more">Read More <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></span>
                    </div>
                </div>
            </div>
        `).join('');
    },

    openDetail(id) {
        const a = this.data.find(x => x.id === id);
        if (!a) return;
        document.getElementById('announcementModalContent').innerHTML = `
            <div class="announcement-modal-header" style="background-image:url('${a.image}')">
                <div class="announcement-modal-overlay">
                    <span class="announcement-badge ${a.badge}">${a.category}</span>
                    <h2>${a.title}</h2>
                    <p class="announcement-date">${a.date} • By ${a.creator}</p>
                </div>
            </div>
            <div class="announcement-modal-body">
                <p style="white-space:pre-wrap;line-height:1.8;">${a.content}</p>
            </div>
        `;
        Utils.openModal('announcementModal');
    },

    openAll() {
        const grid = document.getElementById('allAnnouncementsGrid');
        grid.innerHTML = !this.data.length
            ? `<div style="grid-column:1/-1;text-align:center;padding:4rem 2rem;color:var(--text-light);"><h3>No Announcements Available</h3></div>`
            : this.data.map(item => `
                <div class="announcement-card" onclick="Announcements.openDetail(${item.id});Announcements.closeAll();">
                    <div class="announcement-image" style="background-image:url('${item.image}')"></div>
                    <div class="announcement-content">
                        <div class="announcement-meta">
                            <span class="announcement-badge ${item.badge}">${item.category}</span>
                            <span>${item.date}</span>
                        </div>
                        <h3 class="announcement-title">${item.title}</h3>
                        <p class="announcement-excerpt">${item.excerpt}</p>
                        <div class="announcement-footer">
                            <span style="font-size:0.85rem;color:var(--text-light);">By ${item.creator}</span>
                            <span class="read-more">Read More →</span>
                        </div>
                    </div>
                </div>
            `).join('');
        Utils.openModal('allAnnouncementsModal');
    },

    closeAll() { Utils.closeModal('allAnnouncementsModal'); }
};

window.openAnnouncementDetail = (id) => Announcements.openDetail(id);
window.closeAnnouncementModal = () => Utils.closeModal('announcementModal');
window.openAllAnnouncements = () => Announcements.openAll();
window.closeAllAnnouncementsModal = () => Announcements.closeAll();

// ========================================
// ABOUT SECTION TABS
// ========================================
const AboutTabs = {
    init() {
        const tabs = document.querySelectorAll('.about-tab');
        const panels = document.querySelectorAll('.about-panel');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.getAttribute('data-tab');
                tabs.forEach(t => t.classList.remove('active'));
                panels.forEach(p => p.classList.remove('active'));
                tab.classList.add('active');
                document.getElementById(`panel-${targetTab}`)?.classList.add('active');
            });
        });
    }
};

// ========================================
// PROGRAMS MODULE
// ========================================
const Programs = {
    data: [
        { id: 0, name: "STEM", fullName: "Science, Technology, Engineering & Mathematics", color: "blue", icon: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/></svg>', subjects: ["Pre-Calculus", "Basic Calculus", "General Chemistry", "General Physics", "Biology", "Statistics"], careers: ["Engineer", "Doctor", "Scientist", "Researcher", "Architect", "IT Specialist"] },
        { id: 1, name: "ICT", fullName: "Information & Communications Technology", color: "cyan", icon: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="12" x2="12.01" y1="18" y2="18"/></svg>', subjects: ["Computer Programming", "Web Development", "Computer Systems Servicing", "Animation", "Technical Drafting"], careers: ["Software Developer", "Web Designer", "System Administrator", "Animator", "IT Support"] },
        { id: 2, name: "ABM", fullName: "Accountancy, Business & Management", color: "amber", icon: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>', subjects: ["Business Mathematics", "Organization & Management", "Principles of Marketing", "Business Finance", "Entrepreneurship"], careers: ["Accountant", "Business Manager", "Entrepreneur", "Financial Analyst", "Marketing Specialist"] },
        { id: 3, name: "HUMSS", fullName: "Humanities & Social Sciences", color: "pink", icon: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>', subjects: ["Philippine Politics", "World Religions", "Creative Writing", "Trends in Culture", "Community Engagement"], careers: ["Teacher", "Lawyer", "Psychologist", "Writer", "Social Worker", "Journalist"] },
        { id: 4, name: "TVL-IA", fullName: "Industrial Arts", color: "slate", icon: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>', subjects: ["Carpentry", "Plumbing", "Electrical Installation", "Masonry", "Welding & Fabrication"], careers: ["Electrician", "Carpenter", "Plumber", "Welder", "Construction Worker"] },
        { id: 5, name: "TVL-AFA", fullName: "Agri-Fishery Arts", color: "green", icon: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"/><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>', subjects: ["Crop Production", "Animal Production", "Aquaculture", "Agricultural Machinery", "Organic Agriculture"], careers: ["Farmer", "Agricultural Technician", "Farm Manager", "Aquaculture Specialist"] },
        { id: 6, name: "TVL-HE", fullName: "Home Economics", color: "red", icon: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/><path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"/><path d="M12 3v6"/></svg>', subjects: ["Food & Beverage Services", "Cookery", "Bread & Pastry", "Housekeeping", "Caregiving"], careers: ["Chef", "Baker", "Hotel Staff", "Caregiver", "Restaurant Manager"] },
        { id: 7, name: "A&D", fullName: "Arts & Design", color: "purple", icon: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/><path d="M8.5 8.5v.01"/><path d="M16 15.5v.01"/><path d="M12 12v.01"/><path d="M11 17v.01"/><path d="M7 14v.01"/></svg>', subjects: ["Visual Arts", "Media Arts", "Performing Arts", "Art Appreciation", "Design Principles"], careers: ["Graphic Designer", "Fine Artist", "Animator", "Photographer", "Interior Designer"] },
        { id: 8, name: "SPORTS", fullName: "Sports Track", color: "orange", icon: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 0-9.95 11.32A10 10 0 0 1 12 12"/><path d="M22 12A10 10 0 0 1 12 22"/></svg>', subjects: ["Sports Biomechanics", "Sports Psychology", "Physical Fitness", "Sports Management", "First Aid"], careers: ["Athlete", "Sports Coach", "Physical Therapist", "Sports Manager", "Fitness Trainer"] },
        { id: 9, name: "ALS", fullName: "Alternative Learning System", color: "teal", icon: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>', subjects: ["Basic Education", "Life Skills", "Livelihood Skills", "Values Education"], careers: ["Various vocational paths", "Entrepreneurship", "Employment opportunities"] }
    ],

    init() {
        document.querySelectorAll('.program-pill').forEach(pill => {
            pill.addEventListener('click', function() {
                Programs.openModal(parseInt(this.getAttribute('data-program')));
            });
        });
    },

    openModal(programId) {
        const program = this.data.find(p => p.id === programId);
        if (!program) return;
        document.getElementById('programModalBody').innerHTML = `
            <div class="program-modal-header ${program.color}">
                <div class="program-modal-icon">${program.icon}</div>
                <div class="program-modal-title"><h2>${program.name}</h2><p>${program.fullName}</p></div>
            </div>
            <div class="program-modal-content">
                <div class="program-modal-section">
                    <h3>Core Subjects</h3>
                    <div class="subject-tags">${program.subjects.map(s => `<span class="subject-tag ${program.color}">${s}</span>`).join('')}</div>
                </div>
                <div class="program-modal-section">
                    <h3>Career Opportunities</h3>
                    <div class="career-grid">${program.careers.map(c => `<div class="career-card"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg><span>${c}</span></div>`).join('')}</div>
                </div>
            </div>
            <div class="program-modal-footer">
                <button class="btn-enroll-program" onclick="Programs.close();Enrollment.open();">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
                    Enroll in ${program.name}
                </button>
            </div>
        `;
        Utils.openModal('programModal');
    },

    close() { Utils.closeModal('programModal'); }
};

window.openProgramModal = (id) => Programs.openModal(id);
window.closeProgramModal = () => Programs.close();

// ========================================
// FACILITIES MODULE
// ========================================
const Facilities = {
    data: [
        { id: 1, name: "SMAW Area", description: "Shielded Metal Arc Welding workshop for technical vocational training.", image: "http://localhost/school/assets-image/smawArea.jpg", details: `<h3>Welding Workshop</h3><p>Professional welding facility for SMAW certification and training.</p><h4>Features:</h4><ul><li>Industrial welding machines</li><li>Safety equipment and protective gear</li><li>Metal fabrication tools</li><li>Ventilation and safety systems</li></ul>` },
        { id: 2, name: "Computer Laboratory", description: "State-of-the-art computer labs with high-speed internet and latest software.", image: "http://localhost/school/assets-image/computerLab.jpg", details: `<h3>Advanced Computing Facility</h3><p>Equipped with 50+ high-performance computers for ICT and programming courses.</p><h4>Features:</h4><ul><li>Intel Core i5 processors with 8GB RAM</li><li>Licensed software (Microsoft Office, Adobe Suite)</li><li>100 Mbps fiber internet connection</li><li>Programming tools and IDEs</li></ul>` },
        { id: 3, name: "Science Laboratory", description: "Fully-equipped science labs for chemistry, physics, and biology experiments.", image: "http://localhost/school/assets-image/scienceLab.jpg", details: `<h3>Complete Laboratory Facilities</h3><p>Three specialized labs for hands-on science experiments and research.</p><h4>Laboratory Types:</h4><ul><li><strong>Chemistry Lab:</strong> Fume hoods, chemical storage, glassware</li><li><strong>Physics Lab:</strong> Experimental equipment, measurement tools</li><li><strong>Biology Lab:</strong> Microscopes, specimen collection, dissection tools</li></ul>` },
        { id: 4, name: "Admin Office", description: "Central administrative hub for school operations and management.", image: "http://localhost/school/assets-image/adminOffice.jpg", details: `<h3>Administrative Center</h3><p>The main office handling school operations, policies, and student services.</p><h4>Services:</h4><ul><li>Student enrollment and records</li><li>School policies and announcements</li><li>Administrative assistance</li><li>Document processing</li></ul>` },
        { id: 5, name: "Automotive Area", description: "Specialized workshop for automotive technology and mechanics training.", image: "http://localhost/school/assets-image/automotiveArea.jpg", details: `<h3>Automotive Workshop</h3><p>Complete facility for hands-on automotive training and vehicle maintenance.</p><h4>Features:</h4><ul><li>Vehicle diagnostic equipment</li><li>Engine repair and maintenance tools</li><li>Welding and fabrication area</li><li>Safety equipment and gear</li></ul>` },
        { id: 6, name: "Canteen Area", description: "Clean and spacious dining facility serving nutritious meals daily.", image: "http://localhost/school/assets-image/canteenArea.jpg", details: `<h3>Student Dining Hall</h3><p>Comfortable dining space with healthy meal options for students and staff.</p><h4>Features:</h4><ul><li>Seating capacity for 200+ students</li><li>Nutritious breakfast and lunch options</li><li>Clean and sanitized facilities</li><li>Affordable meal prices</li></ul>` },
        { id: 7, name: "EPAS Area", description: "Expanded Program in Agricultural Sciences facility for specialized training.", image: "http://localhost/school/assets-image/epasArea.jpg", details: `<h3>Agricultural Sciences Hub</h3><p>Dedicated space for advanced agricultural studies and research.</p><h4>Features:</h4><ul><li>Soil testing and analysis equipment</li><li>Plant propagation facilities</li><li>Agricultural research tools</li><li>Organic farming demonstration area</li></ul>` },
        { id: 8, name: "Faculty Grade 11", description: "Dedicated faculty office and preparation room for Grade 11 teachers.", image: "http://localhost/school/assets-image/facultyGrade11.jpg", details: `<h3>Grade 11 Faculty Office</h3><p>Professional workspace for Grade 11 teaching staff and lesson preparation.</p><h4>Features:</h4><ul><li>Individual teacher workstations</li><li>Meeting and collaboration space</li><li>Storage for teaching materials</li><li>Computer and printing facilities</li></ul>` },
        { id: 9, name: "Faculty Grade 12", description: "Dedicated faculty office and preparation room for Grade 12 teachers.", image: "http://localhost/school/assets-image/facultyGrade12.jpg", details: `<h3>Grade 12 Faculty Office</h3><p>Professional workspace for Grade 12 teaching staff and lesson preparation.</p><h4>Features:</h4><ul><li>Individual teacher workstations</li><li>Meeting and collaboration space</li><li>Storage for teaching materials</li><li>Computer and printing facilities</li></ul>` },
        { id: 10, name: "Guidance Office", description: "Professional counseling services for student welfare and development.", image: "http://localhost/school/assets-image/guidanceOffice.jpg", details: `<h3>Student Counseling Center</h3><p>Confidential and supportive environment for student guidance and counseling.</p><h4>Services:</h4><ul><li>Individual and group counseling</li><li>Career guidance and assessment</li><li>Mental health support</li><li>Academic advising</li></ul>` },
        { id: 11, name: "Home Economics", description: "Modern facility for food preparation, sewing, and household management.", image: "http://localhost/school/assets-image/homeEconomics.jpg", details: `<h3>Home Economics Laboratory</h3><p>Hands-on training facility for culinary arts and household management.</p><h4>Features:</h4><ul><li>Commercial-grade kitchen equipment</li><li>Sewing machines and garment making tools</li><li>Food safety and sanitation facilities</li><li>Interior design and home management area</li></ul>` },
        { id: 12, name: "Registrar Office", description: "Official records management and student documentation services.", image: "http://localhost/school/assets-image/registrarOffice.jpg", details: `<h3>Records and Registration Office</h3><p>Secure management of student records, transcripts, and academic documents.</p><h4>Services:</h4><ul><li>Transcript requests</li><li>Certificate of enrollment</li><li>Grade records management</li><li>Document authentication</li></ul>` }
    ],

    currentIndex: 0,

    render() {
        const carousel = document.getElementById('facilitiesCarousel');
        if (!carousel) return;
        carousel.innerHTML = this.data.map(f => `
            <div class="facility-card" onclick="Facilities.openModal(${f.id})">
                <div class="facility-image" style="background-image:url('${f.image}')"></div>
                <div class="facility-content">
                    <h3 class="facility-title">${f.name}</h3>
                    <p class="facility-description">${f.description}</p>
                    <span class="facility-link">View Details →</span>
                </div>
            </div>
        `).join('');
    },

    openModal(id) {
        const facility = this.data.find(f => f.id === id);
        if (!facility) return;
        this.currentIndex = this.data.findIndex(f => f.id === id);
        document.getElementById('facilityModalImage').style.backgroundImage = `url('${facility.image}')`;
        document.getElementById('facilityModalBody').innerHTML = `<h2>${facility.name}</h2>${facility.details}`;
        Utils.openModal('facilityModal');
    },

    navigate(direction) {
        this.currentIndex = (this.currentIndex + direction + this.data.length) % this.data.length;
        this.openModal(this.data[this.currentIndex].id);
    },

    setupCarousel() {
        document.getElementById('facilitiesPrev')?.addEventListener('click', () => {
            document.getElementById('facilitiesCarousel').scrollBy({ left: -400, behavior: 'smooth' });
        });
        document.getElementById('facilitiesNext')?.addEventListener('click', () => {
            document.getElementById('facilitiesCarousel').scrollBy({ left: 400, behavior: 'smooth' });
        });
    }
};

window.openFacilityModal = (id) => Facilities.openModal(id);
window.closeFacilityModal = () => Utils.closeModal('facilityModal');
window.navigateFacility = (direction) => Facilities.navigate(direction);

// ========================================
// ENROLLMENT MODULE
// ========================================
const Enrollment = {
    open() {
        document.getElementById('enrollContent').innerHTML = `
            <div class="enroll-header">
                <div class="enroll-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                </div>
                <h2>Enrollment Form SY 2026-2027</h2>
                <p>Fill out the form below to start your enrollment process</p>
            </div>
            <form class="enroll-form" id="enrollmentForm">
                <div class="form-section">
                    <h3>Personal Information</h3>
                    <div class="form-row">
                        <div class="form-group"><label>First Name *</label><input type="text" name="firstName" required></div>
                        <div class="form-group"><label>Last Name *</label><input type="text" name="lastName" required></div>
                    </div>
                    <div class="form-row">
                        <div class="form-group"><label>Date of Birth *</label><input type="date" name="birthdate" required></div>
                        <div class="form-group"><label>Gender *</label><select name="gender" required><option value="">Select Gender</option><option value="male">Male</option><option value="female">Female</option></select></div>
                    </div>
                    <div class="form-group"><label>Complete Address *</label><textarea name="address" rows="2" required></textarea></div>
                </div>
                <div class="form-section">
                    <h3>Contact Information</h3>
                    <div class="form-row">
                        <div class="form-group"><label>Email Address *</label><input type="email" name="email" required></div>
                        <div class="form-group"><label>Contact Number *</label><input type="tel" name="phone" required></div>
                    </div>
                </div>
                <div class="form-section">
                    <h3>Academic Information</h3>
                    <div class="form-group"><label>Learner Reference Number (LRN)</label><input type="text" name="lrn" maxlength="12" placeholder="12-digit LRN (leave blank if none)"></div>
                    <div class="form-row">
                        <div class="form-group"><label>Grade Level *</label><select name="gradeLevel" required><option value="">Select Grade Level</option><option value="11">Grade 11</option><option value="12">Grade 12</option></select></div>
                        <div class="form-group"><label>Preferred Strand/Track *</label><select name="strand" required><option value="">Select Strand</option><option value="STEM">STEM</option><option value="ICT">ICT</option><option value="ABM">ABM</option><option value="HUMSS">HUMSS</option><option value="TVL-IA">TVL - Industrial Arts</option><option value="TVL-AFA">TVL - Agri-Fishery Arts</option><option value="TVL-HE">TVL - Home Economics</option><option value="A&D">Arts & Design</option><option value="Sports">Sports</option><option value="ALS">ALS</option></select></div>
                    </div>
                    <div class="form-group"><label>Last School Attended *</label><input type="text" name="lastSchool" required></div>
                </div>
                <div class="form-section">
                    <h3>Parent/Guardian Information</h3>
                    <div class="form-row">
                        <div class="form-group"><label>Parent/Guardian Name *</label><input type="text" name="guardianName" required></div>
                        <div class="form-group"><label>Parent/Guardian Contact *</label><input type="tel" name="guardianPhone" required></div>
                    </div>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn-cancel" onclick="Enrollment.close()">Cancel</button>
                    <button type="submit" class="btn-submit-enroll">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                        Submit Enrollment
                    </button>
                </div>
            </form>
        `;

        Utils.openModal('enrollModal');

        setTimeout(() => {
            document.getElementById('enrollmentForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const data = {
                    action: 'submit_enrollment',
                    firstName: formData.get('firstName'), lastName: formData.get('lastName'),
                    birthdate: formData.get('birthdate'), gender: formData.get('gender'),
                    address: formData.get('address'), email: formData.get('email'),
                    phone: formData.get('phone'), gradeLevel: formData.get('gradeLevel'),
                    strand: formData.get('strand'), lrn: formData.get('lrn'),
                    last_school: formData.get('lastSchool'),
                    guardianName: formData.get('guardianName'), guardianPhone: formData.get('guardianPhone')
                };
                try {
                    const response = await fetch(`${CONFIG.API_URL}/enrollment.php`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    });
                    const result = await response.json();
                    if (result.success) {
                        Utils.showToast('Enrollment Submitted!', 'Thank you! We will contact you within 24 hours.', 'success');
                        Enrollment.close();
                    } else {
                        Utils.showToast('Error', result.message || 'Enrollment failed. Please try again.', 'error');
                    }
                } catch (error) {
                    Utils.showToast('Connection Error', 'Cannot connect to server.', 'error');
                }
            });
        }, 100);
    },

    close() { Utils.closeModal('enrollModal'); }
};

window.openEnrollModal = () => Enrollment.open();
window.closeEnrollModal = () => Enrollment.close();

// ========================================
// CONTACT FORM
// ========================================
const ContactForm = {
    init() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);

            if (!localStorage.getItem('loggedInUser')) {
                Utils.showToast('Login Required', 'Please log in before sending a message.', 'error');
                Utils.openModal('loginModal');
                return;
            }

            if (!formData.get('firstName') || !formData.get('lastName') || !formData.get('email') || !formData.get('message')) {
                Utils.showToast('Error', 'Please fill in all required fields', 'error');
                return;
            }

            const data = {
                name: `${formData.get('firstName')} ${formData.get('lastName')}`,
                email: formData.get('email'),
                subject: formData.get('subject') || 'General Question',
                message: formData.get('message')
            };

            try {
                const response = await fetch(`${CONFIG.API_URL}/messages.php`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                const result = await response.json();
                if (result.success) {
                    Utils.showToast('Message Sent!', 'Thank you for contacting us. We will get back to you soon.', 'success');
                    e.target.reset();
                } else {
                    Utils.showToast('Error', result.message || 'Failed to send message', 'error');
                }
            } catch (error) {
                Utils.showToast('Connection Error', 'Cannot connect to server. Please try again.', 'error');
            }
        });
    }
};

// ========================================
// APPLICATION INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    PageLoader.init();
    ScrollAnimations.init();
    Navigation.init();
    Auth.init();
    UserSession.init();
    AboutTabs.init();
    Programs.init();
    ContactForm.init();
    Facilities.setupCarousel();
    Announcements.init();
    Facilities.render();
});
