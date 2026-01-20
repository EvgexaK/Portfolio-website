window.addEventListener('load', () => {
    let isIntroComplete = false;
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // --- Dynamic Title Sizing ---
    function resizeTitle() {
        const container = document.querySelector('.large-title-container');
        const titles = document.querySelectorAll('.large-title');
        if (!container || titles.length === 0) return;

        const isMobileView = window.innerWidth <= 768;
        const padding = isMobileView ? 48 : 96; // 1.5rem or 3rem in pixels
        const availableWidth = window.innerWidth - padding;

        // Use first title to measure
        const mainTitle = titles[0];

        // Use a larger base font for better accuracy on high-res displays
        let baseFontSize = Math.max(300, availableWidth * 0.15);
        mainTitle.style.fontSize = baseFontSize + 'px';

        // Get the actual text width at base size
        let textWidth = mainTitle.scrollWidth;

        // Calculate the ratio and adjust to fill available width
        const ratio = availableWidth / textWidth;
        let fontSize = Math.floor(baseFontSize * ratio);

        // Apply to all title layers
        titles.forEach(title => {
            title.style.fontSize = fontSize + 'px';
        });
    }

    // Initial sizing (before animation reveals title)
    resizeTitle();
    window.addEventListener('resize', resizeTitle);

    // Intro Animation
    // Mobile Check for Footer Position
    const isMobile = window.innerWidth <= 768;
    const footerTop = isMobile ? "60vh" : "65vh";
    const footerHeight = isMobile ? "40vh" : "35vh";

    tl.to(".curtain", {
        height: footerHeight,
        top: footerTop,
        duration: 1.6,
        ease: "power4.inOut",
        delay: 0.2
    })
        .to(".flower-center-target", {
            scale: 0.8,
            opacity: 0.8,
            duration: 1.6
        }, "<")

        .to(".project-card", { y: 0, opacity: 1, duration: 1, stagger: 0.15 }, "-=0.8")
        // Reveal ALL title layers together (opacity handled by slice logic later)
        .to([".main-title-layer", ".title-slice"], { y: 0, opacity: 1, duration: 1.2, stagger: 0 }, "-=0.8")
        // But hide slices again immediately after intro, ready for interaction
        .set(".title-slice", { opacity: 0 })
        .to(".nav-menu a", { x: 0, opacity: 1, stagger: 0.1, duration: 0.8 }, "-=1.0")
        .to(".lang-switch-container", { opacity: 1, duration: 0.6, ease: "power2.out" }, "-=0.3")
        .call(() => { isIntroComplete = true; });


    // --- 1. FOOTER LOGO INTERACTION ---
    const footer = document.querySelector('.curtain');
    const logoWrapper = document.querySelector('.flower-wrapper');
    const layerRed = document.querySelector('.layer-red');
    const layerGreen = document.querySelector('.layer-green');
    const layerBlue = document.querySelector('.layer-blue');
    let logoTimer;

    footer.addEventListener('mousemove', (e) => {
        if (!isIntroComplete) return;
        clearTimeout(logoTimer);
        logoWrapper.classList.add('is-glitching-logo');

        const rect = logoWrapper.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const shiftX = ((e.clientX - centerX) / window.innerWidth) * 30;
        const shiftY = ((e.clientY - centerY) / window.innerHeight) * 30;

        gsap.to(layerRed, { x: -shiftX, y: -shiftY, opacity: 1, duration: 0.1, overwrite: 'auto' });
        gsap.to(layerBlue, { x: shiftX, y: shiftY, opacity: 1, duration: 0.1, overwrite: 'auto' });
        gsap.to(layerGreen, { x: shiftX * 0.4, y: shiftY * 0.4, opacity: 1, duration: 0.1, overwrite: 'auto' });

        logoTimer = setTimeout(() => {
            logoWrapper.classList.remove('is-glitching-logo');
            gsap.to([layerRed, layerBlue, layerGreen], { x: 0, y: 0, opacity: 0, duration: 0.4 });
        }, 150);
    });


    // --- 2. MAIN TITLE GLITCH & 3D INTERACTION ---
    const titleContainer = document.getElementById('titleContainer'); // The interactive area
    const titleWrapper = document.getElementById('titleWrapper'); // The 3D Object
    const slice1 = document.querySelector('.slice-1');
    const slice2 = document.querySelector('.slice-2');
    const slice3 = document.querySelector('.slice-3');
    let titleTimer;

    // Use the whole hero section or just the bottom half for title interaction
    // Let's use window to ensure "longer distance" feel, or just the container + buffer
    // Use the wrapper (text only) for interaction
    titleWrapper.addEventListener('mousemove', (e) => {
        clearTimeout(titleTimer);
        titleWrapper.classList.add('is-glitching');

        // Calculate Center of Title
        const rect = titleWrapper.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Distance from center
        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;

        // 1. 3D Tilt (Perspective)
        // Max tilt roughly 15 degrees
        const tiltY = (dx / window.innerWidth) * 20;
        const tiltX = -(dy / window.innerHeight) * 20;

        gsap.to(titleWrapper, {
            rotateY: tiltY,
            rotateX: tiltX,
            duration: 0.2,
            overwrite: 'auto'
        });

        // 2. Glitch Slices (Slit-Scan)
        const shiftFactor = 25; // Pixels max shift

        gsap.to(slice1, { x: -dx * 0.02, opacity: 1, duration: 0.1, overwrite: 'auto' });
        gsap.to(slice2, { x: dx * 0.015, opacity: 1, duration: 0.1, overwrite: 'auto' });
        gsap.to(slice3, { x: -dx * 0.03, opacity: 1, duration: 0.1, overwrite: 'auto' });

        // Stop Logic (still needed for pause within box)
        titleTimer = setTimeout(() => {
            titleWrapper.classList.remove('is-glitching');
            gsap.to(titleWrapper, { rotateY: 0, rotateX: 0, duration: 0.5, ease: "power2.out" });
            gsap.to([slice1, slice2, slice3], { x: 0, opacity: 0, duration: 0.5, ease: "power2.out" });
        }, 100);
    });

    // Force reset on leave
    titleWrapper.addEventListener('mouseleave', () => {
        clearTimeout(titleTimer);
        titleWrapper.classList.remove('is-glitching');
        gsap.to(titleWrapper, { rotateY: 0, rotateX: 0, duration: 0.5, ease: "power2.out" });
        gsap.to([slice1, slice2, slice3], { x: 0, opacity: 0, duration: 0.5, ease: "power2.out" });
    });
});

/* --- Language Support with Cube Flip Animation --- */
document.addEventListener('DOMContentLoaded', () => {
    const translations = {
        en: {
            'page-title': 'Zhdanov Portfolio',
            'role-title': 'Designer, 3D Generalist<br>& Developer',
            'nav-work': 'Work',
            'nav-about': 'About',
            'nav-contact': 'Contact',
            'card-design': 'Design',
            'card-3d': '3D',
            'card-tech': 'Tech',
            'main-title': 'EVGENII ZHDANOV'
        },
        ru: {
            'page-title': 'Портфолио Жданова',
            'role-title': 'Дизайнер, 3D Дженералист<br>и Разработчик',
            'nav-work': 'Работы',
            'nav-about': 'Обо мне',
            'nav-contact': 'Контакты',
            'card-design': 'Design',
            'card-3d': '3D',
            'card-tech': 'Tech',
            'main-title': 'ЕВГЕНИЙ ЖДАНОВ'
        }
    };

    const langBtns = document.querySelectorAll('.lang-btn');
    const translatableElements = document.querySelectorAll('[data-i18n]');
    const pageWrapper = document.querySelector('.page-wrapper');
    let isAnimating = false;
    let currentLang = 'en';

    function getPreferredLanguage() {
        const savedLang = localStorage.getItem('portfolio-lang');
        if (savedLang) return savedLang;

        const systemLang = navigator.language || navigator.userLanguage;
        if (systemLang.toLowerCase().startsWith('ru')) {
            return 'ru';
        }
        return 'en';
    }

    function applyLanguage(lang) {
        const langData = translations[lang];
        translatableElements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (langData[key]) {
                if (langData[key].includes('<')) {
                    el.innerHTML = langData[key];
                } else {
                    el.textContent = langData[key];
                }
            }
        });

        langBtns.forEach(btn => {
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        localStorage.setItem('portfolio-lang', lang);
        document.documentElement.lang = lang;
        currentLang = lang;

        // Trigger title resize for new text
        setTimeout(() => window.dispatchEvent(new Event('resize')), 50);
    }

    function resetToInitialState() {
        const isMobile = window.innerWidth <= 768;

        // Reset curtain to full screen
        gsap.set(".curtain", { height: "100%", top: "0" });
        gsap.set(".flower-center-target", { scale: 1, opacity: 1 });

        // Hide all animated elements
        gsap.set(".project-card", { y: 50, opacity: 0 });
        gsap.set([".main-title-layer", ".title-slice"], { y: 60, opacity: 0 });
        gsap.set(".nav-menu a", { x: 20, opacity: 0 });
        gsap.set(".lang-switch-container", { opacity: 0 });
    }

    function playIntroAnimation() {
        const isMobile = window.innerWidth <= 768;
        const footerTop = isMobile ? "60vh" : "65vh";
        const footerHeight = isMobile ? "40vh" : "35vh";

        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.to(".curtain", {
            height: footerHeight,
            top: footerTop,
            duration: 1.6,
            ease: "power4.inOut",
            delay: 0.2
        })
            .to(".flower-center-target", {
                scale: 0.8,
                opacity: 0.8,
                duration: 1.6
            }, "<")
            .to(".project-card", { y: 0, opacity: 1, duration: 1, stagger: 0.15 }, "-=0.8")
            .to([".main-title-layer", ".title-slice"], { y: 0, opacity: 1, duration: 1.2, stagger: 0 }, "-=0.8")
            .set(".title-slice", { opacity: 0 })
            .to(".nav-menu a", { x: 0, opacity: 1, stagger: 0.1, duration: 0.8 }, "-=1.0")
            .to(".lang-switch-container", { opacity: 1, duration: 0.6, ease: "power2.out" }, "-=0.3")
            .call(() => { isAnimating = false; });
    }

    function switchLanguageWithAnimation(newLang) {
        if (isAnimating || newLang === currentLang) return;
        isAnimating = true;

        // Step 1: Flip out (rotate page down)
        pageWrapper.classList.add('cube-flip-out');

        // Step 2: After flip completes, reset and change language
        setTimeout(() => {
            resetToInitialState();
            applyLanguage(newLang);

            // Step 3: Remove flip class and play intro
            pageWrapper.classList.remove('cube-flip-out');

            // Small delay before playing intro animation
            setTimeout(() => {
                playIntroAnimation();
            }, 100);
        }, 600); // Match CSS transition duration
    }

    // Initial setup (no animation on first load - handled by main load event)
    const initialLang = getPreferredLanguage();
    applyLanguage(initialLang);

    // Event Listeners for language buttons
    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            switchLanguageWithAnimation(lang);
        });
    });
});
