/**
 * ===================================================================
 * STACKLY FINE JEWELLERY - MASTER JAVASCRIPT
 * File: script.js
 * Theme: Luxury Jewellery Store (Mayfair London)
 * Features:
 *   - Component loader (header.html & footer.html)
 *   - Fixed header scroll effect
 *   - Fullscreen mobile menu overlay
 *   - Scroll-to-top button with smooth scroll
 *   - 2-second luxury preloader
 *   - AOS animation initialization
 *   - Three.js 3D sparkling diamond constellation
 *   - Empty/Hash '#' link redirection to 404.html
 *   - Diamond Carat & 4Cs interactive calculator
 * ===================================================================
 */

document.addEventListener("DOMContentLoaded", function () {
  'use strict';

  // -------------------------------------------------------------------
  // 1. COMPONENT LOADER: HEADER & FOOTER
  // -------------------------------------------------------------------
  const headerContainer = document.getElementById('header-placeholder') || document.getElementById('site-header');
  const footerContainer = document.getElementById('footer-placeholder') || document.getElementById('site-footer');

  async function loadComponent(element, file) {
    if (!element) return;
    try {
      const response = await fetch(file + '?v=' + Date.now());
      if (response.ok) {
        element.innerHTML = await response.text();
      } else {
        throw new Error('Fetch failed with status ' + response.status);
      }
    } catch (e) {
      // Offline fallback via synchronous XMLHttpRequest
      try {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', file, false);
        xhr.send(null);
        if (xhr.status === 200 || xhr.status === 0) {
          element.innerHTML = xhr.responseText;
        }
      } catch (err) {
        console.warn('Component could not be loaded:', file, err);
      }
    }
  }

  // Load both components simultaneously
  Promise.all([
    headerContainer ? loadComponent(headerContainer, 'header.html') : Promise.resolve(),
    footerContainer ? loadComponent(footerContainer, 'footer.html') : Promise.resolve()
  ]).then(() => {
    initNavigation();
    initScrollToTop();
    initEmptyLinksRedirect();
  });

  // -------------------------------------------------------------------
  // 2. HEADER & NAVIGATION LOGIC (Fullscreen Display Cover Menu)
  // -------------------------------------------------------------------
  function getFullscreenMenu() {
    return document.getElementById('fullscreenCoverMenu') || document.getElementById('fullscreenMobileMenu');
  }

  function getToggleBtn() {
    return document.getElementById('mobileMenuToggleBtn') || document.querySelector('.luxury-toggle-btn') || document.getElementById('mobileMenuOpenBtn');
  }

  window.openFullscreenMenu = function () {
    const menu = getFullscreenMenu();
    const btn = getToggleBtn();
    if (menu) {
      menu.classList.add('active');
      document.body.style.overflow = 'hidden';
      document.body.classList.add('fullscreen-menu-open');
    }
    if (btn) {
      btn.classList.add('is-active');
      btn.setAttribute('aria-expanded', 'true');
    }
  };

  window.closeFullscreenMenu = function () {
    const menu = getFullscreenMenu();
    const btn = getToggleBtn();
    if (menu) {
      menu.classList.remove('active');
      document.body.style.overflow = '';
      document.body.classList.remove('fullscreen-menu-open');
    }
    if (btn) {
      btn.classList.remove('is-active');
      btn.setAttribute('aria-expanded', 'false');
    }
  };

  window.toggleFullscreenMenu = function () {
    const menu = getFullscreenMenu();
    if (menu && menu.classList.contains('active')) {
      window.closeFullscreenMenu();
    } else {
      window.openFullscreenMenu();
    }
  };

  // Backwards compatibility aliases
  window.openNavbarMenu = window.openFullscreenMenu;
  window.closeNavbarMenu = window.closeFullscreenMenu;
  window.toggleNavbarMenu = window.toggleFullscreenMenu;
  window.openMobileMenu = window.openFullscreenMenu;
  window.closeMobileMenu = window.closeFullscreenMenu;
  window.toggleMobileMenu = window.toggleFullscreenMenu;

  function initNavigation() {
    const siteHeader = document.querySelector('.site-header');
    
    // Sticky Scroll Effect
    function handleHeaderScroll() {
      if (!siteHeader) return;
      if (window.scrollY > 40) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }
    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    handleHeaderScroll();

    // Active Link Detection
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.main-navbar .nav-link, .fullscreen-nav-link, .mobile-nav-link');
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPath || (currentPath === '' && href === 'index.html')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // Global Delegated Click Listeners for Fullscreen Cover Menu
  document.addEventListener('click', function (e) {
    const toggleBtn = e.target.closest('#mobileMenuToggleBtn, .luxury-toggle-btn, #mobileMenuOpenBtn, .mobile-nav-toggle');
    if (toggleBtn) {
      e.preventDefault();
      e.stopPropagation();
      window.toggleFullscreenMenu();
      return;
    }

    const closeBtn = e.target.closest('#fullscreenCoverCloseBtn, .fullscreen-cover-close-btn, #mobileMenuCloseBtn, .btn-close-mobile');
    if (closeBtn) {
      e.preventDefault();
      e.stopPropagation();
      window.closeFullscreenMenu();
      return;
    }

    // Clicking any nav link or CTA inside fullscreen cover menu closes it
    if (e.target.closest('.fullscreen-cover-menu .fullscreen-nav-link, .fullscreen-cover-menu .btn, .fullscreen-cover-menu .fullscreen-social-btn, .fullscreen-mobile-menu .mobile-nav-link, .fullscreen-mobile-menu .btn')) {
      window.closeFullscreenMenu();
    }
  });

  // Close when ESC key is pressed
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.key === 'Esc') {
      window.closeFullscreenMenu();
    }
  });

  // Auto close mobile menu if resized to desktop breakpoint (>= 992px)
  window.addEventListener('resize', function () {
    if (window.innerWidth >= 992) {
      window.closeFullscreenMenu();
    }
  });

  // -------------------------------------------------------------------
  // 3. SCROLL-TO-TOP BUTTON
  // -------------------------------------------------------------------
  function initScrollToTop() {
    const scrollBtn = document.getElementById('scrollToTopBtn');
    if (!scrollBtn) return;

    window.addEventListener('scroll', function () {
      if (window.scrollY > 350) {
        scrollBtn.classList.add('visible');
      } else {
        scrollBtn.classList.remove('visible');
      }
    }, { passive: true });

    scrollBtn.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // -------------------------------------------------------------------
  // 4. EMPTY / HASH '#' LINKS REDIRECTION TO 404 PAGE
  // -------------------------------------------------------------------
  function initEmptyLinksRedirect() {
    document.addEventListener('click', function (e) {
      const target = e.target.closest('a');
      if (!target) return;
      const href = target.getAttribute('href');
      
      // If href is strictly '#' or empty string, redirect to 404.html
      if (href === '#' || href === '' || href === 'javascript:void(0)' || href === 'javascript:;') {
        e.preventDefault();
        window.location.href = '404.html';
      }
    });
  }

  // -------------------------------------------------------------------
  // 5. 2-SECOND LUXURY PRELOADER & AOS INITIALIZATION
  // -------------------------------------------------------------------
  const preloader = document.getElementById('global-preloader');
  
  setTimeout(function () {
    if (preloader) {
      preloader.style.opacity = '0';
      preloader.style.visibility = 'hidden';
      document.body.classList.remove('loading-active');

      setTimeout(function () {
        preloader.remove();
        initAOS();
      }, 600);
    } else {
      initAOS();
    }
  }, 2000); // Strict 2000ms delay

  function initAOS() {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 900,
        once: true,
        easing: 'ease-out-cubic',
        offset: 80
      });
    }
  }

  // -------------------------------------------------------------------
  // 6. THREE.JS 3D SPARKLING DIAMOND CONSTELLATION
  // -------------------------------------------------------------------
  if (document.getElementById('threejs-canvas') && typeof THREE !== 'undefined') {
    initThreeJSDiamondCanvas();
  }

  function initThreeJSDiamondCanvas() {
    const canvas = document.getElementById('threejs-canvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 400;

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Geometry: 1400 sparkling diamond particles
    const particleCount = 1400;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    // Gold and pure diamond white color palette
    const goldColor = new THREE.Color(0xc5a880);
    const whiteColor = new THREE.Color(0xffffff);
    const champagneColor = new THREE.Color(0xdfc79e);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 1200;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 1200;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 1000;

      // Randomly assign gold, champagne, or diamond white
      const rand = Math.random();
      let chosenColor;
      if (rand < 0.45) chosenColor = goldColor;
      else if (rand < 0.75) chosenColor = whiteColor;
      else chosenColor = champagneColor;

      colors[i * 3] = chosenColor.r;
      colors[i * 3 + 1] = chosenColor.g;
      colors[i * 3 + 2] = chosenColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 2.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Mouse movement parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    window.addEventListener('mousemove', function (e) {
      mouseX = (e.clientX - window.innerWidth / 2) * 0.05;
      mouseY = (e.clientY - window.innerHeight / 2) * 0.05;
    }, { passive: true });

    function animate() {
      requestAnimationFrame(animate);
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      particles.rotation.y += 0.0012;
      particles.rotation.x += 0.0006;
      particles.position.x = -targetX;
      particles.position.y = targetY;

      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', function () {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  // -------------------------------------------------------------------
  // 7. INTERACTIVE 4CS DIAMOND CALCULATOR
  // -------------------------------------------------------------------
  const caratSlider = document.getElementById('caratSlider');
  const caratValDisplay = document.getElementById('caratValueDisplay');
  const diamondDiameterDisplay = document.getElementById('diamondDiameterDisplay');
  const diamondEstPrice = document.getElementById('diamondEstPrice');

  if (caratSlider && caratValDisplay) {
    caratSlider.addEventListener('input', function () {
      const carat = parseFloat(this.value);
      caratValDisplay.textContent = carat.toFixed(2) + ' ct';
      
      // Calculate realistic diameter: diameter = 6.5 * (carat)^(1/3) mm
      const diameter = (6.5 * Math.cbrt(carat)).toFixed(1);
      if (diamondDiameterDisplay) {
        diamondDiameterDisplay.textContent = diameter + ' mm';
      }

      // Base price formula for high-grade D/VVS1 diamonds
      const price = Math.round(5800 * Math.pow(carat, 1.85));
      if (diamondEstPrice) {
        diamondEstPrice.textContent = '£' + price.toLocaleString('en-GB');
      }
    });
  }

});
