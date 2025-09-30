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
            this.setupFadeAnimation();
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

    // ===== Fade In Letter by Letter - FIXED =====
    setupFadeAnimation() {
        const element = document.querySelector('.typedText');
        if (!element) {
            console.warn('typedText element not found');
            return;
        }

        const texts = ['SOMNATH', 'SOMU'];
        let textIndex = 0;
        let isAnimating = false;
        
        // Add CSS for fade animation - CRITICAL for visibility
        const styleId = 'fade-animation-style';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                @keyframes letterFadeIn {
                    0% { 
                        opacity: 0; 
                        transform: translateY(30px) scale(0.8); 
                    }
                    100% { 
                        opacity: 1; 
                        transform: translateY(0) scale(1); 
                    }
                }
                
                @keyframes letterFadeOut {
                    0% { 
                        opacity: 1; 
                        transform: translateY(0) scale(1); 
                    }
                    100% { 
                        opacity: 0; 
                        transform: translateY(-20px) scale(0.9); 
                    }
                }
                
                .typedText {
                    min-height: 1.5em;
                    display: inline-block;
                    white-space: nowrap;
                }
                
                .typedText .letter {
                    display: inline-block;
                    opacity: 0;
                }
                
                .typedText .letter.fade-in {
                    animation: letterFadeIn 0.6s ease-out forwards;
                }
                
                .typedText .letter.fade-out {
                    animation: letterFadeOut 0.4s ease-in forwards;
                }
            `;
            document.head.appendChild(style);
        }
        
        const animateText = () => {
            if (isAnimating) return;
            isAnimating = true;
            
            const text = texts[textIndex];
            element.innerHTML = '';
            
            // Create letter spans
            const letters = text.split('').map((char, i) => {
                const span = document.createElement('span');
                span.className = 'letter';
                span.textContent = char;
                span.style.animationDelay = `${i * 0.1}s`;
                return span;
            });
            
            // Add all letters to DOM
            letters.forEach(letter => element.appendChild(letter));
            
            // Trigger fade-in animation with a small delay to ensure CSS is applied
            setTimeout(() => {
                letters.forEach(letter => letter.classList.add('fade-in'));
            }, 50);
            
            // Calculate when animation completes
            const fadeInDuration = (letters.length * 0.1 + 0.6) * 1000;
            const displayTime = 2500; // Show text for 2.5 seconds
            
            // After fade-in completes + display time, start fade-out
            setTimeout(() => {
                // Fade out
                letters.forEach((letter, i) => {
                    letter.classList.remove('fade-in');
                    letter.style.animationDelay = `${i * 0.05}s`;
                    letter.classList.add('fade-out');
                });
                
                // After fade-out, start next text
                const fadeOutDuration = (letters.length * 0.05 + 0.4) * 1000;
                setTimeout(() => {
                    textIndex = (textIndex + 1) % texts.length;
                    isAnimating = false;
                    animateText();
                }, fadeOutDuration);
                
            }, fadeInDuration + displayTime);
        };
        
        // Start animation after a short delay
        setTimeout(() => {
            animateText();
        }, 500);
    }

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
            const menuBtn = document.querySelector('.nav-menu-btn');
            
            if (navMenu && menuBtn && 
                !navMenu.contains(event.target) && 
                !menuBtn.contains(event.target) && 
                navMenu.classList.contains('active')) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        const navMenu = document.getElementById('myNavMenu');
        
        if (navMenu.classList.contains('active')) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        const navMenu = document.getElementById('myNavMenu');
        const menuBtn = document.querySelector('.nav-menu-btn i');
        
        navMenu.classList.add('active');
        menuBtn.classList.remove('uil-bars');
        menuBtn.classList.add('uil-times');
        document.body.style.overflow = 'hidden';
    }

    closeMenu() {
        const navMenu = document.getElementById('myNavMenu');
        const menuBtn = document.querySelector('.nav-menu-btn i');
        
        if (navMenu) navMenu.classList.remove('active');
        if (menuBtn) {
            menuBtn.classList.remove('uil-times');
            menuBtn.classList.add('uil-bars');
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
            console.warn('Skills toggle elements not found');
            return;
        }

        this.initializeDefaultSkillsState();

        toggleBtns.forEach((btn, index) => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                
                toggleBtns.forEach(toggleBtn => {
                    toggleBtn.classList.remove('active');
                });
                
                btn.classList.add('active');
                
                const buttonText = btn.textContent.toLowerCase().trim();
                
                if (buttonText.includes('skills')) {
                    skillsList.style.display = 'flex';
                    toolsList.style.display = 'none';
                    skillsList.classList.add('active');
                    toolsList.classList.remove('active');
                    
                    this.moveToggleBackground(toggleBox, 0);
                } else if (buttonText.includes('tools')) {
                    skillsList.style.display = 'none';
                    toolsList.style.display = 'flex';
                    skillsList.classList.remove('active');
                    toolsList.classList.add('active');
                    
                    this.moveToggleBackground(toggleBox, 1);
                }
            });
        });
    }

    moveToggleBackground(toggleBox, buttonIndex) {
        const toggleBtns = toggleBox.querySelectorAll('[data-toggle-btn]');
        if (toggleBtns.length === 0) return;
        
        const buttonWidth = toggleBtns[0].offsetWidth;
        const translateX = buttonIndex * buttonWidth;
        
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

    initializeDefaultSkillsState() {
        const skillsList = document.querySelector('.skills-list');
        const toolsList = document.querySelector('.tools-list');
        const skillsBtn = document.querySelector('[data-toggle-btn]:first-child');
        const toggleBox = document.querySelector('[data-toggle-box]');
        
        if (skillsList && toolsList && skillsBtn) {
            skillsList.style.display = 'flex';
            toolsList.style.display = 'none';
            
            skillsList.classList.add('active');
            toolsList.classList.remove('active');
            skillsBtn.classList.add('active');
            
            if (toggleBox) {
                this.moveToggleBackground(toggleBox, 0);
            }
        }
    }

    // ===== TOOLTIP FUNCTIONALITY =====
    setupTooltips() {
        const skillsCards = document.querySelectorAll('.skills-card');
        
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        skillsCards.forEach((card) => {
            const tooltip = card.querySelector('.tooltip');
            
            if (!tooltip) return;
            
            if (isTouchDevice) {
                card.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    skillsCards.forEach(otherCard => {
                        if (otherCard !== card) {
                            otherCard.classList.remove('tooltip-active');
                        }
                    });
                    
                    card.classList.toggle('tooltip-active');
                });
            } else {
                card.addEventListener('mouseenter', () => {
                    skillsCards.forEach(otherCard => {
                        otherCard.classList.remove('tooltip-active');
                    });
                    
                    card.classList.add('tooltip-active');
                });
                
                card.addEventListener('mouseleave', () => {
                    card.classList.remove('tooltip-active');
                });
            }
        });
        
        if (isTouchDevice) {
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.skills-card')) {
                    skillsCards.forEach(card => {
                        card.classList.remove('tooltip-active');
                    });
                }
            });
        }
        
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
            e.preventDefault();
            
            downloadBtn.classList.add('downloading');
            
            const originalHref = downloadBtn.href;
            
            setTimeout(() => {
                downloadBtn.classList.remove('downloading');
                downloadBtn.classList.add('success');
                
                setTimeout(() => {
                    window.location.href = originalHref;
                    
                    setTimeout(() => {
                        downloadBtn.classList.remove('success');
                    }, 2000);
                }, 1000);
            }, 1500);
        });
    }

    // ===== SCROLL REVEAL ANIMATION =====
    setupScrollReveal() {
        if (typeof ScrollReveal !== 'undefined') {
            const sr = ScrollReveal({
                origin: 'top',
                distance: '80px',
                duration: 2000,
                reset: true
            });

            sr.reveal('.featured-text-card', {});
            sr.reveal('.featured-name', { delay: 100 });
            sr.reveal('.featured-text-info', { delay: 200 });
            sr.reveal('.featured-text-btn', { delay: 200 });
            sr.reveal('.social_icons', { delay: 200 });
            sr.reveal('.featured-image', { delay: 300 });

            sr.reveal('.about-img', {});
            sr.reveal('.about-info', { delay: 200 });

            sr.reveal('.skills-content', {});
            sr.reveal('.skills-box', { delay: 200 });

            sr.reveal('.timeline-item', { interval: 200 });

            sr.reveal('.cards_item', { interval: 200 });

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
        
        if (!track) return;
        
        const slides = track.querySelectorAll('.certification-slide');
        const totalSlides = slides.length;
        
        if (totalSlides === 0) return;
        
        let currentSlide = 0;
        let autoSlideInterval;
        const autoSlideDelay = 2500;
        
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
        
        const updateSlider = () => {
            const translateX = -(currentSlide * 100);
            track.style.transform = `translateX(${translateX}%)`;
            
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
            
            prevBtn.disabled = currentSlide <= 0;
            nextBtn.disabled = currentSlide >= totalSlides - 1;
        };
        
        const goToSlide = (index) => {
            currentSlide = Math.max(0, Math.min(index, totalSlides - 1));
            updateSlider();
            resetAutoSlide();
        };
        
        const prevSlide = () => {
            if (currentSlide > 0) {
                currentSlide--;
                updateSlider();
                resetAutoSlide();
            }
        };
        
        const nextSlide = () => {
            if (currentSlide < totalSlides - 1) {
                currentSlide++;
            } else {
                currentSlide = 0;
            }
            updateSlider();
            resetAutoSlide();
        };
        
        const startAutoSlide = () => {
            autoSlideInterval = setInterval(() => {
                nextSlide();
            }, autoSlideDelay);
        };
        
        const resetAutoSlide = () => {
            clearInterval(autoSlideInterval);
            startAutoSlide();
        };
        
        const setupAutoSlideControls = () => {
            const sliderContainer = track.closest('.certifications-slider');
            
            sliderContainer.addEventListener('mouseenter', () => {
                clearInterval(autoSlideInterval);
            });
            
            sliderContainer.addEventListener('mouseleave', () => {
                startAutoSlide();
            });
            
            sliderContainer.addEventListener('focusin', () => {
                clearInterval(autoSlideInterval);
            });
            
            sliderContainer.addEventListener('focusout', () => {
                startAutoSlide();
            });
        };
        
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);
        
        const handleResize = () => {
            updateSlider();
        };
        
        window.addEventListener('resize', handleResize);
        createDots();
        updateSlider();
        startAutoSlide();
        setupAutoSlideControls();
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                prevSlide();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
            }
        });
        
        let touchStartX = 0;
        let touchEndX = 0;
        
        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            clearInterval(autoSlideInterval);
        }, false);
        
        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            startAutoSlide();
        }, false);
        
        const handleSwipe = () => {
            const minSwipeDistance = 50;
            
            if (touchEndX < touchStartX && touchStartX - touchEndX > minSwipeDistance) {
                nextSlide();
            }
            
            if (touchEndX > touchStartX && touchEndX - touchStartX > minSwipeDistance) {
                prevSlide();
            }
        };
    }
}

// Initialize the portfolio manager when the script loads
const portfolioManager = new PortfolioManager();