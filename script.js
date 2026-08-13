// Theme Toggle
const themeBtn = document.getElementById('themeBtn');

// Check for saved theme or default to dark mode
const savedTheme = localStorage.getItem('theme') || 'light';

if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    if (themeBtn) themeBtn.textContent = '◒ Light';
}

if (themeBtn) {
    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        themeBtn.textContent = isDarkMode ? '◒ Light' : '◓ Dark';
    });
}

// Navigation and Routing
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.page-section');

function showSection(sectionId) {
    // Hide all sections
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Remove active class from all nav links
    navLinks.forEach(link => {
        link.classList.remove('active');
    });

    // Show the selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Mark the corresponding nav link as active
    const activeLink = document.querySelector(`a[href="#${sectionId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }

    // Update outline for the new section
    updateOutline(sectionId);

    // Close mobile sidebar if open
    const sidebar = document.querySelector('.sidebar-left');
    if (sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
    }
}

// Handle hash changes
window.addEventListener('hashchange', () => {
    const hash = window.location.hash.slice(1);
    const sectionId = hash || getInitialSectionId();
    showSection(sectionId);
});

// Initialize on page load
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = e.target.getAttribute('href');
        const sectionId = href.slice(1);
        showSection(sectionId);
    });
});

// Set initial view
const getInitialSectionId = () => {
    const hash = window.location.hash.slice(1);
    if (document.getElementById(hash)) return hash;
    if (document.getElementById('about')) return 'about';
    return sections[0]?.id || '';
};
showSection(getInitialSectionId());

// Outline Navigation
function generateOutline(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return [];

    const headings = section.querySelectorAll('h2, h3, h4');
    const outline = [];

    headings.forEach((heading, index) => {
        const level = parseInt(heading.tagName[1]);
        const id = heading.id || `heading-${sectionId}-${index}`;

        // Set ID if not present
        if (!heading.id) {
            heading.id = id;
        }

        outline.push({
            text: heading.textContent,
            id: id,
            level: level
        });
    });

    return outline;
}

function updateOutline(sectionId) {
    const outlineList = document.getElementById('outlineList');
    const outline = generateOutline(sectionId);

    outlineList.innerHTML = '';

    outline.forEach(item => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `#${item.id}`;
        a.textContent = item.text;

        // Add indentation based on heading level
        const indent = (item.level - 2) * 1;
        a.style.marginLeft = `${indent}rem`;

        li.appendChild(a);
        outlineList.appendChild(li);

        // Add click handler to highlight outline item
        a.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById(item.id).scrollIntoView({ behavior: 'smooth' });
            updateOutlineActiveState(item.id);
        });
    });
}

function updateOutlineActiveState(headingId) {
    const outlineLinks = document.querySelectorAll('.outline-nav a');
    outlineLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${headingId}`) {
            link.classList.add('active');
        }
    });
}

// Update outline active state on scroll
const mainContent = document.querySelector('.main-content');
if (mainContent) {
    mainContent.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('.page-section.active h2, .page-section.active h3, .page-section.active h4');
        let activeId = null;

        sections.forEach(heading => {
            const rect = heading.getBoundingClientRect();
            if (rect.top <= 100) {
                activeId = heading.id;
            }
        });

        if (activeId) {
            updateOutlineActiveState(activeId);
        }
    });
}

// Mobile Menu Toggle (optional, for mobile view)
function setupMobileMenu() {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const sidebar = document.querySelector('.sidebar-left');
    let menuBtn = document.querySelector('.mobile-menu-btn');

    const closeSidebar = () => {
        sidebar.classList.remove('open');
    };

    const removeMenuBtn = () => {
        if (menuBtn && menuBtn.isConnected) {
            menuBtn.remove();
        }
    };

    const ensureMenuBtn = () => {
        if (!menuBtn) {
            menuBtn = document.createElement('button');
            menuBtn.className = 'mobile-menu-btn';
            menuBtn.type = 'button';
            menuBtn.setAttribute('aria-label', 'Toggle navigation menu');
            menuBtn.innerHTML = '☰';
            menuBtn.addEventListener('click', () => {
                sidebar.classList.toggle('open');
            });
        }

        if (!menuBtn.isConnected) {
            mainContent.parentElement.insertBefore(menuBtn, mainContent);
        }
    };

    const handleMediaChange = (e) => {
        if (e.matches) {
            ensureMenuBtn();
        } else {
            closeSidebar();
            removeMenuBtn();
        }
    };

    mediaQuery.addEventListener('change', handleMediaChange);
    handleMediaChange(mediaQuery);

    mainContent.addEventListener('click', () => {
        if (mediaQuery.matches) {
            closeSidebar();
        }
    });
}

setupMobileMenu();

// Smooth scroll behavior
document.documentElement.style.scrollBehavior = 'smooth';
