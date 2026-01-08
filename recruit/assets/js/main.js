/**
 * Main JavaScript for Hirono Iron Works Recruitment Site
 * Handles: Swiper slider, drawer menu, scroll animations, and interactive elements
 */

// ============================================
// Swiper Slider Initialization
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  
  // Initialize Swiper if the library is available
  if (typeof Swiper !== 'undefined') {
    const heroSlider = new Swiper('.js-hero__slider', {
      loop: true,
      speed: 1000,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      effect: 'fade',
      fadeEffect: {
        crossFade: true
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      on: {
        init: function() {
          console.log('Hero slider initialized');
        },
        slideChange: function() {
          // Add custom animations on slide change if needed
        }
      }
    });
  } else {
    // Fallback: Load Swiper from CDN
    loadSwiperFromCDN();
  }
  
  // ============================================
  // Drawer Menu Functionality
  // ============================================
  initDrawerMenu();
  
  // ============================================
  // Scroll Animations
  // ============================================
  initScrollAnimations();
  
  // ============================================
  // Image Hover Effects
  // ============================================
  initImageHoverEffects();
  
  // ============================================
  // Remove Initial Loading State
  // ============================================
  setTimeout(() => {
    document.body.classList.remove('is-initial');
  }, 500);
  
  // ============================================
  // Smooth Scroll for Anchor Links
  // ============================================
  initSmoothScroll();
  
  // ============================================
  // Parallax Effects
  // ============================================
  initParallaxEffects();
});

// ============================================
// Load Swiper from CDN (Fallback)
// ============================================
function loadSwiperFromCDN() {
  const swiperCSS = document.createElement('link');
  swiperCSS.rel = 'stylesheet';
  swiperCSS.href = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css';
  document.head.appendChild(swiperCSS);
  
  const swiperJS = document.createElement('script');
  swiperJS.src = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js';
  swiperJS.onload = function() {
    const heroSlider = new Swiper('.js-hero__slider', {
      loop: true,
      speed: 1000,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      effect: 'fade',
      fadeEffect: {
        crossFade: true
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      }
    });
  };
  document.body.appendChild(swiperJS);
}

// ============================================
// Drawer Menu
// ============================================
function initDrawerMenu() {
  const drawerTrigger = document.querySelector('.drawer-trigger');
  const drawer = document.querySelector('[data-drawer]');
  const drawerBody = document.querySelector('[data-drawer-body]');
  
  if (!drawerTrigger || !drawer) return;
  
  drawerTrigger.addEventListener('click', function() {
    const isActive = drawer.classList.contains('is-active');
    
    if (isActive) {
      // Close drawer
      drawer.classList.remove('is-active');
      drawerTrigger.classList.remove('is-active');
      document.body.style.overflow = '';
    } else {
      // Open drawer
      drawer.classList.add('is-active');
      drawerTrigger.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    }
  });
  
  // Close drawer when clicking outside
  drawer.addEventListener('click', function(e) {
    if (e.target === drawer) {
      drawer.classList.remove('is-active');
      drawerTrigger.classList.remove('is-active');
      document.body.style.overflow = '';
    }
  });
  
  // Close drawer when clicking on a link
  const drawerLinks = drawer.querySelectorAll('a');
  drawerLinks.forEach(link => {
    link.addEventListener('click', function() {
      drawer.classList.remove('is-active');
      drawerTrigger.classList.remove('is-active');
      document.body.style.overflow = '';
    });
  });
}

// ============================================
// Scroll Animations
// ============================================
function initScrollAnimations() {
  // Intersection Observer for fade-in animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  // Observe elements with fade-in class
  const fadeElements = document.querySelectorAll('.c-heading, .p-home-intro__txt, .p-home-business__txt, .p-home-vision__txt, .p-home-interview__txt');
  fadeElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(el);
  });
  
  // Header background on scroll
  const header = document.querySelector('.l-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 249, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
      } else {
        header.style.background = 'rgba(255, 255, 249, 0.95)';
        header.style.boxShadow = 'none';
      }
    });
  }
}

// ============================================
// Image Hover Effects
// ============================================
function initImageHoverEffects() {
  const hoverItems = document.querySelectorAll('[data-hover]');
  
  hoverItems.forEach(item => {
    const mask = item.querySelector('.p-home-interview__img-mask');
    
    if (!mask) return;
    
    item.addEventListener('mouseenter', function() {
      mask.style.transition = 'transform 0.6s ease';
      mask.style.transform = 'scale(1.1) rotate(2deg)';
    });
    
    item.addEventListener('mouseleave', function() {
      mask.style.transform = 'scale(1) rotate(0deg)';
    });
  });
  
  // Intro figure animations
  const figures = document.querySelectorAll('.p-home-intro__figure');
  figures.forEach((figure, index) => {
    figure.style.animation = `float ${3 + index * 0.5}s ease-in-out infinite`;
  });
}

// ============================================
// Smooth Scroll
// ============================================
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerHeight = document.querySelector('.l-header')?.offsetHeight || 0;
        const targetPosition = target.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ============================================
// Parallax Effects
// ============================================
function initParallaxEffects() {
  const parallaxElements = document.querySelectorAll('.p-home-intro__figure, .p-home-institution__img-item');
  
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    parallaxElements.forEach((el, index) => {
      const speed = 0.5 + (index * 0.1);
      const yPos = -(scrolled * speed);
      el.style.transform = `translateY(${yPos}px)`;
    });
  });
}

// ============================================
// Circle Animation for Intro Section
// ============================================
function initCircleAnimation() {
  const circle = document.querySelector('[data-home-circle]');
  if (!circle) return;
  
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const introSection = document.querySelector('[data-home-intro]');
    
    if (!introSection) return;
    
    const sectionTop = introSection.offsetTop;
    const sectionHeight = introSection.offsetHeight;
    const scrollProgress = (scrolled - sectionTop) / sectionHeight;
    
    if (scrollProgress >= 0 && scrollProgress <= 1) {
      const scale = 0.5 + (scrollProgress * 0.5);
      circle.style.transform = `scale(${scale})`;
      circle.style.opacity = 1 - (scrollProgress * 0.3);
    }
  });
}

// ============================================
// Add Float Animation Keyframes
// ============================================
const style = document.createElement('style');
style.textContent = `
  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-20px);
    }
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;
document.head.appendChild(style);

// ============================================
// Lazy Loading Images
// ============================================
function initLazyLoading() {
  const images = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
}

// ============================================
// Performance Optimization
// ============================================
let ticking = false;

function requestTick(callback) {
  if (!ticking) {
    requestAnimationFrame(() => {
      callback();
      ticking = false;
    });
    ticking = true;
  }
}

// Optimized scroll handler
window.addEventListener('scroll', () => {
  requestTick(() => {
    // Scroll-based animations go here
  });
}, { passive: true });

// ============================================
// Console Message
// ============================================
console.log('%c廣野鐵工所 採用サイト', 'font-size: 20px; font-weight: bold; color: #00A44D;');
console.log('%cHIRONO IRON WORKS RECRUIT SITE', 'font-size: 14px; color: #4EAEBF;');
console.log('Developed with ❤️');
