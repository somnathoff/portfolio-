// ===== PORTFOLIO MANAGER CLASS =====
class PortfolioManager {
    constructor() {
        this.isInitialized = false;
        this.init();
    }

    // Initialize all portfolio functionality
    async init() {
        if (this.isInitialized) return;
        
        try {
            await this.waitForDOM();
            this.setupTypingAnimation();
            this.setupNavigation();
            this.setupSkillsToggle();
            this.setupTooltips();
            this.setupDownloadButton();
            this.setupScrollReveal();
            this.setupCertificationsSlider();
            this.isInitialized = true;
        } catch (error) {
            console.error('Portfolio initialization failed:', error);
        }
    }

    // Wait for DOM to be fully loaded
    waitForDOM() {
        return new Promise(resolve => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }

    // ===== TYPING ANIMATION =====
    setupTypingAnimation() {
        const typedElement = document.querySelector('.typedText');
        if (!typedElement) return;

        // Check if Typed.js is available
        if (typeof Typed !== 'undefined') {
            new Typed('.typedText', {
                strings: ['SOMNATH', 'Problem Solver', 'Full Stack Developer', 'Machine Learning Engineer', 'Data Scientist'],
                loop: true,
                typeSpeed: 100,
                backSpeed: 80,
                backDelay: 2000,
                showCursor: true,
                cursorChar: '|',
                autoInsertCss: true,
            });
        } else {
            // Fallback typing animation
            this.setupFallbackTyping(typedElement);
        }
    }

    setupFallbackTyping(element) {
        const texts = ['SOMNATH', 'Problem Solver', 'Full Stack Developer', 'Machine Learning Engineer', 'Data Scientist'];
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        const typeSpeed = 100;
        const deleteSpeed = 50;
        const pauseTime = 2000;

        function type() {
            const currentText = texts[textIndex];
            
            if (isDeleting) {
                element.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                element.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
            }

            let typeSpeedCurrent = isDeleting ? deleteSpeed : typeSpeed;

            if (!isDeleting && charIndex === currentText.length) {
                typeSpeedCurrent = pauseTime;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
            }

            setTimeout(type, typeSpeedCurrent);
        }
        
        type();
    }

    // ===== NAVIGATION =====
    setupNavigation() {
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        this.setupScrollSpy();
    }

    setupMobileMenu() {
        const menuBtn = document.querySelector('.nav-menu-btn');
        const navMenu = document.getElementById('myNavMenu');
        const navLinks = document.querySelectorAll('.nav-link');

        if (!menuBtn || !navMenu) return;

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
        document.addEventListener('click', (event) => {
            if (!navMenu.contains(event.target) && 
                !menuBtn.contains(event.target) && 
                navMenu.classList.contains('active')) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        const navMenu = document.getElementById('myNavMenu');
        const menuIcon = document.querySelector('.nav-menu-btn i');
        
        if (navMenu.classList.contains('active')) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        const navMenu = document.getElementById('myNavMenu');
        const menuIcon = document.querySelector('.nav-menu-btn i');
        
        navMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        if (menuIcon) {
            menuIcon.classList.remove('uil-bars');
            menuIcon.classList.add('uil-times');
        }
    }

    closeMenu() {
        const navMenu = document.getElementById('myNavMenu');
        const menuIcon = document.querySelector('.nav-menu-btn i');
        
        if (navMenu) navMenu.classList.remove('active');
        if (menuIcon) {
            menuIcon.classList.remove('uil-times');
            menuIcon.classList.add('uil-bars');
        }
        document.body.style.overflow = '';
    }

    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = anchor.getAttribute('href');
                if (targetId === '#' || targetId === '#home') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    return;
                }
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerHeight = 80;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
                
                this.closeMenu();
            });
        });
    }

    setupScrollSpy() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        window.addEventListener('scroll', () => {
            let current = '';
            const scrollY = window.pageYOffset;

            sections.forEach(section => {
                const sectionHeight = section.offsetHeight;
                const sectionTop = section.offsetTop - 100;
                const sectionId = section.getAttribute('id');

                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    current = sectionId;
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active-link');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active-link');
                }
            });
        });
    }

    // ===== SKILLS TOGGLE FUNCTIONALITY =====
    setupSkillsToggle() {
        const toggleBtns = document.querySelectorAll('[data-toggle-btn]');
        const skillsList = document.querySelector('.skills-list');
        const toolsList = document.querySelector('.tools-list');
        const toggleBox = document.querySelector('[data-toggle-box]');

        if (!toggleBox || toggleBtns.length === 0 || !skillsList || !toolsList) {
            return;
        }

        // Initialize default state
        this.initializeDefaultSkillsState();

        // Add click event to each toggle button
        toggleBtns.forEach((btn, index) => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active class from all buttons
                toggleBtns.forEach(toggleBtn => {
                    toggleBtn.classList.remove('active');
                });
                
                // Add active class to clicked button
                btn.classList.add('active');
                
                // Get button text to determine action
                const buttonText = btn.textContent.toLowerCase().trim();
                
                // Toggle between skills and tools based on button text
                if (buttonText.includes('skills')) {
                    // Show skills, hide tools
                    skillsList.style.display = 'flex';
                    toolsList.style.display = 'none';
                    skillsList.classList.add('active');
                    toolsList.classList.remove('active');
                    
                    // Move toggle background to first button (Skills)
                    this.moveToggleBackground(toggleBox, 0);
                } else if (buttonText.includes('tools')) {
                    // Show tools, hide skills
                    skillsList.style.display = 'none';
                    toolsList.style.display = 'flex';
                    skillsList.classList.remove('active');
                    toolsList.classList.add('active');
                    
                    // Move toggle background to second button (Tools)
                    this.moveToggleBackground(toggleBox, 1);
                }
            });
        });
    }

    // Move the toggle background indicator
    moveToggleBackground(toggleBox, buttonIndex) {
        const toggleBtns = toggleBox.querySelectorAll('[data-toggle-btn]');
        if (toggleBtns.length === 0) return;
        
        const buttonWidth = toggleBtns[0].offsetWidth;
        const translateX = buttonIndex * buttonWidth;
        
        // Create and apply style for the toggle background
        const styleId = 'toggle-background-style';
        let styleElement = document.getElementById(styleId);
        
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = styleId;
            document.head.appendChild(styleElement);
        }
        
        styleElement.textContent = `
            .skills-toggle::before {
                transform: translateX(${translateX}px) !important;
                width: ${buttonWidth}px !important;
            }
        `;
    }

    // Initialize default state for skills
    initializeDefaultSkillsState() {
        const skillsList = document.querySelector('.skills-list');
        const toolsList = document.querySelector('.tools-list');
        const skillsBtn = document.querySelector('[data-toggle-btn]:first-child');
        const toggleBox = document.querySelector('[data-toggle-box]');
        
        if (skillsList && toolsList && skillsBtn) {
            // Set initial display states
            skillsList.style.display = 'flex';
            toolsList.style.display = 'none';
            
            // Set initial classes
            skillsList.classList.add('active');
            toolsList.classList.remove('active');
            skillsBtn.classList.add('active');
            
            // Initialize toggle background position
            if (toggleBox) {
                this.moveToggleBackground(toggleBox, 0);
            }
        }
    }

    // ===== TOOLTIP FUNCTIONALITY =====
    setupTooltips() {
        const skillsCards = document.querySelectorAll('.skills-card');
        
        // Detect if device supports touch
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        skillsCards.forEach((card) => {
            const tooltip = card.querySelector('.tooltip');
            
            if (!tooltip) return;
            
            if (isTouchDevice) {
                // Mobile/Touch devices - use click
                card.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Close all other tooltips
                    skillsCards.forEach(otherCard => {
                        if (otherCard !== card) {
                            otherCard.classList.remove('tooltip-active');
                        }
                    });
                    
                    // Toggle current tooltip
                    card.classList.toggle('tooltip-active');
                });
            } else {
                // Desktop - use hover
                card.addEventListener('mouseenter', () => {
                    // Close all other tooltips first
                    skillsCards.forEach(otherCard => {
                        otherCard.classList.remove('tooltip-active');
                    });
                    
                    // Show current tooltip
                    card.classList.add('tooltip-active');
                });
                
                card.addEventListener('mouseleave', () => {
                    card.classList.remove('tooltip-active');
                });
            }
        });
        
        // Close all tooltips when clicking outside (for mobile)
        if (isTouchDevice) {
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.skills-card')) {
                    skillsCards.forEach(card => {
                        card.classList.remove('tooltip-active');
                    });
                }
            });
        }
        
        // Close tooltips on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                skillsCards.forEach(card => {
                    card.classList.remove('tooltip-active');
                });
            }
        });
    }

    // ===== DOWNLOAD BUTTON FUNCTIONALITY =====
    setupDownloadButton() {
        const downloadBtn = document.getElementById('downloadCvBtn');
        
        if (!downloadBtn) return;
        
        downloadBtn.addEventListener('click', (e) => {
            // Let the default download behavior work
            downloadBtn.classList.add('downloading');
            
            setTimeout(() => {
                downloadBtn.classList.remove('downloading');
                downloadBtn.classList.add('success');
                
                setTimeout(() => {
                    downloadBtn.classList.remove('success');
                }, 2000);
            }, 1000);
        });
    }

    // ===== SCROLL REVEAL ANIMATION =====
    setupScrollReveal() {
        // Check if ScrollReveal is available
        if (typeof ScrollReveal !== 'undefined') {
            const sr = ScrollReveal({
                origin: 'top',
                distance: '80px',
                duration: 2000,
                reset: true
            });

            // Hero Section
            sr.reveal('.featured-text-card', {});
            sr.reveal('.featured-name', { delay: 100 });
            sr.reveal('.featured-text-info', { delay: 200 });
            sr.reveal('.featured-text-btn', { delay: 200 });
            sr.reveal('.social_icons', { delay: 200 });
            sr.reveal('.featured-image', { delay: 300 });

            // About Section
            sr.reveal('.about-img', {});
            sr.reveal('.about-info', { delay: 200 });

            // Skills Section
            sr.reveal('.skills-content', {});
            sr.reveal('.skills-box', { delay: 200 });

            // Timeline Section
            sr.reveal('.timeline-item', { interval: 200 });

            // Cards Section
            sr.reveal('.cards_item', { interval: 200 });

            // Contact Section
            sr.reveal('.contact-info', {});
            sr.reveal('.form-control', { delay: 200 });
        }
    }

    // ===== CERTIFICATIONS SLIDER =====
    setupCertificationsSlider() {
        const track = document.getElementById('certificationsTrack');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const dotsContainer = document.getElementById('sliderDots');
        
        if (!track) return; // Exit if no certifications
        
        const slides = track.querySelectorAll('.certification-slide');
        const totalSlides = slides.length;
        
        if (totalSlides === 0) return;
        
        let currentSlide = 0;
        let autoSlideInterval;
        const autoSlideDelay = 3000;
        
        // Create dots
        const createDots = () => {
            if (!dotsContainer) return;
            dotsContainer.innerHTML = '';
            
            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('span');
                dot.classList.add('dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goToSlide(i));
                dotsContainer.appendChild(dot);
            }
        };
        
        // Update slider position
        const updateSlider = () => {
            const translateX = -(currentSlide * 100);
            track.style.transform = `translateX(${translateX}%)`;
            
            // Update dots
            if (dotsContainer) {
                const dots = dotsContainer.querySelectorAll('.dot');
                dots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === currentSlide);
                });
            }
            
            // Update button states
            if (prevBtn) prevBtn.disabled = currentSlide <= 0;
            if (nextBtn) nextBtn.disabled = currentSlide >= totalSlides - 1;
        };
        
        // Go to specific slide
        const goToSlide = (index) => {
            currentSlide = Math.max(0, Math.min(index, totalSlides - 1));
            updateSlider();
            resetAutoSlide();
        };
        
        // Previous slide
        const prevSlide = () => {
            if (currentSlide > 0) {
                currentSlide--;
                updateSlider();
                resetAutoSlide();
            }
        };
        
        // Next slide
        const nextSlide = () => {
            if (currentSlide < totalSlides - 1) {
                currentSlide++;
            } else {
                currentSlide = 0;
            }
            updateSlider();
            resetAutoSlide();
        };
        
        // Auto advance to next slide
        const startAutoSlide = () => {
            if (totalSlides > 1) {
                autoSlideInterval = setInterval(() => {
                    nextSlide();
                }, autoSlideDelay);
            }
        };
        
        // Reset auto slide timer
        const resetAutoSlide = () => {
            clearInterval(autoSlideInterval);
            startAutoSlide();
        };
        
        // Event listeners
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        
        // Initialize
        createDots();
        updateSlider();
        startAutoSlide();
        
        // Pause auto slide on hover
        const sliderContainer = track.closest('.certifications-slider');
        if (sliderContainer) {
            sliderContainer.addEventListener('mouseenter', () => {
                clearInterval(autoSlideInterval);
            });
            
            sliderContainer.addEventListener('mouseleave', () => {
                startAutoSlide();
            });
        }
    }
}

// ===== GLOBAL FUNCTIONS FOR COMPATIBILITY =====

// Function for mobile menu toggle (for onclick handler)
function toggleMenu() {
    if (window.portfolioManager && window.portfolioManager.isInitialized) {
        window.portfolioManager.toggleMenu();
    }
}

// ===== INITIALIZATION =====
let portfolioManager;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        portfolioManager = new PortfolioManager();
        window.portfolioManager = portfolioManager;
    });
} else {
    // DOM is already loaded
    portfolioManager = new PortfolioManager();
    window.portfolioManager = portfolioManager;
}

// ===== ADDITIONAL EVENT LISTENERS =====

// Window load event for complete initialization
window.addEventListener('load', () => {
    console.log('Portfolio loaded successfully');
});

// Handle window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 900) {
        // Close mobile menu on resize to desktop
        if (portfolioManager && portfolioManager.isInitialized) {
            portfolioManager.closeMenu();
        }
    }
});

// Handle scroll events for navbar transparency
window.addEventListener('scroll', () => {
    const nav = document.getElementById('header');
    if (nav) {
        if (window.scrollY > 50) {
            nav.style.background = 'rgba(10, 10, 10, 0.98)';
        } else {
            nav.style.background = 'rgba(10, 10, 10, 0.95)';
        }
    }
});