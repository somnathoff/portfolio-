// ===== PROJECT PAGE MANAGER CLASS - FIXED =====
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
            console.log('Project page initialized successfully');
        } catch (error) {
            console.error('Project page initialization failed:', error);
        }
    }

    // ===== NAVIGATION - FIXED =====
    setupNavigation() {
        this.setupMobileMenu();
    }

    setupMobileMenu() {
        const navMenu = document.getElementById('myNavMenu');
        const menuBtn = document.querySelector('.nav-menu-btn');
        const menuIcon = document.querySelector('.nav-menu-btn i');
        const navLinks = document.querySelectorAll('.nav-link');

        if (!navMenu || !menuBtn || !menuIcon) {
            console.warn('Mobile menu elements not found');
            return;
        }

        // Clear any existing event listeners
        menuBtn.removeEventListener('click', this.handleMenuToggle);
        
        // Bind the handler to maintain correct context
        this.handleMenuToggle = this.handleMenuToggle.bind(this);
        this.handleMenuClose = this.handleMenuClose.bind(this);

        // Add click event to menu button
        menuBtn.addEventListener('click', this.handleMenuToggle);

        // Add keyboard support for menu button
        menuBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.handleMenuToggle(e);
            }
        });

        // Close menu on link click
        navLinks.forEach(link => {
            link.addEventListener('click', this.handleMenuClose);
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

        console.log('Mobile menu setup completed');
    }

    handleMenuToggle(e) {
        e.preventDefault();
        e.stopPropagation();
        this.toggleMenu();
    }

    handleMenuClose() {
        this.closeMenu();
    }

    toggleMenu() {
        const navMenu = document.getElementById('myNavMenu');
        
        if (!navMenu) return;

        const isActive = navMenu.classList.contains('active');
        
        if (isActive) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        const navMenu = document.getElementById('myNavMenu');
        const menuBtn = document.querySelector('.nav-menu-btn');
        const menuIcon = document.querySelector('.nav-menu-btn i');
        
        if (!navMenu || !menuIcon || !menuBtn) return;

        navMenu.classList.add('active');
        menuIcon.classList.remove('uil-bars');
        menuIcon.classList.add('uil-times');
        menuBtn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';

        console.log('Menu opened');
    }

    closeMenu() {
        const navMenu = document.getElementById('myNavMenu');
        const menuBtn = document.querySelector('.nav-menu-btn');
        const menuIcon = document.querySelector('.nav-menu-btn i');
        
        if (!navMenu || !menuIcon || !menuBtn) return;

        navMenu.classList.remove('active');
        menuIcon.classList.remove('uil-times');
        menuIcon.classList.add('uil-bars');
        menuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';

        console.log('Menu closed');
    }

    // ===== INTERACTIVE ELEMENTS =====
    setupInteractiveElements() {
        this.setupSearchFunctionality();
        this.setupButtonEffects();
    }

    setupSearchFunctionality() {
        const searchInput = document.querySelector('.search-input');
        
        if (searchInput) {
            // Add real-time search functionality with debounce
            searchInput.addEventListener('input', (e) => {
                this.debounce(this.filterProjects.bind(this), 300)(e.target.value);
            });

            console.log('Search functionality initialized');
        }
    }

    filterProjects(searchTerm) {
        const projectCards = document.querySelectorAll('.project-card');
        const noProjectsMsg = document.querySelector('.no-projects');
        
        if (!searchTerm.trim()) {
            // Show all projects if search is empty
            projectCards.forEach(card => {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.3s ease forwards';
            });
            if (noProjectsMsg) noProjectsMsg.style.display = 'none';
            const noResults = document.querySelector('.no-search-results');
            if (noResults) noResults.remove();
            return;
        }
        
        let visibleCount = 0;
        const searchLower = searchTerm.toLowerCase();
        
        projectCards.forEach(card => {
            const title = card.querySelector('.project-title')?.textContent.toLowerCase() || '';
            const description = card.querySelector('.project-description')?.textContent.toLowerCase() || '';
            const techTags = Array.from(card.querySelectorAll('.tech-tag')).map(tag => tag.textContent.toLowerCase());
            
            const isMatch = title.includes(searchLower) || 
                          description.includes(searchLower) || 
                          techTags.some(tag => tag.includes(searchLower));
            
            if (isMatch) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.3s ease forwards';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });
        
        // Show/hide no results message
        this.handleNoResultsMessage(visibleCount, searchTerm);
    }

    handleNoResultsMessage(visibleCount, searchTerm) {
        const existingNoResults = document.querySelector('.no-search-results');
        
        if (visibleCount === 0 && searchTerm.trim()) {
            if (!existingNoResults) {
                const noResults = document.createElement('div');
                noResults.className = 'no-search-results no-projects';
                noResults.innerHTML = `
                    <i class="uil uil-search" aria-hidden="true"></i>
                    <h3>No projects found</h3>
                    <p>Try searching with different keywords or clear your search to view all projects.</p>
                `;
                
                const projectsGrid = document.querySelector('.projects-grid');
                if (projectsGrid) {
                    projectsGrid.appendChild(noResults);
                }
            }
        } else if (existingNoResults) {
            existingNoResults.remove();
        }
    }

    setupButtonEffects() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(btn => {
            // Add ripple effect on click
            btn.addEventListener('click', (e) => {
                this.createRippleEffect(btn, e);
            });

            // Add keyboard support
            btn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    this.createRippleEffect(btn, e);
                }
            });
        });

        console.log('Button effects initialized for', buttons.length, 'buttons');
    }

    createRippleEffect(button, event) {
        // Remove existing ripples
        const existingRipples = button.querySelectorAll('.ripple');
        existingRipples.forEach(ripple => ripple.remove());

        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        // Calculate position for click/keyboard event
        let x, y;
        if (event.type === 'keydown') {
            // Center the ripple for keyboard events
            x = rect.width / 2 - size / 2;
            y = rect.height / 2 - size / 2;
        } else {
            // Position based on mouse click
            x = event.clientX - rect.left - size / 2;
            y = event.clientY - rect.top - size / 2;
        }
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        // Ensure button has relative positioning
        const originalPosition = button.style.position;
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.remove();
            }
            // Restore original position if it was changed
            if (originalPosition) {
                button.style.position = originalPosition;
            }
        }, 600);
    }

    // ===== VIDEO HANDLERS =====
    setupVideoHandlers() {
        this.setupVideoThumbnails();
    }

    setupVideoThumbnails() {
        const videoThumbnails = document.querySelectorAll('.video-thumbnail');
        
        videoThumbnails.forEach((thumbnail, index) => {
            // Clear existing event listeners
            const newThumbnail = thumbnail.cloneNode(true);
            thumbnail.parentNode.replaceChild(newThumbnail, thumbnail);
            
            // Add click handler
            newThumbnail.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleVideoClick(newThumbnail);
            });

            // Add keyboard support
            newThumbnail.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleVideoClick(newThumbnail);
                }
            });
        });

        console.log('Video thumbnails setup completed for', videoThumbnails.length, 'thumbnails');
    }

    handleVideoClick(thumbnail) {
        // First try to find YouTube URL from preview button
        const projectCard = thumbnail.closest('.project-card');
        if (!projectCard) return;

        const previewBtn = projectCard.querySelector('.btn-secondary[href*="youtube.com"], .btn-secondary[href*="youtu.be"]');
        if (previewBtn && previewBtn.href) {
            window.open(previewBtn.href, '_blank', 'noopener,noreferrer');
            return;
        }

        // Fallback: try to construct URL from onclick attribute or data attributes
        const onclickAttr = thumbnail.getAttribute('onclick');
        if (onclickAttr) {
            const urlMatch = onclickAttr.match(/openYouTubeVideo\(['"]([^'"]+)['"]\)/);
            if (urlMatch && urlMatch[1]) {
                window.open(urlMatch[1], '_blank', 'noopener,noreferrer');
                return;
            }
        }

        console.warn('No YouTube URL found for video thumbnail');
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

// ===== GLOBAL FUNCTIONS =====
// Function for mobile menu toggle (backwards compatibility)
function toggleMenu() {
    if (window.projectPageManager && window.projectPageManager.isInitialized) {
        window.projectPageManager.toggleMenu();
    } else {
        console.warn('Project page manager not initialized');
    }
}

// Function for opening YouTube videos (backwards compatibility)
function openYouTubeVideo(url) {
    if (url) {
        window.open(url, '_blank', 'noopener,noreferrer');
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing project page...');
    
    // Initialize project page manager
    window.projectPageManager = new ProjectPageManager();
    
    // Additional error handling
    window.addEventListener('error', function(e) {
        console.error('JavaScript error:', e.error);
    });
    
    // Handle page visibility changes (pause animations when not visible)
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // Page is not visible, can pause heavy animations
            document.body.classList.add('page-hidden');
        } else {
            // Page is visible again
            document.body.classList.remove('page-hidden');
        }
    });
    
    console.log('Project page initialization complete');
});

// Handle window resize events
window.addEventListener('resize', function() {
    // Close mobile menu on resize to larger screen
    if (window.innerWidth > 900) {
        if (window.projectPageManager && window.projectPageManager.isInitialized) {
            window.projectPageManager.closeMenu();
        }
    }
});