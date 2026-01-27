/* =========================================
   GLOBAL JAVASCRIPT
   Shared logic for all pages
   ========================================= */

// --- 1. IMMEDIATE INITIALIZATION (Start core systems) ---
// Do not wait for window.load for these, so they are ready for page-specific scripts.
(function initCore() {
    if (typeof gsap === 'undefined' || typeof Lenis === 'undefined') {
        console.error("GSAP or Lenis not loaded.");
        return;
    }

    if (window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
    }

    // Init Lenis
    window.lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2
    });

    window.lenis.on('scroll', (e) => {
        if (window.ScrollTrigger) ScrollTrigger.update();
    });

    gsap.ticker.add((time) => {
        window.lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Init Particle Background
    if (typeof ParticleBackground !== 'undefined') {
        window.particleBgInstance = new ParticleBackground();
    }

    // Init Menu Logic (Can be init early)
    initMenu();

    // Init Cursor Logic
    initCursor();

    // Init Scroll Top
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            if (window.lenis) window.lenis.scrollTo(0);
        });
    }
})();

// --- 2. LOAD COMPLETE LOGIC (Reveal & Heavy Assets) ---
window.addEventListener('load', function () {
    const loaderCounter = document.querySelector(".loader-counter");
    const loaderBar = document.querySelector(".loader-progress-bar");
    const loaderScreen = document.querySelector(".loader-screen");

    // Only run if loader exists
    if (loaderCounter && loaderBar && loaderScreen) {
        let progressObj = { val: 0 };
        let splineLoaded = false;

        // Listen for Spline Load
        const splineViewers = document.querySelectorAll('spline-viewer');
        let loadedCount = 0;

        function onSplineLoad() {
            loadedCount++;
            if (!splineLoaded && loadedCount >= 1) {
                splineLoaded = true;
                if (typeof window.finishLoader === 'function') {
                    window.finishLoader();
                }
            }
        }

        splineViewers.forEach(viewer => {
            viewer.addEventListener('load', onSplineLoad);
            // Check if already loaded (shadowRoot present usually implies loaded or hydrating)
            if (viewer.shadowRoot) {
                // Short delay to ensure it's actually ready visually
                setTimeout(onSplineLoad, 100);
            }
        });

        // Timeout Fallback (2.0s - reduced from 2.5s)
        setTimeout(() => {
            if (!splineLoaded) {
                console.log('Spline load timeout - forcing entry');
                splineLoaded = true;
                if (typeof window.finishLoader === 'function') window.finishLoader();
            }
        }, 2000);

        // Completion Logic
        function completeLoading() {
            // Init Page Transition Manager
            if (typeof PageTransitionManager !== 'undefined') {
                const transitionManager = new PageTransitionManager();
                const overlay = document.querySelector('.page-transition-overlay');

                // Fast forward progress UI to 100
                gsap.to(progressObj, {
                    val: 100,
                    duration: 0.4,
                    ease: "power2.out",
                    onUpdate: () => {
                        loaderCounter.innerText = Math.floor(progressObj.val).toString().padStart(3, '0');
                        loaderBar.style.width = `${progressObj.val}%`;
                    },
                    onComplete: () => {
                        // Hide Loader
                        loaderScreen.style.display = 'none';
                        // Reveal Page
                        gsap.set(overlay, { clipPath: 'inset(0 0 0 0)' });
                        gsap.set('.transition-logo', { opacity: 1 });
                        transitionManager.entryAnimation();
                        transitionManager.interceptLinks();
                        // Dispatch event to tell other scripts (home.js) that layout is final/visible
                        window.dispatchEvent(new CustomEvent('nuclear-loaded'));
                    }
                });
            } else {
                console.warn('PageTransitionManager class not found.');
                loaderScreen.style.display = 'none';
            }
        }

        // Start Loading Sequence
        const masterTl = gsap.timeline({ onComplete: completeLoading });
        masterTl.to(progressObj, { val: 40, duration: 0.8, ease: "power2.out", onUpdate: updateLoaderUI })
            .to(progressObj, { val: 80, duration: 1.0, ease: "power1.inOut", onUpdate: updateLoaderUI })
            .to(progressObj, { val: 100, duration: 0.8, ease: "power2.inOut", onUpdate: updateLoaderUI });

        window.finishLoader = function () {
            if (masterTl.isActive()) {
                masterTl.timeScale(1.5); // Acelerate if early
            }
        };

        function updateLoaderUI() {
            loaderCounter.innerText = Math.floor(progressObj.val).toString().padStart(3, '0');
            loaderBar.style.width = `${progressObj.val}%`;
        }
    } else {
        // No loader (e.g. Work page), just init transition immediately
        if (typeof PageTransitionManager !== 'undefined') {
            const tm = new PageTransitionManager();
            tm.entryAnimation();
            tm.interceptLinks();
        }
    }
});

// --- Helper Functions (Moved out to be called immediately) ---

function initCursor() {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorFollower = document.querySelector('.cursor-follower');
    const cursorText = document.querySelector('.cursor-text');
    const cursorWrapper = document.querySelector('.cursor-wrapper');

    if (cursorDot && cursorFollower && cursorWrapper) {
        const xTo = gsap.quickSetter(cursorDot, "x", "px"), yTo = gsap.quickSetter(cursorDot, "y", "px");
        const xToFollower = gsap.quickSetter(cursorFollower, "x", "px"), yToFollower = gsap.quickSetter(cursorFollower, "y", "px");
        let mouseX = 0, mouseY = 0, followerPos = { x: 0, y: 0 };
        let isCursorVisible = false;

        gsap.set(cursorDot, { xPercent: -50, yPercent: -50 });
        gsap.set(cursorFollower, { xPercent: -50, yPercent: -50 });

        document.addEventListener('mousemove', e => {
            mouseX = e.clientX; mouseY = e.clientY;
            xTo(mouseX); yTo(mouseY);
            if (!isCursorVisible) {
                isCursorVisible = true;
                gsap.to(cursorWrapper, { opacity: 1, duration: 0.5 });
            }
        });

        gsap.ticker.add(() => {
            if (isCursorVisible) {
                followerPos.x += (mouseX - followerPos.x) * 0.12;
                followerPos.y += (mouseY - followerPos.y) * 0.12;
                xToFollower(followerPos.x); yToFollower(followerPos.y);
            }
        });

        document.querySelectorAll('[data-cursor]').forEach(el => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('hovered');
                if (el.dataset.cursor === 'view') cursorText.innerText = "VIEW"; else cursorText.innerText = "";
            });
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('hovered');
                cursorText.innerText = "";
            });
        });
    }
}

function initMenu() {
    const menuOverlay = document.getElementById('menuOverlay');
    const openMenuBtn = document.getElementById('openMenu');
    const closeMenuBtn = document.getElementById('closeMenu');

    if (menuOverlay && openMenuBtn) {
        window.menuTl = gsap.timeline({ paused: true });
        gsap.set(".nav-link", { y: "110%", skewY: 10 });
        gsap.set(".nav-item", { borderBottomColor: "rgba(0,0,0,0)" });
        gsap.set(".menu-footer-info", { opacity: 0, y: 20 });
        gsap.set("#menuOverlay", { autoAlpha: 0, clipPath: 'inset(0 0 100% 0)' });

        window.menuTl.to("#menuOverlay", { autoAlpha: 1, clipPath: 'inset(0 0 0% 0)', duration: 0.8, ease: "power4.inOut" })
            .to(".nav-link", { y: "0%", skewY: 0, duration: 0.8, stagger: 0.05, ease: "power4.out" }, "-=0.6")
            .to(".menu-footer-info", { opacity: 1, y: 0, duration: 0.5 }, "-=0.4");

        openMenuBtn.addEventListener('click', () => {
            if (window.lenis) window.lenis.stop();
            window.menuTl.restart();
        });

        if (closeMenuBtn) {
            closeMenuBtn.addEventListener('click', () => {
                window.menuTl.reverse();
                setTimeout(() => { if (window.lenis) window.lenis.start(); }, 1000);
            });
        }
    }
}
