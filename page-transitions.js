/**
 * =========================================
 * NUCLEAR LABS - UNIFIED PAGE TRANSITION SYSTEM
 * =========================================
 * 完整的頁面轉場系統
 * 流程：點擊連結 → 離場動畫 → 跳轉頁面 → 入場動畫
 */

class PageTransitionManager {
    constructor() {
        this.isTransitioning = false;
        this.init();
    }
    
    init() {
        // 創建轉場覆蓋層
        this.createOverlay();
        
        // 頁面載入時執行入場動畫
        window.addEventListener('load', () => {
            setTimeout(() => this.pageEnter(), 100);
        });
        
        // 為所有內部連結添加離場動畫
        this.attachLinkHandlers();
    }
    
    createOverlay() {
        // 檢查是否已存在
        if (document.querySelector('.page-transition-overlay')) return;
        
        const overlay = document.createElement('div');
        overlay.className = 'page-transition-overlay';
        overlay.innerHTML = `
            <div class="transition-layers">
                <div class="transition-layer layer-1"></div>
                <div class="transition-layer layer-2"></div>
                <div class="transition-layer layer-3"></div>
            </div>
            <div class="transition-logo-wrapper">
                <div class="transition-logo-text">NUCLEAR LABS</div>
            </div>
            <div class="transition-progress">
                <div class="progress-bar"></div>
            </div>
        `;
        
        document.body.insertBefore(overlay, document.body.firstChild);
        
        // 添加樣式
        this.injectStyles();
    }
    
    injectStyles() {
        if (document.getElementById('page-transition-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'page-transition-styles';
        style.textContent = `
            /* Page Transition Overlay */
            .page-transition-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                z-index: 10000;
                pointer-events: none;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }
            
            .transition-layers {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
            }
            
            .transition-layer {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                transform-origin: bottom;
            }
            
            .layer-1 {
                background: #ccff00;
                z-index: 3;
            }
            
            .layer-2 {
                background: #1a1a1a;
                z-index: 2;
            }
            
            .layer-3 {
                background: #000;
                z-index: 1;
            }
            
            .transition-logo-wrapper {
                position: relative;
                z-index: 10;
                opacity: 0;
            }
            
            .transition-logo-text {
                font-family: 'Syncopate', sans-serif;
                font-weight: 700;
                font-size: 2rem;
                color: #000;
                letter-spacing: 4px;
            }
            
            .transition-progress {
                position: absolute;
                bottom: 40px;
                left: 50%;
                transform: translateX(-50%);
                width: 200px;
                height: 2px;
                background: rgba(255, 255, 255, 0.2);
                z-index: 10;
                opacity: 0;
            }
            
            .progress-bar {
                width: 0%;
                height: 100%;
                background: #ccff00;
            }
            
            /* Content Wrapper */
            #nu-wrapper, #main-content {
                will-change: transform, opacity, filter;
            }
        `;
        
        document.head.appendChild(style);
    }
    
    // 入場動畫
    pageEnter() {
        if (!window.gsap) {
            console.warn('GSAP not loaded, skipping transition');
            return;
        }
        
        const contentWrapper = document.querySelector('#nu-wrapper') || document.querySelector('#main-content');
        const layers = document.querySelectorAll('.transition-layer');
        const logo = document.querySelector('.transition-logo-wrapper');
        const progressBar = document.querySelector('.progress-bar');
        const progressWrapper = document.querySelector('.transition-progress');
        
        const tl = gsap.timeline();
        
        // 設置初始狀態
        gsap.set(contentWrapper, {
            scale: 1.1,
            y: 60,
            opacity: 0,
            filter: 'blur(20px)'
        });
        
        gsap.set(layers, {
            scaleY: 1
        });
        
        // 動畫序列
        tl.to(logo, {
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out'
        })
        .to(progressWrapper, {
            opacity: 1,
            duration: 0.3
        }, '-=0.3')
        .to(progressBar, {
            width: '100%',
            duration: 1.2,
            ease: 'power2.inOut'
        }, '-=0.3')
        // 分層幕簾上升
        .to(layers[0], {
            scaleY: 0,
            duration: 0.8,
            ease: 'power4.inOut'
        }, '-=0.6')
        .to(layers[1], {
            scaleY: 0,
            duration: 0.8,
            ease: 'power4.inOut'
        }, '-=0.6')
        .to(layers[2], {
            scaleY: 0,
            duration: 0.8,
            ease: 'power4.inOut'
        }, '-=0.6')
        // 內容淡入、縮放、去模糊
        .to(contentWrapper, {
            scale: 1,
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 1.5,
            ease: 'power3.out'
        }, '-=1.2')
        // 隱藏 logo 和進度條
        .to([logo, progressWrapper], {
            opacity: 0,
            duration: 0.4
        }, '-=0.8');
    }
    
    // 離場動畫
    pageExit(url) {
        if (this.isTransitioning) return;
        this.isTransitioning = true;
        
        if (!window.gsap) {
            window.location.href = url;
            return;
        }
        
        const contentWrapper = document.querySelector('#nu-wrapper') || document.querySelector('#main-content');
        const layers = document.querySelectorAll('.transition-layer');
        const logo = document.querySelector('.transition-logo-wrapper');
        
        const tl = gsap.timeline({
            onComplete: () => {
                window.location.href = url;
            }
        });
        
        // 重置圖層
        gsap.set(layers, {
            scaleY: 0,
            transformOrigin: 'top'
        });
        
        // 動畫序列
        tl.to(logo, {
            opacity: 1,
            duration: 0.4,
            ease: 'power2.out'
        })
        // 內容縮小、模糊、淡出
        .to(contentWrapper, {
            scale: 0.95,
            y: -40,
            opacity: 0.4,
            filter: 'blur(20px)',
            duration: 0.9,
            ease: 'power3.inOut'
        }, '-=0.2')
        // 分層幕簾下降
        .to(layers[2], {
            scaleY: 1,
            duration: 0.7,
            ease: 'power4.inOut'
        }, '-=0.7')
        .to(layers[1], {
            scaleY: 1,
            duration: 0.7,
            ease: 'power4.inOut'
        }, '-=0.6')
        .to(layers[0], {
            scaleY: 1,
            duration: 0.7,
            ease: 'power4.inOut'
        }, '-=0.5');
    }
    
    // 為連結添加處理器
    attachLinkHandlers() {
        // 等待 DOM 完全載入
        const attachHandlers = () => {
            const links = document.querySelectorAll('a:not([target="_blank"]):not([href^="#"]):not([href^="mailto"]):not([href^="tel"]):not(.no-transition)');
            
            links.forEach(link => {
                // 移除舊的監聽器（如果有）
                link.removeEventListener('click', link._transitionHandler);
                
                // 創建新的處理器
                link._transitionHandler = (e) => {
                    const href = link.getAttribute('href');
                    
                    // 只處理內部連結
                    if (href && !href.startsWith('http') && href !== '#' && !this.isTransitioning) {
                        e.preventDefault();
                        this.pageExit(href);
                    }
                };
                
                link.addEventListener('click', link._transitionHandler);
            });
        };
        
        // 立即執行一次
        attachHandlers();
        
        // 監聽 DOM 變化（處理動態添加的連結）
        const observer = new MutationObserver(attachHandlers);
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
}

// 自動初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.transitionManager = new PageTransitionManager();
    });
} else {
    window.transitionManager = new PageTransitionManager();
}
