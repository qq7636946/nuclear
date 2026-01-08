# 廣野鐵工所 採用サイト - Assets Documentation

## 📁 Project Structure

```
d:/demo/
├── index.html
└── recruit/
    └── assets/
        ├── css/
        │   ├── swiper.css ✅
        │   └── style.css ✅
        ├── js/
        │   └── main.js ✅
        └── images/
            └── (image files needed - see below)
```

## ✅ Completed Files

### CSS Files
- **swiper.css** - Swiper slider library styles
- **style.css** - Complete design system with:
  - CSS custom properties (color palette, typography, spacing)
  - Responsive layout system
  - All component styles (header, hero, sections, footer)
  - Mobile-first responsive design
  - Animations and transitions

### JavaScript Files
- **main.js** - Interactive functionality:
  - Swiper slider initialization with CDN fallback
  - Mobile drawer menu
  - Scroll animations
  - Image hover effects
  - Smooth scrolling
  - Parallax effects
  - Performance optimizations

## 🖼️ Required Image Assets

The following images are referenced in the HTML but need to be provided:

### Logo & Icons
- `/recruit/favicon.ico`
- `/recruit/apple-touch-icon.png`
- `/recruit/ogp.png`
- `/recruit/assets/images/logo-primary.webp`
- `/recruit/assets/images/c-logo-white.webp`

### Hero Slider Images
- `/recruit/assets/images/hero-slider-img01.webp`
- `/recruit/assets/images/hero-slider-img01-back.webp`
- `/recruit/assets/images/hero-slider-img02.webp`
- `/recruit/assets/images/hero-slider-img02-back.webp`
- `/recruit/assets/images/hero-slider-img03.webp`
- `/recruit/assets/images/hero-slider-img03-back.webp`
- `/recruit/assets/images/hero-slider-img04.webp`
- `/recruit/assets/images/hero-slider-img04-back.webp`
- `/recruit/assets/images/hero-slider-img05.webp`
- `/recruit/assets/images/hero-slider-img05-sp.webp`
- `/recruit/assets/images/hero-slider-img05-back.webp`
- `/recruit/assets/images/hero-slider-img05-back-sp.webp`

### Intro Section
- `/recruit/assets/images/noise-texture-opacity30.webp`
- `/recruit/assets/images/home-intro-text-icon01.webp` (5 icons)
- `/recruit/assets/images/home-intro-figure01.webp` (4 figures)

### Business Section
- `/recruit/assets/images/home-business-img01.webp` (3 images)

### Interview Section
- `/recruit/assets/images/home-interview-decorate-01.webp` (2 decorative images)
- `/recruit/assets/images/home-interview-01.webp` (3 interview photos)
- `/recruit/assets/images/home-interview-bg-01.webp` (3 background images)

### Institution Section
- `/recruit/assets/images/home-institution-item-blue.webp`
- `/recruit/assets/images/home-institution-img-item-01.webp` (5 images)

## 🚀 How to Use

1. **Add Images**: Place all required images in `/recruit/assets/images/` directory
2. **Open in Browser**: Open `index.html` in a modern web browser
3. **Test Features**:
   - Hero slider auto-play
   - Mobile menu (hamburger icon)
   - Scroll animations
   - Button hover effects
   - Responsive design on different screen sizes

## 🎨 Design Features

- **Color Palette**: Blue (#4EAEBF), Orange (#F46F2C), Red (#E43936), Green (#00A44D), Yellow (#F6B000)
- **Typography**: Noto Sans JP (Japanese), Lexend (English)
- **Responsive**: Mobile-first design with breakpoints at 767px and 1024px
- **Animations**: Smooth transitions, fade-ins, parallax effects
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🔧 Dependencies

The site uses Swiper.js for the slider functionality. The JavaScript includes:
- Primary: Local Swiper library (if available)
- Fallback: CDN version loaded automatically if local version not found

## 💡 Notes

- All paths are relative to the `/recruit/` directory
- Images should be in WebP format for optimal performance
- The site is fully responsive and works on all modern devices
- JavaScript is required for interactive features (slider, menu, animations)

---

**Created**: 2026-01-06
**Version**: 1.0
