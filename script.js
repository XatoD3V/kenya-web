/* =========================================================
   SNACK CHEPEN - ONLINE
   Script opcional: mejora la navegación.
   ========================================================= */
(function () {
  'use strict';

  /* 1. Sombra en la barra de navegación al hacer scroll */
  const nav = document.getElementById('nav');

  function onScroll() {
    if (window.scrollY > 10) {
      nav.classList.add('is-scrolled');
    } else {
      nav.classList.remove('is-scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* 2. Desplazamiento suave para enlaces internos (#carta, #video) */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const targetId = link.getAttribute('href');
      if (targetId.length < 2) return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();