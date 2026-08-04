// === COMPONENT LOADER ===
// Components are loaded via <script src="components/header.js"> and footer.js
// which work on both file:// and http://. This function just re-initializes
// all features that depend on the loaded components.
async function loadComponents() {
    // If placeholders still exist, components weren't loaded by JS files yet
    // Try fetch as fallback (works on HTTP servers)
    const headerEl = document.getElementById('header-placeholder');
    const footerEl = document.getElementById('footer-placeholder');

    if (headerEl || footerEl) {
        // Detect base path for subdirectory pages (e.g. /blog/)
        let basePath = '';
        const scriptEl = document.querySelector('script[src*="assets/js/script.js"]');
        if (scriptEl) {
            const src = scriptEl.getAttribute('src');
            basePath = src.substring(0, src.indexOf('assets/js/script.js'));
        }

        const loads = [];
        if (headerEl) {
            loads.push(
                fetch(basePath + 'components/header.html')
                    .then(r => r.text())
                    .then(html => { headerEl.outerHTML = html; })
                    .catch(() => { })
            );
        }
        if (footerEl) {
            loads.push(
                fetch(basePath + 'components/footer.html')
                    .then(r => r.text())
                    .then(html => { footerEl.outerHTML = html; })
                    .catch(() => { })
            );
        }
        if (loads.length) await Promise.all(loads);
    }

    // Re-initialize all features that depend on loaded components
    initNavbarScroll();
    initThemeToggle();
    initActiveNav();
    initLightbox();
    initAdminChatWidget();
    bindSmoothScroll();
    bindNavLinks();
}

// === NAVBAR SCROLL EFFECT ===
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    // Remove old listener by using a named function
    window.removeEventListener('scroll', navbarScrollHandler);
    window.addEventListener('scroll', navbarScrollHandler);
}

function navbarScrollHandler() {
    const navbar = document.getElementById('navbar');
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
}

const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// === HAMBURGER MENU ===
function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    const hamburger = document.getElementById('hamburger');
    navLinks.classList.toggle('open');
    hamburger?.classList.toggle('active', navLinks.classList.contains('open'));
}
// Close menu on link click, except for dropdown toggles
function bindNavLinks() {
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.classList.contains('nav-dropdown-toggle')) {
                // Prevent default scroll
                e.preventDefault();
                // Toggle the dropdown on mobile
                const parentDropdown = link.closest('.nav-dropdown');
                parentDropdown.classList.toggle('active');
                return;
            }

            document.getElementById('navLinks').classList.remove('open');
            document.getElementById('hamburger')?.classList.remove('active');
        });
    });
}
bindNavLinks();

document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    document.getElementById('navLinks')?.classList.remove('open');
    document.getElementById('hamburger')?.classList.remove('active');
});

// === DARK / LIGHT THEME ===
// Theme toggle is now handled by components/theme.js
// initThemeToggle() is defined there and called automatically


// === SCROLL REVEAL ANIMATION ===
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('active');
            }, i * 50);
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

// === FLOATING PARTICLES (multi-color) ===
// Reduced on mobile to prevent GPU overload & overheating
const particlesContainer = document.getElementById('particles');
if (particlesContainer) {
    const isMobile = window.innerWidth <= 1024;
    const particleCount = isMobile ? 6 : 28;
    const colors = ['#5b9aff', '#00d4ff', '#ffffff', '#8b5cf6', '#a8c8ff'];
    for (let i = 0; i < particleCount; i++) {
        const p = document.createElement('div');
        p.classList.add('particle');
        p.style.left = Math.random() * 100 + '%';
        p.style.animationDuration = (8 + Math.random() * 14) + 's';
        p.style.animationDelay = Math.random() * 10 + 's';
        const size = (2 + Math.random() * 3) + 'px';
        p.style.width = size;
        p.style.height = size;
        p.style.background = colors[Math.floor(Math.random() * colors.length)];
        p.style.opacity = (0.08 + Math.random() * 0.15).toString();
        particlesContainer.appendChild(p);
    }
}

// === SMOOTH SCROLL FOR ANCHOR LINKS ===
function bindSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}
bindSmoothScroll();

function initHeroCarousel() {
    const carousel = document.querySelector('[data-hero-carousel]');
    if (!carousel) return;
    const slides = Array.from(carousel.querySelectorAll('.hero-banner'));
    if (slides.length < 2) return;
    let active = 1;
    let autoTimer;
    let isDragging = false;
    let startX = 0;
    let currentX = 0;
    let dragOffset = 0;
    let isInitial = true;
    const baseTransforms = new Map();

    // Allow horizontal swipe without browser intercepting
    carousel.style.touchAction = 'pan-y';

    const render = () => {
        const len = slides.length;
        slides.forEach((slide, index) => {
            if (isInitial) slide.style.transition = 'none';
            slide.classList.remove('is-active', 'is-prev', 'is-next', 'is-far-prev', 'is-far-next');
            slide.style.transform = '';

            if (index === active) {
                slide.classList.add('is-active');
            } else if (index === (active - 1 + len) % len) {
                slide.classList.add('is-prev');
            } else if (index === (active + 1) % len) {
                slide.classList.add('is-next');
            } else if (len > 4 && index === (active - 2 + len) % len) {
                slide.classList.add('is-far-prev');
            } else {
                slide.classList.add('is-far-next');
            }
        });

        if (isInitial) {
            slides[0].offsetHeight; // Force reflow
            slides.forEach(slide => slide.style.transition = '');
            isInitial = false;
        }
    };
    const goTo = (index) => {
        active = (index + slides.length) % slides.length;
        render();
    };
    const startAuto = () => {
        clearInterval(autoTimer);
        autoTimer = setInterval(() => goTo(active + 1), 3600);
    };
    const stopAuto = () => clearInterval(autoTimer);
    slides.forEach((slide) => {
        const image = slide.querySelector('img');
        if (image) image.draggable = false;
    });

    const getBaseTransform = (slide) => {
        if (slide.classList.contains('is-active')) return 'translate(-50%, -50%) scale(1)';
        if (slide.classList.contains('is-prev')) return 'translate(-145%, -50%) scale(.8)';
        if (slide.classList.contains('is-next')) return 'translate(45%, -50%) scale(.8)';
        if (slide.classList.contains('is-far-prev')) return 'translate(-245%, -50%) scale(.8)';
        if (slide.classList.contains('is-far-next')) return 'translate(145%, -50%) scale(.8)';
        return 'translate(-50%, -50%) scale(.72)';
    };

    carousel.addEventListener('pointerdown', (event) => {
        isDragging = true;
        startX = event.clientX;
        currentX = startX;
        dragOffset = 0;
        stopAuto();
        carousel.classList.add('is-dragging');
        carousel.setPointerCapture?.(event.pointerId);
        // Store each slide's exact base transform
        baseTransforms.clear();
        slides.forEach(s => {
            baseTransforms.set(s, getBaseTransform(s));
        });
        // Disable CSS transition during drag
        slides.forEach(s => s.style.transition = 'none');
    });

    carousel.addEventListener('pointermove', (event) => {
        if (!isDragging) return;
        currentX = event.clientX;
        dragOffset = currentX - startX;
        // Apply drag offset on top of each slide's base transform
        slides.forEach(s => {
            let base = baseTransforms.get(s);
            // Fix 4-slide carousel issue: if swiping right, teleport the hidden slide to the left
            if (slides.length === 4 && s.classList.contains('is-far-next') && dragOffset > 0) {
                base = 'translate(-245%, -50%) scale(.8)';
            }
            s.style.transform = `${base} translateX(${dragOffset}px)`;
        });
    });

    const finishDrag = (event) => {
        if (!isDragging) return;
        const diff = currentX - startX;
        isDragging = false;
        dragOffset = 0;
        carousel.classList.remove('is-dragging');
        carousel.releasePointerCapture?.(event.pointerId);
        // Reset inline transforms and re-enable transition
        slides.forEach(s => {
            s.style.transform = '';
            s.style.transition = '';
        });
        if (Math.abs(diff) > 45) goTo(active + (diff < 0 ? 1 : -1));
        startAuto();
    };

    carousel.addEventListener('pointerup', finishDrag);
    carousel.addEventListener('pointercancel', finishDrag);
    carousel.addEventListener('pointerleave', finishDrag);
    render();
    startAuto();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroCarousel);
} else {
    initHeroCarousel();
}

function initHomeHbCheck() {
    const form = document.querySelector('[data-home-hb-form]');
    if (!form) return;
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const id = form.gameId.value.replace(/\D/g, '');
        if (!id) {
            form.gameId.focus();
            return;
        }
        location.href = `view.html?id=${encodeURIComponent(id)}`;
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHomeHbCheck);
} else {
    initHomeHbCheck();
}

// === COUNTER ANIMATION FOR STATS ===
function animateCounter(el, target, suffix = '') {
    const isPercent = target.includes('%');
    const isPlus = target.includes('+');
    const num = parseInt(target);
    if (isNaN(num)) return;
    let current = 0;
    const duration = 1800;
    const step = Math.max(1, Math.floor(num / (duration / 16)));
    const timer = setInterval(() => {
        current += step;
        if (current >= num) {
            current = num;
            clearInterval(timer);
        }
        el.textContent = current + (isPercent ? '%' : '') + (isPlus ? '+' : '');
    }, 16);
}

const statElements = document.querySelectorAll('.stat-number');
if (statElements.length) {
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                if (!el.dataset.animated) {
                    el.dataset.animated = '1';
                    animateCounter(el, el.textContent.trim());
                }
                statObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    statElements.forEach(el => statObserver.observe(el));
}

// === ACTIVE NAV LINK HIGHLIGHTING ===
function initActiveNav() {
    const allNavLinks = document.querySelectorAll('.nav-links a');
    const currentPage = location.pathname.split('/').pop() || 'index.html';
    const isHome = currentPage === 'index.html' || currentPage === 'index2.html' || currentPage === '' || currentPage === '/';

    // 1) On sub-pages (search, lapor, view): highlight based on URL
    if (!isHome) {
        allNavLinks.forEach(link => {
            const href = link.getAttribute('href') || '';
            const linkPage = href.split('#')[0].split('/').pop();
            if (linkPage && linkPage === currentPage && !link.classList.contains('nav-cta')) {
                link.classList.add('is-active');
            }
        });
        return;
    }

    // 2) On index.html: highlight based on scroll position
    const sections = document.querySelectorAll('section[id]');
    const allLinks = document.querySelectorAll('.nav-links a');
    if (!sections.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                allLinks.forEach(link => {
                    const href = link.getAttribute('href') || '';
                    // Only process links that actually point to an anchor
                    if (href.includes('#')) {
                        link.classList.toggle('is-active', href.endsWith('#' + id));
                    }
                });
            }
        });
    }, { rootMargin: '-30% 0px -60% 0px' });

    sections.forEach(sec => observer.observe(sec));
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initActiveNav);
} else {
    initActiveNav();
}

// === PAYMENT MARQUEE DRAG SCROLL ===
function initPaymentScroll() {
    document.querySelectorAll('[data-payment-scroll]').forEach(track => {
        const wrapper = track.parentElement;
        let isDragging = false;
        let startX = 0;
        let scrollOffset = 0;
        let currentOffset = 0;

        function getAnimatedOffset() {
            const style = getComputedStyle(track);
            const matrix = new DOMMatrix(style.transform);
            return matrix.m41;
        }

        // Allow horizontal swipe on mobile without browser blocking
        wrapper.style.touchAction = 'pan-y';

        wrapper.addEventListener('pointerdown', (e) => {
            isDragging = true;
            startX = e.clientX;
            currentOffset = getAnimatedOffset();
            scrollOffset = currentOffset;
            track.classList.add('is-dragging');
            track.style.transform = `translateX(${currentOffset}px)`;
            track.style.animation = 'none';
            wrapper.setPointerCapture(e.pointerId);
            e.preventDefault();
        });

        wrapper.addEventListener('pointermove', (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            scrollOffset = currentOffset + dx;
            track.style.transform = `translateX(${scrollOffset}px)`;
        });

        const finishDrag = (e) => {
            if (!isDragging) return;
            isDragging = false;
            track.classList.remove('is-dragging');
            wrapper.releasePointerCapture(e.pointerId);

            // Calculate where we are as a percentage of half-width (the loop point)
            const halfWidth = track.scrollWidth / 2;
            // Normalize offset to be within the loop range
            let normalizedOffset = scrollOffset % halfWidth;
            if (normalizedOffset > 0) normalizedOffset -= halfWidth;

            // Resume animation from current position
            track.style.animation = 'none';
            track.style.transform = `translateX(${normalizedOffset}px)`;
            // Force reflow
            void track.offsetWidth;
            // Calculate the animation progress as a percentage
            const progress = Math.abs(normalizedOffset) / halfWidth;
            const duration = 25; // matches CSS
            const remainingTime = duration * (1 - progress);
            track.style.animation = `payment-marquee ${duration}s linear infinite`;
            track.style.animationDelay = `-${duration * progress}s`;
        };

        wrapper.addEventListener('pointerup', finishDrag);
        wrapper.addEventListener('pointercancel', finishDrag);
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPaymentScroll);
} else {
    initPaymentScroll();
}

// === LIGHTBOX FOR IMAGES ===
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    if (lightbox.dataset.lbBound) return;
    lightbox.dataset.lbBound = 'true';

    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = lightbox.querySelector('.lightbox-close');

    // Select all images that should trigger the lightbox
    const triggerImages = document.querySelectorAll('.fee-image, .hb-account-image img');

    function openLightbox(imgEl) {
        if (!imgEl || !imgEl.complete) return;
        // Reuse already-loaded image data via canvas — no extra network request
        try {
            const c = document.createElement('canvas');
            c.width = imgEl.naturalWidth;
            c.height = imgEl.naturalHeight;
            c.getContext('2d').drawImage(imgEl, 0, 0);
            lightboxImg.src = c.toDataURL('image/jpeg', 0.92);
        } catch (_) {
            lightboxImg.src = imgEl.src; // fallback
        }
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        lightboxImg.src = ''; // free data URL memory
    }

    triggerImages.forEach(img => {
        img.style.cursor = 'pointer'; // Ensure it looks clickable
        img.addEventListener('click', () => openLightbox(img));
    });

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLightbox);
} else {
    initLightbox();
}

// === ADMIN CHAT WIDGET ===
function initAdminChatWidget() {
    const adminBtn = document.getElementById('floatingAdminBtn');
    const chatWidget = document.getElementById('adminChatWidget');
    const closeBtn = document.getElementById('adminChatClose');

    if (!adminBtn || !chatWidget) return;
    // Prevent double-binding (loadComponents may call this again)
    if (adminBtn.dataset.chatBound) return;
    adminBtn.dataset.chatBound = 'true';

    function toggleWidget(e) {
        if (e) e.stopPropagation();
        const isActive = chatWidget.classList.contains('active');
        if (isActive) {
            closeWidget();
        } else {
            openWidget();
        }
    }

    function openWidget() {
        chatWidget.classList.add('active');
        chatWidget.setAttribute('aria-hidden', 'false');
        adminBtn.classList.add('active');
    }

    function closeWidget() {
        chatWidget.classList.remove('active');
        chatWidget.setAttribute('aria-hidden', 'true');
        adminBtn.classList.remove('active');
    }

    adminBtn.addEventListener('click', toggleWidget);
    if (closeBtn) closeBtn.addEventListener('click', closeWidget);

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (chatWidget.classList.contains('active') &&
            !chatWidget.contains(e.target) &&
            !adminBtn.contains(e.target)) {
            closeWidget();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && chatWidget.classList.contains('active')) {
            closeWidget();
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdminChatWidget);
} else {
    initAdminChatWidget();
}

// === CARA KERJA ACCORDION ===
function toggleStep(header) {
    const card = header.closest('.step-card');
    if (!card) return;
    card.classList.toggle('is-open');
}

// === FAQ ACCORDION ===
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('is-open');

            // Close other items for a clean accordion behavior
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('is-open');
                    otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                    otherItem.querySelector('.faq-answer').setAttribute('aria-hidden', 'true');
                    otherItem.querySelector('.faq-answer').style.maxHeight = null;
                }
            });

            // Toggle current item
            item.classList.toggle('is-open', !isOpen);
            question.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
            answer.setAttribute('aria-hidden', !isOpen ? 'false' : 'true');

            if (!isOpen) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = null;
            }
        });
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFaqAccordion);
} else {
    initFaqAccordion();
}

// === LOAD SHARED COMPONENTS (header & footer) ===
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadComponents);
} else {
    loadComponents();
}

// === RUNTIME ADMIN STATUS UPDATE (FAIL-SAFE) ===
// Updates status at runtime if the element exists (e.g. from fallback HTML fetch)
function updateAdminStatusRuntime() {
    const statusEl = document.getElementById('adminStatusText');
    if (!statusEl) return;

    var now = new Date();
    var wib = new Date(now.getTime() + (7 * 3600 * 1000));
    var hours = wib.getUTCHours();
    var minutes = wib.getUTCMinutes();
    var curMin = hours * 60 + minutes;

    var startMin = 7 * 60 + 30; // 07:30
    var endMin = 0 * 60 + 30;   // 00:30

    var wibDay = wib.getUTCDay(); // 0 = Sun, 1 = Mon, ..., 5 = Fri, 6 = Sat
    var isOnline = false;
    var statusText = 'Offline — Buka Jam 07.30 WIB';
    var statusClass = 'is-offline';

    // Shift Yesterday (active if curMin < 01:30)
    if (curMin < endMin) {
        var yesterdayDay = (wibDay - 1 + 7) % 7;
        if (yesterdayDay === 5) {
            statusText = 'Libur — Buka Hari Ini Jam 07.30 WIB';
            statusClass = 'is-offline';
        } else {
            isOnline = true;
            statusText = 'Online';
            statusClass = '';
        }
    }
    // Shift Today (active if curMin >= 07:30)
    else if (curMin >= startMin) {
        if (wibDay === 5) {
            statusText = 'Libur — Buka Besok Jam 07.30 WIB';
            statusClass = 'is-offline';
        } else {
            isOnline = true;
            statusText = 'Online';
            statusClass = '';
        }
    }
    // Outside of shifts (01:30 to 07:30)
    else {
        if (wibDay === 5) {
            statusText = 'Libur — Buka Besok Jam 07.30 WIB';
            statusClass = 'is-offline';
        } else {
            statusText = 'Offline — Buka Jam 07.30 WIB';
            statusClass = 'is-offline';
        }
    }

    statusEl.textContent = statusText;
    if (statusClass === 'is-offline') {
        statusEl.classList.add('is-offline');
    } else {
        statusEl.classList.remove('is-offline');
    }
}

// Run immediately & set interval to keep it accurate if user leaves tab open
setTimeout(() => {
    updateAdminStatusRuntime();
    setInterval(updateAdminStatusRuntime, 60000);
}, 600);
