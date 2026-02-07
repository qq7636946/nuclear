/* ========================================
   PAGE TRANSITION - Uses unified system from page-transitions.js
   ======================================== */
// PageTransitionManager is now loaded from page-transitions.js
/* ========================================
   MAIN INITIALIZATION
   ======================================== */
window.addEventListener('load', function () {

    if (typeof gsap === 'undefined' || typeof Lenis === 'undefined') return;

    if (window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
    }

    // 1. Lenis Smooth Scroll (CRITICAL: 使用 window.lenis 使其全局可訪問)
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

    // Check for back/forward navigation
    const isBackForwardNav = window.PageTransitions && window.PageTransitions.isBackForward();

    // Tech Dashboard & Header Logic
    const techIndicator = document.getElementById('techIndicator');
    const hudScrollVal = document.getElementById('hudScrollVal');
    const glassNav = document.querySelector('.glass-nav');
    const pillHeader = document.querySelector('.header-container');
    const scrollThreshold = 300;

    // 動態計算並更新錨點位置
    function updateAnchorPositions() {
        const anchors = document.querySelectorAll('.tech-anchor-item');
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

        anchors.forEach(anchor => {
            const targetId = anchor.getAttribute('data-target');
            const targetEl = document.querySelector(targetId);

            if (targetEl && scrollHeight > 0) {
                // 計算目標元素在頁面中的實際位置百分比
                const elementTop = targetEl.offsetTop;
                const percent = (elementTop / scrollHeight) * 100;
                anchor.style.top = `${Math.min(Math.max(percent, 0), 100)}%`;
            }
        });
    }

    if (window.ScrollTrigger) {
        window.lenis.on('scroll', (e) => {
            ScrollTrigger.update();
            // Pill Header Visibility (Always Visible - Auto-hide disabled)
        });

        gsap.ticker.add((time) => {
            window.lenis.raf(time * 1000);

            // Update Dashboard Indicator based on scroll progress
            const scrollProgress = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
            const percent = Math.min(Math.max(scrollProgress * 100, 0), 100);

            if (techIndicator) {
                techIndicator.style.top = `${percent}%`;
            }

            // Update HUD
            if (hudScrollVal) {
                hudScrollVal.innerText = Math.floor(window.scrollY).toString().padStart(4, '0');
            }
        });
        gsap.ticker.lagSmoothing(0);
    }

    // 初始化錨點位置
    updateAnchorPositions();

    // 當窗口大小改變時重新計算
    window.addEventListener('resize', () => {
        setTimeout(updateAnchorPositions, 100);
    });

    // Tech Anchors Click Event
    document.querySelectorAll('.tech-anchor-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const targetId = item.getAttribute('data-target');
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                window.lenis.scrollTo(targetEl);
            }
        });
    });

    // 2. Loading Animation (Wait for ALL Spline instances)
    const loaderScreen = document.getElementById("nuLoader");
    const loaderBar = document.querySelector(".loader-progress-bar");
    // Counter removed in HTML, so no JS ref needed or use null check if keeping logic
    const loaderCounter = null;

    let progressObj = { val: 0 };
    let splineLoaded = false;
    let breatheAnimation = null;

    // 監聽所有 spline-viewer 的 load 事件
    const allSplineViewers = document.querySelectorAll('spline-viewer');
    const mobileVideo = document.querySelector('.mobile-banner-video');

    // Determine if we are waiting for Spline (Desktop) or Video (Mobile)
    // Using offsetParent check is a reliable way to detect if an element or its ancestor is display: none
    const visibleSplineViewers = Array.from(allSplineViewers).filter(el => el.offsetParent !== null);
    const isMobileVideoVisible = mobileVideo && mobileVideo.offsetParent !== null;

    let loadedCount = 0;
    // Calculate total items to wait for
    let totalItemsToWait = visibleSplineViewers.length + (isMobileVideoVisible ? 1 : 0);

    console.log(`Items to wait for: ${totalItemsToWait} (Spline: ${visibleSplineViewers.length}, Video: ${isMobileVideoVisible ? 1 : 0})`);

    function checkAllLoaded() {
        loadedCount++;
        console.log(`Asset loaded: ${loadedCount}/${totalItemsToWait}`);

        if (!splineLoaded && (totalItemsToWait === 0 || loadedCount >= totalItemsToWait)) {
            splineLoaded = true;
            // Trigger finish
            if (typeof window.triggerLoadFinish === 'function') {
                window.triggerLoadFinish();
            }
        }
    }

    // A. Handle Spline Viewers
    visibleSplineViewers.forEach((viewer) => {
        viewer.addEventListener('load', () => {
            checkAllLoaded();
        });
        // 有時候 load 不觸發，用 web components 屬性檢查
        if (viewer.shadowRoot) {
            // If already loaded, manually trigger? 
            // Better to rely on the event or check if we missed it. 
            // For now, let's assume the event triggers or the timeout handles it.
            // Actually, if shadowRoot exists, it might be effectively 'loaded' enough for us
            // But 'load' event is safer for content. 
        }
    });

    // B. Handle Mobile Video
    if (isMobileVideoVisible) {
        // If video is already ready (cached)
        if (mobileVideo.readyState >= 3) { // HAVE_FUTURE_DATA or higher
            checkAllLoaded();
            mobileVideo.style.opacity = 1;
            const wrapper = mobileVideo.closest('.spline-wrapper');
            if (wrapper) wrapper.classList.add('loaded'); // Hide spinner
        } else {
            mobileVideo.addEventListener('loadeddata', () => {
                checkAllLoaded();
                mobileVideo.style.opacity = 1;
                const wrapper = mobileVideo.closest('.spline-wrapper');
                if (wrapper) wrapper.classList.add('loaded'); // Hide spinner
            });
            mobileVideo.addEventListener('error', () => {
                console.warn("Video load error");
                checkAllLoaded(); // Count it anyway to avoid blocking
            });
        }
    }

    // If nothing to wait for (e.g. strict text mode or error), treat as loaded
    if (totalItemsToWait === 0) {
        console.log("No visible assets to wait for. Skipping wait.");
        setTimeout(() => {
            splineLoaded = true;
            if (typeof window.triggerLoadFinish === 'function') {
                window.triggerLoadFinish();
            }
        }, 100);
    }

    // Fallback Timeout (4s max wait)
    setTimeout(() => {
        if (!splineLoaded) {
            console.warn('Asset load timeout (4s) - forcing entry.');
            splineLoaded = true;
            if (typeof window.triggerLoadFinish === 'function') {
                window.triggerLoadFinish();
            }
        }
    }, 6000); // Increased to 6s for video buffer potentially

    // 完成載入並進場
    function enterSite() {
        if (breatheAnimation) {
            breatheAnimation.kill();
        }

        const overlay = document.querySelector('.page-transition-overlay');

        // Finish Progress Bar
        gsap.to(progressObj, {
            val: 100,
            duration: 0.5,
            ease: "power2.out",
            onUpdate: updateLoaderUI,
            onComplete: () => {
                sessionStorage.setItem('visited', 'true');

                const tl = gsap.timeline();

                // Overlay clip wipe (if present)
                if (overlay) {
                    gsap.set(overlay, { clipPath: 'inset(0 0 0 0)' });
                    tl.to(overlay, { clipPath: 'inset(0 0 100% 0)', duration: 0.8, ease: "power4.inOut" });
                }

                // Loader fade out
                tl.to(loaderScreen, { opacity: 0, duration: 0.5 }, "-=0.5")
                    .call(() => {
                        if (loaderScreen) loaderScreen.style.display = 'none';
                        // Use unified transition system
                        window.PageTransitions.initQuick({
                            onEntryComplete: function () {
                                setTimeout(updateAnchorPositions, 200);
                            }
                        });
                    });
            }
        });
    }

    // Start Loading Sequence
    function startLoadingSequence() {
        // Animate to 90% then WAIT
        const tl = gsap.timeline();

        tl.to(progressObj, {
            val: 40,
            duration: 1,
            ease: "power2.out",
            onUpdate: updateLoaderUI
        })
            .to(progressObj, {
                val: 90,
                duration: 2, // Slow down as we approach the "wait" zone
                ease: "power1.inOut",
                onUpdate: updateLoaderUI
            });

        // Define the trigger function exposed to global scope
        window.triggerLoadFinish = function () {
            console.log("Assets loaded. Finishing sequence.");
            // Kill the fake progress timeline
            tl.kill();
            // Execute entry
            enterSite();
        };

        // If already loaded by the time we invoke this (rare but possible with cache)
        if (splineLoaded) {
            window.triggerLoadFinish();
        }
    }

    // Check if back/forward navigation - skip loader
    if (isBackForwardNav) {
        console.log('[Home] Back/forward navigation detected - skipping loader');
        loaderScreen.style.display = 'none';

        // Use unified transition system directly
        window.PageTransitions.initQuick({
            onEntryComplete: function () {
                setTimeout(updateAnchorPositions, 200);
            }
        });
    } else {
        // Normal page load - run loader sequence
        startLoadingSequence();
    }

    // 更新 UI 的輔助函數
    function updateLoaderUI() {
        // Re-grab elements here just in case, or assume valid global scope if defined
        const counter = document.getElementById("loaderPercentage");
        const bar = document.getElementById("loaderBar");

        if (counter) counter.innerText = Math.floor(progressObj.val).toString().padStart(3, '0') + "%";
        if (bar) bar.style.width = `${progressObj.val}%`;
    }






    // --- Cursor Logic ---
    const cursorDot = document.querySelector('#nu-wrapper .cursor-dot');
    const cursorFollower = document.querySelector('#nu-wrapper .cursor-follower');
    const cursorText = document.querySelector('#nu-wrapper .cursor-text');
    const xTo = gsap.quickSetter(cursorDot, "x", "px"), yTo = gsap.quickSetter(cursorDot, "y", "px");
    const xToFollower = gsap.quickSetter(cursorFollower, "x", "px"), yToFollower = gsap.quickSetter(cursorFollower, "y", "px");
    let mouseX = 0, mouseY = 0, followerPos = { x: 0, y: 0 };

    gsap.set(cursorDot, { xPercent: -50, yPercent: -50 });
    gsap.set(cursorFollower, { xPercent: -50, yPercent: -50 });

    document.getElementById('nu-wrapper').addEventListener('mousemove', e => {
        mouseX = e.clientX; mouseY = e.clientY; xTo(mouseX); yTo(mouseY);
    });

    gsap.ticker.add(() => {
        const dt = 1.0 - Math.pow(1.0 - 0.1, gsap.ticker.deltaRatio());
        followerPos.x += (mouseX - followerPos.x) * dt; followerPos.y += (mouseY - followerPos.y) * dt;
        xToFollower(followerPos.x); yToFollower(followerPos.y);
    });
    document.querySelectorAll('[data-cursor]').forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('hovered');
            if (el.dataset.cursor === 'view') cursorText.innerText = "VIEW"; else cursorText.innerText = "";
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('hovered'); cursorText.innerText = "";
        });
    });

    // --- Text Reveal Logic ---
    const splitText = (element) => {
        const text = element.innerText;
        element.innerHTML = text.split("").map(char => `<span class="char">${char === ' ' ? '&nbsp;' : char}</span>`).join("");
    };
    document.querySelectorAll('[data-effect="text-reveal"]').forEach(el => {
        splitText(el);
        const chars = el.querySelectorAll('.char');
        if (window.ScrollTrigger) {
            gsap.fromTo(chars,
                { opacity: 0, y: 50, filter: "blur(10px)", fontWeight: 100 },
                {
                    opacity: 1, y: 0, filter: "blur(0px)", fontWeight: 800,
                    duration: 1, stagger: 0.05, ease: "power4.out",
                    scrollTrigger: { trigger: el, start: "top 80%" }
                }
            );
        }
    });

    // --- Horizontal Staggered Scroll Animation ---
    if (window.ScrollTrigger) {
        const hSectionStaggered = document.querySelector('.section-horizontal-staggered');
        const isMobile = window.innerWidth <= 768;

        if (hSectionStaggered && !isMobile) {
            const wrapper = document.querySelector('.horizontal-staggered-wrapper');
            const getScrollAmount = () => -(wrapper.scrollWidth - window.innerWidth);

            gsap.to(wrapper, {
                x: getScrollAmount,
                ease: "none",
                scrollTrigger: {
                    trigger: hSectionStaggered,
                    pin: true,
                    scrub: 1,
                    invalidateOnRefresh: true,
                    end: () => "+=" + wrapper.scrollWidth
                }
            });
        }
    }

    // --- Explosive Zoom Section ---
    if (window.ScrollTrigger) {
        const exploSection = document.querySelector(".section-explosive-zoom");
        const isMobile = window.innerWidth <= 768;

        if (exploSection && !isMobile) {
            const exploTl = gsap.timeline({
                scrollTrigger: {
                    trigger: ".section-explosive-zoom",
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 1,
                    pin: ".explosive-wrapper"
                }
            });
            exploTl.fromTo(".center-stage", { scale: 0.8, borderRadius: "20px" }, { scale: 2.5, borderRadius: "0px", duration: 1, ease: "power2.inOut" }, 0);
            exploTl.to(".pos-1", { x: -300, y: -300, opacity: 0, scale: 1.5, duration: 0.8 }, 0);
            exploTl.to(".pos-2", { x: -400, y: 200, opacity: 0, scale: 1.2, duration: 0.9 }, 0);
            exploTl.to(".pos-3", { x: 400, y: -100, opacity: 0, scale: 1.5, duration: 0.7 }, 0);
            exploTl.to(".pos-4", { x: 300, y: 300, opacity: 0, scale: 1.2, duration: 0.8 }, 0);
            exploTl.to(".pos-5", { y: 200, opacity: 0, scale: 2, duration: 0.5 }, 0);
        }
    }

    // --- Video Scaling Animation (New) ---
    // Using vanilla JS requestAnimationFrame for the specific scaling effect logic requested
    (function initVideoScaling() {
        const videoWrapper = document.getElementById('videoWrapper');
        const videoBox = document.getElementById('videoBox');
        const videoText = document.getElementById('videoText');
        const videoElement = document.getElementById('mainVideo');

        if (!videoWrapper || !videoBox || !videoText || !videoElement) return;

        let currentProgress = 0;
        let targetProgress = 0;
        const lerpFactor = 0.08;

        function animate() {
            const wrapperRect = videoWrapper.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const windowWidth = window.innerWidth;
            const isMobile = windowWidth <= 768;

            const scrollRange = videoWrapper.offsetHeight - windowHeight;
            let progress = -wrapperRect.top / scrollRange;
            targetProgress = Math.max(0, Math.min(1, progress));

            // Lerp
            currentProgress += (targetProgress - currentProgress) * lerpFactor;

            // Only run heavy updates if visible or moving (optimization)
            if ((wrapperRect.top <= windowHeight && wrapperRect.bottom >= 0) || Math.abs(targetProgress - currentProgress) > 0.001) {

                if (wrapperRect.top <= 0) {
                    if (isMobile) {
                        // Mobile: Scale up and move up
                        const w = 100 - (15 * currentProgress);
                        const h = 100 - (60 * currentProgress);
                        const y = -20 * currentProgress;
                        videoBox.style.width = `${w}%`;
                        videoBox.style.height = `${h}%`;
                        videoBox.style.transform = `translateY(${y}%)`;
                    } else {
                        // Desktop: Offset right and scale
                        const w = 100 - (55 * currentProgress);
                        const h = 100 - (35 * currentProgress);
                        const x = 25 * currentProgress;
                        videoBox.style.width = `${w}%`;
                        videoBox.style.height = `${h}%`;
                        videoBox.style.transform = `translateX(${x}%)`;
                    }

                    // Radius
                    videoElement.style.borderRadius = `${24 * currentProgress}px`;

                    // Text Reveal
                    if (currentProgress > 0.4) {
                        videoText.classList.add('active');
                    } else {
                        videoText.classList.remove('active');
                    }
                } else {
                    // Reset state when above viewport
                    if (currentProgress < 0.01) {
                        videoBox.style.width = '100%';
                        videoBox.style.height = '100%';
                        videoBox.style.transform = 'translate(0,0)';
                        videoElement.style.borderRadius = '0';
                        videoText.classList.remove('active');
                    }
                }
            }
            requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);
    })();



    // --- Card Stack Pinning with Shrinking Effect ---
    if (window.ScrollTrigger) {
        const cards = gsap.utils.toArray(".project-card");
        const isMobile = window.innerWidth <= 768;

        cards.forEach((card, i) => {
            if (!isMobile) {
                // Desktop: Pinning stack effect
                const shouldPin = i < cards.length - 1;
                if (shouldPin) {
                    ScrollTrigger.create({
                        trigger: card,
                        start: "top top",
                        pin: true,
                        pinSpacing: false,
                        endTrigger: cards[i + 1],
                        end: "top top",
                        onUpdate: (self) => {
                            const progress = self.progress;
                            const scale = 1 - (progress * 0.15);
                            const yOffset = progress * 40;
                            gsap.to(card, {
                                scale: scale,
                                y: -yOffset,
                                duration: 0.3,
                                ease: "power2.out"
                            });
                        }
                    });
                }
                // Mobile: Scroll-based scale effect (Compliments Sticky)
                gsap.set(card, { transformOrigin: "top center" });
                gsap.fromTo(card,
                    { scale: 1, filter: "brightness(1)" },
                    {
                        scale: 0.95,
                        filter: "brightness(0.8)",
                        ease: "none",
                        scrollTrigger: {
                            trigger: card,
                            start: "top 5%",
                            end: "bottom 5%",
                            scrub: true
                        }
                    }
                );
            }
        });
    }


    // --- Menu Logic ---
    window.menuTl = gsap.timeline({ paused: true });
    gsap.set(".nav-link", { y: "110%", skewY: 10 });
    gsap.set(".nav-item", { borderBottomColor: "rgba(0,0,0,0)" });
    gsap.set(".menu-footer-info", { opacity: 0, y: 20 });

    menuTl.to("#menuOverlay", { autoAlpha: 1, clipPath: 'inset(0 0 0% 0)', duration: 0.8, ease: "power4.inOut" })
        .to(".nav-link", { y: "0%", skewY: 0, duration: 0.8, stagger: 0.05, ease: "power4.out" }, "-=0.6")
        .to(".menu-footer-info", { opacity: 1, y: 0, duration: 0.5 }, "-=0.4");

    const openBtn = document.getElementById('openMenu');
    if (openBtn) openBtn.addEventListener('click', () => { window.lenis.stop(); menuTl.restart(); });

    const closeBtn = document.getElementById('closeMenu');
    if (closeBtn) closeBtn.addEventListener('click', () => { menuTl.reverse(); setTimeout(() => window.lenis.start(), 1000); });

    // Scroll Top Button
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.lenis.scrollTo(0);
        });
    }


    /* --- Grid Effects --- */
    const gridCards = document.querySelectorAll('.legacy-grid-wrapper .grid-card');
    const cardsData = [];

    gridCards.forEach((card, index) => {
        const media = card.querySelector('.media');
        const img = card.querySelector('img, video');
        const uniqueId = `distortion-filter-${index}`;

        const svgFilter = `
  <svg style="position: absolute; width: 0; height: 0; pointer-events: none;">
      <defs>
          <filter id="${uniqueId}">
              <feTurbulence type="fractalNoise" baseFrequency="0.01 0.003" numOctaves="5" seed="${index}" result="noise"/>
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="B" class="displacement-map" />
          </filter>
      </defs>
  </svg>
`;
        document.body.insertAdjacentHTML('beforeend', svgFilter);
        img.style.filter = `url(#${uniqueId})`;
        const displacementMap = document.querySelector(`#${uniqueId} .displacement-map`);

        const cardObj = { media: media, img: img, map: displacementMap, isHovered: false };
        cardsData.push(cardObj);

        media.addEventListener('mouseenter', () => {
            cardObj.isHovered = true;
            gsap.to(displacementMap, { attr: { scale: 50 }, duration: 0.4, ease: "power2.out", overwrite: true });
            gsap.to(img, { scale: 1.15, duration: 0.5, ease: "power2.out", overwrite: true });
        });

        media.addEventListener('mouseleave', () => {
            cardObj.isHovered = false;
        });

        gsap.set(img, { height: "140%", top: "-20%", scale: 1.1 });
        gsap.set(media, { clipPath: "inset(0 0 100% 0)" });

        if (window.ScrollTrigger) {
            gsap.to(img, {
                yPercent: 20, ease: "none",
                scrollTrigger: { trigger: media, start: "top bottom", end: "bottom top", scrub: true }
            });
            const revealTl = gsap.timeline({ scrollTrigger: { trigger: card, start: "top 85%", duration: 1.5, ease: "power4.inOut" } });
            revealTl.to(media, { clipPath: "inset(0 0 0% 0)", duration: 1.5, ease: "power4.inOut" });
        }
    });

    gsap.ticker.add(() => {
        const velocity = window.lenis.velocity || 0;
        const distortionAmount = Math.min(Math.abs(velocity) * 8.0, 150);

        cardsData.forEach(card => {
            gsap.set(card.media, {
                scaleY: 1 + Math.min(Math.abs(velocity) * 0.005, 0.25),
                scaleX: 1 - Math.min(Math.abs(velocity) * 0.002, 0.1)
            });

            if (!card.isHovered) {
                gsap.to(card.map, { attr: { scale: distortionAmount }, duration: 0.15, ease: "power1.out", overwrite: "auto" });
                const velocityScale = 1.1 + Math.min(Math.abs(velocity) * 0.005, 0.15);
                gsap.to(card.img, { scale: velocityScale, duration: 0.15, overwrite: "auto" });
            }
        });
    });


    /* --- Particle Background --- */
    class ParticleBackground {
        constructor() {
            this.container = document.getElementById('bg-canvas');
            // Mobile Optimization: Disable particles on mobile
            if (window.innerWidth <= 1120) return;

            if (!this.container || typeof THREE === 'undefined') return;

            this.scene = new THREE.Scene();
            this.scene.fog = new THREE.FogExp2(0x050505, 0.05);
            this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            this.camera.position.z = 2.8;

            this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            this.container.appendChild(this.renderer.domElement);

            this.particlesMesh = null;
            this.coreParticlesMesh = null;
            this.clock = new THREE.Clock();
            this.mouseX = 0; this.mouseY = 0;
            this.params = { scatter: 0 };
            this.handFactor = 0; this.handScatterTarget = 0;
            this.handFactor = 0; this.handScatterTarget = 0;
            this.particlesCount = 3500; // Performance Opt: Adjusted to 3000 (Outer Sphere)
            this.initialPosArray = new Float32Array(this.particlesCount * 3);
            this.randomSpreadArray = new Float32Array(this.particlesCount * 3);

            this.initParticles();
            this.initEvents();
        }

        createCircleTexture() {
            const canvas = document.createElement('canvas');
            canvas.width = 64; canvas.height = 64;
            const ctx = canvas.getContext('2d');
            const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
            gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.8)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 64, 64);
            return new THREE.CanvasTexture(canvas);
        }

        initParticles() {
            // Outer sphere
            const particlesGeometry = new THREE.BufferGeometry();
            const posArray = new Float32Array(this.particlesCount * 3);
            const colorArray = new Float32Array(this.particlesCount * 3);
            const colorBottom = new THREE.Color(0x515151);
            const colorMiddle = new THREE.Color(0x1d1d1d);
            const colorTop = new THREE.Color(0xb3b3b3);

            for (let i = 0; i < this.particlesCount; i++) {
                const radius = 1.3 + (Math.random() - 0.5) * 0.5;
                const theta = Math.acos(THREE.MathUtils.randFloatSpread(2));
                const phi = THREE.MathUtils.randFloatSpread(360);
                const x = radius * Math.sin(theta) * Math.cos(phi);
                const y = radius * Math.sin(theta) * Math.sin(phi);
                const z = radius * Math.cos(theta);
                posArray[i * 3] = x; posArray[i * 3 + 1] = y; posArray[i * 3 + 2] = z;
                this.initialPosArray[i * 3] = x; this.initialPosArray[i * 3 + 1] = y; this.initialPosArray[i * 3 + 2] = z;
                this.randomSpreadArray[i * 3] = (Math.random() - 0.5) * 2.0;
                this.randomSpreadArray[i * 3 + 1] = (Math.random() - 0.5) * 2.0;
                this.randomSpreadArray[i * 3 + 2] = (Math.random() - 0.5) * 2.0;

                let normalizedY = (y + 1.5) / 3;
                normalizedY = Math.max(0, Math.min(1, normalizedY));
                let mixedColor;
                if (normalizedY < 0.45) {
                    const t = normalizedY / 0.45;
                    mixedColor = colorBottom.clone().lerp(colorMiddle, t * t);
                } else {
                    const t = (normalizedY - 0.45) / 0.55;
                    mixedColor = colorMiddle.clone().lerp(colorTop, t);
                }
                colorArray[i * 3] = mixedColor.r; colorArray[i * 3 + 1] = mixedColor.g; colorArray[i * 3 + 2] = mixedColor.b;
            }
            particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
            particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
            const material = new THREE.PointsMaterial({ size: 0.02, map: this.createCircleTexture(), vertexColors: true, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false });
            this.particlesMesh = new THREE.Points(particlesGeometry, material);
            this.scene.add(this.particlesMesh);

            // Core
            this.coreCount = 2750; // Performance Opt: Adjusted to 2750
            const coreGeometry = new THREE.BufferGeometry();
            const corePosArray = new Float32Array(this.coreCount * 3);
            const coreColorArray = new Float32Array(this.coreCount * 3);
            this.coreInitialPosArray = new Float32Array(this.coreCount * 3);
            this.coreRandomSpreadArray = new Float32Array(this.coreCount * 3);
            const coreColor = new THREE.Color(0xffffff);
            for (let i = 0; i < this.coreCount; i++) {
                const radius = 0.78 * Math.cbrt(Math.random());
                const theta = Math.acos(THREE.MathUtils.randFloatSpread(2));
                const phi = THREE.MathUtils.randFloatSpread(360);
                const x = radius * Math.sin(theta) * Math.cos(phi);
                const y = radius * Math.sin(theta) * Math.sin(phi);
                const z = radius * Math.cos(theta);
                corePosArray[i * 3] = x; corePosArray[i * 3 + 1] = y; corePosArray[i * 3 + 2] = z;
                this.coreInitialPosArray[i * 3] = x; this.coreInitialPosArray[i * 3 + 1] = y; this.coreInitialPosArray[i * 3 + 2] = z;
                this.coreRandomSpreadArray[i * 3] = (Math.random() - 0.5) * 1.5;
                this.coreRandomSpreadArray[i * 3 + 1] = (Math.random() - 0.5) * 1.5;
                this.coreRandomSpreadArray[i * 3 + 2] = (Math.random() - 0.5) * 1.5;
                coreColorArray[i * 3] = coreColor.r; coreColorArray[i * 3 + 1] = coreColor.g; coreColorArray[i * 3 + 2] = coreColor.b;
            }
            coreGeometry.setAttribute('position', new THREE.BufferAttribute(corePosArray, 3));
            coreGeometry.setAttribute('color', new THREE.BufferAttribute(coreColorArray, 3));
            const coreMaterial = new THREE.PointsMaterial({ size: 0.012, map: this.createCircleTexture(), vertexColors: true, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false });
            this.coreParticlesMesh = new THREE.Points(coreGeometry, coreMaterial);
            this.scene.add(this.coreParticlesMesh);
        }

        initEvents() {
            window.addEventListener('mousemove', (event) => {
                this.mouseX = event.clientX / window.innerWidth - 0.5;
                this.mouseY = event.clientY / window.innerHeight - 0.5;
            });
            window.addEventListener('resize', () => {
                if (window.innerWidth === 0 || window.innerHeight === 0) return;
                this.camera.aspect = window.innerWidth / window.innerHeight;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(window.innerWidth, window.innerHeight);
            });
        }

        updateHandState(isHandDetected, isOpenHand) {
            const targetFactor = isHandDetected ? 1.0 : 0.0;
            this.handFactor = THREE.MathUtils.lerp(this.handFactor, targetFactor, 0.1);
            const targetScatter = isOpenHand ? 1.0 : 0.0;
            this.handScatterTarget = THREE.MathUtils.lerp(this.handScatterTarget, targetScatter, 0.1);
        }

        render() {
            if (!this.renderer) return;
            const elapsedTime = this.clock.getElapsedTime();
            const scrollScatter = this.params.scatter;
            // Simplify: Remove Hand Factor logic
            const scatterVal = scrollScatter;
            const breatheStrength = 0.02 * (1 - scatterVal * 0.5);
            const breathe = 0.8 + Math.sin(elapsedTime * 0.5) * breatheStrength;
            const easeProgress = Math.pow(scatterVal, 2.5);

            if (this.particlesMesh) {
                this.particlesMesh.rotation.y = elapsedTime * 0.08 + (scatterVal * 1.5);
                this.particlesMesh.rotation.y += this.mouseX * 0.05;
                this.particlesMesh.rotation.x = -elapsedTime * 0.02 + (this.mouseY * 0.05);
                const positions = this.particlesMesh.geometry.attributes.position.array;
                const initialPositions = this.initialPosArray;
                const randomSpreads = this.randomSpreadArray;
                const count = this.particlesCount;
                const scatterIntensity = 6.0;

                for (let i = 0; i < count; i++) {
                    const i3 = i * 3;
                    const ix = initialPositions[i3]; const iy = initialPositions[i3 + 1]; const iz = initialPositions[i3 + 2];
                    const rx = randomSpreads[i3]; const ry = randomSpreads[i3 + 1]; const rz = randomSpreads[i3 + 2];
                    const explosionFactor = easeProgress * scatterIntensity;
                    const noiseFactor = easeProgress * 3.0;
                    // const riseFactor = easeProgress * 2.0; 
                    positions[i3] = (ix * breathe) + (ix * explosionFactor) + (rx * noiseFactor);
                    positions[i3 + 1] = (iy * breathe) + (iy * explosionFactor) + (ry * noiseFactor) /* + (Math.abs(ry) * riseFactor) */;
                    positions[i3 + 2] = (iz * breathe) + (iz * explosionFactor) + (rz * noiseFactor);
                }
                this.particlesMesh.geometry.attributes.position.needsUpdate = true;
            }

            if (this.coreParticlesMesh) {
                this.coreParticlesMesh.rotation.y = -elapsedTime * 0.1 + (scatterVal * 0.5);
                this.coreParticlesMesh.rotation.z = elapsedTime * 0.05;
                const corePositions = this.coreParticlesMesh.geometry.attributes.position.array;
                const coreInitial = this.coreInitialPosArray;
                const coreSpread = this.coreRandomSpreadArray;
                const coreCount = this.coreCount;
                const coreScatterIntensity = 8.0;

                for (let i = 0; i < coreCount; i++) {
                    const i3 = i * 3;
                    const ix = coreInitial[i3]; const iy = coreInitial[i3 + 1]; const iz = coreInitial[i3 + 2];
                    const rx = coreSpread[i3]; const ry = coreSpread[i3 + 1]; const rz = coreSpread[i3 + 2];
                    const explosionFactor = easeProgress * coreScatterIntensity;
                    const noiseFactor = easeProgress * 2.0;
                    // const riseFactor = easeProgress * 1.5;
                    corePositions[i3] = (ix * breathe) + (ix * explosionFactor) + (rx * noiseFactor);
                    corePositions[i3 + 1] = (iy * breathe) + (iy * explosionFactor) + (ry * noiseFactor) /* + (Math.abs(ry) * riseFactor) */;
                    corePositions[i3 + 2] = (iz * breathe) + (iz * explosionFactor) + (rz * noiseFactor);
                }
                this.coreParticlesMesh.geometry.attributes.position.needsUpdate = true;
            }
            this.renderer.render(this.scene, this.camera);
        }
    }

    // Defer Particle Initialization for TBT Optimization
    let particleBg;
    const initParticles = () => {
        // Optimized Spline Viewer Loading
        const loadSpline = () => {
            const splineScript = document.createElement('script');
            splineScript.type = 'module';
            // Optimization: Use jsDelivr for faster edge caching in Asia & Pin version to avoid redirect latency
            splineScript.src = 'https://cdn.jsdelivr.net/npm/@splinetool/viewer@1.9.54/build/spline-viewer.js';

            // Listen for script load completion
            splineScript.onload = () => {
                // Wait for spline-viewer custom elements to be defined
                if (customElements.get('spline-viewer')) {
                    attachSplineListeners();
                } else {
                    customElements.whenDefined('spline-viewer').then(attachSplineListeners);
                }
            };

            document.head.appendChild(splineScript);
        };

        // Attach load event listeners to all spline-viewer elements
        const attachSplineListeners = () => {
            document.querySelectorAll('spline-viewer').forEach(viewer => {
                viewer.addEventListener('load', () => {
                    const wrapper = viewer.closest('.spline-wrapper');
                    if (wrapper) {
                        wrapper.classList.add('loaded');
                    }
                });
            });
        };

        // Use requestIdleCallback for better performance
        if ('requestIdleCallback' in window) {
            requestIdleCallback(loadSpline, { timeout: 800 });
        } else {
            setTimeout(loadSpline, 500);
        }

        // Defer particle initialization
        setTimeout(() => {
            if (particleBg) return; // Prevent double init
            particleBg = new ParticleBackground();

            if (window.ScrollTrigger && particleBg && particleBg.params) {
                gsap.to(particleBg.params, {
                    scatter: 1,
                    ease: "power4.out",
                    scrollTrigger: {
                        trigger: ".particle-pin-spacer",
                        start: "top top",
                        end: "top+=30% top",
                        scrub: true
                    }
                });
                ScrollTrigger.create({
                    trigger: ".particle-pin-spacer", start: "top top", end: "bottom top", scrub: true,
                    onUpdate: (self) => {
                        const text = document.querySelector('.intro-overlay-text');
                        if (text) text.style.opacity = 1 - self.progress * 3;
                    }
                });
            }

            const pinnedTextSection = document.querySelector('.section-pinned-text');
            const pinnedLines = gsap.utils.toArray('.pinned-line, .pinned-text-title');

            if (window.ScrollTrigger && pinnedTextSection && pinnedLines.length > 0 && particleBg && particleBg.params && window.innerWidth > 1120) {
                const pinTl = gsap.timeline({
                    scrollTrigger: { trigger: ".section-pinned-text", start: "top top", end: "+=200%", pin: true, scrub: 0.5 }
                });
                pinTl.to(particleBg.params, { scatter: 0, duration: 2, ease: "power2.inOut" }, 0);
                pinnedLines.forEach((line, i) => {
                    pinTl.to(line, { color: getComputedStyle(document.body).getPropertyValue('--text-main').trim(), opacity: 1, filter: "blur(0px)", duration: 1, ease: "power2.out" }, i === 0 ? 0.5 : "-=0.8");
                    if (line.classList.contains('special') && line.style.color) {
                        pinTl.to(line, { color: "#ccff00", opacity: 1, filter: "blur(0px)", duration: 1 }, "<");
                    }
                });
                pinTl.to(particleBg.params, { scatter: 1, duration: 2, ease: "power2.inOut" }, ">+0.5");
            }

            // Start Loop
            function raf(time) {
                if (particleBg && typeof particleBg.render === 'function') {
                    particleBg.render();
                }
                requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);

        }, 2500); // 2500ms delay for TBT optimization
    };

    // Robust check: Run immediately if loaded, otherwise wait
    if (document.readyState === 'complete') {
        initParticles();
    } else {
        window.addEventListener('load', initParticles);
    }

    /* --- MediaPipe Removed --- */

});
