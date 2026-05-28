// ============================================================
// Marcela Modas — script.js
// Pequenas interações: menu mobile, ano do footer, FAQ exclusivo,
// fechamento do menu ao navegar.
// ============================================================

(function () {
  'use strict';

  // --- Ano dinâmico no footer ---
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // --- Menu mobile ---
  var toggle = document.getElementById('menuToggle');
  var nav = document.getElementById('navMobile');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      toggle.classList.toggle('is-open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Fecha o menu ao clicar em um link
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
