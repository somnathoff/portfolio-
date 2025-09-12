// ===== PROJECT PAGE MANAGER CLASS =====
class ProjectPageManager {
    constructor() {
        this.isInitialized = false;
        this.init();
    }

    // Initialize all project page functionality
    init() {
        if (this.isInitialized) return;
        
        try {
            this.setupNavigation();
            this.setupInteractiveElements();
            this.setupVideoHandlers();
            this.isInitialized = true;
        } catch (error) {
            console.error('Project page initialization failed:', error);
        }
    }

    // ===== NAVIGATION =====
    setupNavigation() {
        // Setup mobile menu toggle
        this.setupMobileMenu();
    }

    setupMobileMenu() {
        const navMenu = document.getElementById('myNavMenu');
        const menuBtn = document.querySelector('.nav-menu-btn');
        const menuIcon = document.querySelector('.nav-menu-btn i');
        const navLinks = document.querySelectorAll('.nav-link');

        if (!navMenu || !menuBtn || !menuIcon) return;

        // Add click event to menu button
        menuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggleMenu();
        });

        // Close menu on link click
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
            });
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                this.closeMenu();
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('active') && 
                !navMenu.contains(e.target) && 
                !menuBtn.contains(e.target)) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        const navMenu = document.getElementById('myNavMenu');
        const menuIcon = document.querySelector('.nav-menu-btn i');
        
        if (!navMenu || !menuIcon) return;

        const isActive = navMenu.classList.contains('active');
        
        if (isActive) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        const navMenu = document.getElementById('myNavMenu');
        const menuIcon = document.querySelector('.nav-menu-btn i');
        
        if (!navMenu || !menuIcon) return;

        navMenu.classList.add('active');
        menuIcon.classList.remove('uil-bars');
        menuIcon.classList.add('uil-times');
        document.body.style.overflow = 'hidden';
    }

    closeMenu() {
        const navMenu = document.getElementById('myNavMenu');
        const menuIcon = document.querySelector('.nav-menu-btn i');
        
        if (!navMenu || !menuIcon) return;

        navMenu.classList.remove('active');
        menuIcon.classList.remove('uil-times');
        menuIcon.classList.add('uil-bars');
        document.body.style.overflow = '';
    }

    // ===== INTERACTIVE ELEMENTS =====
    setupInteractiveElements() {
        this.setupSearchFunctionality();
        this.setupButtonEffects();
    }

    setupSearchFunctionality() {
        const searchInput = document.querySelector('.search-input');
        
        if (searchInput) {
            // Add real-time search functionality
            searchInput.addEventListener('input', (e) => {
                this.debounce(this.filterProjects.bind(this), 300)(e.target.value);
            });
        }
    }

    filterProjects(searchTerm) {
        const projectCards = document.querySelectorAll('.project-card');
        const noProjectsMsg = document.querySelector('.no-projects');
        
        if (!searchTerm.trim()) {
            // Show all projects if search is empty
            projectCards.forEach(card => {
                card.style.display = 'block';
            });
            if (noProjectsMsg) noProjectsMsg.style.display = 'none';
            const noResults = document.querySelector('.no-search-results');
            if (noResults) noResults.remove();
            return;
        }
        
        let visibleCount = 0;
        
        projectCards.forEach(card => {
            const title = card.querySelector('.project-title')?.textContent.toLowerCase() || '';
            const description = card.querySelector('.project-description')?.textContent.toLowerCase() || '';
            const techTags = Array.from(card.querySelectorAll('.tech-tag')).map(tag => tag.textContent.toLowerCase());
            
            const searchLower = searchTerm.toLowerCase();
            const isMatch = title.includes(searchLower) || 
                          description.includes(searchLower) || 
                          techTags.some(tag => tag.includes(searchLower));
            
            if (isMatch) {
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });
        
        // Show/hide no results message
        if (visibleCount === 0 && searchTerm.trim()) {
            if (!document.querySelector('.no-search-results')) {
                const noResults = document.createElement('div');
                noResults.className = 'no-search-results no-projects';
                noResults.innerHTML = `
                    <i class="uil uil-search"></i>
                    <h3>No projects found</h3>
                    <p>Try searching with different keywords or clear your search.</p>
                `;
                document.querySelector('.projects-grid').appendChild(noResults);
            }
        } else {
            const noResults = document.querySelector('.no-search-results');
            if (noResults) noResults.remove();
        }
    }

    setupButtonEffects() {
        document.querySelectorAll('.btn').forEach(btn => {
            // Add ripple effect on click
            btn.addEventListener('click', (e) => {
                this.createRippleEffect(btn, e);
            });
        });
    }

    createRippleEffect(button, event) {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.remove();
            }
        }, 600);
    }

    // ===== VIDEO HANDLERS =====
    setupVideoHandlers() {
        // Setup video thumbnail click handlers
        this.setupVideoThumbnails();
    }

    setupVideoThumbnails() {
        const videoThumbnails = document.querySelectorAll('.video-thumbnail');
        
        videoThumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', (e) => {
                e.preventDefault();
                const youtubeUrl = thumbnail.closest('.project-card').querySelector('.btn-secondary')?.href;
                if (youtubeUrl) {
                    window.open(youtubeUrl, '_blank', 'noopener,noreferrer');
                }
            });
        });
    }

    // ===== UTILITY FUNCTIONS =====
    debounce(func, wait) {
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
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize project page manager
    window.projectPageManager = new ProjectPageManager();
    
    // Setup YouTube video handling
    const videoThumbnails = document.querySelectorAll('.video-thumbnail');
    videoThumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            const youtubeUrl = this.closest('.project-card').querySelector('.btn-secondary')?.href;
            if (youtubeUrl) {
                window.open(youtubeUrl, '_blank', 'noopener,noreferrer');
            }
        });
    });
});

// Function for mobile menu toggle (for HTML onclick attribute)
function toggleMenu() {
    if (window.projectPageManager && window.projectPageManager.isInitialized) {
        window.projectPageManager.toggleMenu();
    }
}