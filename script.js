// ============================================================
// Marcela Modas — script.js (premium edition)
// IntersectionObserver reveals, magnetic buttons, tilt 3D,
// counters, parallax, scroll progress, marquee responsivo
// ============================================================

(function () {
  'use strict';

  // Marca que o JS está ativo: sem isso, o CSS deixa tudo visível por padrão.
  // Esse é nosso seguro contra a página ficar invisível se algo der errado.
  document.documentElement.classList.add('js');

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Boot: marca corpo como carregado pra disparar a animação do hero ---
  var bootHero = function () {
    document.body.classList.remove('is-loading');
    document.body.classList.add('is-loaded');
  };
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    requestAnimationFrame(bootHero);
  } else {
    window.addEventListener('DOMContentLoaded', bootHero);
  }

  // Helper: elemento está (parcialmente) na viewport agora?
  function isInViewport(el, margin) {
    margin = margin || 0;
    var r = el.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight;
    return r.top < vh - margin && r.bottom > margin;
  }

  // --- Ano dinâmico no footer ---
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // --- Menu mobile ---
  var toggle = document.getElementById('menuToggle');
  var nav = document.getElementById('navMobile');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      toggle.classList.toggle('is-open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('is-open');
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --- FAQ: ao abrir um item, fecha os demais ---
  var faqItems = document.querySelectorAll('.faq-list details');
  faqItems.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (item.open) {
        faqItems.forEach(function (other) {
          if (other !== item) other.open = false;
        });
      }
    });
  });

  // --- Header com sombra ao rolar + scroll progress bar ---
  var header = document.querySelector('.site-header');
  var progressEl = document.getElementById('scrollProgress');
  var ticking = false;

  function updateScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('is-scrolled', y > 8);

    if (progressEl) {
      var docH = document.documentElement.scrollHeight - window.innerHeight;
      var p = docH > 0 ? Math.min(1, Math.max(0, y / docH)) : 0;
      progressEl.style.setProperty('--p', (p * 100).toFixed(2) + '%');
    }

    // Parallax leve
    if (!prefersReducedMotion) updateParallax(y);

    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(updateScroll);
      ticking = true;
    }
  }, { passive: true });
  updateScroll();

  // --- Reveal on scroll (scroll listener puro, mais robusto que IntersectionObserver) ---
  // Estrategia: tudo eh visivel por padrao no CSS. Aqui marcamos so os elementos
  // que estao FORA da viewport com .reveal-init. Esses entram em modo invisivel
  // e ficam visiveis quando rolarem para a tela. Safety net mostra tudo apos 2s.
  var revealEls = document.querySelectorAll('[data-reveal]');
  if (revealEls.length && !prefersReducedMotion) {
    revealEls.forEach(function (el) {
      var d = el.getAttribute('data-reveal-delay');
      if (d) el.style.setProperty('--reveal-delay', d + 'ms');
    });

    var revealMargin = 80; // dispara quando entra 80px na viewport

    var checkReveals = function () {
      var vh = window.innerHeight || document.documentElement.clientHeight;
      revealEls.forEach(function (el) {
        if (el.classList.contains('is-visible')) return;
        var r = el.getBoundingClientRect();
        if (r.top < vh - revealMargin && r.bottom > revealMargin) {
          el.classList.add('is-visible');
        }
      });
    };

    // Marca como "a animar" so os que estao fora da viewport
    var vh0 = window.innerHeight || document.documentElement.clientHeight;
    revealEls.forEach(function (el) {
      var r = el.getBoundingClientRect();
      var alreadyVisible = r.top < vh0 - revealMargin && r.bottom > revealMargin;
      if (!alreadyVisible) {
        el.classList.add('reveal-init');
      }
    });

    // Listener de scroll com rAF
    var revealTicking = false;
    var onScroll = function () {
      if (revealTicking) return;
      revealTicking = true;
      requestAnimationFrame(function () {
        checkReveals();
        revealTicking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    // Confere uma vez no load
    checkReveals();

    // Safety net: depois de 2 segundos, qualquer elemento ainda invisivel aparece
    setTimeout(function () {
      revealEls.forEach(function (el) {
        if (el.classList.contains('reveal-init') && !el.classList.contains('is-visible')) {
          el.classList.add('is-visible');
        }
      });
    }, 2000);
  }

  // --- Counter animation nos números do hero ---
  var counterEls = document.querySelectorAll('[data-count]');
  if (counterEls.length && 'IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counterEls.forEach(function (el) { counterObserver.observe(el); });
  } else {
    counterEls.forEach(function (el) {
      el.textContent = el.getAttribute('data-count');
    });
  }

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    if (isNaN(target)) return;

    if (prefersReducedMotion) {
      el.textContent = target.toLocaleString('pt-BR');
      return;
    }

    var duration = 1600;
    var start = performance.now();
    var startVal = 0;

    function step(now) {
      var elapsed = now - start;
      var t = Math.min(1, elapsed / duration);
      // easeOutExpo
      var eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      var current = Math.round(startVal + (target - startVal) * eased);
      el.textContent = current.toLocaleString('pt-BR');
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // --- Magnetic buttons (apenas em hover, desktop) ---
  if (!prefersReducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var magnetics = document.querySelectorAll('.magnetic');
    magnetics.forEach(function (el) {
      var rect;
      var rafId;

      el.addEventListener('mouseenter', function () {
        rect = el.getBoundingClientRect();
      });

      el.addEventListener('mousemove', function (e) {
        if (!rect) rect = el.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(function () {
          el.style.transform = 'translate(' + (x * 0.18) + 'px, ' + (y * 0.28) + 'px)';
        });
      });

      el.addEventListener('mouseleave', function () {
        if (rafId) cancelAnimationFrame(rafId);
        el.style.transform = '';
        rect = null;
      });
    });
  }

  // --- Tilt 3D nos collection cards ---
  if (!prefersReducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var tiltEls = document.querySelectorAll('.tilt');
    tiltEls.forEach(function (el) {
      var rect;
      var rafId;

      el.addEventListener('mouseenter', function () {
        rect = el.getBoundingClientRect();
        el.style.transition = 'box-shadow .6s var(--ease-out)';
      });

      el.addEventListener('mousemove', function (e) {
        if (!rect) rect = el.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(function () {
          el.style.transform =
            'perspective(1000px) ' +
            'rotateY(' + (x * 5) + 'deg) ' +
            'rotateX(' + (-y * 5) + 'deg) ' +
            'translateY(-4px)';
        });
      });

      el.addEventListener('mouseleave', function () {
        if (rafId) cancelAnimationFrame(rafId);
        el.style.transition = 'transform .8s var(--ease-out), box-shadow .6s var(--ease-out)';
        el.style.transform = '';
        setTimeout(function () { el.style.transition = ''; }, 820);
        rect = null;
      });
    });
  }

  // --- Parallax leve em imagens ---
  var parallaxEls = [];
  document.querySelectorAll('[data-parallax]').forEach(function (el) {
    parallaxEls.push({
      el: el,
      speed: parseFloat(el.getAttribute('data-parallax')) || 0.1
    });
  });

  function updateParallax(scrollY) {
    if (!parallaxEls.length) return;
    var vh = window.innerHeight;
    parallaxEls.forEach(function (item) {
      var rect = item.el.getBoundingClientRect();
      // só calcula quando está perto da viewport
      if (rect.bottom < -200 || rect.top > vh + 200) return;
      var center = rect.top + rect.height / 2 - vh / 2;
      var offset = -center * item.speed;
      item.el.style.transform = 'translate3d(0, ' + offset.toFixed(1) + 'px, 0)';
    });
  }

  // --- Smooth scroll customizado pros âncoras (com offset do header) ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = anchor.getAttribute('href');
      if (!href || href === '#' || href.length < 2) return;
      var target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      var headerOffset = (header ? header.offsetHeight : 0) - 4;
      var elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - headerOffset,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    });
  });

})();
