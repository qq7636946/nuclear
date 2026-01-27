/* =========================================
   WORK PAGE LOGIC (work.html)
   ========================================= */

window.addEventListener('load', function () {
    if (!window.ScrollTrigger || !window.gsap) return;

    // --- Parallax Effects ---
    document.querySelectorAll('[data-speed]').forEach(item => {
        gsap.to(item, {
            y: (i, target) => -100 * target.dataset.speed,
            ease: "none",
            scrollTrigger: {
                trigger: item,
                start: "top bottom",
                end: "bottom top",
                scrub: 0
            }
        });
    });

    // --- Work Item Reveals ---
    const workItems = document.querySelectorAll('.work-item');
    workItems.forEach(item => {
        const media = item.querySelector('.work-media');
        if (media) {
            gsap.fromTo(media,
                { clipPath: "inset(100% 0 0 0)", scale: 1.1 },
                {
                    clipPath: "inset(0% 0 0 0)", scale: 1,
                    duration: 1,
                    ease: "power4.inOut",
                    scrollTrigger: { trigger: item, start: "top 100%" }
                }
            );
        }
        const info = item.querySelector('.work-info');
        if (info) {
            gsap.fromTo(info,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 1, delay: 0.1, scrollTrigger: { trigger: item, start: "top 100%" } }
            );
        }
    });

    // --- Sidebar Progress ---
    const progressBar = document.getElementById('progressBar');
    const scrollVal = document.getElementById('scrollVal');

    if (progressBar && window.lenis) {
        window.lenis.on('scroll', (e) => {
            const currentProgress = e.progress * 100;
            progressBar.style.height = `${currentProgress}%`;
            if (scrollVal) scrollVal.innerText = Math.floor(e.scroll).toString().padStart(4, '0');
        });
    }

    // --- Simple Filtering Logic ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Active class toggle
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.innerText.trim().toUpperCase();

                // GSAP Layout transition (Simple fade out/in)
                const grid = document.querySelector('.irregular-grid');
                if (!grid) return;

                const items = Array.from(document.querySelectorAll('.work-item'));

                // Animate out
                gsap.to(items, {
                    opacity: 0,
                    y: 20,
                    duration: 0.3,
                    onComplete: () => {
                        items.forEach(item => {
                            const tags = item.querySelector('.work-tags');
                            const tagText = tags ? tags.innerText.toUpperCase() : "";
                            // Check if matches
                            let isMatch = (filterValue === 'ALL') || tagText.includes(filterValue);

                            // Specific mapping for "R&D" if needed, but text matching usually works with tag content
                            if (filterValue === 'R&D' && (tagText.includes('EXPERIMENTAL') || tagText.includes('THREE.JS'))) isMatch = true;

                            item.style.display = isMatch ? 'flex' : 'none';
                        });

                        // Force ScrollTrigger refresh to recalculate positions
                        ScrollTrigger.refresh();

                        // Animate in visible items
                        const visibleItems = items.filter(item => item.style.display !== 'none');
                        gsap.fromTo(visibleItems,
                            { opacity: 0, y: 20 },
                            { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, clearProps: "transform, opacity" }
                        );
                    }
                });
            });
        });
    }
});
