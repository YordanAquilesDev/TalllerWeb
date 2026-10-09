/* ============================================================
   GRANJA POLLÓN — index.js
   Interacciones de la landing (menú, reveal, contadores, etc.)
   ============================================================ */
(function () {
  'use strict';

  /* ---------- menú móvil ---------- */
  const toggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('nav-menu');

  toggle.addEventListener('click', () => {
    nav.classList.toggle('activo');
    const abierto = nav.classList.contains('activo');
    toggle.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
  });

  nav.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => nav.classList.remove('activo'))
  );

  /* ---------- sombra del header al hacer scroll ---------- */
  const header = document.querySelector('.header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 10);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- reveal on scroll ---------- */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger')
    .forEach(el => observer.observe(el));

  /* ---------- contadores animados ---------- */
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.target, 10);
      const dur = 1600;
      const start = performance.now();

      const tick = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased);
        if (p < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.6 });

  document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

  /* ---------- marquee: duplicar contenido para loop infinito ---------- */
  const track = document.getElementById('marquee-track');
  if (track) track.innerHTML += track.innerHTML;

  /* ---------- FAQ: cerrar las demás al abrir una ---------- */
  document.querySelectorAll('.item-faq').forEach(d => {
    d.addEventListener('toggle', () => {
      if (d.open) {
        document.querySelectorAll('.item-faq[open]').forEach(o => {
          if (o !== d) o.open = false;
        });
      }
    });
  });

  /* ---------- parallax suave en decoraciones del hero ---------- */
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.addEventListener('mousemove', (ev) => {
      const r = hero.getBoundingClientRect();
      const x = (ev.clientX - r.left) / r.width - 0.5;
      const y = (ev.clientY - r.top) / r.height - 0.5;
      hero.querySelectorAll('.hero-deco').forEach((el, i) => {
        const f = (i + 1) * 10;
        el.style.translate = `${x * f}px ${y * f}px`;
      });
    });
  }
})();
