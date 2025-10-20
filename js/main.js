// Main application state
const AppState = {
    currentTheme: 'light',
    currentSection: 'gioi-thieu',
    searchVisible: false,
    sidebarVisible: true,
    readingProgress: 0
};

// DOM elements
const elements = {
    themeToggle: null,
    searchBtn: null,
    searchPanel: null,
    searchInput: null,
    searchClose: null,
    searchResults: null,
    menuToggle: null,
    sidebar: null,
    content: null,
    progressFill: null,
    tocLinks: null
};

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initElements();
    initEventListeners();
    initTheme();
    initTableOfContents();
    initProgressBar();
    initMathJax();
    
    console.log('📚 Physics E-book initialized successfully!');
});

// Initialize DOM elements
function initElements() {
    elements.themeToggle = document.getElementById('theme-toggle');
    elements.searchBtn = document.getElementById('search-btn');
    elements.searchPanel = document.getElementById('search-panel');
    elements.searchInput = document.getElementById('search-input');
    elements.searchClose = document.getElementById('search-close');
    elements.searchResults = document.getElementById('search-results');
    elements.menuToggle = document.getElementById('menu-toggle');
    elements.sidebar = document.querySelector('.sidebar');
    elements.content = document.querySelector('.content');
    elements.progressFill = document.querySelector('.progress-fill');
    elements.tocLinks = document.querySelectorAll('.toc-list a');
}

// Initialize event listeners
function initEventListeners() {
    // Theme toggle
    if (elements.themeToggle) {
        elements.themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Search functionality
    if (elements.searchBtn) {
        elements.searchBtn.addEventListener('click', toggleSearch);
    }
    
    if (elements.searchClose) {
        elements.searchClose.addEventListener('click', toggleSearch);
    }
    
    if (elements.searchInput) {
        elements.searchInput.addEventListener('input', handleSearch);
        elements.searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                toggleSearch();
            }
        });
    }
    
    // Mobile menu toggle
    if (elements.menuToggle) {
        elements.menuToggle.addEventListener('click', toggleSidebar);
    }
    
    // Scroll events
    window.addEventListener('scroll', handleScroll);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Resize events
    window.addEventListener('resize', handleResize);
}

// Theme management
function initTheme() {
    const savedTheme = localStorage.getItem('physics-ebook-theme') || 'light';
    setTheme(savedTheme);
}

function toggleTheme() {
    const themes = ['light', 'dark', 'sepia', 'high-contrast'];
    const currentIndex = themes.indexOf(AppState.currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
}

function setTheme(theme) {
    AppState.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('physics-ebook-theme', theme);
    
    // Update theme toggle icon
    if (elements.themeToggle) {
        const icon = elements.themeToggle.querySelector('i');
        const icons = {
            'light': 'fas fa-moon',
            'dark': 'fas fa-sun',
            'sepia': 'fas fa-book',
            'high-contrast': 'fas fa-eye'
        };
        icon.className = icons[theme];
    }
    
    console.log(`🎨 Theme changed to: ${theme}`);
}

// Search functionality
function toggleSearch() {
    AppState.searchVisible = !AppState.searchVisible;
    
    if (elements.searchPanel) {
        elements.searchPanel.classList.toggle('hidden', !AppState.searchVisible);
    }
    
    if (AppState.searchVisible && elements.searchInput) {
        setTimeout(() => elements.searchInput.focus(), 100);
    } else if (elements.searchInput) {
        elements.searchInput.value = '';
        if (elements.searchResults) {
            elements.searchResults.innerHTML = '';
        }
    }
}

function handleSearch(event) {
    const query = event.target.value.toLowerCase().trim();
    
    if (query.length < 2) {
        elements.searchResults.innerHTML = '';
        return;
    }
    
    const results = searchContent(query);
    displaySearchResults(results);
}

function searchContent(query) {
    const searchableElements = document.querySelectorAll('.content-section h2, .content-section h3, .content-section h4, .content-section p, .content-section li');
    const results = [];
    
    searchableElements.forEach(element => {
        const text = element.textContent.toLowerCase();
        if (text.includes(query)) {
            const section = element.closest('.content-section');
            if (section) {
                results.push({
                    element: element,
                    section: section.id,
                    title: section.querySelector('h2')?.textContent || 'Unknown Section',
                    text: element.textContent,
                    type: element.tagName.toLowerCase()
                });
            }
        }
    });
    
    return results.slice(0, 10); // Limit to 10 results
}

function displaySearchResults(results) {
    if (!elements.searchResults) return;
    
    if (results.length === 0) {
        elements.searchResults.innerHTML = '<p class="search-no-results">Không tìm thấy kết quả nào.</p>';
        return;
    }
    
    const resultsHTML = results.map(result => `
        <div class="search-result" data-section="${result.section}">
            <h4>${result.title}</h4>
            <p>${highlightSearchTerm(result.text, elements.searchInput.value)}</p>
            <small>Loại: ${getElementTypeName(result.type)}</small>
        </div>
    `).join('');
    
    elements.searchResults.innerHTML = resultsHTML;
    
    // Add click handlers to results
    elements.searchResults.querySelectorAll('.search-result').forEach(result => {
        result.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            navigateToSection(sectionId);
            toggleSearch();
        });
    });
}

function highlightSearchTerm(text, term) {
    if (!term) return text;
    const regex = new RegExp(`(${term})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

function getElementTypeName(tagName) {
    const typeNames = {
        'h2': 'Tiêu đề chính',
        'h3': 'Tiêu đề phụ',
        'h4': 'Tiêu đề con',
        'p': 'Đoạn văn',
        'li': 'Danh sách'
    };
    return typeNames[tagName] || 'Nội dung';
}

// Navigation
function initTableOfContents() {
    elements.tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            navigateToSection(targetId);
        });
    });
    
    // Set initial active link
    updateActiveNavLink();
}

function navigateToSection(sectionId) {
    const targetElement = document.getElementById(sectionId);
    if (targetElement) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        AppState.currentSection = sectionId;
        updateActiveNavLink();
    }
}

function updateActiveNavLink() {
    elements.tocLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href').substring(1);
        if (href === AppState.currentSection) {
            link.classList.add('active');
        }
    });
}

// Progress bar
function initProgressBar() {
    updateProgressBar();
}

function updateProgressBar() {
    if (!elements.content || !elements.progressFill) return;
    
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    elements.progressFill.style.width = `${Math.min(scrollPercent, 100)}%`;
    AppState.readingProgress = scrollPercent;
}

// Scroll handling
function handleScroll() {
    updateProgressBar();
    updateCurrentSection();
    
    // Hide/show header on mobile
    if (window.innerWidth <= 768) {
        const header = document.querySelector('.header');
        const scrollTop = window.pageYOffset;
        
        if (scrollTop > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
    }
}

function updateCurrentSection() {
    const sections = document.querySelectorAll('.content-section');
    const headerHeight = document.querySelector('.header').offsetHeight;
    
    let currentSection = '';
    
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= headerHeight + 50 && rect.bottom > headerHeight + 50) {
            currentSection = section.id;
        }
    });
    
    if (currentSection && currentSection !== AppState.currentSection) {
        AppState.currentSection = currentSection;
        updateActiveNavLink();
    }
}

// Mobile sidebar toggle
function toggleSidebar() {
    AppState.sidebarVisible = !AppState.sidebarVisible;
    
    if (elements.sidebar) {
        elements.sidebar.classList.toggle('mobile-hidden', !AppState.sidebarVisible);
    }
}

// Keyboard shortcuts
function handleKeyboardShortcuts(event) {
    // Ctrl/Cmd + K for search
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        toggleSearch();
    }
    
    // Escape to close search
    if (event.key === 'Escape' && AppState.searchVisible) {
        toggleSearch();
    }
    
    // T for theme toggle
    if (event.key === 't' && !event.ctrlKey && !event.metaKey && !isInputFocused()) {
        toggleTheme();
    }
}

function isInputFocused() {
    const activeElement = document.activeElement;
    return activeElement && (
        activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.contentEditable === 'true'
    );
}

// Resize handling
function handleResize() {
    // Reset mobile header on desktop
    if (window.innerWidth > 768) {
        const header = document.querySelector('.header');
        header.style.transform = 'translateY(0)';
    }
    
    // Close search on mobile if open
    if (window.innerWidth <= 768 && AppState.searchVisible) {
        toggleSearch();
    }
}

// MathJax configuration
function initMathJax() {
    window.MathJax = {
        tex: {
            inlineMath: [['$', '$'], ['\\(', '\\)']],
            displayMath: [['$$', '$$'], ['\\[', '\\]']],
            processEscapes: true,
            processEnvironments: true
        },
        options: {
            skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre'],
            ignoreHtmlClass: 'tex2jax_ignore',
            processHtmlClass: 'tex2jax_process'
        },
        svg: {
            fontCache: 'global'
        }
    };
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Performance optimizations
const debouncedSearch = debounce(handleSearch, 300);
const throttledScroll = throttle(handleScroll, 100);

// Replace original event listeners with optimized versions
if (elements.searchInput) {
    elements.searchInput.removeEventListener('input', handleSearch);
    elements.searchInput.addEventListener('input', debouncedSearch);
}

window.removeEventListener('scroll', handleScroll);
window.addEventListener('scroll', throttledScroll);

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AppState,
        setTheme,
        searchContent,
        navigateToSection
    };
}