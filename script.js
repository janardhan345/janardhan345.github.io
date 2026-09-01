// Theme Toggle
const themeBtn = document.getElementById('themeBtn');
const aiToCodeBanner = document.getElementById('aiToCodeBanner');
const guiBuiltBanner = document.getElementById('guiBuiltBanner');
const favSwBanner = document.getElementById('favSwBanner');

function updateThemeImage() {
    const isDarkMode = document.body.classList.contains('dark-mode');

    if (aiToCodeBanner) {
        aiToCodeBanner.src = isDarkMode ? 'assets/ai-to-code-dark.png' : 'assets/ai-to-code.png';
    }

    if (guiBuiltBanner) {
        guiBuiltBanner.src = isDarkMode ? 'assets/gui-built-dark.png' : 'assets/gui-built.png';
    }

    if (favSwBanner) {
        favSwBanner.src = isDarkMode ? 'assets/fav-sw-dark.png' : 'assets/fav-sw.png';
    }
}

function renderMermaidDiagrams() {
    if (typeof mermaid === 'undefined') return;

    const isDarkMode = document.body.classList.contains('dark-mode');
    mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'loose',
        theme: isDarkMode ? 'dark' : 'default',
        flowchart: {
            curve: 'basis',
            htmlLabels: true,
            useMaxWidth: true
        },
        themeVariables: {
            primaryTextColor: isDarkMode ? '#f5f5f4' : '#1f2937',
            primaryBorderColor: isDarkMode ? '#8b8680' : '#334155',
            lineColor: isDarkMode ? '#d4d4d4' : '#475569',
            tertiaryColor: isDarkMode ? '#1f2937' : '#ecfeff',
            mainBkg: isDarkMode ? '#1f2937' : '#f8fafc'
        }
    });

    mermaid.run({
        nodes: document.querySelectorAll('.mermaid')
    });
}

// Check for saved theme or default to light mode
const savedTheme = localStorage.getItem('theme') || 'light';

if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    if (themeBtn) themeBtn.textContent = '◒ Light';
}

updateThemeImage();
renderMermaidDiagrams();

if (themeBtn) {
    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        themeBtn.textContent = isDarkMode ? '◒ Light' : '◓ Dark';
        updateThemeImage();
        renderMermaidDiagrams();
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

// Blog meta: read time + views
const WORDS_PER_MIN = 200;
const DEFAULT_VIEWS = {
    'BL-01': 34,
    'BL-02': 28,
    'BL-03': 12,
    'BL-04': 31,
    'BL-05': 19,
    'BL-06': 24
};

function formatViews(n) {
    if (n >= 1000) {
        const k = (n / 1000).toFixed(1).replace(/\.0$/, '');
        return k + 'k';
    }
    return String(n);
}

function getViews(id) {
    const stored = localStorage.getItem('pfv3-views-' + id);
    if (stored !== null) return parseInt(stored, 10);
    return DEFAULT_VIEWS[id] ?? 0;
}

function migrateOldViews() {
    const OLD_DEFAULTS = [342, 892, 127, 540, 210, 189];
    Object.keys(DEFAULT_VIEWS).forEach(id => {
        const stored = localStorage.getItem('pfv3-views-' + id);
        if (stored !== null && OLD_DEFAULTS.includes(parseInt(stored, 10))) {
            localStorage.setItem('pfv3-views-' + id, String(DEFAULT_VIEWS[id]));
        }
    });
}

function setViews(id, n) {
    localStorage.setItem('pfv3-views-' + id, String(n));
}

function updateViewsDisplay(id) {
    const n = getViews(id);
    const formatted = formatViews(n);
    document.querySelectorAll(`[data-views="${id}"]`).forEach(el => {
        el.textContent = `👁 ${formatted} views`;
        el.title = `${n} views`;
        el.setAttribute('aria-label', `${n} views`);
    });
}

function updateAllViewsDisplay() {
    Object.keys(DEFAULT_VIEWS).forEach(updateViewsDisplay);
    // also handle any other data-views present
    document.querySelectorAll('[data-views]').forEach(el => {
        const id = el.getAttribute('data-views');
        if (!(id in DEFAULT_VIEWS)) updateViewsDisplay(id);
    });
}

function incrementView(id) {
    if (!id || !id.startsWith('BL-')) return;
    // avoid double-count in same session navigation if needed? Count every showSection call
    const n = getViews(id) + 1;
    setViews(id, n);
    updateViewsDisplay(id);
}

function initReadTime() {
    document.querySelectorAll('.page-section[id^="BL-"]').forEach(section => {
        const id = section.id;
        const container = section.querySelector('.blog-list');
        if (!container) return;
        const text = container.innerText || container.textContent || '';
        const words = text.trim().split(/\s+/).filter(Boolean).length;
        const mins = Math.max(1, Math.ceil(words / WORDS_PER_MIN));
        document.querySelectorAll(`[data-read="${id}"]`).forEach(el => {
            el.textContent = `${mins} min read`;
            el.title = `${words} words · ${mins} min read`;
        });
    });
    // also compute for index preview items that may not have full text, fallback keeps hardcoded value
}

// Integrate with navigation
const _origShowSection = showSection;
showSection = function(sectionId) {
    _origShowSection(sectionId);
    if (sectionId && sectionId.startsWith('BL-')) {
        incrementView(sectionId);
    }
};

migrateOldViews();
initReadTime();
updateAllViewsDisplay();
// count initial view if starting on a blog post (initial showSection ran before wrapper)
const _initialId = getInitialSectionId();
if (_initialId && _initialId.startsWith('BL-')) {
    incrementView(_initialId);
}

// Smooth scroll behavior
document.documentElement.style.scrollBehavior = 'smooth';
