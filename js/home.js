/* =========================================
   HOME PAGE LOGIC (index.html)
   ========================================= */

window.addEventListener('load', function () {
    if (!window.ScrollTrigger || !window.gsap) return;

    // --- Particle Background Interactions ---
    // Access the global instance
    const particleBg = window.particleBgInstance;

    if (particleBg && particleBg.params) {
        // Scatter on Hero Scroll
        gsap.to(particleBg.params, {
            scatter: 1,
            ease: "power1.inOut",
            scrollTrigger: {
                trigger: ".particle-pin-spacer",
                start: "top top",
                end: "top+=2000",
                scrub: true
            }
        });

        // Intro Text Opacity
        ScrollTrigger.create({
            trigger: ".particle-pin-spacer",
            start: "top top",
            end: "bottom top",
            scrub: true,
            onUpdate: (self) => {
                const text = document.querySelector('.intro-overlay-text');
                if (text) text.style.opacity = 1 - self.progress * 3;
            }
        });
    }

    // --- Pinned Text Section ---
    const pinnedTextSection = document.querySelector('.section-pinned-text');
    const pinnedLines = gsap.utils.toArray('.pinned-line, .pinned-text-title');

    if (pinnedTextSection && pinnedLines.length > 0) {
        // Use CSS Sticky for pinned-text-container to avoid GSAP Pinning conflicts if possible,
        // but for this effect (scrubbing 200%), GSAP Pin is usually better.
        // Ensure the container has height.

        const pinTl = gsap.timeline({
            scrollTrigger: {
                trigger: ".section-pinned-text",
                start: "top top",
                end: "+=200%",
                pin: true,
                scrub: 0.5
            }
        });

        // calm particles down
        if (particleBg && particleBg.params) {
            pinTl.to(particleBg.params, { scatter: 0, duration: 2, ease: "power2.inOut" }, 0);
        }

        pinnedLines.forEach((line, i) => {
            const colorMain = getComputedStyle(document.body).getPropertyValue('--text-main').trim();
            pinTl.to(line, {
                color: colorMain,
                opacity: 1,
                filter: "blur(0px)",
                duration: 1,
                ease: "power2.out"
            }, i === 0 ? 0.5 : "-=0.8");

            if (line.classList.contains('special') && line.style.color) {
                pinTl.to(line, { color: "#ccff00", opacity: 1, filter: "blur(0px)", duration: 1 }, "<");
            }
        });

        // scatter again after
        if (particleBg && particleBg.params) {
            pinTl.to(particleBg.params, { scatter: 1, duration: 2, ease: "power2.inOut" }, ">+0.5");
        }
    }

    // --- Explosive Zoom Section ---
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
        exploTl.fromTo(".center-stage", { scale: 0.8, borderRadius: "20px" }, { scale: 2.5, borderRadius: "0px", duration: 1, ease: "power1.inOut" }, 0);
        exploTl.to(".pos-1", { x: -120, y: -120, opacity: 0, scale: 1.5, duration: 0.8 }, 0);
        exploTl.to(".pos-2", { x: -160, y: 80, opacity: 0, scale: 1.2, duration: 0.9 }, 0);
        exploTl.to(".pos-3", { x: 160, y: -40, opacity: 0, scale: 1.5, duration: 0.7 }, 0);
        exploTl.to(".pos-4", { x: 120, y: 120, opacity: 0, scale: 1.2, duration: 0.8 }, 0);
        exploTl.to(".pos-5", { y: 80, opacity: 0, scale: 2, duration: 0.5 }, 0);
    }

    // --- Horizontal Staggered Scroll ---
    const hSectionStaggered = document.querySelector('.section-horizontal-staggered');
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

    // --- Card Stack ---
    const cards = gsap.utils.toArray(".project-card");
    cards.forEach((card, i) => {
        if (!isMobile) {
            // Desktop Pinning
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
        } else {
            // Mobile specific simple fade/scale
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

    // --- Legacy Grid Distortions ---
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

        gsap.to(img, {
            yPercent: 20, ease: "none",
            scrollTrigger: { trigger: media, start: "top bottom", end: "bottom top", scrub: true }
        });

        const revealTl = gsap.timeline({ scrollTrigger: { trigger: card, start: "top 85%", duration: 1.5, ease: "power4.inOut" } });
        revealTl.to(media, { clipPath: "inset(0 0 0% 0)", duration: 1.5, ease: "power4.inOut" });
    });

    // Grid Tick
    gsap.ticker.add(() => {
        if (!window.lenis) return;
        const velocity = window.lenis.velocity || 0;

        // --- Tech Nav Logic ---
        const techIndicator = document.getElementById('techIndicator');
        const hudScrollVal = document.getElementById('hudScrollVal');

        if (techIndicator) {
            // Sections: #home, #work, #lab, #grid, #contact
            // mapped to 0%, 25%, 50%, 75%, 100%
            const scrollY = window.scrollY;
            const home = document.getElementById('home'); // 0%
            const work = document.getElementById('work'); // 25%
            const lab = document.getElementById('lab');   // 50%
            const grid = document.getElementById('grid'); // 75%
            const contact = document.getElementById('contact'); // 100%

            let targetPercent = 0;

            // Helper to get relative progress between two elements
            // Returns 0 to 1
            const getProgress = (startEl, endEl) => {
                if (!startEl) return 0;
                const start = startEl.offsetTop;
                const end = endEl ? endEl.offsetTop : document.body.scrollHeight;
                const dist = end - start;
                const current = scrollY - start;
                return Math.max(0, Math.min(1, current / dist));
            };

            if (home && work && scrollY < work.offsetTop) {
                // Between Home and Work (0 -> 25)
                targetPercent = 0 + (getProgress(home, work) * 25);
            } else if (work && lab && scrollY < lab.offsetTop) {
                // Between Work and Lab (25 -> 50)
                targetPercent = 25 + (getProgress(work, lab) * 25);
            } else if (lab && grid && scrollY < grid.offsetTop) {
                // Between Lab and Grid (50 -> 75)
                targetPercent = 50 + (getProgress(lab, grid) * 25);
            } else if (grid && contact && scrollY < contact.offsetTop) {
                // Between Grid and Contact (75 -> 100)
                targetPercent = 75 + (getProgress(grid, contact) * 25);
            } else if (contact) {
                // After Contact start
                targetPercent = 100;
            }

            gsap.to(techIndicator, { top: `${targetPercent}%`, duration: 0.2, ease: "power1.out", overwrite: true });
        }

        if (hudScrollVal) {
            hudScrollVal.innerText = Math.floor(window.scrollY).toString().padStart(4, '0');
        }

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

    // Force refresh to adjust to layout changes
    // Wait for loader to finish revealing for exact coords
    if (document.querySelector('.loader-screen') && document.querySelector('.loader-screen').style.display !== 'none') {
        window.addEventListener('nuclear-loaded', () => {
            ScrollTrigger.refresh();
        });
    } else {
        ScrollTrigger.refresh();
    }
});
