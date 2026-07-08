/* ==========================================================================
   DIGITAL MARKETING AGENCY INTERACTIVE LOGIC (VANILLA JS)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initTheme();
    initCustomCursor();
    initNavbar();
    initScrollProgress();
    initCountersAndRadialBars();
    initTestimonialSlider();
    initPortfolioFilter();
    initForms();
    initGlowEffects();
    initBackToTop();
    initHeroConsole();
    initRedirectsTo404();
    initFormInputsValidation();
    initDashboardMobileSidebar();
});

/* ==========================================================================
   1. PRELOADER
   ========================================================================== */
function initPreloader() {
    const preloader = document.querySelector('.preloader');
    if (!preloader) return;

    document.body.style.overflowY = 'hidden';

    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('fade-out');
            document.body.style.overflowY = 'auto'; // Re-enable scroll
        }, 800); // 800ms delay for smooth feedback
    });

    // Fallback in case load event takes too long
    setTimeout(() => {
        if (!preloader.classList.contains('fade-out')) {
            preloader.classList.add('fade-out');
            document.body.style.overflowY = 'auto';
        }
    }, 3500);
}

/* ==========================================================================
   2. THEME SWITCHER (DARK/LIGHT MODE)
   ========================================================================== */
function initTheme() {
    const themeToggle = document.querySelector('.theme-switch');
    if (!themeToggle) return;

    const currentTheme = localStorage.getItem('theme');
    
    // Default to dark mode
    if (currentTheme === 'light') {
        document.body.classList.add('light');
    } else {
        document.body.classList.remove('light');
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light');
        const theme = document.body.classList.contains('light') ? 'light' : 'dark';
        localStorage.setItem('theme', theme);
    });
}

/* ==========================================================================
   3. CUSTOM CURSOR
   ========================================================================== */
function initCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    const cursorDot = document.querySelector('.custom-cursor-dot');
    
    if (!cursor || !cursorDot) return;

    // Detect touch device
    if (window.matchMedia('(pointer: coarse)').matches) {
        cursor.style.display = 'none';
        cursorDot.style.display = 'none';
        return;
    }

    let mouseX = 0, mouseY = 0;     // Current mouse pos
    let cursorX = 0, cursorY = 0;   // Outer circle position
    const speed = 0.12;             // Lerp factor

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Instant position for the inner dot
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
    });

    // Lerp loop for organic outer circle motion
    function animateCursor() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        
        cursorX += dx * speed;
        cursorY += dy * speed;
        
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover styles for links/interactive elements
    const hoverables = document.querySelectorAll('a, button, select, input, textarea, .accordion-header, .filter-btn, .pricing-toggle, .pricing-card');
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
    });
}

/* ==========================================================================
   4. STICKY NAVBAR & NAVIGATION HIGHLIGHT
   ========================================================================== */
function initNavbar() {
    const header = document.querySelector('.header');
    const menuToggle = document.querySelector('.menu-toggle');
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section, header');

    if (!header) return;

    // Scroll Sticky Navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active Nav link on scroll highlight
        let currentSectionId = '';
        sections.forEach(sec => {
            const sectionTop = sec.offsetTop - 140;
            const sectionHeight = sec.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = sec.getAttribute('id') || '';
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${currentSectionId}` || (currentSectionId === 'hero' && href === '#')) {
                link.classList.add('active');
            }
        });
    });

    // Mobile Hamburger Menu
    if (menuToggle && navbar) {
        let overlay = document.querySelector('.drawer-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'drawer-overlay';
            document.body.appendChild(overlay);
        }

        const openMenu = () => {
            navbar.classList.add('active');
            overlay.classList.add('active');
            document.documentElement.classList.add('menu-open');
            document.body.classList.add('menu-open');
            
            const drawerHeader = navbar.querySelector('.drawer-header');
            if (drawerHeader) drawerHeader.style.display = 'flex';
        };

        const closeMenu = () => {
            navbar.classList.remove('active');
            overlay.classList.remove('active');
            document.documentElement.classList.remove('menu-open');
            document.body.classList.remove('menu-open');
        };

        menuToggle.addEventListener('click', openMenu);
        overlay.addEventListener('click', closeMenu);

        const drawerClose = navbar.querySelector('.drawer-close');
        if (drawerClose) {
            drawerClose.addEventListener('click', closeMenu);
        }

        // Close drawer on link selection
        navLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }
}

/* ==========================================================================
   5. SCROLL PROGRESS
   ========================================================================== */
function initScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress-bar');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

/* ==========================================================================
   6. COUNT-UP COUNTERS & PROGRESS RADIALS (INTERSECTION OBSERVER)
   ========================================================================== */
function initCountersAndRadialBars() {
    const counters = document.querySelectorAll('[data-target]');
    const radialBars = document.querySelectorAll('.circle-bar');
    
    // 6.1 Counters Logic
    const countUp = (counter) => {
        const target = +counter.getAttribute('data-target');
        const speed = 100; // Lower is faster
        const increment = target / speed;
        
        let count = 0;
        const updateCount = () => {
            count += increment;
            if (count < target) {
                counter.innerText = Math.ceil(count);
                setTimeout(updateCount, 15);
            } else {
                counter.innerText = target + (counter.getAttribute('data-suffix') || '');
            }
        };
        updateCount();
    };

    // 6.2 Radial Progress Logic
    const animateRadial = (bar) => {
        const targetPercent = +bar.getAttribute('data-percent');
        const radius = 45; // matching circle r=45
        const circumference = 2 * Math.PI * radius; // 282.7
        const offset = circumference - (targetPercent / 100) * circumference;
        bar.style.strokeDashoffset = offset;
    };

    // Intersection Observer to trigger when visible
    const observerOptions = {
        threshold: 0.25,
        rootMargin: '0px 0px -50px 0px'
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Trigger counters inside
                const entryCounters = entry.target.querySelectorAll('[data-target]');
                entryCounters.forEach(c => {
                    if (!c.classList.contains('counted')) {
                        c.classList.add('counted');
                        countUp(c);
                    }
                });

                // Trigger radial circles inside
                const entryRadials = entry.target.querySelectorAll('.circle-bar');
                entryRadials.forEach(bar => {
                    if (!bar.classList.contains('animated')) {
                        bar.classList.add('animated');
                        animateRadial(bar);
                    }
                });

                // Trigger case studies charts height
                const entryChartCols = entry.target.querySelectorAll('.chart-col');
                entryChartCols.forEach(col => {
                    const targetHeight = col.getAttribute('data-height');
                    col.style.height = targetHeight + '%';
                });

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe statistics panels & sections
    const statsSections = document.querySelectorAll('.stats-strip-grid, .why-stats-container, .case-stats-panel, .hero-stats-quick');
    statsSections.forEach(sec => sectionObserver.observe(sec));
}

/* ==========================================================================
   7. TESTIMONIAL SLIDER
   ========================================================================== */
function initTestimonialSlider() {
    const sliderWrapper = document.querySelector('.testimonial-wrapper');
    const slides = document.querySelectorAll('.testimonial-slide');
    const nextBtn = document.querySelector('.slider-btn.next');
    const prevBtn = document.querySelector('.slider-btn.prev');

    if (!sliderWrapper || slides.length === 0) return;

    let currentIndex = 0;
    const updateSlider = () => {
        sliderWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
    };

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateSlider();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateSlider();
        });
    }

    // Auto slide optional
    let autoPlay = setInterval(() => {
        currentIndex = (currentIndex + 1) % slides.length;
        updateSlider();
    }, 6000);

    const sliderContainer = document.querySelector('.testimonials-slider');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', () => clearInterval(autoPlay));
        sliderContainer.addEventListener('mouseleave', () => {
            autoPlay = setInterval(() => {
                currentIndex = (currentIndex + 1) % slides.length;
                updateSlider();
            }, 6000);
        });
    }
}

/* ==========================================================================
   8. PORTFOLIO FILTER
   ========================================================================== */
function initPortfolioFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-grid .portfolio-card');

    if (filterButtons.length === 0 || portfolioCards.length === 0) return;

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.getAttribute('data-filter');

            portfolioCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (category === 'all' || cardCategory === category) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

/* ==========================================================================
   9. PRICING SWITCHER (MONTHLY / YEARLY)
   ========================================================================== */
function initPricingSwitcher() {
    const toggle = document.querySelector('.pricing-toggle');
    const priceAmounts = document.querySelectorAll('.price-amount');

    if (!toggle || priceAmounts.length === 0) return;

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('yearly');
        const isYearly = toggle.classList.contains('yearly');

        priceAmounts.forEach(priceEl => {
            const monthlyVal = priceEl.getAttribute('data-monthly');
            const yearlyVal = priceEl.getAttribute('data-yearly');
            
            if (isYearly) {
                priceEl.innerHTML = `$${yearlyVal}<span>/year</span>`;
            } else {
                priceEl.innerHTML = `$${monthlyVal}<span>/month</span>`;
            }
        });
    });
}

/* ==========================================================================
   10. FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
    const headers = document.querySelectorAll('.accordion-header');

    headers.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const body = item.querySelector('.accordion-body');
            const isActive = item.classList.contains('active');

            // Close all items
            document.querySelectorAll('.accordion-item').forEach(i => {
                i.classList.remove('active');
                i.querySelector('.accordion-body').style.maxHeight = '0px';
            });

            // Toggle clicked item
            if (!isActive) {
                item.classList.add('active');
                body.style.maxHeight = body.scrollHeight + 'px';
            }
        });
    });
}

/* ==========================================================================
   11. FORM VALIDATIONS & BOOKINGS
   ========================================================================== */
function initForms() {
    const forms = document.querySelectorAll('.booking-form, .newsletter-form');

    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Simple validation
            let isValid = true;
            const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = '#ef4444';
                } else {
                    input.style.borderColor = '';
                }
            });

            if (isValid) {
                // Select success message
                const successMsg = form.querySelector('.form-message-success');
                if (successMsg) {
                    successMsg.style.display = 'block';
                    form.reset();
                    setTimeout(() => {
                        successMsg.style.display = 'none';
                    }, 5000);
                } else {
                    showCustomAlert('Thank you! Your submission was successful.', 'success');
                    form.reset();
                }
            }
        });
    });
}

/* ==========================================================================
   12. GLOW HOVER MOUSE TRACKING (Premium UX Details)
   ========================================================================== */
function initGlowEffects() {
    const cards = document.querySelectorAll('.glass-card, .pricing-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

/* ==========================================================================
   13. BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTopBtn.classList.add('active');
        } else {
            backToTopBtn.classList.remove('active');
        }
    });

    backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ==========================================================================
   14. HERO CONTROL PANEL CONSOLE
   ========================================================================== */
function initHeroConsole() {
    const tabButtons = document.querySelectorAll('.console-tab-btn');
    const contentPanels = document.querySelectorAll('.console-content-panel');

    if (tabButtons.length === 0 || contentPanels.length === 0) return;

    const runTabCountUp = (panel) => {
        const counters = panel.querySelectorAll('[data-target]');
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const suffix = counter.getAttribute('data-suffix') || '';
            const speed = 100;
            const increment = target / speed;
            let count = 0;

            const update = () => {
                count += increment;
                if (count < target) {
                    counter.innerText = Math.ceil(count);
                    setTimeout(update, 15);
                } else {
                    counter.innerText = target + suffix;
                }
            };
            
            if (target > 0) {
                update();
            } else {
                counter.innerText = target + suffix;
            }
        });
    };

    // Trigger SVG vector animations based on active tab
    const animateTabSVG = (tabName) => {
        if (typeof gsap === 'undefined') return;

        if (tabName === 'brand') {
            gsap.fromTo('.brand-viz-svg circle', 
                { scale: 0, opacity: 0, transformOrigin: '50% 50%' }, 
                { scale: 1, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'back.out(1.7)' }
            );
            gsap.fromTo('.brand-viz-svg line', 
                { opacity: 0 }, 
                { opacity: 0.4, duration: 0.8, ease: 'power2.out', stagger: 0.05 }
            );
        } else if (tabName === 'seo') {
            const path = document.querySelector('.seo-viz-svg path');
            if (path) {
                const length = path.getTotalLength();
                path.style.strokeDasharray = length;
                path.style.strokeDashoffset = length;
                gsap.to(path, { strokeDashoffset: 0, duration: 1.2, ease: 'power2.out' });
            }
            gsap.fromTo('.seo-viz-svg circle', 
                { scale: 0, transformOrigin: '50% 50%' }, 
                { scale: 1, duration: 0.4, stagger: 0.1, ease: 'back.out' }
            );
        } else if (tabName === 'ppc') {
            gsap.fromTo('.ppc-viz-svg polygon', 
                { opacity: 0, scale: 0.95, transformOrigin: '50% 50%' }, 
                { opacity: 0.7, scale: 1, duration: 0.6, ease: 'power3.out', stagger: 0.05 }
            );
            gsap.fromTo('[class^="funnel-bubble-"]', 
                { y: -30, opacity: 0, scale: 0 }, 
                { y: 0, opacity: 0.8, scale: 1, duration: 0.8, stagger: 0.15, ease: 'back.out(1.5)' }
            );
        }
    };

    const initialActivePanel = document.querySelector('.console-content-panel.active');
    if (initialActivePanel) {
        setTimeout(() => {
            runTabCountUp(initialActivePanel);
            animateTabSVG('brand');
        }, 1000);
    }

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.getAttribute('data-hero-tab');
            
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            contentPanels.forEach(p => p.classList.remove('active'));
            const targetPanel = document.getElementById(`panel-${tabName}`);
            if (targetPanel) {
                targetPanel.classList.add('active');
                runTabCountUp(targetPanel);
                animateTabSVG(tabName);
                
                // Content fade elements
                gsap.fromTo(targetPanel.querySelectorAll('.panel-info > *'), 
                    { y: 15, opacity: 0 }, 
                    { y: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: 'power2.out' }
                );
            }
        });
    });

    // Run hero reveal animations immediately
    if (typeof gsap !== 'undefined') {
        if (document.querySelector('.hero-content')) {
            gsap.set('.hero-content > *', { y: 25, opacity: 0 });
            gsap.set('.hero-graphic', { scale: 0.95, opacity: 0 });
            
            const tl = gsap.timeline({ delay: 0.2 });
            tl.to('.hero-content > *', { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' })
              .to('.hero-graphic', { scale: 1, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.4');
        }
    }
}

/* ==========================================================================
   19. MOCK REDIRECTS FOR UNIMPLEMENTED ACTIONS (404 ROUTING)
   ========================================================================== */
function initRedirectsTo404() {
    document.addEventListener('click', (e) => {
        // 1. Intercept all social media link clicks and Forgot Password links
        const link = e.target.closest('a');
        if (link) {
            const href = link.getAttribute('href');
            const ariaLabel = link.getAttribute('aria-label') || '';
            const innerHTML = link.innerHTML;
            
            // Check if it is a social media link
            const isSocial = 
                link.closest('.social-icons-footer') || 
                ariaLabel.toLowerCase().includes('facebook') || 
                ariaLabel.toLowerCase().includes('twitter') || 
                ariaLabel.toLowerCase().includes('instagram') || 
                ariaLabel.toLowerCase().includes('linkedin') ||
                innerHTML.includes('fa-facebook') ||
                innerHTML.includes('fa-x-twitter') ||
                innerHTML.includes('fa-linkedin') ||
                innerHTML.includes('fa-instagram') ||
                innerHTML.includes('fa-youtube');

            // Check if it is a "Forgot Password" link
            const isForgotPassword = 
                link.textContent.toLowerCase().includes('forgot password') ||
                (href && href.includes('forgot-password'));

            // Check if it is a dashboard "View All" link targeting unimplemented pages
            const isDashboardPlaceholderLink = 
                (link.closest('.panel-box') && link.classList.contains('panel-box-link') && (href === '#' || href === 'work.html'));

            // Check if it is a "Read Details" or "Read Article" link
            const isReadLink = 
                link.textContent.toLowerCase().includes('read details') ||
                link.textContent.toLowerCase().includes('read article') ||
                link.textContent.toLowerCase().includes('read case study') ||
                link.textContent.toLowerCase().includes('read more') ||
                link.classList.contains('blog-link') ||
                link.classList.contains('read-details');

            if (isSocial || isForgotPassword || isDashboardPlaceholderLink || isReadLink) {
                e.preventDefault();
                window.location.href = '404.html';
                return;
            }
        }

        // 2. Intercept mock submissions/clicks on inner buttons of dashboards
        const btn = e.target.closest('button, input[type="submit"]');
        if (btn) {
            // Ignore theme toggles, menu drawer close/open buttons, slider navigation buttons
            if (
                btn.classList.contains('theme-switch') || 
                btn.classList.contains('drawer-close') || 
                btn.classList.contains('drawer-toggle') || 
                btn.closest('.theme-switch') || 
                btn.closest('.drawer-close') || 
                btn.closest('.drawer-toggle') || 
                btn.classList.contains('slider-btn') || 
                btn.closest('.slider-btn')
            ) {
                return;
            }
            
            // If button contains "Read Details", "Read Article", or "Read More"
            const btnText = btn.textContent.toLowerCase();
            const isReadBtn = btnText.includes('read details') || btnText.includes('read article') || btnText.includes('read case study') || btnText.includes('read more') || btn.classList.contains('read-details');

            // If button is inside a form in dashboard contexts or is a Read button
            const isInDashboard = document.querySelector('.db-container') !== null;
            if (isInDashboard || isReadBtn) {
                e.preventDefault();
                window.location.href = '404.html';
            }
        }
    });
}

function initFormInputsValidation() {
    // 1. Name fields: restrict to letters and spaces only
    const nameInputs = document.querySelectorAll('#contact-name, #reg-name');
    nameInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^A-Za-z\s\.\']/g, '');
        });
    });

    // 2. Phone fields: restrict to digits only
    const phoneInputs = document.querySelectorAll('#contact-phone, #reg-phone');
    phoneInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
        });
    });

    // Helper: validate password complexity (8+ chars, upper, lower, digit, special symbol)
    const validatePassword = (passVal) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._\-#^&+=])[A-Za-z\d@$!%*?&._\-#^&+=]{8,}$/;
        return regex.test(passVal);
    };

    // 3. Register form submission intercept
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nameVal = document.getElementById('reg-name').value.trim();
            const phoneVal = document.getElementById('reg-phone').value.trim();
            const passVal = document.getElementById('reg-password').value;
            const confirmVal = document.getElementById('reg-confirm').value;

            // Letters only validation
            if (!/^[A-Za-z\s\.\']+$/.test(nameVal)) {
                showCustomAlert("Full Name must contain letters and spaces only.");
                return;
            }

            // Digits only validation
            if (!/^[0-9]+$/.test(phoneVal)) {
                showCustomAlert("Phone Number must contain digits only.");
                return;
            }

            // Password complexity check
            if (!validatePassword(passVal)) {
                showCustomAlert("Password must be at least 8 characters long and contain a combination of uppercase letters, lowercase letters, digits, and special symbols (@$!%*?&._-#^&+=).");
                return;
            }

            // Password matching check
            if (passVal !== confirmVal) {
                showCustomAlert("Passwords do not match.");
                return;
            }

            // Success: Hide form and show success message
            registerForm.style.display = 'none';
            const successMsg = document.getElementById('registerSuccess');
            if (successMsg) {
                successMsg.style.display = 'block';
                successMsg.scrollIntoView({ behavior: 'smooth' });
            }
            
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2500);
        });
    }

    // 4. Login form submission intercept
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const emailVal = document.getElementById('email').value.trim();
            const passVal = document.getElementById('password').value;
            const roleVal = document.getElementById('role').value;

            // Password complexity check
            if (!validatePassword(passVal)) {
                showCustomAlert("Password must be at least 8 characters long and contain a combination of uppercase letters, lowercase letters, digits, and special symbols (@$!%*?&._-#^&+=).");
                return;
            }

            // Success: Hide form and show success message
            loginForm.style.display = 'none';
            const successMsg = document.getElementById('loginSuccess');
            if (successMsg) {
                successMsg.style.display = 'block';
                successMsg.scrollIntoView({ behavior: 'smooth' });
            }

            setTimeout(() => {
                window.location.href = (roleVal === 'admin') ? 'admin-dashboard.html' : 'dashboard.html';
            }, 1500);
        });
    }

    // 5. Contact form submission intercept
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameVal = document.getElementById('contact-name').value.trim();
            const phoneVal = document.getElementById('contact-phone').value.trim();

            // Letters only validation
            if (!/^[A-Za-z\s\.\']+$/.test(nameVal)) {
                showCustomAlert("Full Name must contain letters and spaces only.");
                return;
            }

            // Digits only validation
            if (!/^[0-9]+$/.test(phoneVal)) {
                showCustomAlert("Phone Number must contain digits only.");
                return;
            }

            showCustomAlert("Thank you! Your message has been sent successfully. One of our growth architects will contact you within 24 hours.", "success");
            contactForm.reset();
        });
    }
}

// 6. Dashboard Mobile Sidebar Drawer Toggle Logic
function initDashboardMobileSidebar() {
    const hamburger = document.querySelector('.db-hamburger');
    const closeBtn = document.querySelector('.db-sidebar-close');
    const sidebar = document.querySelector('.db-sidebar');
    const overlay = document.querySelector('.db-sidebar-overlay');

    if (hamburger && sidebar) {
        hamburger.addEventListener('click', () => {
            sidebar.classList.add('active');
            if (overlay) overlay.classList.add('active');
        });
    }

    const closeSidebar = () => {
        if (sidebar) sidebar.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
    };

    if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
    if (overlay) overlay.addEventListener('click', closeSidebar);
}

// 7. Reusable Custom Alert Modal Dialog (Glassmorphism Modal UI)
function showCustomAlert(message, type = 'error') {
    if (document.querySelector('.custom-alert-overlay')) return;

    const overlay = document.createElement('div');
    overlay.className = 'custom-alert-overlay';
    
    const modal = document.createElement('div');
    modal.className = 'custom-alert-modal glass-card';
    
    const iconClass = type === 'success' ? 'fa-circle-check' : 'fa-triangle-exclamation';
    const iconColor = type === 'success' ? '#10b981' : '#ef4444';
    
    modal.innerHTML = `
        <div class="custom-alert-icon" style="color: ${iconColor};"><i class="fa-solid ${iconClass}"></i></div>
        <p class="custom-alert-message">${message}</p>
        <button class="custom-alert-btn">OK</button>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    setTimeout(() => {
        overlay.classList.add('active');
        modal.classList.add('active');
    }, 10);
    
    const closeBtn = modal.querySelector('.custom-alert-btn');
    const closeAlert = () => {
        overlay.classList.remove('active');
        modal.classList.remove('active');
        setTimeout(() => {
            overlay.remove();
        }, 300);
    };
    
    closeBtn.addEventListener('click', closeAlert);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeAlert();
    });
}
