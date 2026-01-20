window.addEventListener('load', () => {
    let isIntroComplete = false;
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Intro Animation
    // Mobile Check for Footer Position
    const isMobile = window.innerWidth <= 768;
    const footerTop = isMobile ? "85vh" : "65vh"; // Desktop restored to 65vh
    const footerHeight = isMobile ? "15vh" : "35vh"; // Desktop restored to 35vh

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

/* --- Language Support --- */
document.addEventListener('DOMContentLoaded', () => {
    const translations = {
        en: {
            'page-title': 'Zhdanov Portfolio',
            'role-title': 'Designer, 3D Generalist<br>& Developer',
            'nav-work': 'Work',
            'nav-about': 'About',
            'nav-contact': 'Contact',
            'card-design': 'Design',
            'card-3d': '3D', // or '3D Art'
            'card-tech': 'Tech',
            'main-title': 'EVGENII ZHDANOV'
        },
        ru: {
            'page-title': 'Портфолио Жданова',
            'role-title': 'Дизайнер, 3D Дженералист<br>и Разработчик',
            'nav-work': 'Работы',
            'nav-about': 'Обо мне',
            'nav-contact': 'Контакты',
            'card-design': 'Design', // Kept in English
            'card-3d': '3D',
            'card-tech': 'Tech', // Kept in English
            'main-title': 'ЕВГЕНИЙ ЖДАНОВ'
        }
    };

    const langBtns = document.querySelectorAll('.lang-btn');
    const translatableElements = document.querySelectorAll('[data-i18n]');

    // Detection Logic
    function getPreferredLanguage() {
        const savedLang = localStorage.getItem('portfolio-lang');
        if (savedLang) return savedLang;

        const systemLang = navigator.language || navigator.userLanguage;
        if (systemLang.toLowerCase().startsWith('ru')) {
            return 'ru';
        }
        return 'en';
    }

    function setLanguage(lang) {
        // Update variables
        const currentLang = translations[lang];

        // Update DOM text
        translatableElements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (currentLang[key]) {
                // If it contains HTML (like <br>), use innerHTML, else textContent
                if (currentLang[key].includes('<')) {
                    el.innerHTML = currentLang[key];
                } else {
                    el.textContent = currentLang[key];
                }
            }
        });

        // Update Buttons
        langBtns.forEach(btn => {
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Save preference
        localStorage.setItem('portfolio-lang', lang);

        // Update html lang attribute for accessibility
        document.documentElement.lang = lang;
    }

    // Init
    const initialLang = getPreferredLanguage();
    setLanguage(initialLang);

    // Event Listeners
    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            setLanguage(lang);
        });
    });
});
