// ============================================================
// Marcela Modas — script.js
// Pequenas interações: menu mobile, ano do footer, FAQ exclusivo,
// fechamento do menu ao navegar.
// ============================================================

(function () {
  'use strict';

  var demoWhatsApp = 'https://wa.me/5583921483515?text=' + encodeURIComponent('Olá, Caio! Vi a demonstração da Marcela Modas e quero conversar sobre um site para o meu negócio.');
  document.querySelectorAll('a[href*="wa.me/"]').forEach(function (link) {
    link.href = demoWhatsApp;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  });

  // --- Ano dinâmico no footer ---
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // --- Menu mobile ---
  var toggle = document.getElementById('menuToggle');
  var nav = document.getElementById('navMobile');

  if (toggle && nav) {
    var closeMenu = function () {
      nav.classList.remove('is-open');
      nav.setAttribute('aria-hidden', 'true');
      nav.setAttribute('inert', '');
      toggle.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Abrir menu');
      document.body.style.overflow = '';
    };

    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      toggle.classList.toggle('is-open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      toggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
      nav.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
      if (isOpen) nav.removeAttribute('inert');
      else nav.setAttribute('inert', '');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Fecha o menu ao clicar em um link
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        closeMenu();
      });
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        closeMenu();
        toggle.focus();
      }
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

  // --- Header sutil ao rolar (sombra leve quando saiu do topo) ---
  var header = document.querySelector('.site-header');
  if (header) {
    var setScrolled = function () {
      if (window.scrollY > 8) header.style.boxShadow = '0 4px 18px rgba(28,26,23,.06)';
      else header.style.boxShadow = 'none';
    };
    setScrolled();
    window.addEventListener('scroll', setScrolled, { passive: true });
  }

})();
