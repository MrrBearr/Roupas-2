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

  // --- Header inteligente (hide on scroll down, show on scroll up) + scroll progress bar ---
  var header = document.querySelector('.site-header');
  var progressEl = document.getElementById('scrollProgress');
  var ticking = false;
  var lastY = 0;
  var scrollDir = 'up';
  var scrollAccum = 0; // soma a distancia continua na mesma direcao

  function updateScroll() {
    var y = window.scrollY || window.pageYOffset;
    var delta = y - lastY;

    if (header) {
      header.classList.toggle('is-scrolled', y > 8);

      // Hide on scroll down (somente apos passar o hero), show on scroll up
      var newDir = delta > 0 ? 'down' : 'up';
      if (newDir !== scrollDir) {
        scrollDir = newDir;
        scrollAccum = 0;
      }
      scrollAccum += Math.abs(delta);

      if (y > 240 && scrollDir === 'down' && scrollAccum > 60) {
        header.classList.add('is-hidden');
      } else if (scrollDir === 'up' && scrollAccum > 30) {
        header.classList.remove('is-hidden');
      }
    }

    if (progressEl) {
      var docH = document.documentElement.scrollHeight - window.innerHeight;
      var p = docH > 0 ? Math.min(1, Math.max(0, y / docH)) : 0;
      progressEl.style.setProperty('--p', (p * 100).toFixed(2) + '%');
    }

    // Parallax leve
    if (!prefersReducedMotion) updateParallax(y);

    lastY = y;
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

    var duration = 2400;
    var start = performance.now();
    var startVal = 0;

    function step(now) {
      var elapsed = now - start;
      var t = Math.min(1, elapsed / duration);
      // easeOutQuint - mais suave que easeOutExpo
      var eased = 1 - Math.pow(1 - t, 5);
      var current = Math.round(startVal + (target - startVal) * eased);
      el.textContent = current.toLocaleString('pt-BR');
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // --- Magnetic buttons com LERP (interpolacao suave, com inercia) ---
  if (!prefersReducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var magnetics = document.querySelectorAll('.magnetic');
    magnetics.forEach(function (el) {
      var state = { rect: null, tx: 0, ty: 0, cx: 0, cy: 0, raf: null, active: false };

      var loop = function () {
        // Lerp: aproxima current ao target com fator 0.12 (quanto menor, mais suave)
        state.cx += (state.tx - state.cx) * 0.18;
        state.cy += (state.ty - state.cy) * 0.18;
        el.style.transform = 'translate3d(' + state.cx.toFixed(2) + 'px, ' + state.cy.toFixed(2) + 'px, 0)';

        var dx = Math.abs(state.tx - state.cx);
        var dy = Math.abs(state.ty - state.cy);
        if (state.active || dx > 0.2 || dy > 0.2) {
          state.raf = requestAnimationFrame(loop);
        } else {
          state.raf = null;
          el.style.transform = '';
        }
      };

      el.addEventListener('mouseenter', function () {
        state.rect = el.getBoundingClientRect();
        state.active = true;
        if (!state.raf) state.raf = requestAnimationFrame(loop);
      });

      el.addEventListener('mousemove', function (e) {
        if (!state.rect) state.rect = el.getBoundingClientRect();
        state.tx = (e.clientX - state.rect.left - state.rect.width / 2) * 0.22;
        state.ty = (e.clientY - state.rect.top - state.rect.height / 2) * 0.32;
      });

      el.addEventListener('mouseleave', function () {
        state.active = false;
        state.tx = 0;
        state.ty = 0;
        state.rect = null;
        if (!state.raf) state.raf = requestAnimationFrame(loop);
      });
    });
  }

  // --- Tilt 3D com LERP nos collection cards ---
  if (!prefersReducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var tiltEls = document.querySelectorAll('.tilt');
    tiltEls.forEach(function (el) {
      var state = { rect: null, tx: 0, ty: 0, cx: 0, cy: 0, raf: null, active: false };

      var loop = function () {
        state.cx += (state.tx - state.cx) * 0.10; // lerp mais suave que magnetic
        state.cy += (state.ty - state.cy) * 0.10;

        var lift = state.active ? -4 : 0;
        el.style.transform =
          'perspective(1100px) ' +
          'rotateY(' + state.cx.toFixed(2) + 'deg) ' +
          'rotateX(' + (-state.cy).toFixed(2) + 'deg) ' +
          'translateY(' + lift + 'px)';

        var dx = Math.abs(state.tx - state.cx);
        var dy = Math.abs(state.ty - state.cy);
        if (state.active || dx > 0.05 || dy > 0.05) {
          state.raf = requestAnimationFrame(loop);
        } else {
          state.raf = null;
          el.style.transform = '';
        }
      };

      el.addEventListener('mouseenter', function () {
        state.rect = el.getBoundingClientRect();
        state.active = true;
        if (!state.raf) state.raf = requestAnimationFrame(loop);
      });

      el.addEventListener('mousemove', function (e) {
        if (!state.rect) state.rect = el.getBoundingClientRect();
        var nx = (e.clientX - state.rect.left) / state.rect.width - 0.5;
        var ny = (e.clientY - state.rect.top) / state.rect.height - 0.5;
        state.tx = nx * 6;  // graus
        state.ty = ny * 6;
      });

      el.addEventListener('mouseleave', function () {
        state.active = false;
        state.tx = 0;
        state.ty = 0;
        state.rect = null;
        if (!state.raf) state.raf = requestAnimationFrame(loop);
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

  // --- Smooth scroll customizado pros âncoras com easing cinematografico ---
  // Em vez de usar 'smooth' nativo (varia muito entre navegadores), faz a
  // animacao manualmente com easeInOutCubic: comeca lento, acelera, desacelera.
  function smoothScrollTo(targetY, duration) {
    duration = duration || 900;
    var startY = window.scrollY || window.pageYOffset;
    var diff = targetY - startY;
    if (Math.abs(diff) < 4) return;
    var start = performance.now();

    function easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function step(now) {
      var elapsed = now - start;
      var t = Math.min(1, elapsed / duration);
      var eased = easeInOutCubic(t);
      window.scrollTo(0, startY + diff * eased);
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = anchor.getAttribute('href');
      if (!href || href === '#' || href.length < 2) return;
      var target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      var headerOffset = (header ? header.offsetHeight : 0) - 4;
      var targetY = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;

      if (prefersReducedMotion) {
        window.scrollTo(0, targetY);
      } else {
        // duration proporcional a distancia (max 1300ms, min 600ms)
        var dist = Math.abs(targetY - (window.scrollY || 0));
        var dur = Math.max(600, Math.min(1300, dist * 0.8));
        smoothScrollTo(targetY, dur);
      }
    });
  });

})();
