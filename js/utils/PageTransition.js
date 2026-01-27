/* ========================================
   PAGE TRANSITION MANAGER CLASS
   ======================================== */
class PageTransitionManager {
    constructor() {
        this.overlay = document.querySelector('.page-transition-overlay');
        this.logo = document.querySelector('.transition-logo');
        this.isTransitioning = false;
    }

    // Exit Animation (When clicking a link)
    exitAnimation(callback) {
        if (this.isTransitioning) return;
        this.isTransitioning = true;
        if (window.lenis) window.lenis.stop();

        const tl = gsap.timeline({
            onComplete: () => { if (callback) callback(); }
        });

        tl.to('[data-transition-element]', { y: -50, opacity: 0, stagger: 0.03, duration: 0.5, ease: 'power2.in' });
        tl.to(this.overlay, { clipPath: 'inset(0 0 0% 0)', duration: 0.8, ease: 'power4.inOut' }, '-=0.3');
        tl.to(this.logo, { opacity: 1, duration: 0.3 }, '-=0.4');
        return tl;
    }

    // Entry Animation (When page loads)
    entryAnimation() {
        const tl = gsap.timeline({
            onComplete: () => {
                this.isTransitioning = false;
                if (window.lenis) window.lenis.start();
            }
        });

        tl.to(this.logo, { opacity: 0, duration: 0.3 });
        tl.to(this.overlay, { clipPath: 'inset(0 0 100% 0)', duration: 0.8, ease: 'power4.inOut' }, '-=0.1');
        tl.from('[data-transition-element]', { y: 50, opacity: 0, stagger: 0.03, duration: 0.6, ease: 'power2.out' }, '-=0.5');
        return tl;
    }

    interceptLinks() {
        const links = document.querySelectorAll('a[href]:not([target="_blank"]):not([href^="#"])');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) return;

                // If it's an anchor on the same page, ignore (let smooth scroll handle it)
                if (href.startsWith('#')) return;

                e.preventDefault();

                // If menu is open, reverse it first
                const menuOverlay = document.getElementById('menuOverlay');
                if (menuOverlay && getComputedStyle(menuOverlay).visibility !== 'hidden' && window.menuTl) {
                    window.menuTl.reverse();
                }

                this.exitAnimation(() => { window.location.href = href; });
            });
        });
    }
}

// Attach to window for global access
window.PageTransitionManager = PageTransitionManager;
