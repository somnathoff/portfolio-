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
    // ===== NAVIGATION =====
setupNavigation() {
    this.setupMobileMenu();
    this.setupSmoothScrolling();
    this.setupScrollSpy();
}

setupMobileMenu() {
    const navMenu = document.getElementById('myNavMenu');
    const menuBtn = document.querySelector('.nav-menu-btn i');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!navMenu || !menuBtn) return;

    // Add click event to menu button
    menuBtn.addEventListener('click', (e) => {
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
        const menuBtnContainer = document.querySelector('.nav-menu-btn');
        
        if (navMenu && menuBtnContainer && 
            !navMenu.contains(event.target) && 
            !menuBtnContainer.contains(event.target) && 
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
    
    // Prevent default behavior that might cause layout shifts
    return false;
}

openMenu() {
    const navMenu = document.getElementById('myNavMenu');
    const menuIcon = document.querySelector('.nav-menu-btn i');
    
    navMenu.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Change icon with a stable transition
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

    // ===== SKILLS TOGGLE FUNCTIONALITY - FIXED =====
    // ===== SKILLS TOGGLE FUNCTIONALITY - FIXED =====
setupSkillsToggle() {
    const toggleBtns = document.querySelectorAll('[data-toggle-btn]');
    const skillsList = document.querySelector('.skills-list');
    const toolsList = document.querySelector('.tools-list');
    const toggleBox = document.querySelector('[data-toggle-box]');

    if (!toggleBox || toggleBtns.length === 0 || !skillsList || !toolsList) {
        console.warn('Skills toggle elements not found');
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
            // Prevent immediate navigation to allow animation to play
            e.preventDefault();
            
            // Add downloading class for animation
            downloadBtn.classList.add('downloading');
            
            // Store the original href
            const originalHref = downloadBtn.href;
            
            // Simulate download process with a short delay
            setTimeout(() => {
                // Remove downloading class and add success class
                downloadBtn.classList.remove('downloading');
                downloadBtn.classList.add('success');
                
                // Actually trigger the download after animation
                setTimeout(() => {
                    window.location.href = originalHref;
                    
                    // Reset button after a delay
                    setTimeout(() => {
                        downloadBtn.classList.remove('success');
                    }, 2000);
                }, 1000);
            }, 1500);
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
        const autoSlideDelay = 2500; // 2.5 seconds between slides
        
        // Create dots - one for each slide
        const createDots = () => {
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
            // For single slide display, we just need to move to the correct slide
            const translateX = -(currentSlide * 100); // 100% per slide
            track.style.transform = `translateX(${translateX}%)`;
            
            // Update dots
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
            
            // Update button states
            prevBtn.disabled = currentSlide <= 0;
            nextBtn.disabled = currentSlide >= totalSlides - 1;
        };
        
        // Go to specific slide
        const goToSlide = (index) => {
            currentSlide = Math.max(0, Math.min(index, totalSlides - 1));
            updateSlider();
            resetAutoSlide(); // Reset the timer when manually navigating
        };
        
        // Previous slide
        const prevSlide = () => {
            if (currentSlide > 0) {
                currentSlide--;
                updateSlider();
                resetAutoSlide(); // Reset the timer when manually navigating
            }
        };
        
        // Next slide
        const nextSlide = () => {
            if (currentSlide < totalSlides - 1) {
                currentSlide++;
            } else {
                // If we're at the last slide, loop back to the first
                currentSlide = 0;
            }
            updateSlider();
            resetAutoSlide(); // Reset the timer when manually navigating
        };
        
        // Auto advance to next slide
        const startAutoSlide = () => {
            autoSlideInterval = setInterval(() => {
                nextSlide();
            }, autoSlideDelay);
        };
        
        // Reset auto slide timer
        const resetAutoSlide = () => {
            clearInterval(autoSlideInterval);
            startAutoSlide();
        };
        
        // Pause auto slide on hover
        const setupAutoSlideControls = () => {
            const sliderContainer = track.closest('.certifications-slider');
            
            sliderContainer.addEventListener('mouseenter', () => {
                clearInterval(autoSlideInterval);
            });
            
            sliderContainer.addEventListener('mouseleave', () => {
                startAutoSlide();
            });
            
            // Also pause on focus for accessibility
            sliderContainer.addEventListener('focusin', () => {
                clearInterval(autoSlideInterval);
            });
            
            sliderContainer.addEventListener('focusout', () => {
                startAutoSlide();
            });
        };
        
        // Event listeners
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);
        
        // Handle window resize
        const handleResize = () => {
            // For single slide display, no special resize handling needed
            updateSlider();
        };
        
        // Initialize
        window.addEventListener('resize', handleResize);
        createDots();
        updateSlider();
        startAutoSlide();
        setupAutoSlideControls();
        
        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                prevSlide();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
            }
        });
        
        // Add swipe support for touch devices
        let touchStartX = 0;
        let touchEndX = 0;
        
        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            clearInterval(autoSlideInterval); // Pause auto slide during interaction
        }, false);
        
        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            startAutoSlide(); // Resume auto slide after interaction
        }, false);
        
        const handleSwipe = () => {
            const minSwipeDistance = 50; // Minimum distance for a swipe to count
            
            if (touchEndX < touchStartX && touchStartX - touchEndX > minSwipeDistance) {
                // Swipe left - go to next slide
                nextSlide();
            }
            
            if (touchEndX > touchStartX && touchEndX - touchStartX > minSwipeDistance) {
                // Swipe right - go to previous slide
                prevSlide();
            }
        };
    }
}

// ===== GLOBAL FUNCTIONS FOR COMPATIBILITY =====

// Function for mobile menu toggle (for onclick handler)
function myMenuFunction() {
    if (window.portfolioManager && window.portfolioManager.isInitialized) {
        window.portfolioManager.toggleMenu();
    }
}

// Alternative function name for compatibility
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